"use client";
import React, { useState } from 'react';
import MarketingLayout from './(marketing)/layout.tsx';
import MarketingPage from './(marketing)/page.tsx';
import ChildDashboard from './dashboard/child/page.tsx';
import ParentDashboard from './dashboard/parent/page.tsx';
import AuthView from '../components/auth/AuthView.tsx';
import { checkApiKey, requestApiKey } from '../lib/gemini.ts';
import { ShieldCheck, Ghost, ArrowRight, Sparkles, Key, ExternalLink, Info } from 'lucide-react';

type AppViewState = 'marketing' | 'auth' | 'selection' | 'child-dashboard' | 'parent-dashboard' | 'key-check';

export default function Page() {
  const [view, setView] = useState<AppViewState>('marketing');

  const handleStart = () => setView('auth');
  const handleAuthSuccess = () => setView('selection');
  const handleBackToMarketing = () => setView('marketing');

  const enterGuardianPortal = async () => {
    const keySelected = await checkApiKey();
    if (!keySelected) {
      setView('key-check');
    } else {
      setView('parent-dashboard');
    }
  };

  const handleSelectKey = async () => {
    try {
      await requestApiKey();
      // Proceed immediately to allow browser to handle the trigger
      setView('parent-dashboard');
    } catch (err) {
      console.error("Key selection failed", err);
    }
  };

  if (view === 'child-dashboard') return <ChildDashboard />;
  if (view === 'parent-dashboard') return <ParentDashboard onBackToChild={() => setView('child-dashboard')} />;

  if (view === 'key-check') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-8 mx-auto">
            <Key size={40} className="text-amber-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 text-center">Guardian Setup</h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            To unlock the full potential of BloomBrain, please select a Paid API Key from Google AI Studio.
          </p>

          <button 
            onClick={handleSelectKey}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 mb-8"
          >
            Open Key Selector
          </button>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-left">
            <div className="flex gap-3 text-blue-700 font-bold text-xs uppercase tracking-widest mb-2">
              <Info size={14} /> Browser Tip
            </div>
            <p className="text-blue-600 text-sm font-medium leading-relaxed">
              If the selector window doesn't appear, check if your browser blocked a popup! <strong>Firefox users:</strong> ensure you allow popups for this site.
            </p>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              Billing Documentation <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'selection') {
    return (
      <div className="min-h-screen bg-[#FDFEFF] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-rose-100/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-5xl w-full relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2.5rem] blur-xl animate-pulse"></div>
              <div className="h-28 w-28 rounded-[2.5rem] bg-white shadow-2xl relative z-10 border-4 border-white flex overflow-hidden transform hover:rotate-6 transition-transform">
                <div className="flex-1 bg-emerald-400" />
                <div className="flex-1 bg-rose-400" />
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Sparkles size={12} /> Secured Gateway
            </div>
            <h2 className="text-6xl font-black text-slate-900 tracking-tight mb-4">Welcome to BloomBrain</h2>
            <p className="text-slate-400 font-bold text-lg uppercase tracking-[0.3em]">Choose your portal to begin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <SelectionCard 
              title="Explorer" 
              subtitle="Enter the creative lab"
              description="Stories, Dream Labs, and AI Buddy Chat await."
              icon={<Ghost size={64} className="text-indigo-600" />}
              onClick={() => setView('child-dashboard')}
              color="indigo"
              delay="0"
            />
            <SelectionCard 
              title="Guardian" 
              subtitle="View insights & controls"
              description="Monitor progress, safety, and cognitive metrics."
              icon={<ShieldCheck size={64} className="text-slate-900" />}
              onClick={enterGuardianPortal}
              color="slate"
              delay="150ms"
            />
          </div>
          
          <div className="mt-20 text-center">
             <button 
              onClick={handleBackToMarketing}
              className="px-10 py-4 bg-white border border-slate-200 text-slate-400 font-black hover:text-slate-900 hover:border-slate-900 transition-all text-[10px] uppercase tracking-[0.4em] rounded-full shadow-sm"
             >
               Return to Landing
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <MarketingLayout onLoginClick={handleStart}>
        <AuthView onAuthSuccess={handleAuthSuccess} onCancel={handleBackToMarketing} />
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout onLoginClick={handleStart}>
      <MarketingPage onStart={handleStart} />
    </MarketingLayout>
  );
}

function SelectionCard({ title, subtitle, description, icon, onClick, color, delay }: any) {
  const themes: any = {
    indigo: "hover:border-indigo-500 hover:shadow-indigo-100 group-hover:bg-indigo-50/10",
    slate: "hover:border-slate-900 hover:shadow-slate-200 group-hover:bg-slate-50/10",
  };
  return (
    <button 
      onClick={onClick}
      style={{ animationDelay: delay }}
      className={`bg-white p-14 rounded-[4rem] border-2 border-slate-50 shadow-2xl transition-all duration-700 text-center flex flex-col items-center group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 ${themes[color]}`}
    >
      <div className="mb-12 transform group-hover:scale-125 transition-all duration-700 group-hover:-rotate-6 relative z-10">
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-slate-900">{title}</h3>
        <p className="text-slate-400 font-black mb-6 uppercase tracking-[0.2em] text-[10px]">{subtitle}</p>
        <p className="text-slate-500 text-sm font-medium max-w-[220px] mb-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-2xl relative z-10">
        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
      </div>
      
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-slate-50 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-1000 group-hover:bg-indigo-100"></div>
    </button>
  );
}