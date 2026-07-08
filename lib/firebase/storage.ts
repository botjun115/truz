import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirebaseApp } from "./firebase";

let storage: FirebaseStorage | null = null;

export function getStorageClient(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
  }
  return storage;
}
