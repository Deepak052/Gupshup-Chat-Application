import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Star, CheckSquare, LogOut } from "lucide-react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../App"; // adjust path as needed


const OptionsModal = ({ isOpen, onClose }) => {
  const modalRef = useRef();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

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


  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="absolute right-1 top-12 bg-[#202c33] text-white shadow-lg rounded-md w-52 py-2 z-50"
    >
      <ul className="space-y-1 text-sm px-2">
        <li className="flex items-center space-x-2 px-3 py-2 hover:bg-[#2a3942] rounded-md cursor-pointer">
          <Users className="w-4 h-4 text-gray-300" />
          <span>New group</span>
        </li>
        <li className="flex items-center space-x-2 px-3 py-2 hover:bg-[#2a3942] rounded-md cursor-pointer">
          <Star className="w-4 h-4 text-gray-300" />
          <span>Starred messages</span>
        </li>
        <li className="flex items-center space-x-2 px-3 py-2 hover:bg-[#2a3942] rounded-md cursor-pointer">
          <CheckSquare className="w-4 h-4 text-gray-300" />
          <span>Select chats</span>
        </li>
        <hr className="border-gray-600 my-1" />
        <li
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 hover:bg-[#2a3942] rounded-md cursor-pointer text-red-400"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </li>
      </ul>
    </div>
  );
};

export default OptionsModal;
