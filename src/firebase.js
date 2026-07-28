import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHLwj-Vw9Oy8rlc13FbHsxQayGZ_FkHBk",
  authDomain: "taichinhtest-6eb1b.firebaseapp.com",
  projectId: "taichinhtest-6eb1b",
  storageBucket: "taichinhtest-6eb1b.firebasestorage.app",
  messagingSenderId: "909645977970",
  appId: "1:909645977970:web:cd94622a9955bc829765eb",
  measurementId: "G-J50HEBH9BN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
