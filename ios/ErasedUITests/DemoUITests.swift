import XCTest

/// Drives the app like a person, for the recorded demo: one real reply, read, answer shown.
final class DemoUITests: XCTestCase {
    func testReadARealReply() throws {
        let app = XCUIApplication()
        app.launch()
        sleep(2)
        app.buttons["Substack"].tap()
        sleep(1)
        // This simulator cannot run Apple's on-device model, so allow Gemini in the cloud for this one email.
        let toggle = app.switches.firstMatch
        if toggle.exists, (toggle.value as? String) == "0" { toggle.switches.firstMatch.tap() }
        sleep(1)
        app.buttons["read"].tap()
        let source = app.staticTexts["source"]
        XCTAssertTrue(source.waitForExistence(timeout: 60), "no answer within 60 s")
        print("ERASED ui: \(source.label) | \(app.staticTexts["headline"].label)")
        sleep(4)
        app.swipeUp()
        sleep(3)
    }

    /// On a real iPhone: reads one real reply with the cloud left off, so the answer can only come from Apple's
    /// on-device model (or, without Apple Intelligence, from the known phrases). Prints where it was read.
    func testReadOnDeviceOnly() throws {
        let app = XCUIApplication()
        app.launch()
        sleep(3)
        app.buttons["Substack"].tap()
        sleep(2)
        app.buttons["read"].tap()
        let source = app.staticTexts["source"]
        XCTAssertTrue(source.waitForExistence(timeout: 90), "no answer within 90 s")
        print("ERASED device: \(source.label) | \(app.staticTexts["headline"].label)")
        sleep(5)
        app.swipeUp()
        sleep(4)
    }
}
