
"use client";
import React, { useState, useEffect } from 'react';
import Hero from '../../components/bloombrain/hero';
import Features from '../../components/bloombrain/features';
import VideoGuide from '../../components/bloombrain/VideoGuide';
import ActivityCard from '../../components/bloombrain/ActivityCard';
import GameModule from '../../components/bloombrain/GameModule';
import { BloomBrainActivity, CognitiveSkillType } from '../../types/index';
import { generateCognitiveExercise } from '../../lib/gemini';
import { Sparkles, Brain, ArrowRight, Zap, Trophy, PartyPopper, Loader2, Dices, Wand2 } from 'lucide-react';

const INITIAL_MISSIONS: BloomBrainActivity[] = [
  {
    id: "demo-memory",
    name: "Forest Friends",
    ageGroup: "4-6",
    primarySkill: "working_memory",
    researchBasis: ["Visual-spatial sketchpad"],
    durationMinutes: 2,
    difficultyLevel: 1,
    adaptiveRule: "Demo mode",
    aiTone: "gentle",
    customInstructions: "Watch the forest friends carefully. Can you remember the order they appeared in?",
    gameData: {
      type: 'sequence',
      items: ['🦊', '🦉', '🐻', '🦌'],
      solution: [0, 1, 3]
    }
  },
  {
    id: "demo-logic",
    name: "Space Logic",
    ageGroup: "7-9",
    primarySkill: "logic",
    researchBasis: ["Inductive reasoning"],
    durationMinutes: 2,
    difficultyLevel: 2,
    adaptiveRule: "Demo mode",
    aiTone: "encouraging",
    customInstructions: "One of these space items doesn't belong in the rocket. Can you find the odd one out?",
    gameData: {
      type: 'odd_one_out',
      items: ['🚀', '🛰️', '🛸', '🍕'],
      solution: [3]
    }
  },
  {
    id: "demo-emotion",
    name: "Feelings Match",
    ageGroup: "4-6",
    primarySkill: "emotion_regulation",
    researchBasis: ["Affective labeling"],
    durationMinutes: 3,
    difficultyLevel: 1,
    adaptiveRule: "Demo mode",
    aiTone: "gentle",
    customInstructions: "Someone dropped their ice cream! How do they feel?",
    gameData: {
      type: 'emotional_matching',
      items: ['Dropped ice cream', 'Happy 🥳', 'Sad 😔', 'Scared 😱'],
      solution: [2]
    }
  },
  {
    id: "demo-focus",
    name: "Ocean Match",
    ageGroup: "4-6",
    primarySkill: "attention",
    researchBasis: ["Selective attention"],
    durationMinutes: 2,
    difficultyLevel: 1,
    adaptiveRule: "Demo mode",
    aiTone: "gentle",
    customInstructions: "Deep in the ocean, two fish are identical twins! Can you find them?",
    gameData: {
      type: 'matching',
      items: ['🐠', '🐙', '🐠', '🦀', '🐳', '🐢'],
      solution: [0, 2]
    }
  }
];

