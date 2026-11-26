import { describe, expect, it } from "vitest";
import { buildRequest, letterLanguage } from "../src/core/templates";

const base = { kind: "delete" as const, law: "gdpr" as const, company: "Acme", fullName: "Ada", accountEmail: "ada@example.com", ref: "ER-ABCDE", sentAt: Date.parse("2026-11-20") };
describe("GDPR letters in the person's language", () => {
  it("picks the language from the country, GDPR only", () => {
    expect(letterLanguage("ES", "gdpr")).toBe("es");
    expect(letterLanguage("FR", "gdpr")).toBe("fr");
    expect(letterLanguage("AT", "gdpr")).toBe("de");
    expect(letterLanguage("IE", "gdpr")).toBe("en");
    expect(letterLanguage("ES", "ccpa")).toBe("en");
  });
  it("writes each letter with the reference, the deadline and the right article", () => {
    for (const [lang, art] of [["es", "artículo 17"], ["fr", "article 17"], ["de", "Artikel 17"]] as const) {
      const l = buildRequest({ ...base, lang });
      expect(l.subject).toContain("[ER-ABCDE]");
      expect(l.body).toContain(art);
      expect(l.body).toContain("2026-12-20");
      expect(l.body).toContain("ada@example.com");
      const o = buildRequest({ ...base, kind: "stop_marketing", lang });
      expect(o.body).toMatch(/21/);
    }
  });
  it("keeps English for other laws even if a language is passed", () => {
    expect(buildRequest({ ...base, law: "ccpa", lang: "es" }).subject).toBe("Request to delete my personal data [ER-ABCDE]");
  });
});
