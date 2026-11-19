import { describe, expect, it } from "vitest";
import { morningCard } from "../src/core/morning";
import { newRequest, Store, type KV } from "../src/core/store";
import { buildFollowUp } from "../src/core/templates";

const d = (s: string) => Date.parse(s + "T12:00:00Z");
const mem = (): KV => { const m = new Map<string, unknown>(); return { get: async (k) => structuredClone(m.get(k)), set: async (k, v) => void m.set(k, structuredClone(v)) }; };
const base = { ref: "ER-ABCDE", domain: "acme.com", company: "Acme", kind: "delete" as const, law: "gdpr" as const, route: "email" as const, to: "privacy@acme.com", formUrl: null, accountEmail: "me@example.com" };

describe("store", () => {
  it("keeps requests and de-duplicates events", async () => {
    const s = new Store(mem());
    await s.upsert(newRequest({ id: "1", ...base, now: d("2026-11-01") }));
    await s.addEvent("1", { type: "sent", at: d("2026-11-01") });
    await s.addEvent("1", { type: "sent", at: d("2026-11-01") });
    expect((await s.requests())[0].events).toHaveLength(1);
    expect((await s.byDomain("acme.com"))?.ref).toBe("ER-ABCDE");
  });
  it("settings merge with defaults", async () => {
    const s = new Store(mem());
    await s.saveSettings({ fullName: "Ada Example" });
    expect(await s.settings()).toMatchObject({ fullName: "Ada Example", region: "GB", shareOutcomes: false });
  });
});

describe("morning card", () => {
  it("flags a broken promise and a missed deadline", () => {
    const broken = { ...newRequest({ id: "1", ...base, now: d("2026-10-01") }), events: [
      { type: "sent" as const, at: d("2026-10-01") },
      { type: "reply" as const, at: d("2026-10-05"), reply: "deleted" as const, quote: "deleted" },
      { type: "marketing" as const, at: d("2026-10-20"), subject: "We miss you" },
    ] };
    const late = { ...newRequest({ id: "2", ...base, company: "Beta", domain: "beta.com", now: d("2026-10-01") }), events: [{ type: "sent" as const, at: d("2026-10-01") }] };
    const c = morningCard([broken, late], d("2026-11-05"), d("2026-11-04"));
    expect(c.lines.join(" ")).toContain("Acme said your data was deleted");
    expect(c.lines.join(" ")).toContain("Beta missed the legal deadline");
    expect(c.badge).toBe(2);
  });
});

describe("follow-up letter", () => {
  it("names the original date and the regulator", () => {
    const f = buildFollowUp({ kind: "delete", law: "gdpr", company: "Acme", fullName: "Ada Example", accountEmail: "me@example.com", ref: "ER-ABCDE", sentAt: d("2026-12-05"), originalSentAt: d("2026-11-01") });
    expect(f.body).toContain("2026-11-01");
    expect(f.body).toContain("data protection authority");
  });
});

import { complaintHtml } from "../src/core/complaint";
describe("complaint pack", () => {
  it("lists the broken promise with quotes and escapes HTML", () => {
    const r = { ...newRequest({ id: "1", ...base, company: "Acme <script>", now: d("2026-10-01") }), events: [
      { type: "sent" as const, at: d("2026-10-01") },
      { type: "reply" as const, at: d("2026-10-05"), reply: "deleted" as const, quote: "Your account has been deleted." },
      { type: "marketing" as const, at: d("2026-10-20"), subject: "We miss you" },
    ] };
    const h = complaintHtml(r, "Ada Example", d("2026-10-21"));
    expect(h).toContain("Your account has been deleted.");
    expect(h).toContain("We miss you");
    expect(h).toContain("data protection authority");
    expect(h).not.toContain("<script>");
  });
});
