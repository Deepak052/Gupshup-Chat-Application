import { Video, Search, MoreVertical, Plus } from "lucide-react";
import messagesData from "../MockData/messages.json";
import { useEffect, useState } from "react";
import chatList from "../MockData/chatList.json"


const ChatWindow = ({ chatId }) => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const selectedChat = chatList.find((chat) => chat.id === chatId);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: `m${messages.length + 1}`,
        type: "sent",
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };
  useEffect(() => {
    if (chatId) {
      setMessages(messagesData[chatId] || []);
    }
  }, [chatId]);

  return (
    <div className="flex flex-col flex-1 h-screen bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center relative">
      <div className="flex items-center justify-between bg-[#202c33] p-3 text-white">
        <div className="flex items-center space-x-3">
          <img
            src={
              selectedChat?.avatar ||
              "https://randomuser.me/api/portraits/women/45.jpg"
            }
            alt={selectedChat?.name || "Chat"}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold text-sm sm:text-base">
            {selectedChat?.name || "Select a chat"}
          </span>
        </div>
        <div className="flex space-x-4">
          <Video className="w-5 h-5" />
          <Search className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3">
        {messages.map((msg) => {
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
        })}
      </div>
      <div className="flex items-center bg-[#202c33] p-2 sm:p-3 gap-2 sm:gap-3">
        <Plus className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 rounded-full bg-[#2a3942] text-xs sm:text-sm text-white px-3 sm:px-4 py-1 sm:py-2 focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
      </div>
    </div>
  );
};


export default ChatWindow;
