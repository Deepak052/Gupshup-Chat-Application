import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  CircleDot,
  MessageCircle,
  Users,
  Settings,
} from "lucide-react";
import chatList from "../MockData/chatList.json";
import user from "../MockData/user.json";
import { useState } from "react";

const Sidebar = ({ onProfileClick, onSettingsClick, onNewChatClick }) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-16 bg-[#1e1e1e] flex flex-col justify-between items-center py-4 fixed left-0 hidden md:flex">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div
            className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
            // onClick={() => navigate("/under-construction")}
          >
            <MessageSquare className="text-white w-5 h-5" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {chatList.reduce((sum, chat) => sum + chat.unread, 0)}
          </div>
        </div>
        <div className="relative">
          <div
            className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
            onClick={() => navigate("/under-construction")}
          >
            <CircleDot className="text-white w-5 h-5" />
          </div>
          {user.online && (
            <span className="absolute bottom-0 right-1 h-2 w-2 rounded-full bg-green-500" />
          )}
        </div>
        <div
          className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => navigate("/under-construction")}
        >
          <MessageCircle className="text-white w-5 h-5" />
        </div>
        <div
          className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => navigate("/under-construction")}
        >
          <Users className="text-white w-5 h-5" />
        </div>
        <div className="w-6 h-px bg-gray-500 mt-2" />
        <div className="bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 w-6 h-6 rounded-full animate-spin" />
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div
          className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={onSettingsClick}
        >
          <Settings className="text-white w-5 h-5" />
        </div>
        <img
          src={user.profilePic}
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-white object-cover cursor-pointer"
          onClick={onProfileClick}
        />
      </div>
    </div>
  );
};

export default Sidebar;
