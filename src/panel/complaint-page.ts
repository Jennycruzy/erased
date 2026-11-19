import { complaintHtml } from "../core/complaint";
import { chromeKV, Store } from "../core/store";

const id = new URLSearchParams(location.search).get("id") ?? "";
const store = new Store(chromeKV);
const [reqs, s] = await Promise.all([store.requests(), store.settings()]);
const r = reqs.find((x) => x.id === id);
if (!r) {
  document.body.textContent = "Request not found.";
} else {
  const html = complaintHtml(r, s.fullName, Date.now());
  const doc = new DOMParser().parseFromString(html, "text/html");
  document.title = doc.title;
  doc.querySelectorAll("button").forEach((b) => b.removeAttribute("onclick"));
  document.head.replaceChildren(...Array.from(doc.head.children).map((n) => document.importNode(n, true)));
  document.body.replaceChildren(...Array.from(doc.body.childNodes).map((n) => document.importNode(n, true)));
  document.querySelector("button")?.addEventListener("click", () => print());
}
