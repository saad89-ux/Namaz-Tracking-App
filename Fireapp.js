 // Import the functions you need from the SDKs you need
  import  { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
   // Import the functions you need from the SDKs you need
  import { getFirestore,
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  getDoc,
  where,
  query, } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
   import {  getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCaCyWO3HbphSqtZ9MBDOTyefqQagkliq0",
    authDomain: "namaz-tacking-app.firebaseapp.com",
    projectId: "namaz-tacking-app",
    storageBucket: "namaz-tacking-app.firebasestorage.app",
    messagingSenderId: "944935337682",
    appId: "1:944935337682:web:a352ec70bd271cc249370b"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);
  export  {app,db , collection, addDoc , getDocs,doc,deleteDoc ,updateDoc , auth , createUserWithEmailAndPassword, setDoc,
  getDoc,
  where,
  query,signInWithEmailAndPassword} ;