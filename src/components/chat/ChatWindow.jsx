import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import socket from "../../socket/socket";

function ChatWindow({ activeUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Target User ID extract karein (object ya direct ID dono handle honge)
  const targetUserId =
    activeUser?._id || (typeof activeUser === "string" ? activeUser : null);
  const currentUserId = localStorage.getItem("userId");

  // Auto-scroll to bottom on message update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Agar koi user select nahi hai toh reset karo aur request mat bhejo
    if (!targetUserId) {
      setMessages([]);
      return;
    }

    // 1. Fetch conversation history with target user
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/messages/${targetUserId}`);
        setMessages(response.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch messages:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // 2. Real-time Socket Setup
    if (socket) {
      socket.emit("joinChat", targetUserId);

      const handleReceiveMessage = (incomingMsg) => {
        const sender = incomingMsg.senderId || incomingMsg.sender || incomingMsg.userId;
        const receiver = incomingMsg.receiverId || incomingMsg.receiver;

        // Sirf tab add karein jab message is conversation ka ho
        if (
          sender === targetUserId ||
          receiver === targetUserId ||
          sender === currentUserId
        ) {
          setMessages((prev) => [...prev, incomingMsg]);
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [targetUserId, currentUserId]);

  // Send Message Handler
  const sendMessage = async () => {
    if (!text.trim() || !targetUserId) return;

    const messageText = text.trim();
    setText(""); // Optimistic input clear

    const messagePayload = {
      receiverId: targetUserId,
      text: messageText,
      message: messageText, // dono keys provide kar di gayi hain compatibility ke liye
    };

    try {
      const response = await API.post("/messages", messagePayload);
      const savedMessage = response.data;

      // Local State update
      setMessages((prev) => [...prev, savedMessage]);

      // Socket Emit for instant sync
      if (socket) {
        socket.emit("sendMessage", savedMessage);
      }
    } catch (error) {
      console.error(
        "Failed to send message:",
        error.response?.data || error.message
      );
      // Agar fail ho jaye toh text wapas restore kar sakte hain
      setText(messageText);
    }
  };

  // Agar koi user select nahi hai toh placeholder show karein
  if (!activeUser || !targetUserId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-500 select-none">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
          <svg
            className="w-8 h-8 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-400">
          Select a user to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-white min-w-0">
      {/* Chat Header */}
      <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/60 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shrink-0 overflow-hidden">
            {activeUser.avatar ? (
              <img
                src={activeUser.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              activeUser.username?.[0]?.toUpperCase() ||
              activeUser.name?.[0]?.toUpperCase() ||
              "U"
            )}
          </div>
          <div className="overflow-hidden text-left">
            <h3 className="text-sm font-semibold text-white truncate">
              {activeUser.name || activeUser.username}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              @{activeUser.username || "user"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
            No messages yet. Send a message to start conversation!
          </div>
        ) : (
          messages.map((msg, index) => {
            const sender =
              msg.senderId?._id || msg.senderId || msg.sender || msg.userId;
            const isMe =
              sender?.toString() === currentUserId?.toString();

            return (
              <div
                key={msg._id || index}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-950/40"
                      : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50"
                  }`}
                >
                  <p className="break-words">{msg.text || msg.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3 items-center shrink-0">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-full bg-slate-800 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-700"
        />

        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-full font-medium text-sm transition-colors text-white shadow-lg shadow-emerald-900/30"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;