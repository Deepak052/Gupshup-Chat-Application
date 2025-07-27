import React, { useState, useEffect } from "react";
import { Plus, MoreVertical, Archive, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OptionsModal from "../Pages/Modals/OptionsModal";
import NewChatOverlay from "../Pages/Modals/NewChatOverlay";
import api from "../utils/api.js";
import socket from "../socket"; // Import socket instance

const ChatSidebar = ({ onSelectChat }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openOptionModal, setOpenOptionModal] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("Please log in to view chats.");
          setIsLoading(false);
          navigate("/login");
          return;
        }

        const res = await api.get("/chat", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("response from chat ", res.data);

        if (Array.isArray(res.data.chats)) {
          const formattedChats = await Promise.all(
            res.data.chats.map(async (chat) => {
              let chatName = "Unknown Chat";
              let avatar = "https://randomuser.me/api/portraits/lego/1.jpg";
              let lastMessage = "";

              // Fetch the latest message for the chat
              try {
                const messagesRes = await api.get(`/message/${chat._id}`, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                });
                if (messagesRes.data.messages.length > 0) {
                  const latestMessage =
                    messagesRes.data.messages[
                      messagesRes.data.messages.length - 1
                    ];
                  lastMessage = latestMessage.content;
                }
              } catch (err) {
                console.error(
                  `Error fetching messages for chat ${chat._id}:`,
                  err
                );
              }

              if (chat.isGroupChat) {
                chatName = chat.chatName || "Unnamed Group";
                avatar = "https://randomuser.me/api/portraits/lego/3.jpg";
              } else {
                const otherUser = chat.members.find(
                  (member) => member._id !== currentUserId
                );
                const user = allUsers.find((u) => u.id === otherUser?._id);
                chatName = user
                  ? user.name
                  : otherUser?.email || "Unknown User";
                avatar =
                  user?.avatar ||
                  "https://randomuser.me/api/portraits/lego/2.jpg";
              }

              return {
                id: chat._id,
                name: chatName,
                avatar,
                lastMessage,
                time: chat.updatedAt
                  ? new Date(chat.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "",
                unread: chat.unread || 0,
                isFavourite: chat.isFavourite || false,
                isGroup: chat.isGroupChat || false,
              };
            })
          );
          setChatList(formattedChats);
        } else {
          setChatList([]);
          setError("Failed to load chats: Invalid data format");
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
        setChatList([]);
        setError("Failed to load chats. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (allUsers.length > 0) {
      fetchChats();
    }
  }, [navigate, allUsers, currentUserId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("useEffect: Starting fetchUsers...");
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("useEffect: No token found, setting allUsers to empty.");
          setAllUsers([]);
          return;
        }

        const res = await api.get("/users/get-all-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("chat sidebar all users data ", res.data);

        const users = Array.isArray(res.data.data)
          ? res.data.data
              .filter((user) => user._id !== currentUserId)
              .map((user) => ({
                id: user._id,
                name:
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  user.email ||
                  "Unknown User",
                avatar:
                  user.avatar ||
                  "https://randomuser.me/api/portraits/lego/2.jpg",
                status: user.status || "Available",
              }))
          : [];
        console.log("useEffect: Processed users:", users);
        setAllUsers(users);
      } catch (err) {
        console.error("Error fetching users:", err);
        setAllUsers([]);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  useEffect(() => {
    socket.on("group-created", ({ chat }) => {
      if (chat.members.includes(currentUserId)) {
        const newChat = {
          id: chat._id,
          name: chat.chatName || "Unnamed Group",
          avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
          lastMessage: "",
          time: new Date(chat.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: 0,
          isFavourite: false,
          isGroup: chat.isGroupChat || false,
        };
        setChatList((prev) => [...prev, newChat]);
      }
    });

    return () => {
      socket.off("group-created");
    };
  }, [currentUserId]);

  const handleStartNewChat = async (userId, groupChat = null) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      let newChat;

      if (groupChat) {
        // Handle group chat
        newChat = groupChat;
      } else {
        // Handle one-on-one chat
        if (!userId) {
          setError("User ID is required to start a chat.");
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

        if (!res.data.success) {
          throw new Error("Failed to create one-on-one chat.");
        }

        const user = allUsers.find((u) => u.id === userId);
        newChat = {
          id: res.data.chat._id,
          name: user?.name || "New Chat",
          avatar:
            user?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
          lastMessage: "",
          time: new Date(res.data.chat.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: 0,
          isFavourite: false,
          isGroup: false,
        };
      }

      setChatList((prev) => {
        // Avoid duplicates by checking if the chat already exists
        if (prev.some((chat) => chat.id === newChat.id)) {
          return prev;
        }
        return [...prev, newChat];
      });
      setIsNewChatOpen(false);
      onSelectChat(newChat.id);
    } catch (err) {
      console.error("Error starting new chat:", err);
      setError("Failed to start new chat.");
    }
  };

  const filteredChats = chatList.filter((chat) => {
    if (!chat || !chat.id || !chat.name) return false;
    return (
      chat.name.toLowerCase().includes(search.toLowerCase()) &&
      (activeTab === "All" ||
        (activeTab === "Unread" && chat.unread > 0) ||
        (activeTab === "Favourites" && chat.isFavourite) ||
        (activeTab === "Groups" && chat.isGroup))
    );
  });

  return (
    <>
      <button
        className="md:hidden fixed top-5 left-1 z-50 p-2 bg-gray-700 rounded-full text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-3 h-3" />
      </button>
      <div
        id="allchat"
        className={`h-screen w-full md:w-80 bg-[#1e1e1e] text-white overflow-y-auto border-r border-gray-700 fixed md:sticky top-0 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold sm:ml-0 ml-8">Gupshup</h1>
          <div className="flex items-center space-x-3">
            <Plus
              className="w-5 h-5 cursor-pointer"
              onClick={() => setIsNewChatOpen(true)}
            />
            <MoreVertical
              className="w-5 h-5 cursor-pointer"
              onClick={() => setOpenOptionModal(!openOptionModal)}
            />
            <NewChatOverlay
              isOpen={isNewChatOpen}
              onClose={() => setIsNewChatOpen(false)}
              users={allUsers}
              onStartChat={handleStartNewChat}
            />
          </div>
          <OptionsModal
            isOpen={openOptionModal}
            onClose={() => setOpenOptionModal(false)}
          />
        </div>
        <div className="px-4 mb-2">
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full rounded-full bg-[#2a2a2a] py-2 px-4 text-sm placeholder-gray-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="px-2 flex space-x-1 mb-4 text-sm flex-wrap gap-y-2">
          {["All", "Unread", "Favourites", "Groups"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-[#2a2a2a] text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2 px-4 text-gray-400 text-sm mb-2">
          <Archive className="w-4 h-4" />
          <span>Archived</span>
        </div>
        <div>
          {isLoading ? (
            <div className="p-4 text-gray-400 text-sm">Loading chats...</div>
          ) : error ? (
            <div className="p-4 text-red-400 text-sm">{error}</div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-gray-400 text-sm">No chats found.</div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer relative"
                onClick={() => {
                  console.log("Selected chat ID:", chat.id);
                  onSelectChat(chat.id);
                  setIsOpen(false);
                }}
              >
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <h2 className="font-semibold text-sm">{chat.name}</h2>
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {chat.lastMessage
                      ? chat.lastMessage.length > 30
                        ? chat.lastMessage.slice(0, 30) + "..."
                        : chat.lastMessage
                      : "No messages yet"}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="absolute right-4 bottom-3 bg-green-500 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
