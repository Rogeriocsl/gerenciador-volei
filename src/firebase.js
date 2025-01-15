import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADb6Dw5wZJHAdi3_SDaeNz9WYTu7xwMIg",
  authDomain: "systemr-4877c.firebaseapp.com",
  databaseURL: "https://systemr-4877c-default-rtdb.firebaseio.com",
  projectId: "systemr-4877c",
  storageBucket: "systemr-4877c.firebasestorage.app",
  messagingSenderId: "76346580988",
  appId: "1:76346580988:web:af6b718a9c8c8124cedc79",
  measurementId: "G-F25DGCQKBJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
