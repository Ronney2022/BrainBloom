
"use client";
import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  Loader2, 
  Target, 
  Zap, 
  Puzzle, 
  BrainCircuit,
  TrendingUp,
  Dices,
  Layers,
  Star,
  Smile,
  Sliders,
  ChevronRight,
  Sprout,
  TreePine,
  Trophy,
  RefreshCw,
  Search
} from 'lucide-react';
import { BloomBrainActivity, CognitiveSkillType } from '../../types/index';
import { generateCognitiveExercise } from '../../lib/gemini';
import ActivityCard from './ActivityCard';

interface CognitiveTabProps {
  seeds: number;
  ageGroup: "4-6" | "7-9" | "10-12";
  setAgeGroup: (age: "4-6" | "7-9" | "10-12") => void;
  onStartActivity: (activity: BloomBrainActivity) => void;
}

const SKILL_LABELS: Record<string, string> = {
  working_memory: "Memory Magic",
  attention: "Focus Power",
  logic: "Puzzle Master",
  emotion_regulation: "Feelings Hero",
  creativity: "Dream Maker",
  metacognition: "Brain Watcher"
};

const DIFFICULTY_LABELS = [
  { label: "Easy Peasy", icon: <Sprout size={14} className="text-emerald-400" /> },
  { label: "Just Right", icon: <Sprout size={14} className="text-emerald-500" /> },
  { label: "Brainy", icon: <TreePine size={14} className="text-indigo-400" /> },
  { label: "Super Thinker", icon: <TreePine size={14} className="text-indigo-600" /> },
  { label: "Ultimate Master", icon: <Trophy size={14} className="text-amber-500" /> }
];

const PRESET_LIBRARY: BloomBrainActivity[] = [
  {
    id: "memory-garden",
    name: "Memory Garden",
    ageGroup: "4-6",
    primarySkill: "working_memory",
    researchBasis: ["Visual-spatial sketchpad exercise"],
    durationMinutes: 5,
    difficultyLevel: 1,
    adaptiveRule: "If child recalls easily → add 1 object.",
    aiTone: "gentle",
    customInstructions: "Try to remember the sequence of glowing flowers in the enchanted garden. Close your eyes for 5 seconds and recall them in order!",
    gameData: {
      type: 'sequence',
      items: ['🍄', '🌸', '🌲', '🌟', '🐦', '🦋'],
      solution: [0, 1, 2]
    }
  },
  {
    id: "pattern-quest-1",
    name: "Pattern Pulse",
    ageGroup: "7-9",
    primarySkill: "logic",
    researchBasis: ["Visual pattern recognition"],
    durationMinutes: 5,
    difficultyLevel: 2,
    adaptiveRule: "More complex patterns on success.",
    aiTone: "encouraging",
    customInstructions: "Look at the pattern on the magic wall. Can you find the missing piece to complete the sequence?",
    gameData: {
      type: 'pattern_completion',
      items: ['🌕', '🌘', '🌕', '🌘'],
      solution: [1]
    }
  },
  {
    id: "emotion-match-1",
    name: "Heart Finder",
    ageGroup: "4-6",
    primarySkill: "emotion_regulation",
    researchBasis: ["Affective empathy training"],
    durationMinutes: 4,
    difficultyLevel: 1,
    adaptiveRule: "Increase nuance of scenarios.",
    aiTone: "gentle",
    customInstructions: "A friend just shared their favorite snack with BloomBuddy! How do you think BloomBuddy feels?",
    gameData: {
      type: 'emotional_matching',
      items: ['Sharing a snack', 'Happy 🥳', 'Sad 😔', 'Scared 😱'],
      solution: [1]
    }
  }
];

