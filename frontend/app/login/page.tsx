"use client";

import backend from "@/environment/backend_environment";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await backend.post("/login", { name, password });
      if (response.status === 200) {
        alert("Login successful");
        // Redirect to another page after successful login
        router.push("/genai");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  const handleCreateAccount = () => {
    // Redirect to create account page or handle account creation
    router.push("/create-account");
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1>Login</h1>
      <div className="mb-2">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="ml-2"
          />
        </label>
      </div>
      <div className="mb-2">
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ml-2"
          />
        </label>
      </div>
      <button onClick={handleLogin} className="mb-2">
        Login
      </button>
      <button onClick={handleCreateAccount}>Create Account</button>
    </div>
  );
};

export default LoginPage;
