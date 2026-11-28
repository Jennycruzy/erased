import Foundation
import FirebaseAILogic
import FoundationModels
import FirebaseRemoteConfig
import os

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
    static let onDeviceName = "apple-foundation-models-system-language-model"
    /// Apple's on-device limit is 4,096 tokens per request.
    static let maxChars = 9000

    let coach: Coach

    /// Firebase AI Logic hybrid inference on iOS (Firebase 13): Apple's Foundation Models session runs Apple's on-device
    /// model when this iPhone has it; Gemini through Firebase AI Logic (`geminiLanguageModel`) runs in the same kind of
    /// session only when the person allows the cloud for this one email and the iPhone cannot run Apple's model. The cloud
    /// models come in Remote Config's order (cloud_models), the next one used when one is out of quota.
    /// One fresh session per email: single turn, no history, like the extension and the Android app.
    private func sessions(_ whereTo: Where) -> [(LanguageModelSession, String)] {
        if case .available = SystemLanguageModel.default.availability {
            return [(LanguageModelSession(model: SystemLanguageModel.default), Reader.onDeviceName)]
        }
        guard case .cloudAllowed = whereTo else { return [] }
        // Gemini as a Foundation Models session arrived with iOS 27; on iOS 26 the iPhone reads on the device only.
        guard #available(iOS 27.0, *) else { return [] }
        let ai = FirebaseAI.firebaseAI(backend: .googleAI())
        return CloudModels.current.map { (LanguageModelSession(model: ai.geminiLanguageModel(name: $0)), $0) }
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
        let picked = sessions(whereTo)
        guard !picked.isEmpty else {
            return Read(found: nil, source: "none", ms: 0, error: "Apple's on-device model is not available on this iPhone, and the cloud is off")
        }
        var source = picked[0].1
        do {
            var answer: AskAnswer?
            for (i, (modelSession, name)) in picked.enumerated() {
                do { answer = try await modelSession.respond(to: prompt, generating: AskAnswer.self).content; source = name; break }
                catch { if !CloudModels.busy(error) || i == picked.count - 1 { throw error } }
            }
            guard let a = answer else { throw CancellationError() }
            let quote = (a.proof >= 1 && a.proof <= sents.count) ? sents[a.proof - 1] : ""
            let found = coach.asks.contains(a.ask) ? Coach.Found(ask: a.ask, quote: body.contains(quote) ? quote : "") : nil
            return Read(found: found, source: source, ms: ms())
        } catch {
            return Read(found: nil, source: "error", ms: ms(), error: String(String(describing: error).prefix(300)))
        }
    }

    /// What the screen says about Apple's on-device model on this iPhone.
    static func status() -> String {
        switch SystemLanguageModel.default.availability {
        case .available: return "ready"
        case .unavailable(.deviceNotEligible): return "this iPhone cannot run it"
        case .unavailable(.appleIntelligenceNotEnabled): return "turn on Apple Intelligence in Settings"
        case .unavailable(.modelNotReady): return "still downloading"
        case .unavailable: return "not available"
        }
    }
}

/// Cloud models in order. Remote Config (cloud_models) can change them; without a network the defaults stay.
enum CloudModels {
    static let defaults = ["gemini-3.5-flash-lite", "gemini-3.5-flash"]
    private static let list = OSAllocatedUnfairLock(initialState: defaults)
    static var current: [String] { list.withLock { $0 } }

    /// Reads cloud_models: a JSON list of one to four Gemini model names. Anything else gives nil.
    static func parse(_ raw: String) -> [String]? {
        guard let data = raw.data(using: .utf8), let v = try? JSONSerialization.jsonObject(with: data) as? [Any],
              (1...4).contains(v.count) else { return nil }
        let names = v.compactMap { $0 as? String }.filter { $0.range(of: "^gemini-[a-z0-9.-]{1,40}$", options: .regularExpression) != nil }
        return names.count == v.count ? names : nil
    }

    /// True when a cloud call failed because that model is out of quota or overloaded.
    static func busy(_ e: Error) -> Bool {
        String(describing: e).range(of: "\\b429\\b|quota|RESOURCE_EXHAUSTED|\\b503\\b|overloaded", options: [.regularExpression, .caseInsensitive]) != nil
    }

    static func load() async {
        let rc = RemoteConfig.remoteConfig()
        rc.setDefaults(["cloud_models": "[\"gemini-3.5-flash-lite\",\"gemini-3.5-flash\"]" as NSString])
        _ = try? await rc.fetchAndActivate()
        if let l = parse(rc.configValue(forKey: "cloud_models").stringValue) { list.withLock { $0 = l } }
    }
}
