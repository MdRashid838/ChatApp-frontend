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
    <div className="
      w-full
      sm:w-full
      md:w-[320px]
      lg:w-[350px]
      border-r border-white/[0.07]
      p-3 sm:p-4
      overflow-hidden
      bg-[#0D1425]
      text-white
      flex flex-col
      h-full
      min-h-0
      min-w-0
      shrink-0
    ">

      {/* Header */}
      <h1 className="
        text-xl font-bold
        mb-4 px-2
        text-slate-100
        shrink-0
      ">
        Messages
      </h1>

      {/* Chat List */}
      <div className="
        space-y-1.5
        flex-1
        min-h-0
        min-w-0
        overflow-y-auto
        overscroll-contain
      ">

        {loading ? (
          <p className="text-slate-500 text-xs text-center py-6">
            Loading conversations...
          </p>
        ) : chats.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-500 text-xs">
            No chats yet. Search a user to message!
          </div>
        ) : (
          chats.map((chat) => {

            const otherUser = chat.participants?.find(
              (p) =>
                (p._id || p).toString() !== currentUserId?.toString()
            ) || {};

            const isSelected = selectedChatId === chat._id;

            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={`
                  flex items-center gap-3
                  p-3 rounded-xl
                  cursor-pointer
                  transition-all duration-200
                  border

                  ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-500/15 to-violet-500/15 border-blue-500/40"
                      : "bg-[#080D1A]/60 hover:bg-white/[0.05] border-white/[0.05]"
                  }
                `}
              >

                {/* Profile Image */}
                <div className="
                  w-11 h-11
                  rounded-full
                  bg-gradient-to-br from-blue-500 to-violet-600
                  flex items-center justify-center
                  font-bold text-sm text-white
                  shrink-0 overflow-hidden
                ">
                  {otherUser.avatar ? (
                    <img
                      src={otherUser.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    otherUser.username?.[0]?.toUpperCase() || "U"
                  )}
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0 text-left">

                  <h2 className="
                    font-medium text-sm
                    text-slate-200
                    truncate
                  ">
                    {otherUser.name || otherUser.username || "Chat"}
                  </h2>

                  <p className="
                    text-slate-400
                    text-xs
                    truncate
                  ">
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