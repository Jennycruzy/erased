import { initializeApp, type FirebaseApp } from "firebase/app";
import { CustomProvider, initializeAppCheck } from "firebase/app-check";
import { getAI, GoogleAIBackend, type AI } from "firebase/ai";

/** Public web config for the Erased Firebase project (safe to ship; access is controlled by App Check and rules). */
export const firebaseConfig = {
  apiKey: "AIzaSyAbSG59wFNc9zTtkVIePV5sYLeZvU9Rfew",
  authDomain: "forget-me-hybrid.firebaseapp.com",
  projectId: "forget-me-hybrid",
  storageBucket: "forget-me-hybrid.firebasestorage.app",
  messagingSenderId: "798434253190",
  appId: "1:798434253190:web:8c21bad2081942d239b407",
};

let app: FirebaseApp | undefined;
let ai: AI | undefined;

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
  initializeAppCheck(app, {
    provider: new CustomProvider({
      getToken: () => Promise.reject(new Error("Register this browser's App Check debug token in the Firebase console.")),
    }),
    isTokenAutoRefreshEnabled: true,
  });
  ai = getAI(app, { backend: new GoogleAIBackend() });
  return { app, ai };
}
