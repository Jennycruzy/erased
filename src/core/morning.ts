import { status, type State } from "./requests";
import type { StoredRequest } from "./store";
import { DAY } from "./time";

export interface MorningCard {
  lines: string[];
  /** Number shown on the extension icon. */
  badge: number;
}

const NEEDS_YOU: ReadonlySet<State> = new Set(["needs_id", "overdue", "complaint_ready", "broken"]);

/** What changed since yesterday and what needs the user, in plain words. */
export function morningCard(reqs: StoredRequest[], now: number, lastSeen: number): MorningCard {
  const lines: string[] = [];
  let badge = 0;
  for (const r of reqs) {
    const s = status(r, now);
    const fresh = r.events.filter((e) => e.at > lastSeen);
    if (s.state === "broken" && s.result === "BROKEN_ACCOUNT_STILL_EXISTS") lines.push(`${r.company} said your account was deleted, but it still answers a password reset. Complaint ready.`);
    else if (s.state === "broken") lines.push(`${r.company} said your data was deleted, then emailed you again. Complaint ready.`);
    else if (s.state === "reopened") lines.push(`${r.company} emailed you again after the deletion was proven. The case is open again.`);
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
  return { lines, badge };
}
