"use client";

import Navbar from "@/app/components/navbar";
import CoursePreview from "@/app/course/course-preview";

export default function HomePage() {
  return (
    <main className="bg-transparent min-h-screen">
      <Navbar />
      <div className="p-5">
        <CoursePreview />
      </div>
    </main>
  );
}
