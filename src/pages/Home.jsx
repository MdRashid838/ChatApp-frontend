import { useState, useEffect } from "react";
import TopNavbar from "../components/sidebar/TopNavbar";
import Navbar from "../components/sidebar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ProfilePanel from "../components/profile/ProfilePanel";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Chat window active user
  const [activeProfileUserId, setActiveProfileUserId] = useState(null); // Profile panel user ID
  const [showProfile, setShowProfile] = useState(false);
  
  // Follow/Unfollow realtime sync trigger
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
    setSelectedUser(null);
    setActiveProfileUserId(null);
    setShowProfile(false);
  };

  // Jab Search dropdown se koi user select karein
  const handleSelectFromSearch = (user) => {
    setActiveProfileUserId(user._id);
    setShowProfile(true);
  };

  // Jab TopNavbar ke Profile icon par click karein (Logged-in user profile)
  const handleMyProfileClick = () => {
    setActiveProfileUserId(null); // null = current logged-in user
    setShowProfile(true);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-white overflow-hidden">
      {/* Top Navbar */}
      <TopNavbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onProfileClick={handleMyProfileClick}
        onSelectUser={handleSelectFromSearch}
        onFollowChange={handleFollowUpdate}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 w-full overflow-hidden">
        {isLoggedIn ? (
          <>
            {/* App Left Nav & User Chat List */}
            <Navbar />
            <Sidebar onSelectUser={(user) => setSelectedUser(user)} />
            
            {/* Active Chat Window */}
            <div className="flex-1 flex flex-col h-full min-w-0">
              <ChatWindow activeUser={selectedUser} />
            </div>

            {/* Profile Drawer / Panel */}
            {/* {showProfile && (
              <div className="w-80 h-full border-l border-slate-800">
                <ProfilePanel
                  key={`${activeProfileUserId || "my-profile"}-${refreshTrigger}`}
                  targetUserId={activeProfileUserId}
                  onFollowChange={handleFollowUpdate}
                  onStartChat={(user) => {
                    setSelectedUser(typeof user === "object" ? user : { _id: user });
                    setShowProfile(false);
                  }}
                />
              </div>
            )} */}

            // Home.jsx ke andar:
{showProfile && (
  <div className="w-80 h-full border-l border-slate-800">
    <ProfilePanel
      key={`${activeProfileUserId || "my-profile"}-${refreshTrigger}`}
      targetUserId={activeProfileUserId}
      onFollowChange={handleFollowUpdate}
      onStartChat={(userObj) => {
        // userObj direct selectedUser banega
        setSelectedUser(userObj);
        setShowProfile(false); // Chat view par aane ke liye profile close
      }}
    />
  </div>
)}
          </>
        ) : (
          /* Logged Out Graphic Placeholder */
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-6 text-center select-none">
            <div className="max-w-md flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center mb-6 shadow-2xl">
                <svg
                  className="w-20 h-20 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-medium text-slate-300 mb-2 tracking-tight">
                Chat Application for Web
              </h2>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-12">
                Send and receive messages without keeping your phone online.
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;