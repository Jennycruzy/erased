const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const d = await (await fetch("/directory.json")).json();
const routes = d.entries.filter((e) => e.request_route !== "unknown" && e.request_route !== "none");
document.getElementById("meta").textContent = `${d.count.toLocaleString()} companies checked, ${routes.length.toLocaleString()} with a deletion route. Updated ${new Date(d.generatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}.`;
const label = { email: "Email", form: "Form", portal: "Portal", account_settings: "Account settings" };
function render(q) {
  const rows = routes.filter((e) => !q || (e.company + " " + e.domain).toLowerCase().includes(q)).slice(0, 400);
  document.getElementById("rows").innerHTML = rows.map((e) => `<tr><td data-label="Company"><b>${esc(e.company || e.domain)}</b><div class="q">${esc(e.domain)}</div></td>
<td data-label="How"><span class="tag">${esc(label[e.request_route] ?? e.request_route)}</span>${e.verified ? "" : ' <span class="tag">unverified</span>'}</td>
<td data-label="Address">${e.dsar_email ? esc(e.dsar_email) : e.form_url ? `<a href="${esc(e.form_url)}" rel="nofollow noopener">form</a>` : `<a href="${esc(e.privacy_url)}" rel="nofollow noopener">privacy page</a>`}</td>
<td class="q" data-label="Their page says">${e.route_quote ? "“" + esc(e.route_quote) + "”" : ""}</td></tr>`).join("");
}
document.getElementById("q").addEventListener("input", (ev) => render(ev.target.value.trim().toLowerCase()));
render("");

// What each company's own privacy page promises about a deletion request (site/hurdles.json). A claim counts only
// when the page says it in a sentence we found on the page ourselves; everything else is "the page doesn't say".
const h = await (await fetch("/hurdles.json", { cache: "no-store" })).json();
const sm = h.summary, pct = (n) => Math.round((100 * n) / sm.pages);
const when = new Date(h.readUntil).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
document.getElementById("pr-lead").textContent = `We read the privacy pages of ${sm.pages} companies from the directory (up to ${when}). The law gives them a deadline: one month under GDPR and UK GDPR, 45 days in California. ${sm.noPromise} of ${sm.pages} pages never tell you when you will hear back.`;
document.getElementById("pr-stats").innerHTML = [[sm.pages, "privacy pages read"], [`${pct(sm.noPromise)}%`, "never say when they will answer", "red"], [sm.idRequired + sm.idMaybe, "say they may want an ID document"], [sm.agentAllowed, "let someone ask on your behalf"]]
  .map(([n, t, c]) => `<div><div class="num ${c ?? ""}">${n}</div><div class="cap">${t}</div></div>`).join("");
const KIND = { id_required: ["Wants an ID document", "red"], id_maybe: ["May ask for an ID document", "amber"], signin_only: ["Sign-in is the only way", "red"] };
const FILTERS = [["all", "All"], ["days", "Promise a time"], ["id", "ID document"], ["signin", "Sign-in only"], ["agent", "Someone can ask for you"], ["silent", "Promise no time"]];
const keep = { all: () => true, days: (r) => r.days, id: (r) => r.asks.some((a) => a.kind.startsWith("id_")), signin: (r) => r.asks.some((a) => a.kind === "signin_only"), agent: (r) => r.agent, silent: (r) => !r.days };
let on = "days";
function draw() {
  document.getElementById("pr-filters").innerHTML = FILTERS.map(([k, t]) => `<button class="tag ${k === on ? "on" : ""}" data-k="${k}">${t} · ${h.rows.filter(keep[k]).length}</button>`).join("");
  document.getElementById("pr-rows").innerHTML = h.rows.filter(keep[on]).map((r) => {
    const parts = [
      ...r.asks.map((a) => `<div class="promise"><span class="tag ${KIND[a.kind][1]}">${KIND[a.kind][0]}</span> “${esc(a.quote)}”</div>`),
      r.days ? `<div class="promise"><span class="tag device">Answers within ${r.days.days} days</span> “${esc(r.days.quote)}”</div>` : `<div class="promise"><span class="tag">Says nothing about when you'll hear back</span></div>`,
      r.agent ? `<div class="promise"><span class="tag cloud">Someone can ask for you</span> “${esc(r.agent)}”</div>` : "",
    ].join("");
    return `<tr><td data-label="Company"><b>${esc(r.company)}</b><div class="q"><a href="${esc(r.page)}" rel="nofollow noopener">privacy page</a></div></td><td data-label="Their page says">${parts}</td></tr>`;
  }).join("");
}
document.getElementById("pr-filters").addEventListener("click", (e) => { const k = e.target.closest("button")?.dataset.k; if (k) { on = k; draw(); } });
draw();
