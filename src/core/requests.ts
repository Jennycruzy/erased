import { LAWS, type LawId, type RequestKind } from "./laws";
import { addDays } from "./time";

/** What Reply Coach needs, kept with the reply in this browser only. */
export interface ReplyCoachData {
  ask: import("./coach").Ask;
  askQuote: string;
  /** When the message that asked it arrived (a thread's newest date can be your own answer). */
  askAt?: number;
  /** "model" when the on-device model's sentence was found in the email; "rules" otherwise. */
  by: "model" | "rules";
  from: string;
  subject: string;
  text: string;
  links: Array<{ text: string; url: string }>;
}

/** Words a real refusal uses ("we must retain", "we are unable to", "we cannot delete", "no"). */
export const REFUSAL_WORDS = /\b(unable|cannot|can ?not|can't|won't|will not|decline[ds]?|not able|refuse[ds]?|reject(ed)?|retain(ed)?|keep|not possible|not delete|deny|denied)\b|^\s*no\b|\bno(?! longer)\b(?= \w+ (to|can|will|may))/i;
export type ReplyKind = "ack" | "deleted" | "needs_id" | "refused" | "other";
/** Where a reply was read: on this device, or by Gemini in the cloud because the person allowed it. */
export type ReadWhere = "on_device" | "in_cloud";

export type RequestEvent =
  | { type: "sent"; at: number }
  | { type: "reply"; at: number; reply: ReplyKind; quote: string; coach?: ReplyCoachData; read?: ReadWhere }
  | { type: "extension_notice"; at: number; quote: string }
  | { type: "marketing"; at: number; subject: string }
  | { type: "followed_up"; at: number }
  | { type: "user_skipped_id"; at: number }
  /** The person did what the company's reply asked (signed in and deleted, filled the form, verified…). */
  | { type: "step_done"; at: number; ask: import("./coach").Ask }
  /** The user opened the company's password-reset page and asked for a reset, after it said "deleted". */
  | { type: "signin_check"; at: number }
  /** A reset or sign-in email from the company after that check: the account still exists. */
  | { type: "account_alive"; at: number; subject: string };

export type State =
  | "drafted" | "sent" | "ack" | "needs_id" | "confirmed" | "signin_checked" | "proven" | "broken" | "reopened"
  | "refused" | "overdue" | "followed_up" | "complaint_ready" | "still_marketing";

export type ResultCode =
  | "PROVEN_NO_MAIL_30D" | "BROKEN_MARKETING_AFTER_CONFIRM" | "REFUSED_WITH_REASON" | "OVERDUE_NO_REPLY"
  | "OVERDUE_ACK_ONLY" | "NEEDS_ID_USER_SKIPPED" | "BROKEN_ACCOUNT_STILL_EXISTS" | "REOPENED_MAIL_AFTER_PROVEN"
  | "STILL_MARKETING_AFTER_REQUEST";

export interface Request {
  id: string;
  domain: string;
  kind: RequestKind;
  law: LawId;
  events: RequestEvent[];
}

export interface Status {
  state: State;
  result?: ResultCode;
  deadline?: number;
  reason: string;
  /** The event that decided the state, for the proof view. */
  evidence?: RequestEvent;
}

/**
 * The waits the rules use. graceDays: days after a confirmation (or after the request, which also says stop
 * marketing) before a marketing email counts. proofDays: quiet days after a confirmation before deletion counts as
 * proven. followUpDays: days after a follow-up before the complaint pack is offered. Remote Config can change them
 * (grace_days, proof_days, follow_up_days); these are the defaults.
 */
export const DEFAULT_TIMING = { graceDays: 3, proofDays: 30, followUpDays: 14 };
export type Timing = typeof DEFAULT_TIMING;
let timing: Timing = { ...DEFAULT_TIMING };
export const currentTiming = (): Timing => ({ ...timing });

/** Applies new waits. Anything that is not a whole number of days from 1 to 365 keeps its current value. */
export function setTiming(t: Partial<Record<keyof Timing, unknown>>): Timing {
  const ok = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 365;
  const next = { ...timing };
  for (const k of Object.keys(DEFAULT_TIMING) as Array<keyof Timing>) if (ok(t[k])) next[k] = t[k];
  timing = next;
  return currentTiming();
}

/** How long to watch for a reset or sign-in email after a sign-in check. */
export const SIGNIN_WAIT_MS = 24 * 3600e3;

const fmt = (t: number) => new Date(t).toISOString().slice(0, 10);

