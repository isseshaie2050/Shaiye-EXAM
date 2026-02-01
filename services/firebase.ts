
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
