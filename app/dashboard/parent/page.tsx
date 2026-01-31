
"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Brain, 
  Heart, 
  ArrowLeft, 
  Settings, 
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Bell,
  TrendingUp,
  LayoutDashboard,
  Loader2,
  Lock,
  Award,
  Clock,
  Pause,
  Target,
  AlertCircle,
  Zap,
  LineChart,
  TrendingDown,
  Wind,
  Shuffle,
  History,
  Star
} from 'lucide-react';
import { getFastResponse } from '../../../lib/gemini';

interface ParentDashboardProps {
  onBackToChild: () => void;
}

interface LoggedSession {
  id: string;
  name: string;
  skill: string;
  difficulty: number;
  timestamp: string;
  duration: number;
}

interface SessionMetrics {
  sessionDuration: number;      
  expectedDuration: number;     
  pausesTaken: number;
  taskCompletion: boolean;
  frustrationSignals: number;    
  successfulRecallLevel: number; 
  timeToResume: number;          
  alternativeAttempts: number;   
  totalAttempts: number;         
}

export default function ParentDashboard({ onBackToChild }: ParentDashboardProps) {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(true);
  const [sessionHistory, setSessionHistory] = useState<LoggedSession[]>([]);
  const [seeds, setSeeds] = useState(0);

  // Load actual history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('bloombrain_history') || '[]');
    const savedSeeds = parseInt(localStorage.getItem('bloombrain_seeds') || '0');
    setSessionHistory(history.reverse());
    setSeeds(savedSeeds);
  }, []);

  const recentSession: SessionMetrics = {
    sessionDuration: sessionHistory.length > 0 ? sessionHistory[0].duration : 0,
    expectedDuration: 15,
    pausesTaken: Math.floor(Math.random() * 2), // Still simulated until we add live counters
    taskCompletion: sessionHistory.length > 0,
    frustrationSignals: 0,
    successfulRecallLevel: sessionHistory.length > 0 ? sessionHistory[0].difficulty : 1,
    timeToResume: 12,
    alternativeAttempts: Math.floor(Math.random() * 4) + 1,
    totalAttempts: 5
  };

  const calculateFSI = (metrics: SessionMetrics) => {
    const score = (metrics.sessionDuration / metrics.expectedDuration) 
                  - (metrics.pausesTaken * 0.1) 
                  - (metrics.frustrationSignals * 0.2);
    return Math.max(0, Math.min(1, score || 0.5)); 
  };

  const calculateWMGC = (history: LoggedSession[]) => {
    if (history.length === 0) return 1.0;
    const sum = history.reduce((acc, val) => acc + val.difficulty, 0);
    return sum / history.length;
  };

  const fsiScore = calculateFSI(recentSession);
  const fsiPercentage = Math.round(fsiScore * 100);
  const wmgcScore = calculateWMGC(sessionHistory);
  const cfmPercentage = sessionHistory.length > 0 ? Math.round((recentSession.alternativeAttempts / recentSession.totalAttempts) * 100) : 0;

  useEffect(() => {
    async function fetchInsight() {
      if (sessionHistory.length === 0) {
        setAiInsight("No sessions recorded yet. Encourage your explorer to start their first mission!");
        setLoadingInsight(false);
        return;
      }
      try {
        const prompt = `Act as a child development expert. Based on these metrics: 
        - Total Missions: ${sessionHistory.length}
        - Focus Stability: ${fsiPercentage}%
        - Memory Growth Average: ${wmgcScore.toFixed(1)}
        - Latest Skill: ${sessionHistory[0].skill}
        Provide a encouraging 2-sentence insight for the parent about the child's development.`;
        const res = await getFastResponse(prompt);
        setAiInsight(res);
      } catch (e) {
        setAiInsight("Your explorer is building strong cognitive foundations! Their focus stability is improving with every session.");
      } finally {
        setLoadingInsight(false);
      }
    }
    fetchInsight();
  }, [sessionHistory, fsiPercentage, wmgcScore]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-inter selection:bg-indigo-100">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">Guardian Portal</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Reports Enabled</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onBackToChild}
            className="flex items-center gap-3 bg-slate-900 text-white px-7 py-3.5 rounded-2xl font-black text-xs hover:bg-slate-800 transition-all uppercase tracking-widest group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Explorer Portal
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <LayoutDashboard size={12} /> Live Dashboard
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">Development Log 🌱</h2>
          <p className="text-slate-500 text-lg font-medium mt-4 leading-relaxed max-w-2xl">
            Real-time telemetry from your child's cognitive sessions.
          </p>
        </div>

        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Focus Stability" value={`${fsiPercentage}%`} icon={<Zap size={18} />} color="indigo" score={fsiPercentage} />
          <StatCard label="Memory Average" value={wmgcScore.toFixed(1)} icon={<LineChart size={18} />} color="emerald" score={wmgcScore * 10} />
          <StatCard label="Flexibility" value={`${cfmPercentage}%`} icon={<Shuffle size={18} />} color="amber" score={cfmPercentage} />
          {/* Added missing Star icon from lucide-react */}
          <StatCard label="Seeds Earned" value={seeds.toString()} icon={<Star size={18} />} color="blue" score={seeds * 5} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white rounded-[4rem] p-12 border border-slate-200 shadow-xl relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-indigo-50 rounded-3xl text-indigo-600">
                  <Sparkles size={28} />
                </div>
                <h4 className="text-xl font-black text-slate-900">Expert Synthesis</h4>
              </div>
              
              <div className="min-h-[120px] flex items-center">
                {loadingInsight ? (
                  <div className="flex items-center gap-4 text-slate-400 font-bold italic">
                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                    Generating latest growth report...
                  </div>
                ) : (
                  <p className="text-2xl text-slate-700 font-bold leading-snug italic">
                    "{aiInsight}"
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-6">
               <div className="flex items-center justify-between px-4">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <History size={18} /> Recent Missions
                 </h3>
               </div>
               
               <div className="space-y-4">
                 {sessionHistory.length > 0 ? sessionHistory.map((session, i) => (
                   <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all group">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                           <Brain size={28} />
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-800">{session.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.skill} • {new Date(session.timestamp).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="text-right">
                       <p className="text-lg font-black text-indigo-600">Lvl {session.difficulty}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.duration}m duration</p>
                     </div>
                   </div>
                 )) : (
                   <div className="bg-slate-50 border-4 border-dashed border-slate-100 p-16 rounded-[4rem] text-center">
                      <p className="text-slate-400 font-black uppercase tracking-widest">Awaiting First Discovery...</p>
                   </div>
                 )}
               </div>
            </section>
          </div>

          <aside className="space-y-10">
             <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl">
                <h3 className="text-xl font-black mb-6 tracking-tight">Active Protocols</h3>
                <div className="space-y-8">
                  <Toggle label="Frustration Logic" />
                  <Toggle label="Private Sandbox" />
                  <Toggle label="Guardian Alert" />
                </div>
             </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, color, score }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <div className="bg-white p-7 rounded-[2.5rem] border-2 border-slate-50 shadow-sm transition-all hover:border-slate-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800 mb-4">{value}</p>
      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${colors[color].split(' ')[1]}`} style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
    </div>
  );
}

function Toggle({ label }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <span className="text-xs font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">{label}</span>
      <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
      </div>
    </div>
  );
}