/** Works out where a request stands. Plain rules; no model involved. */
export function status(r: Request, now: number): Status {
  const ev = [...r.events].sort((a, b) => a.at - b.at);
  const sent = ev.find((e) => e.type === "sent");
  if (!sent) return { state: "drafted", reason: "Not sent yet." };
  const law = LAWS[r.law];
  const extended = ev.some((e) => e.type === "extension_notice");
  const deadline = extended ? law.extendedDeadline(sent.at) : law.deadline(sent.at);

  const confirmed = ev.find((e) => e.type === "reply" && e.reply === "deleted") as Extract<RequestEvent, { type: "reply" }> | undefined;
  if (confirmed) {
    const provenAt = addDays(confirmed.at, timing.proofDays);
    const check = ev.find((e) => e.type === "signin_check" && e.at >= confirmed.at);
    const alive = check && ev.find((e) => e.type === "account_alive" && e.at >= check.at && e.at <= check.at + SIGNIN_WAIT_MS);
    if (alive) {
      return {
        state: "broken", result: "BROKEN_ACCOUNT_STILL_EXISTS", deadline, evidence: alive,
        reason: `Confirmed on ${fmt(confirmed.at)}, but a sign-in email arrived on ${fmt(alive.at)}: the account still exists.`,
      };
    }
    const mail = ev.find((e) => e.type === "marketing" && e.at > addDays(confirmed.at, timing.graceDays));
    if (mail && mail.at >= provenAt) {
      return {
        state: "reopened", result: "REOPENED_MAIL_AFTER_PROVEN", deadline, evidence: mail,
        reason: `Erased since ${fmt(provenAt)}, then marketing on ${fmt(mail.at)}. The case is open again.`,
      };
    }
    if (mail) {
      return {
        state: "broken", result: "BROKEN_MARKETING_AFTER_CONFIRM", deadline, evidence: mail,
        reason: `Confirmed on ${fmt(confirmed.at)}, then sent marketing on ${fmt(mail.at)}.`,
      };
    }
    const checkWaiting = !!check && now < check.at + SIGNIN_WAIT_MS;
    if (now >= provenAt && !checkWaiting) {
      return {
        state: "proven", result: "PROVEN_NO_MAIL_30D", deadline, evidence: confirmed,
        reason: `Confirmed on ${fmt(confirmed.at)} and no marketing for ${timing.proofDays} days since${check ? "; sign-in check passed" : ""}.`,
      };
    }
    const days = Math.floor((now - confirmed.at) / 864e5);
    if (check && !checkWaiting) {
      return { state: "signin_checked", deadline, evidence: confirmed, reason: `Confirmed · ${days} day${days === 1 ? "" : "s"} clean · no sign-in email after the check.` };
    }
    return { state: "confirmed", deadline, evidence: confirmed, reason: `Confirmed · ${days} day${days === 1 ? "" : "s"} clean${checkWaiting ? " · sign-in check running" : ""}.` };
  }

  // Reply Coach's reading wins over the first classifier: a reply that asks for a step (sign in, use our form, prove
  // it's you) is not a refusal, and "we found no account" or "it is scheduled" asks nothing of you.
  const asks = (e: RequestEvent) => (e.type === "reply" ? e.coach?.ask : undefined);
  // A refusal counts only when the sentence it rests on actually refuses: a model can call "we're busy, your ticket
  // is in the queue" a refusal, and that must not turn into a complaint.
  const refuses = (e: RequestEvent) => e.type === "reply" && REFUSAL_WORDS.test(e.quote ?? "");
  const refused = ev.find((e) => e.type === "reply" && e.reply === "refused" && (!asks(e) || asks(e) === "wait") && refuses(e));
  if (refused) {
    return { state: "complaint_ready", result: "REFUSED_WITH_REASON", deadline, evidence: refused, reason: `Refused on ${fmt(refused.at)}.` };
  }

  // Every request also says "stop sending me marketing". Once they have had it a few days, more marketing breaks
  // the objection (GDPR and UK GDPR Art 21(3), NDPA s.36(4): "shall no longer be processed for such purposes").
  const still = ev.find((e) => e.type === "marketing" && e.at > addDays(sent.at, timing.graceDays));
  if (still) {
    const days = Math.floor((still.at - sent.at) / 864e5);
    return {
      state: "still_marketing", result: "STILL_MARKETING_AFTER_REQUEST", deadline, evidence: still,
      reason: `Still sending marketing ${days} days after you told them to stop (${fmt(still.at)}).`,
    };
  }

  const followUp = ev.find((e) => e.type === "followed_up");
  if (followUp) {
    if (now >= addDays(followUp.at, timing.followUpDays)) {
      const acked = ev.some((e) => e.type === "reply" && e.reply === "ack");
      return {
        state: "complaint_ready", result: acked ? "OVERDUE_ACK_ONLY" : "OVERDUE_NO_REPLY", deadline,
        reason: `No confirmation ${timing.followUpDays} days after the follow-up of ${fmt(followUp.at)}.`,
      };
    }
    return { state: "followed_up", deadline, reason: `Followed up on ${fmt(followUp.at)}.` };
  }

  // A check-it's-you ask you have already answered (you replied, signed in, used the link) no longer waits on you.
  const answered = (e: RequestEvent) => ev.some((x) => x.type === "step_done" && x.at >= e.at);
  const needsId = ev.find((e) => e.type === "reply" && e.reply === "needs_id" && asks(e) !== "no_account" && asks(e) !== "scheduled" && !answered(e));
  if (needsId) {
    if (ev.some((e) => e.type === "user_skipped_id")) {
      return { state: "complaint_ready", result: "NEEDS_ID_USER_SKIPPED", deadline, reason: "You chose not to send the identity check they asked for." };
    }
    return { state: "needs_id", deadline, evidence: needsId, reason: "They asked you to confirm your identity." };
  }

  if (now > deadline) {
    const acked = ev.some((e) => e.type === "reply" && e.reply === "ack");
    return { state: "overdue", result: acked ? "OVERDUE_ACK_ONLY" : "OVERDUE_NO_REPLY", deadline, reason: `Legal deadline ${fmt(deadline)} passed.` };
  }
  if (ev.some((e) => e.type === "reply" && e.reply === "ack")) {
    return { state: "ack", deadline, reason: `Received; reply due by ${fmt(deadline)}.` };
  }
  return { state: "sent", deadline, reason: `Sent ${fmt(sent.at)}; reply due by ${fmt(deadline)}.` };
}
