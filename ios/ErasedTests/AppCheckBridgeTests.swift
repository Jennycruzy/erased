import XCTest
import FirebaseAppCheck
@testable import Erased

/// The app's own App Check route: a hidden web view opens the website's /appcheck.html and gets a reCAPTCHA
/// Enterprise-backed token for this Firebase project.
final class AppCheckBridgeTests: XCTestCase {
    func testTokenFromWebsite() {
        let done = expectation(description: "token")
        let provider = WebAppCheckProvider()
        let t0 = Date()
        provider.getToken { token, error in
            XCTAssertNil(error, "App Check: \(error?.localizedDescription ?? "")")
            XCTAssertGreaterThan(token?.token.count ?? 0, 100)
            if let t = token { print("ERASED appcheck: token ok, \(t.token.count) chars, valid \(Int(t.expirationDate.timeIntervalSinceNow / 60)) min, \(Int(Date().timeIntervalSince(t0) * 1000)) ms") }
            done.fulfill()
        }
        wait(for: [done], timeout: 40)
    }
}
