
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Trophy, 
  Brain, 
  Target, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Lightbulb, 
  Eye,
  Smile
} from 'lucide-react';
import { BloomBrainActivity } from '../../types/index';

interface GameModuleProps {
  activity: BloomBrainActivity;
  onComplete: () => void | Promise<void>;
}

/**
 * GameModule handles the interactive exercise states:
 * 1. Intro (Briefing)
 * 2. Memorize (Optional for sequence games)
 * 3. Play (Interactive grid)
 * 4. Feedback (Win/Loss screens)
 */
const GameModule: React.FC<GameModuleProps> = ({ activity, onComplete }) => {
  const [gameState, setGameState] = useState<'intro' | 'memorize' | 'play' | 'feedback'>('intro');
  const [userSelection, setUserSelection] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shake, setShake] = useState(false);
  const [timer, setTimer] = useState(0);

  const gameData = activity.gameData;

  // Essential safety: if no game data, we can't play
  if (!gameData || !gameData.items || gameData.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <Brain size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800">Mission Data Missing</h3>
        <p className="text-slate-500 mt-2">BloomBuddy is still gathering the magical items. Try again in a moment!</p>
      </div>
    );
  }

  // Handle start click
  const handleStart = () => {
    if (gameData.type === 'sequence') {
      setGameState('memorize');
    } else {
      setGameState('play');
    }
  };

  // Automated transitions for memorization
  useEffect(() => {
    let timeout: any;
    if (gameState === 'memorize') {
      const delay = 2500 + (activity.difficultyLevel * 800);
      timeout = setTimeout(() => {
        setGameState('play');
      }, delay);
    }
    return () => clearTimeout(timeout);
  }, [gameState, activity.difficultyLevel]);

  // Handle game logic
  const handleItemClick = (index: number) => {
    if (gameState !== 'play') return;

    if (gameData.type === 'sequence') {
      const nextStepIndex = userSelection.length;
      const expectedIndex = gameData.solution[nextStepIndex];

      if (index === expectedIndex) {
        const newSelection = [...userSelection, index];
        setUserSelection(newSelection);
        
        if (newSelection.length === gameData.solution.length) {
          setIsCorrect(true);
          setGameState('feedback');
        }
      } else {
        setIsCorrect(false);
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setGameState('feedback');
        }, 400);
      }
    } else {
      const isWinner = gameData.solution.includes(index);
      setIsCorrect(isWinner);
      if (!isWinner) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
      setGameState('feedback');
    }
  };

  const resetGame = () => {
    setGameState('intro');
    setUserSelection([]);
    setIsCorrect(null);
  };

  const renderPlayState = () => {
    if (gameData.type === 'pattern_completion') {
      return (
        <div className={`flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500 p-6 w-full ${shake ? 'animate-shake' : ''}`}>
          <div className="flex gap-4 mb-12">
            {gameData.items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="w-24 h-24 bg-white border-4 border-slate-100 rounded-[2rem] flex items-center justify-center text-5xl shadow-md">
                {item}
              </div>
            ))}
            <div className="w-24 h-24 bg-slate-50 border-4 border-dashed border-indigo-200 rounded-[2rem] flex items-center justify-center text-3xl font-black text-indigo-300">
              ?
            </div>
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-8">What comes next in the pattern?</p>
          <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
            {gameData.items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleItemClick(idx)}
                className="py-6 rounded-[2rem] bg-white border-4 border-slate-50 text-4xl shadow-md hover:border-indigo-100 transition-all active:scale-95"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (gameData.type === 'emotional_matching') {
      return (
        <div className={`flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500 p-6 w-full ${shake ? 'animate-shake' : ''}`}>
           <div className="w-full max-w-md bg-indigo-50 border-4 border-white rounded-[3rem] p-10 mb-10 shadow-xl text-center">
              <Smile className="mx-auto mb-6 text-indigo-400" size={48} />
              <p className="text-2xl font-black text-slate-800 leading-tight">
                {gameData.items[0]}
              </p>
           </div>
           <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-8">Choose the matching feeling</p>
           <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {gameData.items.slice(1).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleItemClick(idx + 1)}
                  className="py-5 px-4 rounded-[2rem] bg-white border-2 border-slate-100 text-lg font-bold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all active:scale-95 shadow-sm"
                >
                  {item}
                </button>
              ))}
           </div>
        </div>
      );
    }

    // Default grid layout for sequence, matching, odd_one_out
    return (
      <div className={`flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500 p-6 w-full ${shake ? 'animate-shake' : ''}`}>
        <div className="w-full max-w-xl flex items-center justify-between mb-8 bg-slate-50/80 backdrop-blur-sm p-6 rounded-[2.5rem] border-2 border-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
              <Target size={20} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Live Challenge</p>
              <p className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">
                {activity.primarySkill.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
             {gameData.type === 'sequence' && gameData.solution.map((_, i) => (
               <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i < userSelection.length ? 'bg-indigo-600' : 'bg-slate-200'}`} />
             ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl">
          {gameData.items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleItemClick(idx)}
              className={`aspect-square rounded-[3rem] bg-white border-4 text-6xl flex items-center justify-center shadow-xl transition-all active:scale-90 hover:shadow-2xl hover:-translate-y-2 ${
                userSelection.includes(idx) && gameData.type === 'sequence' 
                  ? 'border-indigo-600 bg-indigo-50 opacity-60' 
                  : 'border-slate-50 hover:border-indigo-100'
              }`}
            >
              <span className="drop-shadow-md">{item}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col pt-4">
      
      {/* 1. INTRO STATE: Briefing */}
      {gameState === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-start animate-in fade-in zoom-in-95 duration-500 p-6 pt-10">
          <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 mb-6 shadow-lg border-4 border-white animate-float">
            <Brain size={48} />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">Mission Briefing</h2>
          
          <div className="bg-slate-50 p-8 md:p-10 rounded-[3rem] border-2 border-white mb-8 shadow-inner max-w-lg w-full">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-3 text-center">Your Instructions</p>
            <p className="text-slate-800 font-bold text-xl md:text-2xl leading-relaxed italic text-center">
              "{activity.customInstructions || 'Complete the brain puzzle!'}"
            </p>
          </div>

          <button 
            onClick={handleStart}
            className="px-14 py-5 bg-indigo-600 text-white rounded-[2.5rem] font-black text-lg hover:bg-indigo-700 shadow-2xl transition-all active:scale-95 flex items-center gap-4 mt-auto mb-6"
          >
            I'm Ready! <ArrowRight size={24} />
          </button>
        </div>
      )}

      {/* 2. MEMORIZE STATE */}
      {gameState === 'memorize' && (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 p-6">
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-amber-50 text-amber-600 rounded-full text-[12px] font-black uppercase tracking-[0.3em] mb-16 shadow-sm border border-amber-100">
             <Star size={16} className="animate-spin" /> Look Closely & Remember
          </div>
          
          <div className="flex justify-center flex-wrap gap-8">
            {gameData.solution.map((idx, i) => (
              <div 
                key={i} 
                className="w-24 h-24 bg-white border-4 border-indigo-100 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {gameData.items[idx]}
              </div>
            ))}
          </div>
          
          <p className="mt-16 text-slate-400 font-black text-xs uppercase tracking-widest animate-pulse">
            Get ready... items will disappear soon!
          </p>
        </div>
      )}

      {/* 3. PLAY STATE */}
      {gameState === 'play' && renderPlayState()}

      {/* 4. FEEDBACK STATE */}
      {gameState === 'feedback' && (
        <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-700 p-6">
          {isCorrect ? (
            <div className="text-center space-y-10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-[60px] animate-pulse scale-150"></div>
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center text-amber-500 border-8 border-amber-50 shadow-2xl relative z-10">
                   <Trophy size={80} />
                </div>
              </div>
              
              <div className="space-y-3">
                 <h3 className="text-4xl font-black text-slate-900 tracking-tight">Magnificent!</h3>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">You mastered the {activity.primarySkill.replace('_', ' ')} path!</p>
              </div>

              <button 
                onClick={onComplete}
                className="px-20 py-7 bg-emerald-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-emerald-700 shadow-2xl shadow-emerald-100 transition-all active:scale-95 flex items-center gap-4 mx-auto group"
              >
                Collect Seeds <CheckCircle2 size={32} className="group-hover:scale-125 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="text-center space-y-10">
              <div className="w-32 h-32 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-500 mb-10 mx-auto shadow-lg border-4 border-white">
                 <RotateCcw size={64} className="animate-spin" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">Almost Had It!</h3>
              <p className="text-slate-500 font-medium text-xl max-w-sm mx-auto leading-relaxed">
                Every try makes your brain stronger. BloomBuddy believes in you!
              </p>
              
              <button 
                onClick={resetGame}
                className="px-14 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl hover:bg-slate-800 shadow-2xl transition-all active:scale-95 flex items-center gap-4 justify-center mx-auto"
              >
                Restart Mission <RotateCcw size={24} />
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.15s ease-in-out infinite;
        }
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
};

export default GameModule;
