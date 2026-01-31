import React from 'react';
import { Menu } from 'lucide-react';

interface NavbarProps {
  onLoginClick?: () => void;
}

/**
 * Navbar component for the BloomBrain marketing site.
 * Provides consistent branding and navigation links for guardians and visitors.
 */
const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100]">
      {/* Brand Section: Unified Split-Brain Logo */}
      <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.href = '/'}>
        <div className="h-12 w-12 rounded-xl bg-white shadow-lg relative z-10 border-2 border-white flex overflow-hidden transform group-hover:rotate-6 transition-transform duration-500">
          <div className="flex-1 bg-emerald-400" />
          <div className="flex-1 bg-rose-400" />
        </div>
        <span className="text-2xl font-black text-slate-900 tracking-tighter">BloomBrain</span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-10">
        <a href="/science" className="text-sm font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">The Science</a>
        <a href="#safety" className="text-sm font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Safety</a>
        <a href="#pricing" className="text-sm font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Pricing</a>
      </div>

      {/* Primary Action Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onLoginClick}
          className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-100"
        >
          Login
        </button>
        {/* Mobile menu toggle (icon only for now) */}
        <button className="md:hidden p-2 text-slate-400" aria-label="Toggle Menu">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
