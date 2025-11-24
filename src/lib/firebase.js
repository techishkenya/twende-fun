import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Real Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBeSXNKMi6xW28laTMcWiBbPD1o_izadd4",
    authDomain: "twende-a3958.firebaseapp.com",
    projectId: "twende-a3958",
    storageBucket: "twende-a3958.firebasestorage.app",
    messagingSenderId: "461119739054",
    appId: "1:461119739054:web:65b3c057a9c6af8e1f493f",
    measurementId: "G-R1SSDVF9KR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
