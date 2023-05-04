import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.REACT_APP_DB_API_KEY,
  authDomain: "ticketcity-d947b.firebaseapp.com",
  projectId: "ticketcity-d947b",
  storageBucket: "ticketcity-d947b.appspot.com",
  messagingSenderId: "343353827814",
  appId: "1:343353827814:web:df9d4727042774a0f27627"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);