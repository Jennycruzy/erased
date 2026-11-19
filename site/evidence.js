const d = await (await fetch("/directory.json")).json();
const c = (p) => d.entries.filter(p).length;
const routes = c((e) => e.request_route !== "unknown" && e.request_route !== "none");
document.getElementById("dirstats").textContent =
  `${d.count.toLocaleString()} companies checked · ${routes.toLocaleString()} with a deletion route · ${c((e) => e.dsar_email).toLocaleString()} with a privacy email · ${c((e) => e.verified).toLocaleString()} verified by quote · updated ${new Date(d.generatedAt).toLocaleDateString()}`;
