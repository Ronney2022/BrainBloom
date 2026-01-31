import React from 'react';

const features = [
  {
    title: "AI That Understands Children",
    desc: "Adaptive learning based on emotional and cognitive signals, ensuring a personalized growth path.",
  },
  {
    title: "No Addiction Loops",
    desc: "Designed with ethical psychology at the core—not dopamine traps—to protect developing focus.",
  },
  {
    title: "Parent-First Transparency",
    desc: "Clear progress, calm insights, and full control over your child's digital cognitive environment.",
  },
];

export default function Features() {
  return (
    <section className="px-6 py-24 bg-slate-50/50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative rounded-[2.5rem] p-10 bg-white border-2 border-slate-100 shadow-sm transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-indigo-500/10 hover:scale-[1.03] hover:border-indigo-200 cursor-default"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
               <div className="w-2 h-2 rounded-full bg-indigo-600 group-hover:bg-white transition-colors"></div>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-indigo-600 transition-colors">
              {f.title}
            </h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              {f.desc}
            </p>
            <div className="absolute bottom-6 right-10 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-500">
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Learn More</span>
            </div>
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-indigo-500/0 group-hover:bg-indigo-500/[0.02] transition-colors duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
