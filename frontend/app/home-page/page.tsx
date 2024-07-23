"use client";

import Navbar from "@/app/components/navbar";
import CoursePreview from "@/app/course/course-preview";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

export default function HomePage() {
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setToken(Cookies.get("authToken") || null);
  }, []);

  if(token == null) {
      router.replace('/login');
  }

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar />
      <div className="p-5">
        <CoursePreview />
      </div>
    </main>
  );
}
