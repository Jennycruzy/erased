import XCTest
import FoundationModels
import FirebaseAILogic
@testable import Erased

/// Reads every hand-labelled reply (evals/replies.json) with Apple's on-device model only, through Firebase AI Logic,
/// and writes what it said, which model answered and how long it took. Prints one "ERASED eval" line per reply.
final class OnDeviceEvalTests: XCTestCase {
    private static let repo = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent()

    func testReadsEveryLabelledReplyOnDevice() async throws {
        print("ERASED eval: availability \(Reader.status())")
        try XCTSkipUnless(SystemLanguageModel.default.isAvailable, "Apple's on-device model is not available here")
        let coach = try Coach(json: Data(contentsOf: Self.repo.appending(path: "android/app/src/main/assets/coach.json")))
        let set = try XCTUnwrap(JSONSerialization.jsonObject(with: Data(contentsOf: Self.repo.appending(path: "evals/replies.json"))) as? [[String: Any]])
        let reader = Reader(coach: coach)
        // A virtual Mac can report the model as available while its files are missing: try one reply first.
        let probe = await reader.read(from: "privacy@example.com", subject: "Re: request", body: "Thank you for your request. We have received it.", whereTo: .deviceOnly)
        try XCTSkipIf(!probe.onDevice, "Apple's on-device model did not answer here: \(probe.error.map { String($0.prefix(120)) } ?? probe.source)")
        var alone = 0, mix = 0, onDevice = 0
        var rows: [[String: Any]] = []
        for e in set {
            let text = e["text"] as? String ?? "", label = e["label"] as? String ?? ""
            let r = await reader.read(from: e["from"] as? String ?? "", subject: e["subject"] as? String ?? "", body: text, whereTo: .deviceOnly)
            let (final, by) = coach.decide(rules: coach.byRules(text), model: r.found)
            if r.found?.ask == label { alone += 1 }
            if final.ask == label { mix += 1 }
            if r.onDevice { onDevice += 1 }
            rows.append(["id": e["id"] ?? 0, "label": label, "model": r.found?.ask ?? NSNull(), "final": final.ask, "by": by, "source": r.source, "ms": r.ms, "error": r.error ?? NSNull()])
            print("ERASED eval \(e["id"] ?? 0): label=\(label) model=\(r.found?.ask ?? "-") final=\(final.ask) source=\(r.source) ms=\(r.ms)\(r.error.map { " error=\($0.prefix(160))" } ?? "")")
        }
        let summary: [String: Any] = ["n": set.count, "modelAlone": alone, "rulesThenModel": mix, "answeredOnDevice": onDevice, "rows": rows]
        let out = URL(fileURLWithPath: NSTemporaryDirectory()).appending(path: "ios-eval.json")
        try JSONSerialization.data(withJSONObject: summary, options: [.prettyPrinted]).write(to: out)
        print("ERASED eval: n=\(set.count) modelAlone=\(alone) rulesThenModel=\(mix) answeredOnDevice=\(onDevice)")
        XCTAssertGreaterThan(onDevice, 0, "no reply was answered on the device")
    }
}
