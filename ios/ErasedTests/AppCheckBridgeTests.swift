import XCTest
import FirebaseAppCheck
@testable import Erased

/// The app's own App Check route: a hidden web view opens the website's /appcheck.html and gets a reCAPTCHA
/// Enterprise-backed token for this Firebase project.
final class AppCheckBridgeTests: XCTestCase {
    func testTokenFromWebsite() throws {
        let done = expectation(description: "token")
        let provider = WebAppCheckProvider()
        let t0 = Date()
        var got: AppCheckToken?, failure: Error?
        provider.getToken { token, error in got = token; failure = error; done.fulfill() }
        wait(for: [done], timeout: 40)
        let message = failure?.localizedDescription ?? ""
        // Shared CI machines sometimes get a reCAPTCHA score below the project's bar: that is a verdict, not a fault.
        try XCTSkipIf(message.contains("403"), "reCAPTCHA scored this CI machine below the bar: \(message)")
        XCTAssertNil(failure, "App Check: \(message)")
        XCTAssertGreaterThan(got?.token.count ?? 0, 100)
        if let t = got { print("ERASED appcheck: token ok, \(t.token.count) chars, valid \(Int(t.expirationDate.timeIntervalSinceNow / 60)) min, \(Int(Date().timeIntervalSince(t0) * 1000)) ms") }
    }
}
