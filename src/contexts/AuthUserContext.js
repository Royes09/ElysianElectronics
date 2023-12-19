"use client";
import { createContext, useContext } from "react";
import useFirebaseAuth from "../hooks/useFirebaseAuth";

const authUserContext = createContext({
  authUser: null,
  loading: true,
  signIn: async () => {},
  createUser: async () => {},
  logOut: async () => {},
  sendReset: async () => {},
  createUserEntry: async () => {},
  db: null,
});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  );
}

export const useAuth = () => useContext(authUserContext);
