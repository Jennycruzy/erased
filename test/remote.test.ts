import { afterEach, describe, expect, it } from "vitest";
import { busy, parseModels } from "../src/ai/remote";
import { currentTiming, DEFAULT_TIMING, setTiming, status, type RequestEvent } from "../src/core/requests";

describe("Remote Config values", () => {
  afterEach(() => setTiming(DEFAULT_TIMING));

  it("accepts a short list of Gemini model names", () => {
    expect(parseModels('["gemini-3.5-flash-lite","gemini-3.5-flash"]')).toEqual(["gemini-3.5-flash-lite", "gemini-3.5-flash"]);
  });

  it("rejects anything that is not a list of Gemini names", () => {
    for (const raw of ["", "gemini-3.5-flash", "[]", '["gpt-5"]', '["gemini-3.5-flash", 3]', JSON.stringify(Array(5).fill("gemini-x")), "{"]) {
      expect(parseModels(raw)).toBeNull();
    }
  });

  it("changes the waits only to whole days from 1 to 365", () => {
    expect(setTiming({ proofDays: 45, graceDays: 0, followUpDays: 2.5 })).toEqual({ ...DEFAULT_TIMING, proofDays: 45 });
    expect(setTiming({ graceDays: Number.NaN, followUpDays: 400 })).toEqual({ ...DEFAULT_TIMING, proofDays: 45 });
    expect(setTiming({ graceDays: 7 }).graceDays).toBe(7);
  });

  it("moves to the next model only when one is out of quota or overloaded", () => {
    expect(busy(new Error("[429 Too Many Requests] RESOURCE_EXHAUSTED"))).toBe(true);
    expect(busy(new Error("503 model overloaded"))).toBe(true);
    expect(busy(new Error("400 invalid argument"))).toBe(false);
  });
});

describe("the rules follow the waits", () => {
  afterEach(() => setTiming(DEFAULT_TIMING));
  it("starts from the shipped defaults", () => expect(currentTiming()).toEqual({ graceDays: 3, proofDays: 30, followUpDays: 14 }));
  it("a longer proof_days moves the proven point", () => {
    const d = (x: string) => Date.parse(x + "T12:00:00Z");
    const events: RequestEvent[] = [{ type: "sent", at: d("2026-11-01") }, { type: "reply", at: d("2026-11-10"), reply: "deleted", quote: "your account has been deleted" }];
    const r = { id: "r", domain: "example.com", kind: "delete" as const, law: "gdpr" as const, events };
    expect(status(r, d("2026-12-10")).state).toBe("proven");
    setTiming({ proofDays: 45 });
    expect(status(r, d("2026-12-10")).state).toBe("confirmed");
    expect(status(r, d("2026-12-25")).state).toBe("proven");
  });
});
