"use client";

import backendAPI from "@/environment/backend_api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateAccountPage: React.FC = () => {
  const [name, setName] = useState<string>(""); // State for name input
  const [password, setPassword] = useState<string>(""); // State for password input

  // Next.js router hook
  const router = useRouter();

  // Function to handle account creation
  // Sends a POST request to the backend to create a new user account
  // Redirects to login page after successful account creation
  //
  const handleCreateAccount = async () => {
    try {
      // Send a POST request to the backend to create a new user account
      const response = await backendAPI.post("/users/create", {
        name,
        password,
      });

      // Check if the response status is 200
      if (response.status === 200) {
        alert("Account created successfully");

        // Redirect to login page after successful account creation
        router.push("/login");
      }
    } catch (error) {
      // Catch any errors and log them to the console
      console.error("Create account error:", error);
      alert("Account creation failed");
    }
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
