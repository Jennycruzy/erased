import { describe, expect, it } from "vitest";
import breachFile from "../data/breaches.json";
import { indexBreaches } from "../src/core/breaches";
import { companyDomain } from "../src/core/domain";
import { kindFromSubject } from "../src/core/headers";
import { quoteIsIn } from "../src/core/quote";
import { buildRequest, composeUrl, newRef } from "../src/core/templates";
import { safetyScore, summarise, type Sighting } from "../src/core/trail";

const d = (s: string) => Date.parse(s + "T12:00:00Z");

describe("company domain", () => {
  it.each([
    ["jobs-noreply@linkedin.com", "linkedin.com"],
    ["no-reply@mail.instagram.com", "instagram.com"],
    ["hello@news.bbc.co.uk", "bbc.co.uk"],
    ["team@email.jumia.com.ng", "jumia.com.ng"],
    ["friend@gmail.com", null],
    ["someone@outlook.com", null],
  ])("%s -> %s", (a, want) => expect(companyDomain(a)).toBe(want));
});

describe("subject rules", () => {
  it.each([
    ["Welcome to Substack!", "welcome"],
    ["Please verify your email address", "verify"],
    ["Reset your password", "reset"],
    ["New sign-in to your account", "security"],
    ["Your order #12345 receipt", "receipt"],
    ["Your account has been deleted", "deletion"],
    ["This week's top stories", "newsletter"],
    ["Lunch on Friday?", "other"],
  ])("%s -> %s", (s, k) => expect(kindFromSubject(s)).toBe(k));
});

describe("quote check", () => {
  const body = "Hi Ada,\n\nYour  account has been   deleted, and we’ve removed your data.\nThanks";
  it("accepts an exact sentence despite spacing and curly quotes", () => expect(quoteIsIn("Your account has been deleted, and we've removed your data.", body)).toBe(true));
  it("rejects invented text", () => expect(quoteIsIn("We have deleted all backups.", body)).toBe(false));
  it("rejects tiny quotes", () => expect(quoteIsIn("Hi", body)).toBe(false));
  it("rejects empty", () => expect(quoteIsIn(undefined, body)).toBe(false));
});

describe("breach catalogue", () => {
  const idx = indexBreaches(breachFile.breaches as Array<Record<string, unknown>>);
  it("loads hundreds of company domains", () => expect(idx.size).toBeGreaterThan(500));
  it("includes LinkedIn", () => expect(idx.get("linkedin.com")?.length).toBeGreaterThan(0));
});

describe("company summary", () => {
  const breach = { name: "X", title: "X breach", domain: "x.com", date: "2023-05-01", accounts: 1000, dataClasses: ["Email addresses"] };
  const s = (at: string, kind: Sighting["kind"], device?: Sighting["device"]): Sighting => ({ domain: "x.com", at: d(at), kind, device });
  it("two account-type headers make a likely account", () => {
    const c = summarise("x.com", [s("2019-01-01", "welcome"), s("2020-01-01", "reset")], [breach], d("2026-11-19"));
    expect(c.account).toBe("likely");
    expect(c.signedUp).toBe(d("2019-01-01"));
    expect(c.breachedAfterJoining).toHaveLength(1);
    expect(c.stale).toBe(true);
  });
  it("a device read with a verified quote confirms the account", () => {
    const c = summarise("x.com", [s("2024-01-01", "other", { isAccount: true, quote: "q", quoteOk: true })], [breach], d("2026-11-19"));
    expect(c.account).toBe("confirmed");
    expect(c.breachedAfterJoining).toHaveLength(0);
  });
  it("a device answer whose quote failed is ignored", () => {
    const c = summarise("x.com", [s("2024-01-01", "other", { isAccount: true, quote: "q", quoteOk: false })], [], d("2026-11-19"));
    expect(c.account).toBe("unknown");
  });
  it("device 'not an account' overrides header guesses", () => {
    const c = summarise("x.com", [s("2019-01-01", "welcome"), s("2020-01-01", "verify"), s("2020-02-01", "other", { isAccount: false, quoteOk: true })], [], d("2026-11-19"));
    expect(c.account).toBe("unknown");
  });
  it("safety score falls with risky companies", () => {
    const risky = summarise("x.com", [s("2019-01-01", "welcome"), s("2019-02-01", "verify")], [breach], d("2026-11-19"));
    const fine = summarise("y.com", [{ domain: "y.com", at: d("2026-10-01"), kind: "other", device: { isAccount: true, quote: "q", quoteOk: true } }], [], d("2026-11-19"));
    expect(safetyScore([risky, fine])).toBe(50);
    expect(safetyScore([])).toBe(100);
  });
});

describe("request templates", () => {
  const base = { law: "gdpr" as const, company: "Acme", fullName: "Ada Example", accountEmail: "me@example.com", ref: "ER-ABCDE", sentAt: d("2026-11-19") };
  it("deletion cites Article 17 and the due date", () => {
    const r = buildRequest({ ...base, kind: "delete" });
    expect(r.subject).toContain("[ER-ABCDE]");
    expect(r.body).toContain("Article 17 GDPR");
    expect(r.body).toContain("2026-12-19");
  });
  it("marketing objection keeps the account", () => {
    const r = buildRequest({ ...base, kind: "stop_marketing" });
    expect(r.body).toContain("Article 21");
    expect(r.body).toContain("keep my account open");
  });
  it("refs use an unambiguous alphabet", () => expect(newRef(() => 0)).toBe("ER-22222"));
  it("compose link pre-fills Gmail", () => {
    const u = new URL(composeUrl("privacy@acme.com", "S", "B"));
    expect(u.searchParams.get("view")).toBe("cm");
    expect(u.searchParams.get("to")).toBe("privacy@acme.com");
  });
});
