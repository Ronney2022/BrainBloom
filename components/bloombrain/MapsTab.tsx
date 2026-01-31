
import React, { useState } from 'react';
import { getMapsResponse } from '../../lib/gemini';
import { Map, Search, Loader2, Navigation, ExternalLink, MapPin, Sparkles } from 'lucide-react';

const MapsTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, links: any[] } | null>(null);

  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setResult(null);

    try {
      let location: { latitude: number, longitude: number } | undefined;
      
      // Attempt to get user location
      try {
        const position: any = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch (e) {
        console.warn("Location access denied or timed out, searching generally.");
      }

      const response = await getMapsResponse(query, location);
      setResult(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "Cool playgrounds nearby",
    "Science museums for kids",
    "Public libraries with children's sections",
    "Best parks for a picnic"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex p-5 bg-teal-50 text-teal-600 rounded-[2.5rem] mb-6 shadow-lg shadow-teal-50">
          <Map size={48} />
        </div>
        <h2 className="text-4xl font-black mb-4 text-slate-800 tracking-tight">Local Finder</h2>
        <p className="text-slate-500 font-medium text-lg">Let's find some amazing places to explore in the real world!</p>
      </div>

      <div className="bg-white border-2 border-slate-100 p-8 rounded-[3rem] shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
           <Navigation size={120} className="text-teal-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSearch(); }}
              placeholder="What are we looking for today?"
              className="w-full pl-16 pr-8 py-6 bg-slate-50 border-4 border-transparent rounded-[2rem] text-xl font-bold focus:outline-none focus:border-teal-200 transition-all text-slate-700 placeholder:text-slate-300"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-10 py-6 bg-teal-600 hover:bg-teal-700 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-teal-100 disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? <Loader2 size={28} className="animate-spin" /> : <Navigation size={28} />}
            Find
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {examples.map(ex => (
            <button
              key={ex}
              onClick={() => setQuery(ex)}
              className="px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-full text-xs font-black text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-all"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-6 py-20">
          <div className="w-24 h-24 border-8 border-teal-50 border-t-teal-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black text-lg animate-pulse uppercase tracking-[0.2em]">Searching the map...</p>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-2 bg-white border-2 border-slate-100 rounded-[3rem] p-10 kid-shadow">
            <div className="flex items-center gap-3 mb-6">
               <Sparkles size={20} className="text-teal-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Buddy's Discovery Notes</span>
            </div>
            <div className="prose prose-slate max-w-none text-xl font-bold text-slate-700 leading-relaxed italic">
              {result.text}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">Discovery Links</h3>
            {result.links.length > 0 ? (
              result.links.map((link, i) => (
                <a
                  key={i}
                  href={link.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-teal-50 border-2 border-white p-6 rounded-[2rem] hover:shadow-xl transition-all group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className="text-teal-500" size={20} />
                    <ExternalLink className="text-teal-300 group-hover:text-teal-500" size={16} />
                  </div>
                  <p className="font-black text-teal-900 group-hover:text-teal-600">{link.title}</p>
                  <p className="text-[10px] font-black text-teal-400 uppercase mt-2 tracking-widest">Open in Maps</p>
                </a>
              ))
            ) : (
              <div className="bg-slate-50 border-2 border-white p-10 rounded-[2rem] text-center opacity-40">
                <MapPin size={40} className="mx-auto mb-4 text-slate-300" />
                <p className="text-xs font-black uppercase tracking-widest">No links found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapsTab;
