import { useEffect, useRef, useState } from "react";
import { ArrowLeft, UserPlus, Users, Group } from "lucide-react";

const mockContacts = [
  {
    id: 1,
    name: "Deepak Mehta (You)",
    status: "Message yourself",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    name: "Aakarsh Sahu Sirt",
    status: "Everything is magic ✨",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    name: "Aamir Sirt",
    status: "No words - Just vibes🍁",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 4,
    name: "Aanchal Singh Sirt",
    status: "Vishualize your highest self then show up as Her",
  },
  {
    id: 5,
    name: "Aarya Raghuvanshi Sirt",
    status: "Hey there! I am using WhatsApp.",
    avatar: "https://i.pravatar.cc/100?img=4",
  },
  {
    id: 6,
    name: "Aastha Sirt",
    status: "Available",
  },
  {
    id: 7,
    name: "Abha",
    status: "Make your heart the prettiest thing about you 🤍",
  },
  {
    id: 8,
    name: "Abhiney Sirt",
    status: "",
  },
];

const NewChatOverlay = ({ isOpen, onClose }) => {
  const ref = useRef();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredContacts = mockContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex">
      <div
        ref={ref}
        className="w-full md:w-80 h-full bg-[#111b21] text-white overflow-y-auto relative"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={onClose} />
          <h2 className="text-lg font-semibold">New chat</h2>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search name or number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-transparent border border-green-500 rounded-full focus:outline-none text-sm placeholder:text-gray-400"
        />

        {/* Quick Actions */}
        <div className="space-y-3 my-4">
          <Action
            icon={<Users className="text-green-500" />}
            label="New group"
          />
          <Action
            icon={<UserPlus className="text-green-500" />}
            label="New contact"
          />
          <Action
            icon={<Group className="text-green-500" />}
            label="New community"
          />
        </div>

        {/* Contacts */}
        <h3 className="text-xs text-gray-400 uppercase my-3">
          Contacts on WhatsApp
        </h3>
        <div className="space-y-4">
          {filteredContacts.map((contact, i) => (
            <div key={i} className="flex items-center space-x-3">
              {contact.avatar ? (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-sm">{contact.name[0]}</span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{contact.name}</p>
                <p className="text-xs text-gray-400">{contact.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Action = ({ icon, label }) => (
  <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#2a3942] px-3 py-2 rounded-md">
    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <span className="text-sm">{label}</span>
  </div>
);

export default NewChatOverlay;
