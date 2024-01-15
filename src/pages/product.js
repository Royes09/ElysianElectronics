import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthUserContext";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import Navbar from "@/components/navbar";
import Cart from "@/components/cart";
import { toast } from "react-hot-toast";

export default function Product() {
  const router = useRouter();
  const { authUser, db } = useAuth();
  const [userData, setUserData] = useState({
    admin: false,
    email: "",
    cart: [],
    comments: [],
    favorites: [],
  });
  const [products, setProducts] = useState([]);
  const [disabled, setDisabled] = useState([]);
  const [cart, setCart] = useState(false);
  const [product, setProduct] = useState(null);

  const addToCart = async (pId) => {
    const user = doc(db, "users", authUser.email);
    userData["cart"].push(doc(db, "products", pId));

    setUserData({ ...userData });
    await setDoc(user, userData);

    toast.success("Added to cart", { icon: "☠️" });

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

    toast.success("Removed from cart", { icon: "☠️" });
    window.location.reload();
  };

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

  useEffect(() => {
    const productId = router.query.p;
    if (productId) {
      getDoc(doc(db, "products", productId))
        .then((productDoc) => {
          const productData = productDoc.data();
          productData["id"] = productDoc.id;
          setProduct(productData);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
        });
    }
  }, [router.query.p]);

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

  const favorited = userData["favorites"].some((d) => d.id == router.query.p);

  return (
    <main>
      <Navbar userData={userData} setCart={setCart} cart={cart} />
      <Cart isOpen={cart} userData={userData} removeFromCart={removeFromCart} />
      <div className="flex flex-col px-10 py-5 w-screen h-screen gap-5">
        {product ? (
          // Render product details
          <div className="flex w-full h-full gap-5">
            <div className="w-full h-full">
              <img
                src={`/assets/products/${product.imagePath[0]}`}
                alt={product.title}
                className=" w-full object-fill rounded-2xl"
              />
            </div>
            <div className="w-full h-1/2 flex flex-col justify-between">
              <div className="w-full h-full">
                <h1 className="text-xl">{product.title}</h1>
                <h1 className="text-base">{product.description}</h1>
              </div>
              <div className="w-full h-auto flex flex-col">
                {product.stock && product.stock > 0 ? (
                  <div className="flex items-center bg-green-400 text-black font-bold text-xs px-2 py-1 rounded-lg">
                    {product.stock} IN STOCK
                  </div>
                ) : (
                  <div className="flex items-center bg-red-400 text-black font-bold text-xs px-2 py-1 rounded-lg">
                    OUT OF STOCK
                  </div>
                )}
                <div className="text-xl text-white font-semibold mt-1">
                  {product.price} RON
                </div>
                <div className="w-full flex gap-2">
                  <button
                    onClick={() => favorite(router.query.p)}
                    className="transition ease-in duration-300 bg-gray-800  hover:text-purple-500 shadow hover:shadow-md text-gray-500 rounded-full w-8 h-8 text-center p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill={favorited ? "#a855f7" : "none"}
                      viewBox="0 0 24 24"
                      stroke={favorited ? "#a855f7" : "currentColor"}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </button>
                  {product.stock && product.stock > 0 ? (
                    <button
                      onClick={() => addToCart(router.query.p)}
                      className="transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-purple-600 "
                    >
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <button className="cursor-default transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-slate-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full">
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Product Not Found</p>
        )}
      </div>
    </main>
  );
}
