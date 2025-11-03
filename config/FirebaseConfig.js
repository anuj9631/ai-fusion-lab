// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-fusion-lab-db3f4.firebaseapp.com",
  projectId: "ai-fusion-lab-db3f4",
  storageBucket: "ai-fusion-lab-db3f4.firebasestorage.app",
  messagingSenderId: "322760004963",
  appId: "1:322760004963:web:064804f6c0177a44cb6f56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)