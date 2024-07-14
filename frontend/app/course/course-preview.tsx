import React, { useEffect, useState } from "react";
import "@/app/style/course-preview.css";
import CourseCard from "./course-card";
import CreateCourseModal from "@/app/components/modals/create-course-modal";
import CourseHomepage from "@/app/course/[id]/page";
import Cookies from "js-cookie";
import backendAPI from "@/environment/backend_api";

type CourseType = {
  course_id: string;
  course_name: string;
  description: string;
  course_title: string;
  icon: string;
};

export default function CoursePreview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);

  useEffect(() => {
    const storedToken = Cookies.get("authToken");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token]);

  const fetchCourses = async () => {
    try {
      const response = await backendAPI.get(`/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(response.data["courses"]);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleSelectCourse = (course: CourseType) => {
    setSelectedCourseId(course.course_id);
  };

  return (
    <div>
      {selectedCourseId ? (
        <CourseHomepage />
      ) : (
        <div className="flex space-x-4">
          {courses.map((course) => (
            <CourseCard
              key={course.course_id}
              course={course}
              onSelect={handleSelectCourse} // Set selected course on click
            />
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="course-card flex items-center justify-center w-48 h-32 bg-gray-200 shadow-lg text-gray-500 text-lg"
          >
            + Add Course
          </button>
          <div>
            <CreateCourseModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Add New Site"
            />
          </div>
        </div>
      )}
      {selectedCourseId && (
        <button onClick={() => setSelectedCourseId(null)} className="toggle-button">
          Back to Course List
        </button>
      )}
    </div>
  );
}
