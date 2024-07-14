import backendAPI from "@/environment/backend_api";
import FormData from "form-data";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function CreateCourseModal(modalProps: ModalProps) {
  if (!modalProps.isOpen) {
    return null;
  }

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const id = params.id;

  useEffect(() => {
    setToken(Cookies.get("authToken") || null);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validate if all fields are filled
    if (!courseName || !courseCode || !description) {
      setFormError("Please fill out all fields.");
      return;
    }

    const form = new FormData();

    form.append("course_name", courseName);
    form.append("course_code", courseCode);
    form.append("description", description);
    form.append("img_url", null);
    form.append("syllabus_url", null);

    await backendAPI
      .post(`/course/create`, form, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching chats data:", error);
      });

    // Close the modal after submission
    modalProps.onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15 backdrop-blur">
      <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center pb-3 border-b dark:border-gray-600">
          <h2 className="text-xl font-semibold">{modalProps.title}</h2>
          <button
            onClick={modalProps.onClose}
            className="text-gray-500 hover:text-gray-700"
            title="Close Modal"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <label
              htmlFor="courseName"
              className="block mb-2 font-medium text-gray-700"
            >
              Course Name:
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter course name..."
            />

            <label
              htmlFor="courseCode"
              className="block mt-4 mb-2 font-medium text-gray-700"
            >
              Course Code:
            </label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter course code..."
            />

            <label
              htmlFor="description"
              className="block mt-4 mb-2 font-medium text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter description..."
            ></textarea>

            {/* TODO syllabus and image */}

            {formError && (
              <p className="text-red-500 text-sm mt-2">{formError}</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={modalProps.onClose}
              className="px-4 py-2 mr-2 text-sm text-white bg-red-500 rounded hover:bg-red-700"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 ml-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
