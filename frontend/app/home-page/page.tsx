"use client";

import Navbar from "@/app/components/navbar";
import CoursePreview from "@/app/components/course/course-preview";

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
