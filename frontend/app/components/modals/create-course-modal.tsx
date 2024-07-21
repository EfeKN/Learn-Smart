import { documentMimeTypes, imageMimeTypes } from "@/app/constants";
import { printDebugMessage } from "@/app/debugger";
import GlobalVariables from "@/app/global-variables";
import { CreateCourseModalParameters } from "@/app/types";
import backendAPI from "@/environment/backend_api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaFilePdf, FaRegImages } from "react-icons/fa6";
import { TbFileTypeDocx } from "react-icons/tb";
import LoadingButton from "../loading-button";

export default function CreateCourseModal(
  modalParameters: CreateCourseModalParameters
) {
  let globalVariables = GlobalVariables.getInstance();

  const [courseName, setCourseName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [syllabus, setSyllabus] = useState<File | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [syllabusError, setSyllabusError] = useState<string>("");
  const [iconError, setIconError] = useState<string>("");
  const [token, setToken] = useState<string>("");

  // reset form fields
  const resetFields = () => {
    setCourseCode("");
    setCourseName("");
    setCourseDescription("");
    setIconError("");
    setSyllabusError("");
    setSyllabus(null);
    setIcon(null);
  };

  useEffect(() => {
    setToken(Cookies.get("authToken") || "");
  }, []);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<any>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    fileType: string
  ) {
    const file = event.target.files && event.target.files[0];

    // Check if file is of correct type for document
    if (
      file &&
      fileType === "document" &&
      documentMimeTypes.includes(file.type)
    ) {
      setter(file);
      setError("");
      printDebugMessage(`Selected file: ${file.name}`);
    }

    // Check if file is of correct type for image
    else if (
      file &&
      fileType === "image" &&
      imageMimeTypes.includes(file.type)
    ) {
      setter(file);
      setError("");
      printDebugMessage(`Selected file: ${file.name}`);
    }

    // Invalid file type for document
    else {
      setter(null);

      // Set error message based on file type
      if (fileType === "document") {
        setError("Invalid file type. Allowed types are: PDF, DOCX");
      } else {
        setError("Invalid file type. Allowed types are: JPG, JPEG, PNG");
      }
    }
  }

  // Handle form submission to create course
  async function handleSubmit(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    // Prevent default form submission
    event.preventDefault();

    // Create the form data object to send to the backend
    const formData = new FormData();
    formData.append("course_name", courseName);
    formData.append("course_code", courseCode);
    formData.append("course_description", courseDescription);
    // append files to form data if they exist
    if (syllabus) formData.append("syllabus_file", syllabus);
    if (icon) formData.append("icon_file", icon);

    // Send the form data to the backend
    await backendAPI
      .post(`/course/create`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Call the onCourseCreation callback to update the course list
        modalParameters.onCourseCreation();

        printDebugMessage("Course created successfully: " + response.data);
      })
      .catch((error) => {
        console.error("Error creating course:", error);
        alert("Error creating course.");
        printDebugMessage("Error creating course: " + error);
      })
      .finally(() => {
        // Reset form fields and close the modal
        handleCancelClose();
      });
  }

  // Function to handle cancel button click
  const handleCancelClose = () => {
    // Reset form fields and close the modal
    resetFields();

    // Call the onClose callback to close the modal
    modalParameters.onClose();
  };

  if (!modalParameters.isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="font-bold mb-4 text-3xl">Create Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="courseName"
            >
              Course Name
            </label>
            <input
              id="courseName"
              type="text"
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="courseCode"
            >
              Course Code
            </label>
            <input
              id="courseCode"
              type="text"
              value={courseCode}
              onChange={(event) => setCourseCode(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={courseDescription}
              onChange={(event) => setCourseDescription(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div className="flex space-x-4 mb-4 items-start">
            <div className="flex flex-col items-center justify-center w-1/2">
              <label
                htmlFor="syllabus"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {syllabus ? (
                    <div>
                      {syllabus.name.endsWith(".pdf") && (
                        <FaFilePdf className="w-16 h-16 mb-4" />
                      )}
                      {syllabus.name.endsWith(".docx") && (
                        <TbFileTypeDocx className="w-16 h-16 mb-4" />
                      )}
                      <p className="text-sm text-gray-500">{syllabus.name}</p>
                    </div>
                  ) : (
                    <div>
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF or DOCX</p>
                    </div>
                  )}
                </div>
                <input
                  id="syllabus"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(event) =>
                    handleFileChange(
                      event,
                      setSyllabus,
                      setSyllabusError,
                      "document"
                    )
                  }
                  className="hidden"
                />
              </label>
              {syllabusError && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  {syllabusError}
                </p>
              )}
              <p className="text-sm text-gray-400 mt-2 text-center">
                You can upload your course syllabus to get personalized weekly
                study plan.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {icon ? (
                    <div>
                      {<FaRegImages className="w-16 h-16 mb-4" />}
                      <p className="text-sm text-gray-500">{icon.name}</p>
                    </div>
                  ) : (
                    <div>
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JPG, JPEG or PNG</p>
                    </div>
                  )}
                </div>
                <input
                  id="image"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(event) =>
                    handleFileChange(event, setIcon, setIconError, "image")
                  }
                  className="hidden"
                />
              </label>
              {iconError && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  {iconError}
                </p>
              )}
              <p className="text-sm text-gray-400 mt-2 text-center">
                You can upload an image for your course.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancelClose}
              className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg mr-2"
            >
              Cancel
            </button>
            <LoadingButton
              handleClick={handleSubmit}
              type="submit"
              text="Create"
              loadingText="Creating course..."
              disabled={!courseName || !courseCode}
              className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
