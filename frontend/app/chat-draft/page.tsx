"use client";

import logo from "@/assets/chatbot-logo.jpg";
import Image from "next/image";
import { useState } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";

interface ChatMessage {
    type: 'user' | 'ai'; // Define message types
    message: string;
  }
  
  const initialChatLog: ChatMessage[] = [
    { type: 'ai', message: "Lorem" },
    { type: 'user', message: "Ipsum" },
    { type: 'ai', message: "Dolor" },
    { type: 'user', message: "Sit" },
    { type: 'ai', message: "Amet" }
  ]; // Initial dummy message

export default function PageHandler() {

    const [open, setOpen] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [chatLog, setChatLog] = useState<ChatMessage[]>(initialChatLog);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setChatLog((prevChatLog) => [...prevChatLog, {type: 'user', message: inputValue}])

        setInputValue('');
    }

    return (
        <div className="flex">
            <div className={`bg-chatbot-color-1 h-screen p-5 pt-8 ${open ? "w-60" : "w-20"} duration-300 relative`}>
                <FaAngleDoubleRight className={`p-1 bg-white text-3xl rounded-full absolute -right-3 top-9 border-2 border-chatbot-color-2 cursor-pointer ${!open ? 'rotate-0 transition duration-500' : 'rotate-180 transition duration-500'}`} onClick={() => setOpen(!open)}/>
                <div className="inline-flex items-center">
                    <Image
                        className="text-4xl rounded-full float-left mr-3"
                        src={logo}
                        alt="logo"
                        width={40}
                        height={40}
                    />
                    <h1 className={`text-white origin-left font-medium duration-300 text-2xl ${!open && "scale-0"}`}>
                        Zikirmatik
                    </h1>
                </div>
            </div>
            <div className="p-10 flex-1">
                <h1 className="text-2xl font-semibold mb-4">Chat Screen</h1>
                <div className="space-y-4 mb-4">
                {
                    chatLog.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-message max-w-xs px-4 py-2 rounded-lg ${message.type === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-300 text-black'}`}
                    >
                        {message.message}
                    </div>
                    ))
                }
                </div>
                <form onSubmit={handleSubmit} className="flex items-center">
                <input
                    type="text"
                    placeholder="Type your message"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
                />
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg">Send</button>
                </form>
            </div>
        </div>
    );
}