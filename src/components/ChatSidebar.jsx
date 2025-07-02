import { useState } from "react";
import { Plus, MoreVertical, Archive, Menu } from "lucide-react";
import chatList from "../MockData/chatList.json"
import OptionsModal from "../Pages/Modals/OptionsModal";
import NewChatOverlay from "../Pages/Modals/NewChatOverlay";


const ChatSidebar = ({ onSelectChat }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openOptionModal, setOpenOptionModal] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  const filteredChats = chatList.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) &&
      (activeTab === "All" ||
        (activeTab === "Unread" && chat.unread > 0) ||
        (activeTab === "Favourites" && chat.id === "c3") ||
        (activeTab === "Groups" && chat.name.includes("Job For Fresher")))
  );

  return (
    <>
      <button
        className="md:hidden fixed top-5 left-1 z-50 p-2 bg-gray-700 rounded-full text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-3 h-3" />
      </button>
      <div
        id="allchat"
        className={`h-screen w-full md:w-80 bg-[#1e1e1e] text-white overflow-y-auto border-r border-gray-700 fixed md:sticky top-0 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold sm:ml-0 ml-8">Gupshup</h1>
          <div className="flex items-center space-x-3">
            <Plus
              className="w-5 h-5 cursor-pointer"
              onClick={() => setIsNewChatOpen(true)}
            />
            <MoreVertical
              className="w-5 h-5 cursor-pointer"
              onClick={() => setOpenOptionModal(!openOptionModal)}
            />
            <NewChatOverlay
              isOpen={isNewChatOpen}
              onClose={() => setIsNewChatOpen(false)}
            />
          </div>
          <OptionsModal
            isOpen={openOptionModal}
            onClose={() => setOpenOptionModal(false)}
          />
        </div>
        <div className="px-4 mb-2">
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full rounded-full bg-[#2a2a2a] py-2 px-4 text-sm placeholder-gray-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="px-2 flex space-x-1 mb-4 text-sm flex-wrap gap-y-2">
          {["All", "Unread", "Favourites", "Groups"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-[#2a2a2a] text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2 px-4 text-gray-400 text-sm mb-2">
          <Archive className="w-4 h-4" />
          <span>Archived</span>
        </div>
        <div>
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer relative"
              onClick={() => {
                onSelectChat(chat.id);
                setIsOpen(false);
              }}
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h2 className="font-semibold text-sm">{chat.name}</h2>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {chat.lastMessage.length > 30
                    ? chat.lastMessage.slice(0, 30) + "..."
                    : chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="absolute right-4 bottom-3 bg-green-500 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
