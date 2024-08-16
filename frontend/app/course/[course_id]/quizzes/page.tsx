"use client";

import Navbar from "@/app/components/navbar/navbar";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import backendAPI from "@/environment/backend_api";
import { Course } from "@/app/types";
import QuizCard from "@/app/components/quiz-card";
import { QuizData } from "@/app/types";
import QuizModal from "@/app/components/modals/quiz-modal";

export default function QuizzesPage() {
  const [token, setToken] = useState<string>(
    Cookies.get("authToken") as string
  );
  const [course, setCourse] = useState<Course>({} as Course);
  const [quizzesData, setQuizzesData] = useState<QuizData[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<{ quizName: string; chatTitle: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    setToken(Cookies.get("authToken") || "");
  }, []);

  useEffect(() => {
    fetchCourse();
    fetchQuizzes(); // Fetch quizzes when component mounts
  }, [token]);

  if (token == null) {
    router.replace("/login");
  }

  const params = useParams<{ course_id: string }>();
  const course_id = params.course_id;

  const fetchCourse = () => {
    if (!token || course_id == null || course_id === "") {
      return;
    }

    backendAPI
      .get(`/course/${course_id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course:", error);
      });
  };

  const fetchQuizzes = () => {
    if (!token || course_id == null || course_id === "") {
      return;
    }

    backendAPI
      .get(`/course/${course_id}/quizzes`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setQuizzesData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
      });
  };

  const openQuizModal = (quizName: string, chatTitle: string) => {
    setSelectedQuiz({ quizName, chatTitle });
  };

  const closeQuizModal = () => {
    setSelectedQuiz(null);
  };

  return (
    <main className="bg-transparent min-h-screen text-black">
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="max-w-8xl mx-auto py-6 px-6 text-black">
          <div className="text-left mb-12">
            <h1 className="text-4xl font-bold text-left">
              <span className="font-light">Your quizzes for </span>
              <span className="font-normal text-gray-800">
                {course.course_name}
              </span>
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quizzesData.map((chatData) =>
              chatData.quizzes.map((quiz, index) => (
                <QuizCard
                  key={`${chatData.chat_id}-${index}`}
                  quizName={quiz}
                  chatTitle={chatData.chat_title}
                  onClick={() => openQuizModal(quiz, chatData.chat_title)} // Pass the click handler
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Render the QuizModal */}
      {selectedQuiz && (
        <QuizModal
          isOpen={!!selectedQuiz}
          onClose={closeQuizModal}
          courseID={course_id}
          quizName={selectedQuiz.quizName}
          token={token}
        />
      )}
    </main>
  );
}
