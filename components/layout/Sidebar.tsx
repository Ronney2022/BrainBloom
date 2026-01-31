
import React from 'react';
import { 
  BookOpen, 
  CloudRain, 
  Lightbulb, 
  Search, 
  Gamepad2,
  Map,
  Brain,
  Zap
} from 'lucide-react';
import { AppTab } from '../../types/index';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  seeds?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, seeds = 2 }) => {
  const navItems = [
    { id: AppTab.EXERCISES, label: 'Cognitive Exercises', icon: <Brain size={22} />, color: 'text-amber-600' },
    { id: AppTab.LIVE, label: 'Buddy Chat', icon: <Gamepad2 size={22} />, color: 'text-rose-500' },
    { id: AppTab.CHAT, label: 'Story Time', icon: <BookOpen size={22} />, color: 'text-indigo-500' },
    { id: AppTab.VIDEO, label: 'Dream Lab', icon: <CloudRain size={22} />, color: 'text-blue-500' },
    { id: AppTab.FLASH, label: 'Flash Tab', icon: <Zap size={22} />, color: 'text-amber-400' },
    { id: AppTab.ANALYZE, label: 'Mystery Box', icon: <Search size={22} />, color: 'text-emerald-500' },
    { id: AppTab.MAPS, label: 'Local Finder', icon: <Map size={22} />, color: 'text-teal-500' },
  ];

  return (
    <nav className="w-24 md:w-64 flex flex-col border-r border-slate-200 bg-slate-50/50 p-4 gap-3">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-300 group ${
            activeTab === item.id 
            ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200' 
            : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'
          }`}
        >
          <span className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110 ' + item.color : 'group-hover:scale-110'}`}>
            {item.icon}
          </span>
          <span className="hidden md:block font-bold text-sm">{item.label}</span>
        </button>
      ))}
      <div className="mt-auto p-4 hidden md:block">
        <div className="bg-indigo-600 rounded-3xl p-6 text-white text-center shadow-xl shadow-indigo-100">
          <p className="text-xs font-bold mb-2 opacity-80 uppercase tracking-widest">Daily Goal</p>
          <p className="text-lg font-black">{Math.min(seeds, 5)} / 5 Brainers</p>
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${Math.min((seeds / 5) * 100, 100)}%` }}></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
