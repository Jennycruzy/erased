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

export type ReplyKind = "ack" | "deleted" | "needs_id" | "refused" | "other";

export type RequestEvent =
  | { type: "sent"; at: number }
  | { type: "reply"; at: number; reply: ReplyKind; quote: string; coach?: ReplyCoachData }
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

/** Days after a confirmation (or after the request, which also says stop marketing) before a marketing email counts. */
export const GRACE_DAYS = 3;
/** Quiet days after a confirmation before deletion counts as proven. */
export const PROOF_DAYS = 30;
/** How long to watch for a reset or sign-in email after a sign-in check. */
export const SIGNIN_WAIT_MS = 24 * 3600e3;
/** Days after a follow-up before the complaint pack is offered. */
export const FOLLOW_UP_DAYS = 14;

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
    const provenAt = addDays(confirmed.at, PROOF_DAYS);
    const check = ev.find((e) => e.type === "signin_check" && e.at >= confirmed.at);
    const alive = check && ev.find((e) => e.type === "account_alive" && e.at >= check.at && e.at <= check.at + SIGNIN_WAIT_MS);
    if (alive) {
      return {
        state: "broken", result: "BROKEN_ACCOUNT_STILL_EXISTS", deadline, evidence: alive,
        reason: `Confirmed on ${fmt(confirmed.at)}, but a sign-in email arrived on ${fmt(alive.at)}: the account still exists.`,
      };
    }
    const mail = ev.find((e) => e.type === "marketing" && e.at > addDays(confirmed.at, GRACE_DAYS));
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
        reason: `Confirmed on ${fmt(confirmed.at)} and no marketing for ${PROOF_DAYS} days since${check ? "; sign-in check passed" : ""}.`,
      };
    }
    const days = Math.floor((now - confirmed.at) / 864e5);
    if (check && !checkWaiting) {
      return { state: "signin_checked", deadline, evidence: confirmed, reason: `Confirmed · ${days} day${days === 1 ? "" : "s"} clean · no sign-in email after the check.` };
    }
    return { state: "confirmed", deadline, evidence: confirmed, reason: `Confirmed · ${days} day${days === 1 ? "" : "s"} clean${checkWaiting ? " · sign-in check running" : ""}.` };
  }

  const refused = ev.find((e) => e.type === "reply" && e.reply === "refused");
  if (refused) {
    return { state: "complaint_ready", result: "REFUSED_WITH_REASON", deadline, evidence: refused, reason: `Refused on ${fmt(refused.at)}.` };
  }

  // Every request also says "stop sending me marketing". Once they have had it a few days, more marketing breaks
  // the objection (GDPR and UK GDPR Art 21(3), NDPA s.36(4): "shall no longer be processed for such purposes").
  const still = ev.find((e) => e.type === "marketing" && e.at > addDays(sent.at, GRACE_DAYS));
  if (still) {
    const days = Math.floor((still.at - sent.at) / 864e5);
    return {
      state: "still_marketing", result: "STILL_MARKETING_AFTER_REQUEST", deadline, evidence: still,
      reason: `Still sending marketing ${days} days after you told them to stop (${fmt(still.at)}).`,
    };
  }

  const followUp = ev.find((e) => e.type === "followed_up");
  if (followUp) {
    if (now >= addDays(followUp.at, FOLLOW_UP_DAYS)) {
      const acked = ev.some((e) => e.type === "reply" && e.reply === "ack");
      return {
        state: "complaint_ready", result: acked ? "OVERDUE_ACK_ONLY" : "OVERDUE_NO_REPLY", deadline,
        reason: `No confirmation ${FOLLOW_UP_DAYS} days after the follow-up of ${fmt(followUp.at)}.`,
      };
    }
    return { state: "followed_up", deadline, reason: `Followed up on ${fmt(followUp.at)}.` };
  }

  const needsId = ev.find((e) => e.type === "reply" && e.reply === "needs_id");
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
