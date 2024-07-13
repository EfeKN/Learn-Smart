import CreateCourseModal from "@/app/components/modals/create-course-modal";
import CourseHomepage from "@/app/course/[id]/page";
import "@/app/style/course-preview.css";
import { useState } from "react";
import CourseCard from "./course-card";

export default function CoursePreview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // State to track selected course

  const topSites = [
    {
      id: 1,
      name: "Reddit",
      icon: "https://www.redditinc.com/assets/images/site/reddit-logo.png",
      homepageUrl: "https://www.reddit.com/",
    },
  ];

  const handleSelectCourse = (course: any) => {
    setSelectedCourse(course);
  };

  return (
    <div>
      {selectedCourse ? (
        <CourseHomepage params={selectedCourse} />
      ) : (
        <div className="flex space-x-4">
          {topSites.map((site) => (
            <CourseCard
              key={site.id}
              site={site}
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
            ></CreateCourseModal>
          </div>
        </div>
      )}
      {selectedCourse && (
        <button
          onClick={() => setSelectedCourse(null)}
          className="toggle-button"
          type="button"
        >
          Back to Course List
        </button>
      )}
    </div>
  );
}
