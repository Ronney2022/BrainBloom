
import React, { useState } from 'react';
import { getFastResponse } from '../../lib/gemini';
import { Zap, CornerDownLeft, Loader2, Sparkles, Copy, Check, Brain, Cpu, MessageCircle } from 'lucide-react';

const FlashTab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleQuery = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResponse('');
    try {
      const result = await getFastResponse(prompt);
      setResponse(result);
    } catch (err) {
      setResponse('My quick-thinker is a bit sleepy! Try again?');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    "Tell me a joke about space!",
    "Why is the sky blue?",
    "How big is a blue whale?",
    "What do bees do all day?"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-top-4 duration-500">
      <div className="text-center">
        <div className="inline-flex p-5 bg-amber-50 text-amber-500 rounded-[2.5rem] mb-6 shadow-lg shadow-amber-100 animate-float">
          <Zap size={48} fill="currentColor" />
        </div>
        <h2 className="text-4xl font-black mb-4 text-slate-800 tracking-tight">Flash Tab</h2>
        <p className="text-slate-500 font-medium text-lg">Instant answers powered by lightning-fast AI.</p>
      </div>

      <div className="relative group">
        {/* Electricity Glow Effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-[3rem] blur opacity-5 group-focus-within:opacity-20 transition-opacity"></div>
        <div className="relative flex flex-col bg-white border-2 border-slate-100 rounded-[3rem] p-4 shadow-xl">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleQuery(); } }}
            placeholder="Ask a quick question..."
            className="w-full bg-transparent border-none focus:ring-0 text-xl font-bold p-6 min-h-[140px] resize-none text-slate-800 placeholder:text-slate-300"
          />
          <div className="flex items-center justify-between px-6 pb-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lite Speed Mode Active</div>
            </div>
            <button
              onClick={handleQuery}
              disabled={loading || !prompt.trim()}
              className="p-4 bg-amber-500 text-white rounded-2xl hover:bg-amber-600 disabled:opacity-50 transition-all shadow-lg shadow-amber-200 active:scale-95"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <CornerDownLeft size={24} />}
            </button>
          </div>
        </div>
      </div>

      {!response && !loading && (
        <div className="flex flex-wrap gap-3 justify-center">
          {examples.map(ex => (
            <button
              key={ex}
              onClick={() => { setPrompt(ex); handleQuery(); }}
              className="px-6 py-3 bg-white border-2 border-slate-100 rounded-full text-sm font-black text-slate-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all shadow-sm"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Accelerated Neural Orbits */}
            <div className="absolute inset-0 border-4 border-amber-100/50 rounded-full animate-[spin_1.5s_linear_infinite]">
              <div className="absolute -top-2 left-1/2 w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
            </div>
            <div className="absolute inset-4 border-4 border-yellow-100/50 rounded-full animate-[spin_1s_linear_infinite_reverse]">
              <div className="absolute -bottom-2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]"></div>
            </div>
            
            {/* Core Brain */}
            <div className="relative z-10 w-24 h-24 bg-white rounded-[2rem] shadow-2xl border-2 border-amber-50 flex items-center justify-center">
              <Zap className="text-amber-500 animate-pulse" size={48} fill="currentColor" />
            </div>
          </div>
          
          <div className="mt-12 space-y-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <Zap className="text-amber-400" size={16} />
              <p className="text-xl font-black text-slate-800 tracking-tight">Lite Reasoning Active</p>
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">
              Optimizing for speed...
            </p>
          </div>
        </div>
      )}

      {response && !loading && (
        <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 relative group animate-in fade-in slide-in-from-bottom-8 duration-700 kid-shadow">
          <button 
            onClick={copyToClipboard}
            className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-amber-600"
          >
            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
          </button>
          
          <div className="flex items-start gap-4 mb-6">
             <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                <MessageCircle size={20} />
             </div>
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Fast Response</div>
          </div>

          <div className="prose prose-slate max-w-none text-xl font-bold text-slate-700 leading-relaxed whitespace-pre-wrap italic">
            "{response}"
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Flash Delivery System</span>
            <button 
              onClick={() => { setPrompt(''); setResponse(''); }}
              className="text-xs font-black text-slate-400 hover:text-slate-600 underline underline-offset-4"
            >
              Clear and Repeat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashTab;
