import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0nKQ5wNIBLTJPV1pM9Av1kcFHYg0AJ24",
  authDomain: "pitchtank-bf54d.firebaseapp.com",
  projectId: "pitchtank-bf54d",
  storageBucket: "pitchtank-bf54d.firebasestorage.app",
  messagingSenderId: "731498291922",
  appId: "1:731498291922:web:d40c1df49433360c1c030b",
  measurementId: "G-43QLGZQ34R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
