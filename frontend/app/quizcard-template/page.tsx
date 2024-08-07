"use client";

import { useState } from "react";
import FlashCard from "../components/flashcard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../style/bg-animation.css";

type QuizData = {
  question: string;
  answer: string;
}[];

export default function QuizCard() {
  const quizData: QuizData = [
    {
      question:
        "What is React React React React React React React React React?",
      answer: "A JavaScript library for building user interfaces.",
    },
    {
      question: "What is TypeScript?",
      answer:
        "A statically typed superset of JavaScript that compiles to plain JavaScript.",
    },
    {
      question: "What is JSX?",
      answer:
        "A syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.",
    },
    {
      question: "What is a component in React?",
      answer:
        "A reusable piece of code that represents a part of the user interface.",
    },
    {
      question: "What is state in React?",
      answer:
        "An object that represents the internal data of a component and can be changed over time.",
    },
    {
      question: "What is props in React?",
      answer:
        "A way to pass data from a parent component to a child component.",
    },
    {
      question: "What is a hook in React?",
      answer:
        "A function that allows you to use state and other React features without writing a class.",
    },
    {
      question: "What is the virtual DOM in React?",
      answer:
        "A representation of the user interface in memory that React uses to optimize updates to the actual DOM.",
    },
    {
      question:
        "What is the difference between a functional component and a class component in React?",
      answer:
        "A functional component is a stateless component that is defined as a JavaScript function, while a class component is a stateful component that is defined as a JavaScript class.",
    },
    {
      question: "What is the purpose of the `key` prop in React?",
      answer:
        "The `key` prop is used to uniquely identify each element in a list of elements, allowing React to optimize updates to the list.",
    },
    {
      question:
        "What is the difference between a controlled component and an uncontrolled component in React?",
      answer:
        "A controlled component is a component that is controlled by React, while an uncontrolled component is a component that is controlled by the DOM.",
    },
    {
      question: "What is the purpose of the `useEffect` hook in React?",
      answer:
        "The `useEffect` hook allows you to perform side effects in functional components, such as fetching data from an API or updating the document title.",
    },
    {
      question: "What is the purpose of the `useState` hook in React?",
      answer:
        "The `useState` hook allows you to add state to functional components.",
    },
    {
      question: "What is the purpose of the `useContext` hook in React?",
      answer:
        "The `useContext` hook allows you to access the value of a context from a functional component.",
    },
    {
      question: "What is the purpose of the `useReducer` hook in React?",
      answer:
        "The `useReducer` hook allows you to manage complex state logic in functional components.",
    },
    {
      question: "What is the purpose of the `useCallback` hook in React?",
      answer:
        "The `useCallback` hook allows you to memoize a function, preventing it from being recreated on every render.",
    },
    {
      question: "What is the purpose of the `useMemo` hook in React?",
      answer:
        "The `useMemo` hook allows you to memoize the result of a function, preventing it from being recalculated on every render.",
    },
    {
      question: "What is the purpose of the `useRef` hook in React?",
      answer:
        "The `useRef` hook allows you to create a mutable reference to a value that persists across renders.",
    },
    {
      question:
        "What is the purpose of the `useImperativeHandle` hook in React?",
      answer:
        "The `useImperativeHandle` hook allows you to customize the instance value that is exposed to parent components when using `ref`.",
    },
    {
      question: "What is the purpose of the `useLayoutEffect` hook in React?",
      answer:
        "The `useLayoutEffect` hook allows you to perform synchronous side effects in functional components, such as measuring the size of a DOM element.",
    },
    {
      question: "What is the purpose of the `useDebugValue` hook in React?",
      answer:
        "The `useDebugValue` hook allows you to display a label for custom hooks in React DevTools.",
    },
    {
      question:
        "What is the purpose of the `React.memo` higher-order component?",
      answer:
        "The `React.memo` higher-order component allows you to memoize a functional component, preventing it from being re-rendered unless its props have changed.",
    },
    {
      question: "What is the purpose of the `React.lazy` function?",
      answer:
        "The `React.lazy` function allows you to lazily load a component, only loading it when it is first rendered.",
    },
    {
      question: "What is the purpose of the `React.Suspense` component?",
      answer:
        "The `React.Suspense` component allows you to display a fallback UI while a lazy-loaded component is being fetched.",
    },
    {
      question: "What is the purpose of the `React.Fragment` component?",
      answer:
        "The `React.Fragment` component allows you to group multiple elements without adding an extra node to the DOM.",
    },
    {
      question: "What is the purpose of the `React.Portal` component?",
      answer:
        "The `React.Portal` component allows you to render a component into a DOM node that exists outside the DOM hierarchy of the parent component.",
    },
    {
      question: "What is the purpose of the `React.StrictMode` component?",
      answer:
        "The `React.StrictMode` component allows you to highlight potential problems in your application, such as deprecated lifecycle methods or unsafe lifecycle patterns.",
    },
    {
      question: "What is the purpose of the `React.Profiler` component?",
      answer:
        "The `React.Profiler` component allows you to measure the performance of your application, providing insights into which components are rendering frequently and taking a long time to render.",
    },
    {
      question: "What is the purpose of the `React.Context` API?",
      answer:
        "The `React.Context` API allows you to share data between components without having to pass props through every level of the component tree.",
    },
    {
      question: "What is the purpose of the `React.forwardRef` function?",
      answer:
        "The `React.forwardRef` function allows you to forward a ref from a parent component to a child component.",
    },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-h-screen animated-gradient">
      <div className="flex justify-between w-full items-center">
        <button
          onClick={handlePreviousCard}
          className="text-blue-500 hover:text-blue-600 focus:outline-none"
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
        >
          <FaArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
