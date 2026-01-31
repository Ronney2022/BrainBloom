
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Brain, 
  Loader2, 
  CheckCircle2, 
  Home, 
  Star, 
  Trophy,
  PartyPopper,
  Gift,
} from 'lucide-react';
import Sidebar from '../../../components/layout/Sidebar';
import ChatTab from '../../../components/bloombrain/ChatTab';
import VideoTab from '../../../components/bloombrain/VideoTab';
import FlashTab from '../../../components/bloombrain/FlashTab';
import AnalyzeTab from '../../../components/bloombrain/AnalyzeTab';
import LiveTab from '../../../components/bloombrain/LiveTab';
import MapsTab from '../../../components/bloombrain/MapsTab';
import CognitiveTab from '../../../components/bloombrain/CognitiveTab';
import GameModule from '../../../components/bloombrain/GameModule';
import { AppTab, BloomBrainActivity } from '../../../types/index';
import { getFastResponse } from '../../../lib/gemini';

type ViewMode = 'mission' | 'tab';
type AgeGroup = "4-6" | "7-9" | "10-12";

const playSuccessSound = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
};

export default function ChildDashboard() {
  const [view, setView] = useState<ViewMode>('tab');
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.EXERCISES);
  const [activeActivity, setActiveActivity] = useState<BloomBrainActivity | null>(null);
  const [seeds, setSeeds] = useState(2);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("7-9");
  const [isMissionComplete, setIsMissionComplete] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  // Persistence: Load on mount
  useEffect(() => {
    const savedSeeds = localStorage.getItem('bloombrain_seeds');
    const savedAge = localStorage.getItem('bloombrain_age');
    if (savedSeeds) setSeeds(parseInt(savedSeeds));
    if (savedAge) setAgeGroup(savedAge as AgeGroup);
  }, []);

  // Persistence: Save seeds/age
  useEffect(() => {
    localStorage.setItem('bloombrain_seeds', seeds.toString());
    localStorage.setItem('bloombrain_age', ageGroup);
  }, [seeds, ageGroup]);

  const handleTabChange = useCallback((tab: AppTab) => {
    setActiveTab(tab);
    setView('tab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startMission = (activity: BloomBrainActivity) => {
    if (!activity.gameData) {
      activity.gameData = {
        type: activity.primarySkill === 'working_memory' ? 'sequence' : 'matching',
        items: ['🍄', '🌸', '🌲', '🌟', '🐦', '🦋'],
        solution: [0, 2, 4]
      };
    }
    setActiveActivity(activity);
    setIsMissionComplete(false);
    setEncouragement("");
    setView('mission');
  };

  const completeMission = async () => {
    setIsLoadingFeedback(true);
    playSuccessSound();
    
    // Log session for Guardian Portal
    const logSession = () => {
      const history = JSON.parse(localStorage.getItem('bloombrain_history') || '[]');
      history.push({
        id: activeActivity?.id || Date.now().toString(),
        name: activeActivity?.name || 'Mystery Mission',
        skill: activeActivity?.primarySkill || 'logic',
        difficulty: activeActivity?.difficultyLevel || 1,
        timestamp: new Date().toISOString(),
        duration: activeActivity?.durationMinutes || 5
      });
      localStorage.setItem('bloombrain_history', JSON.stringify(history.slice(-20))); // Keep last 20
    };
    logSession();

    try {
      const prompt = `Act as BloomBuddy, a gentle AI friend. A child just finished the "${activeActivity?.name}" activity. 
      Write a one-sentence celebratory message that highlights their effort in ${activeActivity?.primarySkill.replace('_', ' ')}. 
      Be very encouraging and whimsical.`;
      const msg = await getFastResponse(prompt);
      setEncouragement(msg);
    } catch (e) {
      setEncouragement("You did it! Your brain is blooming like a beautiful flower in the sun! 🌸");
    } finally {
      setIsLoadingFeedback(false);
      setIsMissionComplete(true);
    }
  };

  const collectSeeds = () => {
    setSeeds(prev => prev + 1);
    setView('tab');
    setActiveTab(AppTab.EXERCISES);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case AppTab.EXERCISES:
        return (
          <CognitiveTab 
            seeds={seeds} 
            ageGroup={ageGroup} 
            setAgeGroup={(age) => setAgeGroup(age as AgeGroup)} 
            onStartActivity={startMission} 
          />
        );
      case AppTab.LIVE: return <LiveTab />;
      case AppTab.CHAT: return <ChatTab />;
      case AppTab.VIDEO: return <VideoTab />;
      case AppTab.FLASH: return <FlashTab />;
      case AppTab.ANALYZE: return <AnalyzeTab />;
      case AppTab.MAPS: return <MapsTab />;
      default: return <LiveTab />;
    }
  };

  const getHeaderText = () => {
    if (view === 'mission') return "Mission Challenge";
    switch (activeTab) {
      case AppTab.EXERCISES: return "Cognitive Exercises";
      case AppTab.FLASH: return "Flash Tab";
      default: return "Creative Studio";
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFEFF] overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        seeds={seeds} 
      />
      
      <main className="flex-1 overflow-y-auto p-8 md:p-12 relative">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => handleTabChange(AppTab.EXERCISES)}
               className={`p-3 rounded-2xl transition-all ${activeTab === AppTab.EXERCISES ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
             >
               <Home size={22} />
             </button>
             <div>
               <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                 {getHeaderText()}
               </h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">BloomBrain Explorer</p>
             </div>
          </div>

          <div className="flex items-center gap-3 bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl kid-shadow">
             <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                <Star size={18} fill="currentColor" />
             </div>
             <span className="font-black text-slate-800">{seeds} Seeds</span>
          </div>
        </header>

        <div className="max-w-6xl mx-auto h-full pb-20">
          {view === 'mission' ? (
            <div className="h-full flex flex-col animate-in zoom-in-95 duration-500 pt-6">
              <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 md:p-14 flex-1 flex flex-col items-center justify-start text-center kid-shadow relative min-h-[600px]">
                {!isMissionComplete ? (
                  <div className="w-full h-full flex flex-col relative pt-8">
                    {/* Visual Separator Bar */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-indigo-500 rounded-full opacity-20"></div>
                    
                    {/* Repositioned AI Badge to avoid overlap */}
                    {activeActivity?.id.startsWith('ai-') && (
                      <div className="absolute top-[-1.5rem] right-0 flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100 shadow-sm animate-pulse z-30">
                        <Sparkles size={10} /> AI Mission
                      </div>
                    )}
                    
                    {activeActivity && (
                      <GameModule 
                        key={activeActivity.id}
                        activity={activeActivity} 
                        onComplete={completeMission} 
                      />
                    )}
                  </div>
                ) : (
                  <div className="animate-in zoom-in duration-700 flex flex-col items-center justify-center flex-1">
                    <div className="relative mb-12">
                      <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse scale-150"></div>
                      <div className="w-36 h-36 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 border-4 border-white shadow-2xl relative z-10">
                         <Trophy size={72} />
                      </div>
                      <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 text-emerald-500 animate-bounce">
                        <PartyPopper size={32} />
                      </div>
                    </div>
                    
                    <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Magnificent Work!</h3>
                    
                    <div className="bg-indigo-50 p-8 rounded-[2.5rem] border-2 border-white mb-12 max-w-xl relative">
                       <Sparkles className="absolute -top-3 -left-3 text-amber-400" size={24} />
                       <p className="text-xl font-bold text-indigo-900 leading-relaxed italic">
                         "{encouragement}"
                       </p>
                    </div>

                    <button 
                      onClick={collectSeeds}
                      className="px-16 py-6 bg-amber-500 text-white rounded-[2.5rem] font-black text-2xl hover:bg-amber-600 shadow-2xl shadow-amber-200 transition-all animate-bounce active:scale-90 flex items-center gap-4 group"
                    >
                      <Gift size={32} className="group-hover:rotate-12 transition-transform" />
                      Collect Seeds
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div key={activeTab} className="animate-in fade-in duration-500 h-full">
              {renderActiveTab()}
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
