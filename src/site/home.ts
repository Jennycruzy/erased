// Home page: the hero scan, counters, the scroll-lit steps, a Reply Coach demo that runs Erased's own rules and
// answers (src/core/coach.ts) on six real replies, and the wall of the 30 real requests from /run.json.
import { askByRules, coach, type Ask } from "../core/coach";
import { companyDomain } from "../core/domain";
import type { StoredRequest } from "../core/store";
import replies from "../../evals/replies.json";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (s: string) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, still ? 0 : ms));

// ---------- Things rise into view once ----------
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---------- Counters ----------
function countTo(el: HTMLElement, to: number, ms = 1600) {
  if (still) { el.textContent = to.toLocaleString("en-US"); return; }
  const t0 = performance.now();
  const tick = (t: number) => {
    const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(to * e).toLocaleString("en-US");
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { countTo(e.target as HTMLElement, Number((e.target as HTMLElement).dataset.count)); cio.unobserve(e.target); } }), { threshold: 0.6 });
document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => cio.observe(el));

// ---------- Hero: one real inbox being read ----------
// The maker's inbox (19 Nov 2026, headers only) and breach facts from the bundled Have I Been Pwned catalogue.
const ROWS: Array<[string, string, string]> = [
  ["Substack", "Breached 23 Oct 2025 · 663,121 accounts", "red"],
  ["Crunchyroll", "Breached 12 Mar 2026 · 1,195,684 accounts", "red"],
  ["Vimeo", "Breached 28 Apr 2026 · 119,167 accounts", "red"],
  ["LinkedIn", "On the public breach list", "red"],
];
async function hero() {
  await sleep(500);
  countTo($("scan-n"), 845, 2600);
  countTo($("scan-s"), 365, 2600);
  const ul = $("scan-rows");
  for (const [i, [name, line]] of ROWS.entries()) {
    await sleep(i === 0 ? 700 : 520);
    ul.insertAdjacentHTML("beforeend", `<li><span class="ic">${esc(name[0])}</span><span class="who"><b>${esc(name)}</b><span>${esc(line)}</span></span><span class="tag red">after you joined</span></li>`);
    $("scan-b").textContent = String(i + 1);
  }
  await sleep(520);
  ul.insertAdjacentHTML("beforeend", `<li><span class="ic">+</span><span class="who"><b>841 more companies</b><span>each with when you joined</span></span><span class="tag device">on device</span></li>`);
}
hero();

// ---------- How it works: the rail fills as you scroll ----------
const rail = $("rail"), fill = $("rail-fill"), steps = [...rail.querySelectorAll<HTMLElement>(".step")];
function onScroll() {
  const r = rail.getBoundingClientRect(), mid = innerHeight * 0.55;
  const h = Math.max(0, Math.min(r.height - 12, mid - r.top));
  fill.style.height = `${h}px`;
  for (const s of steps) s.classList.toggle("lit", s.getBoundingClientRect().top < mid);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Reply Coach demo ----------
interface Reply { id: number; company: string; from: string; subject: string; receivedAt: string; text: string; label: Ask }
const SAMPLES = [2, 3, 50, 25, 66, 19].map((id) => (replies as Reply[]).find((r) => r.id === id)!).filter(Boolean);
let running = 0;
async function demo(rep: Reply) {
  const me = ++running;
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c.getAttribute("data-id") === String(rep.id)));
  $("mail-hd").innerHTML = `From ${esc(rep.from)} · ${esc(rep.receivedAt.slice(0, 10))}<b>${esc(rep.subject)}</b>`;
  const bd = $("mail-bd"), card = $("coachcard");
  card.innerHTML = `<p class="ph"><span class="reading">Reading…</span></p>`;
  // The reply types in, fast.
  const text = rep.text.trim();
  const step = Math.max(6, Math.ceil(text.length / 70));
  for (let i = 0; i <= text.length; i += step) {
    if (me !== running) return;
    bd.innerHTML = esc(text.slice(0, i)) + `<span class="caret"></span>`;
    bd.scrollTop = bd.scrollHeight;
    await sleep(14);
  }
  const found = askByRules(text);
  bd.innerHTML = found.quote ? esc(text).replace(esc(found.quote), `<mark>${esc(found.quote)}</mark>`) : esc(text);
  bd.querySelector("mark")?.scrollIntoView({ block: "center", behavior: still ? "auto" : "smooth" });
  await sleep(450);
  if (me !== running) return;
  const at = Date.parse(rep.receivedAt);
  const ref = rep.subject.match(/\bER-[A-Z0-9]{5}\b/)?.[0] ?? "ER-PRACT";
  const r = { id: "demo", domain: companyDomain(rep.from.split("@")[1] ?? "") || "example.com", kind: "delete", law: "gdpr", ref, company: rep.company,
    route: "email", to: rep.from, formUrl: null, accountEmail: "you@example.com", createdAt: at - 3 * 864e5, events: [{ type: "sent", at: at - 3 * 864e5 }] } as unknown as StoredRequest;
  const a = coach(r, { ask: found.ask, at, from: rep.from, subject: rep.subject, text, links: [], quote: found.quote }, "");
  const act = a.action;
  card.innerHTML = `<span class="tag ${found.ask === "wait" ? "" : "amber"}">${found.ask === "wait" ? "Nothing asked yet" : "They ask one thing of you"}</span>
    <h3>${esc(a.headline)}</h3><p class="why">${esc(a.why)}</p>
    ${a.legal.map((l) => `<p class="law">${esc(l)}</p>`).join("")}
    ${act.type === "email" ? `<pre>${esc(act.body)}</pre>` : `<p><b>${esc(act.label)}</b></p>`}`;
}
$("chips").innerHTML = SAMPLES.map((r) => `<button class="chip" data-id="${r.id}">${esc(r.company)}</button>`).join("");
document.querySelectorAll<HTMLButtonElement>(".chip").forEach((b) => (b.onclick = () => demo(SAMPLES.find((r) => String(r.id) === b.dataset.id)!)));
// Start the first one when the section comes into view.
const dio = new IntersectionObserver((es) => { if (es[0].isIntersecting) { demo(SAMPLES[0]); dio.disconnect(); } }, { threshold: 0.4 });
dio.observe($("chips"));

