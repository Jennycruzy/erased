import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { boardLine, publicBoard, reports } from "../src/core/board";

describe("board", () => {
  it("counts reports by the largest counter", () => expect(reports({ requests: 7, confirmed: 3 })).toBe(7));
  it("keeps companies private below five reports", () => expect(Object.keys(publicBoard({ "a.com": { requests: 4 }, "b.com": { requests: 5 } }))).toEqual(["b.com"]));
  it("writes one plain line for a trail row", () => expect(boardLine({ requests: 12, confirmed: 3, proven: 1, broken: 2 })).toBe("12 people asked · 4 told they were deleted · 2 still got marketing"));
  it("says nothing below the threshold or with no data", () => { expect(boardLine({ requests: 4, broken: 4 })).toBeNull(); expect(boardLine(undefined)).toBeNull(); });
});

const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? files(p) : p.endsWith(".ts") ? [p] : []; });

describe("privacy guard", () => {
  it("no extension code reads the board one company at a time", () => {
    for (const f of files("src")) {
      if (f.endsWith("m0.ts")) continue; // local platform check page, not shipped
      const src = readFileSync(f, "utf8");
      expect(src, f).not.toMatch(/getDoc\(|getDocs\(|onSnapshot\(/);
      expect(src, f).not.toMatch(/documents\/board\//);
    }
  });
});

import { useHosted } from "../src/core/breaches";
describe("hosted breach catalogue", () => {
  const many = Array.from({ length: 1000 }, () => ({}));
  it("uses a newer hosted copy", () => expect(useHosted("2026-11-19T14:41:00Z", { fetchedAt: "2026-11-21T13:00:00Z", breaches: many })).toBe(true));
  it("keeps the bundled copy if the hosted one is older, empty or missing", () => {
    expect(useHosted("2026-11-19T14:41:00Z", { fetchedAt: "2026-11-01T00:00:00Z", breaches: many })).toBe(false);
    expect(useHosted("2026-11-19T14:41:00Z", { fetchedAt: "2026-11-21T13:00:00Z", breaches: [] })).toBe(false);
    expect(useHosted("2026-11-19T14:41:00Z", null)).toBe(false);
  });
});
