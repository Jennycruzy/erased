import { describe, expect, it } from "vitest";
import { askByRules, coach, pickLink, trustedLink } from "../src/core/coach";
import { anchorsOf } from "../src/core/html";
import type { StoredRequest } from "../src/core/store";

const T = Date.UTC(2026, 10, 20, 17, 0);
const req = (over: Partial<StoredRequest> = {}): StoredRequest => ({
  id: "r1", domain: "vimeo.com", kind: "delete", law: "ndpa", ref: "ER-CDSXS", company: "Vimeo", route: "email",
  to: "privacy@vimeo.com", formUrl: null, accountEmail: "me@example.com", createdAt: T, events: [{ type: "sent", at: T }], ...over,
});
const reply = (text: string, extra: object = {}) => ({ at: T + 3600e3, from: "privacy@vimeo.com", subject: "Re: Vimeo Support Request #1", text, links: [], ...extra });

describe("reading what the company asks", () => {
  it.each([
    ["As a security precaution, I am responding to me@example.com. If possible, please respond directly from that email.", "confirm_sender"],
    ["For security and verification reasons, we are unable to process requests made by third-party services.", "confirm_sender"],
    ["Log in and submit the form in Request permanent deletion of your data.", "log_in_delete"],
    ["Please click here to fill out the form and request the permanent deletion of your account.", "use_form"],
    ["Your account is scheduled to be permanently deleted in 14 days.", "scheduled"],
    ["Your privacy request verification code is 236375.", "verify_link"],
    ["In order to make sure we follow your instructions properly, please confirm what you would like deleted?", "clarify"],
    ["In order for us to facilitate your request, could you please provide the following:", "provide_info"],
    ["We will need to verify your identity. We will generally require either the successful login to your account.", "wait"],
    ["We have received your message and will review it as soon as possible.", "wait"],
  ])("%s -> %s", (text, ask) => expect(askByRules(text).ask).toBe(ask));

  it("returns the sentence that shows it", () => expect(askByRules("Hi there. Please respond directly from that email. Thanks.").quote).toBe("Please respond directly from that email."));
});

describe("answers", () => {
  it("confirm sender: a reply from the account address, with the checked NDPA lines", () => {
    const a = coach(req(), { ...reply("please respond directly from that email"), ask: "confirm_sender" }, "Ada Obi");
    expect(a.action.type).toBe("email");
    if (a.action.type !== "email") return;
    expect(a.action.to).toBe("privacy@vimeo.com");
    expect(a.action.subject).toBe("Re: Vimeo Support Request #1 [ER-CDSXS]");
    expect(a.action.body).toContain("me@example.com, the email address on my Vimeo account");
    expect(a.action.body).toContain("Section 34(1) of the Nigeria Data Protection Act 2023");
    expect(a.action.body).toContain("Reference: ER-CDSXS");
    expect(a.action.url.startsWith("https://mail.google.com/mail/?view=cm")).toBe(true);
  });

  it("laws we have not checked line by line get plain words, no citation", () => {
    const a = coach(req({ law: "ccpa" }), { ...reply("x"), ask: "confirm_sender" }, "");
    expect(a.legal).toEqual([]);
    if (a.action.type === "email") expect(a.action.body).not.toMatch(/Section|Article|§/);
  });

  it("use form: opens their form first, keeps the lawful email as the second way", () => {
    const links = [{ text: "Unsubscribe", url: "https://zoom.us/unsubscribe" }, { text: "Data Subject Rights Request Form", url: "https://privacyportal.onetrust.com/webform/abc" }];
    const a = coach(req({ domain: "zoom.us", company: "Zoom", to: "privacy@zoom.us" }), { ...reply("complete the form", { from: "customercare@zoom.us", links }), ask: "use_form" }, "");
    expect(a.action).toMatchObject({ type: "open", url: "https://privacyportal.onetrust.com/webform/abc" });
    expect(a.alt?.type).toBe("email");
  });

  it("log in and delete: fair ask, no legal argument", () => {
    const links = [{ text: "Permanently Delete Your Account", url: "https://app.box.com/account" }];
    const a = coach(req({ domain: "box.com", company: "Box", to: "privacy@box.com" }), { ...reply("sign into your personal Box account", { from: "privacy@box.zendesk.com", links }), ask: "log_in_delete" }, "");
    expect(a.action).toMatchObject({ type: "open", url: "https://app.box.com/account" });
    expect(a.legal).toEqual([]);
  });

  it("scheduled deletion: the date, and a warning not to sign in", () => {
    const a = coach(req({ company: "Canva", domain: "canva.com" }), { ...reply("Your account is scheduled to be permanently deleted in 14 days."), ask: "scheduled" }, "");
    expect(a.byMeaning).toBe("do_not_sign_in_before");
    expect(a.headline).toContain("2026-12-04");
    expect(a.why).toMatch(/signing in cancels/);
  });

  it("verify link: knows when it expires", () => {
    const links = [{ text: "Verify My Identity", url: "https://calendly.privacyportal.co/identity?token=x" }];
    const a = coach(req({ company: "Calendly", domain: "calendly.com", to: null }), { ...reply("You must respond within 7 days or your request will expire.", { from: "noreply@m.ketch.com", links }), ask: "verify_link" }, "");
    expect(a.by).toBe(T + 3600e3 + 7 * 864e5);
    expect(a.action).toMatchObject({ type: "open", url: "https://calendly.privacyportal.co/identity?token=x" });
  });
});

