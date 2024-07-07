import React, { useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

const CreateCourseModal: React.FC<ModalProps> = ({ isOpen, onClose, title}) => {
  if (!isOpen) return null;

  const [courseName, setCourseName] = useState('');
  const [placeHolderInput, setPlaceHolderInput] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate if all fields are filled
    if (!courseName || !placeHolderInput) {
      setFormError('Please fill out all fields.');
      return;
    }

    // TODO: ADD TO DATABASE LOGIC HERE
    console.log('Course Name:', courseName);
    console.log('Placeholder:', placeHolderInput);

    // Close the modal after submission
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15 backdrop-blur">
      <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center pb-3 border-b dark:border-gray-600">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <label htmlFor="courseName" className="block mb-2 font-medium text-gray-700">Course Name:</label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter course name..."
            />

            <label htmlFor="placeHolderInput" className="block mt-4 mb-2 font-medium text-gray-700">Placeholder:</label>
            <input
              type="text"
              id="placeHolderInput"
              name="placeHolderInput"
              value={placeHolderInput}
              onChange={(e) => setPlaceHolderInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Placeholder..."
            />

            {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}

            {/*
            <label htmlFor="courseDescription" className="block mt-4 mb-2 font-medium text-gray-700">Course Description:</label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500"
              placeholder="Enter course description..."
            ></textarea>
            */}
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
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
};

export default CreateCourseModal;
