import { getGenerativeModel, InferenceMode, type AI, type GenerativeModel } from "firebase/ai";
import { quoteIsIn } from "../core/quote";
import type { ReplyKind } from "../core/requests";

/** Longest slice of an email sent to the on-device model (well inside its 9,216-token window). */
export const MAX_EMAIL_CHARS = 6000;

export const ACCOUNT_SCHEMA = {
  type: "object",
  properties: {
    is_account: { type: "boolean", description: "True if this email shows the reader holds an account with the sender." },
    kind: { type: "string", enum: ["welcome", "verify", "reset", "receipt", "security", "newsletter", "person", "other"] },
    service_name: { type: "string" },
    quote: { type: "string", description: "Exact sentence copied from the email that proves the answer." },
  },
  required: ["is_account", "kind", "quote"],
} as const;

export const REPLY_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string", enum: ["ack", "deleted", "needs_id", "refused", "other"] },
    extension: { type: "boolean", description: "True if they say they need more time." },
    quote: { type: "string", description: "Exact sentence copied from the email that proves the answer." },
  },
  required: ["reply", "extension", "quote"],
} as const;

export const MARKETING_SCHEMA = {
  type: "object",
  properties: {
    marketing: { type: "boolean", description: "True if the email promotes products, offers or content rather than handling a request." },
    quote: { type: "string" },
  },
  required: ["marketing", "quote"],
} as const;

export interface Logged<T> {
  value: T;
  source: "on_device" | "in_cloud" | "unknown";
  ms: number;
}

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

async function ask<T>(task: string, m: GenerativeModel, prompt: string): Promise<Logged<T>> {
  const t0 = performance.now();
  const r = await m.generateContent(prompt);
  const ms = Math.round(performance.now() - t0);
  const source = (r.response.inferenceSource as Logged<T>["source"]) ?? "unknown";
  callLog.push({ task, source, ms, at: Date.now() });
  return { value: JSON.parse(r.response.text()) as T, source, ms };
}

const clip = (s: string) => s.slice(0, MAX_EMAIL_CHARS);

export async function readAccountEmail(m: GenerativeModel, from: string, subject: string, body: string) {
  const r = await ask<{ is_account: boolean; kind: string; service_name?: string; quote: string }>(
    "account",
    m,
    `You read one email. Decide if it shows that the reader has an account with the sender (sign-up, verification, password reset, login alert, receipt for their own order). Newsletters the reader never signed up for and emails from people are not accounts. Copy one exact sentence from the email as proof.\n\nFrom: ${from}\nSubject: ${subject}\n\n${clip(body)}`,
  );
  return { ...r, quoteOk: quoteIsIn(r.value.quote, body) };
}

export async function readReply(m: GenerativeModel, from: string, subject: string, body: string) {
  const r = await ask<{ reply: ReplyKind; extension: boolean; quote: string }>(
    "reply",
    m,
    `This email is a company's reply to a data deletion or marketing objection request. Classify it: "deleted" only if it says the data or account has been deleted or the objection applied; "ack" if it only confirms receipt; "needs_id" if it asks the person to verify identity; "refused" if it declines; otherwise "other". Copy one exact sentence as proof.\n\nFrom: ${from}\nSubject: ${subject}\n\n${clip(body)}`,
  );
  return { ...r, quoteOk: quoteIsIn(r.value.quote, body) };
}

export async function isMarketing(m: GenerativeModel, from: string, subject: string, body: string) {
  const r = await ask<{ marketing: boolean; quote: string }>(
    "marketing",
    m,
    `Is this email marketing (promoting products, offers, content or re-engagement), rather than a transactional or legal message? Copy one exact sentence as proof.\n\nFrom: ${from}\nSubject: ${subject}\n\n${clip(body)}`,
  );
  return { ...r, quoteOk: quoteIsIn(r.value.quote, body) };
}
