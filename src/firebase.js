import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA8ZpsxOpSAkc5QNjx7509h_B31uBlMCvA",
    authDomain: "surya-4f39a.firebaseapp.com",
    projectId: "surya-4f39a",
    storageBucket: "surya-4f39a.firebasestorage.app",
    messagingSenderId: "790995386990",
    appId: "1:790995386990:web:7f2b74cd833bdf2a7a9c7f",
    measurementId: "G-BHZYRN3VD0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app, 'suryabank');
export const storage = getStorage(app);