export default function MarketingPage({ onStart }: { onStart: () => void }) {
  const [activeDemo, setActiveDemo] = useState<BloomBrainActivity | null>(null);
  const [demoComplete, setDemoComplete] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customTheme, setCustomTheme] = useState("");
  const [customSkill, setCustomSkill] = useState<CognitiveSkillType>("working_memory");

  const handleComplete = () => {
    setDemoComplete(true);
  };

  const resetDemo = () => {
    setActiveDemo(null);
    setDemoComplete(false);
    setIsGenerating(false);
  };

  const generateCustomMission = async () => {
    setIsGenerating(true);
    try {
      const theme = customTheme || "Nature Discovery";
      const activity = await generateCognitiveExercise("7-9", customSkill, 1, theme);
      if (activity) {
        setActiveDemo(activity);
      }
    } catch (err) {
      console.error("Home generation failed", err);
      // Fallback to a random initial mission if AI fails
      setActiveDemo(INITIAL_MISSIONS[Math.floor(Math.random() * INITIAL_MISSIONS.length)]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-1000">
      <Hero onStart={onStart} />

      {/* Interactive Demo Section */}
      <section className="px-6 py-24 bg-indigo-50/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6 shadow-sm border border-indigo-100">
              <Zap size={14} className="animate-pulse" /> Interactive Discovery Lab
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
              Try a <span className="text-indigo-600">Mini Mission.</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
              Pick a classic mission below, or let our AI build a custom world just for you to explore right now.
            </p>
          </div>

          <div className="relative min-h-[700px] flex items-center justify-center">
            {isGenerating ? (
              <div className="w-full max-w-4xl bg-white border-4 border-white rounded-[4rem] p-20 shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center">
                <div className="relative mb-12">
                   <Loader2 size={80} className="animate-spin text-indigo-400" />
                   <Brain size={32} className="absolute inset-0 m-auto text-indigo-600" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">Building Your World...</h3>
                <p className="text-indigo-600 text-xl font-bold italic animate-pulse">
                  Mixing fairy dust and memory sequences...
                </p>
              </div>
            ) : activeDemo ? (
              <div className="w-full max-w-4xl bg-white border-4 border-white rounded-[4rem] p-8 md:p-16 shadow-2xl animate-in zoom-in-95 duration-500 min-h-[600px] flex flex-col items-center">
                {!demoComplete ? (
                  <div className="w-full h-full flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-10">
                      <button 
                        onClick={resetDemo}
                        className="text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors"
                      >
                        <ArrowRight className="rotate-180" size={14} /> Back to Selection
                      </button>
                      {activeDemo.id.startsWith('ai-') && (
                        <div className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                          AI Generated Mission
                        </div>
                      )}
                    </div>
                    <GameModule 
                      activity={activeDemo} 
                      onComplete={handleComplete} 
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-10 py-12 animate-in zoom-in duration-700">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse scale-150"></div>
                      <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 border-4 border-white shadow-2xl relative z-10">
                         <Trophy size={64} />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-emerald-500">
                        <PartyPopper size={24} />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-4xl font-black text-slate-900 tracking-tight">Magnificent Work!</h3>
                      <p className="text-slate-500 font-bold text-lg max-w-md mx-auto">
                        That was just one small seed. Imagine what an entire garden of missions can do for your brain!
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                      <button 
                        onClick={onStart}
                        className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                      >
                        Unlock 100+ Missions <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={resetDemo}
                        className="px-10 py-5 bg-slate-50 text-slate-400 rounded-[2rem] font-black text-lg hover:bg-slate-100 transition-all active:scale-95"
                      >
                        Try Another Demo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full flex flex-col gap-12">
                {/* Custom Builder Row */}
                <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                      <Wand2 size={160} />
                   </div>
                   <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">AI Mission Builder</h3>
                        <p className="text-slate-400 font-medium mb-8">
                          Want something unique? Choose a skill and a world, and BloomBrain AI will build a mission for you in seconds.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(['working_memory', 'attention', 'logic', 'emotion_regulation'] as CognitiveSkillType[]).map((skill) => (
                            <button
                              key={skill}
                              onClick={() => setCustomSkill(skill)}
                              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${customSkill === skill ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
                            >
                              {skill.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={customTheme}
                            onChange={(e) => setCustomTheme(e.target.value)}
                            placeholder="e.g. Candy Planet..."
                            className="w-full bg-white/10 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg font-bold focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 text-white"
                          />
                          <button 
                            onClick={() => {
                              const themes = ["Robot Jungle", "Cloud Kingdom", "Dino Valley", "Neon Ocean"];
                              setCustomTheme(themes[Math.floor(Math.random() * themes.length)]);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                          >
                            <Dices size={20} />
                          </button>
                        </div>
                        <button 
                          onClick={generateCustomMission}
                          className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3 whitespace-nowrap"
                        >
                          Build <Sparkles size={18} />
                        </button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                  {INITIAL_MISSIONS.map((mission) => (
                    <div key={mission.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <ActivityCard 
                        title={mission.name}
                        skill={mission.primarySkill === 'working_memory' ? 'Memory Magic' : mission.primarySkill === 'logic' ? 'Puzzle Master' : mission.primarySkill === 'attention' ? 'Focus Power' : 'Feelings Hero'}
                        duration={mission.durationMinutes}
                        difficulty={mission.difficultyLevel}
                        ageGroupBadge={mission.ageGroup}
                        onClick={() => setActiveDemo(mission)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <VideoGuide />
      <Features />
    </div>
  );
}
