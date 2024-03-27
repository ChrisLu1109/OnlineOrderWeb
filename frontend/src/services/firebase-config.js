// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import React, { useEffect } from 'react';
// import * as firebaseui from 'firebaseui';
// import 'firebaseui/dist/firebaseui.css';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtCyuBXiWjZXTXaQtxe8RYbJA6ZRH52j0",
  authDomain: "wuhealth-f19ba.firebaseapp.com",
  projectId: "wuhealth-f19ba",
  storageBucket: "wuhealth-f19ba.appspot.com",
  messagingSenderId: "238930998501",
  appId: "1:238930998501:web:674f8ae85d7331a2aad00c",
  measurementId: "G-1YZ7FHC8D6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
