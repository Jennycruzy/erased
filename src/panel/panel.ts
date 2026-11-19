import breachFile from "../../data/breaches.json";
import { getRemoteConfig, getValue, fetchAndActivate } from "firebase/remote-config";
import { indexBreaches } from "../core/breaches";
import type { DirectoryEntry } from "../core/directory";
import { companyDomain } from "../core/domain";
import { ACCOUNT_SEARCH, kindFromSubject } from "../core/headers";
import { lawFor, type RequestKind } from "../core/laws";
import { morningCard } from "../core/morning";
import { status } from "../core/requests";
import { chromeKV, newRequest, Store, type StoredRequest } from "../core/store";
import { buildFollowUp, buildRequest, composeUrl, newRef } from "../core/templates";
import { DAY } from "../core/time";
import { safetyScore, summarise, type Company, type Sighting } from "../core/trail";
import { companyReplies, marketingEvent, replyEvent, sentEvent, watchQueries, type MailRow } from "../core/watch";
import { firebase } from "../ai/firebase";
import { lookupRoute } from "../ai/lookup";
import { ACCOUNT_SCHEMA, isMarketing, MARKETING_SCHEMA, privateModel, readReply, REPLY_SCHEMA } from "../ai/models";
import { shareOutcome } from "../ai/board";

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = "", text = "") => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
};
const store = new Store(chromeKV);
const breaches = indexBreaches(breachFile.breaches as Array<Record<string, unknown>>);
const sightings = new Map<string, Sighting[]>();
let companies: Company[] = [];
let directory = new Map<string, DirectoryEntry>();
let filter = "risk";
let deviceReady = false;
const fmtDate = (t: number) => (Number.isFinite(t) ? new Date(t).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "–");
const fmtDay = (t: number) => new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

// ---------- Firebase (App Check debug token; Remote Config for the directory location and timings) ----------
const fb = () => firebase({ debugToken: true });

async function loadDirectory() {
  let url = "https://forget-me-hybrid.web.app/directory.json";
  try {
    const rc = getRemoteConfig(fb().app);
    rc.defaultConfig = { directory_url: url };
    await fetchAndActivate(rc);
    url = getValue(rc, "directory_url").asString() || url;
  } catch { /* defaults stay */ }
  try {
    const r = await fetch(url, { cache: "no-cache" });
    if (r.ok) {
      const list = (await r.json()) as { entries: DirectoryEntry[] };
      directory = new Map(list.entries.map((e) => [e.domain, e]));
    }
  } catch { /* the trail still works without it */ }
  const extra = ((await chromeKV.get("lookups")) as DirectoryEntry[] | undefined) ?? [];
  for (const e of extra) if (!directory.has(e.domain)) directory.set(e.domain, e);
}

// ---------- Trail ----------
function recompute() {
  const now = Date.now();
  companies = [...sightings].map(([d, s]) => summarise(d, s, breaches.get(d) ?? [], now));
  companies.sort((a, b) => b.breachedAfterJoining.length - a.breachedAfterJoining.length || Number(b.stale) - Number(a.stale) || b.emails - a.emails);
  $("count").textContent = companies.length.toLocaleString();
  $("score").textContent = companies.length ? String(safetyScore(companies)) : "–";
  renderTrail();
  void renderClean();
}

function renderTrail() {
  const list = $("list");
  const shown = companies.filter((c) =>
    filter === "all" ? true : filter === "breached" ? c.breaches.length > 0 : filter === "stale" ? c.stale : c.breachedAfterJoining.length > 0 || c.stale);
  if (!shown.length) {
    list.replaceChildren(el("li", "empty", companies.length ? "Nothing in this view." : "Scan your inbox to see who holds your data."));
    return;
  }
  list.replaceChildren(...shown.slice(0, 300).map(trailRow));
}

