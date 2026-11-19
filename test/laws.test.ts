import { describe, expect, it } from "vitest";
import { LAWS, lawFor } from "../src/core/laws";
import { addMonths } from "../src/core/time";

const d = (s: string) => Date.parse(s + "T12:00:00Z");
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

describe("deadlines", () => {
  it("GDPR gives one calendar month", () => expect(iso(LAWS.gdpr.deadline(d("2026-11-19")))).toBe("2026-12-19"));
  it("GDPR month end clamps (31 Jan -> 28 Feb)", () => expect(iso(LAWS.gdpr.deadline(d("2027-01-31")))).toBe("2027-02-28"));
  it("GDPR leap year clamps to 29 Feb", () => expect(iso(addMonths(d("2028-01-31"), 1))).toBe("2028-02-29"));
  it("GDPR extension adds two more months", () => expect(iso(LAWS.gdpr.extendedDeadline(d("2026-11-19")))).toBe("2027-02-19"));
  it("UK GDPR matches GDPR timing", () => expect(iso(LAWS.uk_gdpr.deadline(d("2026-03-31")))).toBe("2026-04-30"));
  it("CCPA gives 45 days, 90 with extension", () => {
    expect(iso(LAWS.ccpa.deadline(d("2026-11-19")))).toBe("2027-01-03");
    expect(iso(LAWS.ccpa.extendedDeadline(d("2026-11-19")))).toBe("2027-02-17");
  });
  it("PIPEDA gives 30 days, 60 with notice", () => {
    expect(iso(LAWS.pipeda.deadline(d("2026-11-19")))).toBe("2026-12-19");
    expect(iso(LAWS.pipeda.extendedDeadline(d("2026-11-19")))).toBe("2027-01-18");
  });
  it("NDPA gives 30 days", () => expect(iso(LAWS.ndpa.deadline(d("2026-11-19")))).toBe("2026-12-19"));
  it("policy fallback gives 30 days", () => expect(iso(LAWS.policy.deadline(d("2026-11-19")))).toBe("2026-12-19"));
});

describe("law by region", () => {
  it.each([["DE", "gdpr"], ["ie", "gdpr"], ["NO", "gdpr"], ["GB", "uk_gdpr"], ["US-CA", "ccpa"], ["CA", "pipeda"], ["NG", "ndpa"], ["BR", "policy"], ["IN", "policy"], ["OTHER", "policy"]])(
    "%s -> %s", (r, id) => expect(lawFor(r).id).toBe(id));
});
