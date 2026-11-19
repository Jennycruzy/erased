import { describe, expect, it } from "vitest";
import { newRequest } from "../src/core/store";
import { companyReplies, marketingEvent, replyEvent, sentEvent, watchQueries } from "../src/core/watch";

const d = (s: string) => Date.parse(s + "T12:00:00Z");
const r = newRequest({ id: "1", ref: "ER-ABCDE", domain: "acme.com", company: "Acme", kind: "delete", law: "gdpr", route: "email", to: "privacy@acme-privacy.eu", formUrl: null, accountEmail: "me@example.com", now: d("2026-11-01") });

describe("watcher", () => {
  it("builds Gmail searches around the reference", () => {
    const q = watchQueries(r, d("2026-11-10"));
    expect(q.sent).toBe('in:sent "ER-ABCDE"');
    expect(q.marketing).toBe('from:acme.com after:2026/11/10 -"ER-ABCDE"');
  });
  it("takes the earliest sent copy", () => expect(sentEvent([{ from: "me@example.com", subject: "x", at: d("2026-11-03") }, { from: "me@example.com", subject: "x", at: d("2026-11-02") }])).toEqual({ type: "sent", at: d("2026-11-02") }));
  it("accepts replies only from the company or its privacy address", () => {
    const rows = [
      { from: "support@acme.com", subject: "Re", at: 1 },
      { from: "dpo@acme-privacy.eu", subject: "Re", at: 2 },
      { from: "scam@evil.com", subject: "Re: your request ER-ABCDE", at: 3 },
    ];
    expect(companyReplies(r, rows).map((x) => x.at)).toEqual([1, 2]);
  });
  it("drops a reply reading whose quote was not found", () => {
    expect(replyEvent(1, { reply: "deleted", extension: false, quote: "made up", quoteOk: false })).toEqual([]);
    expect(replyEvent(1, { reply: "ack", extension: true, quote: "We need more time", quoteOk: true }).map((e) => e.type)).toEqual(["reply", "extension_notice"]);
  });
  it("marketing: device decides, subject rules otherwise", () => {
    const row = { from: "news@acme.com", subject: "This week: 20% off", at: 5 };
    expect(marketingEvent(row)?.type).toBe("marketing");
    expect(marketingEvent(row, { marketing: false, quoteOk: true })).toBeNull();
    expect(marketingEvent({ ...row, subject: "Your data export" })).toBeNull();
  });
});