function whyLine(c: Company): HTMLElement {
  const why = el("div", "why", `${c.emails} email${c.emails === 1 ? "" : "s"} · first ${fmtDate(c.firstSeen)} · last ${fmtDate(c.lastSeen)}`);
  if (c.breachedAfterJoining.length) {
    const b = c.breachedAfterJoining[0];
    const line = el("div");
    line.append(el("b", "", `Breached ${b.date.slice(0, 7)} after you joined: ${b.title} (${b.accounts.toLocaleString()} accounts)`));
    why.append(line);
  }
  return why;
}

function trailRow(c: Company): HTMLLIElement {
  const li = el("li", "item");
  const dot = el("span", "dot " + (c.breachedAfterJoining.length ? "red" : c.breaches.length ? "amber" : c.account === "confirmed" ? "" : "hollow"));
  const mid = el("div");
  mid.append(el("div", "name", c.domain), whyLine(c));
  const tag = el("span", "tag" + (c.breachedAfterJoining.length ? " red" : ""), c.breachedAfterJoining.length ? "Breached" : c.stale ? "Unused" : c.account === "confirmed" ? "Account" : "Seen");
  li.append(dot, mid, tag);
  return li;
}

function addRows(rows: MailRow[]) {
  for (const r of rows) {
    const d = companyDomain(r.from);
    if (!d) continue;
    const list = sightings.get(d) ?? [];
    list.push({ domain: d, at: r.at, kind: kindFromSubject(r.subject) });
    sightings.set(d, list);
  }
  recompute();
}

async function gmailTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true, url: "https://mail.google.com/*" });
  if (tab?.id) return tab;
  const any = await chrome.tabs.query({ url: "https://mail.google.com/*" });
  return any[0] ?? null;
}

/** Runs one Gmail search in the open Gmail tab and collects the rows. */
async function search(query: string, maxPages: number, onRows?: (rows: MailRow[], page: number) => void): Promise<MailRow[]> {
  const tab = await gmailTab();
  if (!tab?.id) throw new Error("Open Gmail in this window first.");
  return new Promise((resolve) => {
    const all: MailRow[] = [];
    const port = chrome.tabs.connect(tab.id!, { name: "erased-scan" });
    port.onMessage.addListener((m: { type: string; rows?: MailRow[]; page?: number }) => {
      if (m.type === "rows" && m.rows) { all.push(...m.rows); onRows?.(m.rows, m.page ?? 0); }
      if (m.type === "done") { port.disconnect(); resolve(all); }
    });
    port.postMessage({ type: "scan", query, maxPages });
  });
}

async function scan() {
  $<HTMLButtonElement>("scan").disabled = true;
  sightings.clear();
  try {
    const rows = await search(ACCOUNT_SEARCH, 200, (r, page) => { addRows(r); $("progress").textContent = `Reading page ${page}…`; });
    $("progress").textContent = `${rows.length.toLocaleString()} account emails read`;
    await chromeKV.set("trail", companies.map(({ domain, emails, firstSeen, lastSeen, signedUp, account, stale }) => ({ domain, emails, firstSeen, lastSeen, signedUp, account, stale })));
    await chromeKV.set("lastScan", Date.now());
  } catch (e) {
    $("progress").textContent = String((e as Error).message);
  } finally {
    $<HTMLButtonElement>("scan").disabled = false;
  }
}

async function restoreTrail() {
  const saved = (await chromeKV.get("trail")) as Array<Pick<Company, "domain" | "emails" | "firstSeen" | "lastSeen" | "signedUp" | "account" | "stale">> | undefined;
  if (!saved?.length) return;
  const now = Date.now();
  companies = saved.map((s) => {
    const bs = breaches.get(s.domain) ?? [];
    const joined = s.signedUp ?? s.firstSeen;
    return { ...s, breaches: bs, breachedAfterJoining: bs.filter((b) => Date.parse(b.date) > joined), stale: Number.isFinite(s.lastSeen) && now - s.lastSeen >= 3 * 365 * DAY };
  });
  $("count").textContent = companies.length.toLocaleString();
  $("score").textContent = String(safetyScore(companies));
  renderTrail();
}

// ---------- Clean up ----------
const chosenKind = new Map<string, RequestKind>();

