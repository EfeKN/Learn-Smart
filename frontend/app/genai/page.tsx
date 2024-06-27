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

    const res = await fetch("http://localhost:8000/api/generate", {
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
    <div style={{ padding: "20px" }} /* TODO: Move to CSS */>
      <h1>Ask Gemini</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        cols={50}
        placeholder="Enter your prompt here..."
        style={{ display: "block", marginBottom: "20px" }} // TODO: Move to CSS
      />
      <button
        onClick={sendPrompt}
        style={{ marginBottom: "20px" }} /* TODO: Move to CSS */
      >
        Generate
      </button>
      <h2>Response:</h2>
      <div
        id="response"
        style={{ whiteSpace: "pre-wrap" }} /* TODO: Move to CSS */
      ></div>
    </div>
  );
}
