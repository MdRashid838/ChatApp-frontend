import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import {
  MessageCircle,
  UserRound,
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
  Pencil,
  ShieldCheck,
  X,
  Sparkles,
  AtSign,
} from "lucide-react";

function ProfilePanel({ targetUserId, onFollowChange, onStartChat, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showFollowList, setShowFollowList] = useState(false);
  const [followListType, setFollowListType] = useState("followers");
  const [followUsers, setFollowUsers] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const [followLoading, setFollowLoading] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  // Close Button - All UI States
  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      className="
        absolute top-4 left-4 z-[100]
        flex items-center justify-center
        w-10 h-10
        rounded-full
        bg-black/50
        border border-white/20
        text-white
        backdrop-blur-md
        shadow-lg
        hover:bg-black/70
        transition-all
      "
      aria-label="Close profile"
    >
      <X size={20} />
    </button>
  );

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setProfile(null);

        const endpoint = targetUserId
          ? `/user/profile/${targetUserId}`
          : "/user/profile";

        const res = await API.get(endpoint);
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId]);

  // Follow / Unfollow
  const handleFollowToggle = async () => {
    if (!profile || profile.isSelf || followLoading) return;

    const previousState = { ...profile };

    setFollowLoading(true);

    // Optimistic UI update
    setProfile((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followersCount: prev.isFollowing
        ? Math.max(0, (prev.followersCount || 0) - 1)
        : (prev.followersCount || 0) + 1,
    }));

    try {
      if (previousState.isFollowing) {
        await API.post(`/user/unfollow/${profile._id}`);
      } else {
        await API.post(`/user/follow/${profile._id}`);
      }

      onFollowChange?.();
    } catch (err) {
      console.error("Follow error:", err);
      setProfile(previousState);
    } finally {
      setFollowLoading(false);
    }
  };

  // Followers / Following List
  const handleShowFollowList = async (type) => {
    setFollowListType(type);
    setShowFollowList(true);
    setListLoading(true);
    setFollowUsers([]);

    try {
      const res = await API.get(`/user/${profile._id}/${type}`);
      setFollowUsers(res.data.users || res.data);
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      setFollowUsers([]);
    } finally {
      setListLoading(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="relative isolate min-h-[300px] flex flex-col items-center justify-center gap-4 bg-[#0D1425] text-slate-400">
        {closeButton}

        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />

        <p className="text-sm">Loading profile...</p>
      </div>
    );
  }

  // User Not Found
  if (!profile) {
    return (
      <div className="relative isolate min-h-[300px] flex flex-col items-center justify-center gap-3 bg-[#0D1425] text-slate-400">
        {closeButton}

        <UserRound size={40} className="text-slate-600" />

        <p className="text-sm">Profile not found</p>
      </div>
    );
  }

  const isOwnProfile = profile.isSelf || profile._id === currentUserId;

  const displayName = profile.name || profile.username || "User";

  return (
    <div className="relative isolate flex flex-col min-h-full bg-[#0D1425] text-white">
      {closeButton}

      {/* ================= HEADER ================= */}

      <div className="relative shrink-0">
        {/* Cover Background */}

        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800">
          <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-blue-300/20 blur-3xl" />

          <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-violet-300/20 blur-3xl" />

          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Profile Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 border border-white/10 backdrop-blur-md text-xs text-blue-100">
            <Sparkles size={13} />
            Profile
          </div>

          <div className="absolute bottom-4 left-5">
            <p className="text-xs uppercase tracking-[3px] text-blue-100/70">
              Personal Space
            </p>
          </div>
        </div>

        {/* Avatar */}
        <div className="px-5">
          <div className="relative -mt-14 w-fit">
            <div className="w-28 h-28 rounded-full p-[4px] bg-gradient-to-br from-blue-400 via-violet-500 to-pink-400 shadow-xl shadow-blue-500/20">
              <div className="w-full h-full rounded-full p-[3px] bg-[#0D1425]">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-violet-700 flex items-center justify-center text-3xl font-bold">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    displayName[0]?.toUpperCase() || "U"
                  )}
                </div>
              </div>
            </div>

            {/* Profile Status */}
            <div className="absolute bottom-2 right-1 w-5 h-5 rounded-full bg-green-500 border-[3px] border-[#0D1425]" />
          </div>

          {/* User Details */}
          <div className="mt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white break-words">
                {displayName}
              </h2>

              {isOwnProfile && (
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-500/15 border border-blue-400/20 text-blue-300">
                  YOU
                </span>
              )}
            </div>

            <p className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
              <AtSign size={14} />
              {profile.username}
            </p>

            {profile.bio ? (
              <p className="text-sm text-slate-300 leading-relaxed mt-4 break-words">
                {profile.bio}
              </p>
            ) : (
              <p className="text-sm text-slate-500 italic mt-4">
                No bio added yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 gap-3 px-5 mt-6">
        <button
          type="button"
          onClick={() => handleShowFollowList("followers")}
          className="group rounded-2xl p-4 text-left bg-[#172238] border border-slate-700/60 hover:border-blue-500/50 hover:bg-[#1B2A44] transition-all"
        >
          <div className="flex items-center justify-between">
            <Users size={19} className="text-blue-400" />

            <span className="text-xs text-slate-500 group-hover:text-blue-400 transition">
              View
            </span>
          </div>

          <p className="text-2xl font-bold mt-3">
            {profile.followersCount ?? 0}
          </p>

          <p className="text-xs text-slate-400 mt-1">Followers</p>
        </button>

        <button
          type="button"
          onClick={() => handleShowFollowList("following")}
          className="group rounded-2xl p-4 text-left bg-[#172238] border border-slate-700/60 hover:border-violet-500/50 hover:bg-[#1B2A44] transition-all"
        >
          <div className="flex items-center justify-between">
            <UserPlus size={19} className="text-violet-400" />

            <span className="text-xs text-slate-500 group-hover:text-violet-400 transition">
              View
            </span>
          </div>

          <p className="text-2xl font-bold mt-3">
            {profile.followingCount ?? 0}
          </p>

          <p className="text-xs text-slate-400 mt-1">Following</p>
        </button>
      </div>

      {/* ================= ACTION BUTTONS ================= */}

      <div className="px-5 mt-6 space-y-3">
        {isOwnProfile ? (
          <button
            type="button"
            onClick={() => alert("Open Edit Profile Modal / Form")}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all"
          >
            <Pencil size={17} />
            Edit Profile
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={followLoading}
              onClick={handleFollowToggle}
              className={`w-full h-12 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 ${
                profile.isFollowing
                  ? "bg-[#172238] border border-slate-700 text-slate-200 hover:border-red-500/50 hover:text-red-400"
                  : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-600/20"
              }`}
            >
              {profile.isFollowing ? (
                <>
                  <UserMinus size={17} />
                  {followLoading ? "Please wait..." : "Unfollow"}
                </>
              ) : (
                <>
                  <UserCheck size={17} />
                  {followLoading ? "Please wait..." : "Follow"}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onStartChat?.(profile)}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#172238] border border-slate-700/70 hover:border-blue-500/50 hover:bg-[#1B2A44] font-semibold text-sm text-slate-200 transition-all"
            >
              <MessageCircle size={18} className="text-blue-400" />
              Message
            </button>
          </>
        )}
      </div>

      {/* ================= PROFILE FOOTER ================= */}

      <div className="mt-auto px-5 py-6">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 border-t border-slate-800 pt-5">
          <ShieldCheck size={15} className="text-green-400" />
          Your connections, your community.
        </div>
      </div>

      {/* ================= FOLLOWERS MODAL ================= */}

      {showFollowList && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowFollowList(false)}
        >
          <div
            className="w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden rounded-3xl border border-slate-700/70 bg-[#101A2D] shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700/60">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {followListType === "followers" ? "Followers" : "Following"}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  {followUsers.length} people
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFollowList(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              {listLoading ? (
                <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
                  <div className="w-9 h-9 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />

                  <p className="text-sm">Loading users...</p>
                </div>
              ) : followUsers.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-3 text-slate-500">
                  <Users size={35} />

                  <p className="text-sm">No users found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {followUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#1B2A44] transition-colors"
                    >
                      <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-violet-700 flex items-center justify-center font-bold text-white">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.username?.[0]?.toUpperCase() || "U"
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.name || user.username}
                        </p>

                        <p className="text-xs text-slate-400 truncate mt-1">
                          @{user.username}
                        </p>
                      </div>

                      <div className="text-blue-400">
                        <UserRound size={18} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePanel;