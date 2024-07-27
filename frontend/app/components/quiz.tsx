"use client";

import React, { useState } from "react";

interface QuizProps {
  question: string;
  options: string[];
  answer: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  onNextQuestion: (isCorrect: boolean) => void;
}

const Quiz = ({
  question,
  options,
  answer,
  currentQuestionIndex,
  totalQuestions,
  onNextQuestion,
}: QuizProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsAnswered(true);
  };

  const checkAnswer = () => {
    return selectedOption === answer;
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleNextQuestion = () => {
    resetQuiz();
    onNextQuestion(checkAnswer());
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <p className="text-lg font-medium mb-2">
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </p>
      <p className="text-lg font-medium mb-2">Question: {question}</p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`w-full px-4 py-2 rounded ${
              isAnswered && selectedOption === option
                ? checkAnswer()
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          className={`px-4 py-2 rounded ${
            isAnswered
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default Quiz;

/*
      {isAnswered && (
        <p
          className={`mt-4 ${
            checkAnswer() ? "text-green-500" : "text-red-500"
          }`}
        >
          Your answer is {checkAnswer() ? "correct" : "incorrect"}
        </p>
      )}
*/
