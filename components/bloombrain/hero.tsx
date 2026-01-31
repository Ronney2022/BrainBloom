
"use client";
import React from 'react';
import { Sparkles, ArrowRight, Stars, Music, Book, Lightbulb } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="px-6 py-16 md:py-24 text-center max-w-7xl mx-auto animate-in fade-in slide-in-from-top-4 duration-1000 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-100 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 relative z-10">
        <Sparkles size={14} /> Where Imagination Blooms
      </div>
      
      <h1 className="text-5xl md:text-8xl font-black leading-[0.95] text-slate-900 tracking-tight mb-8 relative z-10">
        Creative AI for<br />
        <span className="text-indigo-600">Curious Minds.</span>
      </h1>

      <p className="mt-8 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium relative z-10">
        BloomBrain is a magical studio where children use AI to build focus, memory, and emotional intelligence through playful exploration.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 relative z-10">
        <button 
          onClick={onStart}
          className="px-12 py-6 rounded-[2rem] bg-indigo-600 text-white font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95 flex items-center justify-center gap-3 group"
        >
          Enter the Lab <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
        <button className="px-12 py-6 rounded-[2rem] border-4 border-slate-100 text-slate-500 font-black text-xl hover:bg-slate-50 transition-all active:scale-95">
          See How it Works
        </button>
      </div>
      
      {/* BloomBrain Master Logo Illustration */}
      <div className="mt-24 relative max-w-4xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-4 bg-indigo-500/10 rounded-[5rem] blur-2xl group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
          
          <div className="relative bg-white rounded-[5rem] p-8 shadow-2xl border-4 border-white overflow-hidden transform hover:scale-[1.01] transition-all duration-1000">
            <div className="bg-gradient-to-br from-indigo-50/50 via-white to-rose-50/50 aspect-video rounded-[4rem] flex flex-col items-center justify-center relative overflow-hidden border-2 border-slate-50">
               
               {/* Animated Background Icons from Logo */}
               <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="absolute top-10 left-[10%] text-emerald-300 animate-float" style={{ animationDuration: '4s' }}><Book size={48} /></div>
                  <div className="absolute top-20 right-[15%] text-indigo-300 animate-float" style={{ animationDuration: '5s' }}><Music size={40} /></div>
                  <div className="absolute bottom-20 left-[15%] text-amber-300 animate-float" style={{ animationDuration: '6s' }}><Lightbulb size={54} /></div>
                  <div className="absolute bottom-10 right-[10%] text-rose-300 animate-float" style={{ animationDuration: '7s' }}><Sparkles size={48} /></div>
               </div>

               {/* Central Brand Imagery: Green & Pink Split Brain */}
               <div className="relative z-10 flex flex-col items-center gap-8">
                  <div className="relative w-72 h-72 transform group-hover:scale-105 transition-transform duration-1000">
                    <div className="absolute inset-0 bg-white rounded-full shadow-2xl blur-xl opacity-50"></div>
                    <div className="relative w-full h-full flex p-2 bg-white rounded-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-8 border-slate-50 overflow-hidden">
                      {/* Perfectly Seamed Halves */}
                      <div className="flex-1 bg-emerald-400 flex items-center justify-center text-white">
                         <div className="w-1/2 h-1/2 border-4 border-white/20 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-rose-400 flex items-center justify-center text-white">
                         <div className="w-1/2 h-1/2 border-4 border-white/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center px-8 relative">
                    <h2 className="text-5xl font-black text-slate-800 tracking-tight relative z-20">BloomBrain</h2>
                    <p className="text-indigo-400 font-black uppercase tracking-[0.5em] text-[10px] mt-4 opacity-70">Grow Smarter, Gently</p>
                    
                    {/* Kids simulation */}
                    <div className="mt-8 flex justify-center gap-12">
                       <div className="flex flex-col items-center gap-2 animate-float">
                          <div className="w-12 h-12 bg-rose-200 rounded-full border-4 border-white shadow-md" />
                          <div className="w-1 h-3 bg-rose-100 rounded-full" />
                       </div>
                       <div className="flex flex-col items-center gap-2 animate-float" style={{ animationDelay: '0.5s' }}>
                          <div className="w-16 h-16 bg-blue-200 rounded-full border-4 border-white shadow-md" />
                          <div className="w-1 h-4 bg-blue-100 rounded-full" />
                       </div>
                       <div className="flex flex-col items-center gap-2 animate-float" style={{ animationDelay: '1s' }}>
                          <div className="w-12 h-12 bg-emerald-200 rounded-full border-4 border-white shadow-md" />
                          <div className="w-1 h-3 bg-emerald-100 rounded-full" />
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
