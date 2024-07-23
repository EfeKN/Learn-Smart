"use client";

import LoadingMessage from "@/app/components/loading-message";
import CreateChatModal from "@/app/components/modals/create-chat-modal";
import {Chat, Course, Message} from "@/app/types";
import logo from "@/assets/chatbot-logo.png";
import backendAPI from "@/environment/backend_api";
import Cookies from "js-cookie";
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {
    FaArrowCircleDown,
    FaCalendarAlt
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import {GiBookmarklet, GiSpellBook} from "react-icons/gi";
import "@/app/style/logo-font.css";

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
    const router = useRouter();

    const params = useParams<{ course_id: string }>();
    const course_id = params.course_id;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setToken(Cookies.get("authToken") || null);
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
                const {scrollTop, clientHeight, scrollHeight} =
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

    if (token == null) {
        router.replace('/login');
    }

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
            messagesEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    };

    return (
        <div className="flex h-screen">
            <div
                className={`text-gray-400 h-full p-2 pt-8 ${open ? "w-60 bg-[#181414]" : "w-20 bg-transparent"} duration-300 relative`}
            >
                <div className="flex justify-between items-center mb-5 text-gray-400">
                    <button
                        className="h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary"
                        onClick={() => setOpen(!open)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"
                             className="icon-xl-heavy">
                            <path fill="currentColor" fillRule="evenodd"
                                  d="M8.857 3h6.286c1.084 0 1.958 0 2.666.058.729.06 1.369.185 1.961.487a5 5 0 0 1 2.185 2.185c.302.592.428 1.233.487 1.961.058.708.058 1.582.058 2.666v3.286c0 1.084 0 1.958-.058 2.666-.06.729-.185 1.369-.487 1.961a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C17.1 21 16.227 21 15.143 21H8.857c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.232-.487-1.961C1.5 15.6 1.5 14.727 1.5 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.728.185-1.369.487-1.96A5 5 0 0 1 4.23 3.544c.592-.302 1.233-.428 1.961-.487C6.9 3 7.773 3 8.857 3M6.354 5.051c-.605.05-.953.142-1.216.276a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216-.05.617-.051 1.41-.051 2.546v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h.6V5h-.6c-1.137 0-1.929 0-2.546.051M11.5 5v14h3.6c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.134-.263.226-.611.276-1.216.05-.617.051-1.41.051-2.546v-3.2c0-1.137 0-1.929-.051-2.546-.05-.605-.142-.953-.276-1.216a3 3 0 0 0-1.311-1.311c-.263-.134-.611-.226-1.216-.276C17.029 5.001 16.236 5 15.1 5zM5 8.5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1M5 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1"
                                  clipRule="evenodd"></path>
                        </svg>
                    </button>
                    <button
                        className="h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                             viewBox="0 0 24 24"
                             className="icon-xl-heavy">
                            <path
                                d="M15.673 3.913a3.121 3.121 0 1 1 4.414 4.414l-5.937 5.937a5 5 0 0 1-2.828 1.415l-2.18.31a1 1 0 0 1-1.132-1.13l.311-2.18A5 5 0 0 1 9.736 9.85zm3 1.414a1.12 1.12 0 0 0-1.586 0l-5.937 5.937a3 3 0 0 0-.849 1.697l-.123.86.86-.122a3 3 0 0 0 1.698-.849l5.937-5.937a1.12 1.12 0 0 0 0-1.586M11 4A1 1 0 0 1 10 5c-.998 0-1.702.008-2.253.06-.54.052-.862.141-1.109.267a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216C5.001 8.471 5 9.264 5 10.4v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h3.2c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.126-.247.215-.569.266-1.108.053-.552.06-1.256.06-2.255a1 1 0 1 1 2 .002c0 .978-.006 1.78-.069 2.442-.064.673-.192 1.27-.475 1.827a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C15.6 21 14.727 21 13.643 21h-3.286c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.233-.487-1.961C3 15.6 3 14.727 3 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.729.185-1.369.487-1.961A5 5 0 0 1 5.73 3.545c.556-.284 1.154-.411 1.827-.475C8.22 3.007 9.021 3 10 3A1 1 0 0 1 11 4"></path>
                        </svg>
                    </button>
                </div>

                {open && (
                    <div>
                        <div className="inline-flex items-center mb-5">
                            <Image className="rounded-full mr-3" src={logo} alt="logo" width={40} height={40}/>
                            <h1 className="origin-left font-medium duration-300 text-2xl">{course?.course_name || "Loading..."}</h1>
                        </div>
                        <ul>
                            {chats.map((chat) => (
                                <li
                                    key={chat.chat_id}
                                    className="p-2 cursor-pointer hover:bg-gray-900 rounded"
                                    onClick={() => handleChatSelection(chat.chat_id)}
                                >
                                    {chat.chat_title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="p-10 flex-grow flex flex-col relative bg-transparent">
                {selectedChat ? (
                    <div className="flex flex-col h-full">
                        {selectedChat.slides_mode && (
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-2xl font-semibold">{selectedChat.chat_title}</h1>
                                <button
                                    className="bg-gray-800 p-2 rounded text-white"
                                    onClick={() => fetchNewSlide(selectedChat.chat_id)}
                                    type="button"
                                >
                                    Next Slide
                                </button>
                            </div>
                        )}

                        <div ref={chatContainerRef} className="flex-grow mt-5 overflow-y-auto">
                            {messages.map((message) => (
                                <div
                                    key={message.message_id}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}
                                >
                                    <div
                                        className={`p-3 rounded ${
                                            message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                                        } max-w-xs`}
                                    >
                                        {message.media_url && (
                                            <div className="mb-2">
                                                <img src={message.media_url} alt="Uploaded media" className="max-w-xs"/>
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

                            <div ref={messagesEndRef}/>
                        </div>
                        {isLoading && <LoadingMessage/>}
                        <div
                            className="flex items-center gap-2 mt-4 px-4 rounded-[26px] bg-gray-200 dark:bg-token-main-surface-secondary w-2/3 mx-auto">
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path fill="currentColor" fill-rule="evenodd"
                                          d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </label>
                            <textarea
                                className="flex-grow border py-1 mt-5 rounded-lg bg-transparent text-token-text-primary placeholder-gray-500
                      border-none focus-visible:outline-none overflow-y-auto resize-none h-14"
                                placeholder="Chat with your instructor"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    const textarea = e.target;
                                    textarea.style.height = 'auto';
                                    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <button
                                className={`${!input.trim() ? "bg-gray-800 rounded-full text-white flex items-center " +
                                    "cursor-not-allowed opacity-50" : "bg-gray-800 rounded-full text-white flex items-center"
                                }`}
                                onClick={handleSendMessage}
                                disabled={!input.trim()} // Disable button if input is empty or just whitespace
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"
                                     viewBox="0 0 32 32"
                                     className="icon-2xl">
                                    <path fill="currentColor" fillRule="evenodd"
                                          d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>

                        {showScrollButton && (
                            <div className="fixed bottom-10 right-10">
                                <FaArrowCircleDown className="text-3xl text-black cursor-pointer"
                                                   onClick={scrollToBottom}/>
                            </div>
                        )}
                    </div>
                ) : (
                    // TO-DO WRITE LINKS HERE IT WON'T HAVE THE SAME LINKS AS BEFORE WE NEED TO PASS ARGUMENTS
                    <div className="text-center mt-20">
                        <div className="inline-flex gap-0">
                            <h1 className="text-8xl font-bold"
                                style={{fontFamily: 'logo-font, serif', color: "rgb(23,144, 288)", letterSpacing: '0.025em'}}>
                                learn
                            </h1>
                            <h1 className="text-8xl font-bold"
                                style={{fontFamily: 'logo-font, serif', color: "black", letterSpacing: '0.025em'}}>
                                smart
                            </h1>
                        </div>
                        <p className="text-xl mt-5">Welcome to {course?.course_name || "the Course"}</p>
                        <div className="mx-3 mt-12 flex flex-col items-center justify-center gap-4">
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <button
                                    className="relative flex w-40 flex-col gap-2 rounded-2xl border border-token-border-light px-3 pb-4 pt-3 text-start align-top text-[15px] shadow-xxs transition enabled:hover:bg-token-main-surface-secondary disabled:cursor-not-allowed bg-gray-300">
                                    <GiSpellBook className="text-2xl" style={{color: "rgb(44, 84, 102)"}}/>
                                    <div
                                        className="line-clamp-3 max-w-full text-balance text-gray-600 dark:text-gray-500 break-word">Create
                                        Quiz for {course?.course_name || "the Course"}
                                    </div>
                                </button>
                                <button
                                    className="relative flex w-40 flex-col gap-2 rounded-2xl border border-token-border-light px-3 pb-4 pt-3 text-start align-top text-[15px] shadow-xxs transition enabled:hover:bg-token-main-surface-secondary disabled:cursor-not-allowed bg-gray-300">
                                    <GiBookmarklet className="text-2xl" style={{color: "rgb(118, 208, 235)"}}/>
                                    <div
                                        className="line-clamp-3 max-w-full text-balance text-gray-600 dark:text-gray-500 break-word">Flashcard
                                        for {course?.course_name || "the Course"}
                                    </div>
                                </button>
                                <button
                                    className="relative flex w-40 flex-col gap-2 rounded-2xl border border-token-border-light px-3 pb-4 pt-3 text-start align-top text-[15px] shadow-xxs transition enabled:hover:bg-token-main-surface-secondary disabled:cursor-not-allowed bg-gray-300">
                                    <FaCalendarAlt className="text-2xl" style={{color: "rgb(203, 139, 208)"}}/>
                                    <div
                                        className="line-clamp-3 max-w-full text-balance text-gray-600 dark:text-gray-500 break-word">Weekly
                                        Study Plan of {course?.course_name || "the Course"}
                                    </div>
                                </button>
                            </div>
                        </div>
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