async function renderClean() {
  const reqs = await store.requests();
  const asked = new Set(reqs.map((r) => r.domain));
  const picks = companies.filter((c) => (c.breachedAfterJoining.length || c.stale) && c.account !== "unknown" && !asked.has(c.domain));
  $("clean-n").textContent = picks.length ? String(picks.length) : "";
  const list = $("clean-list");
  if (!picks.length) {
    list.replaceChildren(el("li", "empty", companies.length ? "Nothing to clean up right now." : "Scan your inbox first."));
    return;
  }
  list.replaceChildren(...picks.slice(0, 200).map(cleanRow));
}

function cleanRow(c: Company): HTMLLIElement {
  const li = el("li", "item");
  const dot = el("span", "dot " + (c.breachedAfterJoining.length ? "red" : "hollow"));
  const mid = el("div");
  const dir = directory.get(c.domain);
  const route = el("div", "why", dir && dir.request_route !== "unknown"
    ? `How: ${dir.request_route.replace("_", " ")}${dir.dsar_email ? ` (${dir.dsar_email})` : ""}${dir.verified ? "" : " · unverified"}`
    : "How: not in the directory yet");
  const recent = Number.isFinite(c.lastSeen) && Date.now() - c.lastSeen < 90 * DAY;
  if (!chosenKind.has(c.domain)) chosenKind.set(c.domain, recent ? "stop_marketing" : "delete");
  const seg = el("div", "seg");
  for (const [k, label] of [["delete", "Delete me"], ["stop_marketing", "Stop marketing"]] as const) {
    const b = el("button", chosenKind.get(c.domain) === k ? "on" : "", label);
    b.onclick = () => { chosenKind.set(c.domain, k); seg.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); };
    seg.append(b);
  }
  const acts = el("div", "row-actions");
  acts.append(seg);
  if (dir && dir.request_route !== "unknown" && dir.request_route !== "none") {
    const go = el("button", "primary", "Write request");
    go.onclick = () => void writeRequest(c, dir);
    acts.append(go);
  } else {
    const look = el("button", "", "Find how to remove");
    look.title = "Sends only this company's name to cloud Gemini, which reads its public privacy page.";
    look.onclick = async () => {
      look.disabled = true;
      look.textContent = "Reading their privacy page…";
      try {
        const e = await lookupRoute(fb().ai, c.domain);
        directory.set(c.domain, e);
        const extra = ((await chromeKV.get("lookups")) as DirectoryEntry[] | undefined) ?? [];
        await chromeKV.set("lookups", [...extra.filter((x) => x.domain !== c.domain), e]);
        void renderClean();
      } catch (err) {
        look.textContent = "Couldn't read it";
        look.title = String((err as Error).message);
      }
    };
    acts.append(look);
  }
  mid.append(el("div", "name", dir?.company || c.domain), whyLine(c), route, acts);
  li.append(dot, mid, el("span", "tag" + (c.breachedAfterJoining.length ? " red" : ""), c.breachedAfterJoining.length ? "Breached" : "Unused"));
  return li;
}

async function writeRequest(c: Company, dir: DirectoryEntry) {
  const s = await store.settings();
  if (!s.fullName || !s.accountEmail) { switchTab("settings"); $("progress").textContent = "Add your name first (it goes in the letter)."; return; }
  const law = lawFor(s.region);
  const kind = chosenKind.get(c.domain) ?? "delete";
  const ref = newRef();
  const now = Date.now();
  const r = newRequest({ id: `${c.domain}:${ref}`, ref, domain: c.domain, company: dir.company || c.domain, kind, law: law.id, route: dir.request_route,
    to: dir.dsar_email, formUrl: dir.form_url, accountEmail: s.accountEmail, now });
  await store.upsert(r);
  const letter = buildRequest({ kind, law: law.id, company: r.company, fullName: s.fullName, accountEmail: s.accountEmail, ref, sentAt: now });
  if (dir.dsar_email) {
    await chrome.tabs.create({ url: composeUrl(dir.dsar_email, letter.subject, letter.body) });
  } else {
    await navigator.clipboard.writeText(`${letter.subject}\n\n${letter.body}`).catch(() => undefined);
    await chrome.tabs.create({ url: dir.form_url || dir.privacy_url });
    $("progress").textContent = "Request copied: paste it into their form.";
  }
  void renderClean();
  void renderWatch();
}

