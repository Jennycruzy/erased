import { ACCOUNT_KINDS, type MailKind } from "./headers";
import { DAY } from "./time";
import type { Breach } from "./breaches";

export interface Sighting {
  domain: string;
  at: number;
  kind: MailKind;
  /** Set when the on-device model read the body. */
  device?: { isAccount: boolean; quote?: string; quoteOk: boolean };
  /** Where to read it from (Gmail thread and sender), kept only in this browser. */
  threadId?: string;
  from?: string;
  subject?: string;
}

export interface Company {
  domain: string;
  emails: number;
  firstSeen: number;
  lastSeen: number;
  /** Earliest email that shows you hold an account. */
  signedUp?: number;
  account: "confirmed" | "likely" | "unknown";
  /** The sentence that proves the account, copied from the email by the code (not written by the model). */
  proof?: string;
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
    proof: deviceYes.find((x) => x.device?.quote)?.device?.quote,
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

/** Our own deletion-request threads and privacy-team mail say nothing about holding an account. */
export function isPrivacyCorrespondence(s: Pick<Sighting, "from" | "subject">): boolean {
  return /\bER-[A-Z0-9]{5}\b|request to delete my personal data|data (deletion|subject|erasure) request|privacy request/i.test(s.subject ?? "")
    || /^(privacy|dpo|gdpr|dataprotection|data-protection|legal|support|help|customer_?support|customercare|assist|advocates)([+.\-_][^@]*)?@/i.test(s.from ?? "")
    // Privacy-request services that send codes and receipts on behalf of other companies.
    || /@([\w-]+\.)*(ethyca|ketch|onetrust|transcend|datagrail|securiti|trustarc|osano|mineos)\.(com|io|ai)$/i.test(s.from ?? "");
}

/**
 * Which email to read on the device for each company, best first: companies not yet proven, breached ones first,
 * then the most mail; per company the earliest account-looking email that has a thread to open.
 */
/** Mail that only an account holder gets ranks above welcome mail, which is often marketing. */
function kindStrength(k: MailKind): number {
  return k === "reset" || k === "security" || k === "verify" || k === "receipt" ? 2 : ACCOUNT_KINDS.has(k) ? 1 : 0;
}

export function deviceTargets(sightings: Map<string, Sighting[]>, companies: Company[], limit: number, skip: ReadonlySet<Sighting> = new Set()): Array<{ domain: string; sighting: Sighting }> {
  const order = companies
    .filter((c) => c.account !== "confirmed")
    .sort((a, b) => b.breaches.length - a.breaches.length || b.emails - a.emails);
  const out: Array<{ domain: string; sighting: Sighting }> = [];
  for (const c of order) {
    const list = (sightings.get(c.domain) ?? []).filter((x) => x.threadId && !x.device && !skip.has(x) && !isPrivacyCorrespondence(x));
    const pick = [...list].sort((a, b) => kindStrength(b.kind) - kindStrength(a.kind) || a.at - b.at)[0];
    if (pick) out.push({ domain: c.domain, sighting: pick });
    if (out.length >= limit) break;
  }
  return out;
}
