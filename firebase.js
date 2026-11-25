// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmPMUesoBHNJkPXUaLksBoCEUv2uWjwDM",
    authDomain: "rwat-ca2-memory-game-9408c.firebaseapp.com",
    projectId: "rwat-ca2-memory-game-9408c",
    storageBucket: "rwat-ca2-memory-game-9408c.firebasestorage.app",
    messagingSenderId: "861391933420",
    appId: "1:861391933420:web:2ec3965b9b07ac57833ac9",
    measurementId: "G-ZGW9NYQPLY"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Connect to Firestore
export const db = getFirestore(app);
