import type { FirebaseApp } from "firebase/app";
import { fetchAndActivate, getRemoteConfig, getValue } from "firebase/remote-config";
import { DEFAULT_TIMING, setTiming, type Timing } from "../core/requests";

/** Cloud models in order. Free-tier limits are counted per model, so the next one answers when one is spent. */
export const DEFAULT_CLOUD_MODELS = ["gemini-3.5-flash-lite", "gemini-3.5-flash"];
let models = [...DEFAULT_CLOUD_MODELS];
export const cloudModels = (): string[] => [...models];

/** Reads cloud_models: a JSON list of one to four Gemini model names. Anything else gives null. */
export function parseModels(raw: string): string[] | null {
  try {
    const v = JSON.parse(raw);
    if (!Array.isArray(v) || v.length < 1 || v.length > 4) return null;
    return v.every((m) => typeof m === "string" && /^gemini-[a-z0-9.-]{1,40}$/.test(m)) ? v : null;
  } catch {
    return null;
  }
}

/** True when a cloud call failed because that model is out of quota or overloaded, so the next model may answer. */
export const busy = (e: unknown) => /\b429\b|quota|RESOURCE_EXHAUSTED|\b503\b|overloaded/i.test(String((e as Error)?.message ?? e));

/** Runs call with each cloud model in turn, moving on only when one is busy. */
export async function withCloudModels<T>(call: (model: string) => Promise<T>): Promise<T> {
  const list = cloudModels();
  for (const [i, m] of list.entries()) {
    try { return await call(m); }
    catch (e) { if (!busy(e) || i === list.length - 1) throw e; }
  }
  throw new Error("no cloud model");
}

export interface Remote { directoryUrl: string; timing: Timing; models: string[] }

/**
 * Fetches the Remote Config template once and applies it: the cloud model order, the rule timings and the
 * directory location. Without a network or a template, the defaults in the code stay.
 */
export async function loadRemote(app: FirebaseApp, directoryUrl: string): Promise<Remote> {
  try {
    const rc = getRemoteConfig(app);
    rc.defaultConfig = {
      directory_url: directoryUrl, cloud_models: JSON.stringify(DEFAULT_CLOUD_MODELS),
      grace_days: DEFAULT_TIMING.graceDays, proof_days: DEFAULT_TIMING.proofDays, follow_up_days: DEFAULT_TIMING.followUpDays,
    };
    await fetchAndActivate(rc);
    models = parseModels(getValue(rc, "cloud_models").asString()) ?? models;
    const timing = setTiming({
      graceDays: getValue(rc, "grace_days").asNumber(), proofDays: getValue(rc, "proof_days").asNumber(),
      followUpDays: getValue(rc, "follow_up_days").asNumber(),
    });
    return { directoryUrl: getValue(rc, "directory_url").asString() || directoryUrl, timing, models: cloudModels() };
  } catch {
    return { directoryUrl, timing: setTiming({}), models: cloudModels() };
  }
}
