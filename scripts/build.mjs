// Bundles the extension into dist/ with esbuild (no remote code; everything ships in the package).
import { build } from "esbuild";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
const common = { bundle: true, target: "chrome139", minify: true, sourcemap: false, logLevel: "info", loader: { ".json": "json" } };
await build({ ...common, entryPoints: ["src/gmail/content.ts"], outfile: "dist/content.js", format: "iife" });
await build({ ...common, entryPoints: ["src/background.ts"], outfile: "dist/background.js", format: "esm" });
await build({ ...common, entryPoints: ["src/panel/panel.ts"], outfile: "dist/panel.js", format: "esm" });
// Local platform check page (not in the repo); built only when present.
if (existsSync("src/panel/m0.ts")) await build({ ...common, entryPoints: ["src/panel/m0.ts"], outfile: "dist/m0.js", format: "esm" });
await build({ ...common, entryPoints: ["src/panel/complaint-page.ts"], outfile: "dist/complaint.js", format: "esm" });
cpSync("public", "dist", { recursive: true });