describe("links", () => {
  it("only the company's own pages or a privacy-request service", () => {
    const r = req({ domain: "box.com", to: "privacy@box.com" });
    expect(trustedLink(r, "https://app.box.com/account")).toBe(true);
    expect(trustedLink(r, "https://box.zendesk.com/hc/articles/1")).toBe(true);
    expect(trustedLink(r, "https://privacyportal.onetrust.com/webform/x")).toBe(true);
    expect(trustedLink(r, "https://evil.zendesk.com/x")).toBe(false);
    expect(trustedLink(r, "https://bit.ly/x")).toBe(false);
  });
  it("never picks unsubscribe", () => expect(pickLink("use_form", [{ text: "unsubscribe from this form", url: "https://a.com/unsubscribe" }])).toBeNull());
  it("reads anchors and unwraps Gmail's redirect", () => {
    const html = `<p>Fill out <a href="https://www.google.com/url?q=https%3A%2F%2Fasana.com%2Fdsr&amp;sa=D">our form</a> and <a href="mailto:x@y.z">mail</a></p>`;
    expect(anchorsOf(html)).toEqual([{ text: "our form", url: "https://asana.com/dsr" }]);
  });
});

import { nextStep } from "../src/core/coach";
describe("next step for a request", () => {
  const data = (ask: string, text = "x") => ({ ask, askQuote: "", by: "rules", from: "privacy@vimeo.com", subject: "Re: x", text, links: [] }) as never;
  it("a scheduled deletion wins over a later code email", () => {
    const r = req({ events: [{ type: "sent", at: T }, { type: "reply", at: T + 1, reply: "other", quote: "q", coach: data("scheduled", "deleted in 14 days") }, { type: "reply", at: T + 2, reply: "other", quote: "q", coach: data("verify_link") }] });
    expect(nextStep(r, "")?.ask).toBe("scheduled");
  });
  it("the newest ask, and after 'I've done it' back to waiting", () => {
    const r = req({ events: [{ type: "sent", at: T }, { type: "reply", at: T + 1, reply: "ack", quote: "q", coach: data("wait") }, { type: "reply", at: T + 2, reply: "needs_id", quote: "q", coach: data("confirm_sender") }] });
    expect(nextStep(r, "")?.ask).toBe("confirm_sender");
    r.events.push({ type: "step_done", at: T + 3, ask: "confirm_sender" });
    expect(nextStep(r, "")?.ask).toBe("wait");
  });
  it("nothing once they confirm deletion", () => {
    const r = req({ events: [{ type: "sent", at: T }, { type: "reply", at: T + 1, reply: "deleted", quote: "q" }, { type: "reply", at: T + 0.5, reply: "needs_id", quote: "q", coach: data("confirm_sender") }] });
    expect(nextStep(r, "")).toBeNull();
  });
});

import { dropTracking } from "../src/core/html";
describe("link clean-up", () => {
  it("keeps the form's #fragment, drops utm", () => expect(dropTracking("https://privacy-central.securiti.ai/?utm_source=chatgpt.com#/dsr/dacc")).toBe("https://privacy-central.securiti.ai/#/dsr/dacc"));
  it("a link named in the asking sentence wins", () => expect(pickLink("log_in_delete", [{ text: "https://app.box.com/account", url: "https://app.box.com/account" }, { text: "Box Privacy Notice", url: "https://www.box.com/legal/privacypolicy" }], "Visit: https://app.box.com/account and sign into your personal Box account.")?.url).toBe("https://app.box.com/account"));
});

describe("go-ahead", () => {
  it("a written YES is asked for", () => expect(askByRules("To proceed with the cancellation and deletion, we'll need your written confirmation. Please respond with either \" YES \" or \" I AGREE \" to acknowledge.").ask).toBe("go_ahead"));
  it("replies YES in the same thread", () => {
    const a = coach(req({ company: "Loom", domain: "loom.com", to: "privacy@atlassian.com" }), { ...reply("respond with YES", { from: "advocates@atlassiansupport.atlassian.net", subject: "CA-4339437 Request to delete my personal data [ER-G9GRH]" }), ask: "go_ahead" }, "");
    expect(a.action.type === "email" && a.action.body.startsWith("Hello,\n\nYES. I AGREE.")).toBe(true);
    expect(a.action.type === "email" && a.action.subject).toBe("Re: CA-4339437 Request to delete my personal data [ER-G9GRH] [ER-CDSXS]");
  });
});
