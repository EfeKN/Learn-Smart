import React, { useState } from 'react';
import { FaFilePdf, FaRegImages } from 'react-icons/fa6';
import backendAPI from '@/environment/backend_api';
import { UploadChoiceModalProps } from '@/app/types';

const UploadChoiceModal: React.FC<UploadChoiceModalProps> = ({
    isOpen,
    onClose,
    selectedChat,
    token,
    onChatUpdated,
    onUploadFile
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [fileType, setFileType] = useState<'slides' | 'file'>('slides');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
            onUploadFile(file);
        } else {
            setError("Please select a file to upload.");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedChat.chat_title.trim() || !selectedChat.chat_id) return;

        const formData = new FormData();
        formData.append(fileType, selectedFile);

        try {
            const response = await backendAPI.put(
                `/chat/${selectedChat.chat_id}/update_slides`,
                formData,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Chat update response: ", response);

            const updatedChat = response.data;
            onChatUpdated(updatedChat);
            onClose();
        } catch (error) {
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
                console.error("Error response headers:", error.response.headers);
            } else {
                console.error("Error message:", error.message);
            }
        }
    };

     const handleClose = () => {
        if (fileType === 'slides') {
            handleUpload();
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl w-1/2">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-semibold text-gray-900">Upload File</h1>
                    <button
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        onClick={onClose}
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
                <div className="flex space-x-4 mb-4 items-start">
                    <div className="flex flex-col items-center justify-center w-1/2">
                        <h2 className="text-xl font-semibold text-gray-900">Slide Chat Mode</h2>
                        <label
                            htmlFor="slides-upload"
                            className="flex flex-col items-center justify-center w-full h-full p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-100"
                        >
                            <FaFilePdf className="w-12 h-12 mb-2 text-gray-500"/>
                            <p className="text-lg font-semibold text-gray-700">Upload Slides</p>
                            <p className="text-gray-500">PDF, PPTX</p>
                            <input
                                type="file"
                                id="slides-upload"
                                className="hidden"
                                accept=".pdf, .pptx"
                                onChange={handleFileChange}
                                onClick={() => setFileType('slides')}
                            />
                        </label>
                    </div>
                    <div className="flex flex-col items-center justify-center w-1/2">
                        <h2 className="text-xl font-semibold text-gray-900">Upload Images/Documents</h2>
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-full p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-100"
                        >
                            <FaRegImages className="w-12 h-12 mb-2 text-gray-500" />
                            <p className="text-lg font-semibold text-gray-700">Upload File</p>
                            <p className="text-gray-500">Images and Documents</p>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept="image/*,.doc,.docx,.pdf"
                                onChange={handleFileChange}
                                onClick={() => setFileType('file')}
                            />
                        </label>
                    </div>
                </div>
                {selectedFile && (
                    <div className="mt-4">
                        <button
                            onClick={handleClose}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                        >
                            Upload Selected {fileType === 'slides' ? 'Slides' : 'File'}
                        </button>
                    </div>
                )}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default UploadChoiceModal;