// ---------- Watch ----------
function ring(fraction: number, color: string): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 36 36");
  svg.setAttribute("class", "ring");
  const bg = document.createElementNS(ns, "circle");
  bg.setAttribute("cx", "18"); bg.setAttribute("cy", "18"); bg.setAttribute("r", "15"); bg.setAttribute("class", "bg");
  const fg = document.createElementNS(ns, "circle");
  const len = 2 * Math.PI * 15;
  fg.setAttribute("cx", "18"); fg.setAttribute("cy", "18"); fg.setAttribute("r", "15");
  fg.setAttribute("stroke", color);
  fg.setAttribute("stroke-dasharray", `${Math.max(0, Math.min(1, fraction)) * len} ${len}`);
  fg.setAttribute("transform", "rotate(-90 18 18)");
  svg.append(bg, fg);
  return svg;
}

async function renderWatch() {
  const reqs = await store.requests();
  const now = Date.now();
  $("watch-n").textContent = reqs.length ? String(reqs.length) : "";
  const list = $("watch-list");
  if (!reqs.length) { list.replaceChildren(el("li", "empty", "Requests you send show up here with their legal deadline.")); return; }
  list.replaceChildren(...reqs.map((r) => {
    const s = status(r, now);
    const li = el("li", "item watch");
    const sent = r.events.find((e) => e.type === "sent")?.at;
    const frac = sent && s.deadline ? (now - sent) / (s.deadline - sent) : 0;
    const color = s.state === "proven" ? "var(--green)" : s.state === "broken" || s.state === "complaint_ready" ? "var(--red)" : s.state === "overdue" ? "var(--amber)" : "var(--fg)";
    const mid = el("div");
    mid.append(el("div", "name", r.company), el("div", "why", s.reason));
    const ev = s.evidence;
    if (ev && (ev.type === "reply" || ev.type === "extension_notice")) mid.append(el("div", "quote", `“${ev.quote}”`));
    if (ev && ev.type === "marketing") mid.append(el("div", "quote", `Marketing after deletion: “${ev.subject}”`));
    const acts = el("div", "row-actions");
    if (s.state === "drafted") {
      const again = el("button", "", "Open the request again");
      again.onclick = async () => {
        const st = await store.settings();
        const letter = buildRequest({ kind: r.kind, law: r.law, company: r.company, fullName: st.fullName, accountEmail: r.accountEmail, ref: r.ref, sentAt: r.createdAt });
        await chrome.tabs.create({ url: r.to ? composeUrl(r.to, letter.subject, letter.body) : (r.formUrl ?? `https://${r.domain}/privacy`) });
      };
      acts.append(again);
    }
    if (s.state === "overdue" && r.to) {
      const fu = el("button", "", "Send follow-up");
      fu.onclick = async () => {
        const st = await store.settings();
        const letter = buildFollowUp({ kind: r.kind, law: r.law, company: r.company, fullName: st.fullName, accountEmail: r.accountEmail, ref: r.ref, sentAt: now, originalSentAt: sent ?? r.createdAt });
        await chrome.tabs.create({ url: composeUrl(r.to!, letter.subject, letter.body) });
        await store.addEvent(r.id, { type: "followed_up", at: Date.now() });
        void renderWatch();
      };
      acts.append(fu);
    }
    if (s.state === "needs_id") {
      const skip = el("button", "", "I won't send ID");
      skip.onclick = async () => { await store.addEvent(r.id, { type: "user_skipped_id", at: Date.now() }); void renderWatch(); };
      acts.append(skip);
    }
    if (s.state === "complaint_ready" || s.state === "broken") {
      const pack = el("button", "primary", "Complaint pack");
      pack.onclick = () => chrome.tabs.create({ url: chrome.runtime.getURL(`complaint.html?id=${encodeURIComponent(r.id)}`) });
      acts.append(pack);
    }
    if (acts.childElementCount) mid.append(acts);
    const label = s.state === "proven" ? "ERASED" : s.state === "broken" ? "NOT ERASED" : s.state === "complaint_ready" ? "COMPLAINT" : s.state === "overdue" ? "OVERDUE" : s.state.toUpperCase().replace("_", " ");
    const cls = s.state === "proven" ? "proven" : s.state === "broken" || s.state === "complaint_ready" ? "broken" : s.state === "overdue" || s.state === "needs_id" ? "act" : "wait";
    li.append(ring(s.state === "proven" ? 1 : frac, color), mid, el("span", `verdict ${cls}`, label));
    return li;
  }));
}

