import React, { useState } from 'react';
import "@/app/style/course-preview.css";
import CourseCard from "./course-card"; // Adjust path as necessary
import CreateCourseModal from "../modals/create-course-modal";

export default function CoursePreview() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const topSites = [
    {
      id: 1,
      name: "Reddit",
      icon: "https://www.redditinc.com/assets/images/site/reddit-logo.png",
      homepageUrl: "https://www.reddit.com/",
    },
    // Add other sites similarly
  ];

  return (
    <div className="flex space-x-4">
      {topSites.map((site) => (
        <CourseCard key={site.id} site={site} />
      ))}
      <button
        onClick={() => setIsModalOpen(true)}
        className="course-card flex items-center justify-center w-48 h-32 bg-gray-200 shadow-lg text-gray-500 text-lg"
      >
        + Add Course
      </button>
      <div>
        <CreateCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Site"></CreateCourseModal>
      </div>
    </div>
  );
}
