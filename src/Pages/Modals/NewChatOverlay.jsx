import { useEffect, useRef, useState } from "react";
import { ArrowLeft, UserPlus, Users, Group, X } from "lucide-react";
import api from "../../utils/api";


const NewChatOverlay = ({ isOpen, onClose, users, onStartChat }) => {
  const ref = useRef();
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSelectUser = (user) => {
    if (isGroupMode) {
      setSelectedUsers((prev) =>
        prev.includes(user.id)
          ? prev.filter((id) => id !== user.id)
          : [...prev, user.id]
      );
    } else {
      // Start one-on-one chat
      createOneOnOneChat(user.id);
    }
  };

  const createOneOnOneChat = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Please log in to start a chat.");
        return;
      }

      const res = await api.post(
        "/chat",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        onStartChat(userId); // Notify parent (ChatSidebar) to add and select the new chat
        onClose();
      }
    } catch (err) {
      console.error("Error starting new chat:", err);
      setError("Failed to start chat. Please try again.");
    }
  };

  const createGroupChat = async () => {
    if (!groupName.trim()) {
      setError("Group name is required.");
      return;
    }
    if (selectedUsers.length < 2) {
      setError("Select at least 2 users for a group chat.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Please log in to create a group chat.");
        return;
      }

      const res = await api.post(
        "/chat/group",
        {
          name: groupName,
          users: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        // Notify parent to add the new group chat
        onStartChat(null, {
          id: res.data.group._id,
          name: res.data.group.chatName,
          avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
          lastMessage: "",
          time: new Date(res.data.group.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: 0,
          isFavourite: false,
          isGroup: true,
        });
        onClose();
      }
    } catch (err) {
      console.error("Error creating group chat:", err);
      setError("Failed to create group chat. Please try again.");
    }
  };

  const handleNewGroup = () => {
    setIsGroupMode(true);
    setError(null);
  };

  const handleBackFromGroup = () => {
    setIsGroupMode(false);
    setSelectedUsers([]);
    setGroupName("");
    setError(null);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex">
      <div
        ref={ref}
        className="w-full md:w-80 h-full bg-[#111b21] text-white overflow-y-auto relative p-4"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          {isGroupMode ? (
            <>
              <ArrowLeft
                className="w-5 h-5 cursor-pointer"
                onClick={handleBackFromGroup}
              />
              <h2 className="text-lg font-semibold">New group</h2>
            </>
          ) : (
            <>
              <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={onClose} />
              <h2 className="text-lg font-semibold">New chat</h2>
            </>
          )}
        </div>

        {/* Group Name Input (Group Mode) */}
        {isGroupMode && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-green-500 rounded-full focus:outline-none text-sm placeholder:text-gray-400"
            />
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Search name or number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-transparent border border-green-500 rounded-full focus:outline-none text-sm placeholder:text-gray-400 mb-4"
        />

        {/* Error Message */}
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        {/* Quick Actions (Non-Group Mode) */}
        {!isGroupMode && (
          <div className="space-y-3 my-4">
            <Action
              icon={<Users className="text-green-500" />}
              label="New group"
              onClick={handleNewGroup}
            />
            <Action
              icon={<UserPlus className="text-green-500" />}
              label="New contact"
              onClick={() => alert("New contact feature coming soon!")}
            />
            <Action
              icon={<Group className="text-green-500" />}
              label="New community"
              onClick={() => alert("New community feature coming soon!")}
            />
          </div>
        )}

        {/* Selected Users (Group Mode) */}
        {isGroupMode && selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedUsers.map((userId) => {
              const user = users.find((u) => u.id === userId);
              return (
                <div
                  key={userId}
                  className="flex items-center space-x-2 bg-green-600 text-white px-2 py-1 rounded-full"
                >
                  <span className="text-xs">{user?.name || "Unknown"}</span>
                  <X
                    className="w-4 h-4 cursor-pointer"
                    onClick={() =>
                      setSelectedUsers((prev) =>
                        prev.filter((id) => id !== userId)
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Contacts */}
        <h3 className="text-xs text-gray-400 uppercase my-3">
          Contacts on Gupshup
        </h3>
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center space-x-3 cursor-pointer hover:bg-[#2a3942] p-2 rounded-md ${
                  selectedUsers.includes(user.id) ? "bg-[#2a3942]" : ""
                }`}
                onClick={() => handleSelectUser(user)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-sm">{user.name[0]}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">
                    {user.status || "Available"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm">No contacts found.</div>
          )}
        </div>

        {/* Create Group Button (Group Mode) */}
        {isGroupMode && (
          <div className="mt-4">
            <button
              className="w-full bg-green-600 text-white py-2 rounded-full"
              onClick={createGroupChat}
            >
              Create Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Action = ({ icon, label, onClick }) => (
  <div
    className="flex items-center space-x-3 cursor-pointer hover:bg-[#2a3942] px-3 py-2 rounded-md"
    onClick={onClick}
  >
    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <span className="text-sm">{label}</span>
  </div>
);

export default NewChatOverlay;
