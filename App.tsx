import React, { useState, useEffect } from 'react';
import { Search, Zap, Shield, Globe, Cpu, ChevronRight, Terminal, Database, Lock, Activity, Eye, Play, Hexagon, BarChart3, Wifi, Server, Radio, Code, Image as ImageIcon } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { StatsGrid } from './components/StatsGrid';
import { AnalysisBox } from './components/AnalysisBox';
import { VisualSynthesis } from './components/MemeGenerator';
import { VibeCoder } from './components/VibeCoder'; 
import { DexPair, AnalysisStatus, View } from './types';
import { fetchTokenData, generateAnalysis } from './services/api';

const LOGO_URL = "https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/ChatGPT%20Image%202026.%20jan.%2030.%2023_05_42.png";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [isLoading, setIsLoading] = useState(true);

  // Analyzer States
  const [address, setAddress] = useState('');
  const [data, setData] = useState<DexPair | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setStatus(AnalysisStatus.FETCHING_DATA);
    setError(null);
    setData(null);
    setAnalysis('');

    try {
      const tokenData = await fetchTokenData(address.trim());
      if (!tokenData) {
        setError("Invalid Contract Address. Target not found on Solana Chain.");
        setStatus(AnalysisStatus.ERROR);
        return;
      }

      setData(tokenData);
      setStatus(AnalysisStatus.ANALYZING);

      const aiResponse = await generateAnalysis(tokenData);
      setAnalysis(aiResponse);
      setStatus(AnalysisStatus.COMPLETE);

    } catch (err: any) {
      setError(`System Failure: ${err.message}`);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center font-mono z-[100] overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-10 animate-grid"></div>
         
         <div className="w-40 h-40 mb-8 relative">
             <div className="absolute inset-0 border-2 border-stone-800 clip-corner-1"></div>
             <div className="absolute inset-0 border-t-2 border-claw-500 rounded-sm animate-spin"></div>
             <div className="absolute inset-2 bg-black clip-corner-1 flex items-center justify-center overflow-hidden">
                 <img src={LOGO_URL} className="w-full h-full object-cover opacity-80" />
             </div>
         </div>
         
         <div className="text-center relative z-10">
            <h1 className="text-4xl text-white font-black tracking-tighter mb-2 animate-glitch">
              <span className="text-claw-500">Claw</span>Gpt
            </h1>
            <div className="flex items-center justify-center gap-2 text-[10px] text-claw-400 font-mono tracking-[0.3em]">
               <span className="animate-blink">_</span> SYSTEM_BOOT_SEQ_V2.6
            </div>
         </div>
         
         <div className="absolute bottom-10 left-0 w-full px-12">
            <div className="h-0.5 bg-stone-900 w-full overflow-hidden">
               <div className="h-full bg-claw-600 w-full animate-boot-bar"></div>
            </div>
            <div className="flex justify-between mt-2 text-[8px] text-stone-600 font-mono uppercase">
               <span>Loading Pincer Algorithms...</span>
               <span>100%</span>
            </div>
         </div>
      </div>
    );
  }

  const renderContent = () => {
    switch(currentView) {
      case View.IMAGEN:
        return <VisualSynthesis />;
      case View.VIBE_CODER:
        return <VibeCoder />;
      case View.TERMINAL:
        return (
          <div className="w-full max-w-7xl mx-auto p-4 animate-slide-up min-h-screen pt-32">
             <div className="bg-obsidian-900/90 border border-stone-800 clip-corner-2 shadow-2xl min-h-[800px] flex flex-col relative backdrop-blur-md">
                 
                 {/* Decorative Lines */}
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-claw-600 to-transparent opacity-50"></div>
                 <div className="absolute -left-2 top-20 w-1 h-20 bg-claw-600/30"></div>

                 {/* Terminal Header */}
                 <div className="p-8 border-b border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40">
                    <div>
                        <h2 className="text-2xl text-white font-black italic tracking-tighter flex items-center gap-3">
                           <Terminal className="text-claw-500" /> 
                           MARKET_SCANNER <span className="text-xs align-top text-stone-500 font-normal mt-1">V.2.6</span>
                        </h2>
                        <p className="text-xs text-stone-500 font-mono mt-2 flex items-center gap-2">
                           <span className="w-2 h-2 bg-claw-500 rounded-full animate-pulse"></span>
                           TARGET ACQUISITION MODE ACTIVE
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-3 py-1 bg-claw-900/20 border border-claw-900/50 text-[10px] text-claw-400 font-mono">
                           SECURE_CONN
                        </div>
                        <div className="px-3 py-1 bg-stone-900 border border-stone-800 text-[10px] text-stone-500 font-mono">
                           LATENCY: 12ms
                        </div>
                    </div>
                 </div>

                 <div className="p-6 md:p-8 flex-1 flex flex-col">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto w-full mb-8 relative group z-10">
                       <div className="absolute -inset-1 bg-gradient-to-r from-claw-600 to-stone-800 rounded opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>
                       <div className="relative flex bg-black clip-corner-1 border border-stone-700">
                         <div className="pl-4 flex items-center justify-center text-stone-500">
                            <Search size={18} />
                         </div>
                         <input 
                           type="text" 
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}
                           placeholder="INPUT_SOLANA_CONTRACT_ADDRESS..."
                           className="flex-1 bg-transparent text-white px-4 py-4 font-mono text-sm focus:outline-none placeholder-stone-700 tracking-wider"
                         />
                         <button 
                           type="submit"
                           disabled={status === AnalysisStatus.FETCHING_DATA || status === AnalysisStatus.ANALYZING}
                           className="bg-claw-700 hover:bg-claw-600 text-white px-8 font-bold font-mono text-xs tracking-widest disabled:opacity-50 transition-colors clip-hex mr-1 my-1"
                         >
                           {status === AnalysisStatus.FETCHING_DATA ? 'SCANNING' : 'EXECUTE'}
                         </button>
                       </div>
                    </form>

                    {error && (
                       <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-950/20 border-l-2 border-red-500 text-red-400 text-xs font-mono flex items-center gap-3 animate-glitch">
                          <Shield size={16} /> ERROR: {error}
                       </div>
                    )}

                    {/* Content Area */}
                    {data ? (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in pb-10">
                         {/* Header Card */}
                         <div className="lg:col-span-12 bg-black/50 border border-stone-800 p-6 clip-corner-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                               <Activity size={100} />
                            </div>
                            <div className="flex items-center gap-6 relative z-10">
                               <div className="w-16 h-16 rounded-sm border border-stone-700 p-1 bg-black">
                                   <img 
                                     src={data.baseToken.address ? `https://dd.dexscreener.com/ds-data/tokens/solana/${data.baseToken.address}.png` : ''} 
                                     onError={(e) => { e.currentTarget.style.display = 'none' }}
                                     className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                                   />
                               </div>
                               <div>
                                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{data.baseToken.name}</h2>
                                  <div className="flex items-center gap-4 mt-1">
                                      <span className="text-claw-500 font-mono text-sm font-bold tracking-widest">$ {data.baseToken.symbol}</span>
                                      <span className="text-stone-600 text-[10px] font-mono border border-stone-800 px-2 py-0.5 rounded-full">SOLANA_L1</span>
                                  </div>
                               </div>
                            </div>
                            <div className="mt-8">
                                <StatsGrid pair={data} />
                            </div>
                         </div>

                         {/* Chart Frame */}
                         <div className="lg:col-span-7 h-[500px] border border-stone-800 bg-black/80 relative group clip-corner-1">
                             <div className="absolute inset-0 flex items-center justify-center text-stone-700 font-mono text-xs uppercase tracking-widest pointer-events-none z-0">
                                Loading Chart Stream...
                             </div>
                             <iframe
                               src={`https://dexscreener.com/solana/${data.pairAddress}?embed=1&theme=dark&trades=0&info=0`}
                               className="w-full h-full border-0 relative z-10 opacity-90 group-hover:opacity-100 transition-opacity"
                             ></iframe>
                             
                             {/* Overlay decorations */}
                             <div className="absolute top-0 left-0 p-2 z-20 pointer-events-none">
                                <div className="text-[9px] text-claw-500 font-mono bg-black/80 px-1 border border-claw-900/50">LIVE_FEED</div>
                             </div>
                         </div>

                         {/* AI Analysis */}
                         <div className="lg:col-span-5 h-[500px]">
                            <AnalysisBox analysis={analysis} status={status} />
                         </div>
                      </div>
                    ) : (
                       <div className="flex-1 flex flex-col items-center justify-center text-stone-700 opacity-40">
                           <div className="w-32 h-32 border border-dashed border-stone-700 rounded-full flex items-center justify-center mb-6 animate-spin-slow">
                               <Terminal size={48} />
                           </div>
                           <p className="font-mono text-sm tracking-[0.2em]">AWAITING TARGET INPUT</p>
                           <p className="text-[10px] font-mono mt-2 text-stone-800">SYSTEM IDLE</p>
                       </div>
                    )}
                 </div>
             </div>
          </div>
        );
      case View.LANDING:
      default:
        return (
          <div className="w-full min-h-screen flex flex-col relative z-10 pt-32 px-4 overflow-x-hidden">
             
             {/* Left HUD Column (Desktop) */}
             <div className="fixed top-32 left-8 w-48 hidden xl:flex flex-col gap-6 z-20 animate-slide-up [animation-delay:0.5s]">
                <div className="p-4 border border-stone-800 bg-black/50 backdrop-blur-sm clip-corner-1">
                   <h3 className="text-[9px] font-mono text-claw-500 mb-3 flex items-center gap-2">
                     <Activity size={10} /> SYSTEM METRICS
                   </h3>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-mono text-stone-400">
                         <span>CPU_LOAD</span>
                         <span className="text-white">12%</span>
                      </div>
                      <div className="w-full h-1 bg-stone-900"><div className="w-[12%] h-full bg-claw-600"></div></div>
                      <div className="flex justify-between text-[9px] font-mono text-stone-400 mt-2">
                         <span>NEURAL_NET</span>
                         <span className="text-white">ACTIVE</span>
                      </div>
                      <div className="w-full h-1 bg-stone-900"><div className="w-[88%] h-full bg-green-500"></div></div>
                   </div>
                </div>
                
                <div className="p-4 border border-stone-800 bg-black/50 backdrop-blur-sm clip-corner-1">
                   <h3 className="text-[9px] font-mono text-claw-500 mb-3 flex items-center gap-2">
                     <Wifi size={10} /> NETWORK
                   </h3>
                   <div className="space-y-1 font-mono text-[9px] text-stone-500">
                      <p>&gt; SOLANA: CONNECTED</p>
                      <p>&gt; LATENCY: 14ms</p>
                      <p>&gt; BLOCK: 245,992,101</p>
                   </div>
                </div>
             </div>

             {/* Right HUD Column (Desktop) */}
             <div className="fixed top-32 right-8 w-48 hidden xl:flex flex-col gap-6 z-20 animate-slide-up [animation-delay:0.7s]">
                <div className="p-4 border border-stone-800 bg-black/50 backdrop-blur-sm clip-corner-2">
                   <h3 className="text-[9px] font-mono text-claw-500 mb-3 flex items-center gap-2">
                     <Server size={10} /> ACTIVE NODES
                   </h3>
                   <div className="grid grid-cols-4 gap-2">
                      {[...Array(12)].map((_,i) => (
                         <div key={i} className={`h-1 w-full rounded-sm ${Math.random() > 0.3 ? 'bg-claw-900' : 'bg-stone-800'}`}></div>
                      ))}
                   </div>
                   <p className="text-[8px] font-mono text-stone-600 mt-2 text-right">CLUSTER_STATUS_OK</p>
                </div>

                <div className="p-4 border border-stone-800 bg-black/50 backdrop-blur-sm clip-corner-2 text-right">
                   <h3 className="text-[9px] font-mono text-claw-500 mb-3 flex items-center justify-end gap-2">
                      ALERTS <Radio size={10} className="animate-pulse" />
                   </h3>
                   <div className="space-y-2">
                      <div className="text-[8px] font-mono text-stone-400 bg-stone-900/50 p-1 border-r-2 border-green-500">
                         RUG_CHECKER_ONLINE
                      </div>
                      <div className="text-[8px] font-mono text-stone-400 bg-stone-900/50 p-1 border-r-2 border-claw-500">
                         VOLATILITY_HIGH
                      </div>
                   </div>
                </div>
             </div>

             {/* Center Hero */}
             <div className="max-w-4xl mx-auto w-full text-center relative z-10 mb-20 md:mb-32">
                
                {/* Background Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] pointer-events-none z-0 opacity-20 blur-sm mix-blend-screen animate-pulse-slow">
                   <img src={LOGO_URL} className="w-full h-full object-contain" />
                </div>

                <div className="inline-flex items-center gap-2 mb-8 px-6 py-2 border-x border-claw-500/30 bg-black/60 text-claw-400 text-[10px] font-mono tracking-[0.3em] uppercase animate-fade-in backdrop-blur-md relative z-10">
                   <Zap size={10} /> Pincer Algorithms Online
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.9] relative animate-slide-up select-none z-10">
                   <span className="text-claw-500 filter drop-shadow-[0_0_25px_rgba(220,38,38,0.4)]">Claw</span>
                   <span className="text-white">Gpt</span>
                </h1>
                
                <p className="max-w-2xl mx-auto text-stone-300 font-mono text-sm md:text-base leading-relaxed mb-12 animate-slide-up [animation-delay:0.1s] bg-black/40 backdrop-blur-sm p-4 border-l-2 border-claw-500 relative z-10">
                   A next-generation <span className="text-claw-400 font-bold">Vibe Coder AI Agent</span>. 
                   We build autonomous web apps instantly, analyze Solana memecoins with surgical precision, and generate high-fidelity AI images.
                   The singularity is here.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center animate-slide-up [animation-delay:0.2s] relative z-10">
                   <button 
                     onClick={() => setCurrentView(View.VIBE_CODER)}
                     className="relative group bg-white text-black px-10 py-5 font-bold font-mono text-sm tracking-widest clip-corner-1 hover:bg-claw-100 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                   >
                      <div className="flex items-center gap-3 relative z-10">
                        <Code size={18} /> LAUNCH VIBE CODER
                      </div>
                   </button>
                   
                   <button 
                     onClick={() => setCurrentView(View.TERMINAL)}
                     className="relative group bg-black/80 text-white px-10 py-5 font-bold font-mono text-sm tracking-widest border border-stone-600 clip-corner-1 hover:border-claw-500 transition-all hover:bg-claw-900/20"
                   >
                      <div className="flex items-center gap-3 relative z-10">
                        <Terminal size={18} /> TERMINAL_ACCESS
                      </div>
                   </button>
                </div>
             </div>

             {/* Feature Cards - Updated to show all 4 tools */}
             <div className="max-w-7xl mx-auto w-full grid md:grid-cols-3 gap-6 mb-32 animate-slide-up [animation-delay:0.3s] relative z-10">
                
                {/* Vibe Coder */}
                <div onClick={() => setCurrentView(View.VIBE_CODER)} className="cursor-pointer bg-obsidian-900/90 border border-stone-800 p-8 clip-corner-2 relative overflow-hidden group hover:border-claw-500/50 transition-colors backdrop-blur-md">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-claw-900/10 blur-[60px] rounded-full group-hover:bg-claw-600/20 transition-colors"></div>
                   <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="w-10 h-10 bg-black border border-claw-900 flex items-center justify-center text-claw-500 clip-hex">
                         <Code size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white font-mono tracking-tight uppercase">Vibe Coder</h3>
                        <div className="h-0.5 w-12 bg-claw-600 mt-1"></div>
                      </div>
                   </div>
                   <p className="text-stone-400 text-xs md:text-sm leading-relaxed mb-6 font-mono relative z-10">
                      Autonomous frontend engineer. Describe a web app and watch it build itself instantly. Supports iterative updates with live preview.
                   </p>
                </div>

                {/* Market Scanner */}
                <div onClick={() => setCurrentView(View.TERMINAL)} className="cursor-pointer bg-obsidian-900/90 border border-stone-800 p-8 clip-corner-2 relative overflow-hidden group hover:border-claw-500/50 transition-colors backdrop-blur-md">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-claw-900/10 blur-[60px] rounded-full group-hover:bg-claw-600/20 transition-colors"></div>
                   <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="w-10 h-10 bg-black border border-claw-900 flex items-center justify-center text-claw-500 clip-hex">
                         <Terminal size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white font-mono tracking-tight uppercase">Market Scanner</h3>
                        <div className="h-0.5 w-12 bg-claw-600 mt-1"></div>
                      </div>
                   </div>
                   <p className="text-stone-400 text-xs md:text-sm leading-relaxed mb-6 font-mono relative z-10">
                      Deep analysis of Solana tokens. Enter a CA to get liquidity depth, volume analysis, and AI risk assessment.
                   </p>
                </div>

                {/* Visual Synthesis */}
                <div onClick={() => setCurrentView(View.IMAGEN)} className="cursor-pointer bg-obsidian-900/90 border border-stone-800 p-8 clip-corner-2 relative overflow-hidden group hover:border-claw-500/50 transition-colors backdrop-blur-md">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-claw-900/10 blur-[60px] rounded-full group-hover:bg-claw-600/20 transition-colors"></div>
                   <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="w-10 h-10 bg-black border border-claw-900 flex items-center justify-center text-claw-500 clip-hex">
                         <ImageIcon size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white font-mono tracking-tight uppercase">Visual Synthesis</h3>
                        <div className="h-0.5 w-12 bg-claw-600 mt-1"></div>
                      </div>
                   </div>
                   <p className="text-stone-400 text-xs md:text-sm leading-relaxed mb-6 font-mono relative z-10">
                      Generate high-fidelity AI images and memes using the Claw-V2-IMG model (Gemini 2.5).
                   </p>
                </div>

             </div>

             {/* Bottom Tech Specs */}
             <div className="max-w-4xl mx-auto w-full border-t border-stone-800 pt-12 pb-20 relative z-10">
                <div className="flex justify-between items-end mb-8">
                   <h3 className="text-stone-500 font-mono text-xs tracking-[0.3em] uppercase">Architecture Overview</h3>
                   <div className="flex gap-1">
                      <div className="w-2 h-2 bg-claw-600"></div>
                      <div className="w-2 h-2 bg-stone-800"></div>
                      <div className="w-2 h-2 bg-stone-800"></div>
                   </div>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-between gap-8 opacity-80 hover:opacity-100 transition-opacity">
                   <div className="flex items-center gap-4 group cursor-help">
                      <div className="p-3 bg-stone-900 border border-stone-700 group-hover:border-claw-500 transition-colors">
                        <Hexagon size={20} className="text-stone-400 group-hover:text-claw-500" />
                      </div>
                      <div>
                         <div className="text-xs font-bold text-white tracking-widest">SOLANA L1</div>
                         <div className="text-[9px] text-stone-500 font-mono">INFRASTRUCTURE</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group cursor-help">
                      <div className="p-3 bg-stone-900 border border-stone-700 group-hover:border-claw-500 transition-colors">
                        <BarChart3 size={20} className="text-stone-400 group-hover:text-claw-500" />
                      </div>
                      <div>
                         <div className="text-xs font-bold text-white tracking-widest">DEXSCREENER</div>
                         <div className="text-[9px] text-stone-500 font-mono">DATA ORACLE</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group cursor-help">
                      <div className="p-3 bg-stone-900 border border-stone-700 group-hover:border-claw-500 transition-colors">
                        <Cpu size={20} className="text-stone-400 group-hover:text-claw-500" />
                      </div>
                      <div>
                         <div className="text-xs font-bold text-white tracking-widest">NEURAL CORE</div>
                         <div className="text-[9px] text-stone-500 font-mono">GEMINI ENGINE</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans bg-black text-stone-300 relative selection:bg-claw-900 selection:text-white overflow-hidden scroll-smooth">
      
      {/* Global Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Moving Grid */}
        <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-[0.07] animate-grid transform perspective-1000 rotate-x-60"></div>
        
        {/* Static Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
        
        {/* Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-claw-900/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-obsidian-800/40 blur-[100px] rounded-full"></div>
        
        {/* Scanlines */}
        <div className="absolute inset-0 bg-transparent bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] z-50 opacity-20 pointer-events-none"></div>
      </div>

      <TopBar currentView={currentView} setView={setCurrentView} />

      <main className="relative z-10 flex flex-col min-h-screen">
        {renderContent()}
      </main>

      {/* Persistent Footer */}
      <footer className="border-t border-stone-900 bg-black/90 backdrop-blur py-4 relative z-10 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-blink"></span>
               <p className="text-stone-600 text-[10px] font-mono uppercase tracking-widest">
                 SYSTEM STATUS: OPTIMAL
               </p>
            </div>
            <div className="flex gap-6">
                <span className="text-stone-800 text-[10px] font-mono uppercase">Node: US-EAST-1</span>
                <span className="text-stone-800 text-[10px] font-mono uppercase">Ver: 2.6.1</span>
            </div>
            <p className="text-stone-700 text-[10px] font-mono">
              © 2026 CLAW PROTOCOL | $<span className="text-claw-500">Claw</span>Gpt
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;