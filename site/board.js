const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const r = await fetch("/board.json", { cache: "no-cache" });
const data = r.ok ? await r.json() : { entries: {}, minReports: 5 };
const n = (f, k) => Number(f?.[k] ?? 0);
const rows = Object.entries(data.entries).map(([domain, f]) => ({ domain, f })).sort((a, b) => n(b.f, "requests") - n(a.f, "requests"));
document.getElementById("rows").innerHTML = rows.length
  ? rows.map(({ domain, f }) => `<tr><td><b>${esc(domain)}</b></td>${["requests", "confirmed", "proven", "broken", "refused", "overdue"].map((k) => `<td${k === "broken" && n(f, k) ? ' style="color:var(--red);font-weight:700"' : ""}>${n(f, k)}</td>`).join("")}</tr>`).join("")
  : `<tr><td colspan="7" class="muted">Companies appear here once ${data.minReports} people have shared an outcome from the extension.</td></tr>`;
