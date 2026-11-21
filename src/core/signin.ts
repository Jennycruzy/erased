import type { RequestEvent } from "./requests";
import type { StoredRequest } from "./store";
import { SIGNIN_WAIT_MS } from "./requests";
import { senderWords, type MailRow } from "./watch";

/**
 * Password-reset pages where the check was tested: a reset email arrives within a minute for a live account and
 * none for an address with no account. The check is offered only for these. Accounts made with "Sign in with
 * Google" answer differently and are not covered.
 */
export const RESET_PAGES: Record<string, string> = {
  "vimeo.com": "https://vimeo.com/forgot_password",
  "zapier.com": "https://zapier.com/app/login/forgot",
};

export const resetPage = (r: Pick<StoredRequest, "domain">): string | null => RESET_PAGES[r.domain] ?? null;

const day = (t: number) => { const d = new Date(t); return `${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()}`; };

/** Mail from the company since the check that looks like a reset or sign-in email. */
export function signInQuery(r: StoredRequest, checkAt: number): string {
  const from = senderWords(r).map((w) => `from:${w}`).join(" OR ");
  return `(${from}) after:${day(checkAt - 864e5)} (password OR reset OR "sign in" OR "log in" OR login OR "welcome back") -"${r.ref}"`;
}

const SIGNIN_SUBJECT = /password|reset|sign.?in|log.?in|welcome back|verification code|one.?time code/i;

/** The first reset or sign-in email within 24 hours after the check, if any. */
export function accountAliveEvent(checkAt: number, rows: MailRow[]): RequestEvent | null {
  const hit = rows.filter((x) => x.at >= checkAt - 60e3 && x.at <= checkAt + SIGNIN_WAIT_MS && SIGNIN_SUBJECT.test(x.subject)).sort((a, b) => a.at - b.at)[0];
  return hit ? { type: "account_alive", at: hit.at, subject: hit.subject } : null;
}
