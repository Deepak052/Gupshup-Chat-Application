import { useEffect, useState, useRef } from "react";
import { Video, Search, MoreVertical, Plus, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import messagesData from "../MockData/messages.json";
import chatList from "../MockData/chatList.json";
import ChatOptionsModal from "../Pages/Modals/ChatOptionsModal";
import AttachmentMenu from "../Pages/Modals/AttachmentMenu";

const ChatWindow = ({ chatId, onAvatarClick }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isChatOptionOpen, setIsChatOptionOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const selectedChat = chatList.find((chat) => chat.id === chatId);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      const storedMessages = localStorage.getItem(`chat_${chatId}_messages`);
      const msgs = storedMessages
        ? JSON.parse(storedMessages)
        : messagesData[chatId] || [];
      setMessages(msgs);
      setFilteredMessages(msgs);
    } else {
      setMessages([]);
      setFilteredMessages([]);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      localStorage.setItem(`chat_${chatId}_messages`, JSON.stringify(messages));
    }
  }, [chatId, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return alert("Please enter a message!");

    const newMsg = {
      id: `m${messages.length + 1}`,
      type: "sent",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setFilteredMessages(updatedMessages);
    setNewMessage("");
  };

  const handleIconClick = (feature) => {
    alert(`${feature} feature coming soon!`);
    navigate("/under-construction");
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredMessages(messages);
    } else {
      const results = messages.filter((msg) =>
        msg.text.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMessages(results);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredMessages(messages);
    setIsSearching(false);
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center relative">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#202c33] p-3 text-white">
        <div className="flex items-center space-x-3">
          <img
            src={
              selectedChat?.avatar ||
              "https://randomuser.me/api/portraits/women/45.jpg"
            }
            alt={selectedChat?.name || "Chat"}
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={onAvatarClick}
          />
          <span className="font-semibold text-sm sm:text-base">
            {selectedChat?.name || "Select a chat"}
          </span>
        </div>
        <div className="flex space-x-4">
          <Video
            className="w-5 h-5 cursor-pointer"
            onClick={() => handleIconClick("Video Call")}
          />
          <Search
            className="w-5 h-5 cursor-pointer"
            onClick={() => setIsSearching(!isSearching)}
          />
          <MoreVertical
            className="w-5 h-5 cursor-pointer"
            onClick={() => setIsChatOptionOpen(!isChatOptionOpen)}
          />
        </div>
        <ChatOptionsModal
          isOpen={isChatOptionOpen}
          onClose={() => setIsChatOptionOpen(false)}
          chatId={chatId}
        />
      </div>

      {/* Search Bar */}
      {isSearching && (
        <div className="bg-[#111b21] p-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search messages"
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 px-3 py-1 rounded-md text-sm bg-[#2a3942] text-white focus:outline-none"
            autoFocus
          />
          <X
            className="w-4 h-4 text-gray-400 cursor-pointer"
            onClick={clearSearch}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
        {chatId ? (
          filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => {
              if (msg.type === "date") {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="bg-[#1f2c33] text-gray-300 text-xs px-3 py-1 rounded-md">
                      {msg.text}
                    </span>
                  </div>
                );
              }
              const isSent = msg.type === "sent";
              const alignment = isSent ? "justify-end" : "justify-start";
              const bubbleColor = isSent ? "bg-[#005c4b]" : "bg-[#2a2f32]";
              const textColor = isSent ? "text-white" : "text-gray-100";
              return (
                <div key={msg.id} className={`flex ${alignment}`}>
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] ${bubbleColor} ${textColor} rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm relative whitespace-pre-line`}
                  >
                    {msg.text}
                    <div className="text-[8px] sm:text-[10px] text-gray-300 text-right mt-1">
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400 text-sm">
              No messages found.
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400 text-sm">
            Select a chat to start messaging
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {chatId && (
        <div className="flex items-center bg-[#202c33] p-2 sm:p-3 gap-2 sm:gap-3">
          <Plus
            className="w-4 sm:w-5 h-4 sm:h-5 text-white cursor-pointer"
            onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
          />
          <AttachmentMenu
            isOpen={isAttachmentOpen}
            onClose={() => setIsAttachmentOpen(false)}
            onOptionClick={(option) => {
              setIsAttachmentOpen(false);
              alert(`${option} clicked!`);
            }}
          />
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 rounded-full bg-[#2a3942] text-xs sm:text-sm text-white px-3 sm:px-4 py-1 sm:py-2 focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Send
            className="w-4 sm:w-5 h-4 sm:h-5 text-white cursor-pointer"
            onClick={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
