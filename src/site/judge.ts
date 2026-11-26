// /judge: Reply Coach in a judge's own Chrome, on real company replies, with no Gmail and no install.
// Same code as the extension: the phrase rules and answers (src/core/coach.ts), the prompt and schema
// (src/ai/models.ts) and Firebase AI Logic. Practice replies come from evals/replies.json (real replies to the
// public demo inbox, staff names removed); "On our Mac" comes from site/evals.json (the published Nano run).
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode, type GenerativeModel } from "firebase/ai";
import { firebaseConfig, RECAPTCHA_SITE_KEY } from "../ai/firebase-config";
import { ASK_PROMPT, ASK_SCHEMA, MAX_EMAIL_CHARS } from "../ai/models";
import { askByRules, coach, ASKS, type Advice, type Ask } from "../core/coach";
import { numbered, pick, sentencesOf } from "../core/sentences";
import { quoteIsIn } from "../core/quote";
import { companyDomain } from "../core/domain";
import type { LawId } from "../core/laws";
import type { StoredRequest } from "../core/store";
import replies from "../../evals/replies.json";
import macRun from "../../site/evals.json";

const CLOUD_MODEL = "gemini-3.5-flash-lite";
/** One reply for each kind of ask, including two where Nano alone was wrong on our Mac and the rules were right. */
const PRACTICE = [2, 3, 23, 4, 19, 25, 50, 66, 59, 1];

interface Reply { id: number; company: string; from: string; subject: string; receivedAt: string; text: string; label: Ask }
interface MacRow { id: number; model: Ask | null; ms: number; final: Ask }
interface Run { id: number | "yours"; company: string; where: string; ms: number; model: Ask | null; rules: Ask; final: Ask; by: "rules" | "model"; label?: Ask }

const ALL = replies as Reply[];
const mac = new Map((macRun as { rows: MacRow[] }).rows.map((r) => [r.id, r]));
const practice = PRACTICE.map((id) => ALL.find((r) => r.id === id)).filter((r): r is Reply => !!r);
const runs: Run[] = [];
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const ASK_WORDS: Record<Ask, string> = {
  wait: "nothing yet: wait", scheduled: "already scheduled", no_account: "no account found", verify_link: "click a check-it's-you link",
  go_ahead: "reply YES", confirm_sender: "confirm it's really you", clarify: "say what to delete", provide_info: "send details",
  use_form: "use their form", log_in_delete: "sign in and delete it",
};

// ---------- Firebase AI Logic ----------
const app = initializeApp(firebaseConfig);
if (RECAPTCHA_SITE_KEY) initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY), isTokenAutoRefreshEnabled: true });
const ai = getAI(app, { backend: new GoogleAIBackend() });
const onDeviceParams = {
  createOptions: { expectedInputs: [{ type: "text", languages: ["en"] }], expectedOutputs: [{ type: "text", languages: ["en"] }] },
  promptOptions: { responseConstraint: ASK_SCHEMA },
};
const models: Record<"device" | "hybrid", GenerativeModel> = {
  // What the extension uses for your own mail: the computer's model or nothing.
  device: getGenerativeModel(ai, { mode: InferenceMode.ONLY_ON_DEVICE, onDeviceParams } as never),
  // Practice emails are public, so here the cloud may step in when this Chrome has no Gemini Nano.
  hybrid: getGenerativeModel(ai, {
    mode: InferenceMode.PREFER_ON_DEVICE,
    onDeviceParams,
    inCloudParams: { model: CLOUD_MODEL, generationConfig: { responseMimeType: "application/json", responseJsonSchema: ASK_SCHEMA } },
  } as never),
};

type LMApi = { availability: (o?: object) => Promise<string>; create: (o?: object) => Promise<{ destroy: () => void }> };
const LM = () => (self as unknown as { LanguageModel?: LMApi }).LanguageModel;

async function nanoStatus(): Promise<string> {
  const api = LM();
  if (!api) return "unavailable";
  return api.availability(onDeviceParams.createOptions).catch(() => "unavailable");
}

async function showStatus() {
  const s = await nanoStatus();
  const pill = $("nano");
  const words: Record<string, string> = {
    available: "Gemini Nano is ready in this Chrome", downloadable: "Gemini Nano can be downloaded to this Chrome",
    downloading: "Gemini Nano is downloading", unavailable: "No Gemini Nano in this browser",
  };
  pill.textContent = words[s] ?? `Gemini Nano: ${s}`;
  pill.className = "tag " + (s === "available" ? "device" : s === "unavailable" ? "" : "amber");
  $("get").hidden = !(s === "downloadable" || s === "downloading");
  $("appcheck").textContent = RECAPTCHA_SITE_KEY ? "App Check: reCAPTCHA Enterprise" : "App Check: off on this page";
  if (s === "unavailable" && !$<HTMLInputElement>("cloud").checked) $("hint").textContent = "This browser cannot run Gemini Nano. Switch on the cloud option above to read the practice emails with Gemini in the cloud.";
  else $("hint").textContent = "";
  return s;
}

