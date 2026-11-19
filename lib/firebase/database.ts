
import { db as firestoreDb } from "./firebase";
import type { Firestore } from "firebase/firestore";

export function getDb(): Firestore {
  return firestoreDb;
}
