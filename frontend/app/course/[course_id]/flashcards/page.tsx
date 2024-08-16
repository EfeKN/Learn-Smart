"use client";

import backendAPI from "@/environment/backend_api";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import FlashCard from "../../../components/flashcard";
import "../../../style/bg-animation.css";

type QuizData = {
  question: string;
  answer: string;
}[];

export default function QuizCard() {
  const initialQuizData: QuizData = [
    {
      question:
        "What is React React React React React React React React React?",
      answer: "A JavaScript library for building user interfaces.",
    },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData);
  const [loading, setLoading] = useState(true);

  const handleNextCard = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCardIndex((currentCardIndex + 1) % quizData.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePreviousCard = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCardIndex(
        (currentCardIndex - 1 + quizData.length) % quizData.length
      );
      setIsTransitioning(false);
    }, 300);
  };

  const generateFlashcards = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      // TODO: COMPLETE THE formData and Delete the placeholder question above
      formData.append(
        "course_flashcard_file_content",
        `
              Course Title: Introduction to Computer Science
              Course ID: CS101
              Instructor: Dr. Jane Doe
              Course Description:
              This course provides an introduction to the fundamental concepts of computer science, including programming, algorithms, and data structures. Students will gain hands-on experience through various projects and assignments.
              Course Objectives:
              1. Understand the basics of programming in Python.
              2. Learn how to design and implement algorithms.
              3. Gain experience with data structures such as lists, stacks, and queues.
              4. Develop problem-solving skills through coding challenges.
              Course Schedule:
              Week 1: Introduction to Python
              Week 2: Control Structures and Functions
              Week 3: Data Structures - Lists and Tuples
              Week 4: Data Structures - Dictionaries and Sets
              Week 5: Algorithms - Sorting and Searching
              Week 6: Midterm Exam
              Week 7: Advanced Topics in Algorithms
              Week 8: Project Development
              Week 9: Project Presentation
              Week 10: Final Exam
              Assessment:
              - Midterm Exam: 30%
              - Final Exam: 40%
              - Project: 30%
              Resources:
              - Textbook: "Introduction to Computer Science" by John Smith
              - Online Tutorials: Codecademy, Coursera
              - Office Hours: Monday and Wednesday, 2-4 PM
            `
      );
      formData.append("course_id", "PLACEHOLDER");

      const response = await backendAPI.post(
        "/course/generate_flashcards",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // TODO: Parsing does not work currently
      const parsedData: QuizData = response.data.data.map((item: any) => ({
        question: item.question,
        answer: item.answer,
      }));

      const mergedData = [...initialQuizData, ...parsedData];

      setQuizData(mergedData);
      setLoading(false);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    generateFlashcards();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-h-screen animated-gradient">
      <div className="flex justify-between w-full items-center">
        <button
          onClick={handlePreviousCard}
          className="text-blue-500 hover:text-blue-600 focus:outline-none"
          title="Previous Card"
          type="button"
        >
          <FaArrowLeft size={24} />
        </button>
        <FlashCard
          question={quizData[currentCardIndex].question}
          answer={quizData[currentCardIndex].answer}
          isTransitioning={isTransitioning}
        />
        <button
          onClick={handleNextCard}
          className="text-blue-500 hover:text-blue-600 focus:outline-none"
          title="Next Card"
          type="button"
        >
          <FaArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
