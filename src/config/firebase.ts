import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCop3khlryKjYl--8v6E3oNUxSkomerahk",
  authDomain: "guga-cc497.firebaseapp.com",
  projectId: "guga-cc497",
  storageBucket: "guga-cc497.firebasestorage.app",
  messagingSenderId: "759597695254",
  appId: "1:759597695254:web:3d6b50bb653340849fd037",
  measurementId: "G-8FKGNF3E6B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Enable offline persistence
import { enableIndexedDbPersistence } from "firebase/firestore";

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});