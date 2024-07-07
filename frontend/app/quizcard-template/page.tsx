"use client"

import React, { useState } from 'react';
import './QuizCard.css'; // Assuming you have a separate CSS file for styling

export default function QuizCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-gray-100 min-h-screen">
      <div
        className={`flip-card rounded-lg ${isFlipped ? 'flipped' : ''}`}
        onClick={handleCardFlip}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front bg-gray-200 rounded-lg p-4">
            <p className="title text-xl font-bold">FLIP CARD</p>
            <p>Hover Me</p>
          </div>
          <div className="flip-card-back bg-gray-800 rounded-lg p-4">
            <p className="title text-xl font-bold">BACK</p>
            <p>Leave Me</p>
          </div>
        </div>
      </div>
    </main>
  );
}
