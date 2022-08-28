// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDT5rOoCgRz9PO6bGlVIpcujCuYVjjEco",
  authDomain: "intel-evo-campaign-piggy-bank.firebaseapp.com",
  projectId: "intel-evo-campaign-piggy-bank",
  storageBucket: "intel-evo-campaign-piggy-bank.appspot.com",
  messagingSenderId: "342572814743",
  appId: "1:342572814743:web:dc4f6916a23580d4c374d2",
  measurementId: "G-15KDV7E7QP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

const googleAuthProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleAuthProvider);

export const masterPaletteColorRef = collection(db, "masCatColors");
