/** Public web config for the Erased Firebase project (safe to ship; access is controlled by App Check and rules). */
export const firebaseConfig = {
  apiKey: "AIzaSyAbSG59wFNc9zTtkVIePV5sYLeZvU9Rfew",
  authDomain: "forget-me-hybrid.firebaseapp.com",
  projectId: "forget-me-hybrid",
  storageBucket: "forget-me-hybrid.firebasestorage.app",
  messagingSenderId: "798434253190",
  appId: "1:798434253190:web:8c21bad2081942d239b407",
};

/** reCAPTCHA Enterprise site key: App Check on the website, and (through /appcheck.html) for the extension and phones. */
export const RECAPTCHA_SITE_KEY = "6Le2wDMuAAAAANSUyebwEmxvOiSt5mbj0EwknS4N";

/** The page that hands a fresh App Check token to the extension and the phone apps. */
export const APPCHECK_BRIDGE_URL = "https://forget-me-hybrid.web.app/appcheck.html";
