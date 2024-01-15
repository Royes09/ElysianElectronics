import { useAuth } from "@/contexts/AuthUserContext";
import Image from "next/image";

import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  removeDoc,
  collection,
} from "firebase/firestore";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

function Product({ product, quantity, removeFromCart, id }) {
  // console.log(product);

  return (
    <div className="flex gap-5">
      <div className="w-1/2 h-full flex items-center justify-center relative">
        <Image
          src={`/assets/products/${product.imagePath[0]}`}
          layout="relative"
          objectFit="cover"
          width={50}
          height={50}
        />
      </div>
      {/* {id} */}
      <p className="w-full h-full text-sm">
        {product.title.length > 30
          ? product.title.substring(0, 30) + "..."
          : product.title}
      </p>
      <div className="flex gap-2 w-full">
        <p className="w-full h-full text-red-400 text-xs">
          {product.price} RON
        </p>
        <p className="w-full h-full text-xs">{quantity}x</p>
        <FontAwesomeIcon
          onClick={() => removeFromCart(id)}
          className="w-10 cursor-pointer flex justify-start items-start self-start text-gray-400"
          icon={faXmark}
          size="md"
        />
      </div>
    </div>
  );
}

export default function Cart({
  isOpen,
  userData,
  removeFromCart,
  setShowModal,
}) {
  const products = userData.cart;

  const [currentProducts, setProducts] = useState([]);
  const [processed, setProcessed] = useState({});

  const [total, setTotal] = useState(0);

  const showProducts = async () => {
    setProducts([]);
    setProcessed({});
    let quantity = 1;
    let totalPrice = 0;
    for (const p of products) {
      let product = await getDoc(p);
      // console.log(product.data());
      totalPrice += parseInt(product.data().price);
      setTotal(totalPrice);
      if (!Object.keys(processed).includes(product.data().title)) {
        currentProducts.push(
          <>
            <Product
              id={product.id}
              product={product.data()}
              quantity={1}
              removeFromCart={removeFromCart}
            />
          </>
        );
        setProducts([...currentProducts]);

        processed[product.data().title] = processed[product.data().title]
          ? processed[product.data().title]++
          : 0;

        setProcessed({ ...processed });
        quantity = 1;
      } else {
        quantity++;
        currentProducts.pop();
        currentProducts.push(
          <Product
            id={product.id}
            product={product.data()}
            quantity={quantity}
            removeFromCart={removeFromCart}
          />
        );
        setProducts([...currentProducts]);
      }
    }
  };

  useEffect(() => {
    showProducts();
    // console.log([...currentProducts]);
  }, [products]);

  return (
    <div
      className={
        !isOpen
          ? "fixed top-14 right-5 w-0 h-1/4 z-20 transition-all duration-300 transform translate-x-full bg-white shadow-lg rounded-lg"
          : "fixed top-14 right-5 w-80 h-1/4 z-20 transition-all duration-300 transform translate-x-0 bg-white shadow-lg rounded-lg"
      }
    >
      <div className="px-6 py-4 w-full h-full text-black flex flex-col">
        <div className="w-full h-full mt-5 mb-5 overflow-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#14ab9d] scrollbar-track-[#111827] flex flex-col gap-5">
          {currentProducts.length == 0
            ? "Nu exista produse adaugate in cos"
            : currentProducts}
        </div>
        <hr></hr>
        <div className="flex justify-between w-full mt-2 items-center">
          <h2>Total: {total} RON</h2>
          {userData.cart.length > 0 ? (
            <button
              onClick={() => setShowModal(true)}
              className="transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-1 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-purple-600 "
            >
              <span>Checkout</span>
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
