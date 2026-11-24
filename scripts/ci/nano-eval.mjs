// Runs the accuracy check (dist/eval.html) with Gemini Nano in real Google Chrome, e.g. on a GitHub-hosted runner.
// Chrome is launched directly (no automation defaults that would block the model download); the extension is
// loaded over CDP. Writes <out>/result.json and screenshots; the screen is recorded by the calling shell script.
// Usage: node scripts/ci/nano-eval.mjs <chrome-binary> <profile-dir> <out-dir> [timeout-minutes]
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const [chromeBin = "google-chrome", profileDir = "/tmp/nano-profile", outDir = "out", minutes = "45"] = process.argv.slice(2);
const deadline = Date.now() + Number(minutes) * 60_000;
mkdirSync(outDir, { recursive: true });
mkdirSync(profileDir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// chrome://flags: on-device model (bypass the performance check on a VM) and the Prompt API.
const localState = path.join(profileDir, "Local State");
if (!existsSync(localState)) {
  writeFileSync(localState, JSON.stringify({
    browser: { enabled_labs_experiments: ["optimization-guide-on-device-model@2", "prompt-api-for-gemini-nano@1"] },
    internal_only_uis_enabled: true,
  }));
}

const chrome = spawn(chromeBin, [
  `--user-data-dir=${profileDir}`, "--remote-debugging-port=9222", "--enable-unsafe-extension-debugging",
  "--no-first-run", "--no-default-browser-check", "--window-size=1280,800", "--window-position=0,0", "about:blank",
], { stdio: ["ignore", "pipe", "pipe"] });
let chromeLog = "";
chrome.stdout.on("data", (d) => (chromeLog += d));
chrome.stderr.on("data", (d) => (chromeLog += d));

const result = { started: new Date().toISOString() };
let browser;
try {
  for (let i = 0; i < 60 && !browser; i++) {
    try { browser = await puppeteer.connect({ browserURL: "http://127.0.0.1:9222", defaultViewport: null, protocolTimeout: 600_000 }); } catch { await sleep(1000); }
  }
  if (!browser) throw new Error("Chrome DevTools never came up");
  result.chrome = await browser.version();
  const cdp = await browser.target().createCDPSession();
  const { id } = await cdp.send("Extensions.loadUnpacked", { path: path.resolve("dist") });
  result.extensionId = id;
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${id}/eval.html`);
  await sleep(1500);
  result.availabilityAtStart = await page.evaluate(() => self.LanguageModel?.availability({ expectedInputs: [{ type: "text", languages: ["en"] }], expectedOutputs: [{ type: "text", languages: ["en"] }] }) ?? "no LanguageModel");
  // A real CDP click counts as user activation, which the first download needs.
  await page.click("#dl");
  let last = 0;
  while (Date.now() < deadline) {
    const dl = await page.evaluate(() => self.__dl);
    if (dl.state === "ready" || dl.state.startsWith("error")) { result.download = dl; break; }
    if (Date.now() - last > 120_000) { await page.screenshot({ path: path.join(outDir, `download-${Date.now()}.png`) }); last = Date.now(); console.log("download", JSON.stringify(dl)); }
    await sleep(5000);
  }
  await page.click("#go");
  while (Date.now() < deadline) {
    const e = await page.evaluate(() => ({ done: self.__eval.done, n: self.__eval.rows.length, error: self.__eval.error }));
    if (e.done || e.error) break;
    await sleep(3000);
  }
  result.eval = await page.evaluate(() => self.__eval);
  await page.screenshot({ path: path.join(outDir, "eval.png"), fullPage: true });
  try {
    const internals = await browser.newPage();
    await internals.goto("chrome://on-device-internals");
    await sleep(3000);
    await internals.screenshot({ path: path.join(outDir, "on-device-internals.png"), fullPage: true });
  } catch (e) { result.internalsError = String(e); }
} catch (e) {
  result.fatal = String(e?.stack ?? e);
} finally {
  result.finished = new Date().toISOString();
  writeFileSync(path.join(outDir, "result.json"), JSON.stringify(result, null, 2));
  writeFileSync(path.join(outDir, "chrome.log"), chromeLog.slice(-20000));
  if (browser) await browser.disconnect();
  chrome.kill("SIGTERM");
}
const s = result.eval?.summary;
console.log("SUMMARY", JSON.stringify(s ?? { fatal: result.fatal, download: result.download }));
process.exit(s && s.onDevice !== `0/${s.items}` ? 0 : 1);
