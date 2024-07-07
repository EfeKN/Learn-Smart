"use client";

import CoursePreview from "@/app/components/course/course-preview";
import Navbar from "@/app/components/navbar";

export default function HomePage() {
  return (
      <main className="bg-transparent min-h-screen">
          <Navbar/>
          <div className="p-5">
              <CoursePreview/>
          </div>
      </main>
  );
}
