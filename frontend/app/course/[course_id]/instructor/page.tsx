"use client";

import LoadingMessage from "@/app/components/loading-message";
import CreateChatModal from "@/app/components/modals/create-chat-modal";
import { Chat, Course, Message } from "@/app/types";
import logo from "@/assets/chatbot-logo.png";
import backendAPI from "@/environment/backend_api";
import Cookies from "js-cookie";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaArrowCircleDown,
  FaPaperPlane,
  FaPlus,
} from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import ReactMarkdown from "react-markdown";

export default function InstructorPage() {
  const [open, setOpen] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");
  const [course, setCourse] = useState<Course | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessageID, setLastMessageID] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  const params = useParams<{ course_id: string }>();
  const course_id = params.course_id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToken(Cookies.get("authToken") || "");
  }, []);

  useEffect(() => {
    if (token) {
      fetchCourse();
      fetchAllChats();
    }
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, clientHeight, scrollHeight } =
          chatContainerRef.current;
        if (scrollTop > 0) {
          // User has scrolled upwards
          setShowScrollButton(true);
        } else {
          // User is at the top of the chat container
          setShowScrollButton(false);
        }
      }
    };

    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener("scroll", handleScroll);
      return () =>
        chatContainerRef.current?.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const fetchChat = (chat_id: string) => {
    return backendAPI.get(`/chat/${chat_id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
  }

  const fetchAllChats = async () => {
    backendAPI.get(`/course/${course_id}/chats`, {
      headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setChats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  };

  const fetchCourse = () => {
    backendAPI
      .get(`/course/${course_id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course:", error);
      });
  };

  const fetchChatMessages = (chat_id: string) => {
    fetchChat(chat_id)
      .then((data) => {
        const chatMessages = data.history.map((msg: Message) => ({
          text: msg.text,
          role: msg.role,
          media_url: msg.media_url ? `http://localhost:8000/${msg.media_url}` : null,
          message_id: msg.message_id,
        }));

        setMessages(chatMessages);
        if (data.history.length > 0) {
          setLastMessageID(
            data.history[data.history.length - 1].message_id
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching chat messages:", error);
      });
  };

  const fetchNewSlide = async (chat_id: string) => {
    backendAPI.get(`/chat/${chat_id}/next_slide`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const modelResponse = {
        text: response.data.text,
        role: "model",
        media_url: `http://127.0.0.1:8000/${response.data.media_url}`, 
        message_id: lastMessageID + 1
      };
  
      setMessages(prevMessages => [...prevMessages, modelResponse]);
      setLastMessageID(lastMessageID + 1);
    })
    .catch(error => {
      console.error("Error fetching chat messages:", error);
    });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const formData = new FormData();
    formData.append("text", input);
    if (file) formData.append("file", file);

    const newMessage = {
      text: input,
      role: "user",
      message_id: lastMessageID + 1,
      media_url: file ? URL.createObjectURL(file) : null
    }

    setMessages(messages => [...messages, newMessage]);
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
          media_url: response.data.media_url ? `http://127.0.0.1:8000/${response.data.media_url}` : null,
          message_id: lastMessageID + 2
        };

        setMessages(messages => [...messages, modelResponse]);
        setLastMessageID(lastMessageID + 2);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChatSelection = async (chat_id: string) => {
    if (chat_id !== selectedChat?.chat_id) {
      const chat = await fetchChat(chat_id);
      setSelectedChat(chat);
      fetchChatMessages(chat.chat_id);
    }
  };

  const handleChatCreated = (newChat: Chat) => {
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
      <div
        className={`bg-gray-900 text-white h-full p-5 pt-8 ${
          open ? "w-60" : "w-20"
        } duration-300 relative`}
      >
        <div
          className={`absolute top-8 right-0 cursor-pointer ${
            open ? "rotate-180" : "rotate-0"
          } transition-transform duration-300`}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <FaAngleLeft className="text-3xl bg-gray-800 rounded-full p-1" />
          ) : (
            <FaAngleRight className="text-3xl bg-gray-800 rounded-full p-1" />
          )}
        </div>
        <div className="inline-flex items-center mb-5">
          <Image
            className="rounded-full mr-3"
            src={logo}
            alt="logo"
            width={40}
            height={40}
          />
          <h1
            className={`origin-left font-medium duration-300 text-2xl ${
              !open && "scale-0"
            }`}
          >
            {course?.course_name || "Loading..."}
          </h1>
        </div>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.chat_id}
              className="p-2 cursor-pointer hover:bg-gray-800 rounded"
              onClick={() => handleChatSelection(chat.chat_id)}
            >
              {chat.chat_title}
            </li>
          ))}
        </ul>

        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
          <button
            className="bg-gray-800 p-2 rounded text-white flex items-center"
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            <FaPlus className="mr-2" />
            Create Chat
          </button>
        </div>
      </div>
      <div className="p-10 flex-grow flex flex-col relative bg-gray-50">
        {selectedChat ? (
          <div className="flex flex-col h-full">
            {selectedChat.slides_mode && (<div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">
                {selectedChat.chat_title}
              </h1>
              <button
                className="bg-gray-800 p-2 rounded text-white"
                onClick={() => fetchNewSlide(selectedChat.chat_id)}
                type="button"
              >
                Next Slide
              </button>
            </div>)}

            <div
              ref={chatContainerRef}
              className="flex-grow mt-5 overflow-y-auto"
            >
              {messages.map((message) => (
                <div
                  key={message.message_id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`p-3 rounded ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    } max-w-xs`}
                  >
                    {message.media_url && (
                      <div className="mb-2">
                        <img
                          src={message.media_url}
                          alt="Uploaded media"
                          className="max-w-xs"
                        />
                      </div>
                    )}
                    {message.role === "model" ? (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    ) : (
                      <div>{message.text}</div>
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
                className="border p-2 rounded-lg w-3/4 mr-2"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="file"
                  accept=".png,.jpeg,.jpg,.pdf,.docx,.pptx"
                  className="hidden"
                  title="Upload a file"
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files && files.length > 0) {
                      setFile(files[0]);
                    }
                  }}
                />
                <MdOutlineFileUpload className="bg-gray-800 p-2 rounded-lg cursor-pointer mr-2 text-5xl text-white" />
              </label>
              <button
                className="bg-gray-800 p-2 rounded text-white flex items-center"
                onClick={handleSendMessage}
              >
                <FaPaperPlane className="mr-2" />
                Send
              </button>
            </div>

            {showScrollButton && (
              <div className="fixed bottom-10 right-10">
                <FaArrowCircleDown
                  className="text-3xl text-black cursor-pointer"
                  onClick={scrollToBottom}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center mt-20">
            <h1 className="text-4xl font-bold">
              Welcome to {course?.course_name || "the Course"}
            </h1>
            <p className="text-xl mt-5">
              Select a chat to start messaging, or create a new one.
            </p>
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
