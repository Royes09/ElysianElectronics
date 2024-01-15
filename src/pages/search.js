import Image from "next/image";
import Link from "next/link";
import styles from "../app/page.module.css";

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

import { toast } from "react-hot-toast";

export default function Search() {
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

  useEffect(() => {
    getDocs(collection(db, "products")).then((q) => {
      const productsData = q.docs.map((d) => {
        let data = d.data();
        data["id"] = d.id;
        return data;
      });
      setProducts(productsData);
    });
  }, []);

  useEffect(() => {
    if (authUser) {
      getDoc(doc(db, "users", authUser.email)).then((dataRaw) => {
        setUserData(dataRaw.data());
      });
    }
  }, [authUser]);

  useEffect(() => {
    const { search, favorite } = router.query;
    console.log(favorite);
    let filteredProducts = products;

    if (search) {
      const keyword = search.toLowerCase();
      filteredProducts = filteredProducts.filter((p) =>
        p.title.toLowerCase().includes(keyword)
      );
    }

    if (favorite && userData) {
      filteredProducts = filteredProducts.filter((p) =>
        userData.favorites.some((fav) => fav.id === p.id)
      );
    }

    setProducts(filteredProducts);
  }, [router.query, userData]);

  const favorite = async (pId) => {
    const user = doc(db, "users", authUser.email);
    const productRef = doc(db, "products", pId);
    if (!userData["favorites"].some((d) => d.id == productRef.id)) {
      userData["favorites"].push(productRef);
      toast.success("Added to favorites", { icon: "☠️" });
    } else {
      const productIndex = userData["favorites"].findIndex(
        (d) => d.id == productRef.id
      );

      userData["favorites"].splice(productIndex, 1);
      toast.success("Removed from favorites", { icon: "☠️" });
    }
    setUserData({ ...userData });
    await setDoc(user, userData);
  };

  return (
    <main>
      <Navbar userData={userData} setCart={setCart} cart={cart} />
      <Cart isOpen={cart} userData={userData} />
      <div className="flex flex-col px-10 py-5 w-full h-full gap-5">
        <h1 className="text-3xl font-bold">Search Results</h1>
        <div className="w-full h-full grid auto-cols-min grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
          {products.map((p) => (
            <Product
              key={p.id}
              pId={p.id}
              title={p.title}
              price={p.price}
              rating="5.00"
              image={p.imagePath[0]}
              stock={p.stock}
              addToCart={() => toast.success("Added to cart", { icon: "☠️" })}
              favorite={() => favorite(p.id)}
              favorited={userData.favorites?.some((fav) => fav.id === p.id)}
              disabled={disabled.includes(p.id) || p.stock == 0 || !p.stock}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
