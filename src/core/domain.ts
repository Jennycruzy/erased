import { getDomain } from "tldts";

/** Personal mailbox providers: mail from these is from people, not companies. */
export const PERSONAL_MAIL = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "ymail.com", "hotmail.com", "outlook.com", "live.com",
  "msn.com", "icloud.com", "me.com", "mac.com", "aol.com", "proton.me", "protonmail.com", "gmx.com",
  "gmx.de", "mail.com", "yandex.com", "zoho.com", "hey.com", "fastmail.com", "tutanota.com",
]);

/** Registrable domain of an email address or host, e.g. "mail.linkedin.com" -> "linkedin.com". */
export function companyDomain(addressOrHost: string): string | null {
  const host = addressOrHost.includes("@") ? addressOrHost.split("@").pop()! : addressOrHost;
  const d = getDomain(host.trim().toLowerCase());
  if (!d || PERSONAL_MAIL.has(d)) return null;
  return d;
}
