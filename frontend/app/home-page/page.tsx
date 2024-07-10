"use client";

import Navbar from "@/app/components/navbar";
import CoursePreview from "@/app/course/course-preview";
import Cookies from "js-cookie";

export default function HomePage() {

  const token = Cookies.get("authToken");
  console.log(token);
  
  return (
    <main className="bg-transparent min-h-screen">
      <Navbar />
      <div className="p-5">
        <CoursePreview />
      </div>
    </main>
  );
}
