
import React from 'react';
// Fix: Use the correct path for AppTab from types/index.ts
import { AppTab } from '../types/index';
import { 
  MessageSquare, 
  Video, 
  Zap, 
  Eye, 
  BrainCircuit,
  Radio
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: AppTab.LIVE, label: 'Live Mode', icon: <Radio size={20} /> },
    { id: AppTab.CHAT, label: 'Pro Chat', icon: <MessageSquare size={20} /> },
    { id: AppTab.VIDEO, label: 'Veo Video', icon: <Video size={20} /> },
    { id: AppTab.FLASH, label: 'Fast AI', icon: <Zap size={20} /> },
    { id: AppTab.ANALYZE, label: 'Vision Lab', icon: <Eye size={20} /> },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <BrainCircuit size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            BloomBrain
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === AppTab.LIVE && (
            <div className="flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-red-500/50 rounded-full bg-red-500/10 text-red-400 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Live Session
            </div>
          )}
          <div className="px-3 py-1 text-xs font-medium border border-zinc-700 rounded-full bg-zinc-800 text-zinc-400">
            v3.2 Experimental
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-20 md:w-64 flex flex-col border-r border-zinc-800 bg-zinc-900/30 p-4 gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/50' 
                : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <span className={`transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="hidden md:block font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-zinc-950">
          <div className="max-w-6xl mx-auto h-full p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
