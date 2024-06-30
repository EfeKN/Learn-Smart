"use client";

import backendAPI from "@/environment/backend_api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = async () => {

    // Form data to log in the user.
    // The backend expects the body in this format (note that the first field is "username" and not "email")
    const formData = {
      "username": email,
      "password": password
    };

    backendAPI.post("/users/login", formData, {
      headers: {
        Accept: "application/json", // The type of response we expect
        "Content-Type": "application/x-www-form-urlencoded", // The type of data we are sending
    }}).then((response) => {
      if (response.status === 200) {
        alert("Login successful");

        const data = response.data;

        // Store the user auth. token in local storage
        localStorage.setItem("token", data["access_token"]);
        localStorage.setItem("permissions", "user"); 

        // Redirect to another page after successful login
        router.push("/genai");
      }
    }).catch((error) => {
      console.error("Login error:", error);
      alert("Login failed");
    })};

  const handleCreateAccount = () => {
    // Redirect to create account page or handle account creation
    router.push("/create-account");
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1>Login</h1>
      <div className="mb-2">
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
