import React, { useState } from 'react';
import "@/app/style/course-preview.css";
import CourseCard from "./course-card";
import CreateCourseModal from "@/app/components/modals/create-course-modal";
import Id from "@/app/course/[id]/page";

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

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  return (
    <div>
      {selectedCourse ? (
        <Id course={selectedCourse} />
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
          <CreateCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Site">
            <p>This is a modal content.</p>
          </CreateCourseModal>
        </div>
      )}
      {selectedCourse && (
        <button onClick={() => setSelectedCourse(null)} className="toggle-button">
          Back to Course List
        </button>
      )}
    </div>
  );
}