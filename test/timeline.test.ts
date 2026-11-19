import { describe, expect, it } from "vitest";
import { layoutTimeline } from "../src/panel/timeline";
import type { Company } from "../src/core/trail";

const d = (s: string) => Date.parse(s + "T12:00:00Z");
const co = (domain: string, joined: string, extra: Partial<Company> = {}): Company => ({
  domain, emails: 4, firstSeen: d(joined), lastSeen: d("2026-01-01"), signedUp: d(joined), account: "likely", stale: false, breaches: [], breachedAfterJoining: [], ...extra,
});

describe("timeline layout", () => {
  it("places dots in time order with year ticks from the first sign-up", () => {
    const l = layoutTimeline([co("b.com", "2020-06-01"), co("a.com", "2015-03-01")], 400, d("2026-11-19"));
    expect(l.years[0].label).toBe("2015");
    expect(l.years.at(-1)!.label).toBe("2026");
    expect(l.dots[0].domain).toBe("a.com");
    expect(l.dots[0].cx).toBeLessThan(l.dots[1].cx);
  });
  it("stacks dots in the same column and colours breaches", () => {
    const bad = { name: "x", title: "x", domain: "x.com", date: "2021-01-01", accounts: 1, dataClasses: [] };
    const l = layoutTimeline([co("a.com", "2020-06-01"), co("x.com", "2020-06-02", { breaches: [bad], breachedAfterJoining: [bad] })], 400, d("2026-11-19"));
    expect(l.dots.map((x) => x.level).sort()).toEqual([0, 1]);
    expect(l.dots.find((x) => x.domain === "x.com")!.kind).toBe("red");
  });
  it("handles an empty trail", () => expect(layoutTimeline([], 400, d("2026-11-19")).dots).toEqual([]));
});
