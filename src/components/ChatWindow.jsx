import { useEffect, useState, useRef } from "react";
import { Video, Search, MoreVertical, Plus, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatOptionsModal from "../Pages/Modals/ChatOptionsModal";
import AttachmentMenu from "../Pages/Modals/AttachmentMenu";
import VideoCall from "./VideoCall";
import socket from "../socket"; // Your socket instance
import api from "../utils/api.js";

const ChatWindow = ({ chatId, onAvatarClick, selectedChat }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isChatOptionOpen, setIsChatOptionOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      if (!chatId) {
        setMessages([]);
        setFilteredMessages([]);
        return;
      }

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const res = await api.get(`/message/${chatId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (isMounted && res.data.success) {
          console.log("messages by id", res.data);
          // Map API messages to the expected format
            const formattedMessages = res.data.messages.map((msg) => ({
              id: msg._id,
              content: msg.content,
              attachments: msg.attachments || [],
              sender: {
              id: msg.sender._id,
              name:
                `${msg.sender.firstName || ""} ${
                  msg.sender.lastName || ""
                }`.trim() || "Unknown User",
              avatar:
                msg.sender.avatar ||
                "https://randomuser.me/api/portraits/lego/2.jpg",
            },
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: msg.sender._id === currentUserId ? "sent" : "received",
          }));
          setMessages(formattedMessages);
          setFilteredMessages(formattedMessages);
        }
      } catch (err) {
        console.error("Error loading messages", err);
        if (isMounted) {
          setMessages([]);
          setFilteredMessages([]);
        }
      }
    };

    fetchMessages();

    if (chatId) {
      socket.emit("join chat", chatId);
    }

    return () => {
      isMounted = false;
    };
  }, [chatId, navigate, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  useEffect(() => {
    socket.on("receive-message", ({ chatId: incomingChatId, message }) => {
      if (incomingChatId === chatId) {
        const formattedMessage = {
          id: message._id,
          content: message.content,
          attachments: message.attachments || [],
          sender: {
            id: message.sender._id,
            name:
              `${message.sender.firstName || ""} ${
                message.sender.lastName || ""
              }`.trim() || "Unknown User",
            avatar:
              message.sender.avatar ||
              "https://randomuser.me/api/portraits/lego/2.jpg",
          },
          time: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: message.sender._id === currentUserId ? "sent" : "received",
        };
        setMessages((prev) => [...prev, formattedMessage]);
        setFilteredMessages((prev) => [...prev, formattedMessage]);
      }
    });

    socket.on("call-made", async (data) => {
      // Prompt user to answer or just show the video call screen
      let cName = "Unknown Caller";
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await api.get(`/users/get-user/${data.callerId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.data.success) {
          const u = res.data.data;
          cName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown User";
        }
      } catch (err) {
        console.error("Failed to fetch caller details", err);
      }

      setIncomingCall({
        offer: data.offer,
        socketId: data.socketId,
        callerId: data.callerId,
        chatId: data.chatId,
        callerName: cName,
      });
      setIsVideoCallActive(true);
    });

    return () => {
      socket.off("receive-message");
      socket.off("call-made");
    };
  }, [chatId, currentUserId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await api.post(
        "/message",
        {
          chatId,
          content: newMessage,
          attachments: [], // text only for now
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        const newMsg = {
          id: res.data.message._id,
          content: res.data.message.content,
          attachments: res.data.message.attachments || [],
          sender: {
            id: res.data.message.sender._id,
            name:
              `${res.data.message.sender.firstName || ""} ${
                res.data.message.sender.lastName || ""
              }`.trim() || "Unknown User",
            avatar:
              res.data.message.sender.avatar ||
              "https://randomuser.me/api/portraits/lego/2.jpg",
          },
          time: new Date(res.data.message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "sent",
        };

        setMessages((prev) => [...prev, newMsg]);
        setFilteredMessages((prev) => [...prev, newMsg]);
        setNewMessage("");

        // Emit through socket
        socket.emit("send-message", {
          chatId,
          message: res.data.message,
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !chatId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const uploadRes = await api.post("/upload", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadRes.data.success) {
        const fileUrl = uploadRes.data.data.url;
        let fileType = "document";
        if (file.type.startsWith("image/")) fileType = "image";
        else if (file.type.startsWith("video/")) fileType = "video";
        else if (file.type.startsWith("audio/")) fileType = "audio";

        const attachment = {
          url: fileUrl,
          type: fileType,
          name: file.name,
        };

        const res = await api.post(
          "/message",
          {
            chatId,
            content: "",
            attachments: [attachment],
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (res.data.success) {
          const newMsg = {
            id: res.data.message._id,
            content: res.data.message.content,
            attachments: res.data.message.attachments || [],
            sender: {
              id: res.data.message.sender._id,
              name: `${res.data.message.sender.firstName || ""} ${
                res.data.message.sender.lastName || ""
              }`.trim() || "Unknown User",
              avatar: res.data.message.sender.avatar || "https://randomuser.me/api/portraits/lego/2.jpg",
            },
            time: new Date(res.data.message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: "sent",
          };

          setMessages((prev) => [...prev, newMsg]);
          setFilteredMessages((prev) => [...prev, newMsg]);

          socket.emit("send-message", {
            chatId,
            message: res.data.message,
          });
        }
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
      e.target.value = null; // reset input
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredMessages(messages);
    } else {
      const results = messages.filter((msg) =>
        msg.content.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMessages(results);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredMessages(messages);
    setIsSearching(false);
  };

  const handleIconClick = (feature) => {
    if (feature === "Video Call") {
      if (!selectedChat || selectedChat.isGroup) {
        alert("Video call is only available for 1-to-1 chats currently.");
        return;
      }
      setIsVideoCallActive(true);
    } else {
      alert(`${feature} feature coming soon!`);
      navigate("/under-construction");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center relative">
      {isVideoCallActive && (
        <VideoCall 
          chatId={incomingCall ? incomingCall.chatId : chatId}
          targetUserId={incomingCall ? incomingCall.callerId : selectedChat?.targetUserId}
          callerSocketId={incomingCall?.socketId}
          isReceivingCall={!!incomingCall}
          callerName={incomingCall ? incomingCall.callerName : selectedChat?.name}
          offer={incomingCall?.offer}
          onEndCall={() => {
            setIsVideoCallActive(false);
            setIncomingCall(null);
          }}
        />
      )}
      {/* Header */}
      <div className="flex items-center justify-between bg-[#202c33] p-3 text-white">
        <div className="flex items-center space-x-3">
          <img
            src={
              selectedChat?.avatar ||
              "https://randomuser.me/api/portraits/women/45.jpg"
            }
            alt={selectedChat?.name || "Chat"}
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={onAvatarClick}
          />
          <span className="font-semibold text-sm sm:text-base">
            {selectedChat?.name || "Select a chat"}
          </span>
        </div>
        <div className="flex space-x-4">
          <Video
            className="w-5 h-5 cursor-pointer"
            onClick={() => handleIconClick("Video Call")}
          />
          <Search
            className="w-5 h-5 cursor-pointer"
            onClick={() => setIsSearching(!isSearching)}
          />
          <MoreVertical
            className="w-5 h-5 cursor-pointer"
            onClick={() => setIsChatOptionOpen(!isChatOptionOpen)}
          />
        </div>
        <ChatOptionsModal
          isOpen={isChatOptionOpen}
          onClose={() => setIsChatOptionOpen(false)}
          chatId={chatId}
          selectedChat={selectedChat}
        />
      </div>

      {/* Search Bar */}
      {isSearching && (
        <div className="bg-[#111b21] p-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search messages"
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 px-3 py-1 rounded-md text-sm bg-[#2a3942] text-white focus:outline-none"
            autoFocus
          />
          <X
            className="w-4 h-4 text-gray-400 cursor-pointer"
            onClick={clearSearch}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
        {chatId ? (
          filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.type === "sent" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] ${
                    msg.type === "sent" ? "bg-[#005c4b]" : "bg-[#2a2f32]"
                  } text-white rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm relative whitespace-pre-line break-words overflow-hidden`}
                >
                  <div className="font-semibold text-xs text-green-400 mb-1">{msg.sender.name}</div>
                  
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-2">
                      {msg.attachments.map((att, i) => (
                        <div key={i} className="rounded-md overflow-hidden bg-black/20 p-1 mb-1 max-w-[200px]">
                          {att.type === "image" ? (
                            <img src={att.url} alt={att.name} className="w-full h-auto object-cover rounded" />
                          ) : att.type === "video" ? (
                            <video src={att.url} controls className="w-full max-w-full rounded"></video>
                          ) : att.type === "audio" ? (
                            <audio src={att.url} controls className="w-full max-w-[180px]"></audio>
                          ) : (
                            <a href={att.url} target="_blank" rel="noreferrer" className="flex items-center text-blue-300 hover:underline break-all">
                              📎 {att.name}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.content}
                  <div className="text-[8px] sm:text-[10px] text-gray-300 text-right mt-1 inline-block float-right ml-2">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400 text-sm">
              No messages found.
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400 text-sm">
            Select a chat to start messaging
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {chatId && (
        <div className="flex items-center bg-[#202c33] p-2 sm:p-3 gap-2 sm:gap-3">
          <Plus
            className="w-4 sm:w-5 h-4 sm:h-5 text-white cursor-pointer"
            onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
          />
          <AttachmentMenu
            isOpen={isAttachmentOpen}
            onClose={() => setIsAttachmentOpen(false)}
            onOptionClick={(option) => {
              setIsAttachmentOpen(false);
              if (["Photos & videos", "Document", "Audio"].includes(option)) {
                let acceptStr = "*/*";
                if (option === "Photos & videos") acceptStr = "image/*,video/*";
                if (option === "Document") acceptStr = ".pdf,.doc,.docx,.xls,.xlsx,.txt";
                if (option === "Audio") acceptStr = "audio/*";
                
                fileInputRef.current.setAttribute("accept", acceptStr);
                fileInputRef.current.click();
              } else {
                alert(`${option} clicked! (Coming soon)`);
              }
            }}
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 rounded-full bg-[#2a3942] text-xs sm:text-sm text-white px-3 sm:px-4 py-1 sm:py-2 focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Send
            className="w-4 sm:w-5 h-4 sm:h-5 text-white cursor-pointer"
            onClick={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
