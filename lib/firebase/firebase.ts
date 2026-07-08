import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirebaseConfig } from "./config";

let app: FirebaseApp | null = null;

/** Firebaseアプリを遅延初期化して返す(多重初期化を防止) */
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps()[0] ?? initializeApp(getFirebaseConfig());
  }
  return app;
}
