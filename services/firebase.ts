
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgU5bKP5JJA5Ar3o7JTcz2dTaQ5aK6OQY",
  authDomain: "naajix-2a286.firebaseapp.com",
  projectId: "naajix-2a286",
  storageBucket: "naajix-2a286.firebasestorage.app",
  messagingSenderId: "120951256783",
  appId: "1:120951256783:web:4146a8a27509760936a9ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable Offline Persistence
// This prevents "Could not reach Cloud Firestore backend" errors from blocking the UI
// and allows the app to load previously fetched data while offline.
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn("Firestore persistence failed: Multiple tabs open.");
    } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn("Firestore persistence not supported by this browser.");
    }
});
