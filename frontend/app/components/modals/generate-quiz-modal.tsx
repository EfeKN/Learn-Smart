import React, { useState, useEffect, useRef } from "react";
import QuizMenu from "@/app/quiz/page";
import { GenerateQuizModalParameters } from "../../types";
import backendAPI from "@/environment/backend_api";
import { ToastContainer, toast } from "react-toastify";

const GenerateQuizModal = (modalParameters: GenerateQuizModalParameters) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizData, setQuizData] = useState(null);

    const handleClose = () => {
        setQuizData(null);
        modalParameters.onClose();
    }
  
    const generateQuiz = async (chat_id: string) => {
        await backendAPI.post(
          `/chat/${chat_id}/create_quiz`,
          {},
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${modalParameters.token}`,
              "Content-Type": "application/json",
            },
          }
        ).then((response) => {
            setQuizData(response.data.quiz);
            modalParameters.setQuizName(response.data.filename);
            setIsLoading(false);
        })
        .catch((error) => {
            setError(error);
            setIsLoading(false);
            toast.error("An error occurred while generating the quiz.");
            handleClose();
        });
      };
    
      useEffect(() => {
        if (modalParameters.isOpen) {
          setIsLoading(true);
          generateQuiz(modalParameters.chatID);
        }
      }, [modalParameters.isOpen]);
    
      if (!modalParameters.isOpen) return null;
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden max-h-[90vh] relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              &#10005; {/* This is the Unicode character for an "X" symbol */}
            </button>
            
            {quizData ? (
              <div className="overflow-y-auto max-h-full">
                <QuizMenu quizData={quizData} onClose={handleClose}/>
              </div>
            ) : isLoading ? (
              <div className="p-8 flex items-center justify-center h-full">Preparing a quiz for you...</div>
            ) : (
              <div className="p-8">Error loading quiz data: {error?.message}</div>
            )}
          </div>
        </div>
      );
  };
  
  export default GenerateQuizModal;
