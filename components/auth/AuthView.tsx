"use client";
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface AuthViewProps {
  onAuthSuccess: () => void;
  onCancel: () => void;
}

export default function AuthView({ onAuthSuccess, onCancel }: AuthViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingParent, setIsVerifyingParent] = useState(false);
  const [parentCode, setParentCode] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // In a real implementation with next-auth/react:
    // const res = await signIn('credentials', { email, password, redirect: false });
    // if (res?.error) setError("Invalid email or password");
    // else setIsVerifyingParent(true);
    
    // Simulating the flow for the interactive demo environment
    setTimeout(() => {
      if (email && password) {
        setIsVerifyingParent(true);
      } else {
        setError("Please enter both email and password");
      }
      setIsLoading(false);
    }, 800);
  };

  const verifyParent = () => {
    setIsLoading(true);
    // Final verification step before granting dashboard access
    setTimeout(() => {
      onAuthSuccess();
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-lg">
        <button 
          onClick={onCancel}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          {!isVerifyingParent ? (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                <ShieldCheck size={32} className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-medium mb-10">Access your parent dashboard and child's progress.</p>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in shake duration-300">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-400 text-sm font-bold">
                  New to BloomBrain? <button className="text-blue-600 hover:underline">Create Account</button>
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 duration-500 text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-8 mx-auto">
                <Lock size={36} className="text-amber-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Parental Gateway</h2>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Please enter the year you were born to verify you are an adult.
              </p>
              
              <input 
                type="text" 
                maxLength={4}
                value={parentCode}
                onChange={(e) => setParentCode(e.target.value.replace(/\D/g, ''))}
                placeholder="YYYY"
                className="w-full text-center text-4xl p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:outline-none focus:border-blue-400 transition-all mb-8 tracking-[0.5em] font-black text-slate-700"
              />

              <button 
                onClick={verifyParent}
                disabled={parentCode.length < 4 || isLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-slate-100 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Verify and Bloom"}
              </button>
              
              <button 
                onClick={() => setIsVerifyingParent(false)}
                className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Change Login Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
