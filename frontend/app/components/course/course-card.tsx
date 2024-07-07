import React, { useState } from 'react';
import '@/app/style/course-card.css';

const CourseCard = ({ site }) => {
  const [hovered, setHovered] = useState(false);

  const handleHover = () => {
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const handleClick = () => {
    // Redirect to the course's homepage when clicked
    window.location = '/course'; // Replace with your actual route
  };

  return (
    <div
      className="course-card flex flex-col items-center p-4 bg-red-500 shadow-lg relative overflow-hidden"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
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

      <button
        className={`absolute top-0 left-0 w-full h-full ${hovered ? 'hidden' : 'block'}`}
        onClick={handleClick}
      >
      </button>
    </div>
  );
};

export default CourseCard;