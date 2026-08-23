import { useState, useEffect } from "react";
import TopNavbar from "../components/sidebar/TopNavbar";
import Navbar from "../components/sidebar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ProfilePanel from "../components/profile/ProfilePanel";
import API from "../api/axios";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null); // Active Chat room object
  const [activeProfileUserId, setActiveProfileUserId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFollowUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("userId");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setSelectedChat(null);
    setActiveProfileUserId(null);
    setShowProfile(false);
  };

  // Jab search se user select ho
  const handleSelectFromSearch = (user) => {
    setActiveProfileUserId(user._id);
    setShowProfile(true);
  };

  // Profile icon click (My Profile)
  const handleMyProfileClick = () => {
    setActiveProfileUserId(null);
    setShowProfile(true);
  };

  // Profile Panel ke "Message" button par click hone par:
  const handleStartChatFromProfile = async (targetUser) => {
    try {
      // 1. Backend se Chat ID dhoondho ya banao
      const res = await API.post("/chat", { userId: targetUser._id });
      const chatData = res.data;

      // 2. ChatWindow ke liye selectedChat set karo
      setSelectedChat(chatData);

      // 3. Profile panel close karo
      setShowProfile(false);

      // 4. Sidebar me new chat list turant update ho
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Start chat error:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-white overflow-hidden">
      <TopNavbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onProfileClick={handleMyProfileClick}
        onSelectUser={handleSelectFromSearch}
        onFollowChange={handleFollowUpdate}
      />

      <div className="flex flex-1 w-full overflow-hidden">
        {isLoggedIn ? (
          <>
            <Navbar />
            
            {/* Sidebar with refresh trigger */}
            <Sidebar
              key={`sidebar-${refreshTrigger}`}
              selectedChatId={selectedChat?._id}
              onSelectChat={(chat) => setSelectedChat(chat)}
            />

            {/* Chat Window */}
            <div className="flex-1 flex flex-col h-full min-w-0">
              <ChatWindow activeChat={selectedChat} />
            </div>

            {/* Profile Drawer */}
            {showProfile && (
              <div className="w-80 h-full border-l border-slate-800">
                <ProfilePanel
                  key={`${activeProfileUserId || "my-profile"}-${refreshTrigger}`}
                  targetUserId={activeProfileUserId}
                  onFollowChange={handleFollowUpdate}
                  onStartChat={handleStartChatFromProfile}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Please login to continue
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;