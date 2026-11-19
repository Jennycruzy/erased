import { ACCOUNT_KINDS, type MailKind } from "./headers";
import { DAY } from "./time";
import type { Breach } from "./breaches";

export interface Sighting {
  domain: string;
  at: number;
  kind: MailKind;
  /** Set when the on-device model read the body. */
  device?: { isAccount: boolean; quote?: string; quoteOk: boolean };
}

export interface Company {
  domain: string;
  emails: number;
  firstSeen: number;
  lastSeen: number;
  /** Earliest email that shows you hold an account. */
  signedUp?: number;
  account: "confirmed" | "likely" | "unknown";
  stale: boolean;
  breaches: Breach[];
  breachedAfterJoining: Breach[];
}

export const STALE_YEARS = 3;

/** Rules that turn sightings into a company record. The model only contributes quoted facts. */
export function summarise(domain: string, s: Sighting[], breaches: Breach[], now: number): Company {
  const at = s.map((x) => x.at).filter((t) => Number.isFinite(t));
  const firstSeen = at.length ? Math.min(...at) : NaN;
  const lastSeen = at.length ? Math.max(...at) : NaN;
  const deviceYes = s.filter((x) => x.device?.isAccount && x.device.quoteOk);
  const deviceNo = s.filter((x) => x.device && !x.device.isAccount);
  const headerHits = s.filter((x) => ACCOUNT_KINDS.has(x.kind));
  let account: Company["account"] = "unknown";
  if (deviceYes.length) account = "confirmed";
  else if (headerHits.length >= 2 && !deviceNo.length) account = "likely";
  const evidence = [...deviceYes, ...(account === "likely" ? headerHits : [])].map((x) => x.at).filter(Number.isFinite);
  const signedUp = evidence.length ? Math.min(...evidence) : undefined;
  const joined = signedUp ?? firstSeen;
  return {
    domain,
    emails: s.length,
    firstSeen,
    lastSeen,
    signedUp,
    account,
    stale: Number.isFinite(lastSeen) && now - lastSeen >= STALE_YEARS * 365 * DAY,
    breaches,
    breachedAfterJoining: Number.isFinite(joined) ? breaches.filter((b) => Date.parse(b.date) > joined) : [],
  };
}

/** 0–100: lower when more of your data sits with breached or forgotten companies. */
export function safetyScore(cs: Company[]): number {
  const held = cs.filter((c) => c.account !== "unknown");
  if (!held.length) return 100;
  const risky = held.filter((c) => c.breachedAfterJoining.length || c.stale).length;
  return Math.round(100 * (1 - risky / held.length));
}
