// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// FIREBASE ANALYTICS
// import { getAnalytics } from "firebase/analytics";
// import { logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

const auth = getAuth(app);

// Initialize Firebase Analytics and export it
let analytics;

if (typeof window !== "undefined") {
  // Ensure that analytics is only initialized in the browser environment (not in SSR)
  analytics = getAnalytics(app);
}


// LOG CUSTOM EVENT
// const handleButtonClick = () => {
//   logEvent(analytics, 'button_click', { button_name: 'subscribe' });
// };

export { db, storage, auth, analytics };