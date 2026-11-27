import { describe, expect, it } from "vitest";
import { firstPerson } from "../src/core/complaint";

describe("complaint wording", () => {
  it("is written by the person, not to them", () =>
    expect(firstPerson("Still sending marketing 3 days after you told them to stop (2026-11-23).")).toBe("Still sending marketing 3 days after I told them to stop (2026-11-23)."));
});
