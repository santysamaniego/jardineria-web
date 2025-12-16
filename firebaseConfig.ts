import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQP9IROVxjYrklHp5mRdyQILxEwNU_1Bc",
  authDomain: "autoparts-manager-59c20.firebaseapp.com",
  projectId: "autoparts-manager-59c20",
  storageBucket: "autoparts-manager-59c20.firebasestorage.app",
  messagingSenderId: "726608997926",
  appId: "1:726608997926:web:895283c6be9cd25378c0e7",
  measurementId: "G-0GGN4FQX3Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);