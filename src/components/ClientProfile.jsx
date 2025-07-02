import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Pencil,
  Save,
  X,
  Star,
  Trash2,
  Ban,
  Flag,
} from "lucide-react";

const ClientProfile = ({ onClose }) => {
  const dummyUser = {
    name: "Muski🐝",
    phone: "+91 99379 50120",
    about: "🌸~हमारे साथ भी रूहानियत फिर किस बात की शिकायत..~🌸",
    avatar:
      "https://i.pinimg.com/originals/c7/02/33/c702330f52aa41a8b185089cb6a07e5e.png",
    media: [
      "https://i.ibb.co/VSpvS8d/family.jpg",
      "https://i.ibb.co/VSpvS8d/family.jpg",
      "https://i.ibb.co/VSpvS8d/family.jpg",
      "https://i.ibb.co/VSpvS8d/family.jpg",
      "https://i.ibb.co/VSpvS8d/family.jpg",
    ],
    groups: [
      { name: "Sweet Family", members: "Mom, Mummy, Muski🐝, Papa, You" },
      {
        name: "Family group",
        members: "Basanti, Gautam, Mami, Mom, Mosa, Muski🐝, You",
      },
    ],
  };

  const [name, setName] = useState(
    localStorage.getItem("clientName") || dummyUser.name
  );
  const [about, setAbout] = useState(
    localStorage.getItem("clientAbout") || dummyUser.about
  );
  const containerRef = useRef();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempAbout, setTempAbout] = useState(about);
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem("clientIsMuted") === "true" || false
  );
  const [isDisappearingMessages, setIsDisappearingMessages] = useState(
    localStorage.getItem("clientDisappearingMessages") === "true" || false
  );
  const [isAdvancedPrivacy, setIsAdvancedPrivacy] = useState(
    localStorage.getItem("clientAdvancedPrivacy") === "true" || false
  );

  useEffect(() => {
    localStorage.setItem("clientName", name);
    localStorage.setItem("clientAbout", about);
    localStorage.setItem("clientIsMuted", isMuted);
    localStorage.setItem("clientDisappearingMessages", isDisappearingMessages);
    localStorage.setItem("clientAdvancedPrivacy", isAdvancedPrivacy);
  }, [name, about, isMuted, isDisappearingMessages, isAdvancedPrivacy]);

  const handleSaveName = () => {
    setName(tempName);
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  const handleSaveAbout = () => {
    setAbout(tempAbout);
    setIsEditingAbout(false);
  };

  const handleCancelAbout = () => {
    setTempAbout(about);
    setIsEditingAbout(false);
  };

  const handleStarredMessages = () => {
    alert("Starred messages feature coming soon!");
  };

  const handleBlock = () => {
    alert(`Blocked ${name}!`);
  };

  const handleReport = () => {
    alert(`Reported ${name}!`);
  };

  const handleDeleteChat = () => {
    alert("Chat deleted!");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        onClose(); // trigger close
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="w-full sm:w-[380px] h-full bg-[#111b21] text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ArrowLeft onClick={onClose} className="w-5 h-5 cursor-pointer" />
          <h2 className="text-lg font-semibold">Contact Info</h2>
        </div>
        <Pencil
          className="w-5 h-5 cursor-pointer"
          onClick={() => alert("Edit profile picture coming soon!")}
        />
      </div>
      <div className="flex flex-col items-center text-center">
        <img
          src={dummyUser.avatar}
          alt={name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="mt-2 w-full">
          {isEditingName ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="flex-1 bg-[#202c33] text-white text-sm px-3 py-1 rounded-md focus:outline-none"
                autoFocus
              />
              <Save
                className="w-4 h-4 text-green-500 cursor-pointer"
                onClick={handleSaveName}
              />
              <X
                className="w-4 h-4 text-gray-400 cursor-pointer"
                onClick={handleCancelName}
              />
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{name}</h3>
              <Pencil
                className="w-4 h-4 text-gray-400 cursor-pointer"
                onClick={() => setIsEditingName(true)}
              />
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm mt-1">{dummyUser.phone}</p>
      </div>
      <div className="mt-6">
        <h4 className="text-gray-400 text-sm uppercase">About</h4>
        {isEditingAbout ? (
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="text"
              value={tempAbout}
              onChange={(e) => setTempAbout(e.target.value)}
              className="flex-1 bg-[#202c33] text-white text-sm px-3 py-1 rounded-md focus:outline-none"
              autoFocus
            />
            <Save
              className="w-4 h-4 text-green-500 cursor-pointer"
              onClick={handleSaveAbout}
            />
            <X
              className="w-4 h-4 text-gray-400 cursor-pointer"
              onClick={handleCancelAbout}
            />
          </div>
        ) : (
          <div className="flex justify-between items-center mt-1">
            <p className="text-white">{about}</p>
            <Pencil
              className="w-4 h-4 text-gray-400 cursor-pointer"
              onClick={() => setIsEditingAbout(true)}
            />
          </div>
        )}
      </div>
      <div className="mt-6">
        <h4 className="text-gray-400 text-sm uppercase mb-2">
          Media, links and docs
        </h4>
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {dummyUser.media.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`media-${index}`}
              className="w-20 h-20 rounded-md object-cover"
            />
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={handleStarredMessages}
        >
          <p className="text-sm">Starred messages</p>
          <Star className="w-4 h-4 text-gray-400" />
        </div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsMuted(!isMuted)}
        >
          <p className="text-sm">Mute notifications</p>
          <div
            className={`w-10 h-5 rounded-full flex items-center px-1 transition-all duration-300 ${
              isMuted ? "bg-green-500 justify-end" : "bg-gray-600 justify-start"
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsDisappearingMessages(!isDisappearingMessages)}
        >
          <p className="text-sm">Disappearing messages</p>
          <p className="text-sm text-gray-400">
            {isDisappearingMessages ? "On" : "Off"}
          </p>
        </div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsAdvancedPrivacy(!isAdvancedPrivacy)}
        >
          <p className="text-sm">Advanced chat privacy</p>
          <p className="text-sm text-gray-400">
            {isAdvancedPrivacy ? "On" : "Off"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm">Encryption</p>
          <p className="text-sm text-green-400 text-right text-xs">
            Messages are end-to-end encrypted.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-gray-400 text-sm uppercase mb-2">
          {dummyUser.groups.length} groups in common
        </h4>
        <div className="space-y-4">
          {dummyUser.groups.map((group, index) => (
            <div key={index}>
              <p className="text-white text-sm font-medium">{group.name}</p>
              <p className="text-gray-400 text-xs">{group.members}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 space-y-4 text-red-400 text-sm">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleBlock}
        >
          <Ban className="w-4 h-4" />
          <span>Block {name}</span>
        </div>
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleReport}
        >
          <Flag className="w-4 h-4" />
          <span>Report {name}</span>
        </div>
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleDeleteChat}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete chat</span>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
