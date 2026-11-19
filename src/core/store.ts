import type { LawId, RequestKind } from "./laws";
import type { Request, RequestEvent } from "./requests";
import type { Route } from "./directory";

/** A request as kept in this browser's extension storage. Never uploaded. */
export interface StoredRequest extends Request {
  ref: string;
  company: string;
  route: Route;
  to: string | null;
  formUrl: string | null;
  accountEmail: string;
  createdAt: number;
}

export interface Settings {
  region: string;
  fullName: string;
  accountEmail: string;
  shareOutcomes: boolean;
}

export const DEFAULT_SETTINGS: Settings = { region: "GB", fullName: "", accountEmail: "", shareOutcomes: false };

/** Minimal key-value surface (chrome.storage.local in the extension, a Map in tests). */
export interface KV {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

export class Store {
  constructor(private kv: KV) {}

  async settings(): Promise<Settings> {
    return { ...DEFAULT_SETTINGS, ...((await this.kv.get("settings")) as Partial<Settings> | undefined) };
  }
  async saveSettings(s: Partial<Settings>) {
    await this.kv.set("settings", { ...(await this.settings()), ...s });
  }

  async requests(): Promise<StoredRequest[]> {
    return ((await this.kv.get("requests")) as StoredRequest[] | undefined) ?? [];
  }
  async upsert(r: StoredRequest) {
    const all = await this.requests();
    const i = all.findIndex((x) => x.id === r.id);
    if (i >= 0) all[i] = r; else all.push(r);
    await this.kv.set("requests", all);
  }
  /** Adds an event once (same type and time are not added twice). */
  async addEvent(id: string, e: RequestEvent) {
    const all = await this.requests();
    const r = all.find((x) => x.id === id);
    if (!r) throw new Error(`no request ${id}`);
    if (!r.events.some((x) => x.type === e.type && x.at === e.at)) r.events.push(e);
    await this.kv.set("requests", all);
  }
  async byDomain(domain: string): Promise<StoredRequest | undefined> {
    return (await this.requests()).find((r) => r.domain === domain);
  }
}

export function newRequest(p: {
  id: string; ref: string; domain: string; company: string; kind: RequestKind; law: LawId; route: Route;
  to: string | null; formUrl: string | null; accountEmail: string; now: number;
}): StoredRequest {
  return { id: p.id, ref: p.ref, domain: p.domain, company: p.company, kind: p.kind, law: p.law, route: p.route, to: p.to,
    formUrl: p.formUrl, accountEmail: p.accountEmail, createdAt: p.now, events: [] };
}

export const chromeKV: KV = {
  get: async (k) => (await chrome.storage.local.get(k))[k],
  set: async (k, v) => chrome.storage.local.set({ [k]: v }),
};
