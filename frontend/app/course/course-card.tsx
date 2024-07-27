import "@/app/style/course-card.css";
import type { CourseCardParameters } from "@/app/types";
import dep_logo from "@/assets/dep_logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Course } from "../types";
import CourseCardFloyoutMenu from "./course-card-flyout-menu";

export default function CourseCard(parameters: CourseCardParameters) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<string>("");
  const router = useRouter();
  const courseCardRef = useRef<HTMLDivElement>(null);
  const image = `http://127.0.0.1:8000/${parameters.course.course_icon_url}`;

  const handleHover = () => {
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const handleClick = () => {
    router.push(`/course/${parameters.course.course_id}`);
  };

  function handleClickOutside(event: any) {
    if (
      courseCardRef.current &&
      !courseCardRef.current.contains(event.target)
    ) {
      setCurrentMenu("");
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function renderMenu(course: Course): JSX.Element {
    return (
      <div>
        <button
          type="button"
          className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
        >
          <u>Menu</u>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className={`h-5 w-5 transform transition-transform duration-300 ${
              currentMenu === "menu" ? "rotate-180" : "rotate-0"
            }`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0
                      111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <CourseCardFloyoutMenu
          isOpen={currentMenu === "menu"}
          onClose={() => setCurrentMenu("")}
          course={course}
        />
      </div>
    );
  }

  return (
    <main ref={courseCardRef}>
      <button
        className="course-card flex flex-col items-center p-4 bg-red-500 shadow-lg relative overflow-hidden"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        type="button"
      >
        <div className="image-container bg-transparent">
          {parameters.course.course_icon_url ? (
            <img
              src={image}
              alt={parameters.course.course_name}
              className="course-image"
            />
          ) : (
            <Image
              src={dep_logo}
              alt={parameters.course.course_name}
              className="course-image"
            />
          )}
        </div>
        <div className="mt-2 text-white font-semibold">
          {parameters.course.course_name}
        </div>

        <div className={`overlay-content ${hovered ? "active" : ""}`}>
          <div className="overlay-text">{parameters.course.course_code}</div>
        </div>
      </button>

      <div className="mt-2 text-black text-center font-semibold">
        {parameters.course.course_code}
      </div>

      <div
        onClick={() => {
          setCurrentMenu("menu");
        }}
      >
        {renderMenu(parameters.course)}
      </div>
    </main>
  );
}
