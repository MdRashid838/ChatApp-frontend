import { useState, useEffect } from "react";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";

import TopNavbar from "../components/sidebar/TopNavbar";
import Navbar from "../components/sidebar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ProfilePanel from "../components/profile/ProfilePanel";
import API from "../api/axios";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const [activeProfileUserId, setActiveProfileUserId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFollowUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("userId");

    setIsLoggedIn(!!token);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setIsLoggedIn(false);
    setSelectedChat(null);
    setActiveProfileUserId(null);
    setShowProfile(false);
  };

  // Search se user select
  const handleSelectFromSearch = (user) => {
    setActiveProfileUserId(user._id);
    setShowProfile(true);
  };

  // My Profile
  const handleMyProfileClick = () => {
    setSelectedChat(null);
    setActiveProfileUserId(null);
    setShowProfile((prev) => !prev);
  };

  // Sidebar se chat select
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowProfile(false);
  };

  // Mobile Back Button
  const handleBackToChats = () => {
    setSelectedChat(null);
  };

  // Profile se chat start
  const handleStartChatFromProfile = async (targetUser) => {
    try {
      const res = await API.post("/chat", {
        userId: targetUser._id,
      });

      const chatData = res.data;

      setSelectedChat(chatData);
      setShowProfile(false);

      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Start chat error:", err);
    }
  };

  return (
   <div className="
  relative flex flex-col
  h-dvh min-h-0 w-full
  overflow-hidden
  bg-[#080D1A]
  text-white
  selection:bg-blue-500/30
">
      {/* Background Glow */}
      <div
        className="
        pointer-events-none
        absolute inset-0
        overflow-hidden
      "
      >
        <div
          className="
          absolute -top-40 -left-40
          h-96 w-96
          rounded-full
          bg-blue-600/10
          blur-[120px]
        "
        />

        <div
          className="
          absolute -bottom-40 -right-40
          h-96 w-96
          rounded-full
          bg-violet-600/10
          blur-[120px]
        "
        />
      </div>

      {/* Top Navbar */}
      <div className="relative z-20 shrink-0">
        <TopNavbar
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onProfileClick={handleMyProfileClick}
          onSelectUser={handleSelectFromSearch}
          onFollowChange={handleFollowUpdate}
        />
      </div>

      {/* Main Content */}
      <div
        className="
        relative z-10
        flex flex-1
        min-h-0 min-w-0
        w-full
        overflow-hidden
        pb-16 md:pb-0
      "
      >
        {isLoggedIn ? (
          <>
            {/* Left Navbar */}
           <div
  className="
    absolute bottom-0 left-0 right-0 z-50
    md:relative md:inset-auto md:z-10
    shrink-0
    border-t md:border-t-0
    border-r-0 md:border-r
    border-white/[0.06]
    bg-[#0D1425]/95
    backdrop-blur-xl
  "
>
  <Navbar />
</div>

            {/* Sidebar */}
            <div
              className={`
              h-full
              w-full md:w-auto
              shrink-0
              min-w-0
              overflow-hidden
              border-r border-white/[0.06]
              bg-[#0D1425]/80
              backdrop-blur-xl
              ${selectedChat ? "hidden md:flex" : "flex"}
            `}
            >
              <Sidebar
                key={`sidebar-${refreshTrigger}`}
                selectedChatId={selectedChat?._id}
                onSelectChat={handleSelectChat}
              />
            </div>

            {/* Chat Window */}
            <div
              className={`
              relative
              flex-1
              min-w-0 min-h-0
              h-full
              flex-col
              overflow-hidden
              bg-[#080D1A]/90
              ${selectedChat ? "flex" : "hidden md:flex"}
            `}
            >
              {/* Mobile Back Button */}
              {/* {selectedChat && (
                <button
                  onClick={handleBackToChats}
                  className="
                    md:hidden
                    flex items-center gap-2
                    px-4 py-3
                    shrink-0
                    border-b border-white/[0.07]
                    bg-[#0D1425]
                    text-slate-300
                    hover:text-white
                    transition-all duration-200
                    active:bg-white/5
                  "
                >
                  <ArrowLeft size={19} />

                  <span className="text-sm font-medium">
                    Back to Chats
                  </span>
                </button>
              )} */}

              <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
                <ChatWindow
                  activeChat={selectedChat}
                  onBack={() => setSelectedChat(null)}
                />
              </div>
            </div>

            {/* Profile Drawer */}
            {/* Profile Drawer */}
            {showProfile && (
              <div
                className="
      fixed inset-0 z-[60]
      md:absolute md:inset-y-0 md:right-0 md:left-auto
      w-full md:w-80
      h-full
      overflow-y-auto
      bg-[#0D1425]
      border-l border-white/[0.07]
      shadow-2xl shadow-black/40
    "
              >
                <ProfilePanel
                  key={`${activeProfileUserId || "my-profile"}-${refreshTrigger}`}
                  targetUserId={activeProfileUserId}
                  onFollowChange={handleFollowUpdate}
                  onStartChat={handleStartChatFromProfile}
                  onClose={() => setShowProfile(false)}
                />
              </div>
            )}
          </>
        ) : (
          /* Login Required Screen */
          <div
            className="
            flex-1
            flex items-center justify-center
            min-w-0
            px-5
          "
          >
            <div
              className="
              relative
              w-full max-w-md
              overflow-hidden
              rounded-3xl
              border border-white/[0.08]
              bg-[#0D1425]/90
              p-8 sm:p-10
              text-center
              shadow-[0_25px_80px_rgba(0,0,0,0.35)]
              backdrop-blur-xl
            "
            >
              {/* Card Glow */}
              <div
                className="
                absolute -top-20 left-1/2
                h-40 w-40
                -translate-x-1/2
                rounded-full
                bg-blue-600/20
                blur-[70px]
              "
              />

              <div className="relative">
                <div
                  className="
                  mx-auto mb-6
                  flex h-20 w-20
                  items-center justify-center
                  rounded-3xl
                  border border-blue-400/20
                  bg-gradient-to-br
                  from-blue-500/20
                  to-violet-500/20
                  shadow-lg shadow-blue-500/10
                "
                >
                  <MessageCircle size={38} className="text-blue-400" />
                </div>

                <div
                  className="
                  mb-3
                  flex items-center justify-center gap-2
                  text-xs font-semibold
                  uppercase tracking-[0.2em]
                  text-blue-400
                "
                >
                  <Sparkles size={14} />
                  Welcome to ChatApp
                </div>

                <h2
                  className="
                  text-2xl sm:text-3xl
                  font-bold
                  tracking-tight
                  text-white
                "
                >
                  Your conversations
                  <span
                    className="
                    block mt-1
                    bg-gradient-to-r
                    from-blue-400
                    to-violet-400
                    bg-clip-text
                    text-transparent
                  "
                  >
                    start here.
                  </span>
                </h2>

                <p
                  className="
                  mt-4
                  text-sm sm:text-base
                  leading-7
                  text-slate-400
                "
                >
                  Please login to continue and connect with your friends, share
                  moments and enjoy real-time conversations.
                </p>

                <div
                  className="
                  mt-7
                  flex items-center justify-center gap-2
                  rounded-xl
                  border border-white/[0.06]
                  bg-white/[0.03]
                  px-4 py-3
                  text-xs sm:text-sm
                  text-slate-400
                "
                >
                  <span
                    className="
                    h-2 w-2
                    rounded-full
                    bg-blue-400
                    shadow-[0_0_10px_rgba(96,165,250,0.8)]
                  "
                  />
                  Secure and private conversations
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
