import { companyDomain } from "./domain";
import { kindFromSubject } from "./headers";
import type { ReplyCoachData, RequestEvent, ReplyKind } from "./requests";
import type { StoredRequest } from "./store";
import { PRIVACY_VENDORS } from "./coach";

/** A Gmail list row, as the content script reports it. */
export interface MailRow { from: string; senders?: string[]; subject: string; at: number; threadId?: string; vendor?: boolean }

const day = (t: number) => { const d = new Date(t); return `${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()}`; };

/** Name words Gmail can match in a sender address: "box" finds privacy@box.com and privacy@box.zendesk.com. */
export function senderWords(r: StoredRequest): string[] {
  const ds = [r.domain, r.to ? companyDomain(r.to) : null, PARENT[r.domain] ?? null].filter(Boolean) as string[];
  return [...new Set(ds.map((d) => d.split(".")[0].toLowerCase()).filter((w) => /^[a-z0-9-]{3,}$/.test(w)))];
}

/**
 * Replies: mail that quotes our reference, or anything from the company's name since the day before we sent.
 * In the live run 20 of 33 replies did not quote the reference (new tickets, "[Request received]"), so the
 * reference alone misses most of them. isCompanySender then drops anyone who is not the company.
 */
export function replyQuery(r: StoredRequest): string {
  const sent = r.events.find((e) => e.type === "sent")?.at ?? r.createdAt;
  const from = [...senderWords(r), ...PRIVACY_VENDORS].map((w) => `from:${w}`).join(" ");
  return `{"${r.ref}" ${from}} after:${day(sent - 864e5)}`;
}

/** Gmail searches the watcher runs for one request. */
export function watchQueries(r: StoredRequest, confirmedAt?: number) {
  const q = {
    sent: `in:sent "${r.ref}"`,
    replies: replyQuery(r),
    marketing: null as string | null,
  };
  if (confirmedAt) {
    const d = new Date(confirmedAt);
    q.marketing = `from:${r.domain} after:${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()} -"${r.ref}"`;
  }
  return q;
}

/** The first sent copy of the request is the sent event. */
export function sentEvent(rows: MailRow[]): RequestEvent | null {
  const at = rows.map((x) => x.at).filter(Number.isFinite).sort((a, b) => a - b)[0];
  return at ? { type: "sent", at } : null;
}

/** Replies count only when they come from the company's own domain. */
/** Help desks that answer for many companies from "<company>.<desk>" addresses (box.zendesk.com, atlassiansupport.atlassian.net). */
const HELP_DESKS = new Set(["zendesk.com", "atlassian.net", "freshdesk.com", "helpscout.net", "zohodesk.com", "kustomer.com", "gorgias.com", "intercom-mail.com"]);
/** Companies whose privacy team writes from the parent's domain. */
const PARENT: Record<string, string> = { "slack.com": "salesforce.com", "tableau.com": "salesforce.com", "linkedin.com": "microsoft.com", "github.com": "microsoft.com", "youtube.com": "google.com", "instagram.com": "meta.com", "whatsapp.com": "meta.com" };

/** True if this sender can speak for the company in `r`. A stranger quoting the reference is not enough. */
export function isCompanySender(r: StoredRequest, from: string): boolean {
  const d = companyDomain(from);
  if (!d) return false;
  if (d === r.domain || (r.to && companyDomain(r.to) === d) || PARENT[r.domain] === d) return true;
  if (HELP_DESKS.has(d)) {
    const label = (from.split("@").pop() ?? "").toLowerCase().slice(0, -d.length - 1).split(".").pop() ?? "";
    const names = [r.domain, r.to ? companyDomain(r.to) : null].filter(Boolean).map((x) => x!.split(".")[0].toLowerCase());
    return label.length >= 3 && names.some((name) => label.includes(name) || name.includes(label));
  }
  return false;
}

/** Rows with a reply from the company; `from` is set to the company sender (a thread row can list you first). */
/** Password-reset mail is never a reply to the request (it is what the sign-in check looks for). */
export const isResetMail = (subject: string) => /reset (your )?password|password reset|change (your )?password|forgot (your )?password/i.test(subject);

export function companyReplies(r: StoredRequest, rows: MailRow[]): MailRow[] {
  const sent = r.events.find((e) => e.type === "sent")?.at ?? r.createdAt;
  return rows.flatMap((x) => {
    if (x.at < sent - 3600e3) return []; // an hour's margin: form requests are marked sent by hand
    // Two requests to one privacy team (Trello and Loom both to Atlassian): a subject naming the other reference is theirs.
    const refs: string[] = x.subject.match(/\bER-[A-Z0-9]{5}\b/g) ?? [];
    if (refs.length && !refs.includes(r.ref)) return [];
    const who = [x.from, ...(x.senders ?? [])].find((s) => isCompanySender(r, s));
    if (who) return [{ ...x, from: who }];
    // Privacy-request services (Ketch, OneTrust…) write for many companies: kept only if the email names this one.
    const vendor = [x.from, ...(x.senders ?? [])].find((s) => PRIVACY_VENDORS.has(companyDomain(s) ?? ""));
    return vendor ? [{ ...x, from: vendor, vendor: true }] : [];
  });
}

/** A privacy-service email counts for this request only if it names the company (calendly.privacyportal.co). */
export function mentionsCompany(r: StoredRequest, text: string): boolean {
  const t = text.toLowerCase().replace(/\s+/g, "");
  const label = r.domain.split(".")[0].toLowerCase();
  return label.length >= 4 && t.includes(label);
}

/** Turns an on-device reply reading into an event, only if its quote was found in the email. */
export function replyEvent(at: number, read: { reply: ReplyKind | "unrelated"; extension: boolean; quote: string; quoteOk: boolean }, coach?: ReplyCoachData): RequestEvent[] {
  if (!read.quoteOk || read.reply === "unrelated") return [];
  const out: RequestEvent[] = [{ type: "reply", at, reply: read.reply, quote: read.quote, ...(coach ? { coach } : {}) }];
  if (read.extension) out.push({ type: "extension_notice", at, quote: read.quote });
  return out;
}

/** Marketing after a confirmation: the on-device reading decides when available; otherwise the subject rules. */
export function marketingEvent(row: MailRow, device?: { marketing: boolean; quoteOk: boolean }): RequestEvent | null {
  const isMarketing = device ? device.marketing && device.quoteOk : kindFromSubject(row.subject) === "newsletter";
  return isMarketing ? { type: "marketing", at: row.at, subject: row.subject } : null;
}
