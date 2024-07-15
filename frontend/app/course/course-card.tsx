import "@/app/style/course-card.css";
import type { CourseCardParameters } from "@/app/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import dep_logo from "@/assets/dep_logo.png";

export default function CourseCard(parameters: CourseCardParameters) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const image = `http://127.0.0.1:8000/${parameters.course.icon_url}`;
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
            <div className="image-container bg-transparent">
                 {parameters.course.icon_url ? (
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
    </main>
  );
}
