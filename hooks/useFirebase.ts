

import { useMemo } from "react";
import type { FirebaseApp } from "firebase/app";
import firebaseApp from "@/lib/firebase/firebase";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { getDb } from "@/lib/firebase/database";
import { getStorageClient } from "@/lib/firebase/storage";

export interface UseFirebaseResult {
  isConfigured: boolean;
  getApp: () => FirebaseApp;
  getDb: typeof getDb;
  getStorage: typeof getStorageClient;
}

export function useFirebase(): UseFirebaseResult {
  return useMemo(
    () => ({
      isConfigured: isFirebaseConfigured(),
      getApp: () => firebaseApp,
      getDb,
      getStorage: getStorageClient,
    }),
    [],
  );
}
