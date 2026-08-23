import React from "react";
import UserSearch from "./UserSearch";

function TopNavbar({ isLoggedIn, onSelectUser, onProfileClick, onLogout ,onFollowChange }) {
  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-white sticky top-0 z-50">
      
      {/* 1. Left Side: Logo + Search Bar */}
      <div className="flex items-center gap-6">
        <a href="/" className="text-xl font-bold tracking-wide text-blue-500 hover:text-blue-400">
          MyApp<span className="text-white">.</span>
        </a>

        {/* Search Bar tabhi dikhega jab user logged in ho */}
        {isLoggedIn && <UserSearch onSelectUser={onSelectUser} onFollowChange={onFollowChange} />}
      </div>

      {/* 2. Right Side: Auth buttons & Profile */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={onLogout}
              className="text-sm font-medium text-slate-300 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-slate-700 hover:border-red-500/30"
            >
              Logout
            </button>

            <button
              onClick={onProfileClick}
              className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold border border-blue-400 hover:ring-2 hover:ring-blue-400 transition-all"
              title="My Profile"
            >
              P
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5"
            >
              Login
            </a>
            <a
              href="/signup"
              className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full transition-colors"
            >
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

export default TopNavbar;