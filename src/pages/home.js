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
import Cart from "@/components/cart";
import Checkout from "@/components/checkout";

import { toast } from "react-hot-toast";

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
  const [disabled, setDisabled] = useState([]);
  const [cart, setCart] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const addToCart = async (pId) => {
    const user = doc(db, "users", authUser.email);
    userData["cart"].push(doc(db, "products", pId));

    setUserData({ ...userData });
    await setDoc(user, userData);

    toast.success("Added to cart", { icon: "✅" });

    window.location.reload();
    disabled.push(pId);
    setDisabled([...disabled]);
    console.log(disabled);
    setTimeout(() => {
      disabled.splice(disabled.indexOf(pId), 1);
      setDisabled([...disabled]);
      console.log(disabled);
    }, 3000);
  };

  const removeFromCart = async (pId) => {
    const user = doc(db, "users", authUser.email);

    console.log(userData["cart"]);

    userData["cart"] = userData["cart"].filter(
      (d) => d.id !== doc(db, "products", pId).id
    );

    console.log(userData["cart"]);

    setUserData({ ...userData });
    await setDoc(user, userData);

    toast.success("Removed from cart", { icon: "✅" });
    window.location.reload();
  };

  const favorite = async (pId) => {
    const user = doc(db, "users", authUser.email);
    const productRef = doc(db, "products", pId);
    if (!userData["favorites"].some((d) => d.id == productRef.id)) {
      userData["favorites"].push(productRef);
      toast.success("Added to favorites", { icon: "✅" });
    } else {
      const productIndex = userData["favorites"].findIndex(
        (d) => d.id == productRef.id
      );

      userData["favorites"].splice(productIndex, 1);
      toast.success("Removed from favorites", { icon: "✅" });
    }
    setUserData({ ...userData });
    await setDoc(user, userData);
  };

  // const sendMail = async () => {
  //   const res = await fetch("/api/send/", {
  //     method: "POST",
  //   });
  // };

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

  useEffect(() => {
    if (authUser) {
      getDoc(doc(db, "users", authUser.email)).then((dataRaw) => {
        setUserData(dataRaw.data());
      });
    }
  }, [authUser]);

  return (
    <main>
      {showModal ? (
        <Checkout setShowModal={setShowModal} userData={userData} />
      ) : (
        <></>
      )}
      <Navbar userData={userData} setCart={setCart} cart={cart} />
      <Cart
        isOpen={cart}
        userData={userData}
        removeFromCart={removeFromCart}
        setShowModal={setShowModal}
      />
      <div className="flex flex-col px-10 py-5 w-full h-full gap-5">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="w-full h-full grid auto-cols-min grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
          {products.map((p) => (
            <Product
              key={p.id}
              pId={p.id}
              title={p.title}
              price={p.price}
              rating="5.00"
              image={p.imagePath[0]}
              addToCart={addToCart}
              favorite={favorite}
              stock={p.stock}
              favorited={userData["favorites"].some((d) => d.id == p.id)}
              disabled={
                disabled.includes(p.id) || p.stock == 0 || !p.stock || !authUser
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}
