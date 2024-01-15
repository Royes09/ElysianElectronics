import { faPlus, faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth } from "@/contexts/AuthUserContext";
import { useState } from "react";

import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";

import { useEffect } from "react";

import { toast } from "react-hot-toast";

export default function Checkout({ setShowModal, setProduct, userData }) {
  const { cart } = userData;
  const router = useRouter();

  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [adresa, setAdresa] = useState("");
  const [card, setCard] = useState("");
  const [expirare, setExpirare] = useState("");
  const [cvv, setCVV] = useState("");

  const { db } = useAuth();

  const checkout = async (e) => {
    e.preventDefault();
    let produse = [];
    for (const productRef of cart) {
      const productSnapshot = await getDoc(productRef);
      const productData = productSnapshot.data();
      if (productData) {
        produse.push(productData.title);
        const updatedStock = parseInt(productData["stock"]) - 1;

        await updateDoc(productRef, { stock: updatedStock });
      }
    }

    userData["cart"] = [];
    setDoc(doc(db, "users", userData.email), userData);

    await addDoc(collection(db, "orders"), {
      cart: cart,
      nume: nume,
      prenume: prenume,
      adresa: adresa,
      email: userData.email,
      status: "Comanda plasata",
    });

    toast.success("Comanda plasata", { icon: "☠️" });

    const res = await fetch("/api/send/", {
      method: "POST",
      body: JSON.stringify({
        type: "plasata",
        nume: nume,
        email: userData.email,
        produse: produse,
      }),
    });

    router.reload();
  };

  return (
    <form
      onSubmit={checkout}
      className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 flex flex-col gap-5 justify-evenly bg-blue-500"
    >
      <FontAwesomeIcon
        onClick={() => {
          setShowModal(false);
          setProduct(undefined);
        }}
        icon={faXmark}
        className="absolute right-5 top-5 w-10 h-10 cursor-pointer"
        size="2x"
      />
      <h1 className="font-bold text-3xl">Introdu datele</h1>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="nume">Nume</label>
        <input
          name="nume"
          onChange={(e) => {
            setNume(e.target.value);
          }}
          value={nume}
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="Nume"
          required
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="prenume">Prenume</label>
        <input
          name="prenume"
          onChange={(e) => {
            setPrenume(e.target.value);
          }}
          value={prenume}
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="Prenume"
          required
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="adresa">Adresa</label>
        <input
          name="adresa"
          onChange={(e) => {
            setAdresa(e.target.value);
          }}
          value={adresa}
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="Adresa"
          required
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="card">Card</label>
        <input
          name="card"
          onChange={(e) => {
            setCard(e.target.value);
          }}
          value={card}
          pattern="[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}"
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="0000 0000 0000 0000"
          required
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="expirare">Data de expirare</label>
        <input
          name="expirare"
          onChange={(e) => {
            setExpirare(e.target.value);
          }}
          value={expirare}
          pattern="(0[1-9]|1[0-2]) / [0-9]{2}"
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="MM / YY"
          required
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="CVV">CVV</label>
        <input
          name="CVV"
          onChange={(e) => {
            setCVV(e.target.value);
          }}
          value={cvv}
          pattern="[0-9]{3}|[0-9]{4}"
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="CVV"
          required
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <button
          type="submit"
          className="transition-all rounded-md font-bold px-2 py-2 bg-[#DCAE64] hover:bg-[#db9729] text-[#1c4747]"
        >
          Cumpara
        </button>
      </div>
    </form>
  );
}
