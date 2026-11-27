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
// Hand-checked domains whose fetched page belongs to someone else: published with no route.
const wrongOwner = new Set(readFileSync("data/directory/wrong-owner.txt", "utf8").split("\n").map((s) => s.trim()).filter((s) => s && !s.startsWith("#")));
for (const d of wrongOwner) { const e = latest.get(d); if (e) latest.set(d, { ...e, request_route: "unknown", dsar_email: null, form_url: null, route_quote: null, verified: false }); }
// Quotes are shown on the site: decode HTML entities left by the page, and drop non-quotes ("none", a bare address).
const decode = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&rsquo;/g, "’").replace(/&lsquo;/g, "‘").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”");
for (const [d, e] of latest) if (typeof e.route_quote === "string") { const q = decode(e.route_quote).trim(); latest.set(d, { ...e, route_quote: q.length >= 20 && !/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(q) ? q : null }); }
// Links are opened as given: keep only real web addresses. A path is resolved on the company's own site, a bare
// "example.com/form" gets https://, and text such as "here" is dropped (the privacy page, where that form is, opens instead).
const webUrl = (u, base) => {
  if (typeof u !== "string" || !u.trim()) return null;
  const s = u.trim().replace(/&amp;/g, "&");
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/") && base) { try { return new URL(s, base).href; } catch { return null; } }
  if (/^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}(\/\S*)?$/i.test(s)) return "https://" + s;
  return null;
};
for (const [d, e] of latest) { const privacy_url = webUrl(e.privacy_url, null); latest.set(d, { ...e, privacy_url, form_url: webUrl(e.form_url, privacy_url) }); }
const FIELDS = ["domain", "company", "privacy_url", "request_route", "dsar_email", "form_url", "laws_named", "route_quote", "verified", "verified_at", "method"];
const routed = (e) => e.request_route !== "unknown" && e.request_route !== "none";
// "verified" means a usable route proven by a quote on the company's own page; no route is never "verified".
const entries = [...latest.values()].map((e) => Object.fromEntries(FIELDS.map((f) => [f, f === "verified" ? !!e.verified && routed(e) : e[f] ?? null]))).sort((a, b) => a.domain.localeCompare(b.domain));
mkdirSync("site", { recursive: true });
writeFileSync("site/directory.json", JSON.stringify({ generatedAt: new Date().toISOString(), count: entries.length, entries }));
const usable = entries.filter(routed);
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

  // The board goes out whole, next to the directory, so the extension matches it on the device and never asks
  // Firestore about one company. Companies with fewer than BOARD_MIN_REPORTS reports stay private.
  const BOARD_MIN_REPORTS = 5; // same as src/core/board.ts
  const all = {};
  let pageToken = "";
  do {
    const r = await fetch(`${base}/board?pageSize=300${pageToken ? `&pageToken=${pageToken}` : ""}`, { headers: { authorization: `Bearer ${tok}` } });
    if (!r.ok) throw new Error(`Firestore board ${r.status}`);
    const j = await r.json();
    for (const d of j.documents ?? []) {
      all[decodeURIComponent(d.name.split("/").pop())] = Object.fromEntries(Object.entries(d.fields ?? {}).map(([k, v]) => [k, Number(v.integerValue ?? v.doubleValue ?? 0)]));
    }
    pageToken = j.nextPageToken ?? "";
  } while (pageToken);
  const shown = Object.fromEntries(Object.entries(all).filter(([, c]) => Math.max(0, ...Object.values(c)) >= BOARD_MIN_REPORTS));
  writeFileSync("site/board.json", JSON.stringify({ generatedAt: new Date().toISOString(), minReports: BOARD_MIN_REPORTS, count: Object.keys(shown).length, entries: shown }));
  console.log(`board: ${Object.keys(all).length} companies, ${Object.keys(shown).length} shown -> site/board.json`);
}
