import { useEffect, useState } from "react";
import API from "../../api/axios";

function Sidebar({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        setLoading(true);
        const res = await API.get("/chat"); // backend /api/chat route
        setUsers(res.data || []);
      } catch (error) {
        console.error("Failed to fetch followers/following list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatUsers();
  }, []);

  return (
    <div className="w-[320px] md:w-[350px] border-r border-slate-800 p-4 overflow-y-auto bg-slate-950 text-white flex flex-col h-full shrink-0">
      <div className="flex items-center justify-between mb-4 px-2">
        <h1 className="text-xl font-bold text-slate-100">Messages</h1>
        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700">
          {users.length} Contacts
        </span>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-slate-500 text-xs text-center py-6">Loading followers...</p>
        ) : users.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-slate-400 text-sm font-medium">No followers or following yet</p>
            <p className="text-slate-600 text-xs mt-1">
              Search and follow users above to start chatting with them.
            </p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => onSelectUser(user)} // ChatWindow ko user pass karega
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 cursor-pointer border border-slate-800/40 transition-all hover:border-slate-700"
            >
              {/* User Avatar */}
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shrink-0 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.username?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || "U"
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 text-left">
                <h2 className="font-semibold text-sm text-slate-200 truncate">
                  {user.name || user.username}
                </h2>
                <p className="text-slate-400 text-xs truncate">
                  @{user.username}
                </p>
              </div>

              {/* Chat Indicator */}
              <div className="text-slate-500 hover:text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;