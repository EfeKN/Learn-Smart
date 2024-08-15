import { Chat, ChatsListParameters } from "@/app/types";
import backendAPI from "@/environment/backend_api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaQuestionCircle, FaTrashAlt } from "react-icons/fa";
import { IoCreate, IoEllipsisHorizontal } from "react-icons/io5";
import { MdQuiz } from "react-icons/md";
import { printDebugMessage } from "../debugger";
import ChatRenameModal from "./modals/chat-rename-modal";

export default function ChatsList({
  chats,
  selectedChat,
  handleChatSelection,
  removeChatFromChatList,
  setChats,
  setSelectedChat,
}: ChatsListParameters) {
  const [openMenuId, setOpenMenuId] = useState<string>("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string>(
    Cookies.get("authToken") as string
  );
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

  const handleToggleMenu = (chat_id: string) => {
    setOpenMenuId(openMenuId === chat_id ? "" : chat_id);
  };

  const handleRename = async (chat_id: string, chat_title: string) => {
    return new Promise<void>(async (resolve, reject) => {
      await backendAPI
        .put(
          `/chat/${chat_id}?chat_title=${chat_title}`,
          { chat_title: chat_title },
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          printDebugMessage("Chat renamed:", response.data);

          // Update the chat title in the selected chat and chats list state
          setSelectedChat((prevChat) => {
            if (prevChat.chat_id === chat_id) {
              return { ...prevChat, chat_title };
            }
            return prevChat;
          });
          setChats((prevChats) => {
            return prevChats.map((chat) => {
              if (chat.chat_id === chat_id) {
                return { ...chat, chat_title };
              }
              return chat;
            });
          });
        });
      resolve();
    });
  };

  const handleCreateQuiz = async (chat_id: string) => {
    try {
      const response = await backendAPI.post(
        `/chat/${chat_id}/create_quiz`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateFlashCards = async (chat_id: string) => {
    try {
      const response = await backendAPI.post(
        `/chat/${chat_id}/create_flashcards`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = JSON.stringify(response.data.combined_data);
      const url = `/flashcards?data=${encodeURIComponent(data)}`;
      router.push(url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowFlashCards = (chat_id: string) => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${chat_id}/flashcards`);
  };

  const handleDelete = async (chat_id: string) => {
    printDebugMessage("Deleting chat:", chat_id);

    await backendAPI
      .delete(`/chat/${chat_id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        printDebugMessage("Chat to delete:", response.data);
        handleToggleMenu(chat_id);

        removeChatFromChatList(chat_id);
        setSelectedChat({} as Chat);
      });
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
                    type="button"
                    title="More options"
                  >
                    <IoEllipsisHorizontal />
                  </button>
                </div>
                {openMenuId === chat.chat_id && (
                  <div className="relative z-50">
                    <div className="absolute -right-2 mt-2 w-48">
                      <div className="rounded-lg shadow-xxs ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-700">
                        <div className="flex flex-col gap-2 p-2">
                          <div>
                            <button
                              onClick={() =>
                                setIsRenameModalOpen(!isRenameModalOpen)
                              }
                              type="button"
                              className="flex items-center text-sm font-normal text-gray-400 hover:bg-gray-800 py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                            >
                              <CiEdit className="mr-2 text-gray-400" />
                              Rename
                            </button>
                            <ChatRenameModal
                              isOpen={isRenameModalOpen}
                              closeModal={() => setIsRenameModalOpen(false)}
                              onSubmitted={handleRename}
                              chat_id={chat.chat_id}
                              chat_title={chat.chat_title}
                            />
                          </div>
                          <button
                            onClick={() => handleCreateQuiz(chat.chat_id)}
                            type="button"
                            className="font-normal flex items-center text-sm text-gray-400 hover:bg-gray-800 py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                          >
                            <MdQuiz className="mr-2 text-gray-400" />
                            Create Quiz
                          </button>
                          <button
                            onClick={() => handleCreateFlashCards(chat.chat_id)}
                            type="button"
                            className="font-normal flex items-center text-sm text-gray-400 hover:bg-gray-800 py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                          >
                            <IoCreate className="mr-2 text-gray-400" />
                            Create Flashcards
                          </button>
                          <button
                            onClick={() => handleShowFlashCards(chat.chat_id)}
                            type="button"
                            className="font-normal flex items-center text-sm text-gray-400 hover:bg-gray-800 py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                          >
                            <FaQuestionCircle className="mr-2 text-gray-400" />
                            Show Flashcards
                          </button>
                          <button
                            onClick={() => handleDelete(chat.chat_id)}
                            type="button"
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
