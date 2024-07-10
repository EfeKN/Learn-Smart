import React, { useState } from 'react';
import {useRouter} from "next/navigation";
import '@/app/style/course-card.css';

const CourseCard = ({ site }) => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter()
  const handleHover = () => {
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const handleClick = () => {
    router.push(`/course/${site.id}`);
  };

  return (
    <button
      className="course-card flex flex-col items-center p-4 bg-red-500 shadow-lg relative overflow-hidden"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg p-2">
        <img src={site.icon} alt={site.name} className="h-16 w-16" />
      </div>
      <div className="mt-2 text-white font-semibold">{site.name}</div>
      <div className={`overlay-content ${hovered ? 'active' : ''}`}>
        <div className="overlay-text">
          {site.name}
        </div>
      </div>
    </button>
  );
};

export default CourseCard;
