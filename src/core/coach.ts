import { companyDomain } from "./domain";
import { LAWS, type LawId } from "./laws";
import { composeUrl } from "./templates";
import type { StoredRequest } from "./store";

/**
 * Reply Coach: what a company's reply asks the person to do, and the quickest lawful way to get the request done.
 * The model (or the rules below) only picks WHAT was asked, with a sentence from the email as proof.
 * Every answer is fixed text from this file; the model never writes or edits it.
 */
export type Ask =
  | "confirm_sender" // "reply from the account's email", "we can't take requests from third-party services"
  | "log_in_delete" // "sign in and delete it in settings"
  | "use_form" // "fill out our privacy form"
  | "verify_link" // "click to verify", "enter this code"
  | "go_ahead" // "reply YES to confirm you want it deleted"
  | "clarify" // "what would you like deleted?"
  | "provide_info" // "please provide the following"
  | "scheduled" // "your account will be deleted in 14 days"
  | "wait"; // receipt or ticket only

export const ASKS: readonly Ask[] = ["wait", "scheduled", "verify_link", "go_ahead", "confirm_sender", "clarify", "provide_info", "use_form", "log_in_delete"];

export interface Link { text: string; url: string }

export interface Advice {
  ask: Ask;
  /** One line, plain words. */
  headline: string;
  /** Why this is the right move, in plain words. */
  why: string;
  /** Legal lines used in the email, already checked against the law's text. Empty when none apply. */
  legal: string[];
  /** The main thing to do. */
  action:
    | { type: "email"; label: string; to: string; subject: string; body: string; url: string }
    | { type: "open"; label: string; url: string }
    | { type: "wait"; label: string };
  /** A second way, when there is one. */
  alt?: Advice["action"];
  /** Do it before this time (a link that expires), or never before it (a scheduled deletion). */
  by?: number;
  byMeaning?: "expires" | "do_not_sign_in_before";
}

const DAY = 864e5;
const day = (t: number) => new Date(t).toISOString().slice(0, 10);

