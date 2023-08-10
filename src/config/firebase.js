// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKDOHrEgZXzURM-Rvh69NEWjrREua4GIM",
  authDomain: "fireapp-de7a0.firebaseapp.com",
  databaseURL: "https://fireapp-de7a0-default-rtdb.firebaseio.com",
  projectId: "fireapp-de7a0",
  storageBucket: "fireapp-de7a0.appspot.com",
  messagingSenderId: "941622169517",
  appId: "1:941622169517:web:23908d7c340aa59a84db24",
  measurementId: "G-RR774K32SZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const database = getDatabase(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export {database, auth};