import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ── Replace these with YOUR Firebase project's config ──
// Firebase > Project settings > General > "Your apps" > SDK setup and config
// It is safe for this object to be public / committed to a public repo.
// Your data is protected by Firebase Authentication + Firestore security
// rules, not by keeping this config secret.
const firebaseConfig = {
  apiKey: "AIzaSyB5UW09elMG09lzUsXQDyn6RKO7hUPHnCM",
  authDomain: "personal-savings-app-431e2.firebaseapp.com",
  projectId: "personal-savings-app-431e2",
  storageBucket: "personal-savings-app-431e2.firebasestorage.app",
  messagingSenderId: "242733592827",
  appId: "1:242733592827:web:91c12dd18c2a732fa1c05e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
