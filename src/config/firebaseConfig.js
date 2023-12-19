import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7r7J-FbwuikplFziwlCtN-GaoT7y5vzU",
  authDomain: "elysian-b1e99.firebaseapp.com",
  databaseURL:
    "https://elysian-b1e99-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "elysian-b1e99",
  storageBucket: "elysian-b1e99.appspot.com",
  messagingSenderId: "856210034188",
  appId: "1:856210034188:web:74c4ca76053c96656d6829",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
