// Publishes the compiled directory: site/directory.json (downloaded whole by the extension and matched on the
// device) and the Firestore `directory` collection. Usage: node scripts/directory/export.mjs [--firestore]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";

const latest = new Map();
for (const line of readFileSync("data/directory/entries.jsonl", "utf8").split("\n")) {
  if (!line.trim()) continue;
  const e = JSON.parse(line);
  if (e.error || !e.request_route) continue;
  latest.set(e.domain, e);
}
const FIELDS = ["domain", "company", "privacy_url", "request_route", "dsar_email", "form_url", "laws_named", "route_quote", "verified", "verified_at", "method"];
const entries = [...latest.values()].map((e) => Object.fromEntries(FIELDS.map((f) => [f, e[f] ?? null]))).sort((a, b) => a.domain.localeCompare(b.domain));
mkdirSync("site", { recursive: true });
writeFileSync("site/directory.json", JSON.stringify({ generatedAt: new Date().toISOString(), count: entries.length, entries }));
const usable = entries.filter((e) => e.request_route !== "unknown" && e.request_route !== "none");
console.log(`${entries.length} entries (${usable.length} with a route, ${entries.filter((e) => e.verified).length} verified) -> site/directory.json`);

if (process.argv.includes("--firestore")) {
  const tok = JSON.parse(readFileSync(`${homedir()}/.config/configstore/firebase-tools.json`, "utf8")).tokens.access_token;
  const base = "https://firestore.googleapis.com/v1/projects/forget-me-hybrid/databases/(default)/documents";
  const val = (v) => v === null ? { nullValue: null } : typeof v === "boolean" ? { booleanValue: v } : Array.isArray(v) ? { arrayValue: { values: v.map(val) } } : { stringValue: String(v) };
  for (let i = 0; i < entries.length; i += 400) {
    const writes = entries.slice(i, i + 400).map((e) => ({
      update: { name: `projects/forget-me-hybrid/databases/(default)/documents/directory/${encodeURIComponent(e.domain)}`, fields: Object.fromEntries(Object.entries(e).map(([k, v]) => [k, val(v)])) },
    }));
    const r = await fetch(`${base}:batchWrite`, { method: "POST", headers: { authorization: `Bearer ${tok}`, "content-type": "application/json" }, body: JSON.stringify({ writes }) });
    if (!r.ok) throw new Error(`Firestore ${r.status}: ${(await r.text()).slice(0, 200)}`);
  }
  console.log(`Firestore: ${entries.length} directory documents written`);
}
