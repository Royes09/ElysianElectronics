import { faPlus, faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth } from "@/contexts/AuthUserContext";
import { useState } from "react";

import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";

import { useEffect } from "react";

export default function Modal({ setShowModal, setProduct, product }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(true);

  const { db } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "products", product));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          // console.log(productData);
          setTitle(productData.title || "");
          setPrice(productData.price || "");
          setStock(productData.stock || "");
          setDescription(productData.description || "");
          setLoading(false);
        } else {
          console.log("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };

    if (product) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, []);

  const addProduct = async () => {
    try {
      let imagePath;
      if (file) {
        const data = new FormData();
        data.set("file", file);

        const uploadRes = await fetch("/api/upload/", {
          method: "POST",
          body: data,
        });

        if (!uploadRes.ok) {
          throw new Error(await uploadRes.text());
        }

        imagePath = [file.name];
      } else if (product) {
        const productDoc = await getDoc(doc(db, "products", product));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          imagePath = productData.imagePath;
        }
      }

      try {
        if (product) {
          await setDoc(doc(db, "products", product), {
            title: title,
            description: description,
            price: price,
            imagePath: imagePath,
            stock: stock,
          });
        } else {
          await addDoc(collection(db, "products"), {
            title: title,
            description: description,
            price: price,
            imagePath: imagePath,
            stock: stock,
          });
        }
        router.reload();
      } catch (err) {
        console.log("Error setting product", err);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 flex flex-col gap-5 justify-evenly bg-blue-500">
      <FontAwesomeIcon
        onClick={() => {
          setShowModal(false);
          setProduct(undefined);
        }}
        icon={faXmark}
        className="absolute right-5 top-5 w-10 h-10 cursor-pointer"
        size="2x"
      />
      <h1 className="font-bold text-3xl">
        {product ? "Editeaza produs" : "Adauga produs"}
      </h1>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="title">Title</label>
        <input
          name="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="Title"
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="title">Description</label>
        <input
          name="description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="Description"
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
          value={price}
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="Price"
        ></input>
      </div>
      <div className="flex flex-col gap-2 text-lg font-bold">
        <label htmlFor="price">Stock</label>
        <input
          name="stock"
          type="number"
          min={1}
          onChange={(e) => {
            setStock(e.target.value);
          }}
          value={stock}
          className={"py-1 px-2 rounded-md border-solid border-2"}
          placeholder="Stock"
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
          {product ? "Editeaza" : "Adauga"}
        </button>
      </div>
    </div>
  );
}
