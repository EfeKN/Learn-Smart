// Creation Date: 27.06.2024

"use client";

import DOMPurify from "dompurify";
import { marked } from "marked";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const sendPrompt = async () => {
    setResponse("");
    const responseElement = document.getElementById("response");

    const res = await fetch("http://localhost:8000/api/genai/generate_response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    // TODO: Handle errors and rework this part
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value, { stream: true });
      setResponse((prev) => prev + chunkValue);
      const sanitizedHTML = DOMPurify.sanitize(marked(chunkValue));
      responseElement.innerHTML += sanitizedHTML;
    }
  };

  return (
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
      <button onClick={sendPrompt} className="mb-5">
        Generate
      </button>
      <h2>Response:</h2>
      <div
        id="response"
        className="whitespace-pre-wrap border border-gray-300 p-5 mt-5"
      ></div>
    </div>
  );
}
