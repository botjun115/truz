"use client";

import { useMemo } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { getDb } from "@/lib/firebase/database";
import { getFirebaseApp } from "@/lib/firebase/firebase";
import { getStorageClient } from "@/lib/firebase/storage";

export interface UseFirebaseResult {
  isConfigured: boolean;
  getApp: typeof getFirebaseApp;
  getDb: typeof getDb;
  getStorage: typeof getStorageClient;
}

/** Firebaseクライアントへの遅延アクセサ(未設定環境でも呼ぶまで例外を出さない) */
export function useFirebase(): UseFirebaseResult {
  return useMemo(
    () => ({
      isConfigured: isFirebaseConfigured(),
      getApp: getFirebaseApp,
      getDb,
      getStorage: getStorageClient,
    }),
    [],
  );
}
