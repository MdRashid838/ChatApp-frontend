import React from 'react';
import { MessageSquareText, Phone, CircleDashed, Users, Settings } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col justify-between items-center py-6">
      {/* Top Icons */}
      <ul className="flex flex-col gap-6">
        <li 
          onClick={() => setActiveTab && setActiveTab('chats')}
          className={`p-3 rounded-xl cursor-pointer transition-all ${
            activeTab === 'chats' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Chats"
        >
          <MessageSquareText size={24} />
        </li>

        <li 
          onClick={() => setActiveTab && setActiveTab('status')}
          className={`p-3 rounded-xl cursor-pointer transition-all ${
            activeTab === 'status' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Status"
        >
          <CircleDashed size={24} />
        </li>

        <li 
          onClick={() => setActiveTab && setActiveTab('calls')}
          className={`p-3 rounded-xl cursor-pointer transition-all ${
            activeTab === 'calls' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Calls"
        >
          <Phone size={24} />
        </li>

        <li 
          onClick={() => setActiveTab && setActiveTab('users')}
          className={`p-3 rounded-xl cursor-pointer transition-all ${
            activeTab === 'users' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Users / Contacts"
        >
          <Users size={24} />
        </li>
      </ul>

      {/* Bottom Settings Icon */}
      <div 
        onClick={() => setActiveTab && setActiveTab('settings')}
        className="p-3 rounded-xl cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        title="Settings"
      >
        <Settings size={24} />
      </div>
    </div>
  );
};

export default Navbar;