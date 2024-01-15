import { useState, useEffect } from "react";
import { auth, db } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(authUser);

  const authStateChanged = async (authState) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      // console.log(window.location.pathname);
      if (!["/register", "/recover"].includes(window.location.pathname))
        router.push("/login");
      return;
    }

    setLoading(true);
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => signOut(auth).then(clear);

  const sendReset = (email) => sendPasswordResetEmail(auth, email);

  const createUserEntry = (email) => {
    try {
      return setDoc(doc(db, "users", email), {
        email: email,
        admin: false,
        cart: [],
        favorites: [],
        comments: [],
      });
    } catch (err) {
      console.log("Error creating user");
    }
  };

  // const getUser = (email) => {
  //   try {
  //     getDoc(doc(db, "users", email)).then((dataRaw) => {
  //       return dataRaw.data();
  //     });
  //   } catch (err) {
  //     console.log("Error getting user");
  //   }
  // };

  return {
    authUser,
    loading,
    signIn,
    createUser,
    logOut,
    sendReset,
    createUserEntry,
    db,
  };
}
