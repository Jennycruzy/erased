const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const KEY = "AIzaSyAbSG59wFNc9zTtkVIePV5sYLeZvU9Rfew";
const url = `https://firestore.googleapis.com/v1/projects/forget-me-hybrid/databases/(default)/documents/board?pageSize=300&key=${KEY}`;
const r = await fetch(url);
const docs = r.ok ? ((await r.json()).documents ?? []) : [];
const n = (f, k) => Number(f?.[k]?.integerValue ?? f?.[k]?.doubleValue ?? 0);
const rows = docs.map((x) => ({ domain: decodeURIComponent(x.name.split("/").pop()), f: x.fields })).sort((a, b) => n(b.f, "requests") - n(a.f, "requests"));
document.getElementById("rows").innerHTML = rows.length
  ? rows.map(({ domain, f }) => `<tr><td><b>${esc(domain)}</b></td>${["requests", "confirmed", "proven", "broken", "refused", "overdue"].map((k) => `<td${k === "broken" && n(f, k) ? ' style="color:var(--red);font-weight:700"' : ""}>${n(f, k)}</td>`).join("")}</tr>`).join("")
  : `<tr><td colspan="7" class="muted">Outcomes appear here as people share them from the extension.</td></tr>`;
