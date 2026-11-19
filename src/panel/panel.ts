import breachFile from "../../data/breaches.json";
import { indexBreaches } from "../core/breaches";
import { companyDomain } from "../core/domain";
import { kindFromSubject } from "../core/headers";
import { summarise, safetyScore, type Company, type Sighting } from "../core/trail";
import { firebase } from "../ai/firebase";
import { ACCOUNT_SCHEMA, privateModel } from "../ai/models";
import type { Row } from "../gmail/reader";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const breaches = indexBreaches(breachFile.breaches as Array<Record<string, unknown>>);
const sightings = new Map<string, Sighting[]>();
let companies: Company[] = [];
let filter = "risk";

const fmtDate = (t: number) => (Number.isFinite(t) ? new Date(t).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "–");

function recompute() {
  const now = Date.now();
  companies = [...sightings].map(([d, s]) => summarise(d, s, breaches.get(d) ?? [], now));
  companies.sort((a, b) => b.breachedAfterJoining.length - a.breachedAfterJoining.length || Number(b.stale) - Number(a.stale) || b.emails - a.emails);
  $("count").textContent = companies.length.toLocaleString();
  $("score").textContent = companies.length ? String(safetyScore(companies)) : "–";
  render();
}

function render() {
  const list = $("list");
  const shown = companies.filter((c) =>
    filter === "all" ? true :
    filter === "breached" ? c.breaches.length > 0 :
    filter === "stale" ? c.stale :
    c.breachedAfterJoining.length > 0 || c.stale);
  if (!shown.length) {
    list.innerHTML = `<li class="empty">${companies.length ? "Nothing in this view." : "Scan your inbox to see who holds your data."}</li>`;
    return;
  }
  list.replaceChildren(...shown.slice(0, 300).map(row));
}

function row(c: Company): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "item";
  const dot = document.createElement("span");
  dot.className = "dot " + (c.breachedAfterJoining.length ? "red" : c.breaches.length ? "amber" : c.account === "confirmed" ? "" : "hollow");
  const mid = document.createElement("div");
  const name = document.createElement("div");
  name.className = "name";
  name.textContent = c.domain;
  const why = document.createElement("div");
  why.className = "why";
  const parts = [`${c.emails} email${c.emails === 1 ? "" : "s"}`, `first ${fmtDate(c.firstSeen)}`, `last ${fmtDate(c.lastSeen)}`];
  why.textContent = parts.join(" · ");
  if (c.breachedAfterJoining.length) {
    const b = c.breachedAfterJoining[0];
    const strong = document.createElement("div");
    strong.innerHTML = `<b></b>`;
    strong.querySelector("b")!.textContent = `Breached ${b.date.slice(0, 7)} after you joined: ${b.title} (${b.accounts.toLocaleString()} accounts)`;
    why.append(strong);
  }
  mid.append(name, why);
  const tag = document.createElement("span");
  tag.className = "tag" + (c.breachedAfterJoining.length ? " red" : "");
  tag.textContent = c.breachedAfterJoining.length ? "Breached" : c.stale ? "Unused" : c.account === "confirmed" ? "Account" : "Seen";
  li.append(dot, mid, tag);
  return li;
}

function addRows(rows: Row[]) {
  for (const r of rows) {
    const d = companyDomain(r.from);
    if (!d) continue;
    const list = sightings.get(d) ?? [];
    list.push({ domain: d, at: r.at, kind: kindFromSubject(r.subject) });
    sightings.set(d, list);
  }
  recompute();
}

async function scan() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true, url: "https://mail.google.com/*" });
  if (!tab?.id) { $("progress").textContent = "Open Gmail in this window first."; return; }
  $<HTMLButtonElement>("scan").disabled = true;
  sightings.clear();
  const port = chrome.tabs.connect(tab.id, { name: "erased-scan" });
  port.onMessage.addListener((m: { type: string; rows?: Row[]; page?: number; total?: number }) => {
    if (m.type === "rows" && m.rows) { addRows(m.rows); $("progress").textContent = `Reading page ${m.page}…`; }
    if (m.type === "done") {
      $("progress").textContent = `${m.total?.toLocaleString()} account emails read`;
      $<HTMLButtonElement>("scan").disabled = false;
      chrome.storage.local.set({ lastScan: Date.now() });
    }
  });
  port.postMessage({ type: "scan" });
}

async function deviceStatus() {
  const pill = $("ai-status");
  const LM = (globalThis as unknown as { LanguageModel?: { availability: (o?: object) => Promise<string> } }).LanguageModel;
  if (!LM) { pill.textContent = "On-device AI not in this Chrome"; pill.className = "pill off"; return; }
  const a = await LM.availability({ expectedInputs: [{ type: "text", languages: ["en"] }] }).catch(() => "unavailable");
  pill.textContent = a === "available" ? "On-device AI ready" : a === "unavailable" ? "On-device AI unavailable" : "On-device AI: download needed";
  pill.className = "pill " + (a === "available" ? "device" : "off");
}

async function getReady() {
  const { ai } = firebase({ debugToken: true });
  const model = privateModel(ai, ACCOUNT_SCHEMA);
  const pill = $("ai-status");
  await model.initializeDeviceModel((p) => { pill.textContent = `Downloading on-device AI ${Math.round(p * 100)}%`; });
  await deviceStatus();
}

$("scan").addEventListener("click", () => void scan());
$("ready").addEventListener("click", () => void getReady().catch((e) => { $("ai-status").textContent = String(e?.message ?? e).slice(0, 60); }));
$("region").addEventListener("change", (e) => chrome.storage.local.set({ region: (e.target as HTMLSelectElement).value }));
$("filters").addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest("button");
  if (!b) return;
  filter = b.dataset.f ?? "risk";
  document.querySelectorAll("#filters button").forEach((x) => x.classList.toggle("on", x === b));
  render();
});
chrome.storage.local.get("region").then((v) => { if (v.region) $<HTMLSelectElement>("region").value = v.region; });
void deviceStatus();
render();
