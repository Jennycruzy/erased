// Proof cards: each company's own words after our request, and how anyone can check it. Data: /proof.json.
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const day = (t) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const box = document.getElementById("proof-cards");
if (box) {
  const d = await (await fetch("/proof.json", { cache: "no-store" })).json();
  box.innerHTML = d.rows.map((r) => `
    <article class="proof-card ${r.kind}">
      <div class="proof-top"><b>${esc(r.company)}</b><span class="tag ${r.kind === "gone" ? "device" : "amber"}">${esc(r.verdict)}</span></div>
      <blockquote>“${esc(r.theirWords)}”</blockquote>
      <p class="q">${esc(r.source)} · ${day(r.at)}</p>
      <p class="proof-story">${esc(r.story)}</p>
      <a class="proof-check" href="${esc(r.checkUrl)}"${r.checkUrl.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${r.checkUrl.endsWith(".mp4") ? "Watch it" : r.checkUrl.startsWith("http") ? "Check it yourself" : "See it"} <span class="arrow">→</span><span class="q">${esc(r.check)}</span></a>
    </article>`).join("");
  const n = document.getElementById("proof-noaccount");
  if (n) n.textContent = `${d.noAccount.length} more companies (${d.noAccount.join(", ")}) wrote back that they hold no account for the address.`;
  window.dispatchEvent(new CustomEvent("proof", { detail: d }));
}
