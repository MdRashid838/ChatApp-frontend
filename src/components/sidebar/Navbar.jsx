import React from "react";
import {
  MessageSquareText,
  Phone,
  CircleDashed,
  Users,
  Settings,
} from "lucide-react";

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "chats", icon: MessageSquareText, title: "Chats" },
    { id: "status", icon: CircleDashed, title: "Status" },
    { id: "calls", icon: Phone, title: "Calls" },
    { id: "users", icon: Users, title: "Users" },
  ];

  return (
    <div
      className="
        relative
        grid grid-cols-5
        w-full h-16

        md:flex md:flex-col
        md:w-16 md:h-full
        md:justify-between

        items-center

        bg-[#0D1425]

        px-0 md:px-0
        py-0 md:py-6

        shrink-0
      "
    >
      {/* Navigation Icons */}
      <ul
        className="
          contents
          md:flex md:flex-col
          md:items-center
          md:justify-start
          md:gap-6
        "
      >
        {navItems.map(({ id, icon: Icon, title }) => (
          <li
            key={id}
            onClick={() => setActiveTab?.(id)}
            className={`
              flex items-center justify-center
              w-full h-16
              md:w-12 md:h-12

              rounded-xl
              cursor-pointer
              transition-all

              ${
                activeTab === id
                  ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }
            `}
            title={title}
          >
            <Icon size={22} />
          </li>
        ))}
      </ul>

      {/* Settings */}
      <div
        onClick={() => setActiveTab?.("settings")}
        className={`
          flex items-center justify-center
          w-full h-16
          md:w-12 md:h-12

          rounded-xl
          cursor-pointer
          transition-all

          ${
            activeTab === "settings"
              ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
          }
        `}
        title="Settings"
      >
        <Settings size={22} />
      </div>
    </div>
  );
};

export default Navbar;