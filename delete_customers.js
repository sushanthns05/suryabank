import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA8ZpsxOpSAkc5QNjx7509h_B31uBlMCvA",
    authDomain: "surya-4f39a.firebaseapp.com",
    projectId: "surya-4f39a",
    storageBucket: "surya-4f39a.firebasestorage.app",
    messagingSenderId: "790995386990",
    appId: "1:790995386990:web:49083727d0aa4d377a9c7f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearCustomers() {
    console.log("Fetching users...");
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    let count = 0;
    
    for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.role === 'customer' || !data.role) {
            console.log(`Deleting customer: ${data.email}`);
            await deleteDoc(doc.ref);
            count++;
        }
    }
    
    console.log(`Successfully deleted ${count} customer records from Firestore.`);
    process.exit(0);
}

clearCustomers().catch(console.error);
