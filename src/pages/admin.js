import Image from "next/image";
import Link from "next/link";
import styles from "../app/page.module.css";

import { faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
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
import toast from "react-hot-toast";

function ProductCard({
  pId,
  image,
  title,
  description,
  price,
  stock,
  editProduct,
}) {
  const router = useRouter();
  const { authUser, db } = useAuth();

  const deleteProduct = async () => {
    await deleteDoc(doc(db, "products", pId));
    router.reload();
  };
  return (
    <div className="flex flex-row w-full relative h-48 p-5 bg-white text-black items-center justify-between border-dashed border-2 border-sky-500">
      <div className="flex gap-5 w-full h-full">
        <div className="w-1/3 h-full flex items-center justify-center relative">
          <Image
            src={`/assets/products/${image}`}
            layout="relative"
            objectFit="cover"
            width={150}
            height={150}
          />
        </div>
        <div className="flex flex-col justify-between w-full h-full">
          <div>
            <h1 className="text-base md:text-xl w-full">{title}</h1>
            <h1 className="text-base md:text-base w-full">
              {description
                ? description.length > 100
                  ? description.substring(0, 100) + "..."
                  : description
                : ""}
            </h1>
          </div>
          <div>
            <h1>Stock: {stock || 0}</h1>
            <h1>{price} RON</h1>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-5">
        <div className="flex w-1/6 h-full items-center justify-end">
          <div
            onClick={() => editProduct()}
            className="w-20 h-20 flex items-center justify-center hover:bg-slate-500 cursor-pointer rounded-full"
          >
            <FontAwesomeIcon icon={faPencil} className="w-full" />
          </div>
        </div>
        <div className="flex w-1/6 h-full items-center justify-end">
          <div
            onClick={() => deleteProduct()}
            className="w-20 h-20 flex items-center justify-center hover:bg-slate-500 cursor-pointer rounded-full"
          >
            <FontAwesomeIcon icon={faTrash} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Comanda({ comanda, userData }) {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  const { authUser, db } = useAuth();

  useEffect(() => {
    comanda.cart.map((p) => {
      getDoc(p).then((pRaw) => {
        const data = pRaw.data();
        cart.push(data.title);
        setCart([...cart]);
      });
    });
  }, []);

  const checkout = async () => {
    await deleteDoc(doc(db, "orders", comanda.id));

    const res = await fetch("/api/send/", {
      method: "POST",
      body: JSON.stringify({
        type: "finalizata",
        nume: comanda.nume,
        email: comanda.email,
      }),
    });

    toast.success("Comanda finalizata cu succes", "☠️");
    router.reload();
  };

  return (
    <div className="w-full h-full flex justify-between border-dashed border-2 border-sky-500">
      <div className="w-full h-full flex flex-col text-black">
        <p>
          <strong>Nume:</strong> {comanda.nume}
        </p>
        <p>
          <strong>Adresa:</strong> {comanda.adresa}
        </p>
        <p>
          <strong>Cos:</strong>
        </p>
        <ul>
          {cart.map((p) => (
            <li>• {p}</li>
          ))}
        </ul>
      </div>
      <div className="w-1/3 flex flex-col align-center justify-center">
        <button
          onClick={() => checkout()}
          className="transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-3 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-purple-600 "
        >
          <span>Finalizeaza comanda</span>
        </button>
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
  const [product, setProduct] = useState();
  const [comenzi, setComenzi] = useState([]);

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

    getDocs(collection(db, "orders")).then((q) => {
      q.forEach((d) => {
        let data = d.data();
        data["id"] = d.id;
        comenzi.push(data);
        setComenzi(comenzi);
      });
    });
  }, []);

  return (
    <main>
      {showModal ? (
        <Modal
          setShowModal={setShowModal}
          setProduct={setProduct}
          product={product}
        />
      ) : (
        <></>
      )}
      <Navbar userData={userData} />
      <div className="flex flex-col px-10 py-5 w-full h-full gap-5">
        <h1 className="text-3xl font-bold">Comenzi</h1>
        <div className="flex w-full flex-col bg-white">
          {comenzi.map((c) => (
            <Comanda comanda={c} userData={userData} />
          ))}
        </div>
      </div>

      <div className="flex flex-col px-10 py-5 w-full h-full gap-5">
        <h1 className="text-3xl font-bold">Produse</h1>
        <div className="flex w-full flex-col bg-white">
          <div
            onClick={() => setShowModal(true)}
            className="flex w-full h-auto bg-white hover:bg-slate-500 cursor-pointer text-black items-center justify-center border-dashed border-2 border-sky-500"
          >
            <FontAwesomeIcon className="w-1/12" icon={faPlus} size="4x" />
          </div>
          {products.map((p) => (
            <ProductCard
              pId={p.id}
              title={p.title}
              price={p.price}
              description={p.description}
              image={p.imagePath[0]}
              stock={p.stock}
              editProduct={() => {
                setShowModal(true);
                setProduct(p.id);
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
