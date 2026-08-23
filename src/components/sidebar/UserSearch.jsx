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
        const res = await API.get(`/user/search?q=${encodeURIComponent(searchQuery)}`);
        
        // Check karo ki current user already follow kar raha hai ya nahi
        const formatted = res.data.map((user) => ({
          ...user,
          isFollowing: user.followers?.some(
            (f) => (typeof f === "object" ? f._id : f) === currentUserId
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

  // Follow / Unfollow Button Click Handler
  const handleFollowToggle = async (e, user) => {
    e.stopPropagation(); // Profile card open hone se roko

    try {
      if (user.isFollowing) {
        await API.post(`/user/unfollow/${user._id}`);
      } else {
        await API.post(`/user/follow/${user._id}`);
      }

      // UI me instant button state toggle karo
      setResults((prev) =>
        prev.map((item) =>
          item._id === user._id ? { ...item, isFollowing: !item.isFollowing } : item
        )
      );

      // Home & ProfilePanel ko update ka signal bhejo
      if (onFollowChange) {
        onFollowChange();
      }
    } catch (err) {
      console.error("Follow/Unfollow error:", err.response?.data || err.message);
    }
  };

  const handleSelect = (user) => {
    onSelectUser(user);
    setSearchQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-64 md:w-80">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 text-sm rounded-full pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-400"
        />
        <svg
          className="w-4 h-4 absolute left-3 top-2.5 text-slate-400"
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

      {searchQuery.trim() && (
        <div className="absolute top-12 left-0 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto">
          {loading && <p className="p-3 text-xs text-slate-400 text-center">Searching...</p>}

          {!loading && results.length === 0 && (
            <p className="p-3 text-xs text-slate-400 text-center">No user found</p>
          )}

          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelect(user)}
              className="flex items-center justify-between p-3 hover:bg-slate-800 cursor-pointer border-b border-slate-800/40 last:border-none transition-colors"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user.username}</p>
                  <p className="text-xs text-slate-400 truncate">{user.name}</p>
                </div>
              </div>

              {/* Follow / Unfollow Button */}
              <button
                onClick={(e) => handleFollowToggle(e, user)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  user.isFollowing
                    ? "bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 border border-slate-700"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
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