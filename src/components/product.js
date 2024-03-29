import { useRouter } from "next/router";

export default function Product({
  pId,
  title,
  price,
  rating,
  image,
  addToCart,
  favorite,
  favorited,
  disabled,
  stock,
}) {
  const router = useRouter();

  return (
    <div className="max-w-md w-full bg-gray-900 shadow-lg rounded-xl p-6">
      <div className="flex flex-col h-full justify-between items-center">
        <div className="flex flex-col justify-between items-center h-full w-full">
          <div className="relative h-62 w-full mb-3 h-full">
            <div className="absolute flex flex-col top-0 right-0 p-3">
              <button
                onClick={() => favorite(pId)}
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
            </div>
            <img
              src={`/assets/products/${image}`}
              alt={title}
              className=" w-full object-fill rounded-2xl"
            />
          </div>
          <div className="flex-auto justify-evenly h-full">
            <div className="flex flex-wrap ">
              <div className="w-full flex-none text-sm flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-500 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="text-gray-400 whitespace-nowrap mr-3">
                  {rating}
                </span>
              </div>
              <div className="flex items-start w-full justify-between min-w-0">
                <h2
                  onClick={() =>
                    router.push({ pathname: "/product", query: { p: pId } })
                  }
                  className="text-lg mr-auto cursor-pointer text-gray-200 hover:text-purple-500 line-clamp-3"
                >
                  {title}
                </h2>
                {stock && stock > 0 ? (
                  <div className="flex items-center bg-green-400 text-black font-bold text-xs px-2 py-1 ml-3 rounded-lg">
                    {stock} IN STOCK
                  </div>
                ) : (
                  <div className="flex items-center bg-red-400 text-black font-bold text-xs px-2 py-1 ml-3 rounded-lg">
                    OUT OF STOCK
                  </div>
                )}
              </div>
            </div>
            <div className="text-xl text-white font-semibold mt-1">
              {price} RON
            </div>

            <div className="flex space-x-2 text-sm font-medium justify-start">
              {!disabled ? (
                <button
                  onClick={() => addToCart(pId)}
                  className="transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-purple-600 "
                >
                  <span>Add to Cart</span>
                </button>
              ) : (
                <button className="cursor-default transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-slate-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full">
                  <span>Add to Cart</span>
                </button>
              )}
              <button
                onClick={() =>
                  router.push({ pathname: "/product", query: { p: pId } })
                }
                className="transition ease-in duration-300 bg-gray-700 hover:bg-gray-800 border hover:border-gray-500 border-gray-700 hover:text-white  hover:shadow-lg text-gray-400 rounded-full w-9 h-9 text-center p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=""
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
