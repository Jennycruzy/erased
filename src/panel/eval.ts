// Accuracy check page: runs the on-device model over the public eval set (evals/replies.json, 66 real company replies
// from the demo inbox, labelled by hand) and reports how often it picks the right next step.
// Driven by scripts/ci/nano-eval.mjs, or opened by hand in the extension.
import { ASK_SCHEMA, privateModel, readAsk } from "../ai/models";
import { firebase } from "../ai/firebase";
import { askByRules, type Ask } from "../core/coach";
import set from "../../evals/replies.json";

interface Item { id: number; company: string; from: string; subject: string; text: string; label: Ask }
interface Row { id: number; company: string; label: Ask; model: Ask | null; quoteOk: boolean; source: string; ms: number; rules: Ask; final: Ask; error?: string }

const out: { started?: string; done?: string; availability?: string; rows: Row[]; summary?: Record<string, unknown>; error?: string } = { rows: [] };
(self as unknown as { __eval: typeof out }).__eval = out;
const show = () => ((document.getElementById("out") as HTMLElement).textContent = JSON.stringify(out.summary ?? { done: out.rows.length, of: set.length, availability: out.availability }, null, 2));

type LMApi = { availability: (o?: object) => Promise<string>; create: (o?: object) => Promise<{ destroy: () => void }> };
const LM = () => (self as unknown as { LanguageModel?: LMApi }).LanguageModel;
const opts = { expectedInputs: [{ type: "text", languages: ["en"] }], expectedOutputs: [{ type: "text", languages: ["en"] }] };

async function run() {
  out.started = new Date().toISOString();
  out.availability = String(await LM()?.availability(opts).catch((e) => "error: " + e) ?? "no LanguageModel");
  show();
  const { ai } = firebase({ debugToken: localStorage.getItem("appcheckDebug") || true });
  const m = privateModel(ai, ASK_SCHEMA);
  for (const it of set as Item[]) {
    const rules = askByRules(it.text).ask;
    try {
      const r = await readAsk(m, it.from, it.subject, it.text);
      const model = (r.value.ask as Ask) ?? null;
      // Same decision as the side panel: known phrases decide; the model only when they find nothing, with a real quote.
      const final = rules === "wait" && r.quoteOk && model && model !== "wait" ? model : rules;
      out.rows.push({ id: it.id, company: it.company, label: it.label, model, quoteOk: r.quoteOk, source: r.source, ms: r.ms, rules, final });
    } catch (e) {
      out.rows.push({ id: it.id, company: it.company, label: it.label, model: null, quoteOk: false, source: "error", ms: 0, rules, final: rules, error: String((e as Error).message).slice(0, 200) });
    }
    show();
  }
  const n = out.rows.length;
  const right = (k: "model" | "rules" | "final") => out.rows.filter((r) => r[k] === r.label).length;
  const ms = out.rows.filter((r) => r.ms).map((r) => r.ms).sort((a, b) => a - b);
  out.summary = {
    items: n,
    modelAlone: `${right("model")}/${n}`,
    modelQuoteFound: `${out.rows.filter((r) => r.quoteOk).length}/${n}`,
    rulesAlone: `${right("rules")}/${n}`,
    shipped: `${right("final")}/${n}`,
    onDevice: `${out.rows.filter((r) => r.source === "on_device").length}/${n}`,
    medianMs: ms[Math.floor(ms.length / 2)] ?? null,
    availability: out.availability,
    userAgent: navigator.userAgent,
  };
  out.done = new Date().toISOString();
  show();
}

const go = document.getElementById("go") as HTMLButtonElement;
go.onclick = () => { go.disabled = true; run().catch((e) => { out.error = String(e); show(); }); };

// First run on a fresh machine: the model must be downloaded, which needs a click (user activation).
const dl = document.getElementById("dl") as HTMLButtonElement;
const dlState = { progress: 0, state: "idle" as string };
(self as unknown as { __dl: typeof dlState }).__dl = dlState;
dl.onclick = async () => {
  dl.disabled = true;
  dlState.state = "starting";
  try {
    const s = await LM()!.create({ ...opts, monitor: (m: EventTarget) => m.addEventListener("downloadprogress", (e) => { dlState.progress = (e as unknown as { loaded: number }).loaded; dlState.state = "downloading"; }) });
    s.destroy();
    dlState.state = "ready";
  } catch (e) {
    dlState.state = "error: " + String((e as Error).message).slice(0, 200);
  }
};
