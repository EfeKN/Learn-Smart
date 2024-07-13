"use client";

import CreateChatModal from "@/app/components/modals/create-chat-modal";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InstructorPage() {
  const [chats, setChats] = useState<{ id: number; title: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const id = params.id;

  useEffect(() => {
    // Placeholder data for chats
    setChats([
      { id: 1, title: "Chat 1" },
      { id: 2, title: "Chat 2" },
      { id: 3, title: "Chat 3" },
    ]);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex">
      <div className="w-72 border-r-2 border-gray-300 p-4">
        <h2 className="text-2xl">Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>{chat.title}</li>
          ))}
        </ul>
        <button
          onClick={openModal}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          type="button"
        >
          Create Chat
        </button>
      </div>
      <div className="flex-1 p-4">
        <h2 className="text-2xl">
          Instructor Page for Course ID: {id || "Loading..."}
        </h2>
      </div>
      <CreateChatModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}