async function getNano() {
  const api = LM();
  if (!api) return;
  $("get").setAttribute("disabled", "");
  try {
    const s = await api.create({
      ...onDeviceParams.createOptions,
      monitor(m: EventTarget) {
        m.addEventListener("downloadprogress", (e) => ($("nano").textContent = `Downloading Gemini Nano: ${Math.round(((e as unknown as { loaded: number }).loaded ?? 0) * 100)}%`));
      },
    });
    s.destroy();
  } catch (e) {
    $("nano").textContent = `Download did not start: ${(e as Error).message}`;
  }
  $("get").removeAttribute("disabled");
  await showStatus();
}

// ---------- Reading one reply ----------
async function read(from: string, subject: string, text: string) {
  const sents = sentencesOf(text.slice(0, MAX_EMAIL_CHARS));
  const useCloud = $<HTMLInputElement>("cloud").checked;
  const t0 = performance.now();
  let model: Ask | null = null, quote = "", where = "rules only", error = "";
  try {
    const r = await (useCloud ? models.hybrid : models.device).generateContent(`${ASK_PROMPT}\n\nFrom: ${from}\nSubject: ${subject}\n\n${numbered(sents)}`);
    const raw = JSON.parse(r.response.text()) as { ask?: string; proof?: unknown };
    model = ASKS.includes(raw.ask as Ask) ? (raw.ask as Ask) : null;
    quote = pick(sents, raw.proof);
    where = r.response.inferenceSource === "on_device" ? "Gemini Nano on this computer" : r.response.inferenceSource === "in_cloud" ? "Gemini in the cloud" : String(r.response.inferenceSource ?? "unknown");
  } catch (e) {
    error = (e as Error).message;
  }
  const ms = Math.round(performance.now() - t0);
  const rules = askByRules(text);
  // Same decision as the extension: known phrases decide; the model only when they find nothing, with a real quote.
  const byModel = rules.ask === "wait" && !!model && model !== "wait" && quoteIsIn(quote, text);
  return { model, quote, where, error, ms, rules, final: byModel ? model! : rules.ask, by: (byModel ? "model" : "rules") as "model" | "rules", finalQuote: byModel ? quote : rules.quote };
}

function adviceFor(company: string, from: string, subject: string, text: string, ask: Ask, quote: string, at: number): Advice {
  const law = $<HTMLSelectElement>("law").value as LawId;
  const email = $<HTMLInputElement>("email").value.trim() || "ada@example.com";
  const name = $<HTMLInputElement>("name").value.trim();
  // Practice replies already carry our request's reference in the subject; reuse it.
  const ref = subject.match(/\bER-[A-Z0-9]{5}\b/)?.[0] ?? "ER-PRACT";
  const r: StoredRequest = {
    id: "practice", domain: companyDomain(from.split("@")[1] ?? "") || "example.com", kind: "delete", law, ref, company,
    route: "email", to: from, formUrl: null, accountEmail: email, createdAt: at - 3 * 864e5, events: [{ type: "sent", at: at - 3 * 864e5 }],
  } as StoredRequest;
  return coach(r, { ask, at, from, subject, text, links: [], quote }, name);
}

function adviceHtml(a: Advice): string {
  const act = a.action;
  const action = act.type === "email"
    ? `<div class="mail"><div class="q">To ${esc(act.to)} · ${esc(act.subject)}</div><pre>${esc(act.body)}</pre>
       <button class="btn small" data-copy="${esc(act.body)}">Copy the reply</button> <a class="btn small ghost" target="_blank" rel="noopener" href="${esc(act.url)}">Open it in Gmail</a></div>`
    : `<p><b>${esc(act.label)}</b></p>`;
  return `<h3>${esc(a.headline)}</h3><p>${esc(a.why)}</p>${a.legal.map((l) => `<p class="q">${esc(l)}</p>`).join("")}${action}`;
}

