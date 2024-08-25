// src/firebase.js
import firebase from 'firebase/compat/app'; // Import the main Firebase App module
import 'firebase/compat/database'; // Import the Firebase Realtime Database module
import  {getFirestore}  from 'firebase/firestore';

//these firebase credentials are of great use if you have access of my firebase console, which you dont.
//I know it aint a secure way of using credentials in a web application but i havent got enough time to put on that.
//But you cant use them because i already have firebase rules setup, so no reading, no writing without permission unless authenticated.
//Some turn arounds can be found, so please report them to me, Dont spam my database and dont fuck me up. Thanks.

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

  const db = getFirestore(app); // Initialize Firestore

  export { db };
  export default firebase; // Export the Firebase instance for other modules to use
  