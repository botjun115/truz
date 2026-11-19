
import { storage as firebaseStorage } from "./firebase";
import type { FirebaseStorage } from "firebase/storage";

export function getStorageClient(): FirebaseStorage {
  return firebaseStorage;
}
