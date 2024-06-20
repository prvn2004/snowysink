// src/firebase.js
import firebase from 'firebase/compat/app'; // Import the main Firebase App module
import 'firebase/compat/database'; // Import the Firebase Realtime Database module


const firebaseConfig = {
    apiKey: "AIzaSyBFnnwZ5MUBWQ3kRRiYusonhSeJp77C20g",
    authDomain: "project24-f0148.firebaseapp.com",
    databaseURL: "https://project24-f0148-default-rtdb.firebaseio.com",
    projectId: "project24-f0148",
    storageBucket: "project24-f0148.appspot.com",
    messagingSenderId: "547046004661",
    appId: "1:547046004661:web:5fe700f905fca73baf6bfc",
    measurementId: "G-GRSE13RPCB"
  };
  const app = firebase.initializeApp(firebaseConfig);

  export const db = app.database(); // Export the Firebase Realtime Database instance
  export default firebase; // Export the Firebase instance for other modules to use
  