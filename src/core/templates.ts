import { LAWS, type LawId, type RequestKind } from "./laws";

export interface RequestFill {
  kind: RequestKind;
  law: LawId;
  company: string;
  fullName: string;
  accountEmail: string;
  /** Short reference so replies and the sent copy can be matched. */
  ref: string;
  sentAt: number;
}

const fmt = (t: number) => new Date(t).toISOString().slice(0, 10);

/** Fixed legal text. The model never writes or edits a request. */
export function buildRequest(f: RequestFill): { subject: string; body: string } {
  const law = LAWS[f.law];
  const due = fmt(law.deadline(f.sentAt));
  if (f.kind === "delete") {
    return {
      subject: `Request to delete my personal data [${f.ref}]`,
      body: [
        `Dear ${f.company} privacy team,`,
        ``,
        `I am writing to request that you erase all personal data you hold about me, under ${law.deleteArticle}.`,
        `This includes my account registered to ${f.accountEmail} and any related records, copies and backups.`,
        ``,
        `Please also stop sending me marketing of any kind, and pass this request on to any third party you have shared my data with.`,
        ``,
        `Please confirm in writing once the erasure is complete. Under ${law.name} you must respond within ${law.deadlineText}; I expect your reply by ${due}.`,
        `If you need to verify my identity, please tell me exactly what you need. This email is sent from the address on the account.`,
        ``,
        `Reference: ${f.ref}`,
        ``,
        `Kind regards,`,
        f.fullName,
      ].join("\n"),
    };
  }
  return {
    subject: `Objection to direct marketing [${f.ref}]`,
    body: [
      `Dear ${f.company} privacy team,`,
      ``,
      `I object to any use of my personal data for direct marketing, under ${law.objectArticle}.`,
      `This covers my account registered to ${f.accountEmail}. Please stop all marketing emails and any profiling for marketing, and keep my account open.`,
      ``,
      `Please confirm in writing. Under ${law.name} you must respond within ${law.deadlineText}; I expect your reply by ${due}.`,
      ``,
      `Reference: ${f.ref}`,
      ``,
      `Kind regards,`,
      f.fullName,
    ].join("\n"),
  };
}

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
/** "ER-7Q2K9" style reference. */
export function newRef(rand: () => number = Math.random): string {
  let s = "ER-";
  for (let i = 0; i < 5; i++) s += ALPHABET[Math.floor(rand() * ALPHABET.length)];
  return s;
}

/** Gmail compose link with everything filled in; the user presses Send. */
export function composeUrl(to: string, subject: string, body: string): string {
  const q = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
  return `https://mail.google.com/mail/?${q.toString()}`;
}