async function runOne(rep: Reply | null) {
  const pasted = !rep;
  const company = rep?.company ?? ($<HTMLInputElement>("pcompany").value.trim() || "The company");
  const from = rep?.from ?? ($<HTMLInputElement>("pfrom").value.trim() || "privacy@example.com");
  const subject = rep?.subject ?? "Re: Request to delete my personal data";
  const text = rep?.text ?? $<HTMLTextAreaElement>("ptext").value;
  if (!text.trim()) return;
  const out = $(pasted ? "presult" : "result");
  out.innerHTML = `<p class="muted">Reading…</p>`;
  const r = await read(from, subject, text);
  const at = rep ? Date.parse(rep.receivedAt) : Date.now();
  const a = adviceFor(company, from, subject, text, r.final, r.finalQuote, at);
  const m = rep ? mac.get(rep.id) : undefined;
  const ok = rep ? (r.final === rep.label ? `<span class="tag device">matches our hand label</span>` : `<span class="tag red">our hand label: ${ASK_WORDS[rep.label]}</span>`) : "";
  out.innerHTML = `
    <div class="pills"><span class="tag ${r.where.includes("Nano") ? "device" : ""}">${esc(r.where)}${r.ms ? ` · ${r.ms} ms` : ""}</span>${ok}</div>
    ${r.error ? `<p class="q">Model: ${esc(r.error.slice(0, 220))}</p>` : ""}
    <table class="mini"><tr><th>Who</th><th>Says they ask you to</th><th>Shown by</th></tr>
      <tr><td>Model</td><td>${r.model ? ASK_WORDS[r.model] : "–"}</td><td class="q">${r.quote ? "“" + esc(r.quote) + "”" : ""}</td></tr>
      <tr><td>Known phrases</td><td>${ASK_WORDS[r.rules.ask]}</td><td class="q">${r.rules.quote ? "“" + esc(r.rules.quote) + "”" : ""}</td></tr>
      <tr><td><b>Decision</b></td><td><b>${ASK_WORDS[r.final]}</b></td><td class="q">decided by ${r.by === "rules" ? "known phrases" : "the model (no known phrase matched)"}</td></tr>
      ${m ? `<tr><td>On our Mac</td><td>${m.model ? ASK_WORDS[m.model] : "–"}</td><td class="q">Gemini Nano, ${m.ms} ms (published run)</td></tr>` : ""}
    </table>
    <div class="advice">${adviceHtml(a)}</div>`;
  runs.unshift({ id: rep?.id ?? "yours", company, where: r.where, ms: r.ms, model: r.model, rules: r.rules.ask, final: r.final, by: r.by, label: rep?.label });
  renderRuns();
  if (rep) markInbox(rep.id, r.final === rep.label);
}

function renderRuns() {
  const right = runs.filter((r) => r.label).length;
  $("runs").innerHTML = runs.length ? `<table class="cards"><thead><tr><th>Reply</th><th>Read by</th><th>Time</th><th>Model said</th><th>Decision</th><th>Hand label</th></tr></thead><tbody>${runs.map((r) => `<tr>
    <td data-label="Reply">${esc(r.company)}${r.id === "yours" ? " (yours)" : ""}</td><td data-label="Read by">${esc(r.where)}</td><td data-label="Time">${r.ms} ms</td>
    <td data-label="Model said">${r.model ? ASK_WORDS[r.model] : "–"}</td><td data-label="Decision">${ASK_WORDS[r.final]} <span class="q">(${r.by})</span></td>
    <td data-label="Hand label">${r.label ? (r.label === r.final ? "✓ " : "✗ ") + ASK_WORDS[r.label] : "–"}</td></tr>`).join("")}</tbody></table>
    <p class="q">${right ? `${runs.filter((r) => r.label && r.label === r.final).length} of ${right} practice reads match the hand label.` : ""}</p>` : `<p class="muted">Nothing read yet.</p>`;
}

function markInbox(id: number, ok: boolean) {
  const li = document.querySelector(`[data-id="${id}"] .mark`);
  if (li) li.textContent = ok ? "✓" : "✗";
}

function showEmail(rep: Reply) {
  document.querySelectorAll(".inbox li").forEach((li) => li.classList.toggle("on", li.getAttribute("data-id") === String(rep.id)));
  $("mailview").innerHTML = `<div class="q">From ${esc(rep.from)} · ${esc(rep.receivedAt.slice(0, 10))}</div><h3>${esc(rep.subject)}</h3><pre>${esc(rep.text)}</pre>`;
  $("result").innerHTML = "";
  $<HTMLButtonElement>("read").onclick = () => runOne(rep);
}

function init() {
  $("inbox").innerHTML = practice.map((r) => `<li data-id="${r.id}"><b>${esc(r.company)}</b><span class="q">${esc(r.subject.slice(0, 60))}</span><span class="mark"></span></li>`).join("");
  document.querySelectorAll<HTMLElement>(".inbox li").forEach((li) => (li.onclick = () => showEmail(practice.find((r) => String(r.id) === li.dataset.id)!)));
  showEmail(practice[0]);
  $("get").onclick = getNano;
  $("cloud").onchange = showStatus;
  $("pread").onclick = () => runOne(null);
  $("all").onclick = async () => {
    $("all").setAttribute("disabled", "");
    for (const r of practice) { showEmail(r); await runOne(r); }
    $("all").removeAttribute("disabled");
  };
  document.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-copy]");
    if (b) navigator.clipboard.writeText(b.dataset.copy ?? "").then(() => (b.textContent = "Copied"));
  });
  renderRuns();
  showStatus();
}
init();
