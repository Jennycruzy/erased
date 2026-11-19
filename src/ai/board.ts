import type { FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth/web-extension";
import { doc, getDoc, getFirestore, increment, writeBatch } from "firebase/firestore";

/**
 * Adds one anonymous outcome to the public "who actually deletes" board: company domain, outcome and month only.
 * Firestore rules allow one count per (anonymous user, company, outcome).
 */
export async function shareOutcome(app: FirebaseApp, domain: string, outcome: string): Promise<boolean> {
  const auth = getAuth(app);
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
  const db = getFirestore(app);
  const reportRef = doc(db, "reports", `${user.uid}_${domain}_${outcome}`);
  const month = new Date().toISOString().slice(0, 7);
  const boardRef = doc(db, "board", domain);
  try {
    const batch = writeBatch(db);
    batch.set(reportRef, { domain, outcome, month });
    batch.set(boardRef, { [outcome]: increment(1) }, { merge: true });
    await batch.commit();
    return true;
  } catch {
    // Already counted (the rules refuse a second report), or offline.
    return false;
  }
}

export async function boardFor(app: FirebaseApp, domain: string): Promise<Record<string, number> | null> {
  const snap = await getDoc(doc(getFirestore(app), "board", domain));
  return snap.exists() ? (snap.data() as Record<string, number>) : null;
}
