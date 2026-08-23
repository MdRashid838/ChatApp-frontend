import React, { useState, useEffect } from "react";
import API from "../../api/axios";

function ProfilePanel({ targetUserId, onFollowChange, onStartChat }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Agar targetUserId diya hai toh /user/profile/:id, warna direct /user/profile
        const endpoint = targetUserId
          ? `/user/profile/${targetUserId}`
          : `/user/profile`;

        const res = await API.get(endpoint);
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId]);

  // Follow / Unfollow Toggle Handler
  const handleFollowToggle = async () => {
    if (!profile || profile.isSelf) return;

    const previousState = { ...profile };

    // Instant UI update
    setProfile((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followersCount: prev.isFollowing
        ? Math.max(0, prev.followersCount - 1)
        : prev.followersCount + 1,
    }));

    try {
      if (previousState.isFollowing) {
        await API.post(`/user/unfollow/${profile._id}`);
      } else {
        await API.post(`/user/follow/${profile._id}`);
      }

      if (onFollowChange) onFollowChange();
    } catch (err) {
      console.error("Follow error:", err);
      setProfile(previousState);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-900 text-slate-400 text-sm">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-900 text-slate-400 text-sm">
        User not found
      </div>
    );
  }

  // Check if it's the logged-in user's profile
  const isOwnProfile = profile.isSelf || profile._id === currentUserId;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-6 overflow-y-auto">
      {/* Avatar & User Details */}
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold border-2 border-blue-400 shadow-xl overflow-hidden mb-3">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          ) : (
            profile.username?.[0]?.toUpperCase() || "U"
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-100">
          {profile.name || profile.username}
        </h3>
        <p className="text-sm text-slate-400 mb-2">@{profile.username}</p>

        {profile.bio && (
          <p className="text-xs text-slate-300 max-w-xs mb-3">{profile.bio}</p>
        )}
      </div>

      {/* Followers & Following Counters */}
      <div className="flex justify-around items-center bg-slate-800/80 rounded-xl p-3 my-4 border border-slate-700/60 shadow-inner">
        <div className="text-center flex-1">
          <p className="text-lg font-bold text-white">
            {profile.followersCount ?? 0}
          </p>
          <p className="text-xs text-slate-400 font-medium">Followers</p>
        </div>
        <div className="h-8 w-px bg-slate-700" />
        <div className="text-center flex-1">
          <p className="text-lg font-bold text-white">
            {profile.followingCount ?? 0}
          </p>
          <p className="text-xs text-slate-400 font-medium">Following</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-col gap-2">
        {isOwnProfile ? (
          /* Khud ki profile pe sirf Edit Profile ka option */
          <button
            onClick={() => alert("Open Edit Profile Modal / Form")}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-medium text-sm text-blue-400 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Profile
          </button>
        ) : (
          /* Dusre user ki profile pe Follow / Unfollow aur Message */
          <>
            <button
              onClick={handleFollowToggle}
              className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                profile.isFollowing
                  ? "bg-slate-800 border border-slate-700 hover:border-red-500/40 hover:text-red-400 text-slate-300"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
              }`}
            >
              {profile.isFollowing ? "Unfollow" : "Follow"}
            </button>
            {/* // ProfilePanel.jsx ke andar Action Buttons section: */}
            <button
              onClick={() => {
                // Pura profile object bhej rahe hain jisme _id, username, name, avatar sab hai
                if (onStartChat) {
                  onStartChat(profile);
                }
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-medium text-sm text-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Message
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePanel;
