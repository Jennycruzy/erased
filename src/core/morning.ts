import { status, type State } from "./requests";
import type { StoredRequest } from "./store";
import { DAY } from "./time";

export interface MorningCard {
  lines: string[];
  /** Number shown on the extension icon. */
  badge: number;
}

/** Reply Coach's reading of the newest reply, in the words the morning card uses. */
const STEP: Partial<Record<import("./coach").Ask, string>> = {
  log_in_delete: "wants you to sign in and delete the account yourself",
  use_form: "wants its own form filled in",
  verify_link: "sent a link or code to check it's you",
  confirm_sender: "wants to know the request really comes from you",
  go_ahead: "is ready to delete and wants a written yes",
  clarify: "asks what you want deleted",
  provide_info: "asks for more details",
};

const NEEDS_YOU: ReadonlySet<State> = new Set(["needs_id", "overdue", "complaint_ready", "broken", "still_marketing"]);

/** What changed since yesterday and what needs the user, in plain words. */
export function morningCard(reqs: StoredRequest[], now: number, lastSeen: number): MorningCard {
  const lines: string[] = [];
  let badge = 0;
  for (const r of reqs) {
    const s = status(r, now);
    const fresh = r.events.filter((e) => e.at > lastSeen);
    // Events are not stored in time order: take the newest reply Reply Coach read, by its date.
    const newest = r.events.filter((e) => e.type === "reply" && e.coach).sort((a, b) => b.at - a.at)[0];
    const ask = newest?.type === "reply" ? newest.coach?.ask : undefined;
    const done = !!newest && r.events.some((e) => e.type === "step_done" && (e.at >= newest.at || e.ask === ask));
    if (s.state !== "broken" && s.state !== "still_marketing" && s.state !== "proven" && s.state !== "confirmed") {
      if (ask === "no_account") { lines.push(`${r.company} found no account under your address. Nothing to delete.`); continue; }
      if (ask === "scheduled") { lines.push(`${r.company} will delete the account. Stay signed out until it does.`); continue; }
      if (ask && STEP[ask] && !done) { lines.push(`${r.company} ${STEP[ask]}.`); badge++; continue; }
      if (ask && STEP[ask] && done) { lines.push(`${r.company} has your answer. Nothing to do until they reply.`); continue; }
    }
    if (s.state === "broken" && s.result === "BROKEN_ACCOUNT_STILL_EXISTS") lines.push(`${r.company} said your account was deleted, but it still answers a password reset. Complaint ready.`);
    else if (s.state === "broken") lines.push(`${r.company} said your data was deleted, then emailed you again. Complaint ready.`);
    else if (s.state === "reopened") lines.push(`${r.company} emailed you again after the deletion was proven. The case is open again.`);
    else if (s.state === "still_marketing") lines.push(`${r.company} is still sending you marketing after you told it to stop. The email to send is ready.`);
    else if (s.state === "needs_id") lines.push(`${r.company} wants you to confirm it's you.`);
    else if (s.state === "overdue") lines.push(`${r.company} missed the legal deadline. Send the follow-up.`);
    else if (s.state === "complaint_ready") lines.push(`${r.company}: complaint pack ready.`);
    else if (s.state === "proven" && fresh.length === 0 && s.evidence && now - s.evidence.at < 31 * DAY) lines.push(`${r.company}: deletion proven.`);
    else if (fresh.some((e) => e.type === "reply")) lines.push(`${r.company} replied.`);
    else if (s.deadline && s.deadline > now && s.deadline - now < 3 * DAY && (s.state === "sent" || s.state === "ack")) {
      lines.push(`${r.company}: legal deadline in ${Math.ceil((s.deadline - now) / DAY)} day(s).`);
    }
    if (NEEDS_YOU.has(s.state) || fresh.some((e) => e.type === "reply")) badge++;
  }
  // What needs you first; "nothing to do" lines last.
  // Broken promises and marketing after the request first, then steps that wait on you, then "nothing to do".
  const rank = (l: string) => /still sending you marketing|Complaint ready|complaint pack|emailed you again|missed the legal deadline/.test(l) ? 0
    : /Nothing to do|Nothing to delete|Stay signed out|deletion proven|replied\.$/.test(l) ? 2 : 1;
  lines.sort((a, b) => rank(a) - rank(b));
  return { lines, badge };
}
