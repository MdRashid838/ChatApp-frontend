import { useEffect, useState, useRef } from "react";
import { MessageSquareText, Sparkles, ArrowLeft } from "lucide-react";
import API from "../../api/axios";
import socket from "../../socket/socket";

function ChatWindow({ activeChat, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const chatId = activeChat?._id;
  const currentUserId = localStorage.getItem("userId");

  // Opponent user details
  const otherUser =
    activeChat?.participants?.find(
      (p) => (p._id || p).toString() !== currentUserId?.toString(),
    ) || {};

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Fetch Messages & Socket Connection
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/messages/${chatId}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error(
          "Messages fetch error:",
          err.response?.data || err.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

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

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === savedMessage._id);

        if (exists) return prev;

        return [...prev, savedMessage];
      });

      if (socket) {
        socket.emit("sendMessage", savedMessage);
      }
    } catch (err) {
      console.error("Send message error:", err.response?.data || err.message);

      setText(messageText);
    }
  };

  return (
    <div
      className="
      relative isolate
      flex-1 w-full min-w-0 min-h-0 h-full
      flex flex-col
      overflow-hidden
      bg-[#080D1A]
      text-white
    "
    >
      {/* Premium Background Glow - Same in both states */}
      <div
        className="
        absolute inset-0
        overflow-hidden
        pointer-events-none
        -z-10
      "
      >
        <div
          className="
          absolute
          -top-32 -right-24
          w-80 h-80
          rounded-full
          bg-blue-600/[0.12]
          blur-[100px]
        "
        />

        <div
          className="
          absolute
          top-[35%] -left-32
          w-80 h-80
          rounded-full
          bg-violet-600/[0.10]
          blur-[110px]
        "
        />

        <div
          className="
          absolute
          -bottom-32 right-[15%]
          w-80 h-80
          rounded-full
          bg-indigo-500/[0.08]
          blur-[100px]
        "
        />

        <div
          className="
          absolute inset-0
          bg-gradient-to-br
          from-blue-500/[0.025]
          via-transparent
          to-violet-500/[0.04]
        "
        />
      </div>

      {/* No Chat Selected */}
      {!activeChat || !chatId ? (
        <div
          className="
          relative z-10
          flex-1 min-w-0 min-h-0
          flex flex-col
          items-center justify-center
          px-5 py-8
          text-center
          select-none
        "
        >
          {/* Decorative Glow Behind Icon */}
          <div
            className="
            absolute
            w-48 h-48 sm:w-64 sm:h-64
            rounded-full
            bg-blue-500/[0.08]
            blur-[65px]
          "
          />

          {/* Welcome Icon */}
          <div
            className="
            relative
            w-20 h-20 sm:w-24 sm:h-24
            rounded-[28px]
            flex items-center justify-center
            bg-gradient-to-br
            from-blue-500/20
            via-indigo-500/15
            to-violet-600/20
            border border-blue-400/20
            shadow-[0_0_50px_rgba(59,130,246,0.10)]
            mb-6
          "
          >
            <div
              className="
              absolute inset-1
              rounded-[24px]
              border border-white/[0.04]
            "
            />

            <MessageSquareText
              size={36}
              strokeWidth={1.5}
              className="text-blue-300 sm:w-10 sm:h-10"
            />

            <div
              className="
              absolute -top-2 -right-2
              w-8 h-8
              rounded-xl
              flex items-center justify-center
              bg-gradient-to-br
              from-blue-500 to-violet-600
              border border-[#080D1A]
              shadow-lg shadow-blue-500/20
            "
            >
              <Sparkles size={15} className="text-white" />
            </div>
          </div>

          {/* Welcome Text */}
          <p
            className="
            text-[10px] sm:text-xs
            font-semibold uppercase
            tracking-[0.25em]
            text-blue-300/80
            mb-3
          "
          >
            Your space to connect
          </p>

          <h2
            className="
            text-2xl sm:text-3xl
            font-bold
            tracking-tight
            text-white
            mb-3
          "
          >
            Your conversations,
            <span
              className="
              block mt-1
              bg-gradient-to-r
              from-blue-400 via-indigo-400 to-violet-400
              bg-clip-text text-transparent
            "
            >
              all in one place.
            </span>
          </h2>

          <p
            className="
            max-w-xs sm:max-w-sm
            text-sm
            leading-6
            text-slate-400
          "
          >
            Select a friend from your chats and start a conversation. Your next
            great conversation begins here.
          </p>

          {/* Bottom Accent */}
          <div
            className="
            flex items-center gap-2
            mt-7
            text-xs text-slate-500
          "
          >
            <span
              className="
              w-1.5 h-1.5
              rounded-full
              bg-blue-400
              shadow-[0_0_10px_rgba(96,165,250,0.7)]
            "
            />
            <span>Made for meaningful connections</span>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div
            className="
            relative z-10
            h-16 min-h-16
            px-3 sm:px-4 md:px-6
            flex items-center gap-3
            bg-[#0D1425]/90
            backdrop-blur-xl
            border-b border-white/[0.07]
            shrink-0
          "
          >
            {/* Mobile Back Arrow */}
            <button
              onClick={onBack}
              className="
      md:hidden
      flex items-center justify-center
      w-9 h-9
      rounded-full
      text-slate-300
      hover:bg-white/[0.06]
      hover:text-white
      transition-colors
      shrink-0
    "
              aria-label="Back to chats"
            >
              <ArrowLeft size={23} />
            </button>

            {/* Profile Image */}
            <div
              className="
              w-10 h-10
              rounded-full
              bg-gradient-to-br from-blue-500 to-violet-600
              p-[2px]
              flex items-center justify-center
              shrink-0
            "
            >
              <div
                className="
                w-full h-full
                rounded-full
                bg-[#11182B]
                flex items-center justify-center
                overflow-hidden
                font-bold text-sm text-white
              "
              >
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
            </div>

            {/* User Details */}
            <div className="overflow-hidden min-w-0 text-left">
              <h3
                className="
                text-sm font-semibold
                text-white truncate
              "
              >
                {otherUser.name || otherUser.username}
              </h3>

              <p
                className="
                text-xs text-slate-400 truncate
              "
              >
                @{otherUser.username}
              </p>
            </div>
          </div>

          {/* Messages Scroll View */}
          <div
            className="
            relative z-10
            flex-1 min-h-0
            overflow-y-auto
            overscroll-contain
            p-3 sm:p-4
            space-y-3
            flex flex-col
          "
          >
            {loading ? (
              <div
                className="
                text-center text-xs
                text-slate-400 py-4
              "
              >
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div
                className="
                flex-1
                flex flex-col
                items-center justify-center
                text-center
                py-8
              "
              >
                <div
                  className="
                  w-14 h-14
                  rounded-2xl
                  flex items-center justify-center
                  bg-gradient-to-br
                  from-blue-500/15 to-violet-500/15
                  border border-white/[0.07]
                  mb-4
                "
                >
                  <MessageSquareText
                    size={25}
                    className="text-blue-300"
                    strokeWidth={1.5}
                  />
                </div>

                <p className="text-sm font-medium text-slate-200">
                  No messages yet
                </p>

                <p
                  className="
                  mt-1
                  text-xs text-slate-500
                "
                >
                  Say hello and start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const senderId = msg.sender?._id || msg.sender;

                const isMe = senderId?.toString() === currentUserId?.toString();

                return (
                  <div
                    key={msg._id || idx}
                    className={`
                      flex w-full
                      ${isMe ? "justify-end" : "justify-start"}
                    `}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`
                        max-w-[85%] sm:max-w-[70%]
                        px-3 sm:px-4
                        py-2.5
                        rounded-2xl
                        text-sm
                        leading-relaxed
                        break-words
                        [overflow-wrap:anywhere]
                        ${
                          isMe
                            ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white rounded-br-none shadow-lg shadow-blue-950/30"
                            : "bg-[#111B30]/95 text-slate-100 rounded-bl-none border border-white/[0.08] shadow-md shadow-black/10"
                        }
                      `}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div
            className="
            relative z-10
            p-2 sm:p-3 md:p-4
            bg-[#0D1425]/95
            backdrop-blur-xl
            border-t border-white/[0.07]
            flex gap-2 sm:gap-3
            items-center
            shrink-0
          "
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="
                flex-1 min-w-0
                px-3 sm:px-4
                py-3
                rounded-full
                bg-[#080D1A]
                text-white text-sm
                focus:outline-none
                focus:ring-1 focus:ring-blue-500/70
                border border-white/[0.08]
                focus:border-blue-500/40
                placeholder-slate-500
                transition-all
              "
            />

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="
                bg-gradient-to-r
                from-blue-500 to-violet-600
                hover:from-blue-400 hover:to-violet-500
                disabled:opacity-40
                disabled:cursor-not-allowed
                px-4 sm:px-6
                py-3
                rounded-full
                text-xs sm:text-sm
                font-semibold
                transition-all duration-200
                text-white
                shadow-lg shadow-blue-950/30
                shrink-0
              "
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;
