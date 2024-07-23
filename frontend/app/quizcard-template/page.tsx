"use client"

import { useState } from "react";

export default function QuizCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-gray-100 min-h-screen">
      <div
        className={`relative w-52 h-64 perspective-1000 m-5 rounded-lg ${
          isFlipped ? "flipped" : ""
        }`}
        onClick={handleCardFlip}
      >
        <div
          className={`relative w-full h-full text-center transition-transform duration-600 transform-style-3d ${
            isFlipped ? "transform rotate-y-180" : ""
          }`}
        >
          <div className="absolute w-full h-full bg-gray-200 rounded-lg p-4 backface-hidden">
            <p className="text-xl font-bold mt-10">FLIP CARD</p>
            <p>Hover Me</p>
          </div>
          <div className="absolute w-full h-full bg-gray-800 rounded-lg p-4 backface-hidden transform rotate-y-180">
            <p className="text-xl font-bold text-white mt-10">BACK</p>
            <p className="text-white">Leave Me</p>
          </div>
        </div>
      </div>
    </main>
  );
}
