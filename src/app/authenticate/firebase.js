// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBurj18R4sITSk7fcV8_tcR0BIp8WJGuKA",
  authDomain: "vrnitsolution2023.firebaseapp.com",
  projectId: "vrnitsolution2023",
  storageBucket: "vrnitsolution2023.appspot.com",
  messagingSenderId: "479553039097",
  appId: "1:479553039097:web:8510177853f737990bd028",
  measurementId: "G-RNDCV9J6B5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export const storage = firebase.storage();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
