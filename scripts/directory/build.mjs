// Bundles the directory compiler for Node.
import { build } from "esbuild";
await build({ entryPoints: ["scripts/directory/compile.ts"], outfile: ".cache/compile.mjs", bundle: true, platform: "node", format: "esm", target: "node22", packages: "external", logLevel: "warning" });
