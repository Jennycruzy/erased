import XCTest
@testable import Erased

/// The iPhone reads replies exactly like the extension and the Android app: same rules, same hand labels (evals/replies.json).
final class CoachParityTests: XCTestCase {
    private static let repo = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent()
    private let coach = try! Coach(json: Data(contentsOf: repo.appending(path: "android/app/src/main/assets/coach.json")))

    func testRulesMatchEveryHandLabel() throws {
        let data = try Data(contentsOf: Self.repo.appending(path: "evals/replies.json"))
        let set = try XCTUnwrap(JSONSerialization.jsonObject(with: data) as? [[String: Any]])
        XCTAssertGreaterThanOrEqual(set.count, 66)
        let wrong = set.compactMap { e -> String? in
            let got = coach.byRules(e["text"] as? String ?? "").ask
            let want = e["label"] as? String ?? ""
            return got == want ? nil : "\(e["id"] ?? "?") \(e["company"] ?? ""): \(want) -> \(got)"
        }
        XCTAssertEqual(wrong.count, 0, "rules differ from the hand labels:\n" + wrong.joined(separator: "\n"))
    }

    func testAnswersAreFilledIn() throws {
        let a = try XCTUnwrap(coach.advice(law: "ndpa", ask: "confirm_sender", fill: ["company": "Vimeo", "email": "me@example.com", "name": "Ada", "subject": "Re: Request", "ref": "ER-AAAAA", "to": "privacy@vimeo.com", "domain": "vimeo.com"]))
        XCTAssertEqual(a.headline, "Vimeo wants to know the request really comes from you")
        XCTAssertTrue(a.action.body?.contains("Section 34(1) of the Nigeria Data Protection Act 2023") == true)
        XCTAssertFalse(a.action.body?.contains("{") == true)
    }

    func testModelOnlyWhenRulesFindNothing() {
        XCTAssertEqual(coach.decide(rules: .init(ask: "use_form", quote: "Please complete our form."), model: .init(ask: "clarify", quote: "x")).1, "rules")
        XCTAssertEqual(coach.decide(rules: .init(ask: "wait", quote: "Thanks."), model: .init(ask: "clarify", quote: "What should we delete?")).1, "model")
        XCTAssertEqual(coach.decide(rules: .init(ask: "wait", quote: "Thanks."), model: .init(ask: "clarify", quote: "")).1, "rules")
    }

    func testSentencesNumberLikeTheExtension() {
        XCTAssertEqual(Reader.sentencesOf("Hi there.\nPlease confirm you want this. Thanks!"), ["Hi there.", "Please confirm you want this.", "Thanks!"])
    }
}
