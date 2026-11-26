const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const d = await (await fetch("/run.json", { cache: "no-store" })).json();
const when = (t) => { const d = new Date(t); return `${d.getUTCDate()} ${d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" })} ${d.toISOString().slice(11, 16)} UTC`; };
const LABEL = { sent: "Sent, waiting", ack: "Received", needs_id: "Asked to confirm it's you", other: "Sent us elsewhere", confirmed: "Confirmed deleted", proven: "Erased", broken: "Not erased", refused: "Refused", overdue: "Overdue", complaint_ready: "Complaint ready", still_marketing: "Still sending marketing", drafted: "Not sent" };
const REPLY = { ack: "received", needs_id: "asked to confirm it's you", deleted: "says deleted", refused: "refused", other: "other step" };
const c = d.counts;
document.getElementById("lead").textContent = `${d.requests.length} real deletion requests sent from the public demo inbox ${d.inbox} on ${d.sentDay}. Replies read on the device by Gemini Nano; each quote below is copied word for word from the company's email. Last checked ${when(d.checkedAt)}.`;
document.getElementById("stats").innerHTML = [[d.requests.length, "requests sent"], [c.replied, "companies replied"], [d.requests.filter((r) => r.hoops.some((h) => h.ask !== "still_marketing")).length, "asked for one more step first"], [d.requests.filter((r) => r.hoops.some((h) => h.ask === "still_marketing")).length, "still emailing after the request"]].map(([n, t]) => `<div><div class="num">${n}</div><div class="cap">${t}</div></div>`).join("");
document.getElementById("how").textContent = `Median first reply: ${d.medianReplyMin < 1 ? "under a minute (most first replies are automatic)" : d.medianReplyMin + (d.medianReplyMin === 1 ? " minute" : " minutes")}. Legal deadline for all: ${d.deadline} (Nigeria NDPA 2023, 30 days). A deletion only counts as proven after 30 days with no marketing.`;
document.getElementById("rows").innerHTML = d.requests.map((r) => `<tr><td><b>${esc(r.company)}</b><div class="q">${esc(r.ref)} · ${esc(r.route === "email" ? r.to : r.route.replace("_", " "))}</div></td><td data-label="Sent">${r.sentAt ? when(r.sentAt) : "–"}</td><td>${r.replies.length ? r.replies.map((x) => `<div><span class="tag">${esc(REPLY[x.reply] ?? x.reply)}</span> <span class="q">${when(x.at)}</span><div>“${esc(x.quote)}”</div></div>`).join("") : '<span class="muted">No reply yet</span>'}</td><td data-label="Where it stands">${esc(LABEL[r.state] ?? r.state)}</td></tr>`).join("");

const HOOP = {
  confirm_sender: ["Asked us to confirm the request came from the account holder", ""],
  use_form: ["Sent us to their own form", ""],
  log_in_delete: ["Sign in and delete it yourself", "fair"],
  verify_link: ["Click an email link to check it is you", "fair"],
  go_ahead: ["Reply YES in writing", ""],
  clarify: ["Asked what to delete", ""],
  provide_info: ["Asked for more details", ""],
  needs_id: ["Asked for a copy of ID", "red"],
  still_marketing: ["Kept sending marketing after we said stop", "red"],
};
const OUT = { deleted: ["Says deleted", "device"], scheduled: ["Deletion scheduled", "device"], no_account: ["No account under this email", ""] };
const hard = d.requests.filter((r) => r.hoops?.length || r.outcome).sort((a, b) => (b.hoops?.length ?? 0) - (a.hoops?.length ?? 0) || a.company.localeCompare(b.company));
document.getElementById("hard-rows").innerHTML = hard.map((r) => `<tr><td><b>${esc(r.company)}</b><div class="q">${r.hoops?.length ?? 0} step${r.hoops?.length === 1 ? "" : "s"}</div></td><td data-label="What they made us do">${(r.hoops ?? []).map((h) => { const [t, k] = HOOP[h.ask] ?? [h.ask, ""]; return `<div><span class="tag ${k === "red" ? "red" : k === "fair" ? "device" : ""}">${esc(t)}${k === "fair" ? " · fair" : ""}</span> <span class="q">${when(h.at)}</span>${h.quote ? `<div>“${esc(h.quote)}”</div>` : ""}</div>`; }).join("") || '<span class="muted">Nothing</span>'}</td><td data-label="Outcome">${r.outcome ? `<span class="tag ${OUT[r.outcome][1]}">${OUT[r.outcome][0]}</span> <span class="q">${when(r.outcomeAt)}</span>` : '<span class="muted">Waiting</span>'}</td></tr>`).join("");

// What their own privacy page says vs what their reply told us (site/saidvsdid.json, one rule for all 30).
const sv = await (await fetch("/saidvsdid.json", { cache: "no-store" })).json();
document.getElementById("said-lede").textContent = `${sv.rows.length} of the ${sv.checked} companies whose own privacy page tells you to email them about your rights answered our email by sending us to sign in or to their form instead. Both sentences are copied word for word: one from their privacy page, one from their reply.`;
document.getElementById("said-rows").innerHTML = sv.rows.map((r) => `<tr><td data-label="Company"><b>${esc(r.company)}</b><br><span class="q">${esc(r.pageEmail ?? "")}</span></td><td data-label="Their page says">“${esc(r.pageQuote)}” <a class="q" href="${esc(r.page)}">page</a></td><td data-label="They told us"><span class="tag amber">${esc(r.told)}</span><br>“${esc(r.toldQuote)}${/[.!?:”"]$/.test(r.toldQuote.trim()) ? "" : "…"}”</td></tr>`).join("");
