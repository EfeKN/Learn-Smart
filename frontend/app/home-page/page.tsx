"use client";

import CoursePreview from "@/app/components/course/course-preview";
import Navbar from "@/app/components/navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <div className="p-5">
        <CoursePreview />
      </div>
    </main>
  );
}
