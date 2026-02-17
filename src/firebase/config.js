// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyBArJ8I25Z4zRJ7eeVNcxhVJd1ut7c0y48",
    authDomain: "karnavme.firebaseapp.com",
    projectId: "karnavme",
    storageBucket: "karnavme.firebasestorage.app",
    messagingSenderId: "198233706247",
    appId: "1:198233706247:web:f22dc1b1fcfc6ae3bf3fa2",
    measurementId: "G-RW5FRGPEW7"
};

// Initialize Firebase
// We wrap this in a try-catch or check for placeholders to avoid crashing if not set up
let app;
let auth;
let db;

try {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } else {
        console.warn("Firebase config is missing. Using Mock Mode.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

export { auth, db };
