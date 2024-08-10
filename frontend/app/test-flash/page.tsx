"use client";

import React, { useState } from "react";
import axios from "axios";
import backendAPI from "@/environment/backend_api";

const GenerateFlashcards: React.FC = () => {
  const [courseContent, setCourseContent] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  const [flashcards, setFlashcards] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateFlashcards = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("course_flashcard_file_content", courseContent);
      formData.append("course_id", courseId);

      const response = await backendAPI.post(
        "/course/generate_flashcards",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFlashcards(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-h-screen animated-gradient">
      <h2>Generate Flashcards</h2>
      <textarea
        value={courseContent}
        onChange={(e) => setCourseContent(e.target.value)}
        placeholder="Enter course content here..."
      />
      <input
        type="text"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        placeholder="Enter course ID..."
      />
      <button onClick={handleGenerateFlashcards} disabled={loading}>
        {loading ? "Generating..." : "Generate Flashcards"}
      </button>

      {flashcards && (
        <div>
          <h3>Generated Flashcards</h3>
          {/* Render flashcards here */}
          <pre>{JSON.stringify(flashcards, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GenerateFlashcards;
