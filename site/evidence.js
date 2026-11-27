const d = await (await fetch("/directory.json")).json();
const c = (p) => d.entries.filter(p).length;
const routes = c((e) => e.request_route !== "unknown" && e.request_route !== "none");
document.getElementById("dirstats").textContent =
  `${d.count.toLocaleString()} companies checked · ${routes.toLocaleString()} with a deletion route · ${c((e) => e.dsar_email).toLocaleString()} with a privacy email · ${c((e) => e.verified).toLocaleString()} verified by quote · updated ${new Date(d.generatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

const ev = await (await fetch("/evals.json", { cache: "no-store" })).json();
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
document.getElementById("acc").innerHTML = [
  ["Held out: " + ev.heldOut.what, `Nano alone ${ev.heldOut.nanoAlone} · rules alone ${ev.heldOut.rulesAlone} · rules + Nano ${ev.heldOut.shippedMix}`],
  ...(ev.heldOut2 ? [["Held out again: " + ev.heldOut2.what, `Nano alone ${ev.heldOut2.nanoAlone} (${ev.heldOut2.onDevice} on the device) · cloud alone ${ev.heldOut2.cloudAlone} · rules alone ${ev.heldOut2.rulesAlone} · rules + Nano ${ev.heldOut2.shippedMix}`]] : []),
  ["All 66, Nano alone", `${ev.all66.nanoAlone} (quote found ${ev.all66.nanoQuoteFound})`],
  ["All 66, as shipped (" + ev.all66.shippedNote + ")", ev.all66.shipped],
  ["Where it ran", `${ev.all66.onDevice} on the device · median ${(ev.all66.medianMs / 1000).toFixed(1)} s · ${ev.device}`],
  ...(ev.repeat ? [["Repeat, " + ev.repeat.ranAt.slice(0, 10) + " (" + ev.repeat.what + ")", `Nano alone ${ev.repeat.nanoAlone} · quote found ${ev.repeat.nanoQuoteFound} · ${ev.repeat.onDevice} on the device · median ${(ev.repeat.medianMs / 1000).toFixed(1)} s`]] : []),
  ...(ev.more ?? []),
  ...(ev.judge ? [["Try it page, " + ev.judge.ranAt.slice(0, 10) + " (" + ev.judge.what + ")", ev.judge.result]] : []),
].map(([a, b]) => `<tr><td>${esc(a)}</td><td><b>${esc(b)}</b></td></tr>`).join("");
