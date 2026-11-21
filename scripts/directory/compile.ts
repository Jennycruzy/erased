/**
 * Builds the public deletion-route directory: for each company domain, finds its privacy page, asks cloud Gemini
 * (Firebase AI Logic, ONLY_IN_CLOUD) how a person asks for deletion, and keeps only fields backed by a quote found
 * word for word on the page. Public web pages only; no user data is involved.
 *
 *   node .cache/compile.mjs <domains.txt> <out.jsonl> [limit]
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";
import { firebaseConfig } from "../../src/ai/firebase-config";
import { quoteIsIn } from "../../src/core/quote";
import { DIRECTORY_SCHEMA, directoryPrompt, hasRoute, isPlumbing, type DirectoryEntry } from "../../src/core/directory";

const [, , listFile, outFile, limitArg] = process.argv;
const limit = Number(limitArg ?? Infinity);
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0 Safari/537.36";
const MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

const app = initializeApp(firebaseConfig);
const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = (name: string, tools = false) =>
  getGenerativeModel(ai, {
    mode: InferenceMode.ONLY_IN_CLOUD,
    inCloudParams: {
      model: name,
      generationConfig: tools ? { temperature: 0 } : { temperature: 0, responseMimeType: "application/json", responseJsonSchema: DIRECTORY_SCHEMA },
      ...(tools ? { tools: [{ urlContext: {} }] } : {}),
    },
  }, { timeout: 60000 });

/** The SDK timeout is not always honoured, so race it as well. */
const withTimeout = <T>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, no) => setTimeout(() => no(new Error(`timeout after ${ms} ms`)), ms))]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let browser: import("puppeteer-core").Browser | null = null;
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";

/** Opens a page in a real headless Chrome, for sites that refuse plain downloads. */
async function getInBrowser(url: string): Promise<{ url: string; html: string } | null> {
  try {
    if (!browser) {
      const { launch } = await import("puppeteer-core");
      browser = await launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--no-zygote", "--single-process"] });
    }
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
      if (!res || res.status() >= 400) return null;
      await new Promise((r) => setTimeout(r, 1500));
      return { url: page.url(), html: await page.content() };
    } finally { await page.close().catch(() => undefined); }
  } catch { return null; }
}

async function get(url: string): Promise<{ url: string; html: string } | null> {
  return (await getPlain(url)) ?? (process.env.NO_BROWSER ? null : await getInBrowser(url));
}

async function getPlain(url: string): Promise<{ url: string; html: string } | null> {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
    if (!r.ok) return null;
    const ct = r.headers.get("content-type") ?? "";
    if (!ct.includes("html") && !ct.includes("text")) return null;
    return { url: r.url, html: (await r.text()).slice(0, 2_000_000) };
  } catch { return null; }
}

export function textOf(html: string): string {
  return html
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr|section)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}

