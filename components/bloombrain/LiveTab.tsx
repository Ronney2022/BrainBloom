
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, Camera, CameraOff, Power, PowerOff, Loader2, Volume2, User, Ghost, Sparkles, Wand2, Star, BookOpen, Quote, Lightbulb, MapPin, PersonStanding, History, ChevronDown, BarChart3, Clock, AlertCircle, Shuffle } from 'lucide-react';
import { getStoryHints } from '../../lib/gemini';

// Implementation of manual encode/decode as per requirements
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveTab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStoryMode, setIsStoryMode] = useState(true);
  const [transcription, setTranscription] = useState<{ user: string; model: string }>({ user: '', model: '' });
  const [audioLevels, setAudioLevels] = useState({ user: 0, model: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [storyBeatCount, setStoryBeatCount] = useState(0);
  const [hints, setHints] = useState<string[]>([]);
  const [loadingHints, setLoadingHints] = useState(false);
  const [isWaitingForQuestion, setIsWaitingForQuestion] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Stats tracking including CFM components
  const [stats, setStats] = useState({
    sessionDuration: 0,
    pausesTaken: 0,
    taskCompletion: false,
    frustrationSignals: 0,
    alternativeAttempts: 0, 
    totalAttempts: 0        
  });

  const [storyJournal, setStoryJournal] = useState<{ characters: string[], settings: string[], events: string[] }>({
    characters: [],
    settings: [],
    events: []
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextsRef = useRef<{ input?: AudioContext; output?: AudioContext }>({});
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const frameIntervalRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<number>(0);
  const chosenHintsRef = useRef<Set<string>>(new Set());

  const stopAll = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextsRef.current.input) {
      audioContextsRef.current.input.close();
      audioContextsRef.current.input = undefined;
    }
    if (audioContextsRef.current.output) {
      audioContextsRef.current.output.close();
      audioContextsRef.current.output = undefined;
    }
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    
    // Calculate final duration
    if (sessionStartTimeRef.current > 0) {
      const duration = Math.round((Date.now() - sessionStartTimeRef.current) / 60000);
      setStats(prev => ({ ...prev, sessionDuration: duration, taskCompletion: storyBeatCount > 5 }));
      setShowStats(true);
    }

    setIsActive(false);
    setIsConnecting(false);
    setStoryBeatCount(0);
    setHints([]);
    setIsWaitingForQuestion(false);
    chosenHintsRef.current.clear();
  };

  const handleHintClick = (hint: string) => {
    if (sessionRef.current && isActive) {
      sessionRef.current.sendRealtimeInput({ text: hint });
      
      const isAlternative = !chosenHintsRef.current.has(hint);
      setStats(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        alternativeAttempts: isAlternative ? prev.alternativeAttempts + 1 : prev.alternativeAttempts
      }));
      chosenHintsRef.current.add(hint);

      setHints([]);
      setIsWaitingForQuestion(false);
    }
  };

  const startSession = async (initialPrompt?: string) => {
    setIsConnecting(true);
    setHints([]);
    setShowStats(false);
    setStoryBeatCount(0);
    setStats({ 
      sessionDuration: 0, 
      pausesTaken: 0, 
      taskCompletion: false, 
      frustrationSignals: 0,
      alternativeAttempts: 0,
      totalAttempts: 0
    });
    sessionStartTimeRef.current = Date.now();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // CRITICAL: Initialize and resume context on this user click
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      if (inputCtx.state === 'suspended') await inputCtx.resume();
      if (outputCtx.state === 'suspended') await outputCtx.resume();
      
      audioContextsRef.current = { input: inputCtx, output: outputCtx };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isCameraActive });
      if (videoRef.current && isCameraActive) {
        videoRef.current.srcObject = stream;
      }

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            let lastAudioActiveTime = Date.now();

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const level = Math.sqrt(sum / inputData.length);
              setAudioLevels(prev => ({ ...prev, user: level }));
              
              if (level > 0.05) {
                lastAudioActiveTime = Date.now();
              } else if (Date.now() - lastAudioActiveTime > 5000) {
                setStats(prev => ({ ...prev, pausesTaken: prev.pausesTaken + 1 }));
                lastAudioActiveTime = Date.now(); 
              }

              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            if (initialPrompt) {
              sessionPromise.then(session => {
                session.sendRealtimeInput({ text: initialPrompt });
              });
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              setAudioLevels(prev => ({ ...prev, model: 0.8 }));
              setTimeout(() => setAudioLevels(prev => ({ ...prev, model: 0 })), audioBuffer.duration * 1000);
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent?.inputTranscription?.text || '';
              setTranscription(prev => ({ ...prev, user: text }));
            }
            
            let fullOutput = '';
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent?.outputTranscription?.text || '';
              setTranscription(prev => ({ ...prev, model: prev.model + text }));
              fullOutput += text;
            }

            if (message.serverContent?.turnComplete) {
              const currentModelText = transcription.model || fullOutput;
              if (isStoryMode) {
                setLoadingHints(true);
                setIsWaitingForQuestion(true);
                getStoryHints(currentModelText).then(newHints => {
                  setHints(newHints);
                  setLoadingHints(false);
                });
              }
              setTranscription(prev => ({ ...prev, model: '' }));
              setStoryBeatCount(c => c + 1);
            }
          },
          onerror: () => stopAll(),
          onclose: () => stopAll()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "You are BloomBuddy, the supportive AI friend. Keep turns short and end with a question."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setIsConnecting(false);
      alert("Please ensure your microphone is enabled!");
    }
  };

  useEffect(() => {
    return () => stopAll();
  }, []);

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-8">
          <div className={`bg-white border-2 rounded-[3rem] p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px] transition-all duration-500 ${isWaitingForQuestion ? 'border-indigo-400 shadow-2xl ring-4 ring-indigo-50' : 'border-slate-100 kid-shadow'}`}>
            <div className="relative z-10 flex flex-col items-center gap-10">
              <div className={`w-40 h-40 rounded-[2.5rem] border-8 flex items-center justify-center transition-all duration-700 ${isActive ? 'border-indigo-500 rotate-3 scale-110 shadow-2xl animate-float' : 'border-slate-100'}`}>
                {isActive ? (
                  <div className="w-32 h-32 bg-indigo-600 rounded-[2rem] flex items-center justify-center">
                    <BookOpen size={60} className="text-white" />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300">
                    <PowerOff size={60} />
                  </div>
                )}
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {isActive ? "Buddy is listening..." : isConnecting ? "Waking up Buddy..." : "Ready for an Adventure?"}
                </h2>
                <p className="text-slate-500 font-medium mt-2 max-w-xs mx-auto">
                  {isActive ? (isWaitingForQuestion ? "It's your turn to decide!" : "Buddy is sharing a story beat...") : "Pick a starter or say hello to start co-creating!"}
                </p>
              </div>

              {isActive && hints.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 animate-in zoom-in-95 duration-500 max-w-lg">
                  {hints.map((hint, i) => (
                    <button
                      key={i}
                      onClick={() => handleHintClick(hint)}
                      className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm border-2 active:scale-95 ${isWaitingForQuestion ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 mt-4">
                <button
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  disabled={isActive || isConnecting}
                  className={`p-5 rounded-3xl transition-all ${isCameraActive ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-200' : 'bg-slate-50 text-slate-400'} disabled:opacity-50`}
                >
                  {isCameraActive ? <Camera size={28} /> : <CameraOff size={28} />}
                </button>
                
                <button
                  onClick={isActive ? stopAll : () => startSession()}
                  disabled={isConnecting}
                  className={`px-12 py-5 rounded-[2rem] font-black text-xl flex items-center gap-4 transition-all shadow-2xl ${isActive ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'} disabled:opacity-50 active:scale-95`}
                >
                  {isConnecting ? <Loader2 size={28} className="animate-spin" /> : isActive ? <><Power size={28} /> End Story</> : <><Mic size={28} /> Begin Buddy Chat</>}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-[2.5rem] p-10 min-h-[160px] flex items-center justify-center border-2 border-white relative overflow-hidden">
            <div className="text-center space-y-3 relative z-10 max-w-2xl">
              <p className={`text-2xl font-bold leading-tight ${transcription.user ? 'text-slate-700' : 'text-slate-300'}`}>
                {transcription.user ? `"${transcription.user}"` : transcription.model ? transcription.model : "BloomBuddy is listening for your creative ideas..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTab;
