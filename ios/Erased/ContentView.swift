import SwiftUI
import UIKit

/// Laws the letters use; the iPhone picks the same answer text as the extension.
private let laws: [(id: String, label: String)] = [
    ("ndpa", "Nigeria (NDPA 2023)"), ("gdpr", "EU (GDPR)"), ("uk_gdpr", "UK (UK GDPR)"),
    ("ccpa", "California (CCPA)"), ("pipeda", "Canada (PIPEDA)"), ("policy", "Anywhere else"),
]

/// The extension's and website's colours (public/panel.css), light and dark.
private extension Color {
    init(_ light: UInt32, _ dark: UInt32) {
        self.init(UIColor { t in
            let v = t.userInterfaceStyle == .dark ? dark : light
            return UIColor(red: CGFloat((v >> 16) & 0xFF) / 255, green: CGFloat((v >> 8) & 0xFF) / 255, blue: CGFloat(v & 0xFF) / 255, alpha: 1)
        })
    }
    static let ink = Color(0x111418, 0xEEF0F3), muted = Color(0x5F6670, 0x9AA1AB), line = Color(0xE6E8EB, 0x23272E)
    static let chip = Color(0xF3F4F6, 0x1A1D23), green = Color(0x1B7F3B, 0x4ADE80), greenBg = Color(0xE8F5EC, 0x11251A)
    static let amber = Color(0xB45309, 0xF5A524), amberBg = Color(0xFFF4E5, 0x2A2010), page = Color(0xFFFFFF, 0x0F1115)
}

private struct Pill: View {
    let text: String; let fg: Color; let bg: Color
    var body: some View { Text(text).font(.caption).foregroundStyle(fg).padding(.horizontal, 10).padding(.vertical, 3).background(bg, in: Capsule()) }
}

private struct Field: View {
    let label: String; @Binding var text: String; var email = false
    var body: some View {
        TextField(label, text: $text)
            .textInputAutocapitalization(email ? .never : .sentences).keyboardType(email ? .emailAddress : .default)
            .padding(12).overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.line))
    }
}

struct Sample: Identifiable { let id: Int; let company: String; let from: String; let subject: String; let text: String }

struct ContentView: View {
    @AppStorage("name") private var name = ""
    @AppStorage("email") private var email = ""
    @AppStorage("law") private var law = "ndpa"
    @State private var company = ""
    @State private var from = ""
    @State private var subject = ""
    @State private var mailText = ""
    @State private var cloudOk = false
    @State private var busy = false
    @State private var youOpen = false
    /// Set when a read had to go past Apple's model: the device said "ready" but did not answer.
    @State private var deviceDidNotAnswer = false
    @State private var result: (advice: Coach.Advice, read: Read?, found: Coach.Found)?
    @Environment(\.openURL) private var openURL

