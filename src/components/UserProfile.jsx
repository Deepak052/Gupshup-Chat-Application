import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, Save, X } from "lucide-react";
import user from "../MockData/user.json";

const UserProfile = ({ onClose }) => {
  const [name, setName] = useState(
    localStorage.getItem("userName") || user.name
  );
  const [about, setAbout] = useState(
    localStorage.getItem("userAbout") || user.about
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempAbout, setTempAbout] = useState(about);

  useEffect(() => {
    localStorage.setItem("userName", name);
    localStorage.setItem("userAbout", about);
  }, [name, about]);

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

  return (
    <div className="w-full sm:w-[380px] h-screen bg-[#111b21] text-white flex flex-col">
      <div className="flex items-center p-4 border-b border-gray-700">
        <ArrowLeft className="mr-4 cursor-pointer" onClick={onClose} />
        <h2 className="text-lg font-semibold">Profile</h2>
      </div>
      <div className="flex flex-col items-center mt-6">
        <img
          src={user.profilePic}
          alt={name}
          className="w-28 h-28 rounded-full border-2 border-green-500 object-cover"
        />
      </div>
      <div className="px-6 mt-10">
        <p className="text-xs text-gray-400">Your name</p>
        <div className="flex justify-between items-center mt-1">
          {isEditingName ? (
            <div className="flex items-center w-full space-x-2">
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
            <p className="text-sm">{name}</p>
          )}
          {!isEditingName && (
            <Pencil
              className="w-4 h-4 text-gray-400 cursor-pointer"
              onClick={() => setIsEditingName(true)}
            />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          This is not your username or PIN. This name will be visible to your
          WhatsApp contacts.
        </p>
      </div>
      <div className="px-6 mt-8">
        <p className="text-xs text-gray-400">About</p>
        <div className="flex justify-between items-center mt-1">
          {isEditingAbout ? (
            <div className="flex items-center w-full space-x-2">
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
            <p className="text-sm">{about}</p>
          )}
          {!isEditingAbout && (
            <Pencil
              className="w-4 h-4 text-gray-400 cursor-pointer"
              onClick={() => setIsEditingAbout(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
