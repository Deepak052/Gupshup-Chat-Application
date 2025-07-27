import {
  LogOut,
  Key,
  Bell,
  Lock,
  LayoutList,
  HelpCircle,
  Settings,
} from "lucide-react";
import { ArrowLeft, Search } from "lucide-react";
import user from "../MockData/user.json";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../App"; // adjust path as needed
import { useNavigate } from "react-router-dom";

const SettingsPanel = ({ onClose }) => {
const navigate = useNavigate();
const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("chat_null_disappearing");
      localStorage.removeItem("chat_null_favourite");
      localStorage.removeItem("chat_null_muted");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userAbout");
      localStorage.removeItem("userName");

      // 🔥 This tells App.jsx to rerender and redirect
      setIsAuthenticated(false);

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  return (
    <div className="w-full sm:w-[380px] h-screen bg-[#111b21] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-700">
        <ArrowLeft className="mr-4 cursor-pointer" onClick={onClose} />
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>

      {/* Search Input */}
      <div className="flex items-center px-4 mt-4">
        <div className="flex items-center bg-[#1f2c33] w-full rounded-full px-3 py-1">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search settings"
            className="bg-transparent text-sm text-white placeholder-gray-400 pl-2 w-full focus:outline-none"
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center px-4 py-4 space-x-4 border-b border-gray-700">
        <img
          src={user.profilePic}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-gray-400">{user.about}</p>
        </div>
      </div>

      {/* Settings Options */}
      <div className="flex flex-col px-4 space-y-4 mt-4 text-sm">
        <Option
          icon={<Key className="w-5 h-5" />}
          title="Account"
          subtitle="Security notifications, account info"
        />
        <Option
          icon={<Lock className="w-5 h-5" />}
          title="Privacy"
          subtitle="Blocked contacts, disappearing messages"
        />
        <Option
          icon={<LayoutList className="w-5 h-5" />}
          title="Chats"
          subtitle="Theme, wallpaper, chat settings"
        />
        <Option
          icon={<Bell className="w-5 h-5" />}
          title="Notifications"
          subtitle="Message notifications"
        />
        <Option
          icon={<Settings className="w-5 h-5" />}
          title="Keyboard shortcuts"
          subtitle="Quick actions"
        />
        <Option
          icon={<HelpCircle className="w-5 h-5" />}
          title="Help"
          subtitle="Help center, contact us, privacy policy"
        />

        <div
          className="flex items-center space-x-4 text-red-500 pt-4 border-t border-gray-700 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 " />
          <span className="text-sm">Log out</span>
        </div>
      </div>
    </div>
  );
};

const Option = ({ icon, title, subtitle }) => (
  <div className="flex items-start space-x-4 cursor-pointer">
    <div className="mt-1 text-gray-300">{icon}</div>
    <div>
      <p className="text-white">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  </div>
);

export default SettingsPanel;