/** Rule-based reading of the reply: which ask, and the sentence that shows it. First match wins. */
const RULES: Array<[Ask, RegExp]> = [
  ["scheduled", /\b(is|has been) scheduled to be (permanently )?deleted\b|\bwill be (permanently )?deleted in \d+ days\b/i],
  ["verify_link", /\b(verify my identity|verification (code|request|link)|one-time code|enter the code|confirm your identity by clicking|email verification request)\b/i],
  ["confirm_sender", /\b(respond directly from (that|this|the) email|from the email address linked to your account|third[- ]party (service|services)|don'?t see an account linked to the email)\b/i],
  ["go_ahead", /\brespond with (either )?["“”\s]*(yes|i agree)\b|\b(written|your) (confirmation|consent) to (proceed|move forward|go ahead)\b|\breply (with )?["“”\s]*(yes|confirm)["“”\s]* to (proceed|confirm)\b/i],
  ["clarify", /\b(confirm what (you would like|you'd like) (deleted|to delete)|what (data|information) (you would like|you'd like) (deleted|removed))\b/i],
  ["provide_info", /\b(could you please provide|please provide (us with )?the following|we (will )?need the following)\b/i],
  ["log_in_delete", /\b(log ?in|sign in) and (submit|fill|complete|request|delete)\b/i],
  ["use_form", /\b((fill out|complete|submit)( our| the)?( data subject( rights)?| privacy| deletion)?( request)? (form|webform)|privacy form|request form|data subject rights request form)\b/i],
  ["log_in_delete", /(^|\b(please|you (must|need to|can|will need to)|and)\s)(sign (in|into)|log ?in)( to)? (to )?your [\w ]{0,20}account\b|\byou can (also )?delete your [\w ]{0,20}(account|profile)\b|\bsettings page\b|\bself-service\b|\bdelete (your|the) [\w ]{0,20}account (yourself|from)\b|\bpermanently delete your account\b|\b(easy|simple) steps\b|\bdelete my data\b/i],
];

export function sentencesWithin(text: string): string[] {
  return text.replace(/\s*\n+\s*/g, "\n").split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter((s) => s.length > 3);
}

export function askByRules(text: string): { ask: Ask; quote: string } {
  const sents = sentencesWithin(text);
  for (const [ask, re] of RULES) {
    const s = sents.find((x) => re.test(x));
    if (s) return { ask, quote: s };
  }
  // Nothing asked: quote the line that confirms receipt, never a help-desk separator or a greeting.
  const real = sents.filter((x) => /[a-z]{3}/i.test(x) && !/^[#\-—_=*\s]|reply above this line|^(hi|hello|hey)\b[^.]{0,30}[!,.]?$/i.test(x) && !/<[^>]+@[^>]+>/.test(x));
  return { ask: "wait", quote: real.find((x) => /receiv|got your|thank|review|in touch|case|ticket/i.test(x)) ?? real[0] ?? "" };
}

const STRONG: Partial<Record<Ask, RegExp>> = {
  use_form: /\bform\b|webform|data subject|privacy[- ]?(portal|center|centre|central)|delet|eras/i,
  log_in_delete: /delet|eras|close[- ]?(your[- ]?)?account|take control/i,
  verify_link: /verif|identity|confirm/i,
};
const WEAK = /account|settings|privacy|request/i;
const NEVER = /unsubscribe|preferences|\/comm\/|notification|manage (your )?(email|subscription)|facebook|twitter|\/\/(www\.)?x\.com\/|linkedin|instagram|youtube|apps\.apple|play\.google|mailto:|maps\/search|subscription|licens/i;

/** The link in the reply that does the ask: the company's own (or its privacy vendor's) page, never unsubscribe. */
export function pickLink(ask: Ask, links: Link[], quote = ""): Link | null {
  const strong = STRONG[ask];
  if (!strong) return null;
  const ok = links.filter((l) => !NEVER.test(l.url) && !NEVER.test(l.text));
  const q = quote.replace(/\s+/g, "").toLowerCase();
  const named = (l: Link) => { const u = l.url.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase(); return u.length > 6 && q.includes(u) ? 5 : 0; };
  const score = (l: Link) => named(l) + (strong.test(l.text) ? 4 : 0) + (strong.test(l.url) ? 3 : 0) + (WEAK.test(l.text) ? 1 : 0) + (WEAK.test(l.url) ? 1 : 0);
  const best = [...ok].sort((x, y) => score(y) - score(x))[0];
  return best && score(best) >= 3 ? best : null;
}

/** Checked legal lines. Only laws whose wording we read in the source text get a line; others get plain words. */
function legalLines(law: LawId, topic: "channel" | "sender" | "id"): string[] {
  switch (law) {
    case "gdpr":
      return topic === "id"
        ? ["The EDPB's Guidelines 01/2022 (para. 73) say it is disproportionate to ask for a copy of an identity document when the account holder is already authenticated; you can confirm it is me through this email address."]
        : ["Article 12(2) GDPR requires you to facilitate the exercise of my rights, and the EDPB's Guidelines 01/2022 confirm a request may be sent to a controller's official contact point instead of its preferred channel. I sent it to your privacy address."];
    case "uk_gdpr":
      return topic === "id" ? [] : ["Article 12(2) UK GDPR requires you to facilitate the exercise of my rights. I sent this request to your privacy address."];
    case "ndpa":
      return ["Section 34(1) of the Nigeria Data Protection Act 2023 gives me the right to obtain erasure from you without constraint or unreasonable delay, and section 35(2) requires withdrawing consent to be as easy as giving it."];
    default:
      return [];
  }
}

function replyEmail(r: StoredRequest, fullName: string, to: string, theirSubject: string, lines: string[]) {
  const base = /^re\s*:/i.test(theirSubject.trim()) ? theirSubject.trim() : `Re: ${theirSubject.trim()}`;
  const subject = base.includes(r.ref) ? base : `${base} [${r.ref}]`;
  const body = [`Hello,`, ``, ...lines, ``, `Reference: ${r.ref}`, ``, `Kind regards,`, fullName || r.accountEmail].join("\n");
  return { type: "email" as const, label: "Write the reply", to, subject, body, url: composeUrl(to, subject, body) };
}

/** A deadline the company sets in its reply ("within 7 days", "in 14 days"), from when the reply arrived. */
export function daysIn(text: string, at: number, re: RegExp): number | undefined {
  const m = text.match(re);
  return m ? at + Number(m[1]) * DAY : undefined;
}

export function coach(
  r: StoredRequest,
  reply: { ask: Ask; at: number; from: string; subject: string; text: string; links: Link[]; quote?: string },
  fullName: string,
): Advice {
  const law = LAWS[r.law];
  const to = reply.from.includes("noreply") || reply.from.includes("no-reply") ? (r.to ?? reply.from) : reply.from;
  const link = pickLink(reply.ask, reply.links.filter((l) => trustedLink(r, l.url, reply.from)), reply.quote ?? askByRules(reply.text).quote);
  const company = r.company;
  const legal = (t: "channel" | "sender" | "id") => legalLines(r.law, t);
  const erase = `Please go ahead and erase my ${company} account and all personal data you hold about me.`;

  switch (reply.ask) {
    case "confirm_sender": {
      const lines = [
        `This request comes from ${r.accountEmail}, the email address on my ${company} account, and I sent it myself from this address. It was not sent by a third-party service.`,
        erase,
        ...legal("sender"),
      ];
      return {
        ask: "confirm_sender",
        headline: `${company} wants to know the request really comes from you`,
        why: `It does: it was sent from ${r.accountEmail}. One short reply from this address answers it.`,
        legal: legal("sender"),
        action: replyEmail(r, fullName, to, reply.subject, lines),
        alt: link ? { type: "open", label: "Or delete it in your account", url: link.url } : undefined,
      };
    }
    case "log_in_delete":
      return {
        ask: "log_in_delete",
        headline: `${company} asks you to sign in and delete the account yourself`,
        why: "This is a fair ask: signing in is how they check it is you. It is also the quickest way to get it done.",
        legal: [],
        action: link ? { type: "open", label: "Open their deletion page", url: link.url } : { type: "wait", label: "Sign in to your account and look for Delete account in the settings" },
      };
    case "use_form": {
      const lines = [
        `You asked me to use your form. I made this request to your privacy address, which is a valid way to make it.`,
        erase,
        ...legal("channel"),
        `If you need to check it is me, please send a confirmation link to ${r.accountEmail}.`,
      ];
      const email = replyEmail(r, fullName, to, reply.subject, lines);
      return {
        ask: "use_form",
        headline: `${company} wants its own form filled in`,
        why: "The form is usually the quickest. You do not have to use it: your email to their privacy address counts, and the reply below says so.",
        legal: legal("channel"),
        action: link ? { type: "open", label: "Open their form", url: link.url } : email,
        alt: link ? email : undefined,
      };
    }
    case "verify_link": {
      const by = daysIn(reply.text, reply.at, /within (\d+) days/i) ?? (/expire in \d+ minutes/i.test(reply.text) ? reply.at + 10 * 60e3 : undefined);
      const expired = by !== undefined && by < Date.now();
      return {
        ask: "verify_link",
        headline: expired ? `${company}'s check-it's-you code has expired` : `${company} sent a link or code to check it is you`,
        why: expired ? "Ask for a new code on their privacy page, then use it straight away." : "This is a fair check, done through your own email. Click it before it runs out, or the request closes.",
        legal: [],
        action: link ? { type: "open", label: expired ? "Open their privacy page" : "Verify now", url: link.url } : { type: "wait", label: "Open the email and use the code or link in it" },
        by,
        byMeaning: by ? "expires" : undefined,
      };
    }
    case "go_ahead":
      return {
        ask: "go_ahead",
        headline: `${company} is ready to delete and wants a written yes`,
        why: "Reply YES and they go ahead. Their warning that it is permanent is what you asked for.",
        legal: [],
        action: replyEmail(r, fullName, to, reply.subject, [
          `YES. I AGREE.`,
          `I understand the deletion is permanent and cannot be undone, and I give you my consent to go ahead and delete my ${company} account and all data linked to it.`,
        ]),
      };
    case "clarify":
      return {
        ask: "clarify",
        headline: `${company} asks what you want deleted`,
        why: "Answer: everything. One reply settles it.",
        legal: [],
        action: replyEmail(r, fullName, to, reply.subject, [
          `I would like you to delete my whole ${company} account and all personal data you hold about me, including any copies, backups and marketing lists.`,
          `The account is registered to ${r.accountEmail}.`,
        ]),
      };
    case "provide_info":
      return {
        ask: "provide_info",
        headline: `${company} asks for more details`,
        why: "Give only what links you to the account: your name and the account email. Nothing more is needed to find it.",
        legal: legal("id"),
        action: replyEmail(r, fullName, to, reply.subject, [
          `The account is registered to ${r.accountEmail}${fullName ? `, in the name ${fullName}` : ""}, and this reply comes from that address.`,
          erase,
          ...legal("id"),
        ]),
      };
    case "scheduled": {
      const by = daysIn(reply.text, reply.at, /in (\d+) days/i);
      return {
        ask: "scheduled",
        headline: `${company} will delete the account${by ? ` on ${day(by)}` : ""}`,
        why: "Do not sign in before then: signing in cancels the deletion.",
        legal: [],
        action: { type: "wait", label: by ? `Nothing to do. Stay signed out until ${day(by)}.` : "Nothing to do. Stay signed out." },
        by,
        byMeaning: by ? "do_not_sign_in_before" : undefined,
      };
    }
    default: {
      const due = law.deadline(r.events.find((e) => e.type === "sent")?.at ?? r.createdAt);
      return {
        ask: "wait",
        headline: `${company} has your request`,
        why: `Nothing to do yet. They have until ${day(due)} under ${law.name}.`,
        legal: [],
        action: { type: "wait", label: `Wait until ${day(due)}` },
      };
    }
  }
}

/** Privacy-request services that host forms and checks for many companies. */
export const PRIVACY_VENDORS = new Set(["onetrust.com", "ketch.com", "privacyportal.co", "ethyca.com", "transcend.io", "datagrail.io", "securiti.ai", "trustarc.com", "osano.com", "mineos.ai"]);
/** Help desks that host a company's help pages. */
const DESKS = new Set(["zendesk.com", "atlassian.net", "freshdesk.com", "helpscout.net", "zohodesk.com"]);

/** True when a link points at the company itself or a privacy-request service; never a random site. */
export function trustedLink(r: StoredRequest, url: string, sender?: string): boolean {
  let host = "";
  try { host = new URL(url).hostname; } catch { return false; }
  const d = companyDomain(host);
  if (!d) return false;
  // The verified sender's own domain counts too (Slack's privacy team writes from salesforce.com), unless it is a help desk.
  const from = sender ? companyDomain(sender) : null;
  const own = [r.domain, r.to ? companyDomain(r.to) : null, from && !DESKS.has(from) ? from : null].filter(Boolean) as string[];
  if (own.includes(d) || PRIVACY_VENDORS.has(d)) return true;
  const name = r.domain.split(".")[0];
  return DESKS.has(d) && host.split(".")[0].includes(name);
}

/** The next step for a request: a scheduled deletion first, else the newest reply that asks for something. */
export function nextStep(r: StoredRequest, fullName: string): Advice | null {
  const replies = r.events.filter((e): e is Extract<StoredRequest["events"][number], { type: "reply" }> => e.type === "reply" && !!e.coach).sort((a, b) => a.at - b.at);
  if (!replies.length || r.events.some((e) => e.type === "reply" && e.reply === "deleted")) return null;
  const done = Math.max(0, ...r.events.filter((e) => e.type === "step_done").map((e) => e.at));
  const open = replies.filter((e) => e.at > done);
  const pickOne = replies.find((e) => e.coach!.ask === "scheduled") ?? [...open].reverse().find((e) => e.coach!.ask !== "wait") ?? open[open.length - 1];
  if (!pickOne) return coach(r, { ask: "wait", at: done, from: "", subject: "", text: "", links: [] }, fullName);
  const c = pickOne.coach!;
  return coach(r, { ask: c.ask, at: pickOne.at, from: c.from, subject: c.subject, text: c.text, links: c.links }, fullName);
}
