import { useAuth } from "@/contexts/AuthUserContext";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

function SearchBar() {
  return (
    <div className="relative text-lg bg-transparent text-white w-full px-5">
      <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
        <input
          className="bg-transparent border-none mr-3 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Search"
        />
        <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
          <svg
            className="h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 56.966 56.966"
            styles="enable-background:new 0 0 56.966 56.966;"
            xmlSpace="preserve"
            width="512px"
            height="512px"
          >
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Navbar({ userData }) {
  const router = useRouter();
  const { authUser, logOut } = useAuth();

  const [showNav, setShowNav] = useState(false);

  return (
    <nav className="flex justify-between bg-gray-900 text-white w-screen">
      <div className="px-10 py-5 flex w-full items-center justify-between">
        <a
          className="text-3xl font-bold font-heading relative h-full"
          href="/home"
        >
          <Image src="/assets/logo.png" width={400} height={0} />
        </a>
        <SearchBar />
        <div className="flex items-center space-x-5 w-full justify-end relative">
          {authUser ? (
            <>
              <div className="hover:text-gray-200 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <div className="flex items-center hover:text-gray-200 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                <span className="flex absolute -mt-5 ml-4">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
          <div
            onClick={() => setShowNav(!showNav)}
            className="flex items-center hover:text-gray-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hover:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div
            className={
              showNav
                ? "w-48 h-32 absolute right-0 top-8 bg-[#14b8a6] flex flex-col px-5 items-center justify-center gap-5"
                : "hidden"
            }
          >
            {!authUser ? (
              <>
                <a
                  href="/login"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full flex items-center justify-center"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full flex items-center justify-center"
                >
                  Register
                </a>
              </>
            ) : (
              <>
                {userData.admin ? (
                  <a
                    href="/admin"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full flex items-center justify-center"
                  >
                    Admin
                  </a>
                ) : (
                  <></>
                )}
                <button
                  onClick={() => {
                    logOut();
                    router.push({ pathname: "/home" });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full flex items-center justify-center"
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
