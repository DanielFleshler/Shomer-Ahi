import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
    apiKey: "AIzaSyCEEf88K0Zx8fGPTEJcaEc3_SginCJkyak",
    authDomain: "shomer-ahi-e1bae.firebaseapp.com",
    projectId: "shomer-ahi-e1bae",
    storageBucket: "shomer-ahi-e1bae.firebasestorage.app",
    messagingSenderId: "833305259350",
    appId: "1:833305259350:web:7727afce490e366df23af7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);