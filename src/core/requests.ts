import { LAWS, type LawId, type RequestKind } from "./laws";
import { addDays } from "./time";

export type ReplyKind = "ack" | "deleted" | "needs_id" | "refused" | "other";

export type RequestEvent =
  | { type: "sent"; at: number }
  | { type: "reply"; at: number; reply: ReplyKind; quote: string }
  | { type: "extension_notice"; at: number; quote: string }
  | { type: "marketing"; at: number; subject: string }
  | { type: "followed_up"; at: number }
  | { type: "user_skipped_id"; at: number };

export type State =
  | "drafted" | "sent" | "ack" | "needs_id" | "confirmed" | "proven" | "broken" | "refused"
  | "overdue" | "followed_up" | "complaint_ready";

export type ResultCode =
  | "PROVEN_NO_MAIL_30D" | "BROKEN_MARKETING_AFTER_CONFIRM" | "REFUSED_WITH_REASON" | "OVERDUE_NO_REPLY"
  | "OVERDUE_ACK_ONLY" | "NEEDS_ID_USER_SKIPPED";

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

/** Days after a confirmation before a marketing email counts as a broken promise. */
export const GRACE_DAYS = 3;
/** Quiet days after a confirmation before deletion counts as proven. */
export const PROOF_DAYS = 30;
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
    const broken = ev.find((e) => e.type === "marketing" && e.at > addDays(confirmed.at, GRACE_DAYS));
    if (broken) {
      return {
        state: "broken", result: "BROKEN_MARKETING_AFTER_CONFIRM", deadline, evidence: broken,
        reason: `Confirmed on ${fmt(confirmed.at)}, then sent marketing on ${fmt(broken.at)}.`,
      };
    }
    if (now >= addDays(confirmed.at, PROOF_DAYS)) {
      return {
        state: "proven", result: "PROVEN_NO_MAIL_30D", deadline, evidence: confirmed,
        reason: `Confirmed on ${fmt(confirmed.at)} and no marketing for ${PROOF_DAYS} days since.`,
      };
    }
    return { state: "confirmed", deadline, evidence: confirmed, reason: `Confirmed on ${fmt(confirmed.at)}; watching for ${PROOF_DAYS} days.` };
  }

  const refused = ev.find((e) => e.type === "reply" && e.reply === "refused");
  if (refused) {
    return { state: "complaint_ready", result: "REFUSED_WITH_REASON", deadline, evidence: refused, reason: `Refused on ${fmt(refused.at)}.` };
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
