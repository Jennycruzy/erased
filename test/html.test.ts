import { describe, expect, it } from "vitest";
import { decodeEntities, gmailIdKey, hexThreadId, htmlToText, latestMessage, printViewUrl } from "../src/core/html";

const PRINT = `<html><head><title>Gmail - Almost done</title><style>.x{color:red}</style><script>var a=1;</script></head>
<body><table><tr><td><b>Example</b> &lt;no-reply@example.com&gt;</td><td>Fri, Nov 20, 2026 at 7:23&#8239;PM</td></tr></table>
<div>You recently created an account, but it&#39;s not quite complete.<br>Finish&nbsp;set up</div><!-- hidden --><p>&copy;2026 Example &amp; Co.</p></body></html>`;

describe("htmlToText", () => {
  const t = htmlToText(PRINT);
  it("drops head, scripts, styles and comments", () => { expect(t).not.toMatch(/Gmail - Almost done|color:red|var a|hidden/); });
  it("decodes entities", () => { expect(t).toContain("<no-reply@example.com>"); expect(t).toContain("it's not quite complete."); expect(t).toContain("©2026 Example & Co."); });
  it("keeps line breaks at <br> and block ends", () => expect(t.split("\n")).toContain("Finish set up"));
  it("leaves no tags and no runs of blank lines", () => { expect(t).not.toMatch(/<\/?(b|div|p|td|tr|table|br)\b/i); expect(t).not.toMatch(/\n{3}/); });
  it("leaves unknown entities alone", () => expect(decodeEntities("a &bogus; b &#x1F600;")).toBe("a &bogus; b 😀"));
});

describe("gmail print view", () => {
  it("finds the key in current Gmail source", () => expect(gmailIdKey(`x];var GM_ID_KEY = '67dfc6839a';var GM_INBOX_TYPE`)).toBe("67dfc6839a"));
  it("finds the older JSON form", () => expect(gmailIdKey(`{"ik":"0a1b2c3d4e"}`)).toBe("0a1b2c3d4e"));
  it("returns null with no key", () => expect(gmailIdKey("<html></html>")).toBeNull());
  it("keeps hex legacy ids", () => expect(hexThreadId("1a1fa69b0b2f467e")).toBe("1a1fa69b0b2f467e"));
  it("turns decimal thread-f ids into hex", () => expect(hexThreadId("#thread-f:1879395838477698686")).toBe(BigInt("1879395838477698686").toString(16)));
  it("rejects junk", () => expect(hexThreadId("abc")).toBeNull());
  it("builds a th= URL with the key", () => expect(printViewUrl("/mail/u/0/", "67dfc6839a", "1a1fa69b0b2f467e")).toBe("/mail/u/0/?ik=67dfc6839a&view=pt&search=all&th=1a1fa69b0b2f467e"));
});

describe("latestMessage", () => {
  const thread = [
    "erased demo <me@example.com>", "", "Re: Request to delete my personal data [ER-1]", "2 messages", "",
    "erased demo <me@example.com> Fri, Nov 20, 2026 at 5:10 PM To: privacy@acme.com", "", "Please delete my account registered to me@example.com.", "",
    "Acme Privacy <privacy@acme.com> Fri, Nov 20, 2026 at 6:47 PM Reply-To: Acme <privacy@acme.com>", "To: me@example.com", "",
    "Hi, we have deleted your account.", "Regards, Acme", "", "On Fri, Nov 20, 2026 at 5:10 PM erased demo <me@example.com> wrote:", "> Please delete my account.",
  ].join("\n");
  it("takes the sender's newest message without headers or quoted history", () => expect(latestMessage(thread, "privacy@acme.com")).toBe("Hi, we have deleted your account.\nRegards, Acme"));
  it("falls back to the newest message when the sender is unknown", () => expect(latestMessage(thread, "x@y.z")).toContain("we have deleted"));
  it("picks the requested sender even when not last", () => expect(latestMessage(thread, "me@example.com")).toBe("Please delete my account registered to me@example.com."));
  it("returns the text unchanged if no header is recognised", () => expect(latestMessage("just text", "a@b.c")).toBe("just text"));
});

describe("preheader filler", () => {
  it("drops invisible padding characters and empty lines they leave", () => expect(htmlToText("<p>Hi ͏ ͏ ­­</p><p>͏ ͏</p><p>Your account is scheduled</p>")).toBe("Hi\n\nYour account is scheduled"));
});

describe("help-desk quoted history", () => {
  const head = "Meetup Support <privacy@meetup.com> Fri, Nov 20, 2026 at 5:30 PM To: me@example.com";
  const own = ["Peter", "Nov 20, 2026, 12:20 EST", "Hi,", "Log in and use the form to delete your data.", "Warm regards,", "Peter"];
  const quoted = ["", "erased demo", "Nov 20, 2026, 12:17 EST", "Dear Meetup privacy team,", "If you need to verify my identity, please tell me."];
  const body = latestMessage([head, ...own, ...quoted].join("\n"), "privacy@meetup.com");
  it("keeps the reply's own opening name and date", () => expect(body.startsWith("Peter\nNov 20, 2026, 12:20 EST")).toBe(true));
  it("cuts the quoted request below it", () => { expect(body).not.toContain("verify my identity"); expect(body).not.toContain("erased demo"); });
});

import { messageTimes } from "../src/core/html";
describe("messageTimes", () => {
  it("reads sender and time of each message", () => {
    const t = messageTimes("me <me@x.com> Fri, Nov 20, 2026 at 5:10 PM To: a@b.com\nhi\nAcme <privacy@acme.com> Fri, Nov 20, 2026 at 6:47 PM Reply-To: x\nok");
    expect(t.map((x) => x.email)).toEqual(["me@x.com", "privacy@acme.com"]);
    expect(t[1].at - t[0].at).toBe(97 * 60000);
  });
});
