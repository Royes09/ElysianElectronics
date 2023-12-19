import Image from "next/image";
import Link from "next/link";
import styles from "../app/page.module.css";

import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth } from "@/contexts/AuthUserContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  removeDoc,
  collection,
} from "firebase/firestore";

import Product from "@/components/product";

import Navbar from "@/components/navbar";

export default function Home() {
  const router = useRouter();

  const userDataObj = {
    admin: false,
    email: "",
    cart: [],
    comments: [],
    favorites: [],
  };

  const [userData, setUserData] = useState(userDataObj);
  const { authUser, db } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (authUser) {
      // console.log(db);
      try {
        getDoc(doc(db, "users", authUser.email)).then((dataRaw) => {
          setUserData(dataRaw.data());
        });
      } catch (err) {
        console.log("Error getting user");
      }
    }
  }, [authUser]);

  useEffect(() => {
    getDocs(collection(db, "products")).then((q) => {
      q.forEach((d) => {
        let data = d.data();
        data["id"] = d.id;
        products.push(data);
        setProducts(products);
      });
    });
  }, []);

  return (
    <main>
      <Navbar userData={userData} />
      <div className="flex flex-col px-10 py-5 w-full h-full gap-5">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="w-full h-full grid auto-cols-min grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((p) => (
            <Product
              pId={p.id}
              title={p.title}
              price={p.price}
              ratin="5.00"
              image={p.imagePath}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