function linkScore(label: string, href: string): number {
  const s = (label + " " + href).toLowerCase();
  let n = 0;
  if (/privacy (policy|notice|statement)|datenschutzerkl|politique de confidentialit|pol[ií]tica de privacidad/.test(s)) n += 5;
  if (/\/(legal\/)?privacy(-policy|-notice|-statement)?\/?($|[?#])/.test(href.toLowerCase())) n += 4;
  if (/legal|policies/.test(s)) n += 1;
  if (/feature|settings|center|centre|safety|product|blog|help|cookie|ad[s ]|choices/.test(s)) n -= 3;
  return n;
}

function privacyLinks(html: string, base: string): string[] {
  const out: Array<[number, string]> = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const label = m[2].replace(/<[^>]+>/g, " ").toLowerCase();
    const href = m[1];
    if (/privacy|datenschutz|confidentialit|privacidad|privacidade/.test(label + " " + href.toLowerCase())) {
      try { out.push([linkScore(label, href), new URL(href, base).toString()]); } catch { /* skip bad href */ }
    }
  }
  return [...new Set(out.sort((a, b) => b[0] - a[0]).map(([, u]) => u))].slice(0, 4);
}

async function findPolicy(domain: string): Promise<{ url: string; text: string; html: string } | { url: string; text: null; html: null }> {
  const home = (await get(`https://${domain}/`)) ?? (await get(`https://www.${domain}/`));
  const candidates = home ? privacyLinks(home.html, home.url) : [];
  for (const p of ["/privacy", "/privacy-policy", "/legal/privacy", "/legal/privacy-policy", "/privacy-notice"]) candidates.push(`https://${domain}${p}`);
  // Fetch up to five candidates and keep the one that talks most about privacy rights.
  let best: { url: string; text: string; html: string; score: number } | null = null;
  const tried = new Set<string>();
  for (const url of candidates) {
    if (tried.size >= 5) break;
    if (tried.has(url)) continue;
    tried.add(url);
    const page = await get(url);
    if (!page || tried.has(page.url + "#final")) continue;
    tried.add(page.url + "#final");
    const text = textOf(page.html);
    if (text.length < 1500 || !/privacy|personal (data|information)/i.test(text)) continue;
    const score = (text.match(/delet|eras|right to|request|data protection officer|privacy@/gi) ?? []).length + (/privacy (policy|notice|statement)/i.test(text.slice(0, 3000)) ? 10 : 0);
    if (!best || score > best.score) best = { url: page.url, text, html: page.html, score };
    if (score >= 40) break;
  }
  if (best) return { url: best.url, text: best.text, html: best.html };
  // Real companies often block automated downloads (PayPal, eBay, Canva…); let the cloud read the usual privacy
  // address instead. Plumbing domains with no site stay out.
  if (!home && isPlumbing(domain)) throw new Error("site unreachable");
  return { url: home ? candidates[0] ?? `https://${domain}/privacy` : `https://www.${domain}/privacy`, text: null, html: null };
}

/** Keeps the opening and every paragraph about rights, deletion or privacy contacts, so long policies fit. */
export function relevant(text: string, max = 30000): string {
  const paras = text.split("\n");
  const key = /delet|eras|remov|right|request|access your|contact|privacy@|dpo|data protection officer|opt.?out|close your account|exercise/i;
  const keep = paras.filter((p, i) => i < 15 || key.test(p));
  return keep.join("\n").slice(0, max);
}

const ROUTE_WORDS = /delet|eras|remov|request|right|close|privacy@|dpo|contact/i;

/** The sentence around an email address on the page, used as proof when the model's own quote failed. */
function sentenceWith(text: string, needle: string): string | null {
  const i = text.toLowerCase().indexOf(needle.toLowerCase());
  if (i < 0) return null;
  const start = Math.max(text.lastIndexOf(".", i) + 1, text.lastIndexOf("\n", i) + 1, i - 240);
  const endDot = text.indexOf(".", i + needle.length);
  const endNl = text.indexOf("\n", i + needle.length);
  const ends = [endDot >= 0 ? endDot + 1 : text.length, endNl >= 0 ? endNl : text.length, i + needle.length + 240];
  return text.slice(start, Math.min(...ends)).trim();
}

async function ask(prompt: string, tools = false, first = 0): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const name = MODELS[(attempt + first) % MODELS.length];
    try {
      const r = await withTimeout(model(name, tools).generateContent(prompt), 75000);
      return r.response.text();
    } catch (e) {
      const msg = String((e as Error).message ?? e);
      // 429 = quota; 500/503 "high demand" and timeouts = model overloaded. Both pass, so wait longer each time.
      const busy = /429|quota|RESOURCE_EXHAUSTED|high demand|overloaded|UNAVAILABLE|\[50[03]|timeout/i.test(msg);
      const wait = busy ? Math.min(15000 * (attempt + 1), 90000) : 5000;
      process.stderr.write(`  retry ${attempt + 1} (${name}): ${msg.replace(/AIza[\w-]+/g, "<key>").slice(0, 300)}\n`);
      await sleep(wait);
    }
  }
  throw new Error("model unavailable");
}

async function compile(domain: string): Promise<DirectoryEntry> {
  const first = await compileOnce(domain, 0);
  // An unclear answer gets one more try with the stronger model before it is stored.
  if (first.request_route === "unknown" && first.method === "page_text") {
    const second = await compileOnce(domain, 1).catch(() => first);
    if (second.request_route !== "unknown") return second;
  }
  return first;
}

async function compileOnce(domain: string, model: number): Promise<DirectoryEntry> {
  const page = await findPolicy(domain);
  const now = new Date().toISOString();
  if (!page.text) {
    // Page blocked for plain fetches: let the cloud read it through URL context. Quotes can't be checked locally,
    // so the entry is stored but marked unverified.
    const raw = await ask(`${directoryPrompt(domain)}\n\nRead this page: ${page.url}\nAnswer with JSON only, matching: ${JSON.stringify(DIRECTORY_SCHEMA)}`, true);
    const j = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
    return { ...j, domain, privacy_url: page.url, verified: false, verified_at: now, method: "url_context" };
  }
  const raw = await ask(`${directoryPrompt(domain)}\n\nPRIVACY PAGE (${page.url}):\n${relevant(page.text)}`, false, model);
  const j = JSON.parse(raw) as Omit<DirectoryEntry, "domain" | "privacy_url" | "verified" | "verified_at" | "method">;
  // Rules decide what is kept: every field needs proof on the page itself.
  const routeOk = quoteIsIn(j.route_quote, page.text) && ROUTE_WORDS.test(j.route_quote ?? "");
  const emailOk = !!j.dsar_email && /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(j.dsar_email) && page.text.toLowerCase().includes(j.dsar_email.toLowerCase());
  const formOk = !!j.form_url && (page.html.includes(j.form_url) || page.text.includes(j.form_url));
  let route: DirectoryEntry["request_route"] = routeOk ? j.request_route : "unknown";
  let quote = routeOk ? j.route_quote : null;
  if (!routeOk && emailOk) { route = "email"; quote = sentenceWith(page.text, j.dsar_email!); }
  return {
    domain,
    company: j.company,
    privacy_url: page.url,
    request_route: route,
    dsar_email: emailOk ? j.dsar_email!.toLowerCase() : null,
    form_url: routeOk && formOk ? j.form_url : null,
    laws_named: j.laws_named ?? [],
    route_quote: quote,
    verified: (routeOk || emailOk) && hasRoute({ request_route: route }),
    verified_at: now,
    method: "page_text",
  };
}

// Domains already answered are skipped; ones that ended in an error ("model unavailable", "site unreachable") get
// another try, and the newest line wins at export.
const latestLine = new Map<string, { error?: string }>();
if (existsSync(outFile)) for (const l of readFileSync(outFile, "utf8").split("\n").filter(Boolean)) { const e = JSON.parse(l); latestLine.set(e.domain, e); }
const done = new Set([...latestLine].filter(([, e]) => !e.error).map(([d]) => d));
const domains = readFileSync(listFile, "utf8").split("\n").map((s) => s.trim()).filter((d) => d && !done.has(d));
let n = 0;
for (const domain of domains) {
  if (n >= limit) break;
  n++;
  const t0 = Date.now();
  try {
    const e = await compile(domain);
    appendFileSync(outFile, JSON.stringify(e) + "\n");
    console.log(`${n} ${domain}: ${e.request_route}${e.dsar_email ? " " + e.dsar_email : ""}${e.verified ? "" : " (unverified)"} ${Date.now() - t0}ms`);
  } catch (err) {
    appendFileSync(outFile, JSON.stringify({ domain, error: String((err as Error).message).slice(0, 200), verified: false, verified_at: new Date().toISOString() }) + "\n");
    console.log(`${n} ${domain}: ERROR ${String((err as Error).message).slice(0, 80)}`);
  }
  await sleep(2500);
}
await (browser as import("puppeteer-core").Browser | null)?.close().catch(() => undefined);
process.exit(0);
