import "@/app/style/course-card.css";
import type { CourseCardParameters } from "@/app/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CourseCard(parameters: CourseCardParameters) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const handleHover = () => {
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const handleClick = () => {
    router.push(`/course/${parameters.course.course_id}`);
  };

  return (
    <main>
      <button
        className="course-card flex flex-col items-center p-4 bg-red-500 shadow-lg relative overflow-hidden"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        type="button"
      >
        <div className="bg-white rounded-lg p-2">
          <img
            src={parameters.course.course_icon}
            alt={parameters.course.course_name}
            className="h-16 w-16"
          />
        </div>
        <div className="mt-2 text-white font-semibold">
          {parameters.course.course_name}
        </div>
        <div className={`overlay-content ${hovered ? "active" : ""}`}>
          <div className="overlay-text">{parameters.course.course_name}</div>
        </div>
      </button>
      <div className="mt-2 text-black text-center font-semibold">
        {parameters.course.course_name}
      </div>
    </main>
  );
}
