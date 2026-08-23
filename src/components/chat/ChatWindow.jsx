import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import socket from "../../socket/socket";

function ChatWindow({ activeChat }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const chatId = activeChat?._id;
  const currentUserId = localStorage.getItem("userId");

  // Opponent user details extract karein
  const otherUser =
    activeChat?.participants?.find(
      (p) => (p._id || p).toString() !== currentUserId?.toString()
    ) || {};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    // 1. Fetch Chat Messages
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/messages/${chatId}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Messages fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // 2. Socket Room Join & Listener
    if (socket) {
      socket.emit("joinChat", chatId);

      const handleReceiveMessage = (newMsg) => {
        const msgChatId = newMsg.chatId || newMsg.chat?._id || newMsg.chat;

        if (msgChatId?.toString() === chatId.toString()) {
          setMessages((prev) => {
            const exists = prev.some((m) => m._id === newMsg._id);
            if (exists) return prev;
            return [...prev, newMsg];
          });
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [chatId]);

  // Send Message
  const sendMessage = async () => {
    if (!text.trim() || !chatId) return;

    const messageText = text.trim();
    setText("");

    try {
      const res = await API.post("/messages", {
        chatId: chatId,
        text: messageText,
      });

      const savedMessage = res.data;

      // Local state update
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === savedMessage._id);
        if (exists) return prev;
        return [...prev, savedMessage];
      });

      // Socket emit for real-time delivery
      if (socket) {
        socket.emit("sendMessage", savedMessage);
      }
    } catch (err) {
      console.error("Send message error:", err.response?.data || err.message);
      setText(messageText);
    }
  };

  if (!activeChat || !chatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-500 select-none">
        <p className="text-sm font-medium">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-white min-w-0">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 px-6 flex items-center gap-3 bg-slate-900/60 shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shrink-0 overflow-hidden">
          {otherUser.avatar ? (
            <img src={otherUser.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            otherUser.username?.[0]?.toUpperCase() || "U"
          )}
        </div>
        <div className="overflow-hidden text-left">
          <h3 className="text-sm font-semibold text-white truncate">
            {otherUser.name || otherUser.username}
          </h3>
          <p className="text-xs text-slate-400 truncate">@{otherUser.username}</p>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {loading ? (
          <div className="text-center text-xs text-slate-500 py-4">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-4">No messages yet. Say hi!</div>
        ) : (
          messages.map((msg, idx) => {
            const senderId = msg.sender?._id || msg.sender;
            const isMe = senderId?.toString() === currentUserId?.toString();

            return (
              <div
                key={msg._id || idx}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-br-none shadow-md"
                      : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50"
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3 items-center shrink-0">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-full bg-slate-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-700"
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-3 rounded-full text-sm font-medium transition-colors text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;