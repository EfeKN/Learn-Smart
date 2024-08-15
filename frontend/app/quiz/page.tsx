"use client";

import { useState } from "react";
import Quiz from "../components/quiz";
import "../styles/quiz.css";

const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    question: "What is the largest country in the world?",
    options: ["Russia", "Canada", "China", "United States"],
    correctAnswer: "Russia",
  },
  {
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Vincent van Gogh",
      "Claude Monet",
    ],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "O2", "H2SO4"],
    correctAnswer: "H2O",
  },
  {
    question:
      "Which gas do plants absorb from the atmosphere during photosynthesis?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Carbon Dioxide",
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "J.K. Rowling", "George Orwell", "Mark Twain"],
    correctAnswer: "Harper Lee",
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Blue Whale", "African Elephant", "Giraffe", "Polar Bear"],
    correctAnswer: "Blue Whale",
  },
  {
    question: "Which gas makes up the majority of Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Nitrogen",
  },
  {
    question: "Who is the author of '1984'?",
    options: [
      "George Orwell",
      "Aldous Huxley",
      "Ray Bradbury",
      "J.R.R. Tolkien",
    ],
    correctAnswer: "George Orwell",
  },
  {
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: "Canberra",
  },
  {
    question: "Which element has the chemical symbol 'Fe'?",
    options: ["Iron", "Gold", "Silver", "Copper"],
    correctAnswer: "Iron",
  },
  {
    question: "Who painted the 'Starry Night'?",
    options: [
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Claude Monet",
    ],
    correctAnswer: "Vincent van Gogh",
  },
  {
    question: "What is the largest organ in the human body?",
    options: ["Liver", "Skin", "Heart", "Lungs"],
    correctAnswer: "Skin",
  },
  {
    question: "Which planet is known as the 'Morning Star' or 'Evening Star'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Venus",
  },
  {
    question: "Who is the current President of the United States? (as of 2021)",
    options: ["Joe Biden", "Donald Trump", "Barack Obama", "George W. Bush"],
    correctAnswer: "Joe Biden",
  },
  {
    question: "What is the currency of Japan?",
    options: ["Yen", "Won", "Yuan", "Dollar"],
    correctAnswer: "Yen",
  },
  {
    question: "Who wrote 'Pride and Prejudice'?",
    options: [
      "Jane Austen",
      "Emily Brontë",
      "Charlotte Brontë",
      "Virginia Woolf",
    ],
    correctAnswer: "Jane Austen",
  },
  {
    question: "What is the boiling point of water in Celsius?",
    options: ["100", "212", "50", "75"],
    correctAnswer: "100",
  },
  {
    question: "Which gas is most abundant in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correctAnswer: "Nitrogen",
  },
  {
    question: "Who is the author of 'The Catcher in the Rye'?",
    options: [
      "J.D. Salinger",
      "F. Scott Fitzgerald",
      "Ernest Hemingway",
      "Mark Twain",
    ],
    correctAnswer: "J.D. Salinger",
  },
  {
    question: "What is the capital of Brazil?",
    options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
    correctAnswer: "Brasília",
  },
  {
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Gold", "Silver", "Iron", "Copper"],
    correctAnswer: "Gold",
  },
  {
    question: "Who painted 'The Persistence of Memory'?",
    options: [
      "Salvador Dali",
      "Pablo Picasso",
      "Vincent van Gogh",
      "Leonardo da Vinci",
    ],
    correctAnswer: "Salvador Dali",
  },
  {
    question: "What is the largest bone in the human body?",
    options: ["Femur", "Humerus", "Tibia", "Fibula"],
    correctAnswer: "Femur",
  },
  {
    question: "Which planet is known as the 'Giant Planet'?",
    options: ["Jupiter", "Mars", "Saturn", "Neptune"],
    correctAnswer: "Jupiter",
  },
  {
    question: "Who is the current Chancellor of Germany? (as of 2021)",
    options: [
      "Angela Merkel",
      "Olaf Scholz",
      "Helmut Kohl",
      "Gerhard Schröder",
    ],
    correctAnswer: "Angela Merkel",
  },
  {
    question: "What is the currency of China?",
    options: ["Yuan", "Yen", "Won", "Rupee"],
    correctAnswer: "Yuan",
  },
  {
    question: "Who wrote 'War and Peace'?",
    options: [
      "Leo Tolstoy",
      "Fyodor Dostoevsky",
      "Anton Chekhov",
      "Ivan Turgenev",
    ],
    correctAnswer: "Leo Tolstoy",
  },
  {
    question: "What is the freezing point of water in Celsius?",
    options: ["0", "-273.15", "100", "25"],
    correctAnswer: "0",
  },
  {
    question: "Which gas is most abundant in Earth's upper atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Oxygen",
  },
];

export default function QuizMenu() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);

  const handleNextQuestion = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
    }
    if (currentQuestionIndex + 1 < quizData.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setQuizEnded(false);
  };

  const goBack = () => {
    restartQuiz();
    // ADD ROUTE BACK HERE
  };

  const getEmote = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) {
      return "🎉";
    } else if (percentage >= 80) {
      return "😊";
    } else if (percentage >= 50) {
      return "😐";
    } else {
      return "😢";
    }
  };

  return (
    <div className="gradient">
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-3/4 bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-left text-gray-800 mb-6">
            QuizApp
          </h1>
          <hr className="border-gray-300 mb-8" />
          {quizEnded ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-lg text-center">
                You scored {correctAnswers} out of {quizData.length}
                <span className="block text-2xl font-medium">
                  {getEmote(correctAnswers, quizData.length)}
                </span>
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={restartQuiz}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  Restart Quiz
                </button>
                <button
                  onClick={goBack}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <Quiz
              question={quizData[currentQuestionIndex].question}
              options={quizData[currentQuestionIndex].options}
              answer={quizData[currentQuestionIndex].correctAnswer}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={quizData.length}
              onNextQuestion={handleNextQuestion}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* 
        {quizData.map((question, index) => (
            <div key={index}>
            <h2>{question.question}</h2>
            <ul>
            {question.options.map((option, optionIndex) => (
                <li key={optionIndex}>{option}</li>
            ))}
            </ul>
            </div>
        ))}
        */
