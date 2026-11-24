import { getGenerativeModel, InferenceMode, type AI, type GenerativeModel } from "firebase/ai";
import { notDoneYet, quoteIsIn } from "../core/quote";
import { numbered, pick, sentencesOf } from "../core/sentences";
import type { ReplyKind } from "../core/requests";
import { ASKS, type Ask } from "../core/coach";

/** Longest slice of an email sent to the on-device model (well inside its 9,216-token window). */
export const MAX_EMAIL_CHARS = 6000;

export const ACCOUNT_SCHEMA = {
  type: "object",
  properties: {
    is_account: { type: "boolean", description: "True if this email shows the reader holds an account with the sender." },
    kind: { type: "string", enum: ["welcome", "verify", "reset", "receipt", "security", "newsletter", "person", "other"] },
    proof: { type: "integer", description: "Number of the one sentence that proves the answer." },
  },
  required: ["is_account", "kind", "proof"],
} as const;

export const REPLY_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string", enum: ["ack", "deleted", "needs_id", "refused", "other", "unrelated"] },
    extension: { type: "boolean", description: "True if they say they need more time." },
    proof: { type: "integer", description: "Number of the one sentence that proves the answer." },
  },
  required: ["reply", "extension", "proof"],
} as const;

export const ASK_SCHEMA = {
  type: "object",
  properties: {
    ask: { type: "string", enum: ASKS as unknown as string[] },
    proof: { type: "integer", description: "Number of the one sentence that shows what they ask." },
  },
  required: ["ask", "proof"],
} as const;

export const MARKETING_SCHEMA = {
  type: "object",
  properties: {
    marketing: { type: "boolean", description: "True if the email promotes products, offers or content rather than handling a request." },
    proof: { type: "integer", description: "Number of the one sentence that proves the answer." },
  },
  required: ["marketing", "proof"],
} as const;

export interface Logged<T> {
  value: T;
  source: "on_device" | "in_cloud" | "unknown";
  ms: number;
}

const clip = (s: string) => s.slice(0, MAX_EMAIL_CHARS);

/** Every model call is logged with where it ran, so the evidence page can show it. */
export const callLog: Array<{ task: string; source: string; ms: number; at: number }> = [];

/** Private mail is only ever read on this device: ONLY_ON_DEVICE throws instead of falling back to the cloud. */
export function privateModel(ai: AI, schema: object): GenerativeModel {
  return getGenerativeModel(ai, {
    mode: InferenceMode.ONLY_ON_DEVICE,
    onDeviceParams: {
      createOptions: {
        expectedInputs: [{ type: "text", languages: ["en"] }],
        expectedOutputs: [{ type: "text", languages: ["en"] }],
      },
      promptOptions: { responseConstraint: schema },
    },
  });
}

/** Public pages only (privacy policies, breach records). */
export function publicCloudModel(ai: AI, model = "gemini-3.5-flash-lite"): GenerativeModel {
  return getGenerativeModel(ai, { mode: InferenceMode.ONLY_IN_CLOUD, inCloudParams: { model } });
}

/**
 * The email goes in as numbered sentences and the model answers with a sentence NUMBER; the code copies that exact
 * sentence as the quote. Writing the sentence out took 3.5-5.8 s per email on an M1; pointing at it takes ~2 s.
 */
async function ask<T extends object>(task: string, m: GenerativeModel, instruction: string, head: string, body: string): Promise<Logged<T & { quote: string }> & { quoteOk: boolean }> {
  const sents = sentencesOf(clip(body));
  const t0 = performance.now();
  // A stuck on-device call must not stall a whole check: give up on this email after 90 s (a cold first call takes ~18 s).
  let timer: ReturnType<typeof setTimeout> | undefined;
  const r = await Promise.race([
    m.generateContent(`${instruction}\n\n${head}\n\n${numbered(sents)}`),
    new Promise<never>((_, no) => { timer = setTimeout(() => no(new Error(`${task}: no answer from the model in 90 s`)), 90_000); }),
  ]).finally(() => clearTimeout(timer));
  const ms = Math.round(performance.now() - t0);
  const source = (r.response.inferenceSource as Logged<T>["source"]) ?? "unknown";
  callLog.push({ task, source, ms, at: Date.now() });
  const raw = JSON.parse(r.response.text()) as T & { proof?: unknown };
  const quote = pick(sents, raw.proof);
  return { value: { ...raw, quote }, source, ms, quoteOk: quoteIsIn(quote, body) };
}

export function readAccountEmail(m: GenerativeModel, from: string, subject: string, body: string) {
  return ask<{ is_account: boolean; kind: string }>(
    "account",
    m,
    "You read one email, given as numbered sentences. Decide if it shows that the reader has an account with the sender (sign-up, verification, password reset, login alert, receipt for their own order). Newsletters the reader never signed up for and emails from people are not accounts. Give the number of the one sentence that proves your answer.",
    `From: ${from}\nSubject: ${subject}`,
    body,
  );
}

export async function readReply(m: GenerativeModel, from: string, subject: string, body: string) {
  const r = await ask<{ reply: ReplyKind | "unrelated"; extension: boolean }>(
    "reply",
    m,
    'This email, given as numbered sentences, is a company\'s reply to a data deletion or marketing objection request. Classify it: "deleted" only if it says the data or account has been deleted or the objection applied; "ack" if it only confirms receipt; "needs_id" if it asks the person to verify identity; "refused" if it declines; "unrelated" if it is not about this request at all (welcome, onboarding tips, newsletters, marketing); otherwise "other". Give the number of the one sentence that proves your answer.',
    `From: ${from}\nSubject: ${subject}`,
    body,
  );
  r.value.reply = notDoneYet(r.value.reply, r.value.quote);
  return r;
}

export function isMarketing(m: GenerativeModel, from: string, subject: string, body: string) {
  return ask<{ marketing: boolean }>(
    "marketing",
    m,
    "Is this email, given as numbered sentences, marketing (promoting products, offers, content or re-engagement), rather than a transactional or legal message? Give the number of the one sentence that proves your answer.",
    `From: ${from}\nSubject: ${subject}`,
    body,
  );
}

export const ASK_PROMPT =
  'This email, given as numbered sentences, is a company\'s reply to a person who asked it to delete their data. Most such replies only confirm they received it: then answer "wait". Answer something else only if the email clearly tells the person to do one thing now:\n"scheduled" - it says the account is already scheduled to be deleted.\n"no_account" - it says no account was found for the person\'s email address.\n"verify_link" - click a verification link or enter a code.\n"go_ahead" - reply YES, I AGREE or similar to confirm they may delete.\n"confirm_sender" - write again from the account\'s own email address, or it says it cannot accept requests from third-party services.\n"clarify" - say what should be deleted.\n"provide_info" - send more details.\n"use_form" - fill in a privacy or request form.\n"log_in_delete" - sign in and delete the account themselves.\nMentions of a help center, a ticket number or logging in to view the case do not count. Give the number of the one sentence that shows the answer.';

/** What the company's reply asks the person to do. Only picks from a fixed list; Reply Coach writes the answer. */
export function readAsk(m: GenerativeModel, from: string, subject: string, body: string) {
  return ask<{ ask: Ask }>(
    "ask",
    m,
    ASK_PROMPT,
    `From: ${from}\nSubject: ${subject}`,
    body,
  );
}
