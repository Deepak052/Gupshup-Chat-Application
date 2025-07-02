import React,{ useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Info,
  CheckSquare,
  BellOff,
  Timer,
  Heart,
  XCircle,
  Flag,
  Ban,
  Trash,
  Trash2,
} from "lucide-react";
import chatList from "../../MockData/chatList.json";

const ChatOptionsModal = ({ isOpen, onClose, chatId }) => {
  const navigate = useNavigate();
  const chat = chatList.find((chat) => chat.id === chatId) || {};

  const [isMuted, setIsMuted] = useState(
    localStorage.getItem(`chat_${chatId}_muted`) === "true" || false
  );
  const [isDisappearing, setIsDisappearing] = useState(
    localStorage.getItem(`chat_${chatId}_disappearing`) === "true" || false
  );
  const [isFavourite, setIsFavourite] = useState(
    localStorage.getItem(`chat_${chatId}_favourite`) === "true" || false
  );

  useEffect(() => {
    localStorage.setItem(`chat_${chatId}_muted`, isMuted);
    localStorage.setItem(`chat_${chatId}_disappearing`, isDisappearing);
    localStorage.setItem(`chat_${chatId}_favourite`, isFavourite);
  }, [chatId, isMuted, isDisappearing, isFavourite]);

  const handleContactInfo = () => {
    onClose();
    navigate("/profile", { state: { chatId } });
  };

  const handleSelectMessages = () => {
    alert("Select messages feature coming soon!");
    navigate("/under-construction");
  };

  const handleMuteNotifications = () => {
    setIsMuted(!isMuted);
    alert(
      isMuted
        ? `${chat.name}'s notifications unmuted!`
        : `${chat.name}'s notifications muted!`
    );
  };

  const handleDisappearingMessages = () => {
    setIsDisappearing(!isDisappearing);
    alert(
      isDisappearing
        ? `Disappearing messages turned off for ${chat.name}!`
        : `Disappearing messages turned on for ${chat.name}!`
    );
  };

  const handleAddToFavourites = () => {
    setIsFavourite(!isFavourite);
    alert(
      isFavourite
        ? `${chat.name} removed from favourites!`
        : `${chat.name} added to favourites!`
    );
  };

  const handleCloseChat = () => {
    alert(`Closed chat with ${chat.name}!`);
    onClose();
  };

  const handleReport = () => {
    alert(`Reported ${chat.name}!`);
    onClose();
  };

  const handleBlock = () => {
    alert(`Blocked ${chat.name}!`);
    onClose();
  };

  const handleClearChat = () => {
    alert(`Cleared chat with ${chat.name}!`);
    onClose();
  };

  const handleDeleteChat = () => {
    alert(`Deleted chat with ${chat.name}!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed mt-8 inset-0 z-50 flex items-start justify-end p-4 bg-black/10"
    >
      <div
        className="bg-[#202c33] text-white w-60 rounded-md shadow-lg py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="text-sm space-y-1 px-2">
          <Option
            icon={<Info className="w-4 h-4" />}
            text="Contact info"
            onClick={handleContactInfo}
          />
          <Option
            icon={<CheckSquare className="w-4 h-4" />}
            text="Select messages"
            onClick={handleSelectMessages}
          />
          <Option
            icon={<BellOff className="w-4 h-4" />}
            text={isMuted ? "Unmute notifications" : "Mute notifications"}
            onClick={handleMuteNotifications}
          />
          <Option
            icon={<Timer className="w-4 h-4" />}
            text={
              isDisappearing
                ? "Disable disappearing messages"
                : "Disappearing messages"
            }
            onClick={handleDisappearingMessages}
          />
          <Option
            icon={<Heart className="w-4 h-4" />}
            text={isFavourite ? "Remove from favourites" : "Add to favourites"}
            onClick={handleAddToFavourites}
          />
          <Option
            icon={<XCircle className="w-4 h-4" />}
            text="Close chat"
            onClick={handleCloseChat}
          />
          <hr className="border-gray-600 my-1" />
          <Option
            icon={<Flag className="w-4 h-4" />}
            text="Report"
            danger
            onClick={handleReport}
          />
          <Option
            icon={<Ban className="w-4 h-4" />}
            text="Block"
            danger
            onClick={handleBlock}
          />
          <Option
            icon={<Trash className="w-4 h-4" />}
            text="Clear chat"
            danger
            onClick={handleClearChat}
          />
          <Option
            icon={<Trash2 className="w-4 h-4" />}
            text="Delete chat"
            danger
            onClick={handleDeleteChat}
          />
        </ul>
      </div>
    </div>
  );
};

const Option = ({ icon, text, danger, onClick }) => (
  <li
    className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer hover:bg-[#2a3942] ${
      danger ? "text-red-400" : ""
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </li>
);

export default ChatOptionsModal;
