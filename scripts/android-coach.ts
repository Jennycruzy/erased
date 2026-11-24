// Exports Reply Coach for the Android app from the same TypeScript the extension ships: the phrase rules, the
// on-device prompt and every answer as a template ({company}, {email}, {name}, {subject}, {ref} filled on the phone).
// Run: node scripts/android-coach.mjs (built from this file by `npm run android:coach`).
import { writeFileSync, mkdirSync } from "node:fs";
import { ASKS, coach, RULE_SOURCES, NO_STEP } from "../src/core/coach";
import { ASK_PROMPT } from "../src/ai/models";
import type { LawId } from "../src/core/laws";
import type { StoredRequest } from "../src/core/store";

const LAWS: LawId[] = ["gdpr", "uk_gdpr", "ccpa", "pipeda", "ndpa", "policy"];
const req = (law: LawId): StoredRequest => ({
  id: "x", domain: "{domain}", kind: "delete", law, ref: "{ref}", company: "{company}", route: "email",
  to: "{to}", formUrl: null, accountEmail: "{email}", createdAt: 0, events: [{ type: "sent", at: 0 }],
});
const advice: Record<string, Record<string, unknown>> = {};
for (const law of LAWS) {
  advice[law] = {};
  for (const ask of ASKS) {
    const a = coach(req(law), { ask, at: 0, from: "{to}", subject: "{subject}", text: "", links: [] }, "{name}");
    const act = a.action.type === "email" ? { type: "email", label: a.action.label, subject: a.action.subject, body: a.action.body } : { type: a.action.type, label: a.action.label };
    advice[law][ask] = { headline: a.headline, why: a.why, legal: a.legal, action: act };
  }
}
const out = {
  note: "Generated from src/core/coach.ts and src/ai/models.ts. Do not edit by hand.",
  asks: ASKS,
  noStep: NO_STEP,
  rules: RULE_SOURCES,
  prompt: ASK_PROMPT,
  advice,
};
mkdirSync("android/app/src/main/assets", { recursive: true });
writeFileSync("android/app/src/main/assets/coach.json", JSON.stringify(out, null, 1));
console.log("android/app/src/main/assets/coach.json:", RULE_SOURCES.length, "rules,", ASKS.length, "asks");
