"use client";

import { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";

type FlashCardProps = {
  question: string;
  answer: string;
  isTransitioning: boolean;
};

export default function FlashCard({
  question,
  answer,
  isTransitioning,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    if (isTransitioning) {
      setIsFlipped(false);
    }
  }, [isTransitioning]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div
          className={`w-64 min-h-96 overflow-auto bg-white shadow-md rounded-lg flex flex-col justify-center items-center p-4 transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="text-center mb-4 whitespace-normal">{question}</p>
          <button
            onClick={handleCardFlip}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Click to flip
          </button>
        </div>

        <div
          className={`w-64 min-h-96 overflow-auto bg-white shadow-md rounded-lg flex flex-col justify-center items-center p-4 transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="text-center mb-4 whitespace-normal">{answer}</p>
          <button
            onClick={handleCardFlip}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Click to flip
          </button>
        </div>
      </ReactCardFlip>
    </div>
  );
}
