"use client";

import Navbar from "@/app/components/navbar";
import CoursePreview from "@/app/course/course-preview";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    setToken(Cookies.get("authToken") || "");
  }, []);

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar />
      <div className="p-5">
        <CoursePreview />
      </div>
    </main>
  );
}
