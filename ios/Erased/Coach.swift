import Foundation

/// Reply Coach on the iPhone. Everything comes from coach.json, generated from the same TypeScript the
/// Chrome extension ships (scripts/android-coach.ts): the phrase rules, the prompt and every answer.
/// The model only points at WHAT was asked; the answers are fixed text.
/// Immutable after init, so it is safe to share across tasks.
struct Coach: @unchecked Sendable {
    struct Found: Equatable, Sendable { let ask: String; let quote: String }
    struct Action { let type: String; let label: String; let subject: String?; let body: String? }
    struct Advice { let ask: String; let headline: String; let why: String; let legal: [String]; let action: Action }

    let asks: [String]
    let noStep: Set<String>
    let prompt: String
    private let rules: [(ask: String, re: NSRegularExpression)]
    private let advice: [String: [String: [String: Any]]]

    init(json: Data) throws {
        guard let root = try JSONSerialization.jsonObject(with: json) as? [String: Any] else { throw CocoaError(.coderReadCorrupt) }
        asks = root["asks"] as? [String] ?? []
        noStep = Set(root["noStep"] as? [String] ?? [])
        prompt = root["prompt"] as? String ?? ""
        rules = try (root["rules"] as? [[String: String]] ?? []).map {
            ($0["ask"] ?? "", try NSRegularExpression(pattern: $0["pattern"] ?? "", options: [.caseInsensitive]))
        }
        advice = root["advice"] as? [String: [String: [String: Any]]] ?? [:]
    }

    static func bundled() throws -> Coach {
        guard let url = Bundle.main.url(forResource: "coach", withExtension: "json") else { throw CocoaError(.fileNoSuchFile) }
        return try Coach(json: Data(contentsOf: url))
    }

    /// Same splitting as sentencesWithin() in src/core/coach.ts.
    static func sentencesWithin(_ text: String) -> [String] {
        let joined = sub(text, "\\s*\\n+\\s*", "\n")
        // NSRegularExpression (ICU) has the look-behind the JavaScript split uses.
        return sub(joined, "(?<=[.!?])\\s+|\\n", "\u{0}").split(separator: "\u{0}", omittingEmptySubsequences: false)
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { $0.count > 3 }
    }

    static func sub(_ s: String, _ pattern: String, _ with: String) -> String {
        let re = try! NSRegularExpression(pattern: pattern)
        return re.stringByReplacingMatches(in: s, range: NSRange(s.startIndex..., in: s), withTemplate: NSRegularExpression.escapedTemplate(for: with))
    }

    private static func has(_ pattern: String, _ s: String) -> Bool {
        s.range(of: pattern, options: [.regularExpression, .caseInsensitive]) != nil
    }

    /// Known phrases, first match wins, with the sentence that shows it. Otherwise "wait".
    func byRules(_ text: String) -> Found {
        let sents = Coach.sentencesWithin(text)
        for (ask, re) in rules {
            if let s = sents.first(where: { re.firstMatch(in: $0, range: NSRange($0.startIndex..., in: $0)) != nil }) { return Found(ask: ask, quote: s) }
        }
        let real = sents.filter {
            Coach.has("[a-z]{3}", $0) && !Coach.has("^[#\\-—_=*\\s]|reply above this line|^(hi|hello|hey)\\b[^.]{0,30}[!,.]?$", $0)
        }
        return Found(ask: "wait", quote: real.first(where: { Coach.has("receiv|got your|thank|review|in touch|case|ticket", $0) }) ?? real.first ?? "")
    }

    /// Rules decide when they know the phrase; the model only when they find nothing, and only with a real quote.
    func decide(rules: Found, model: Found?) -> (Found, String) {
        if rules.ask == "wait", let m = model, m.ask != "wait", !m.quote.trimmingCharacters(in: .whitespaces).isEmpty { return (m, "model") }
        return (rules, "rules")
    }

    func advice(law: String, ask: String, fill: [String: String]) -> Advice? {
        guard let a = advice[law]?[ask], let act = a["action"] as? [String: Any] else { return nil }
        // A request made outside Erased has no reference: drop the empty "[]" and "Reference:" line.
        let f: (String) -> String = { s in
            fill.reduce(s) { $0.replacingOccurrences(of: "{\($1.key)}", with: $1.value) }
                .replacingOccurrences(of: "\\s*\\[\\]", with: "", options: .regularExpression).replacingOccurrences(of: "\nReference: \n", with: "\n")
        }
        let opt: (String) -> String? = { k in (act[k] as? String).flatMap { $0.isEmpty ? nil : f($0) } }
        // Without the request's date the phone cannot name the legal deadline; it says what to do instead.
        let wait = ask == "wait"
        return Advice(
            ask: ask,
            headline: f(a["headline"] as? String ?? ""),
            why: wait ? "They have your request. Nothing is asked of you yet." : f(a["why"] as? String ?? ""),
            legal: (a["legal"] as? [String] ?? []).map(f),
            action: Action(type: act["type"] as? String ?? "", label: wait ? "Nothing to do yet. Wait for their answer." : f(act["label"] as? String ?? ""),
                           subject: opt("subject"), body: opt("body"))
        )
    }
}
