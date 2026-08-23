import { useEffect, useState } from "react";
import API from "../../api/axios";

function Sidebar({ onSelectChat, selectedChatId }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/chat");
        setChats(res.data || []);
      } catch (err) {
        console.error("Fetch chats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="w-[320px] md:w-[350px] border-r border-slate-800 p-4 overflow-y-auto bg-slate-950 text-white flex flex-col h-full shrink-0">
      <h1 className="text-xl font-bold mb-4 px-2 text-slate-100">Messages</h1>

      <div className="space-y-1.5 flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-slate-500 text-xs text-center py-6">Loading conversations...</p>
        ) : chats.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-500 text-xs">
            No chats yet. Search a user to message!
          </div>
        ) : (
          chats.map((chat) => {
            // Schema ke participants array se opponent user extract karein
            const otherUser = chat.participants?.find(
              (p) => (p._id || p).toString() !== currentUserId?.toString()
            ) || {};

            const isSelected = selectedChatId === chat._id;

            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-slate-800 border-blue-500/40"
                    : "bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/40"
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shrink-0 overflow-hidden">
                  {otherUser.avatar ? (
                    <img src={otherUser.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    otherUser.username?.[0]?.toUpperCase() || "U"
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h2 className="font-medium text-sm text-slate-200 truncate">
                    {otherUser.name || otherUser.username || "Chat"}
                  </h2>
                  <p className="text-slate-400 text-xs truncate">
                    {chat.lastMessage?.text || "Click to open chat"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sidebar;