// ---------- The wall of 30 real requests ----------
interface Hoop { ask: string; at: number; quote: string }
interface Req { company: string; domain: string; sentAt: number; replies: Array<{ at: number; reply: string; quote: string }>; hoops: Hoop[]; outcome: string | null }
const KINDS = [
  ["mkt", "Still emailing after the request", "var(--red)"],
  ["hoop", "Asked for one more step", "var(--amber)"],
  ["done", "Deleted or scheduled", "var(--mint)"],
  ["none", "No account found", "var(--blue)"],
  ["wait", "Received, waiting", "var(--dim)"],
] as const;
const ASKW: Record<string, string> = {
  still_marketing: "Sent marketing after the request", log_in_delete: "Sign in and delete it yourself", use_form: "Use our form", verify_link: "Click a check-it's-you link",
  confirm_sender: "Prove the request comes from you", go_ahead: "Reply YES", clarify: "Say what to delete", provide_info: "Send more details",
};
const kindOf = (r: Req) => r.hoops.some((h) => h.ask === "still_marketing") ? "mkt" : r.outcome === "deleted" || r.outcome === "scheduled" ? "done" : r.outcome === "no_account" ? "none" : r.hoops.length ? "hoop" : "wait";
const day = (t: number) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
async function wall() {
  const d = (await (await fetch("/run.json", { cache: "no-store" })).json()) as { requests: Req[] };
  const reqs = d.requests;
  const order = Object.fromEntries(KINDS.map(([k], i) => [k, i]));
  reqs.sort((a, b) => order[kindOf(a)] - order[kindOf(b)] || a.company.localeCompare(b.company));
  const count = (k: string) => reqs.filter((r) => kindOf(r) === k).length;
  $("legend").innerHTML = KINDS.map(([k, l, c]) => `<button data-k="${k}"><i style="background:${c}"></i>${l} · <span class="mono">${count(k)}</span></button>`).join("");
  $("wall").innerHTML = reqs.map((r, i) => {
    const k = kindOf(r);
    const sub = k === "mkt" ? "still emailing" : k === "done" ? (r.outcome === "deleted" ? "deleted" : "deletion scheduled") : k === "none" ? "no account" : k === "hoop" ? "one more step" : r.replies.length ? "received" : "no reply yet";
    return `<button class="tile ${k} reveal" style="--d:${(i % 6) * 0.04}s" data-i="${i}"><b>${esc(r.company)}</b><span>${sub}</span></button>`;
  }).join("");
  document.querySelectorAll("#wall .reveal").forEach((el) => io.observe(el));
  let filter = "";
  document.querySelectorAll<HTMLButtonElement>("#legend button").forEach((b) => (b.onclick = () => {
    filter = filter === b.dataset.k ? "" : b.dataset.k!;
    document.querySelectorAll("#legend button").forEach((x) => x.classList.toggle("on", (x as HTMLElement).dataset.k === filter));
    document.querySelectorAll<HTMLElement>(".tile").forEach((t) => t.classList.toggle("dim", !!filter && !t.classList.contains(filter)));
  }));
  document.querySelectorAll<HTMLButtonElement>(".tile").forEach((t) => (t.onclick = () => {
    document.querySelectorAll(".tile").forEach((x) => x.classList.toggle("on", x === t));
    const r = reqs[Number(t.dataset.i)];
    const last = [...r.hoops].sort((a, b) => b.at - a.at)[0];
    const rep = [...r.replies].filter((x) => x.quote && x.quote.length > 12).sort((a, b) => b.at - a.at)[0];
    const what = last ? `${ASKW[last.ask] ?? last.ask} · ${day(last.at)}` : rep ? `Replied · ${day(rep.at)}` : "No reply yet";
    const quote = last?.quote ?? rep?.quote ?? "";
    $("detail").innerHTML = `<b>${esc(r.company)}</b> <span class="muted">· request sent ${day(r.sentAt)} · ${esc(what)}</span>${quote ? `<div class="q2">"${esc(quote)}"</div>` : ""}`;
  }));
}
wall().catch(() => ($("wall-lede").textContent = "The live run could not be loaded right now."));
