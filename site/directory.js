const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const d = await (await fetch("/directory.json")).json();
const routes = d.entries.filter((e) => e.request_route !== "unknown" && e.request_route !== "none");
document.getElementById("meta").textContent = `${d.count.toLocaleString()} companies checked, ${routes.length.toLocaleString()} with a deletion route. Updated ${new Date(d.generatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}.`;
const label = { email: "Email", form: "Form", portal: "Portal", account_settings: "Account settings" };
function render(q) {
  const rows = routes.filter((e) => !q || (e.company + " " + e.domain).toLowerCase().includes(q)).slice(0, 400);
  document.getElementById("rows").innerHTML = rows.map((e) => `<tr><td><b>${esc(e.company || e.domain)}</b><div class="q">${esc(e.domain)}</div></td>
<td><span class="tag">${esc(label[e.request_route] ?? e.request_route)}</span>${e.verified ? "" : ' <span class="tag">unverified</span>'}</td>
<td>${e.dsar_email ? esc(e.dsar_email) : e.form_url ? `<a href="${esc(e.form_url)}" rel="nofollow noopener">form</a>` : `<a href="${esc(e.privacy_url)}" rel="nofollow noopener">privacy page</a>`}</td>
<td class="q">${e.route_quote ? "“" + esc(e.route_quote) + "”" : ""}</td></tr>`).join("");
}
document.getElementById("q").addEventListener("input", (ev) => render(ev.target.value.trim().toLowerCase()));
render("");
