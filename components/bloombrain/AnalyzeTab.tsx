
import React, { useState, useRef } from 'react';
import { analyzeVideo } from '../../lib/gemini';
import { Eye, Upload, FileVideo, Loader2, Sparkles, Search, XCircle } from 'lucide-react';

const AnalyzeTab: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const examples = [
    { label: "Summarize Actions", text: "Summarize the key actions in this clip in a way a child can understand." },
    { label: "Identify Emotions", text: "Describe the emotions shown in this video. How do the characters feel?" },
    { label: "Educational Facts", text: "What are some fun and educational facts about the objects or animals we see here?" },
    { label: "Scientific Logic", text: "Explain the science behind what's happening in this video. Why does it work like that?" },
    { label: "Safety Check", text: "Are the characters being safe and kind to each other in this video?" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("Oops! That video is too big for my tiny box. Try a smaller one under 20MB!");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setResult('');
      // Set a default prompt if none exists
      if (!prompt) setPrompt(examples[0].text);
    }
  };

  const handleAnalyze = async () => {
    if (!videoFile || !prompt.trim() || loading) return;
    setLoading(true);
    setResult('');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzeVideo(base64, videoFile.type, prompt);
        setResult(analysis);
        setLoading(false);
      };
      reader.readAsDataURL(videoFile);
    } catch (err) {
      setResult('I missed a detail! Can we try analyzing again? The Dream Machine might be busy.');
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full animate-in zoom-in-95 duration-500">
      <div className="space-y-8">
        <div className="bg-white border-2 border-slate-100 p-10 rounded-[3rem] shadow-xl">
          <header className="mb-8">
            <h2 className="text-3xl font-black mb-4 flex items-center gap-3 text-slate-800">
              <Search className="text-emerald-500" aria-hidden="true" />
              Mystery Box Lab
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Show me a video, and I'll tell you all the secrets hidden inside! From science to social cues, let's explore together.
            </p>
          </header>

          {!videoFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              onKeyPress={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              tabIndex={0}
              role="button"
              aria-label="Upload a video to analyze"
              className="border-4 border-dashed border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center cursor-pointer transition-all group focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                <Upload className="text-slate-300 group-hover:text-emerald-500" size={40} />
              </div>
              <p className="text-slate-400 font-black text-lg">Drop your video here!</p>
              <p className="text-slate-300 text-xs font-bold uppercase mt-2">MP4 or WebM (Max 20MB)</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="aspect-video bg-slate-900 rounded-[2rem] overflow-hidden relative group kid-shadow">
                <video src={videoPreview!} controls className="w-full h-full object-contain" aria-label="Selected video preview" />
                <button 
                  onClick={() => { setVideoFile(null); setVideoPreview(null); setResult(''); }}
                  className="absolute top-4 right-4 px-4 py-2 bg-white/90 hover:bg-rose-500 hover:text-white text-slate-800 font-black rounded-2xl text-xs transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                >
                  Pick New Video
                </button>
              </div>
              <div className="bg-emerald-50 p-5 rounded-3xl flex items-center gap-4 border-2 border-white">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <FileVideo className="text-emerald-500" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-700 truncate">{videoFile.name}</p>
                  <p className="text-xs font-bold text-emerald-600">Perfect size for investigating!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {videoFile && (
          <div className="bg-white border-2 border-slate-100 p-10 rounded-[3rem] shadow-xl animate-in slide-in-from-bottom-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center">
              <span>What should I look for?</span>
              {prompt && (
                <button 
                  onClick={() => setPrompt("")}
                  className="text-emerald-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  aria-label="Clear prompt"
                >
                  <XCircle size={14} /> <span className="text-[10px]">Clear</span>
                </button>
              )}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Example prompts">
              {examples.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setPrompt(ex.text)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border-2 ${
                    prompt === ex.text 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                  }`}
                >
                  {ex.label}
                </button>
              ))}
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent rounded-3xl p-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 min-h-[120px] mb-8 text-slate-700 placeholder:text-slate-300"
              placeholder="Tell me what you want to discover about this video..."
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !prompt.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 transition-all shadow-2xl shadow-emerald-100 active:scale-95"
            >
              {loading ? (
                <><Loader2 size={24} className="animate-spin" /> Investigating Clues...</>
              ) : (
                <><Sparkles size={24} /> Run Video Analysis</>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col bg-white border-2 border-slate-100 rounded-[3rem] overflow-hidden shadow-xl min-h-[500px]">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Detective Lab Output</span>
          {loading && <div className="text-xs font-black text-emerald-600 animate-pulse flex items-center gap-2">
            <Loader2 size={12} className="animate-spin" /> 
            Thinking...
          </div>}
        </div>
        <div className="flex-1 p-10 overflow-y-auto">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <Eye size={80} className="mb-6 text-slate-400" />
              <p className="text-lg font-black text-slate-500 max-w-xs">Waiting for your investigation to begin!</p>
            </div>
          )}
          {loading && (
            <div className="space-y-6">
              <div className="h-6 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
              <div className="h-6 bg-slate-100 rounded-full w-1/2 animate-pulse"></div>
              <div className="h-32 bg-slate-100 rounded-[2rem] w-full animate-pulse"></div>
            </div>
          )}
          {result && (
            <div className="prose prose-slate max-w-none animate-in fade-in slide-in-from-bottom-2 duration-1000">
              <div className="p-8 bg-emerald-50/30 rounded-[2rem] border-2 border-emerald-50 text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeTab;
