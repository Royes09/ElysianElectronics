import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

// import { auth } from "@/config/firebaseConfig";
import { useAuth } from "@/contexts/AuthUserContext";

import { sendEmailVerification } from "firebase/auth";

import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Login() {
  const router = useRouter();

  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [err, setErr] = useState({ errType: "", errMessage: "" });

  const { createUser, createUserEntry } = useAuth();

  const register = async (e) => {
    e.preventDefault();

    // if (username.length < 3)
    //   return setErr({ errType: "username", errMessage: "Minim 3 caractere." });

    if (email.length == 0)
      return setErr({ errType: "email", errMessage: "Email-ul este necesar" });

    if (password.length == 0)
      return setErr({ errType: "pass", errMessage: "Parola este necesară" });

    if (password != cpassword) {
      return setErr({ errType: "cpass", errMessage: "Parolele nu corespund." });
    }

    // const dataRaw = await fetch("http://localhost:5000/register", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     username: username,
    //     email: email,
    //     password: password,
    //   }),
    //   headers: { "Content-Type": "application/json" },
    // });

    // const data = await dataRaw.json();

    // if (data.success) {
    //   setErr({ errType: "", errMessage: "" });
    //   console.log("Registered");
    //   router.push({
    //     pathname: "/login",
    //     query: { username: username, email: email },
    //   });
    // } else {
    //   setErr({ errType: data.errorType, errMessage: data.message });
    // }
    // fetchSignInMethodsForEmail(auth, email)
    //   .then((res) => {
    //     console.log(res, email);
    //     if (res.length > 0) {
    createUser(email, password)
      .then((authUser) => {
        sendEmailVerification(authUser.user);
        createUserEntry(email);
        setErr({ errType: "", errMessage: "" });
        console.log("Registered");
        router.push({
          pathname: "/login",
          query: { email: email },
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          switch (err.code) {
            case "auth/email-already-in-use":
              setErr({
                errType: "email",
                errMessage: "Email-ul este deja folosit.",
              });
              break;
            case "auth/invalid-email":
              setErr({
                errType: "email",
                errMessage: "Email-ul este invalid.",
              });
              break;
            default:
              setErr({
                errType: "email",
                errMessage: err.code,
              });
              break;
          }
        }
      });
  };

  return (
    <main className="flex flex-col w-full h-screen lg:flex-row">
      <a href="/home" className="absolute px-5 py-5 z-10">
        <FontAwesomeIcon icon={faArrowCircleLeft} color="#dcae64" size="2x" />
      </a>
      <div className="w-full flex h-full items-center justify-center">
        <div className="flex flex-col">
          <div className="bg-[#1F1E27] h-1/6 w-full py-5 flex items-center justify-center rounded-t-xl border-solid border-[#DCAE64] border-2 border-b-0">
            <p className="text-2xl font-bold">Înregistrare</p>
          </div>
          <form className="bg-[#23232D] h-full w-full flex items-start gap-5 flex-col px-10 py-10 border-solid rounded-b-xl border-[#3E321E] border-[1px]">
            <div className="flex flex-col gap-2 text-lg font-bold">
              <label htmlFor="email">Email</label>
              <input
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className={
                  err.errType == "email"
                    ? "py-1 px-2 rounded-md border-solid border-red-500 border-2"
                    : "py-1 px-2 rounded-md border-solid border-[#DCAE64] border-2"
                }
                placeholder="Email"
              ></input>
              {err.errType == "email" ? (
                <p className="w-full whitespace-pre text-red-500">
                  {err.errMessage}
                </p>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col gap-2 text-lg font-bold">
              <label htmlFor="pass">Parolă</label>
              <input
                type="password"
                name="pass"
                onChange={(e) => setPassword(e.target.value)}
                className={
                  err.errType == "pass"
                    ? "py-1 px-2 rounded-md border-solid border-red-500 border-2"
                    : "py-1 px-2 rounded-md border-solid border-[#DCAE64] border-2"
                }
                placeholder="Parolă"
              ></input>
              {err.errType == "pass" ? (
                <p className="w-full whitespace-pre text-red-500">
                  {err.errMessage}
                </p>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col gap-2 text-lg font-bold">
              <label htmlFor="confirmPass">Confirmare parolă</label>
              <input
                type="password"
                name="confirmPass"
                onChange={(e) => setCPassword(e.target.value)}
                className={
                  err.errType == "cpass"
                    ? "py-1 px-2 rounded-md border-solid border-red-500 border-2"
                    : "py-1 px-2 rounded-md border-solid border-[#DCAE64] border-2"
                }
                placeholder="Confirmare parolă"
              ></input>
              {err.errType == "cpass" ? (
                <p className="w-full whitespace-pre text-red-500">
                  {err.errMessage}
                </p>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => register(e)}
                className="transition-all rounded-md font-bold px-2 py-2 bg-[#DCAE64] hover:bg-[#db9729] text-[#1c4747]"
              >
                Înregistrează-te
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold">Ești deja membru?</p>
              <p className="text-lg">
                Te poți autentifica apăsând{" "}
                <Link
                  href="/login"
                  className="transition-all text-[#DCAE64] font-bold hover:text-white py-2"
                >
                  aici
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="lg:flex hidden relative w-full flex h-full p-32 justify-center items-center">
        <Image
          src="/assets/register.svg"
          alt="Login"
          layout="responsive"
          width={0}
          height={0}
          className="min-w-fit min-h-fit"
        />
      </div>
    </main>
  );
}
