import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './routes';
import { auth } from './config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import firebase from 'firebase/compat/app';
// import 'firebase/database';
// import 'firebase/auth';

// const firebaseConfig = {
//   apiKey: "AIzaSyBKDOHrEgZXzURM-Rvh69NEWjrREua4GIM",
//   authDomain: "fireapp-de7a0.firebaseapp.com",
//   databaseURL: "https://fireapp-de7a0-default-rtdb.firebaseio.com",
//   projectId: "fireapp-de7a0",
//   storageBucket: "fireapp-de7a0.appspot.com",
//   messagingSenderId: "941622169517",
//   appId: "1:941622169517:web:23908d7c340aa59a84db24",
//   measurementId: "G-RR774K32SZ"
// };

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

function App() {
  // const [user, setUser] = useState();
  // const onLogout = () => {
  //   setUser(null);
  // }

  // useEffect(() => {
  //   let user = localStorage.getItem("token");
  //   if (user) {
  //     const onAuth = getAuth();
  //   onAuthStateChanged(auth, user).then(function(response){
  //     console.log(response);
  //   })
  //   }
    
    // firebase.auth().onAuthStateChanged(response => {
    //   if (response) {
    //     loadUser(response.uid)
    //     .then(data => {setUser(data);});
    //   }
    // });
  // }, []);

  return (
    <Router>
      <Routes />
    </Router>
  );
}

export default App;
