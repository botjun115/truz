import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "truz-965b4.firebaseapp.com",
  projectId: "truz-965b4",
  storageBucket: "truz-965b4.firebasestorage.app",
  messagingSenderId: "366109527317",
  appId: "1:366109527317:web:622d1f1f0a85629c956d1c",
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);