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
    { type: 'ai', message: "Hi there! How can I help you today?" }
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
            <div className="p-10">
                <h1 className="text-2xl font-semibold">Chat Screen</h1>
                {
                    chatLog.map((message, index) => (
                        <div key="index">{message.message}</div>
                    ))
                }
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Type your message" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
}