"use client";

import CreateChatModal from "@/app/components/modals/create-chat-modal";
import backendAPI from "@/environment/backend_api";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Chat } from "../../../types";

export default function InstructorPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState<string>("");
  const params = useParams<{ course_id: string }>();
  const course_id = params.course_id;

  useEffect(() => {
    setToken(Cookies.get("authToken") || "");
  }, []);

  useEffect(() => {
    if (token) {
      fetchChats(course_id);
    }
  }, [token]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchChats = async (id: string) => {
    await backendAPI
      .get(`/course/chats/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Map the chat data to the curent chat state
        let chats: Chat[] = response.data.chats.map((chat: any) => ({
          id: chat.chat_id,
          title: chat.title,
        }));

        setChats(chats);
      })
      .catch((error) => {
        console.error("Error fetching chats data:", error);
      });
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
          Instructor Page for Course ID: {course_id || "Loading..."}
        </h2>
      </div>
      <CreateChatModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}
