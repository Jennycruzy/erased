// One tiny cloud call, to see whether the Gemini free tier is answering and, if not, which limit was hit.
import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";
import { firebaseConfig } from "../src/ai/firebase-config";
const ai = getAI(initializeApp(firebaseConfig), { backend: new GoogleAIBackend() });
for (const name of process.argv.slice(2)) {
  const m = getGenerativeModel(ai, { mode: InferenceMode.ONLY_IN_CLOUD, inCloudParams: { model: name } } as never);
  try { const r = await m.generateContent("Reply with the single word OK."); console.log(name, "OK:", r.response.text().trim()); }
  catch (e) { const s = String((e as Error).message); console.log(name, "ERROR:", s.replace(/AIza[\w-]+/g, "<key>").match(/\[\d{3}[^\]]*\]/)?.[0], (s.match(/quotaId[^,}]*|PerDay|PerMinute|per day|per minute|retryDelay[^,}]*/gi) ?? []).slice(0, 6).join(" | ")); }
}
