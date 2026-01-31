"use client";
import React from 'react';
import MarketingLayout from '../(marketing)/layout';
import { Brain, Heart, Zap, Target, ShieldCheck, Microscope, BookCheck, Lightbulb, Compass, Award, Shuffle } from 'lucide-react';

export default function SciencePage() {
  const researchPillars = [
    {
      title: "Executive Function",
      source: "Harvard Center on the Developing Child",
      desc: "Our activities are designed to build the 'air traffic control' system of the brain: working memory, mental flexibility, and self-control.",
      icon: <Brain className="text-indigo-500" size={32} />,
      color: "bg-indigo-50"
    },
    {
      title: "Working Memory",
      source: "Baddeley's Model",
      desc: "Training the visual-spatial sketchpad through pattern recognition and storytelling to increase information retention capacity.",
      icon: <Target className="text-emerald-500" size={32} />,
      color: "bg-emerald-50"
    },
    {
      title: "Cognitive Flexibility",
      source: "Diamond, 2013",
      desc: "Measuring the CFM (alternativeAttempts / totalAttempts) to track how quickly a child pivots when faced with novel narrative constraints.",
      icon: <Shuffle className="text-amber-500" size={32} />,
      color: "bg-amber-50"
    },
    {
      title: "Emotion Regulation",
      source: "James Gross, Stanford",
      desc: "Interactive 'Feelings Mirror' sessions help children practice affective labeling and cognitive reappraisal in a safe environment.",
      icon: <Heart className="text-rose-500" size={32} />,
      color: "bg-rose-50"
    }
  ];

  return (
    <MarketingLayout>
      <div className="bg-slate-50 min-h-screen pb-32">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 pt-24 pb-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-100 rounded-full blur-[120px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8">
            <Microscope size={14} /> The Pedagogical Foundation
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8">
            Why <span className="text-indigo-600">BloomBrain</span> Works
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
            BloomBrain isn't just an app—it's a digital cognitive lab built on decades of peer-reviewed neuroscience and child development research.
          </p>
        </section>

        {/* Pillars Grid */}
        <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {researchPillars.map((pillar, i) => (
            <div key={i} className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className={`w-20 h-20 ${pillar.color} rounded-3xl flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform`}>
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{pillar.title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <BookCheck size={14} /> {pillar.source}
              </p>
              <p className="text-slate-500 font-medium leading-relaxed text-lg">
                {pillar.desc}
              </p>
            </div>
          ))}
        </section>

        {/* The Methodology Section */}
        <section className="max-w-6xl mx-auto px-8 bg-indigo-600 rounded-[4rem] py-20 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8 leading-tight">Our Adaptive <br/> Learning Loop</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">1</div>
                  <div>
                    <h4 className="font-black text-lg mb-1 uppercase tracking-widest">Cognitive Signal Detection</h4>
                    <p className="opacity-70 text-sm font-medium">Our AI monitors pauses, strategy shifts (CFM), and task engagement speed.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">2</div>
                  <div>
                    <h4 className="font-black text-lg mb-1 uppercase tracking-widest">Zone of Proximal Development</h4>
                    <p className="opacity-70 text-sm font-medium">Difficulty levels shift in real-time to keep the child in the "Flow Zone"—neither bored nor frustrated.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">3</div>
                  <div>
                    <h4 className="font-black text-lg mb-1 uppercase tracking-widest">Gentle Metacognition</h4>
                    <p className="opacity-70 text-sm font-medium">Buddy Chat ends with reflective prompts that encourage children to think about their own thinking.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10">
               <div className="flex items-center gap-4 mb-8">
                 <ShieldCheck size={32} className="text-emerald-400" />
                 <h3 className="text-xl font-black uppercase tracking-widest">Ethics First</h3>
               </div>
               <p className="text-lg opacity-80 leading-relaxed font-medium mb-8 italic">
                 "We've purposefully omitted 'addictive' design patterns like infinite feeds or streak-based anxiety. BloomBrain is designed to be closed after growth, not kept open for engagement."
               </p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-400 rounded-full border-2 border-white/20" />
                 <div>
                    <p className="text-xs font-black uppercase tracking-widest">Dr. Elena Bloom</p>
                    <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Head of Pedagogical Ethics</p>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Science Footer CTA */}
        <section className="mt-24 text-center px-8">
           <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Curious about the data behind your child's journey?</h3>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-100">
                View Sample Report
              </button>
              <button className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-50 transition-all">
                Download Research Whitepaper
              </button>
           </div>
        </section>
      </div>
    </MarketingLayout>
  );
}