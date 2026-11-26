import { describe, expect, it } from "vitest";
import { regulatorFor } from "../src/core/regulators";
import { complaintHtml } from "../src/core/complaint";
import { newRequest } from "../src/core/store";

describe("regulator routes", () => {
  it("picks the authority for the law and country", () => {
    expect(regulatorFor("uk_gdpr", "GB")?.url).toContain("ico.org.uk");
    expect(regulatorFor("gdpr", "FR")?.name).toContain("CNIL");
    expect(regulatorFor("gdpr", "PT")?.url).toContain("edpb.europa.eu");
    expect(regulatorFor("policy", "US")).toBeNull();
  });
  it("puts the authority's page in the complaint pack", () => {
    const r = { ...newRequest({ id: "1", ref: "ER-ABCDE", domain: "acme.com", company: "Acme", kind: "delete", law: "pipeda", route: "email", to: "p@acme.com", formUrl: null, accountEmail: "me@example.com", now: Date.parse("2026-11-01") }), events: [{ type: "sent" as const, at: Date.parse("2026-11-01") }] };
    const html = complaintHtml(r, "Ada", Date.parse("2026-12-20"), "CA");
    expect(html).toContain("https://www.priv.gc.ca/en/report-a-concern/");
    expect(html).toContain("Office of the Privacy Commissioner of Canada");
  });
});
