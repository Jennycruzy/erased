import { describe, expect, it } from "vitest";
import { numbered, pick, sentencesOf } from "../src/core/sentences";
import { quoteIsIn } from "../src/core/quote";

describe("sentencesOf", () => {
  const body = "Hi there.\nThanks for creating your Figma account! Your account is ready.\n\nStart now";
  const s = sentencesOf(body);
  it("splits on sentence ends and lines", () => expect(s).toEqual(["Hi there.", "Thanks for creating your Figma account!", "Your account is ready.", "Start now"]));
  it("every sentence is found in the original text", () => s.forEach((x) => expect(quoteIsIn(x, body)).toBe(true)));
  it("numbers from 1", () => expect(numbered(s).split("\n")[1]).toBe("[2] Thanks for creating your Figma account!"));
  it("pick is safe on bad numbers", () => { expect(pick(s, 2)).toBe(s[1]); expect(pick(s, 0)).toBe(""); expect(pick(s, 9)).toBe(""); expect(pick(s, "2")).toBe(""); expect(pick(s, 1.5)).toBe(""); });
  it("caps the count", () => expect(sentencesOf("a. ".repeat(200).replace(/a/g, "ab"), 10)).toHaveLength(10));
});

describe("sentencesOf keeps addresses whole", () => {
  it("does not split inside an email address or domain", () => expect(sentencesOf("Write to erased.demo.inbox@gmail.com today. Visit monday.com now!")).toEqual(["Write to erased.demo.inbox@gmail.com today.", "Visit monday.com now!"]));
});

import { notDoneYet } from "../src/core/quote";
describe("notDoneYet", () => {
  it("a scheduled deletion is only an ack", () => expect(notDoneYet("deleted", "Your account is scheduled to be permanently deleted in 14 days.")).toBe("ack"));
  it("a done deletion stays deleted", () => expect(notDoneYet("deleted", "We have deleted your account and personal data.")).toBe("deleted"));
  it("other labels pass through", () => expect(notDoneYet("needs_id", "It will be deleted once you verify.")).toBe("needs_id"));
});
describe("notDoneYet on live-run false positives", () => {
  for (const q of ["I acknowledge that you want to cancel your subscription and possibly delete your account and any associated data.",
    "For all data deletion requests made by or on behalf of the data subject, we verify identity.",
    "To request deletion of your personal data, complete the Data Subject Rights Request Form here:",
    "We have received you request to delete personal data we hold about you"]) it(`not proof: ${q.slice(0, 40)}`, () => expect(notDoneYet("deleted", q)).toBe("ack"));
  for (const q of ["Your account has been permanently deleted.", "We have deleted all personal data associated with your email.", "Your data was erased on 3 December.", "We no longer hold any personal data about you."]) it(`proof: ${q.slice(0, 40)}`, () => expect(notDoneYet("deleted", q)).toBe("deleted"));
});
