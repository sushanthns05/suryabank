import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA8ZpsxOpSAkc5QNjx7509h_B31uBlMCvA",
    authDomain: "surya-4f39a.firebaseapp.com",
    projectId: "surya-4f39a",
    storageBucket: "surya-4f39a.firebasestorage.app",
    messagingSenderId: "790995386990",
    appId: "1:790995386990:web:49083727d0aa4d377a9c7f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'suryabank');

async function checkLoans() {
  const loansRef = collection(db, 'loans');         
  const snap = await getDocs(loansRef);
  let loans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Sort by createdAt descending
  loans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  console.log(`Found ${loans.length} loans.`);
  loans.slice(0, 5).forEach((l, i) => {
    console.log(`Loan ${i+1}: ID=${l.id}, status=${l.status}, email=${l.email}, createdAt=${l.createdAt}`);
  });
}

checkLoans();
