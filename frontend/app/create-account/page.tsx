"use client";

import backendAPI from "@/environment/backend_api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegEnvelope, FaRegUser } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { RiShieldUserLine } from "react-icons/ri"

const CreateAccountPage: React.FC = () => {
  const [name, setName] = useState<string>(""); // State for name input
  const [nickname, setNickname] = useState<string>(""); // State for nickname input
  const [email, setEmail] = useState<string>(""); // State for email input
  const [password, setPassword] = useState<string>(""); // State for password input

  // Next.js router hook
  const router = useRouter();

  // Function to handle account creation
  // Sends a POST request to the backend to create a new user account
  // Redirects to login page after successful account creation
  const handleCreateAccount = async () => {

    /**
     * Validates an email address.
     * @param inputText - The email address to validate.
     * @returns True if the email address is valid, false otherwise.
     */
    function validateEmail(inputText: string) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return inputText.match(regex) !== null; // true if email is valid
    }

    // JSON of parameters to send in POST request to create account
    const parameterDict: { [key: string]: string } = {
      name: name,
      nickname: nickname,
      email: email,
      password: password
    };

    // Check if any fields are empty, reject user if so
    for (let key in parameterDict) {
      let value = parameterDict[key];
      if (!(value.length > 0)) {
        alert("Please fill in all fields!");
        return;
      }
    }

    if (!validateEmail(email)) {
      alert("Invalid email address");
      return;
    } // if regex check fails, reject user

    // Send POST request to create account
    backendAPI.post("/users/create", parameterDict, {
      headers: {
        Accept: "application/json", // The type of response we expect
        "Content-Type": "application/json" // The type of data we are sending
      }
    }).then((response) => {
      if (response.status === 200) { // successful account creation
        alert("Account created successfully");
        router.push("/login");
      }
    }).catch((error) => {
      console.error("Create account error:", error);
      alert("Account creation failed");
    });
  };

  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-gray-100 min-h-screen">
      <div className="bg-white text-black rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
        <div className="w-3/5 p-5">
          <div className="text-left font-bold mb-10">
            <span className="text-black-500">Learn</span>Smart
          </div>
          <div className="py-5">
            <h2 className="text-3xl font-bold text-black-500 mb-2">Create Account</h2>
          </div>
          <div className="border-2 w-10 border-black inline-block mb-2"></div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
              <FaRegEnvelope/>
              <input
                  type="text"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
              <FaRegUser/>
              <input
                  type="text"
                  value={name}
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
              <RiShieldUserLine/>
              <input
                  type="text"
                  placeholder="Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
            <div className="bg-gray-100 w-64 p-2 flex items-center mb-5">
              <MdLockOutline/>
              <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="ml-1 bg-gray-100 outline-none text-sm flex-1"
              />
            </div>
          </div>
          <button
              onClick={handleCreateAccount}
              className="border-2 bg-white border-black text-black rounded-full px-12 py-2 inline-block font-semibold hover:bg-black hover:text-white"
          >
            Create Account
          </button>
        </div>
        <div
            className="w-2/5 bg-black text-white rounded-tr-2xl rounded-br-2xl flex flex-col items-center justify-center py-28 px-12">
          <h2 className="text-3xl font-bold mb-10">Log In</h2>
          <div className="border-2 w-10 border-white inline-block mb-32"></div>
          <button
              onClick={() => router.push("/login")}
              className="border-2 text-white border-white bg-black rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-black"
          >
            Back to Login
          </button>
        </div>
      </div>
    </main>
  );
};

export default CreateAccountPage;
