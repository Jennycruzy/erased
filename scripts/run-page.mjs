// Builds site/run.json from an export of the demo inbox's extension storage (requests with their events).
import fs from "fs";
const [, , input, out = "site/run.json"] = process.argv;
const { requests, lastChecked } = JSON.parse(fs.readFileSync(input, "utf8"));
const { status, currentTiming } = await import("../dist-node/requests.mjs");
const ID_DOC = /\b(passport|driver'?s licen[cs]e|photo id|id card|identity document|government[- ]issued|copy of (your|an?) id)\b/i;
const NOT_HOOPS = new Set(["wait", "scheduled", "no_account"]);
// Public page: never a support agent's name ("Ed here with Zapier Support"), only what the company asked.
const clean = (q) => (/\b(here (with|from)|my name is|stepping in for)\b/i.test(q ?? "") ? "" : String(q ?? "").slice(0, 240));
const now = Date.now();
const rows = requests.map((r) => {
  const ev = [...r.events].sort((a, b) => a.at - b.at);
  const sent = ev.find((e) => e.type === "sent");
  const replies = ev.filter((e) => e.type === "reply").map(({ at, reply, quote }) => ({ at, reply, quote }));
  const st = status(r, now);
  const state = st.state === "sent" && replies.some((x) => x.reply === "other") ? "other" : st.state;
  // What the company made the person do, in order, each with the sentence that asked it (copied from their email).
  const hoops = [];
  for (const e of ev) {
    // An ID ask counts only when the sentence names an identity document; "confirm it is you" by email is fair.
    const idDoc = e.type === "reply" && e.reply === "needs_id" && ID_DOC.test(e.quote ?? "");
    const ask = e.type === "reply" ? (idDoc ? "needs_id" : e.coach?.ask) : null;
    if (!ask || NOT_HOOPS.has(ask) || hoops.some((h) => h.ask === ask)) continue;
    // Mail from before the request (a code from deleting in the app ourselves) is not something the reply asked for.
    if (sent && e.at < sent.at) continue;
    hoops.push({ ask, at: e.at, quote: clean(e.coach?.askQuote ?? e.quote) });
  }
  const mkt = sent && ev.find((e) => e.type === "marketing" && e.at > sent.at + currentTiming().graceDays * 864e5);
  if (mkt) hoops.push({ ask: "still_marketing", at: mkt.at, quote: mkt.subject });
  const last = [...ev].reverse().find((e) => e.type === "reply" && (e.reply === "deleted" || ["scheduled", "no_account"].includes(e.coach?.ask)));
  const outcome = !last ? null : last.reply === "deleted" ? "deleted" : last.coach.ask;
  return { company: r.company, domain: r.domain, ref: r.ref, route: r.route, to: r.to, sentAt: sent?.at ?? null, replies, state, deadline: st.deadline ?? null, hoops, outcome, outcomeAt: last?.at ?? null };
}).sort((a, b) => (b.replies.length - a.replies.length) || a.company.localeCompare(b.company));
const firstReplyMin = rows.filter((r) => r.sentAt && r.replies.length).map((r) => Math.round((r.replies[0].at - r.sentAt) / 60000)).sort((a, b) => a - b);
const median = firstReplyMin.length ? firstReplyMin[Math.floor(firstReplyMin.length / 2)] : null;
const sentDays = [...new Set(rows.filter((r) => r.sentAt).map((r) => new Date(r.sentAt).toISOString().slice(0, 10)))];
const deadlines = [...new Set(rows.map((r) => r.deadline && new Date(r.deadline).toISOString().slice(0, 10)).filter(Boolean))].sort();
const has = (k) => rows.filter((r) => r.replies.some((x) => x.reply === k)).length;
fs.writeFileSync(out, JSON.stringify({
  inbox: "erased.demo.inbox@gmail.com", sentDay: sentDays.join(", "), checkedAt: lastChecked ?? now,
  deadline: deadlines.length > 1 ? `${deadlines[0]} to ${deadlines.at(-1)}` : deadlines[0] ?? "–", medianReplyMin: median,
  counts: { replied: rows.filter((r) => r.replies.length).length, needs_id: has("needs_id"), deleted: has("deleted"), ack: has("ack"), other: has("other") },
  requests: rows,
}, null, 1));
console.log("wrote", out, rows.length, "requests,", rows.filter((r) => r.replies.length).length, "with replies, median first reply", median, "min");
