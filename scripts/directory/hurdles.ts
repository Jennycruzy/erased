/**
 * Deletion Difficulty Index: for companies in the public directory with a real, quoted privacy page, cloud Gemini
 * (Firebase AI Logic, ONLY_IN_CLOUD) reads the page and lists the hurdles it puts in front of a deletion request.
 * A hurdle counts only with a sentence found word for word on the page; otherwise it is "not stated".
 * Public web pages only; no user data is involved.
 *
 *   node dist-node/hurdles.mjs <out.jsonl> [limit]
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";
import { firebaseConfig } from "../../src/ai/firebase-config";

const [, , outFile, limitArg, domainsFile] = process.argv;
const limit = Number(limitArg ?? 300);
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0 Safari/537.36";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const HURDLE_SCHEMA = {
  type: "object",
  properties: {
    id_document: { type: "string", enum: ["required", "may_be_asked", "not_stated"], description: "To act on a privacy or deletion request, does the page say the person must send an identity document (passport, ID card, driving licence)? Age checks and account security checks do not count." },
    id_quote: { type: "string", description: "The sentence that says it, copied word for word, or empty." },
    account_only: { type: "string", enum: ["yes", "no", "not_stated"], description: "Does the page say deletion can only be done by signing in to the account (no email or form route)?" },
    account_quote: { type: "string" },
    email_route: { type: "boolean", description: "Does the page give an email address for privacy or deletion requests?" },
    response_days: { type: "integer", description: "The number of days the page says the company will answer within, or 0 if not stated." },
    response_quote: { type: "string" },
    agent_allowed: { type: "string", enum: ["yes", "no", "not_stated"], description: "Does the page say an authorised agent or representative may make the request for the person?" },
    agent_quote: { type: "string" },
  },
  required: ["id_document", "id_quote", "account_only", "account_quote", "email_route", "response_days", "response_quote", "agent_allowed", "agent_quote"],
} as const;

const PROMPT = (domain: string, text: string) =>
  `You read the public privacy policy of ${domain}. Answer only from the page. For each answer that is not "not_stated", copy the sentence that shows it word for word into the matching quote field. If the page does not say, answer "not_stated" (or 0, or false) and leave the quote empty.\n\nPAGE:\n${text}`;

const app = initializeApp(firebaseConfig);
const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, {
  mode: InferenceMode.ONLY_IN_CLOUD,
  inCloudParams: { model: "gemini-3.5-flash-lite", generationConfig: { temperature: 0, responseMimeType: "application/json", responseJsonSchema: HURDLE_SCHEMA } },
} as never);

function textOf(html: string): string {
  return html
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr|section)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}
function relevant(text: string, max = 24000): string {
  const key = /delet|eras|remov|right|request|identity|verif|passport|agent|authori[sz]ed|days|contact|privacy@|dpo|exercise|account/i;
  return text.split("\n").filter((p, i) => i < 10 || key.test(p)).join("\n").slice(0, max);
}
const norm = (s: string) => s.normalize("NFKC").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();
const onPage = (q: string, text: string) => !!q && norm(q).length >= 12 && norm(text).includes(norm(q));

async function fetchText(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
    if (!r.ok || !(r.headers.get("content-type") ?? "").includes("html")) return null;
    const t = textOf((await r.text()).slice(0, 2_000_000));
    return t.length >= 1500 && /privacy|personal (data|information)/i.test(t) ? t : null;
  } catch { return null; }
}

async function ask(prompt: string): Promise<Record<string, unknown>> {
  for (let attempt = 0; attempt < 6; attempt++) {
    try { return JSON.parse((await model.generateContent(prompt)).response.text()); }
    catch (e) {
      const msg = String((e as Error).message ?? e);
      const busy = /429|quota|RESOURCE_EXHAUSTED|overloaded|UNAVAILABLE|\[50[03]/i.test(msg);
      process.stderr.write(`  retry ${attempt + 1}: ${msg.replace(/AIza[\w-]+/g, "<key>").slice(0, 160)}\n`);
      await sleep(busy ? 20000 * (attempt + 1) : 4000);
    }
  }
  throw new Error("model unavailable");
}

// Companies with a deletion route proven by a quote on a page we fetched ourselves, in the seed's popularity order.
const dir = JSON.parse(readFileSync("site/directory.json", "utf8")).entries as Array<{ domain: string; company: string; privacy_url: string; request_route: string; method: string; verified: boolean }>;
const order = readFileSync("data/directory/seed.txt", "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
const rank = new Map(order.map((d, i) => [d, i]));
const done = new Set(existsSync(outFile) ? readFileSync(outFile, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l).domain) : []);
// With a domains file: exactly those companies (for example the 30 in the live run), whatever their route.
const only = domainsFile ? new Set(readFileSync(domainsFile, "utf8").split("\n").map((s) => s.trim()).filter(Boolean)) : null;
const pick = dir
  .filter((e) => (only ? only.has(e.domain) : e.request_route !== "none" && e.request_route !== "unknown" && e.method === "page_text" && e.verified))
  .sort((a, b) => (rank.get(a.domain) ?? 1e9) - (rank.get(b.domain) ?? 1e9))
  .slice(0, limit)
  .filter((e) => !done.has(e.domain));
console.log(`${pick.length} companies to read`);

for (const [i, e] of pick.entries()) {
  const text = await fetchText(e.privacy_url);
  if (!text) { appendFileSync(outFile, JSON.stringify({ domain: e.domain, company: e.company, skipped: "page not reachable now" }) + "\n"); continue; }
  const page = relevant(text);
  const j = await ask(PROMPT(e.domain, page)).catch(() => null);
  if (!j) { appendFileSync(outFile, JSON.stringify({ domain: e.domain, company: e.company, skipped: "model unavailable" }) + "\n"); continue; }
  // Keep a hurdle only when its sentence is on the page.
  const keep = (v: unknown, q: unknown) => (typeof q === "string" && onPage(q, text) ? { v, q } : { v: "not_stated", q: "" });
  // An identity document only counts when the sentence is about a rights request, not an age or security check.
  const idAboutRequest = typeof j.id_quote === "string" && /request|right|delet|eras|access|identity|verif/i.test(j.id_quote) && !/old enough|\bage\b|minimum age|under (13|16|18)/i.test(j.id_quote);
  const id = j.id_document === "not_stated" || !idAboutRequest ? { v: "not_stated", q: "" } : keep(j.id_document, j.id_quote);
  const acct = j.account_only === "yes" ? keep("yes", j.account_quote) : { v: j.account_only, q: "" };
  const days = Number(j.response_days) > 0 && onPage(String(j.response_quote), text) ? { v: Number(j.response_days), q: j.response_quote } : { v: 0, q: "" };
  const agent = j.agent_allowed === "not_stated" ? { v: "not_stated", q: "" } : keep(j.agent_allowed, j.agent_quote);
  const row = {
    domain: e.domain, company: e.company, privacy_url: e.privacy_url, route: e.request_route,
    id_document: id.v, id_quote: id.q, account_only: acct.v, account_quote: acct.q, email_route: !!j.email_route,
    response_days: days.v, response_quote: days.q, agent_allowed: agent.v, agent_quote: agent.q, read_at: new Date().toISOString(),
  };
  appendFileSync(outFile, JSON.stringify(row) + "\n");
  console.log(`${i + 1}/${pick.length} ${e.domain}: id=${row.id_document} account_only=${row.account_only} email=${row.email_route} days=${row.response_days} agent=${row.agent_allowed}`);
  await sleep(4500);
}
console.log("done");
