
import React, { useState, useEffect } from 'react';
import { generateVeoVideo, checkApiKey, requestApiKey } from '../../lib/gemini';
// Fix: Use the correct path for VideoGenerationStatus from types/index.ts
import { VideoGenerationStatus } from '../../types/index';
import { Wand2, Loader2, Play, Download, ExternalLink, AlertTriangle, Stars, Sparkles } from 'lucide-react';

const MAGIC_MESSAGES = [
  "Mixing the rainbow colors...",
  "Teaching the characters to dance...",
  "Gathering fairy dust...",
  "Painting the sunshine...",
  "Finding the perfect magic wand...",
  "Whispering to the clouds...",
  "Almost ready for the big premiere!"
];

const VideoTab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [status, setStatus] = useState<VideoGenerationStatus>({ status: 'idle' });
  const [magicMessageIndex, setMagicMessageIndex] = useState(0);

  useEffect(() => {
    let interval: any;
    if (status.status === 'polling') {
      interval = setInterval(() => {
        setMagicMessageIndex((prev) => (prev + 1) % MAGIC_MESSAGES.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [status.status]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setStatus({ status: 'generating', progress: 'Waking up the Dream Machine...' });
    
    try {
      const hasKey = await checkApiKey();
      if (!hasKey) {
        await requestApiKey();
      }

      setStatus({ status: 'polling', progress: MAGIC_MESSAGES[0] });
      const videoUrl = await generateVeoVideo(prompt, aspectRatio);
      setStatus({ status: 'completed', videoUrl });
    } catch (err: any) {
      console.error(err);
      if (err.message === 'KEY_RESET_REQUIRED' || err.message?.includes('Requested entity was not found')) {
        await requestApiKey();
        setStatus({ status: 'error', error: 'Please choose a paid API key to start the Dream Machine!' });
      } else {
        setStatus({ status: 'error', error: err.message || 'The Dream Machine needs a nap! Try again in a moment.' });
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white border-2 border-slate-100 p-10 rounded-[3.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Stars size={140} className="text-blue-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-3xl text-blue-600 shadow-inner">
              <Wand2 size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Dream Lab</h2>
              <p className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">Powered by Veo 3.1</p>
            </div>
          </div>
          
          <p className="text-slate-500 font-medium mb-10 max-w-xl text-lg leading-relaxed">
            What magic can you imagine today? Describe it below, and I'll turn it into a short movie just for you!
          </p>

          <div className="space-y-8">
            <div className="group">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Your Movie Idea</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A friendly blue dragon eating a giant strawberry cupcake..."
                className="w-full bg-slate-50 border-4 border-transparent rounded-[2.5rem] p-8 text-xl font-bold focus:outline-none focus:border-blue-200 focus:bg-white transition-all min-h-[160px] text-slate-700 placeholder:text-slate-300 shadow-inner"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="w-full md:w-auto">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Movie Shape</label>
                <div className="flex gap-2 p-2 bg-slate-50 border-2 border-slate-100 rounded-[2rem]">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`px-8 py-3 text-xs font-black rounded-2xl transition-all ${aspectRatio === '16:9' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    TV View
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`px-8 py-3 text-xs font-black rounded-2xl transition-all ${aspectRatio === '9:16' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Phone View
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={status.status === 'generating' || status.status === 'polling' || !prompt.trim()}
                className="w-full md:flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-12 py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-blue-200 disabled:opacity-50 transition-all active:scale-95 group"
              >
                {status.status === 'generating' || status.status === 'polling' ? (
                  <><Loader2 className="animate-spin" size={28} /> Creating Magic...</>
                ) : (
                  <><Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" /> Create Movie</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {status.status === 'error' && (
        <div className="bg-rose-50 border-4 border-white p-8 rounded-[3rem] flex items-start gap-6 text-rose-600 shadow-xl animate-in shake duration-500">
          <div className="p-4 bg-white rounded-2xl text-rose-500 shadow-sm">
            <AlertTriangle size={32} />
          </div>
          <div className="flex-1">
            <p className="text-lg font-black mb-1">Oh Oh!</p>
            <p className="font-bold opacity-80">{status.error}</p>
            <button 
              onClick={() => window.open('https://ai.google.dev/gemini-api/docs/billing', '_blank')}
              className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
            >
              Billing Info <ExternalLink size={14} />
            </button>
          </div>
        </div>
      )}

      {(status.status === 'generating' || status.status === 'polling') && (
        <div className="bg-white border-2 border-slate-100 p-20 rounded-[4rem] flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 animate-pulse"></div>
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[100px] animate-pulse scale-150"></div>
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center animate-bounce duration-[2000ms]">
              <Sparkles size={64} className="text-blue-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">The Dream Machine is Humming!</h3>
          <p className="text-blue-600 text-xl font-black italic animate-in fade-in slide-in-from-bottom-2 duration-700" key={magicMessageIndex}>
            {MAGIC_MESSAGES[magicMessageIndex]}
          </p>
          <div className="mt-12 flex gap-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-4 h-4 rounded-full bg-blue-500 animate-bounce shadow-lg shadow-blue-100" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      )}

      {status.status === 'completed' && status.videoUrl && (
        <div className="bg-white border-2 border-slate-100 rounded-[4rem] overflow-hidden shadow-2xl ring-8 ring-blue-50 animate-in zoom-in-95 duration-700">
          <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Stars className="text-amber-400" size={24} />
              <span className="text-lg font-black text-slate-600">Your Magical Creation</span>
            </div>
            <a href={status.videoUrl} download="my-bloom-dream.mp4" className="flex items-center gap-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-200 active:scale-95">
              <Download size={20} /> Save Video
            </a>
          </div>
          <div className={`w-full bg-slate-900 flex items-center justify-center relative ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-[800px]'}`}>
            <video src={status.videoUrl} controls autoPlay loop className="max-w-full max-h-full shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTab;