async function threadText(threadId: string): Promise<string | null> {
  const tab = await gmailTab();
  if (!tab?.id) return null;
  const res = (await chrome.tabs.sendMessage(tab.id, { type: "thread", threadId }).catch(() => null)) as { text: string | null } | null;
  return res?.text ?? null;
}

/** Looks for the sent copy, the company's replies, and marketing after a confirmation. */
async function checkReplies() {
  const btn = $<HTMLButtonElement>("check");
  btn.disabled = true;
  const replyModel = deviceReady ? privateModel(fb().ai, REPLY_SCHEMA) : null;
  const mktModel = deviceReady ? privateModel(fb().ai, MARKETING_SCHEMA) : null;
  try {
    for (const r of await store.requests()) {
      const q0 = watchQueries(r);
      if (!r.events.some((e) => e.type === "sent")) {
        const ev = sentEvent(await search(q0.sent, 2));
        if (ev) await store.addEvent(r.id, ev);
      }
      if (!r.events.some((e) => e.type === "sent")) continue;
      $("progress").textContent = `Checking ${r.company}…`;
      for (const row of companyReplies(r, await search(q0.replies, 3))) {
        if (!row.threadId || !replyModel) continue;
        if (r.events.some((e) => e.type === "reply" && e.at === row.at)) continue;
        const text = await threadText(row.threadId);
        if (!text) continue;
        const read = await readReply(replyModel, row.from, row.subject, text);
        for (const ev of replyEvent(row.at, { ...read.value, quoteOk: read.quoteOk })) await store.addEvent(r.id, ev);
      }
      const fresh = (await store.requests()).find((x) => x.id === r.id)!;
      const confirmed = fresh.events.find((e) => e.type === "reply" && e.reply === "deleted");
      if (confirmed) {
        const q = watchQueries(fresh, confirmed.at);
        for (const row of await search(q.marketing!, 2)) {
          let device: { marketing: boolean; quoteOk: boolean } | undefined;
          if (mktModel && row.threadId) {
            const text = await threadText(row.threadId);
            if (text) { const m = await isMarketing(mktModel, row.from, row.subject, text); device = { marketing: m.value.marketing, quoteOk: m.quoteOk }; }
          }
          const ev = marketingEvent(row, device);
          if (ev) await store.addEvent(r.id, ev);
        }
      }
      await maybeShare(fresh.id);
    }
    await chromeKV.set("lastChecked", Date.now());
    $("progress").textContent = deviceReady ? "Checked." : "Checked sent mail. Turn on on-device AI to read replies.";
  } catch (e) {
    $("progress").textContent = String((e as Error).message);
  } finally {
    btn.disabled = false;
    void renderWatch();
    void renderMorning();
  }
}

async function maybeShare(id: string) {
  const s = await store.settings();
  if (!s.shareOutcomes) return;
  const r = (await store.requests()).find((x) => x.id === id);
  if (!r) return;
  const st = status(r, Date.now());
  const outcome = st.state === "proven" ? "proven" : st.state === "broken" ? "broken" : st.state === "complaint_ready" && st.result === "REFUSED_WITH_REASON" ? "refused" : st.state === "overdue" ? "overdue" : r.events.some((e) => e.type === "sent") ? "requests" : null;
  if (outcome) await shareOutcome(fb().app, r.domain, outcome).catch(() => undefined);
}

