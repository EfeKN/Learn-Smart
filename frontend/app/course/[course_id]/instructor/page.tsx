"use client";

import logo from "@/assets/chatbot-logo.jpg";
import Image from "next/image";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, SetStateAction } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import backendAPI from "@/environment/backend_api";
import LoadingMessage from "@/app/components/loading-message";
import CreateChatModal from "@/app/components/modals/create-chat-modal";

export default function InstructorPage() {
  const [open, setOpen] = useState(true);
  const [token, setToken] = useState("");
  const [course, setCourse] = useState<{ course_name: string } | null>(null);
  const [chats, setChats] = useState<{ chat_id: string; title: string }[]>([]);
  const [selectedChat, setSelectedChat] = useState<{ chat_id: string; title: string } | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ message: string; role: string; id: number }[]>([]);
  const [lastMessageID, setLastMessageID] = useState(0); // Used to keep track of the last message ID
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams<{ course_id: string }>();
  const course_id = params.course_id;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToken(Cookies.get("authToken") || "");
  }, []);

  useEffect(() => {
    if (token) {
      fetchCourse();
      fetchChats();
    }
  }, [token]);

  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages(selectedChat.chat_id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await backendAPI.get(`/course/${course_id}/chats`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await backendAPI.get(`/course/${course_id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCourse(response.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const fetchChatMessages = async (chat_id: string) => {
    try {
      const response = await backendAPI.get(`/chat/${chat_id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data.history);
      setLastMessageID(response.data.history[response.data.history.length - 1].id);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return; // Don't send empty messages

    const formData = new FormData();
    formData.append("text", input);
    if (file) formData.append("file", file);

    setMessages(messages => [...messages, { message: input, role: "user", id: lastMessageID + 1 }]);
    setInput("");
    setFile(null);

    setIsLoading(true);
    await backendAPI.post(`/chat/${selectedChat?.chat_id}/send_message`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        setMessages(messages => [...messages, {
          message: response.data.message,
          role: response.data.role,
          id: lastMessageID + 2
        }]);
        setLastMessageID(lastMessageID + 2);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const handleChatSelection = (chat: SetStateAction<{ chat_id: string; title: string; } | null>) => {
    setSelectedChat(chat);
  };

  const handleChatCreated = (newChat) => {
    setChats([...chats, newChat]);
    setSelectedChat(newChat);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex h-screen">
      <div className={`bg-chatbot-color-1 h-full p-5 pt-8 ${open ? "w-60" : "w-20"} duration-300 relative`}>
        <FaAngleDoubleRight
          className={`p-1 bg-white text-3xl rounded-full absolute -right-3 top-9 border-2 border-chatbot-color-2 cursor-pointer ${!open ? 'rotate-0 transition duration-500' : 'rotate-180 transition duration-500'}`}
          onClick={() => setOpen(!open)}
        />
        <div className="inline-flex items-center mb-5">
          <Image
            className="text-4xl rounded-full float-left mr-3"
            src={logo}
            alt="logo"
            width={40}
            height={40}
          />
          <h1 className={`text-white origin-left font-medium duration-300 text-2xl ${!open && "scale-0"}`}>
            {course?.course_name || "Loading..."}
          </h1>
        </div>
        <ul className="text-white">
          {chats.map(chat => (
            <li
              key={chat.chat_id}
              className="p-2 cursor-pointer hover:bg-chatbot-color-2 rounded"
              onClick={() => handleChatSelection(chat)}
            >
              {chat.title}
            </li>
          ))}
        </ul>

        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
          <button
            className="bg-chatbot-color-2 p-2 rounded text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Create Chat
          </button>
        </div>

      </div>
      <div className="p-10 flex-grow flex flex-col">
        {selectedChat ? (
          <div className="flex flex-col h-full">
            <h1 className="text-2xl font-semibold">{selectedChat.title}</h1>
            <div className="flex-grow mt-5 overflow-y-auto">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                  <div className={`p-3 rounded ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} max-w-xs`}>
                    {message.role === "model" ? (
                      <ReactMarkdown>{message.message}</ReactMarkdown>
                    ) : (
                      message.message
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {isLoading && <LoadingMessage />}
            <div className="flex-shrink-0 flex justify-center mt-4">
              <input
                type="text"
                className="border p-2 rounded w-3/4 mr-2"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <input
                type="file"
                accept=".png,.jpeg,.jpg,.pdf,.docx,.pptx"
                className="border p-2 rounded w-1/4 mr-2"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button
                className="bg-chatbot-color-2 p-2 rounded text-white"
                onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <h1 className="text-4xl font-bold">Welcome to {course?.course_name || "the Course"}</h1>
            <p className="text-xl mt-5">Select a chat to start messaging, or create a new one.</p>
          </div>
        )}
      </div>
      <CreateChatModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        authToken={token}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
}
