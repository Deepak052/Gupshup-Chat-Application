// src/pages/ChatApp.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import ClientProfile from "../components/ClientProfile";
import UserProfile from "../components/UserProfile";
import SettingsPanel from "../components/SettingsPanel";
import socket from "../socket";
import { useEffect } from "react";

const ChatApp = ({ showSettings = false, showUserProfile = false }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showClientProfile, setShowClientProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("setup", { _id: userId });
      
      socket.on("connected", () => {
        console.log("Socket connected successfully");
      });
      
      return () => {
        socket.off("connected");
      };
    }
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-900 text-white relative">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-16 bg-[#1e1e1e] border-r border-gray-700">
        <Sidebar
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
        />
      </div>

      {/* ChatSidebar */}
      <div className="z-40">
        <ChatSidebar
          onSelectChat={(chat) => {
            setSelectedChat(chat);
            setSelectedChatId(chat.id);
          }}
        />
      </div>

      {/* ChatWindow */}
      <div className="flex flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center relative z-10">
        <ChatWindow
          chatId={selectedChatId}
          selectedChat={selectedChat}
          onAvatarClick={() => setShowClientProfile(true)}
        />
      </div>

      {/* ClientProfile */}
      {showClientProfile && (
        <div className="fixed right-0 top-0 h-full w-full sm:w-[380px] bg-[#111b21] z-20">
          <ClientProfile onClose={() => setShowClientProfile(false)} chat={selectedChat} />
        </div>
      )}

      {/* UserProfile */}
      {showUserProfile && location.pathname === "/profile" && (
        <div className="fixed right-0 top-0 h-full w-full sm:w-[380px] bg-[#111b21] z-20">
          <UserProfile onClose={() => navigate("/")} />
        </div>
      )}

      {/* SettingsPanel */}
      {showSettings && location.pathname === "/settings" && (
        <div className="fixed right-0 top-0 h-full w-full sm:w-[380px] bg-[#111b21] z-20">
          <SettingsPanel onClose={() => navigate("/")} />
        </div>
      )}
    </div>
  );
};

export default ChatApp;
