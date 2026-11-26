import { initializeApp, type FirebaseApp } from "firebase/app";
import { CustomProvider, initializeAppCheck, type AppCheck } from "firebase/app-check";
import { getAI, GoogleAIBackend, type AI } from "firebase/ai";

export { firebaseConfig } from "./firebase-config";
import { APPCHECK_BRIDGE_URL, firebaseConfig } from "./firebase-config";

let app: FirebaseApp | undefined;
let ai: AI | undefined;
let appCheck: AppCheck | undefined;

/** The App Check instance, once firebase() has run. */
export const appCheckOf = () => appCheck;

/**
 * An App Check token from the Erased website. Extensions may not load remote scripts, so reCAPTCHA can't run in the
 * extension itself: a hidden frame opens /appcheck.html, which gets a reCAPTCHA Enterprise-backed token for this same
 * Firebase web app and posts it back. No extension code is loaded from the web; only the token string comes back.
 */
export function bridgeToken(timeoutMs = 20_000): Promise<{ token: string; expireTimeMillis: number }> {
  return new Promise((ok, no) => {
    const frame = document.createElement("iframe");
    frame.hidden = true;
    frame.src = APPCHECK_BRIDGE_URL;
    const origin = new URL(APPCHECK_BRIDGE_URL).origin;
    const done = () => { clearTimeout(timer); removeEventListener("message", on); frame.remove(); };
    const on = (e: MessageEvent) => {
      if (e.origin !== origin || e.source !== frame.contentWindow || e.data?.type !== "erased-appcheck") return;
      done();
      if (e.data.token) ok({ token: e.data.token, expireTimeMillis: e.data.expireTimeMillis });
      else no(new Error(`App Check: ${e.data.error ?? "no token"}`));
    };
    const timer = setTimeout(() => { done(); no(new Error("App Check: no token from the website in 20 s")); }, timeoutMs);
    addEventListener("message", on);
    document.body.appendChild(frame);
  });
}

/**
 * Starts Firebase with App Check. The token comes from the website's reCAPTCHA Enterprise check (bridgeToken). A debug
 * token registered in the Firebase console is used instead only when one is passed in (the maker's test machines).
 */
export function firebase(opts: { debugToken?: string | boolean } = {}): { app: FirebaseApp; ai: AI } {
  if (app && ai) return { app, ai };
  if (opts.debugToken !== undefined) {
    (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = opts.debugToken;
  }
  app = initializeApp(firebaseConfig);
  appCheck = initializeAppCheck(app, {
    provider: new CustomProvider({
      getToken: () => bridgeToken(),
    }),
    isTokenAutoRefreshEnabled: true,
  });
  ai = getAI(app, { backend: new GoogleAIBackend() });
  return { app, ai };
}
