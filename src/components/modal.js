import { faPlus, faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth } from "@/contexts/AuthUserContext";
import { useState } from "react";

import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Modal({ setShowModal }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState();

  const { db } = useAuth();

  const addProduct = async () => {
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/upload/", {
        method: "POST",
        body: data,
      });

      try {
        await addDoc(collection(db, "products"), {
          title: title,
          price: price,
          imagePath: file.name,
        });
        router.reload();
      } catch (err) {
        console.log("Error setting product", err);
      }
      // handle the error
      if (!res.ok) throw new Error(await res.text());
    } catch (e) {
      // Handle errors here
      console.error(e);
    }
  };

  return (
    <div className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 flex flex-col gap-5 justify-evenly bg-blue-500">
      <FontAwesomeIcon
        onClick={() => setShowModal(false)}
        icon={faXmark}
        className="absolute right-5 top-5 cursor-pointer"
        size="2x"
      />
      <h1 className="font-bold text-3xl">Adauga produs</h1>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="title">Title</label>
        <input
          name="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="Title"
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="price">Price</label>
        <input
          name="price"
          type="number"
          min={0}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="Price"
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="image">Image</label>
        <input
          name="image"
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="Price"
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <button
          onClick={addProduct}
          className="transition-all rounded-md font-bold px-2 py-2 bg-[#DCAE64] hover:bg-[#db9729] text-[#1c4747]"
        >
          Adauga
        </button>
      </div>
    </div>
  );
}
