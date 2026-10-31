import React from "react";
import { Search } from "lucide-react";
import UserSearch from "./UserSearch";

function TopNavbar({
  isLoggedIn,
  onSelectUser,
  onProfileClick,
  onLogout,
  onFollowChange
}) {
  return (
    <nav className="
      h-16
      w-full
      bg-[#0D1425]
      border-b border-white/[0.07]
      px-3 sm:px-4 md:px-6
      flex items-center justify-between
      gap-2
      text-white
      sticky top-0 z-50
      shrink-0
    ">

      {/* Left Side: Logo + Search */}
      <div className="
        flex items-center
        gap-2 sm:gap-4 md:gap-6
        min-w-0 flex-1
      ">

        {/* Logo */}
        <a
          href="/"
          className="
            text-lg sm:text-xl
            font-bold tracking-wide
            text-blue-400 hover:text-violet-400
            shrink-0
            transition-colors
          "
        >
          MyApp<span className="text-white">.</span>
        </a>

        {/* Search Bar */}
        {isLoggedIn && (
          <div className="flex-1 min-w-0 max-w-md">
            <UserSearch
              onSelectUser={onSelectUser}
              onFollowChange={onFollowChange}
            />
          </div>
        )}

      </div>

      {/* Right Side: Auth + Profile */}
      <div className="
        flex items-center
        gap-2 sm:gap-3 md:gap-4
        shrink-0
      ">

        {isLoggedIn ? (
          <>
            {/* Logout */}
            <button
              onClick={onLogout}
              className="
                text-xs sm:text-sm
                font-medium
                text-slate-300
                hover:text-red-400
                transition-colors
                px-2 sm:px-3
                py-1.5
                rounded-lg
                border border-white/[0.10]
                hover:border-red-500/30
                whitespace-nowrap
              "
            >
              Logout
            </button>

            {/* Profile */}
            <button
              onClick={onProfileClick}
              className="
                w-9 h-9
                rounded-full
                bg-gradient-to-br from-blue-500 to-violet-600
                flex items-center justify-center
                text-sm font-bold
                text-white
                border border-blue-400/40
                hover:ring-2 hover:ring-blue-400/50
                transition-all
                shrink-0
              "
              title="My Profile"
            >
              P
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="
                text-xs sm:text-sm
                font-medium
                text-slate-300 hover:text-white
                px-2 sm:px-3 py-1.5
                whitespace-nowrap
                transition-colors
              "
            >
              Login
            </a>

            <a
              href="/signup"
              className="
                text-xs sm:text-sm
                font-medium
                bg-gradient-to-r from-blue-500 to-violet-600
                hover:from-blue-400 hover:to-violet-500
                text-white
                px-3 sm:px-4 py-1.5
                rounded-full
                transition-colors
                whitespace-nowrap
              "
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