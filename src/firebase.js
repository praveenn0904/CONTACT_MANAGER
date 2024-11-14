// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCauPh1pSjs3Olza-lxYIhfrDl-XmgU8ys",
    authDomain: "contact-manager-82017.firebaseapp.com",
    projectId: "contact-manager-82017",
    storageBucket: "contact-manager-82017.firebasestorage.app",
    messagingSenderId: "818778861335",
    appId: "1:818778861335:web:c94a3a2bf7cd1d957f9152",
    measurementId: "G-RKJSW3DSSH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Optional: Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup };
