import { describe, expect, it } from "vitest";
import { status, DEFAULT_TIMING, SIGNIN_WAIT_MS } from "../src/core/requests";
import { accountAliveEvent, resetPage, signInQuery } from "../src/core/signin";

const H = 3600e3, D = 24 * H;
const base = (events: unknown[]) => ({ id: "v", ref: "ER-CDSXS", domain: "vimeo.com", company: "Vimeo", kind: "delete", law: "gdpr", route: "email", to: "privacy@vimeo.com", formUrl: null, accountEmail: "me@gmail.com", createdAt: 0, events }) as never;
const sent = { type: "sent", at: 0 }, ok = { type: "reply", at: 2 * D, reply: "deleted", quote: "Your account has been deleted." };

describe("sign-in check states", () => {
  it("confirmed shows days clean", () => expect(status(base([sent, ok]), 9 * D).reason).toBe("Confirmed · 7 days clean."));
  it("waits 24 h after the check", () => expect(status(base([sent, ok, { type: "signin_check", at: 5 * D }]), 5 * D + H).reason).toContain("sign-in check running"));
  it("a reset email after the check means the account still exists", () => {
    const s = status(base([sent, ok, { type: "signin_check", at: 5 * D }, { type: "account_alive", at: 5 * D + 60e3, subject: "Reset your password" }]), 6 * D);
    expect([s.state, s.result]).toEqual(["broken", "BROKEN_ACCOUNT_STILL_EXISTS"]);
  });
  it("no email within 24 h: sign-in checked", () => expect(status(base([sent, ok, { type: "signin_check", at: 5 * D }]), 5 * D + SIGNIN_WAIT_MS + 1).state).toBe("signin_checked"));
  it("proven after 30 quiet days, check passed", () => {
    const s = status(base([sent, ok, { type: "signin_check", at: 5 * D }]), 2 * D + DEFAULT_TIMING.proofDays * D);
    expect(s.state).toBe("proven"); expect(s.reason).toContain("sign-in check passed");
  });
  it("marketing after proven reopens the case; before it, it is broken", () => {
    expect(status(base([sent, ok, { type: "marketing", at: 2 * D + 40 * D, subject: "We miss you" }]), 50 * D).state).toBe("reopened");
    expect(status(base([sent, ok, { type: "marketing", at: 10 * D, subject: "We miss you" }]), 50 * D).state).toBe("broken");
  });
  it("an old sign-in email from before the check does not count", () => expect(status(base([sent, ok, { type: "account_alive", at: 3 * D, subject: "Reset" }, { type: "signin_check", at: 5 * D }]), 5 * D + 2 * D).state).toBe("signin_checked"));
});

describe("sign-in watcher", () => {
  it("only tested reset pages are offered", () => { expect(resetPage({ domain: "vimeo.com" })).toContain("forgot_password"); expect(resetPage({ domain: "monday.com" })).toBeNull(); });
  it("searches the company's mail since the check, not our request thread", () => expect(signInQuery(base([]), Date.UTC(2026, 10, 21, 13))).toBe('(from:vimeo) after:2026/11/20 (password OR reset OR "sign in" OR "log in" OR login OR "welcome back") -"ER-CDSXS"'));
  it("takes the first reset email within 24 h", () => {
    const at = 1000 * D;
    expect(accountAliveEvent(at, [{ from: "vimeo@vimeo.com", subject: "Reset your password", at: at + 50e3 }, { from: "vimeo@vimeo.com", subject: "Reset your password", at: at + 30 * H }])).toEqual({ type: "account_alive", at: at + 50e3, subject: "Reset your password" });
    expect(accountAliveEvent(at, [{ from: "vimeo@vimeo.com", subject: "New on Vimeo this week", at: at + H }])).toBeNull();
  });
});
import { isResetMail } from "../src/core/watch";
describe("reset mail is not a reply", () => {
  it("spots reset subjects", () => { expect(isResetMail("Reset your password")).toBe(true); expect(isResetMail("Zapier Password Reset")).toBe(true); expect(isResetMail("[Request received]")).toBe(false); });
});
