import { describe, expect, it } from "vitest";
import * as watchMod from "../src/core/watch";
import { newRequest } from "../src/core/store";
import { companyReplies, marketingEvent, replyEvent, sentEvent, watchQueries, mentionsCompany } from "../src/core/watch";

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
      { from: "support@acme.com", subject: "Re", at: d("2026-11-02") },
      { from: "dpo@acme-privacy.eu", subject: "Re", at: d("2026-11-03") },
      { from: "scam@evil.com", subject: "Re: your request ER-ABCDE", at: d("2026-11-04") },
    ];
    expect(companyReplies(r, rows).map((x) => x.at)).toEqual([d("2026-11-02"), d("2026-11-03")]);
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

import { isCompanySender } from "../src/core/watch";
describe("isCompanySender (seen in the live run)", () => {
  const req = (domain: string, to: string | null) => ({ id: "x", ref: "ER-ABCDE", domain, company: domain, kind: "delete", law: "gdpr", route: "email", to, formUrl: null, accountEmail: "me@gmail.com", createdAt: 0, events: [] }) as never;
  it("accepts the company's own help desk subdomain", () => {
    expect(isCompanySender(req("box.com", "privacy@box.com"), "privacy@box.zendesk.com")).toBe(true);
    expect(isCompanySender(req("atlassian.com", "privacy@atlassian.com"), "advocates@atlassiansupport.atlassian.net")).toBe(true);
    expect(isCompanySender(req("medium.com", "privacy@medium.com"), "privacy@medium.zendesk.com")).toBe(true);
  });
  it("rejects another company's help desk", () => expect(isCompanySender(req("box.com", "privacy@box.com"), "help@prezi.zendesk.com")).toBe(false));
  it("accepts a parent company", () => expect(isCompanySender(req("slack.com", "feedback@slack.com"), "noreply-privacy@salesforce.com")).toBe(true));
  it("does not accept a privacy vendor that serves many companies", () => expect(isCompanySender(req("calendly.com", null), "noreply@m.ketch.com")).toBe(false));
  it("still rejects strangers and the user", () => {
    expect(isCompanySender(req("box.com", "privacy@box.com"), "scam@evil.com")).toBe(false);
    expect(isCompanySender(req("box.com", "privacy@box.com"), "me@gmail.com")).toBe(false);
  });
});
describe("isCompanySender via the address we wrote to", () => {
  it("Trello request sent to privacy@atlassian.com accepts Atlassian's help desk", () => expect(isCompanySender({ id: "x", ref: "ER-WETHF", domain: "trello.com", company: "Trello", kind: "delete", law: "gdpr", route: "email", to: "privacy@atlassian.com", formUrl: null, accountEmail: "me@gmail.com", createdAt: 0, events: [] } as never, "advocates@atlassiansupport.atlassian.net")).toBe(true));
});
describe("companyReplies on thread rows", () => {
  it("finds the company when Gmail lists you first", () => {
    const r = { id: "x", ref: "ER-6VN4F", domain: "notion.so", company: "Notion", kind: "delete", law: "gdpr", route: "email", to: "privacy@makenotion.com", formUrl: null, accountEmail: "me@gmail.com", createdAt: 0, events: [] } as never;
    const out = companyReplies(r, [{ from: "me@gmail.com", senders: ["me@gmail.com", "privacy@makenotion.com"], subject: "Request", at: 5, threadId: "t" }]);
    expect(out.map((x) => x.from)).toEqual(["privacy@makenotion.com"]);
  });
  it("skips a newsletter from a bulk-mail subdomain but keeps the privacy desk and our reference", () => {
    const r = { id: "x", ref: "ER-AAAAA", domain: "codecademy.com", company: "Codecademy", kind: "delete", law: "gdpr", route: "email", to: "privacy@codecademy.com", formUrl: null, accountEmail: "me@gmail.com", createdAt: 0, events: [] } as never;
    const out = companyReplies(r, [
      { from: "learn@itr.mail.codecademy.com", subject: "Build skills you can use now", at: 5 },
      { from: "privacy@mail.codecademy.com", subject: "Your request", at: 6 },
      { from: "learn@itr.mail.codecademy.com", subject: "Re: Request [ER-AAAAA]", at: 7 },
    ]);
    expect(out.map((x) => x.at)).toEqual([6, 7]);
  });
});

import { replyQuery, senderWords } from "../src/core/watch";
describe("replyQuery", () => {
  const r = { id: "x", ref: "ER-GGJBD", domain: "substack.com", company: "Substack", kind: "delete", law: "gdpr", route: "email", to: "privacy@substackinc.com", formUrl: null, accountEmail: "me@gmail.com", createdAt: Date.UTC(2026, 10, 20, 17), events: [{ type: "sent", at: Date.UTC(2026, 10, 20, 17, 10) }] } as never;
  it("uses the company names from the domain and the address we wrote to", () => expect(senderWords(r)).toEqual(["substack", "substackinc"]));
  it("finds the reference OR the company (or a privacy-request service) since the day before sending", () =>
    expect(replyQuery(r)).toBe('{"ER-GGJBD" from:substack from:substackinc from:onetrust.com from:ketch.com from:privacyportal.co from:ethyca.com from:transcend.io from:datagrail.io from:securiti.ai from:trustarc.com from:osano.com from:mineos.ai} after:2026/11/19'));
  it("keeps a privacy-service email only if it names the company", () => {
    const cal = { ...(r as object), domain: "calendly.com", company: "Calendly", to: null } as never;
    const rows = companyReplies(cal, [{ from: "noreply@m.ketch.com", subject: "Identity Verification", at: 2e12 }]);
    expect(rows[0]).toMatchObject({ vendor: true });
    expect(mentionsCompany(cal, "Verify: https://calendly. privacyportal.co/identity?token=x")).toBe(true);
    expect(mentionsCompany(cal, "Your privacy request has been received.")).toBe(false);
  });
});
describe("companyReplies guards (live run)", () => {
  const base = { kind: "delete", law: "gdpr", route: "email", formUrl: null, accountEmail: "me@gmail.com", createdAt: 100, events: [{ type: "sent", at: 100 }] };
  const trello = { ...base, id: "t", ref: "ER-WETHF", domain: "trello.com", company: "Trello", to: "privacy@atlassian.com" } as never;
  const row = (subject: string, at = 200) => ({ from: "advocates@atlassiansupport.atlassian.net", subject, at });
  it("skips a row that names another request's reference", () => expect(companyReplies(trello, [row("CA-1 Request [ER-G9GRH]")])).toEqual([]));
  it("keeps its own reference and rows with none", () => expect(companyReplies(trello, [row("CA-2 Request [ER-WETHF]"), row("Your case")]).length).toBe(2));
  it("ignores mail from before the request was sent", () => expect(companyReplies(trello, [row("Welcome", 100 - 2 * 3600e3)])).toEqual([]));
  it("never stores an unrelated reading", () => expect(replyEvent(1, { reply: "unrelated", extension: false, quote: "Build your first Zap", quoteOk: true })).toEqual([]));
  it("searches the parent company too", () => expect(senderWords({ ...base, id: "s", ref: "ER-AAAAA", domain: "slack.com", company: "Slack", to: "feedback@slack.com" } as never)).toEqual(["slack", "salesforce"]));
});

describe("promotions and help desks", () => {
  it("a promotion is never read as a reply", () => {
    const { PROMO_SUBJECT } = watchMod;
    expect(PROMO_SUBJECT.test("Erased, Your 50% Off Is Waiting For You")).toBe(true);
    expect(PROMO_SUBJECT.test("Re: Request to delete my personal data [ER-AAAAA]")).toBe(false);
  });
  it("a help-desk survey is never marketing", () => {
    expect(watchMod.marketingEvent({ from: "support@spotify.com", subject: "Spotify Support", at: 1 } as never, { marketing: true, quoteOk: true })).toBeNull();
    expect(watchMod.marketingEvent({ from: "learn@send.zapier.com", subject: "What teams are automating this week", at: 1 } as never, { marketing: true, quoteOk: true })).not.toBeNull();
  });
});
