import { useEffect, useRef } from "react";
import { Users, Star, CheckSquare, LogOut } from "lucide-react";

const OptionsModal = ({ isOpen, onClose }) => {
  const modalRef = useRef();

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
        <li className="flex items-center space-x-2 px-3 py-2 hover:bg-[#2a3942] rounded-md cursor-pointer text-red-400">
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </li>
      </ul>
    </div>
  );
};

export default OptionsModal;
