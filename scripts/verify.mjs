// Re-checks the claims in the README against the files in this repository. Offline; no keys.
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const t0 = Date.now();
let failed = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`); if (!ok) failed++; };
const readme = readFileSync("README.md", "utf8");

// 1. Breach catalogue size quoted in the README.
const breaches = JSON.parse(readFileSync("data/breaches.json", "utf8")).breaches;
const quoted = Number((readme.match(/\(([\d,]+) breaches/) ?? [])[1]?.replace(/,/g, ""));
check("breach catalogue matches README", breaches.length === quoted, `${breaches.length} in data, ${quoted} in README`);

// 2. Directory: every kept route has a quote, every email is well-formed.
const dir = JSON.parse(readFileSync("site/directory.json", "utf8"));
const routed = dir.entries.filter((e) => e.request_route !== "unknown" && e.request_route !== "none");
check("directory routes all carry a proof quote", routed.filter((e) => e.method === "page_text").every((e) => e.route_quote && e.route_quote.length >= 8), `${routed.length} routes`);
check("directory emails well-formed", dir.entries.every((e) => !e.dsar_email || /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e.dsar_email)));
check("directory count field is honest", dir.count === dir.entries.length, `${dir.count}`);

// 3. Extension: built, no remote code, only the permissions the README names.
execSync("node scripts/build.mjs", { stdio: "ignore" });
const js = readdirSync("dist").filter((f) => f.endsWith(".js")).map((f) => readFileSync(`dist/${f}`, "utf8")).join("\n");
const remote = js.match(/https:\/\/(apis\.google\.com\/js|www\.google\.com\/recaptcha|www\.gstatic\.com\/recaptcha)[^"'\s]*/g) ?? [];
check("no remote code in the extension", remote.length === 0, remote.slice(0, 2).join(", "));
const manifest = JSON.parse(readFileSync("dist/manifest.json", "utf8"));
check("permissions are sidePanel, storage, alarms only", JSON.stringify([...manifest.permissions].sort()) === JSON.stringify(["alarms", "sidePanel", "storage"]));
check("runs only on mail.google.com", JSON.stringify(manifest.host_permissions) === JSON.stringify(["https://mail.google.com/*"]) && manifest.content_scripts.every((c) => c.matches.every((m) => m === "https://mail.google.com/*")));

// 4. Private reads can never fall back to the cloud.
const models = readFileSync("src/ai/models.ts", "utf8");
check("private reads use ONLY_ON_DEVICE", /export function privateModel[\s\S]*?InferenceMode\.ONLY_ON_DEVICE/.test(models));

// 5. Every rule, deadline and template test.
try {
  const out = execSync("npx vitest run", { encoding: "utf8" });
  const n = (out.match(/Tests\s+(\d+) passed/) ?? [])[1];
  check("unit tests", true, `${n} passed`);
} catch (e) {
  check("unit tests", false, String(e.stdout ?? e).split("\n").filter((l) => /FAIL|failed/.test(l)).slice(0, 3).join(" | "));
}
check("licence file present", existsSync("LICENSE") && readFileSync("LICENSE", "utf8").includes("Apache License"));
console.log(`\n${failed ? `${failed} check(s) failed` : "All checks passed"} in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
process.exit(failed ? 1 : 0);
