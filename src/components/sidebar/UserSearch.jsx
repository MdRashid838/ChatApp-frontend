import React, { useState, useEffect } from "react";
import API from "../../api/axios";

function UserSearch({ onSelectUser, onFollowChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const delayTimer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await API.get(
          `/user/search?q=${encodeURIComponent(searchQuery)}`
        );

        const formatted = res.data.map((user) => ({
          ...user,
          isFollowing: user.followers?.some(
            (f) =>
              (typeof f === "object" ? f._id : f) === currentUserId
          ),
        }));

        setResults(formatted);
      } catch (err) {
        console.error("Search API error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayTimer);
  }, [searchQuery, currentUserId]);

  // Follow / Unfollow
  const handleFollowToggle = async (e, user) => {
    e.stopPropagation();

    try {
      if (user.isFollowing) {
        await API.post(`/user/unfollow/${user._id}`);
      } else {
        await API.post(`/user/follow/${user._id}`);
      }

      setResults((prev) =>
        prev.map((item) =>
          item._id === user._id
            ? { ...item, isFollowing: !item.isFollowing }
            : item
        )
      );

      if (onFollowChange) {
        onFollowChange();
      }
    } catch (err) {
      console.error(
        "Follow/Unfollow error:",
        err.response?.data || err.message
      );
    }
  };

  // Select User
  const handleSelect = (user) => {
    onSelectUser(user);
    setSearchQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full min-w-0">

      {/* Search Input */}
      <div className="relative w-full">

        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            w-full
            bg-[#080D1A]
            text-xs sm:text-sm
            rounded-full
            pl-9 pr-3 sm:pr-4
            py-2
            border border-white/[0.08]
            focus:outline-none
            focus:border-blue-500/70
            focus:ring-2 focus:ring-blue-500/10
            text-slate-200
            placeholder-slate-500
            transition-colors
          "
        />

        {/* Search Icon */}
        <svg
          className="
            w-4 h-4
            absolute left-3 top-1/2
            -translate-y-1/2
            text-slate-400
          "
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

      </div>

      {/* Search Results Dropdown */}
      {searchQuery.trim() && (
        <div className="
          absolute
          top-12
          left-0
          w-full
          min-w-[220px]
          bg-[#0D1425]
          border border-white/[0.08]
          rounded-2xl
          shadow-2xl shadow-black/40
          z-[60]
          overflow-hidden
          max-h-64
          overflow-y-auto
        ">

          {loading && (
            <p className="p-3 text-xs text-slate-400 text-center">
              Searching...
            </p>
          )}

          {!loading && results.length === 0 && (
            <p className="p-3 text-xs text-slate-400 text-center">
              No user found
            </p>
          )}

          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelect(user)}
              className="
                flex items-center justify-between
                gap-2
                p-3
                hover:bg-white/[0.04]
                cursor-pointer
                border-b border-white/[0.05]
                last:border-none
                transition-colors
              "
            >

              {/* User Info */}
              <div className="
                flex items-center gap-2 sm:gap-3
                overflow-hidden
                min-w-0
                flex-1
              ">

                <div className="
                  w-8 h-8
                  rounded-full
                  bg-gradient-to-br from-blue-500 to-violet-600
                  flex items-center justify-center
                  text-xs font-bold text-white
                  shrink-0
                ">
                  {user.username
                    ? user.username[0].toUpperCase()
                    : "U"}
                </div>

                <div className="text-left overflow-hidden min-w-0">

                  <p className="
                    text-sm font-medium
                    text-white truncate
                  ">
                    {user.username}
                  </p>

                  <p className="
                    text-xs text-slate-400 truncate
                  ">
                    {user.name}
                  </p>

                </div>
              </div>

              {/* Follow / Unfollow */}
              <button
                onClick={(e) => handleFollowToggle(e, user)}
                className={`
                  text-xs font-semibold
                  px-2 sm:px-3
                  py-1.5
                  rounded-lg
                  transition-all
                  shrink-0
                  ${
                    user.isFollowing
                      ? "bg-white/[0.05] text-slate-300 hover:bg-red-500/10 hover:text-red-400 border border-white/[0.08]"
                      : "bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-400 hover:to-violet-500 text-white"
                  }
                `}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default UserSearch;