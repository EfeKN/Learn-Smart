"use client";

import { useState } from "react";
import ReactCardFlip from "react-card-flip";

export default function QuizCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        {/* change vertical with horizontal later if not desired */}
        <div className="w-64 h-40 bg-white shadow-md rounded-lg flex flex-col justify-center items-center p-4">
          <p className="text-center mb-4">This is the front of the card.</p>
          <button
            onClick={handleCardFlip}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Click to flip
          </button>
        </div>

        <div className="w-64 h-40 bg-white shadow-md rounded-lg flex flex-col justify-center items-center p-4">
          <p className="text-center mb-4">This is the back of the card.</p>
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
