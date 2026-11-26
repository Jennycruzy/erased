import Foundation
import FirebaseAILogic
import FoundationModels

/// What the model may answer: one ask from the fixed list, and the NUMBER of the sentence that shows it.
@Generable(description: "What a company's reply to a data deletion request asks the person to do")
struct AskAnswer {
    @Guide(description: "One of: wait, scheduled, no_account, verify_link, go_ahead, confirm_sender, clarify, provide_info, use_form, log_in_delete")
    var ask: String
    @Guide(description: "Number of the one sentence that shows the answer", .minimum(1))
    var proof: Int
}

enum Where { case deviceOnly, cloudAllowed }

struct Read: Sendable {
    let found: Coach.Found?
    /// "apple-foundation-models-system-language-model" when Apple's on-device model answered, else the Gemini model name.
    let source: String
    let ms: Int
    var error: String? = nil
    var onDevice: Bool { source == Reader.onDeviceName }
}

/// Reads a pasted reply with Firebase AI Logic hybrid inference. Your mail stays on the iPhone (Apple's
/// on-device Foundation Model only) unless you choose to let Gemini in the cloud read this one email when
/// this iPhone has no Apple Intelligence.
struct Reader: Sendable {
    static let cloudModel = "gemini-3.5-flash-lite"
    static let onDeviceName = "apple-foundation-models-system-language-model"
    /// Apple's on-device limit is 4,096 tokens per request.
    static let maxChars = 9000

    let coach: Coach

    private func session(_ whereTo: Where) -> GenerativeModelSession {
        let ai = FirebaseAI.firebaseAI(backend: .googleAI())
        let system = FirebaseAI.SystemLanguageModel.default
        switch whereTo {
        // One fresh session per email: single turn, no history, like the extension and the Android app.
        case .deviceOnly: return ai.generativeModelSession(model: system)
        case .cloudAllowed:
            // Apple's model first; Gemini only when this iPhone cannot run it.
            return ai.generativeModelSession(model: HybridModel(primary: system, secondary: ai.geminiModel(name: Reader.cloudModel)))
        }
    }

    /// Same splitting and numbering as src/core/sentences.ts.
    static func sentencesOf(_ text: String, max: Int = 80) -> [String] {
        let re = try! NSRegularExpression(pattern: ".+?(?:[.!?]+[\"')\\]]*(?=\\s|$)|$)")
        var out: [String] = []
        let lines = text.replacingOccurrences(of: "\r", with: "").components(separatedBy: "\n")
            .map { $0.replacingOccurrences(of: "\\s+", with: " ", options: .regularExpression).trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
        for line in lines {
            for m in re.matches(in: line, range: NSRange(line.startIndex..., in: line)) {
                guard let r = Range(m.range, in: line) else { continue }
                let t = line[r].trimmingCharacters(in: .whitespaces)
                if t.count >= 2 { out.append(t) }
                if out.count >= max { return out }
            }
        }
        return out
    }

    func read(from: String, subject: String, body: String, whereTo: Where) async -> Read {
        let sents = Reader.sentencesOf(String(body.prefix(Reader.maxChars)))
        let prompt = "\(coach.prompt)\n\nFrom: \(from)\nSubject: \(subject)\n\n" + sents.enumerated().map { "[\($0.offset + 1)] \($0.element)" }.joined(separator: "\n")
        let t0 = Date()
        let ms = { Int(Date().timeIntervalSince(t0) * 1000) }
        do {
            let r = try await session(whereTo).respond(to: prompt, generating: AskAnswer.self)
            let a = r.content
            let quote = (a.proof >= 1 && a.proof <= sents.count) ? sents[a.proof - 1] : ""
            let found = coach.asks.contains(a.ask) ? Coach.Found(ask: a.ask, quote: body.contains(quote) ? quote : "") : nil
            return Read(found: found, source: r.rawResponse.modelVersion, ms: ms())
        } catch {
            return Read(found: nil, source: "error", ms: ms(), error: String(String(describing: error).prefix(300)))
        }
    }

    /// What the screen says about Apple's on-device model on this iPhone.
    static func status() -> String {
        switch FirebaseAI.SystemLanguageModel.default.availability {
        case .available: return "ready"
        case .unavailable(.deviceNotEligible): return "this iPhone cannot run it"
        case .unavailable(.appleIntelligenceNotEnabled): return "turn on Apple Intelligence in Settings"
        case .unavailable(.modelNotReady): return "still downloading"
        case .unavailable: return "not available"
        }
    }
}
