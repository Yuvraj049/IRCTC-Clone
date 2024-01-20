import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "travel-booking-c3dc1.firebaseapp.com",
    projectId: "travel-booking-c3dc1",
    storageBucket: "travel-booking-c3dc1.appspot.com",
    messagingSenderId: "794142981718",
    appId: "1:794142981718:web:5ef813d5a2829a5d3005f7",
    measurementId: "G-6YB50NN1Q6"
  };
  const app = initializeApp(firebaseConfig);
  
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage=getStorage(app);
  export {auth,db,storage};