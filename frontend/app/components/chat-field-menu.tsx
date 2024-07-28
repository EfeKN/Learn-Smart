import React, { useState } from "react";
import backendAPI from "@/environment/backend_api";
import { ChatFieldProps } from "@/app/types";
import UploadChoiceModal from "@/app/components/modals/upload-choice-modal";

const ChatFieldMenu: React.FC<ChatFieldProps> = ({
  selectedChat,
  token,
  setMessages,
  setLastMessageID,
  lastMessageID,
  setIsLoading,
}) => {
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (!input.trim() && !file) return;

    const formData = new FormData();
    formData.append("text", input);
    if (file) formData.append("file", file);

    const newMessage = {
      text: input,
      role: "user",
      message_id: lastMessageID + 1,
      media_url: file ? URL.createObjectURL(file) : null,
    };

    setMessages((messages) => [...messages, newMessage]);
    setInput("");
    setFile(null);
    setIsLoading(true);

    backendAPI
      .post(`/chat/${selectedChat?.chat_id}/send_message`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const modelResponse = {
          text: response.data.text,
          role: response.data.role,
          media_url: response.data.media_url
            ? `http://127.0.0.1:8000/${response.data.media_url}`
            : null,
          message_id: lastMessageID + 2,
        };

        setMessages((messages) => [...messages, modelResponse]);
        setLastMessageID(lastMessageID + 2);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChatUpdated = (updatedChat: any) => {
    setMessages((messages) => [...messages, updatedChat]);
  };

  return (
    <div className="flex items-center gap-2 mt-4 px-4 rounded-full bg-gray-200 dark:bg-token-main-surface-secondary w-2/3 mx-auto">
      <label className="relative flex items-center cursor-pointer" onClick={handleOpenModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </label>
      <textarea
        className="flex-grow border mt-5 rounded-lg bg-transparent text-token-text-primary placeholder-gray-500 border-none focus-visible:outline-none overflow-y-auto resize-none h-12"
        placeholder="Chat with your instructor"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          const textarea = e.target;
          textarea.style.height = "auto";
          textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <button
        className={`${
          !input.trim() && !file
            ? "bg-gray-800 rounded-full text-white flex items-center cursor-not-allowed opacity-50"
            : "bg-gray-800 rounded-full text-white flex items-center"
        }`}
        onClick={handleSendMessage}
        disabled={!input.trim() && !file}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" className="icon-2xl">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <UploadChoiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedChat={selectedChat}
        token={token}
        onChatUpdated={handleChatUpdated}
        onUploadFile={(file) => {
          setFile(file);
        }}
      />
    </div>
  );
};

export default ChatFieldMenu;