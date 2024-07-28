"use client";

import { printDebugMessage } from "@/app/debugger";
import { CreateChatModalParameters } from "@/app/types";
import backendAPI from "@/environment/backend_api";
import { useParams } from "next/navigation";
import { useState } from "react";
import LoadingButton from "../loading-button";

export default function CreateChatModal(
  modalParameters: CreateChatModalParameters
) {
  if (!modalParameters.isOpen) {
    return null;
  }

  const params = useParams<{ course_id: string }>();
  const course_id = params.course_id;
  const [file, setFile] = useState<File | null>(null);
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
  const [chat_title, setChat_title] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setIsFileSelected(true);
    }
  };

  const handleUploadSlides = async () => {
    if (!file || !chat_title.trim()) return;

    const formData = new FormData();
    formData.append("slides", file);

    try {
      const response = await backendAPI.post(
        `/chat/create?course_id=${course_id}&chat_title=${chat_title}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${modalParameters.authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      printDebugMessage("chat create response" + response);

      const newChat = response.data.chat;
      modalParameters.onChatCreated(newChat);
      modalParameters.closeModal();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleCreateChat = async () => {
    if (!chat_title.trim()) {
      return;
    }

    try {
      const response = await backendAPI.post(
        `/chat/create`,
        {
          chat_title: chat_title,
          course_id: course_id,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${modalParameters.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      printDebugMessage("chat create response" + response);

      const newChat = response.data.chat;
      modalParameters.onChatCreated(newChat);
      modalParameters.closeModal();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl w-1/2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Chat
          </h2>
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={modalParameters.closeModal}
            type="button"
            title="Close Modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <hr className="mb-4 border-gray-200 w-full" />
        <div className="mb-4">
          <label
            htmlFor="chatTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Chat Title
          </label>
          <input
            type="text"
            id="chatTitle"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter chat title"
            value={chat_title}
            onChange={(event) => setChat_title(event.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <div className="mr-4 p-4 border rounded relative">
            <p className="mb-4">
              If you want, you can upload your course slides and your instructor
              will teach you!
            </p>
            <button className="w-full mb-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 relative">
              {file ? file.name : "Upload Slides..."}
              <input
                type="file"
                accept=".pdf,.pptx"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </button>
            {isFileSelected && (
              <LoadingButton
                handleClick={handleUploadSlides}
                type="submit"
                text="OK"
                loadingText="Creating chat..."
                disabled={!file || !chat_title.trim()} // TODO check this?
                className=""
              />
            )}
          </div>
          <div className="p-4 border rounded">
            <p className="mb-4 cursor-pointer" onClick={handleCreateChat}>
              You can also chat with your LLM instructor too!
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent
              rounded-md hover:bg-gray-200"
            onClick={modalParameters.closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}