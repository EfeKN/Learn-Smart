"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Flashcard } from "../types";

export default function FlashcardsPage() {
  const searchParams = useSearchParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        if (parsedData.flashcards && parsedData.explanations) {
          const combinedFlashcards = parsedData.flashcards.map(
            (topic: string, index: number) => ({
              topic,
              explanation: parsedData.explanations[index] || "", // Provide a fallback in case explanations are missing
            })
          );
          setFlashcards(combinedFlashcards);
        } else {
          console.error("Invalid data structure:", parsedData);
        }
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Flashcards</h1>
      {flashcards.length > 0 ? (
        <ul>
          {flashcards.map((flashcard, index) => (
            <li key={index}>
              <h2>{flashcard.flashcard_topic}</h2>
              <p>{flashcard.flashcard_explanation}</p>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No flashcards available.</p>
      )}
    </div>
  );
}
