"use client";

interface CreateChatModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function CreateChatModal(modalProps: CreateChatModalProps) {
  if (!modalProps.isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl w-1/2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Upload Course Slides
          </h2>
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={modalProps.closeModal}
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
        <div className="flex justify-between">
          <div className="mr-4 p-4 border rounded">
            <p className="mb-4">
              If you want, you can upload your course slides and your instructor
              will explain the concepts!
            </p>
            <button
              className="w-full mb-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
              onClick={() => alert("Upload button clicked")}
            >
              Upload Slides...
            </button>
          </div>
          <div className="p-4 border rounded">
            <p className="mb-4">
              You can also chat with your LLM instructor too!
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent
              rounded-md hover:bg-gray-200"
            onClick={modalProps.closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
