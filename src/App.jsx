import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatSidebar from './components/ChatSidebar'
import ChatWindow from './components/ChatWindow'

const App = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-900 text-white">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden sm:flex w-16 bg-gray-800 border-r border-gray-700">
        <Sidebar />
      </div>

      {/* Chat list sidebar */}
      <div
        id="allchat"
        className="w-10 sm:w-80 md:w-84 bg-gray-900 border-r border-gray-700 overflow-y-auto"
      >
        <ChatSidebar onSelectChat={setSelectedChatId} />
      </div>

      {/* Chat window - Hidden on small screens, visible on md and up */}
      <div className="flex flex-1 bg-chat-pattern bg-cover ">
        <ChatWindow chatId={selectedChatId} />
      </div>
    </div>
  );
};


export default App