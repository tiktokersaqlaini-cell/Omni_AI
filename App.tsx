
import React, { useState, useRef } from 'react';
import { 
  Video, 
  Mic, 
  Share2, 
  Download, 
  Play, 
  Loader2, 
  Sparkles, 
  Layers, 
  Music, 
  Youtube, 
  Instagram, 
  Zap,
  ChevronRight,
  Volume2,
  Image as ImageIcon,
  Twitter,
  Linkedin,
  Film,
  Settings,
  Monitor,
  MessageSquare,
  Globe,
  ExternalLink
} from 'lucide-react';
import { generateOmniContent, generateSpeech, decodeBase64, decodeAudioData } from './services/geminiService';
import { GeneratedContent, TabType } from './types';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.VIDEO);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await generateOmniContent(input);
      setData(result);
    } catch (error) {
      console.error("Content generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVoice = async () => {
    if (!data || isSpeaking) return;
    setIsSpeaking(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioData = await generateSpeech(data.voice.fullScript, data.voice.suggestedVoiceName);
      const decodedBytes = decodeBase64(audioData);
      const audioBuffer = await decodeAudioData(decodedBytes, audioContextRef.current);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (err) {
      console.error("Audio error:", err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      {/* Dynamic Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white" size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tight">OMNI<span className="text-blue-500">PRO</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <button className="px-5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white hover:bg-slate-800 transition-all">Sign In</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        {/* Hero Section */}
        <section className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-bold text-indigo-400 uppercase tracking-widest">
            <Sparkles size={14} />
            Next-Gen Content Suite
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] max-w-4xl mx-auto">
            Build Your Viral <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Empire Fast</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            From a single prompt to a full production suite. Scripts, visuals, AI voices, and social distribution kits in one click.
          </p>
        </section>

        {/* Action Center */}
        <div className="max-w-3xl mx-auto relative mb-24">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative flex flex-col md:flex-row gap-3 p-3 bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl">
            <input 
              className="flex-1 bg-transparent px-6 py-4 text-lg outline-none placeholder:text-slate-600"
              placeholder="What's your vision? (e.g. AI-First Business Model)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
              {loading ? 'Synthesizing...' : 'Generate Empire'}
            </button>
          </div>
        </div>

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 space-y-3">
              <NavButton active={activeTab === TabType.VIDEO} icon={<Film />} label="Video Production" sub="Storyboards & Scenes" onClick={() => setActiveTab(TabType.VIDEO)} />
              <NavButton active={activeTab === TabType.VOICE} icon={<Mic />} label="Voice Engine" sub="Persona & Synthesis" onClick={() => setActiveTab(TabType.VOICE)} />
              <NavButton active={activeTab === TabType.SOCIAL} icon={<Share2 />} label="Social Multiplier" sub="Distribution Kit" onClick={() => setActiveTab(TabType.SOCIAL)} />
              <NavButton active={activeTab === TabType.SETTINGS} icon={<Settings />} label="Production Specs" sub="Tech Meta-data" onClick={() => setActiveTab(TabType.SETTINGS)} />
            </aside>

            {/* Content Display */}
            <div className="lg:col-span-9 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              {activeTab === TabType.VIDEO && <VideoProduction data={data.video} />}
              {activeTab === TabType.VOICE && <VoiceEngine data={data.voice} onPlay={handlePlayVoice} isSpeaking={isSpeaking} />}
              {activeTab === TabType.SOCIAL && <SocialMultiplier data={data.social} />}
              {activeTab === TabType.SETTINGS && <ProductionSpecs data={data} />}
            </div>
          </div>
        )}
      </main>

      <footer className="py-20 text-center border-t border-slate-900">
        <p className="text-slate-500 text-sm">&copy; 2024 OmniContent Pro. Empowered by Gemini 3.</p>
      </footer>
    </div>
  );
};

/* --- Sub-Components --- */

const NavButton: React.FC<{ active: boolean, icon: any, label: string, sub: string, onClick: () => void }> = ({ active, icon, label, sub, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full group text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
      active 
        ? 'bg-blue-600/10 border-blue-500/40 text-blue-50 shadow-lg' 
        : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-900/50 hover:border-slate-800'
    }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
      {icon}
    </div>
    <div>
      <div className="font-bold text-sm">{label}</div>
      <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">{sub}</div>
    </div>
    {active && <ChevronRight size={14} className="ml-auto text-blue-500" />}
  </button>
);

