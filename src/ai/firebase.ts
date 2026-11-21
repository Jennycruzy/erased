import { initializeApp, type FirebaseApp } from "firebase/app";
import { CustomProvider, initializeAppCheck, type AppCheck } from "firebase/app-check";
import { getAI, GoogleAIBackend, type AI } from "firebase/ai";

export { firebaseConfig } from "./firebase-config";
import { firebaseConfig } from "./firebase-config";

let app: FirebaseApp | undefined;
let ai: AI | undefined;
let appCheck: AppCheck | undefined;

/** The App Check instance, once firebase() has run. */
export const appCheckOf = () => appCheck;

/**
 * Starts Firebase with App Check. Extensions may not load remote scripts, so reCAPTCHA can't run here: the extension
 * uses an App Check debug token registered in the Firebase console (accepted for this contest). The custom provider
 * below never loads anything; it only answers if no debug token is set.
 */
export function firebase(opts: { debugToken?: string | boolean } = {}): { app: FirebaseApp; ai: AI } {
  if (app && ai) return { app, ai };
  if (opts.debugToken !== undefined) {
    (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = opts.debugToken;
  }
  app = initializeApp(firebaseConfig);
  appCheck = initializeAppCheck(app, {
    provider: new CustomProvider({
      getToken: () => Promise.reject(new Error("Register this browser's App Check debug token in the Firebase console.")),
    }),
    isTokenAutoRefreshEnabled: true,
  });
  ai = getAI(app, { backend: new GoogleAIBackend() });
  return { app, ai };
}
