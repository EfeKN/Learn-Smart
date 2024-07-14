import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { CreateCourseModalParameters } from '../types';
import backendAPI from '@/environment/backend_api';

export default function CreateCourseModal(
  modalProps: CreateCourseModalParameters
) {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [syllabus, setSyllabus] = useState(null);
  const [icon, setIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  const resetFields = () => {
    // reset form fields
    setCourseCode("");
    setCourseName("");
    setCourseDescription("");
    setSyllabus(null);
    setIcon(null);
  }

  useEffect(() => {
    setToken(Cookies.get("authToken") || "");
  }, []);

  function handleFileChange (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>) {
    if (e.target.files && e.target.files.length > 0)
      setter(e.target.files[0]);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("course_name", courseName);
    formData.append("course_code", courseCode);
    formData.append("course_description", courseDescription);
    if (syllabus) formData.append("syllabus_file", syllabus);
    if (icon) formData.append("icon_file", icon);

    await backendAPI
      .post(`/course/create`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
          modalProps.onCourseCreation();
          console.log("Course created successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error creating course:", error);
        alert("Error creating course.");
      });
    resetFields();
    modalProps.onClose();
  };

  const handleCancel = () => {
    resetFields();
    modalProps.onClose();
  };

  if (!modalProps.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">Create Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="courseName">Course Name</label>
            <input
              id="courseName"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="courseCode">Course Code</label>
            <input
              id="courseCode"
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="syllabus">Syllabus (optional)</label>
            <input
              id="syllabus"
              type="file"
              onChange={(e) => handleFileChange(e, setSyllabus)}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="image">Image (optional)</label>
            <input
              id="image"
              type="file"
              onChange={(e) => handleFileChange(e, setIcon)}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}