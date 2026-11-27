import { describe, expect, it } from "vitest";
import { status, type Request, type RequestEvent } from "../src/core/requests";

const d = (s: string) => Date.parse(s + "T12:00:00Z");
const req = (events: RequestEvent[], law: Request["law"] = "gdpr"): Request => ({ id: "r", domain: "example.com", kind: "delete", law, events });
const sent: RequestEvent = { type: "sent", at: d("2026-11-01") };

describe("request status", () => {
  it("drafted before sending", () => expect(status(req([]), d("2026-11-01")).state).toBe("drafted"));
  it("sent, with the legal deadline", () => {
    const s = status(req([sent]), d("2026-11-05"));
    expect(s.state).toBe("sent");
    expect(new Date(s.deadline!).toISOString().slice(0, 10)).toBe("2026-12-01");
  });
  it("ack only", () => expect(status(req([sent, { type: "reply", at: d("2026-11-02"), reply: "ack", quote: "We received your request" }]), d("2026-11-10")).state).toBe("ack"));
  it("overdue with no reply", () => {
    const s = status(req([sent]), d("2026-12-02"));
    expect([s.state, s.result]).toEqual(["overdue", "OVERDUE_NO_REPLY"]);
  });
  it("overdue after an ack only", () => {
    const s = status(req([sent, { type: "reply", at: d("2026-11-02"), reply: "ack", quote: "received" }]), d("2026-12-05"));
    expect(s.result).toBe("OVERDUE_ACK_ONLY");
  });
  it("extension notice moves the deadline", () => {
    const s = status(req([sent, { type: "extension_notice", at: d("2026-11-20"), quote: "we need more time" }]), d("2026-12-15"));
    expect(s.state).toBe("sent");
    expect(new Date(s.deadline!).toISOString().slice(0, 10)).toBe("2027-02-01");
  });
  it("confirmed, then proven after 30 quiet days", () => {
    const c: RequestEvent = { type: "reply", at: d("2026-11-10"), reply: "deleted", quote: "your account has been deleted" };
    expect(status(req([sent, c]), d("2026-11-20")).state).toBe("confirmed");
    const p = status(req([sent, c]), d("2026-12-10"));
    expect([p.state, p.result]).toEqual(["proven", "PROVEN_NO_MAIL_30D"]);
  });
  it("marketing inside the grace window does not break the promise", () => {
    const c: RequestEvent = { type: "reply", at: d("2026-11-10"), reply: "deleted", quote: "deleted" };
    const m: RequestEvent = { type: "marketing", at: d("2026-11-12"), subject: "Last chance: 20% off" };
    expect(status(req([sent, c, m]), d("2026-12-11")).state).toBe("proven");
  });
  it("marketing after the grace window is a broken promise", () => {
    const c: RequestEvent = { type: "reply", at: d("2026-11-10"), reply: "deleted", quote: "deleted" };
    const m: RequestEvent = { type: "marketing", at: d("2026-11-25"), subject: "We miss you" };
    const s = status(req([sent, c, m]), d("2026-11-26"));
    expect([s.state, s.result]).toEqual(["broken", "BROKEN_MARKETING_AFTER_CONFIRM"]);
    expect(s.evidence).toEqual(m);
  });
  it("refusal makes a complaint ready", () => {
    const s = status(req([sent, { type: "reply", at: d("2026-11-05"), reply: "refused", quote: "we must retain" }]), d("2026-11-06"));
    expect([s.state, s.result]).toEqual(["complaint_ready", "REFUSED_WITH_REASON"]);
  });
  it("identity request, then skipped", () => {
    const n: RequestEvent = { type: "reply", at: d("2026-11-03"), reply: "needs_id", quote: "please verify" };
    expect(status(req([sent, n]), d("2026-11-04")).state).toBe("needs_id");
    expect(status(req([sent, n, { type: "user_skipped_id", at: d("2026-11-05") }]), d("2026-11-06")).result).toBe("NEEDS_ID_USER_SKIPPED");
  });
  it("follow-up, then complaint after 14 days", () => {
    const f: RequestEvent = { type: "followed_up", at: d("2026-12-02") };
    expect(status(req([sent, f]), d("2026-12-10")).state).toBe("followed_up");
    expect(status(req([sent, f]), d("2026-12-17")).state).toBe("complaint_ready");
  });
  it("event order in storage does not matter", () => {
    const c: RequestEvent = { type: "reply", at: d("2026-11-10"), reply: "deleted", quote: "deleted" };
    expect(status(req([c, sent]), d("2026-12-11")).state).toBe("proven");
  });
});

describe("still marketing after the request", () => {
  const mkt = (day: string): RequestEvent => ({ type: "marketing", at: d(day), subject: "50% off this week" });
  it("marketing a day after the request is within the grace days", () => expect(status(req([sent, mkt("2026-11-02")]), d("2026-11-05")).state).toBe("sent"));
  it("marketing a week after the request breaks the objection", () => {
    const s = status(req([sent, mkt("2026-11-08")]), d("2026-11-09"));
    expect([s.state, s.result]).toEqual(["still_marketing", "STILL_MARKETING_AFTER_REQUEST"]);
    expect(s.reason).toContain("7 days after you told them to stop");
  });
  it("a holding message the model called a refusal is not one", () => expect(status(req([sent, mkt("2026-11-08"), { type: "reply", at: d("2026-11-03"), reply: "refused", quote: "Our Support team is currently responding to a higher volume of messages than usual, but your ticket is in queue and important to us." }]), d("2026-11-09")).state).toBe("still_marketing"));
  it("a refusal still wins", () => expect(status(req([sent, mkt("2026-11-08"), { type: "reply", at: d("2026-11-03"), reply: "refused", quote: "no" }]), d("2026-11-09")).state).toBe("complaint_ready"));
});
