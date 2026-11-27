import XCTest
@testable import Erased

/// Remote Config's cloud_models is checked the same way as in the extension (src/ai/remote.ts).
final class CloudModelsTests: XCTestCase {
    func testAcceptsAShortListOfGeminiNames() {
        XCTAssertEqual(CloudModels.parse("[\"gemini-3.5-flash-lite\",\"gemini-3.5-flash\"]"), ["gemini-3.5-flash-lite", "gemini-3.5-flash"])
    }

    func testRejectsAnythingElse() {
        for raw in ["", "gemini-3.5-flash", "[]", "[\"gpt-5\"]", "[\"gemini-3.5-flash\", 3]", "[\"gemini-a\",\"gemini-b\",\"gemini-c\",\"gemini-d\",\"gemini-e\"]", "{"] {
            XCTAssertNil(CloudModels.parse(raw), raw)
        }
    }

    func testMovesOnOnlyWhenBusy() {
        XCTAssertTrue(CloudModels.busy(NSError(domain: "x", code: 0, userInfo: [NSLocalizedDescriptionKey: "[429 Too Many Requests] RESOURCE_EXHAUSTED"])))
        XCTAssertFalse(CloudModels.busy(NSError(domain: "x", code: 0, userInfo: [NSLocalizedDescriptionKey: "400 invalid argument"])))
    }

    func testStartsFromTheShippedOrder() { XCTAssertEqual(CloudModels.current, CloudModels.defaults) }
}