    private let coach: Coach? = try? Coach.bundled()
    private let samples: [Sample] = {
        guard let url = Bundle.main.url(forResource: "coach", withExtension: "json"), let d = try? Data(contentsOf: url),
              let root = try? JSONSerialization.jsonObject(with: d) as? [String: Any], let s = root["samples"] as? [[String: Any]] else { return [] }
        return s.compactMap { x in
            guard let id = x["id"] as? Int, let c = x["company"] as? String, let f = x["from"] as? String, let sub = x["subject"] as? String, let t = x["text"] as? String else { return nil }
            return Sample(id: id, company: c, from: f, subject: sub, text: t)
        }
    }()

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    top
                    Divider().overlay(Color.line)
                    intro
                    Divider().overlay(Color.line)
                    reply(proxy)
                    if let r = result { Divider().overlay(Color.line); answer(r).id("answer") }
                    Divider().overlay(Color.line)
                    you
                }
            }
            .background(Color.page)
            .foregroundStyle(Color.ink)
        }
    }

    private var top: some View {
        let s = Reader.status()
        let ready = s == "ready" && !deviceDidNotAnswer
        return HStack {
            Text("Erased").font(.system(size: 18, weight: .heavy))
            Spacer()
            Pill(text: ready ? "Apple's on-device model" : deviceDidNotAnswer ? "On-device model didn't answer here" : "On-device model: \(s)", fg: ready ? .green : .amber, bg: ready ? .greenBg : .amberBg)
                .accessibilityIdentifier("status")
        }
        .padding(.horizontal, 16).padding(.vertical, 14)
    }

    private var intro: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("What does their reply want from you?").font(.system(size: 22, weight: .bold))
            Text("Paste a company's reply to your deletion request. Erased reads it on this iPhone and tells you the one thing to do, with the answer already written.")
                .font(.subheadline).foregroundStyle(Color.muted)
            if !samples.isEmpty {
                Text("Try a real reply").font(.footnote.weight(.semibold)).foregroundStyle(Color.muted)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(samples) { s in
                            Button(s.company) { company = s.company; from = s.from; subject = s.subject; mailText = s.text; result = nil }
                                .font(.footnote).padding(.horizontal, 12).padding(.vertical, 6)
                                .overlay(Capsule().stroke(Color.line)).foregroundStyle(Color.ink)
                        }
                    }
                }
            }
        }
        .padding(16)
    }

    private func reply(_ proxy: ScrollViewProxy) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Their reply").font(.footnote.weight(.semibold)).foregroundStyle(Color.muted)
            Field(label: "Company", text: $company)
            Field(label: "Their email address", text: $from, email: true)
            Field(label: "Subject", text: $subject)
            ZStack(alignment: .topLeading) {
                TextEditor(text: $mailText).frame(minHeight: 140).scrollContentBackground(.hidden).padding(6).accessibilityIdentifier("body")
                if mailText.isEmpty { Text("The email").foregroundStyle(Color.muted).padding(14).allowsHitTesting(false) }
            }
            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.line))
            Button { if let s = UIPasteboard.general.string { mailText = s } } label: { Label("Paste the email", systemImage: "doc.on.clipboard").font(.footnote) }
                .foregroundStyle(Color.ink)
            Toggle(isOn: $cloudOk) { Text("If this iPhone has no Apple Intelligence, let Gemini in the cloud read this one email").font(.footnote).foregroundStyle(Color.muted) }
                .tint(Color.ink)
            Button {
                Task { await readIt(); withAnimation { proxy.scrollTo("answer", anchor: .top) } }
            } label: {
                Text(busy ? "Reading…" : "Read it").font(.body.weight(.semibold)).frame(maxWidth: .infinity).padding(.vertical, 13)
                    .background(Color.ink, in: RoundedRectangle(cornerRadius: 10)).foregroundStyle(Color.page)
            }
            .disabled(busy || mailText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || coach == nil)
            .accessibilityIdentifier("read")
            if coach == nil { Text("coach.json is missing from this build.").foregroundStyle(.red) }
        }
        .padding(16)
    }

    private var you: some View {
        VStack(alignment: .leading, spacing: 10) {
            Button((youOpen ? "▾ " : "▸ ") + "Your details for the written reply") { youOpen.toggle() }.font(.footnote).foregroundStyle(Color.muted)
            if youOpen {
                Field(label: "Your name", text: $name)
                Field(label: "The account's email address", text: $email, email: true)
                Picker("Where you live", selection: $law) { ForEach(laws, id: \.id) { Text($0.label).tag($0.id) } }.tint(Color.ink)
            }
            Text("Your mail is read on this iPhone. The cloud reads one email only if you switch it on above.").font(.caption2).foregroundStyle(Color.muted)
        }
        .padding(16)
    }

    private func readIt() async {
        guard let coach else { return }
        busy = true
        defer { busy = false }
        let rules = coach.byRules(mailText)
        let read = await Reader(coach: coach).read(from: from, subject: subject, body: mailText, whereTo: cloudOk ? .cloudAllowed : .deviceOnly)
        let (found, _) = coach.decide(rules: rules, model: read.found)
        if !read.onDevice && Reader.status() == "ready" { deviceDidNotAnswer = true }
        let domain = from.split(separator: "@").last.map(String.init) ?? ""
        let ref = subject.range(of: "\\bER-[A-Z0-9]{5}\\b", options: .regularExpression).map { String(subject[$0]) } ?? ""
        let fill = ["company": company.isEmpty ? "The company" : company, "email": email.isEmpty ? "my email address" : email, "name": name,
                    "subject": subject.isEmpty ? "Your reply" : subject, "ref": ref, "to": from, "domain": domain]
        if let a = coach.advice(law: law, ask: found.ask, fill: fill) { result = (a, read, found) }
    }

    private func answer(_ r: (advice: Coach.Advice, read: Read?, found: Coach.Found)) -> some View {
        let read = r.read
        let onDevice = read?.onDevice == true
        let inCloud = read?.source.hasPrefix("gemini") == true
        let whereRead = (onDevice ? "Read on this iPhone by Apple's on-device model" : inCloud ? "Read by Gemini in the cloud (you allowed it)" : "Read with known phrases only")
            + ((read?.ms ?? 0) > 0 ? " · \(read!.ms) ms" : "")
        return VStack(alignment: .leading, spacing: 8) {
            Pill(text: whereRead, fg: onDevice ? .green : .muted, bg: onDevice ? .greenBg : .chip).accessibilityIdentifier("source")
            if !onDevice && !inCloud, let e = read?.error { Text("Model: \(String(e.prefix(160)))").font(.caption2).foregroundStyle(Color.muted) }
            if !r.found.quote.isEmpty { Text("“\(r.found.quote)”").font(.footnote).italic().foregroundStyle(Color.muted) }
            Text(r.advice.headline).font(.system(size: 17, weight: .bold)).accessibilityIdentifier("headline")
            Text(r.advice.why).font(.subheadline)
            ForEach(r.advice.legal, id: \.self) { Text($0).font(.caption2).foregroundStyle(Color.muted) }
            if r.advice.action.type == "email", let mailBody = r.advice.action.body {
                VStack(alignment: .leading, spacing: 6) {
                    Text("To \(from.isEmpty ? "them" : from) · \(r.advice.action.subject ?? "")").font(.caption2).foregroundStyle(Color.muted)
                    Text(mailBody).font(.footnote)
                }
                .padding(12).frame(maxWidth: .infinity, alignment: .leading).background(Color.chip, in: RoundedRectangle(cornerRadius: 10))
                HStack(spacing: 8) {
                    Button(r.advice.action.label) {
                        var c = URLComponents(); c.scheme = "mailto"; c.path = from
                        c.queryItems = [URLQueryItem(name: "subject", value: r.advice.action.subject ?? ""), URLQueryItem(name: "body", value: mailBody)]
                        if let u = c.url { openURL(u) }
                    }
                    .font(.subheadline.weight(.semibold)).padding(.horizontal, 14).padding(.vertical, 9)
                    .background(Color.ink, in: RoundedRectangle(cornerRadius: 10)).foregroundStyle(Color.page)
                    Button("Copy") { UIPasteboard.general.string = mailBody }
                        .font(.subheadline).padding(.horizontal, 14).padding(.vertical, 9)
                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.line)).foregroundStyle(Color.ink)
                }
            } else {
                Text(r.advice.action.label).font(.subheadline.weight(.semibold))
            }
        }
        .padding(14)
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.line))
        .padding(16)
    }
}
