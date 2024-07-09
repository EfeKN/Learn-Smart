"use client";

import Navbar from "@/app/components/navbar";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { useEffect, useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // Retrieve token from localStorage once the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Function to send prompt to the backend and receive a response
  const sendPrompt = async () => {
    setResponse(""); // Clear the response

    // Get the response element
    const responseElement = document.getElementById("response");

    // Check if the response element is available
    if (!responseElement) {
      console.error("Response element not found");
      return;
    }

    // Send a POST request to the backend API
    const res = await fetch("http://localhost:8000/api/genai/send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the authentication token in the request headers
      },
      body: JSON.stringify({ prompt }), // Send the prompt in the request body as JSON
    });

    // Get the response body as a stream and read it
    const reader = res.body?.getReader();

    // Check if the response reader is available
    if (!reader) {
      console.error("Failed to get response reader");
      return;
    }

    // Decode the response stream and update the response element
    const decoder = new TextDecoder();

    // Flag to check if reading is done
    let done = false;

    // Read the response stream and update the response element with the decoded chunks
    // Use DOMPurify to sanitize the HTML content and prevent XSS attacks
    // Use the marked library to render the markdown content
    // Update the response element with the sanitized HTML content
    while (!done) {
      // Read the response stream
      const { value, done: doneReading } = await reader.read();

      // Check if reading is done and update the flag
      done = doneReading;

      // Decode the response value and update the response element
      const chunkValue = decoder.decode(value, { stream: true });

      // Update the response state with the chunk value
      setResponse((prev) => prev + chunkValue);

      // Sanitize the HTML content and render the markdown content
      const sanitizedHTML = DOMPurify.sanitize(marked(chunkValue) as string);

      // Update the response element with the sanitized HTML content
      responseElement.innerHTML += sanitizedHTML;
    }
  };

  return (
    <main>
      <Navbar />
      <div className="p-5">
        <h1>Ask Gemini</h1>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          cols={50}
          placeholder="Enter your prompt here..."
          className="block mb-5"
        />
        <button onClick={sendPrompt} className="mb-5" type="button">
          Generate
        </button>
        <h2>Response:</h2>
        <div
          id="response"
          className="whitespace-pre-wrap border border-gray-300 p-5 mt-5"
        ></div>
      </div>
    </main>
  );
}
