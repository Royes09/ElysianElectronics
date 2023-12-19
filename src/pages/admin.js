import Image from "next/image";
import Link from "next/link";
import styles from "../app/page.module.css";

import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth } from "@/contexts/AuthUserContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";

import Navbar from "@/components/navbar";

import Modal from "@/components/modal";

function ProductCard({ pId, image, title, price }) {
  const router = useRouter();
  const { authUser, db } = useAuth();

  const deleteProduct = async () => {
    await deleteDoc(doc(db, "products", pId));
    router.reload();
  };
  return (
    <div className="flex flex-row w-full relative h-28 p-5 bg-white text-black items-center justify-between border-dashed border-2 border-sky-500">
      <div className="flex gap-5 w-full h-full">
        <Image src={`/assets/products/${image}`} width={50} height={50} />
        <div>
          <h1 className="text-3xl">{title}</h1>
          <h1>{price} RON</h1>
        </div>
      </div>
      <div className="flex w-full h-full items-center justify-end">
        <div
          onClick={() => deleteProduct()}
          className="w-10 h-10 flex items-center justify-center hover:bg-slate-500 cursor-pointer rounded-full"
        >
          <FontAwesomeIcon icon={faTrash} size="2x" />
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const router = useRouter();
  const userDataObj = {
    admin: false,
    email: "",
    cart: [],
    comments: [],
    favorites: [],
  };

  const [userData, setUserData] = useState(userDataObj);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);

  const { authUser, db } = useAuth();

  useEffect(() => {
    if (authUser) {
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
      {showModal ? <Modal setShowModal={setShowModal} /> : <></>}
      <Navbar userData={userData} />
      <div className="flex flex-col px-10 py-5 w-full h-full gap-5">
        <h1 className="text-3xl font-bold">Shop products</h1>
        <div className="flex w-full flex-col bg-white">
          <div
            onClick={() => setShowModal(true)}
            className="flex w-full h-28 bg-white hover:bg-slate-500 cursor-pointer text-black items-center justify-center border-dashed border-2 border-sky-500"
          >
            <FontAwesomeIcon icon={faPlus} size="4x" />
          </div>
          {products.map((p) => (
            <ProductCard
              pId={p.id}
              title={p.title}
              price={p.price}
              image={p.imagePath}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
