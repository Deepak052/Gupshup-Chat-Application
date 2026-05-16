import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, Save, X, Camera } from "lucide-react";
import api from "../utils/api.js";
import { Api_url } from "../utils/constant";

const UserProfile = ({ onClose }) => {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState("https://randomuser.me/api/portraits/lego/2.jpg");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempAbout, setTempAbout] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("accessToken");
        if (!userId || !token) return;

        const res = await api.get(`/users/get-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          const u = res.data.data;
          const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
          setName(fullName);
          setTempName(fullName);
          setAbout(u.statusMessage || "Hey there! I am using Gupshup.");
          setTempAbout(u.statusMessage || "Hey there! I am using Gupshup.");
          if (u.avatar) setAvatar(u.avatar);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.put("/users/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.success;
    } catch (err) {
      console.error("Failed to update profile", err);
      return false;
    }
  };

  const handleSaveName = async () => {
    const parts = tempName.split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");
    const success = await handleUpdateProfile({ firstName, lastName });
    if (success) {
      setName(tempName);
      setIsEditingName(false);
    }
  };

  const handleCancelName = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  const handleSaveAbout = async () => {
    const success = await handleUpdateProfile({ statusMessage: tempAbout });
    if (success) {
      setAbout(tempAbout);
      setIsEditingAbout(false);
    }
  };

  const handleCancelAbout = () => {
    setTempAbout(about);
    setIsEditingAbout(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.post("/upload", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      if (res.data.success) {
        const newAvatarUrl = res.data.data.url;
        const success = await handleUpdateProfile({ avatar: newAvatarUrl });
        if (success) {
          setAvatar(newAvatarUrl);
        }
      }
    } catch (err) {
      console.error("Failed to upload avatar", err);
    }
  };

  return (
    <div className="w-full sm:w-[380px] h-screen bg-[#111b21] text-white flex flex-col">
      <div className="flex items-center p-4 border-b border-gray-700">
        <ArrowLeft className="mr-4 cursor-pointer" onClick={onClose} />
        <h2 className="text-lg font-semibold">Profile</h2>
      </div>
      <div className="flex flex-col items-center mt-6 relative group w-28 h-28 mx-auto cursor-pointer">
        {loading ? (
          <div className="w-28 h-28 rounded-full border-2 border-green-500 bg-gray-700 animate-pulse" />
        ) : (
          <>
            <img
              src={avatar}
              alt={name}
              className="w-28 h-28 rounded-full border-2 border-green-500 object-cover"
            />
            <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs text-center leading-tight">CHANGE<br/>PROFILE PHOTO</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </>
        )}
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
