import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZmK_KD7mZ29sRkYhP9dNe0yJIyNk0Ah8",
  authDomain: "assamairproducts-4c315.firebaseapp.com",
  projectId: "assamairproducts-4c315",
  storageBucket: "assamairproducts-4c315.firebasestorage.app",
  messagingSenderId: "747849062310",
  appId: "1:747849062310:web:f7e5829772cca3d0382167",
  measurementId: "G-0MPS7ZNJ34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);