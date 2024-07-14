"use client";

import backendAPI from "@/environment/backend_api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegEnvelope, FaRegUser } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { RiShieldUserLine } from "react-icons/ri";

interface parameterDictionary {
  [key: string]: string;
  name: string;
  nickname: string;
  email: string;
  password: string;
}

export default function CreateAccountPage() {
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const router = useRouter();

  const handleCreateAccount = async () => {
    const validateEmail = (inputText: string) => {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(inputText);
    };

    const validatePassword = (pass: string, passConfirm: string) => {
      return pass === passConfirm;
    };

    const parameterDictionary: parameterDictionary = {
      name: name,
      nickname: nickname,
      email: email,
      password: password,
    };

    for (let key in parameterDictionary) {
      const value: string = parameterDictionary[key];
      if (!value) {
        alert("Please fill in all fields!");
        return;
      }
    }

    if (!validateEmail(email)) {
      alert("Invalid email address");
      return;
    }

    if (!validatePassword(password, confirmPassword)) {
      alert("Two passwords are not the same");
      return;
    }

    await backendAPI
      .post("/users/create", parameterDictionary, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          alert("Account created successfully");
          router.push("/login");
        }
      })
      .catch((error) => {
        console.error("Create account error:", error);
        alert("Account creation failed");
      });
  };

  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-gray-100 min-h-screen">
      <div className="bg-white text-black rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
        <div className="w-3/5 p-5">
          <div className="text-left font-bold mb-3">
            <span className="text-blue-500">Learn</span>Smart
          </div>
          <div className="py-5">
            <h2 className="text-3xl font-bold text-black-500 mb-2">
              Create Account
            </h2>
          </div>
          <div className="border-2 w-10 border-black inline-block mb-2"></div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
              <FaRegEnvelope />
              <input
                type="text"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
              <FaRegUser />
              <input
                type="text"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
              <RiShieldUserLine />
              <input
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
              <MdLockOutline />
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
              <MdLockOutline />
              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
          </div>
          <button
            onClick={handleCreateAccount}
            className="border-2 bg-white border-black text-black rounded-full px-12 py-2 inline-block font-semibold hover:bg-black hover:text-white"
            type="button"
          >
            Create Account
          </button>
        </div>
        <div className="w-2/5 bg-black text-white rounded-tr-2xl rounded-br-2xl flex flex-col items-center justify-center py-28 px-12">
          <h2 className="text-3xl font-bold mb-10">Login</h2>
          <div className="border-2 w-10 border-white inline-block mb-32"></div>
          <button
            onClick={() => router.push("/login")}
            className="border-2 text-white border-white bg-black rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-black"
            type="button"
          >
            Back to Login
          </button>
        </div>
      </div>
    </main>
  );
}
