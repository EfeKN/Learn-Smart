"use client"

import React, { useEffect, useState } from 'react';
import backendAPI from '@/environment/backend_api';
import Cookies from 'js-cookie';
import '@/app/style/course-homepage.css';
import Navbar from '@/app/components/navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const CourseHomepage = ({ params }: { params: any }) => {
  const [course, setCourse] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  
  const router = useRouter();
  const currentPath = router.asPath;

  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    setToken(storedToken || null);
  }, []);

  useEffect(() => {
    if (token) {
      fetchCourseData(params.id);
    }
  }, [token, params.id]);

  const fetchCourseData = async (courseId) => {
    try {
      const response = await backendAPI.get(`/course/${courseId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setCourse(response.data); // Assuming response.data contains the course data
      if (response.data.folders) {
        setFolders(response.data.folders); // Assuming folders data is part of response
      } else {
        setFolders([]); // Initialize folders as an empty array if no folders data is present
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  const handleCreateFolder = () => {
    // Implement logic to create a new folder and update state
    const newFolder = { id: folders.length + 1, name: newFolderName }; // Example new folder structure
    setFolders([...folders, newFolder]);
    setNewFolderName('');
  };

  const handleFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar />
      <div className="course-homepage">
        <h1 className="title">Course Homepage</h1>
        <div className="course-header">
          <h2>{course.course_name}</h2>
        </div>
        <div className="button-grid">
          <button className="button flashcards">Flashcards</button>
          <button className="button quizzes">Quizzes</button>
          <Link href={`${currentPath}/instructor`} className="button instructor">
              Go to your {course.course_name} Instructor (chatbot)
          </Link>
          <button className="button study-plan">Weekly study plan</button>
          <button className="button syllabus">Upload/Update Syllabus</button>
          <div className="folders">
            <h3>My Folders</h3>
            <div className="folder-list">
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <div key={folder.id} className="folder">
                    {folder.name}
                  </div>
                ))
              ) : (
                <div>No folders found.</div>
              )}
            </div>
            <div className="new-folder">
              <input
                type="text"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={handleFolderNameChange}
              />
              <button onClick={handleCreateFolder}>Create Folder</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseHomepage;