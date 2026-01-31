import React from 'react';
import { Heart, Instagram, Twitter, Github, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-24 px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-white shadow-lg relative z-10 border-2 border-white flex overflow-hidden">
              <div className="flex-1 bg-emerald-400" />
              <div className="flex-1 bg-rose-400" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">BloomBrain</span>
          </div>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
            A world-class cognitive suite designed for the next generation of explorers, builders, and dreamers.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#" className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-lg transition-all"><Instagram size={20} /></a>
            <a href="#" className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-lg transition-all"><Twitter size={20} /></a>
            <a href="#" className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-lg transition-all"><Github size={20} /></a>
          </div>
        </div>
        
        <div className="space-y-6">
          <h4 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Studio</h4>
          <ul className="space-y-4">
            <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors text-left">Story Time</button></li>
            <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors text-left">Buddy Chat</button></li>
            <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors text-left">Dream Lab</button></li>
            <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors text-left">Wonder Box</button></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Guardians</h4>
          <ul className="space-y-4">
            <li><a href="/science" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Research Basis</a></li>
            <li><a href="#safety" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Safety Protocols</a></li>
            <li><a href="#pricing" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a></li>
            <li><a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Billing & Keys</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Newsletter</h4>
          <p className="text-xs font-bold text-slate-400 leading-relaxed">
            Get weekly tips on cognitive development and creative play.
          </p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Your email" 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold focus:outline-none focus:border-indigo-400 transition-all"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 transition-colors">
              <Sparkles size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2025 BloomBrain AI. Built for the curious.</p>
        <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
          Made with <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" /> for future explorers
        </div>
      </div>
    </footer>
  );
};

export default Footer;