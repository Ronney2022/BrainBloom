
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize2, Sparkles, Brain, Zap, Target, Microscope, RefreshCw, Activity, Search, Sun, Waves, TreePine, Mountain } from 'lucide-react';

export default function VideoGuide() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [curiosityScore, setCuriosityScore] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setHasError(false);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Video playback failed:", err);
        setHasError(true);
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Simulate cognitive discovery metrics
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCuriosityScore(prev => {
          const delta = Math.floor(Math.random() * 5);
          return Math.min(prev + delta, 100);
        });
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleVideoError = () => {
    console.error("Video source failed to load.");
    setHasError(true);
  };

  return (
    <section className="px-6 py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6">
            <Microscope size={14} /> Discovery Lab v5
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
            Active <span className="text-emerald-600">Cognition</span> Mapping
          </h2>
          <p className="text-slate-500 font-medium text-xl max-w-3xl mx-auto leading-relaxed">
            BloomBrain doesn't just show videos—it maps the child's discovery journey. 
            Watch how our AI anchors attention on complex natural patterns to foster deep learning.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto group">
          {/* Brand Accents */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-100 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-100 rounded-full blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Main Lab Terminal (Video Container) */}
          <div className="relative bg-slate-900 rounded-[4rem] md:rounded-[5.5rem] overflow-hidden shadow-[0_64px_100px_-20px_rgba(0,0,0,0.3)] border-[16px] border-white ring-1 ring-slate-100 aspect-video flex items-center justify-center group/video">
            
            {/* Neural Overlay Layer */}
            {isPlaying && !hasError && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                {/* Simulated Focus Points */}
                <div className="absolute top-[25%] left-[25%] flex flex-col items-center animate-float">
                  <div className="w-5 h-5 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.8)] animate-ping" />
                  <div className="mt-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest">Fractal Pattern: Detected</p>
                  </div>
                </div>

                <div className="absolute bottom-[35%] right-[20%] flex flex-col items-center animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="w-5 h-5 bg-indigo-400 rounded-full shadow-[0_0_20px_rgba(129,140,248,0.8)] animate-ping" />
                  <div className="mt-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest">Depth Perspective: Active</p>
                  </div>
                </div>

                {/* Cognitive HUD Data */}
                <div className="absolute top-12 left-12 p-8 border border-white/10 bg-black/40 rounded-[2.5rem] backdrop-blur-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg">
                      <Brain className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Discovery Index</p>
                      <p className="text-2xl font-black text-white tracking-tight">{curiosityScore}%</p>
                    </div>
                  </div>
                  <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-1000" 
                      style={{ width: `${curiosityScore}%` }} 
                    />
                  </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 px-10 py-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-amber-400 animate-pulse" size={16} />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neuro-Sync: Online</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`w-1 h-3 rounded-full ${i <= (curiosityScore/20) ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Learning Bandwidth</span>
                  </div>
                </div>
              </div>
            )}

            {!isPlaying || hasError ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-[2px] transition-all duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop" 
                  alt="Nature Exploration" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover/video:scale-105 transition-transform duration-1000"
                />
                
                {hasError ? (
                  <div className="relative z-20 text-center">
                    <div className="w-24 h-24 bg-rose-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
                      <RefreshCw size={40} className="animate-spin" />
                    </div>
                    <h3 className="text-white text-3xl font-black mb-4">Connection Stalled</h3>
                    <p className="text-white/60 font-medium mb-10">Refreshing the discovery stream...</p>
                    <button 
                      onClick={() => { setHasError(false); setIsPlaying(false); }}
                      className="px-10 py-4 bg-white text-slate-900 font-black rounded-3xl hover:bg-emerald-50 transition-all shadow-xl active:scale-95"
                    >
                      Retry Lab Session
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={togglePlay}
                      className="relative z-20 w-32 h-32 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-3xl hover:scale-110 active:scale-95 transition-all group/btn"
                    >
                      <Play size={48} fill="currentColor" className="ml-2" />
                      <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20 group-hover/btn:opacity-40"></div>
                    </button>
                    <div className="relative z-20 mt-12 flex flex-col items-center">
                      <p className="text-white font-black uppercase tracking-[0.5em] text-sm drop-shadow-lg mb-6">
                        Initialize Discovery Scan
                      </p>
                      <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                        <div className="h-full bg-emerald-400 animate-[loading_2s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-black">
                <video 
                  ref={videoRef}
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  onError={handleVideoError}
                  className="w-full h-full object-cover opacity-90"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video UI Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-12 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-between opacity-0 group-hover/video:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center gap-10">
                    <button onClick={togglePlay} className="text-white hover:scale-125 transition-transform">
                      <Pause size={32} />
                    </button>
                    <div className="flex flex-col gap-2">
                       <div className="w-80 h-2 bg-white/20 rounded-full relative overflow-hidden">
                          <div className="absolute top-0 left-0 h-full w-full bg-emerald-500 origin-left animate-[progress_15s_linear_infinite]"></div>
                       </div>
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Cognitive Syncing in Progress</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-white">
                    <Volume2 size={28} className="cursor-pointer hover:text-emerald-400 transition-colors" />
                    <Maximize2 size={28} className="cursor-pointer hover:text-emerald-400 transition-colors" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feature Highlights beneath Video */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="flex flex-col items-center group/card">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-600 mb-8 shadow-sm group-hover/card:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                <Mountain size={32} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Pattern Anchoring</h4>
              <p className="text-slate-500 font-medium leading-relaxed">Children learn to process complex visual data by identifying recurring natural geometries, strengthening semantic memory.</p>
            </div>
            <div className="flex flex-col items-center group/card">
              <div className="w-20 h-20 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 mb-8 shadow-sm group-hover/card:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <Target size={32} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Focus Elasticity</h4>
              <p className="text-slate-500 font-medium leading-relaxed">AI-driven focus points nudge the child's attention toward fine details, building the stamina required for classroom learning.</p>
            </div>
            <div className="flex flex-col items-center group/card">
              <div className="w-20 h-20 bg-amber-50 rounded-[2.5rem] flex items-center justify-center text-amber-500 mb-8 shadow-sm group-hover/card:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                <TreePine size={32} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Nature Logic</h4>
              <p className="text-slate-500 font-medium leading-relaxed">By exploring ecological connections, children develop systems-thinking skills and a deeper appreciation for environmental science.</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </section>
  );
}
