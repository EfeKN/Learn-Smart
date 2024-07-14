import { useParams } from "next/navigation";
import React, { useState } from "react";

interface Message {
  id: number;
  content: string;
  sender: string;
}

export default function ChatInterface() {
  const params = useParams<{ chat_id: string }>();
  const chat_id = params.chat_id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage: Message = {
        id: messages.length + 1,
        content: inputValue,
        sender: "user",
      };

      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.sender}: </strong>
            {message.content}
          </div>
        ))}
      </div>
      <div>
        <input
          placeholder="31"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleSendMessage} type="button">
          Send
        </button>
      </div>
    </div>
  );
}
