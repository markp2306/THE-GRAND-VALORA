import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDx1Vyv9WKtZI31ZiracSAQUhS4yaY-QBU",
    authDomain: "the-grand-valora.firebaseapp.com",
    projectId: "the-grand-valora",
    storageBucket: "the-grand-valora.firebasestorage.app",
    messagingSenderId: "107766725282",
    appId: "1:107766725282:web:6e91f5ea21c34dfa55b5fb",
    measurementId: "G-9GBZHYS057"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.dbFirestore = db;
window.firestoreTools = { collection, addDoc, getDocs, query, where };
