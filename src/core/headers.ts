/** What an email's subject line suggests, before any model reads the body. */
export type MailKind =
  | "welcome" | "verify" | "reset" | "receipt" | "security" | "deletion" | "newsletter" | "other";

const RULES: Array<[MailKind, RegExp]> = [
  ["deletion", /\b(account (has been |was )?(deleted|closed|removed)|data (has been |was )?(deleted|erased)|deletion (request|confirmation)|erasure)\b/i],
  ["reset", /\b(reset (your )?password|password reset|forgot (your )?password|change your password)\b/i],
  ["verify", /\b(verify|confirm|activate)\b.{0,30}\b(e-?mail|account|address|registration|sign-?up)\b|\bverification code\b|\bconfirm your\b/i],
  ["welcome", /\b(welcome( to)?|thanks? (you )?for (signing|joining|registering|creating)|you('|’)re in|account (is )?(created|ready))\b/i],
  ["security", /\b(new (sign-?in|login|device)|security alert|unusual (sign-?in|activity)|2-?step|two-factor)\b/i],
  ["receipt", /\b(receipt|invoice|order (confirmation|#|number)|your order|payment (received|confirmation)|subscription (renew|confirm))\b/i],
  ["newsletter", /\b(newsletter|digest|weekly|this week|% off|sale|deal|offer|unsubscribe)\b/i],
];

export function kindFromSubject(subject: string): MailKind {
  for (const [kind, re] of RULES) if (re.test(subject)) return kind;
  return "other";
}

/** Kinds that only exist when you hold an account with the sender. */
export const ACCOUNT_KINDS: ReadonlySet<MailKind> = new Set(["welcome", "verify", "reset", "security", "receipt"]);

/** Search used to list account-type mail in Gmail. */
export const ACCOUNT_SEARCH =
  'welcome OR verify OR "confirm your" OR "password reset" OR "reset your password" OR "your account" OR "thanks for signing up" OR "thank you for registering" OR "new sign-in" OR receipt';
