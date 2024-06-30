"use client";

import backendAPI from "@/environment/backend_api";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

    if (validateEmail(email) === false) {
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
    <div className="flex flex-col items-center mt-1">
      <h1>Create Account</h1>

      <div className="mb-1">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="ml-1"
          />
        </label>
      </div>

      <div className="mb-1">
        <label>
          Nickname:
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="ml-1"
          />
        </label>
      </div>

      <div className="mb-1">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ml-1"
          />
        </label>
      </div>

      <div className="mb-1">
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ml-1"
          />
        </label>
      </div>

      <button onClick={handleCreateAccount} className="mb-1">
        Create Account
      </button>

      <button onClick={() => router.push("/login")}>Back to Login</button>
    </div>
  );
};

export default CreateAccountPage;
