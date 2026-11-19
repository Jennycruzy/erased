import { companyDomain } from "./domain";
import { kindFromSubject } from "./headers";
import type { RequestEvent, ReplyKind } from "./requests";
import type { StoredRequest } from "./store";

/** A Gmail list row, as the content script reports it. */
export interface MailRow { from: string; subject: string; at: number; threadId?: string }

/** Gmail searches the watcher runs for one request. */
export function watchQueries(r: StoredRequest, confirmedAt?: number) {
  const q = {
    sent: `in:sent "${r.ref}"`,
    replies: `"${r.ref}" -in:sent`,
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
export function companyReplies(r: StoredRequest, rows: MailRow[]): MailRow[] {
  return rows.filter((x) => companyDomain(x.from) === r.domain || (r.to && companyDomain(r.to) === companyDomain(x.from)));
}

/** Turns an on-device reply reading into an event, only if its quote was found in the email. */
export function replyEvent(at: number, read: { reply: ReplyKind; extension: boolean; quote: string; quoteOk: boolean }): RequestEvent[] {
  if (!read.quoteOk) return [];
  const out: RequestEvent[] = [{ type: "reply", at, reply: read.reply, quote: read.quote }];
  if (read.extension) out.push({ type: "extension_notice", at, quote: read.quote });
  return out;
}

/** Marketing after a confirmation: the on-device reading decides when available; otherwise the subject rules. */
export function marketingEvent(row: MailRow, device?: { marketing: boolean; quoteOk: boolean }): RequestEvent | null {
  const isMarketing = device ? device.marketing && device.quoteOk : kindFromSubject(row.subject) === "newsletter";
  return isMarketing ? { type: "marketing", at: row.at, subject: row.subject } : null;
}
