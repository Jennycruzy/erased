// data/directory/hurdles.jsonl -> site/hurdles.json: what each company's own privacy page promises about a deletion
// request, counted only where the page says it in a sentence we found on the page ourselves.
import { readFileSync, writeFileSync } from "node:fs";
const seen = new Set();
// One row per company: several domains (cloudflare.com, dash.cloudflare.com) share one privacy page.
const rows = readFileSync("data/directory/hurdles.jsonl", "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((r) => !r.skipped)
  .filter((r) => { const k1 = (r.privacy_url || "").replace(/[?#].*$/, "").replace(/\/$/, ""), k2 = (r.company || "").toLowerCase(); if (seen.has(k1) || seen.has(k2)) return false; seen.add(k1); seen.add(k2); return true; });
const dir = new Map(JSON.parse(readFileSync("site/directory.json", "utf8")).entries.map((e) => [e.domain, e]));
// The model over-reads; a claim counts only when its own sentence says it.
const ID_DOC = /\b(ID|identity card|identification document|proof of identity|passport|driver['’]?s licen[cs]e|government[- ]issued|photo identification|photo ID)\b/;
const ONLY = /\b(only way|only be|only through|only via|must|solely|exclusively|cannot .* (by|via) (e-?mail|mail))\b/i;
const SIGNIN = /\b(log(ging)? ?in|sign(ing)? ?in|your account|account settings)\b/i;
const ABOUT_REQUEST = /\b(request|rights?|delet|eras|access)/i;
const NOT_REQUEST = /complain|withdraw|ceas|unsubscrib|DPF|dispute|refund|cancel|log data|retain|retention/i;
const ABOUT_ID_CHECK = /verify your identity|proof of identity|request|identity card proving/i;
const AGENT = /\bagent|authori[sz]ed|on (your|their|his|her) behalf/i;
// "We will acknowledge within 10 days and respond within 45": the answer is 45. An acknowledgement alone is not an answer.
function answerDays(r) {
  const q = r.response_quote;
  if (!(r.response_days > 0 && q && ABOUT_REQUEST.test(q) && !NOT_REQUEST.test(q))) return null;
  if (!/acknowledg|confirm(ing)? receipt/i.test(q)) return { days: r.response_days, quote: q };
  const nums = [...q.matchAll(/\(?(\d{1,3})\)?\s*(?:business |calendar |working )?days/gi)].map((m) => +m[1]);
  return nums.length >= 2 ? { days: Math.max(...nums), quote: q } : null;
}
const out = rows.map((r) => {
  const d = dir.get(r.domain) ?? {};
  const asks = [];
  if (r.id_quote && ID_DOC.test(r.id_quote) && ABOUT_ID_CHECK.test(r.id_quote) && r.id_document !== "not_stated") asks.push({ kind: r.id_document === "required" ? "id_required" : "id_maybe", quote: r.id_quote });
  if (r.account_only === "yes" && r.account_quote && ONLY.test(r.account_quote) && SIGNIN.test(r.account_quote)) asks.push({ kind: "signin_only", quote: r.account_quote });
  return {
    company: r.company || d.company || r.domain, domain: r.domain, page: r.privacy_url, route: d.request_route ?? r.route,
    address: d.dsar_email || d.form_url || null, asks,
    days: answerDays(r),
    agent: r.agent_allowed === "yes" && r.agent_quote && AGENT.test(r.agent_quote) ? r.agent_quote : null,
    readAt: r.read_at,
  };
});
const n = out.length, c = (f) => out.filter(f).length;
const summary = {
  pages: n,
  idRequired: c((r) => r.asks.some((a) => a.kind === "id_required")),
  idMaybe: c((r) => r.asks.some((a) => a.kind === "id_maybe")),
  signinOnly: c((r) => r.asks.some((a) => a.kind === "signin_only")),
  promiseDays: c((r) => r.days),
  noPromise: c((r) => !r.days),
  agentAllowed: c((r) => r.agent),
};
const last = out.map((r) => r.readAt).sort().at(-1);
writeFileSync("site/hurdles.json", JSON.stringify({ generatedAt: new Date().toISOString(), readUntil: last, summary, rows: out }, null, 1));
console.log("site/hurdles.json", summary);