const CognitiveTab: React.FC<CognitiveTabProps> = ({ seeds, ageGroup, setAgeGroup, onStartActivity }) => {
  const [customTheme, setCustomTheme] = useState("");
  const [targetSkill, setTargetSkill] = useState<CognitiveSkillType | 'random'>('random');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activities, setActivities] = useState<BloomBrainActivity[]>(PRESET_LIBRARY);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isSyncingAI, setIsSyncingAI] = useState(false);
  
  const initialDifficulty = Math.min(Math.max(1, Math.floor(seeds / 2)), 10);
  const [manualDifficulty, setManualDifficulty] = useState(initialDifficulty);

  useEffect(() => {
    setManualDifficulty(initialDifficulty);
  }, [seeds, initialDifficulty]);

  const triggerAutoGenerate = async () => {
    setIsSyncingAI(true);
    try {
      const themes = ["Ocean Expedition", "Cloud Kingdom", "Dinosaur Valley", "Robot Factory", "Magic Library"];
      const skills: CognitiveSkillType[] = ["working_memory", "attention", "logic", "emotion_regulation"];
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      const randomSkill = skills[Math.floor(Math.random() * skills.length)];
      
      const newActivity = await generateCognitiveExercise(ageGroup, randomSkill, manualDifficulty, randomTheme);
      if (newActivity) {
        setActivities(prev => {
          // Prevent duplicates by checking ID
          if (prev.find(a => a.id === newActivity.id)) return prev;
          return [newActivity, ...prev];
        });
      }
    } catch (e) {
      console.error("Auto-gen failed", e);
    } finally {
      setIsSyncingAI(false);
    }
  };

  useEffect(() => {
    triggerAutoGenerate();
  }, [ageGroup]);

  const handleGenerate = async (skillOverride?: CognitiveSkillType, themeOverride?: string) => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    const skillPool: CognitiveSkillType[] = ["working_memory", "attention", "logic", "emotion_regulation", "creativity", "metacognition"];
    const selectedSkill = skillOverride || (targetSkill === 'random' 
      ? skillPool[Math.floor(Math.random() * 4)] // Default to first 4 for safety
      : targetSkill as CognitiveSkillType);
      
    const selectedTheme = themeOverride || customTheme || "Nature Discovery";
    
    try {
      const newActivity = await generateCognitiveExercise(
        ageGroup, 
        selectedSkill, 
        manualDifficulty, 
        selectedTheme
      );
      if (newActivity) {
        setActivities(prev => [newActivity, ...prev]);
        setCustomTheme("");
        onStartActivity(newActivity);
      }
    } catch (e) {
      console.error("Failed to generate exercise", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredActivities = activeCategory === "all" 
    ? activities 
    : activities.filter(a => a.primarySkill === activeCategory);

  const skillsList: { id: CognitiveSkillType | 'random', label: string, icon: React.ReactNode, color: string }[] = [
    { id: 'random', label: 'Surprise Me', icon: <Sparkles className="w-5 h-5" />, color: 'bg-rose-500' },
    { id: 'working_memory', label: 'Memory Magic', icon: <Brain className="w-5 h-5" />, color: 'bg-indigo-500' },
    { id: 'logic', label: 'Puzzle Master', icon: <Puzzle className="w-5 h-5" />, color: 'bg-emerald-500' },
    { id: 'attention', label: 'Focus Power', icon: <Zap className="w-5 h-5" />, color: 'bg-amber-500' },
    { id: 'emotion_regulation', label: 'Feelings Hero', icon: <Smile className="w-5 h-5" />, color: 'bg-rose-400' },
  ];

  const currentDiffMeta = DIFFICULTY_LABELS[Math.min(Math.floor((manualDifficulty - 1) / 2), 4)];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">
            <BrainCircuit size={16} /> Brain Playground
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[0.9]">
            Grow Your <span className="text-indigo-600">Super Powers!</span>
          </h1>
          <p className="text-slate-500 font-bold text-lg max-w-lg leading-relaxed">
            Pick a skill to practice or let BloomBuddy create a brand new world just for you.
          </p>
        </div>

        <div className="flex items-center gap-5 bg-white border-2 border-slate-100 p-7 rounded-[3rem] shadow-2xl shadow-indigo-100/30">
           <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
              <TrendingUp size={32} />
           </div>
           <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Your Progress</p>
              <div className="flex items-baseline gap-3">
                 <p className="text-3xl font-black text-slate-800 leading-none">Power Lvl {manualDifficulty}</p>
                 <span className="text-[10px] text-white font-black bg-indigo-600 px-3 py-1 rounded-full shadow-sm">{seeds} Seeds</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
           <div className="bg-slate-900 text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden h-full flex flex-col justify-start min-h-[600px] border-4 border-slate-800">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <Brain size={160} />
              </div>
              <div className="relative z-10 space-y-10 h-full flex flex-col">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg">
                      <Sparkles className="text-white" size={24} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">World Builder</h3>
                 </div>
                 
                 {isGenerating ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-pulse">
                      <div className="relative">
                        <Loader2 size={80} className="animate-spin text-indigo-400" />
                        <Brain size={32} className="absolute inset-0 m-auto text-white" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-2xl font-black text-indigo-200">Building {customTheme || 'Mystery'}...</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Mixing Emojis & Puzzles</p>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-10 flex-1 flex flex-col">
                      <div className="space-y-4">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] px-1">1. Choose Your World</p>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={customTheme}
                            onChange={(e) => setCustomTheme(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
                            placeholder="e.g. Magic Space"
                            className="w-full bg-white/10 border-2 border-white/10 px-8 py-6 rounded-[2.5rem] text-xl font-black focus:outline-none focus:border-indigo-400 focus:bg-white/15 transition-all text-white placeholder:text-white/20 shadow-inner"
                          />
                          <button 
                            onClick={() => {
                              const themes = ["Dino Valley", "Rainbow Ocean", "Cloud Castle", "Robot City", "Unicorn Woods", "Cyber Jungle"];
                              setCustomTheme(themes[Math.floor(Math.random() * themes.length)]);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-indigo-400 hover:text-white transition-colors"
                          >
                            <Dices size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] px-1">2. Pick a Super Power</p>
                        <div className="grid grid-cols-2 gap-3">
                           {skillsList.map((skill) => (
                             <button
                               key={skill.id}
                               onClick={() => setTargetSkill(skill.id)}
                               className={`flex flex-col items-center justify-center py-5 px-3 rounded-[2rem] border-2 transition-all group ${
                                 targetSkill === skill.id 
                                 ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-900/50' 
                                 : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                               }`}
                             >
                               <div className={`p-3 rounded-xl mb-3 transition-colors ${targetSkill === skill.id ? 'bg-white/20' : 'bg-white/5'}`}>
                                 {skill.icon}
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-widest">{skill.label}</span>
                             </button>
                           ))}
                        </div>
                      </div>

                      <div className="space-y-6 bg-white/5 p-8 rounded-[3rem] border border-white/5 shadow-inner">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-indigo-900/50 rounded-lg text-indigo-400">
                               <Sliders size={16} />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">3. Challenge Lvl</p>
                           </div>
                           <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                              {currentDiffMeta.icon}
                              <span className="text-[10px] font-black uppercase text-white tracking-widest">{currentDiffMeta.label}</span>
                           </div>
                        </div>
                        <input 
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={manualDifficulty}
                          onChange={(e) => setManualDifficulty(parseInt(e.target.value))}
                          className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>

                      <button
                        onClick={() => handleGenerate()}
                        disabled={isGenerating || (!customTheme.trim() && targetSkill === 'random')}
                        className="mt-auto py-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] font-black text-2xl transition-all active:scale-95 disabled:opacity-30 shadow-2xl shadow-indigo-900/60 flex items-center justify-center gap-4 group"
                      >
                        Start Mission <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl">
                  <Layers size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Mission Library</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a mission to begin</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-full w-fit">
                {['all', 'working_memory', 'attention', 'logic', 'emotion_regulation', 'creativity', 'metacognition'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    {cat === 'all' ? 'All' : SKILL_LABELS[cat] || cat.replace('_', ' ')}
                  </button>
                ))}
                <button 
                  onClick={triggerAutoGenerate}
                  disabled={isSyncingAI}
                  className="p-2.5 rounded-full text-indigo-600 hover:bg-white transition-all disabled:opacity-30"
                  title="Generate New Mission"
                >
                  <RefreshCw size={14} className={isSyncingAI ? 'animate-spin' : ''} />
                </button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <ActivityCard 
                    key={activity.id}
                    title={activity.name}
                    skill={SKILL_LABELS[activity.primarySkill] || activity.primarySkill.replace('_', ' ')}
                    duration={activity.durationMinutes}
                    difficulty={activity.difficultyLevel}
                    ageGroupBadge={activity.ageGroup}
                    onClick={() => onStartActivity(activity)}
                  />
                ))
              ) : (
                <div className="col-span-full py-40 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center text-center px-8">
                   <Search size={64} className="text-slate-200 mb-6" />
                   <p className="text-slate-400 font-black text-lg uppercase tracking-[0.2em]">No missions in this category yet</p>
                   <button 
                     onClick={() => handleGenerate(activeCategory as CognitiveSkillType)}
                     className="mt-6 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline"
                   >
                     Create one with AI?
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 32px;
          width: 32px;
          border-radius: 50%;
          background: #818cf8;
          cursor: pointer;
          border: 4px solid #fff;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);
          transition: all 0.2s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          background: #6366f1;
        }
      `}</style>
    </div>
  );
};

export default CognitiveTab;
