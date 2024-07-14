"use client";

import Navbar from "@/app/components/navbar";
import "@/app/style/course-homepage.css";
import backendAPI from "@/environment/backend_api";
import Cookies from "js-cookie";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaClipboardList,
  FaUpload,
  FaUserTie,
} from "react-icons/fa";
import { Course, CourseHomepageParameters } from "../../types";

export default function CourseHomepage(parameters: CourseHomepageParameters) {
  const [course, setCourse] = useState<Course>();
  const [token, setToken] = useState<string>("");
  const pathname = usePathname();
  const params = useParams<{ course_id: string }>();
  const course_id = params.course_id;

  useEffect(() => {
    setToken(Cookies.get("authToken") || "");
  }, []);

  useEffect(() => {
    if (token) {
      fetchCourseData(course_id);
    }
  }, [token, course_id]);

  const fetchCourseData = async (course_id: string) => {
    await backendAPI
      .get(`/course/${course_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setCourse(response.data))
      .catch((error) => {
        console.error("Error fetching course data:", error);
      });
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <main className="bg-transparent min-h-screen text-black">
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="max-w-8xl mx-auto py-12 px-6 text-black">
          <div className="text-left mb-12">
            <h1 className="text-5xl font-bold text-left">
              <span className="font-light">Welcome to your </span>
              <span className="font-normal text-gray-800">
                {course.course_name}
              </span>
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center"
              >
                <div className="bg-black p-3 rounded-full mb-4">
                  {i % 5 === 0 && <FaBook className="text-3xl text-white" />}
                  {i % 5 === 1 && (
                    <FaClipboardList className="text-3xl text-white" />
                  )}
                  {i % 5 === 2 && <FaUserTie className="text-3xl text-white" />}
                  {i % 5 === 3 && (
                    <FaCalendarAlt className="text-3xl text-white" />
                  )}
                  {i % 5 === 4 && <FaUpload className="text-3xl text-white" />}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2 text-black">
                    {i % 5 === 0 && "Flashcards"}
                    {i % 5 === 1 && "Quizzes"}
                    {i % 5 === 2 && `Go to ${course.course_name} Instructor`}
                    {i % 5 === 3 && "Weekly study plan"}
                    {i % 5 === 4 && "Upload/Update Syllabus"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {i % 5 === 0 && "Practice with digital flashcards."}
                    {i % 5 === 1 && "Take interactive quizzes."}
                    {i % 5 === 2 &&
                      `Ask ${course.course_name} Instructor through chatbot.`}
                    {i % 5 === 3 && "Plan your study sessions for the week."}
                    {i % 5 === 4 && "Upload or update the course syllabus."}
                  </p>
                  {i % 5 === 2 ? (
                    <a
                      className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-700 transition duration-300 inline-block"
                      href={`${pathname}/instructor`}
                    >
                      Chat
                    </a>
                  ) : (
                    <Link
                      className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-700 transition duration-300 inline-block"
                      href={`/${
                        i % 5 === 0
                          ? "flashcards"
                          : i % 5 === 1
                          ? "quizzes"
                          : i % 5 === 3
                          ? "weekly-study-plan"
                          : i % 5 === 4
                          ? "upload-update-syllabus"
                          : "#"
                      }`}
                    >
                      {i % 5 === 0
                        ? "Flashcards"
                        : i % 5 === 1
                        ? "Quizzes"
                        : i % 5 === 3
                        ? "Weekly Study Plan"
                        : i % 5 === 4
                        ? "Upload/Update Syllabus"
                        : ""}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
