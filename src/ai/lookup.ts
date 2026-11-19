import { getGenerativeModel, InferenceMode, type AI } from "firebase/ai";
import { DIRECTORY_SCHEMA, directoryPrompt, type DirectoryEntry } from "../core/directory";

/**
 * Looks up one company the public directory doesn't have yet. Only the company's domain is sent (a public name,
 * with nothing about the user); cloud Gemini reads the company's own privacy page through URL context. The user
 * asks for this per company. Quotes can't be checked on this device, so the result is marked unverified.
 */
export async function lookupRoute(ai: AI, domain: string, model = "gemini-3.5-flash-lite"): Promise<DirectoryEntry> {
  const m = getGenerativeModel(ai, { mode: InferenceMode.ONLY_IN_CLOUD, inCloudParams: { model, tools: [{ urlContext: {} }] } });
  const url = `https://${domain}/privacy`;
  const r = await m.generateContent(`${directoryPrompt(domain)}\n\nRead ${url} (or the privacy policy it links to). Answer with JSON only, matching: ${JSON.stringify(DIRECTORY_SCHEMA)}`);
  const t = r.response.text();
  const j = JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
  return { ...j, domain, privacy_url: url, verified: false, verified_at: new Date().toISOString(), method: "url_context" };
}
