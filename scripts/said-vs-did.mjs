// "What their privacy page says vs what they told us": for the 30 live-run companies, every company whose own privacy
// page offers email for privacy requests (a quote from the page) and whose reply to our email then sent us to sign
// in or to their form instead (a quote from the reply). One rule for all 30; output site/saidvsdid.json.
import { readFileSync, writeFileSync } from "node:fs";
const run = JSON.parse(readFileSync("site/run.json", "utf8")).requests;
const dir = new Map(JSON.parse(readFileSync("site/directory.json", "utf8")).entries.map((e) => [e.domain, e]));
// The page's own sentence must be about privacy requests or rights AND give an email route.
// The page's own sentence must be about exercising privacy rights AND give an email route: either in the sentence,
// or the sentence leads straight into the privacy address recorded from the same page ("please contact us at:").
const offersEmail = (e) => {
  const q = e?.route_quote ?? "";
  if (!/request|right|delet|eras/i.test(q) || /child|parent|guardian|acquisition/i.test(q)) return false;
  return /e-?mail|@[a-z0-9-]+\.[a-z]{2,}/i.test(q) || (!!e.dsar_email && /contact us at:?\s*$|direct your inquiry to|please contact us/i.test(q));
};
const MOVED = { log_in_delete: "Sign in and delete it yourself", use_form: "Use our form instead" };
const rows = [];
for (const r of run) {
  const e = dir.get(r.domain);
  if (!offersEmail(e)) continue;
  const hoop = r.hoops.find((h) => MOVED[h.ask]);
  if (!hoop) continue;
  rows.push({ company: r.company, domain: r.domain, page: e.privacy_url, pageQuote: e.route_quote, pageEmail: e.dsar_email, told: MOVED[hoop.ask], toldQuote: hoop.quote, toldAt: hoop.at });
}
const checked = run.filter((r) => offersEmail(dir.get(r.domain))).length;
writeFileSync("site/saidvsdid.json", JSON.stringify({ generatedAt: new Date().toISOString(), rule: "Their privacy page offers email for privacy requests; after we emailed, their reply sent us to sign in or to their form instead.", checked, rows }, null, 1));
console.log(`${rows.length} of ${checked} companies whose page offers email`);
for (const x of rows) console.log(`- ${x.company}: page "${x.pageQuote.slice(0, 90)}" | told "${x.toldQuote.slice(0, 90)}"`);