const VideoProduction: React.FC<{ data: GeneratedContent['video'] }> = ({ data }) => {
  const handleGenerateExternalVideo = () => {
    // Placeholder URL passing production parameters
    const baseUrl = "https://veo-studio.example.com/generate";
    const params = new URLSearchParams({
      title: data.title,
      script: data.script,
      scenes: JSON.stringify(data.scenes),
      mood: data.musicMood
    });
    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">{data.title}</h2>
          <div className="flex items-center gap-2 mt-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
            <Monitor size={14} />
            Cinematic Production Script
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="px-4 py-2 bg-slate-950 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-400">
            <Music className="inline-block mr-2" size={12} /> {data.musicMood}
          </div>
          <button 
            onClick={handleGenerateExternalVideo}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Video size={16} />
            Generate Video
            <ExternalLink size={14} className="opacity-60" />
          </button>
        </div>
      </div>

      <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl">
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">High-Retention Hook</span>
        <p className="text-xl font-medium text-slate-100 italic">"{data.hook}"</p>
      </div>

      <div className="space-y-6">
        {data.scenes.map((scene, i) => (
          <div key={i} className="group grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950/40 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all">
            <div className="md:col-span-1 flex flex-col items-center">
              <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-slate-400">
                {i+1}
              </span>
              <div className="w-px h-full bg-slate-800 my-4 group-last:hidden"></div>
            </div>
            <div className="md:col-span-4 space-y-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visual Prompt</span>
              <div className="p-4 bg-[#050505] rounded-xl border border-slate-900 text-sm text-slate-300 italic leading-relaxed">
                {scene.visualPrompt}
              </div>
              <span className="text-[10px] text-blue-500/60 font-mono tracking-tighter">{scene.duration}</span>
            </div>
            <div className="md:col-span-7 space-y-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Narrative Text</span>
              <p className="text-slate-200 leading-relaxed text-lg font-medium">{scene.narrativeText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VoiceEngine: React.FC<{ data: GeneratedContent['voice'], onPlay: () => void, isSpeaking: boolean }> = ({ data, onPlay, isSpeaking }) => (
  <div className="p-12 flex flex-col items-center justify-center text-center space-y-10 min-h-[500px]">
    <div className="relative">
      <div className={`absolute -inset-8 bg-blue-600/20 blur-3xl rounded-full transition-all duration-1000 ${isSpeaking ? 'scale-150 opacity-100' : 'scale-75 opacity-0'}`}></div>
      <div className={`relative w-24 h-24 rounded-full bg-slate-800 border-2 flex items-center justify-center transition-all ${isSpeaking ? 'border-blue-500 animate-pulse' : 'border-slate-700'}`}>
        <Volume2 size={40} className={isSpeaking ? 'text-blue-500' : 'text-slate-500'} />
      </div>
    </div>

    <div className="space-y-2">
      <h2 className="text-4xl font-black text-white">{data.persona}</h2>
      <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm">{data.tone} Performance Profile</p>
    </div>

    <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 max-w-2xl text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <MessageSquare size={100} />
      </div>
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-4">Voiceover Script</span>
      <p className="text-slate-300 text-lg leading-relaxed italic">"{data.fullScript}"</p>
    </div>

    <div className="flex gap-4">
      <button 
        onClick={onPlay}
        disabled={isSpeaking}
        className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 disabled:opacity-50"
      >
        {isSpeaking ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" size={20} />}
        {isSpeaking ? 'Generating Voice...' : 'Preview Performance'}
      </button>
      <button className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all border border-slate-700 flex items-center gap-3">
        <Download size={20} />
        Export Studio PCM
      </button>
    </div>
    <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
      <div className="flex items-center gap-2">
        <Settings size={14} /> Profile: {data.suggestedVoiceName}
      </div>
      <div className="flex items-center gap-2">
        <Monitor size={14} /> Speed: {data.speed || '1.0x'}
      </div>
    </div>
  </div>
);

const SocialMultiplier: React.FC<{ data: GeneratedContent['social'] }> = ({ data }) => (
  <div className="p-8 space-y-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* YouTube & LinkedIn */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-500 font-black uppercase tracking-widest text-xs">
            <Youtube size={16} fill="currentColor" /> YouTube Studio
          </div>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-white font-black text-lg leading-tight">{data.youtube?.title}</p>
            <p className="text-slate-400 text-sm line-clamp-3">{data.youtube?.caption}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-widest text-xs">
            <Linkedin size={16} fill="currentColor" /> LinkedIn Pro
          </div>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-white font-bold text-base leading-snug underline underline-offset-4">{data.linkedin?.title}</p>
            <p className="text-slate-400 text-sm">{data.linkedin?.caption}</p>
          </div>
        </div>
      </div>

      {/* Short Form - TikTok / IG / Twitter */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-pink-500 font-black uppercase tracking-widest text-xs">
            <Instagram size={16} /> IG / TikTok Reel
          </div>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <span className="text-[10px] font-black text-pink-500/60 uppercase tracking-widest block mb-2">Overlay Hook</span>
              <p className="text-white font-black text-2xl uppercase italic">"{data.instagram?.hook}"</p>
            </div>
            <p className="text-slate-400 text-sm italic">"{data.instagram?.caption}"</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-400 font-black uppercase tracking-widest text-xs">
            <Twitter size={16} fill="currentColor" /> X Thread Starter
          </div>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <p className="text-slate-200 text-sm leading-relaxed">{data.twitter?.caption}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex items-center gap-3 text-slate-500 font-black uppercase tracking-widest text-xs">
        <Globe size={16} /> Global SEO Matrix
      </div>
      <div>
        <span className="text-[10px] font-black text-slate-600 uppercase mb-2 block tracking-widest">Metadata Description</span>
        <p className="text-slate-300 text-sm leading-relaxed">{data.seoDescription}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.globalTags?.map((tag, idx) => (
          <span key={idx} className="px-3 py-1.5 bg-blue-500/5 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-500/10 cursor-default transition-all">
            #{tag.replace(/\s+/g, '')}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ProductionSpecs: React.FC<{ data: any }> = ({ data }) => (
  <div className="p-8 space-y-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Color Palette</span>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <p className="text-white font-bold text-sm">{data.video.colorPalette || 'Modern Neon'}</p>
        </div>
      </div>
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Audio Profile</span>
        <div className="flex items-center gap-3">
          <Volume2 className="text-slate-500" size={16} />
          <p className="text-white font-bold text-sm">24kHz PCM / Mono</p>
        </div>
      </div>
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Target Engine</span>
        <div className="flex items-center gap-3">
          <Monitor className="text-slate-500" size={16} />
          <p className="text-white font-bold text-sm">Gemini 3 Flash</p>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Full Raw JSON Blueprint</h3>
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-h-[400px] overflow-auto">
        <pre className="text-xs text-blue-400/80 font-mono leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  </div>
);

export default App;
