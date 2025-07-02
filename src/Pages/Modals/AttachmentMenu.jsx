import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Image,
  Camera,
  Headphones,
  User,
  List,
  CalendarDays,
  Sticker,
} from "lucide-react";

const options = [
  { icon: FileText, label: "Document", color: "text-purple-400" },
  { icon: Image, label: "Photos & videos", color: "text-blue-400" },
  { icon: Camera, label: "Camera", color: "text-pink-500" },
  { icon: Headphones, label: "Audio", color: "text-orange-400" },
  { icon: User, label: "Contact", color: "text-cyan-400" },
  { icon: List, label: "Poll", color: "text-yellow-400" },
  { icon: CalendarDays, label: "Event", color: "text-pink-400" },
  { icon: Sticker, label: "New sticker", color: "text-green-400" },
];

const AttachmentMenu = ({ isOpen, onClose, onOptionClick, chatId }) => {
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleOptionClick = (label) => {
    if (label === "Camera") {
      navigate("/under-construction");
      onClose();
    } else {
      onOptionClick(label);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bottom-16 left-3 w-48 bg-[#202c33] text-white rounded-md shadow-lg py-2 z-50"
    >
      <ul className="space-y-1 text-sm px-2">
        {options.map(({ icon: Icon, label, color }) => (
          <li
            key={label}
            className="flex items-center space-x-3 px-3 py-2 hover:bg-[#2a3942] rounded-md cursor-pointer"
            onClick={() => handleOptionClick(label)}
          >
            <Icon className={`w-4 h-4 ${color}`} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttachmentMenu;
