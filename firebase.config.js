// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4Fk5HbKWr-fCF72zN9uIhKsMbG37Nof4",
  authDomain: "course-project-60398.firebaseapp.com",
  projectId: "course-project-60398",
  storageBucket: "course-project-60398.firebasestorage.app",
  messagingSenderId: "827537012915",
  appId: "1:827537012915:web:d329c917b2d28b6bcb98c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);