// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "auth-app-mern.firebaseapp.com",
  projectId: "auth-app-mern",
  storageBucket: "auth-app-mern.appspot.com",
  messagingSenderId: "361532457704",
  appId: "1:361532457704:web:a1f8a5aef1b617bfc77f5d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
