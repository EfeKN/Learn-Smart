import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import '@/app/style/course-card.css';

type CourseCardProps = {
  course: {
    course_id: string;
    course_name: string;
    description: string;
    course_title: string;
    icon: string;
  };
};

const CourseCard = ({ course }: CourseCardProps) => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const handleHover = () => {
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const handleClick = () => {
    router.push(`/course/${course.course_id}`);
  };

  return (
    <main>
      <button
        className="course-card flex flex-col items-center p-4 bg-red-500 shadow-lg relative overflow-hidden"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        onClick={handleClick}
      >
        <div className="bg-white rounded-lg p-2">
          <img src={course.icon} alt={course.course_name} className="h-16 w-16" />
        </div>
        <div className="mt-2 text-white font-semibold">{course.course_name}</div>
        <div className={`overlay-content ${hovered ? 'active' : ''}`}>
          <div className="overlay-text">
            {course.course_name}
          </div>
        </div>
      </button>
      <div className="mt-2 text-black text-center font-semibold">
        {course.course_name}
      </div>
    </main>
  );
};

export default CourseCard;