async function renderMorning() {
  const reqs = await store.requests();
  const last = ((await chromeKV.get("lastSeenMorning")) as number | undefined) ?? 0;
  const card = morningCard(reqs, Date.now(), last);
  const box = $("morning");
  box.hidden = !card.lines.length;
  box.replaceChildren(...card.lines.map((l) => el("div", "", l)));
  await chromeKV.set("lastSeenMorning", Date.now());
  await chrome.action.setBadgeText({ text: "" });
}

// ---------- On-device AI ----------
async function deviceStatus() {
  const pill = $("ai-status");
  const LM = (globalThis as unknown as { LanguageModel?: { availability: (o?: object) => Promise<string> } }).LanguageModel;
  if (!LM) { pill.textContent = "On-device AI not in this Chrome"; pill.className = "pill off"; return; }
  const a = await LM.availability({ expectedInputs: [{ type: "text", languages: ["en"] }] }).catch(() => "unavailable");
  deviceReady = a === "available";
  pill.textContent = deviceReady ? "On-device AI ready" : a === "unavailable" ? "On-device AI unavailable" : "On-device AI: download needed";
  pill.className = "pill " + (deviceReady ? "device" : "off");
}

async function getReady() {
  const model = privateModel(fb().ai, ACCOUNT_SCHEMA);
  const pill = $("ai-status");
  await model.initializeDeviceModel((p) => { pill.textContent = `Downloading on-device AI ${Math.round(p * 100)}%`; });
  await deviceStatus();
}

// ---------- Settings and tabs ----------
function switchTab(name: string) {
  document.querySelectorAll<HTMLElement>("[data-view]").forEach((v) => (v.hidden = v.dataset.view !== name));
  document.querySelectorAll<HTMLElement>("#tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === name));
  if (name === "watch") void renderWatch();
  if (name === "clean") void renderClean();
}

async function initSettings() {
  const s = await store.settings();
  $<HTMLInputElement>("name").value = s.fullName;
  $<HTMLSelectElement>("region").value = s.region;
  $<HTMLInputElement>("share").checked = s.shareOutcomes;
  $("name").addEventListener("change", (e) => void store.saveSettings({ fullName: (e.target as HTMLInputElement).value.trim() }));
  $("region").addEventListener("change", (e) => void store.saveSettings({ region: (e.target as HTMLSelectElement).value }));
  $("share").addEventListener("change", (e) => void store.saveSettings({ shareOutcomes: (e.target as HTMLInputElement).checked }));
  const tab = await gmailTab();
  if (tab?.id) {
    const who = (await chrome.tabs.sendMessage(tab.id, { type: "whoami" }).catch(() => null)) as { email: string | null } | null;
    if (who?.email) { await store.saveSettings({ accountEmail: who.email }); $("acct").textContent = who.email; }
  } else if (s.accountEmail) $("acct").textContent = s.accountEmail;
}

$("scan").addEventListener("click", () => void scan());
$("check").addEventListener("click", () => void checkReplies());
$("ready").addEventListener("click", () => void getReady().catch((e) => { $("ai-status").textContent = String(e?.message ?? e).slice(0, 60); }));
$("tabs").addEventListener("click", (e) => { const b = (e.target as HTMLElement).closest<HTMLElement>("button"); if (b?.dataset.tab) switchTab(b.dataset.tab); });
$("filters").addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest("button");
  if (!b) return;
  filter = b.dataset.f ?? "risk";
  document.querySelectorAll("#filters button").forEach((x) => x.classList.toggle("on", x === b));
  renderTrail();
});

void deviceStatus();
void initSettings();
void restoreTrail().then(() => loadDirectory()).then(() => renderClean());
void renderWatch();
void renderMorning();
renderTrail();
