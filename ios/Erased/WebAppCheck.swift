import Foundation
import WebKit
import UIKit
import FirebaseCore
import FirebaseAppCheck

/// The page that hands a fresh App Check token to the apps (same as APPCHECK_BRIDGE_URL in src/ai/firebase-config.ts).
let appCheckBridgeURL = URL(string: "https://forget-me-hybrid.web.app/appcheck.html")!

/// App Check for a build installed without the App Store (so App Attest cannot vouch for it): a hidden web view opens
/// the Erased website's /appcheck.html, which passes reCAPTCHA Enterprise and returns an App Check token for this
/// Firebase project. Only that page is ever loaded, and only the token comes back.
final class WebAppCheckProvider: NSObject, AppCheckProvider, WKScriptMessageHandler, WKNavigationDelegate, @unchecked Sendable {
    private var web: WKWebView?
    private var pending: ((AppCheckToken?, Error?) -> Void)?
    private var lastPageError = ""

    func getToken(completion handler: @escaping (AppCheckToken?, Error?) -> Void) {
        DispatchQueue.main.async {
            if let earlier = self.pending { earlier(nil, Self.error("a newer request replaced this one")) }
            self.pending = handler
            let config = WKWebViewConfiguration()
            config.userContentController.add(self, name: "erased")
            // The page's own errors, so a failure says why.
            config.userContentController.add(self, name: "erasedlog")
            config.userContentController.addUserScript(WKUserScript(source: "addEventListener('error', e => webkit.messageHandlers.erasedlog.postMessage(String(e.message))); addEventListener('unhandledrejection', e => webkit.messageHandlers.erasedlog.postMessage(String(e.reason)));", injectionTime: .atDocumentStart, forMainFrameOnly: true))
            // A web view that is not in a window (or has no size) may never run reCAPTCHA: keep it 1 pt and invisible.
            let web = WKWebView(frame: CGRect(x: 0, y: 0, width: 1, height: 1), configuration: config)
            web.alpha = 0.01
            web.isUserInteractionEnabled = false
            let window = UIApplication.shared.connectedScenes.compactMap { ($0 as? UIWindowScene)?.keyWindow }.first
            window?.addSubview(web)
            web.navigationDelegate = self
            self.web = web
            web.load(URLRequest(url: appCheckBridgeURL))
            DispatchQueue.main.asyncAfter(deadline: .now() + 25) { self.finish(nil, Self.error("no token from the website in 25 s" + (self.lastPageError.isEmpty ? "" : " (page: \(self.lastPageError))"))) }
        }
    }

    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "erasedlog" { lastPageError = "\(message.body)"; return }
        guard let json = (message.body as? String)?.data(using: .utf8),
              let m = try? JSONSerialization.jsonObject(with: json) as? [String: Any] else { return finish(nil, Self.error("unreadable answer")) }
        if let t = m["token"] as? String, !t.isEmpty {
            let ms = (m["expireTimeMillis"] as? Double) ?? (Date().timeIntervalSince1970 + 1800) * 1000
            finish(AppCheckToken(token: t, expirationDate: Date(timeIntervalSince1970: ms / 1000)), nil)
        } else {
            finish(nil, Self.error(m["error"] as? String ?? "no token"))
        }
    }

    /// Stay on the bridge page; nothing else may load in this web view.
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping @MainActor (WKNavigationActionPolicy) -> Void) {
        decisionHandler(action.request.url?.host == appCheckBridgeURL.host || action.targetFrame?.isMainFrame == false ? .allow : .cancel)
    }

    private func finish(_ token: AppCheckToken?, _ error: Error?) {
        guard let h = pending else { return }
        pending = nil
        web?.configuration.userContentController.removeScriptMessageHandler(forName: "erased")
        web?.configuration.userContentController.removeScriptMessageHandler(forName: "erasedlog")
        web?.stopLoading()
        web?.removeFromSuperview()
        web = nil
        h(token, error)
    }

    private static func error(_ s: String) -> NSError { NSError(domain: "Erased.AppCheck", code: 1, userInfo: [NSLocalizedDescriptionKey: "App Check: \(s)"]) }
}

final class WebAppCheckProviderFactory: NSObject, AppCheckProviderFactory {
    func createProvider(with app: FirebaseApp) -> (any AppCheckProvider)? { WebAppCheckProvider() }
}
