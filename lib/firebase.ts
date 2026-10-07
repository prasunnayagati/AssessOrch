import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWBj8VkvJNt8xN1-ARryCoDiw7t3sgoG4",
  authDomain: "assessorch-2545.firebaseapp.com",
  projectId: "assessorch-2545",
  storageBucket: "assessorch-2545.firebasestorage.app",
  messagingSenderId: "881182812123",
  appId: "1:881182812123:web:454d9783a007e36a3ae9fe"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics (optional, needs to be wrapped in a check for SSR)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
