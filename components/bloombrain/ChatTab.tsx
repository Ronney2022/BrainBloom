import React, { useState, useRef, useEffect } from 'react';
import { createProChat, hasApiKey } from '../../lib/gemini';
import { ChatMessage } from '../../types/index';
import { Send, User, Ghost, Loader2, Sparkles, Trash2, Key } from 'lucide-react';

const ChatTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const chatInstance = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (!hasApiKey()) {
      setNeedsKey(true);
      return;
    }
    
    try {
      chatInstance.current = createProChat();
      setMessages([{ 
        role: 'model', 
        text: 'Hi! I am BloomBrain. Want to write a story together or learn something amazing?',
        timestamp: getTimestamp()
      }]);
    } catch (e) {
      setNeedsKey(true);
    }
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading || !chatInstance.current) return;
    const userMessage = input.trim();
    const time = getTimestamp();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage, timestamp: time }]);
    setLoading(true);
    try {
      const result = await chatInstance.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: result.text || 'My thinking gears got stuck! Ask me again?',
        timestamp: getTimestamp()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Oops! I had a little hiccup. Can you say that again?',
        timestamp: getTimestamp()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear our story journey and start a new one?")) {
      chatInstance.current = createProChat();
      setMessages([{ 
        role: 'model', 
        text: 'Hi! I am BloomBrain. Want to write a story together or learn something amazing?',
        timestamp: getTimestamp()
      }]);
    }
  };

  if (needsKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl p-12 text-center">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-8 text-amber-500">
          <Key size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">Magic Key Required</h2>
        <p className="text-slate-500 font-medium max-w-md mb-8">
          BloomBrain needs a magic API key to wake up its imagination. Please ask a grown-up to help in the Guardian portal!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl overflow-hidden">
      <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Sparkles size={18} className="text-indigo-600" />
          </div>
          <span className="font-black text-slate-700 uppercase tracking-widest text-sm">Story & Learning</span>
        </div>
        <button 
          onClick={handleClearChat}
          className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50"
        >
          <Trash2 size={14} /> Clear Journey
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 scroll-smooth">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} 
              ${msg.role === 'user' ? 'animate-message-user' : 'animate-message-ai'}`}
          >
            <div className={`group flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-white border-2 border-slate-100'}`}>
                {msg.role === 'user' ? <User size={20} className="text-white" /> : <Ghost size={20} className="text-indigo-500" />}
              </div>
              <div className="flex flex-col gap-1 relative">
                <div className={`p-5 rounded-3xl text-sm font-medium leading-relaxed kid-shadow ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                  {msg.text}
                </div>
                {msg.timestamp && (
                  <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-5 ${msg.role === 'user' ? 'right-0' : 'left-0'}`}>
                    {msg.timestamp}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start animate-message-ai">
            <div className="flex gap-4 items-end">
              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shadow-md animate-pulse">
                <Ghost size={20} className="text-indigo-500" />
              </div>
              <div className="bg-white p-5 rounded-3xl rounded-tl-none border-2 border-slate-100 kid-shadow flex items-center gap-3">
                <Loader2 size={20} className="animate-spin text-indigo-400" />
                <span className="text-xs font-black text-indigo-300 uppercase tracking-widest animate-pulse">Buddy is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t-2 border-slate-100">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me about dinosaurs... or let's write a story!"
            className="flex-1 bg-slate-50 border-2 border-transparent text-slate-800 px-6 py-4 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;