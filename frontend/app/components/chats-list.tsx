import { Fragment, useState } from "react";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { FaEdit, FaTrashAlt, FaQuestionCircle } from "react-icons/fa";
import { Chat } from "@/app/types";
import { useRouter } from "next/navigation";

export default function ChatsList({ chats, selectedChat, handleChatSelection }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const router = useRouter();

  const categorizeChats = (chats: Chat[]) => {
    const categories = {
      today: [] as Chat[],
      yesterday: [] as Chat[],
      lastWeek: [] as Chat[],
      other: [] as Chat[],
    };

    const now = new Date();
    chats.forEach((chat) => {
      const chatDate = new Date(chat.created_at);
      const diffTime = now.getTime() - chatDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        categories.today.push(chat);
      } else if (diffDays === 1) {
        categories.yesterday.push(chat);
      } else if (diffDays <= 7) {
        categories.lastWeek.push(chat);
      } else {
        categories.other.push(chat);
      }
    });
    return categories;
  };

  const handleToggleMenu = (chatId) => {
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  const handleRename = (chatId) => {
    console.log("Rename chat:", chatId);
  };

  const handleCreateQuiz = (chatId) => {
    console.log("Create quiz from chat:", chatId);
  };

  const handleDelete = (chatId) => {
    console.log("Delete chat:", chatId);
  };

  return (
    <ul className="flex-grow overflow-y-auto bg-transparent rounded-lg p-4">
      {Object.entries(categorizeChats(chats))
        .filter(([, chats]) => chats.length > 0)
        .map(([category, chats]) => (
          <Fragment key={category}>
            <h2 className="text-xs font-semibold text-gray-400 capitalize p-2">
              {category === "lastWeek" ? "Last Week" : category}
            </h2>
            {chats.map((chat) => (
              <li
                key={chat.chat_id}
                className={`p-2 cursor-pointer rounded-lg mb-2 transition-colors duration-200 ${
                  selectedChat && selectedChat.chat_id === chat.chat_id
                    ? "bg-gray-800"
                    : "hover:bg-gray-800"
                }`}
                onClick={() => handleChatSelection(chat.chat_id)}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-normal text-gray-400">
                    {chat.chat_title}
                  </p>
                  <button
                    className="text-gray-400 text-xl hover:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMenu(chat.chat_id);
                    }}
                  >
                    <IoEllipsisHorizontal />
                  </button>
                </div>
                {openMenuId === chat.chat_id && (
                  <div className="relative z-50">
                    <div className="absolute -right-2 mt-2 w-48">
                      <div className="rounded-lg shadow-xxs ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-700">
                        <div className="flex flex-col gap-2 p-2">
                          <button
                            onClick={() => handleRename(chat.chat_id)}
                            className="flex items-center text-sm font-normal text-gray-400 hover:bg-gray-800 py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                          >
                            <FaEdit className="mr-2 text-gray-400" />
                            Rename
                          </button>
                          <button
                            onClick={() => handleCreateQuiz(chat.chat_id)}
                            className="font-normal flex items-center text-sm text-gray-400 hover:bg-gray-800 py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                          >
                            <FaQuestionCircle className="mr-2 text-gray-400" />
                            Create Quiz
                          </button>
                          <button
                            onClick={() => handleDelete(chat.chat_id)}
                            className="flex items-center text-sm font-normal text-red-500 hover:bg-gray-800 py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                          >
                            <FaTrashAlt className="mr-2 text-red-500" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </Fragment>
        ))}
    </ul>
  );
}
