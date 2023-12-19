import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthUserContext";

import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Recover() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState({ errType: "", errMessage: "" });

  const { sendReset } = useAuth();

  useEffect(() => {
    // console.log(router.query);
    if (router.query.email) {
      setEmail(router.query.email);
      setErr({
        errType: "emailSent",
        errMessage: `${router.query.email}`,
      });
    }
  }, [router.query]);

  const recover = async (e) => {
    e.preventDefault();

    if (email.length == 0)
      return setErr({
        errType: "email",
        errMessage: "Email-ul este necesar",
      });

    sendReset(email)
      .then(() => {
        router.push({ pathname: `/recover`, query: { email: email } });
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
            setErr({ errType: "email", errMessage: "Email invalid" });
            break;
          default:
            setErr({ errType: "email", errMessage: err.code });
        }
      });
  };

  return (
    <main className="flex flex-col w-full h-screen lg:flex-row">
      <a href="/login" className="absolute px-5 py-5 z-10">
        <FontAwesomeIcon icon={faArrowCircleLeft} color="#dcae64" size="2x" />
      </a>
      <div className="z-0 lg:flex hidden relative w-full flex h-full p-32 justify-center items-center">
        <Image
          src="/assets/login.svg"
          alt="Login"
          layout="responsive"
          width={0}
          height={0}
          className="min-w-fit min-h-fit"
        />
      </div>
      <div className="w-full flex h-full items-center justify-center">
        <div className="flex flex-col">
          <div className="bg-[#1F1E27] h-1/6 w-full py-5 flex items-center justify-center rounded-t-xl border-solid border-[#DCAE64] border-2 border-b-0">
            <p className="text-2xl font-bold">Recover password</p>
          </div>
          <form className="bg-[#23232D] h-full w-full flex items-start gap-5 flex-col px-10 py-10 border-solid rounded-b-xl border-[#3E321E] border-[1px]">
            <div className="flex flex-col gap-2 text-lg font-bold">
              {err.errType == "emailSent" ? (
                <div className="rounded-md font-bold px-2 py-2 bg-[#DCAE64]">
                  <p className="break-words text-white">
                    An password reset link was
                  </p>
                  <p>sent to {err.errMessage}</p>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col gap-2 text-lg font-bold">
              <label htmlFor="email">Email</label>
              <input
                name="email"
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className={
                  err.errType == "email"
                    ? "py-1 px-2 rounded-md border-solid border-red-500 border-2"
                    : "py-1 px-2 rounded-md border-solid border-[#DCAE64] border-2"
                }
                placeholder="Email"
                value={email}
              ></input>
              {err.errType == "email" ? (
                <p className="break-words text-red-500">{err.errMessage}</p>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => recover(e)}
                className="transition-all rounded-md font-bold px-2 py-2 bg-[#DCAE64] hover:bg-[#db9729] text-[#1c4747]"
              >
                Recover password
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
