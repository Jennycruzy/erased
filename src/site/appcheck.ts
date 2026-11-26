// /appcheck.html: gets a Firebase App Check token with reCAPTCHA Enterprise and hands it to the app that opened it.
// Chrome extensions cannot load reCAPTCHA, and the phone builds have no Play Store or App Store attestation, so the
// extension (hidden frame) and the Android and iPhone apps (hidden web view) take their App Check token from here.
// The token only lets a caller use this project's Firebase AI Logic; it carries nothing about the person.
import { initializeApp } from "firebase/app";
import { getToken, initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { firebaseConfig, RECAPTCHA_SITE_KEY } from "../ai/firebase-config";

interface Msg { type: "erased-appcheck"; token?: string; expireTimeMillis?: number; error?: string }
type W = typeof window & {
  ErasedAndroid?: { token: (json: string) => void };
  webkit?: { messageHandlers?: { erased?: { postMessage: (json: string) => void } } };
};

function send(msg: Msg) {
  const w = window as W;
  const parentOrigin = location.ancestorOrigins?.[0] ?? "";
  // Only our own apps: an extension page that framed this page, or the phone apps' native bridges.
  if (parentOrigin.startsWith("chrome-extension://")) window.parent.postMessage(msg, parentOrigin);
  else if (w.ErasedAndroid) w.ErasedAndroid.token(JSON.stringify(msg));
  else if (w.webkit?.messageHandlers?.erased) w.webkit.messageHandlers.erased.postMessage(JSON.stringify(msg));
  (document.getElementById("out") as HTMLElement).textContent = msg.token ? "App Check token ready." : `No token: ${msg.error}`;
}

const expiry = (jwt: string) => {
  try { return (JSON.parse(atob(jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).exp as number) * 1000; } catch { return Date.now() + 30 * 60e3; }
};

const appCheck = initializeAppCheck(initializeApp(firebaseConfig), { provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY), isTokenAutoRefreshEnabled: false });
// Say what happened even if reCAPTCHA never answers (a web view that does not run it, a blocked network).
let sent = false;
setTimeout(() => sendOnce({ type: "erased-appcheck", error: "reCAPTCHA did not answer in 20 s" }), 20_000);
const sendOnce = (m: Msg) => { if (!sent) { sent = true; send(m); } };
getToken(appCheck, false)
  .then((t) => sendOnce({ type: "erased-appcheck", token: t.token, expireTimeMillis: expiry(t.token) }))
  .catch((e) => sendOnce({ type: "erased-appcheck", error: String((e as Error).message).slice(0, 300) }));
