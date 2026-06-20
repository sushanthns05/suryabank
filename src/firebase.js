import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA8ZpsxOpSAkc5QNjx7509h_B31uBlMCvA",
    authDomain: "surya-4f39a.firebaseapp.com",
    projectId: "surya-4f39a",
    storageBucket: "surya-4f39a.firebasestorage.app",
    messagingSenderId: "790995386990",
    appId: "1:790995386990:web:49083727d0aa4d377a9c7f",
    measurementId: "G-WQYL1LR26C"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);