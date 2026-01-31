
import React from 'react';
import { Timer, Brain, Puzzle, Smile, Zap, Target, Play, Sparkles } from 'lucide-react';

type Props = {
  title: string;
  duration: number;
  skill: string;
  difficulty?: number;
  ageGroupBadge?: string;
  onClick?: () => void;
};

const ActivityCard: React.FC<Props> = ({ title, duration, skill, difficulty = 1, ageGroupBadge, onClick }) => {
  const getIcon = () => {
    const s = skill.toLowerCase();
    if (s.includes('memory')) return <Brain size={26} />;
    if (s.includes('puzzle') || s.includes('logic')) return <Puzzle size={26} />;
    if (s.includes('feelings') || s.includes('emotion')) return <Smile size={26} />;
    if (s.includes('focus') || s.includes('attention')) return <Zap size={26} />;
    if (s.includes('watcher') || s.includes('metacognition')) return <Target size={26} />;
    return <Sparkles size={26} />;
  };

  const getThemeColor = () => {
    const s = skill.toLowerCase();
    if (s.includes('memory')) return 'indigo';
    if (s.includes('puzzle') || s.includes('logic')) return 'emerald';
    if (s.includes('feelings') || s.includes('emotion')) return 'rose';
    if (s.includes('focus') || s.includes('attention')) return 'amber';
    return 'slate';
  };

  const theme = getThemeColor();
  const themeClasses: Record<string, string> = {
    indigo: 'group-hover:bg-indigo-600 text-indigo-500 bg-indigo-50 border-indigo-100/50',
    emerald: 'group-hover:bg-emerald-600 text-emerald-500 bg-emerald-50 border-emerald-100/50',
    rose: 'group-hover:bg-rose-600 text-rose-500 bg-rose-50 border-rose-100/50',
    amber: 'group-hover:bg-amber-600 text-amber-500 bg-amber-50 border-amber-100/50',
    slate: 'group-hover:bg-slate-600 text-slate-500 bg-slate-50 border-slate-100/50',
  };

  const accentClasses: Record<string, string> = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    rose: 'bg-rose-600',
    amber: 'bg-amber-600',
    slate: 'bg-slate-600',
  };

  return (
    <button 
      onClick={onClick}
      className="bg-white p-10 rounded-[4rem] border-2 border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group text-left relative overflow-hidden flex flex-col h-full kid-shadow"
    >
      {/* Visual Accents */}
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:scale-150 transition-transform duration-1000 -translate-y-1/2 translate-x-1/2 rounded-full ${accentClasses[theme]}`} />
      
      <div className="flex items-start justify-between mb-8">
         <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all shadow-inner border group-hover:text-white ${themeClasses[theme]}`}>
            {getIcon()}
         </div>
         <div className="flex flex-col items-end gap-3">
            {ageGroupBadge && (
              <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                Ages {ageGroupBadge}
              </div>
            )}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < difficulty ? (accentClasses[theme] + ' shadow-sm') : 'bg-slate-100'}`} />
              ))}
            </div>
         </div>
      </div>

      <div className="space-y-3 mb-8">
        <h3 className="text-3xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{title}</h3>
        <div className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${themeClasses[theme]} border-none group-hover:bg-white group-hover:text-slate-800`}>
          {skill}
        </div>
      </div>
      
      <p className="text-slate-500 text-lg font-bold leading-relaxed flex-grow line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
        Embark on a unique mission to grow your {skill.toLowerCase()} Super Power with BloomBuddy!
      </p>

      <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50">
        <div className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest">
          <Timer size={18} className="text-slate-300" /> {duration} min
        </div>
        <div className={`flex items-center gap-4 px-10 py-5 text-white rounded-[2rem] shadow-xl transition-all group-hover:scale-105 active:scale-95 ${accentClasses[theme]}`}>
          <span className="text-xs font-black uppercase tracking-widest">Let's Play</span>
          <Play size={18} fill="currentColor" />
        </div>
      </div>
    </button>
  );
};

export default ActivityCard;
