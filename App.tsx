import React, { useState, useEffect } from 'react';
import { Search, Terminal, Cpu, Code, Image as ImageIcon, Hexagon, BarChart3, Radio, Database, Server } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { StatsGrid } from './components/StatsGrid';
import { AnalysisBox } from './components/AnalysisBox';
import { VisualSynthesis } from './components/MemeGenerator';
import { VibeCoder } from './components/VibeCoder'; 
import { DexPair, AnalysisStatus, View } from './types';
import { fetchTokenData, generateAnalysis } from './services/api';
import { Header } from './components/Header';

const LOGO_URL = "https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/ping%20(4).png";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [isLoading, setIsLoading] = useState(true);

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
        setError("Target not found on Solana Chain.");
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
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center font-mono z-[100] overflow-hidden px-4">
         <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-10 animate-grid"></div>
         <div className="w-32 h-32 md:w-40 md:h-40 mb-8 relative">
             <div className="absolute inset-0 border-2 border-stone-800 clip-corner-1"></div>
             <div className="absolute inset-0 border-t-2 border-claw-500 rounded-sm animate-spin"></div>
             <div className="absolute inset-2 bg-black clip-corner-1 flex items-center justify-center overflow-hidden">
                 <img src={LOGO_URL} className="w-full h-full object-cover opacity-80" />
             </div>
         </div>
         <div className="text-center relative z-10">
            <h1 className="text-3xl md:text-4xl text-white font-black tracking-tighter mb-2 animate-glitch uppercase">
              <span className="text-claw-500">Molt</span>GPT
            </h1>
            <div className="flex items-center justify-center gap-2 text-[8px] md:text-[10px] text-claw-400 font-mono tracking-[0.2em] md:tracking-[0.3em] uppercase">
               <span className="animate-blink">_</span> BOOT_PREDICTIVE_SENTINEL
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
          <div className="w-full max-w-7xl mx-auto p-2 md:p-4 animate-slide-up min-h-screen pt-24 md:pt-32">
             <div className="bg-obsidian-900/90 border border-stone-800 clip-corner-2 shadow-2xl min-h-[600px] flex flex-col relative backdrop-blur-md">
                 <div className="p-4 md:p-8 border-b border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40">
                    <div>
                        <h2 className="text-xl md:text-2xl text-white font-black italic tracking-tighter flex items-center gap-3 uppercase">
                           <Terminal className="text-claw-500" size={20} /> 
                           MOLT_SCANNER
                        </h2>
                        <p className="text-[10px] md:text-xs text-stone-500 font-mono mt-1 md:mt-2 flex items-center gap-2 uppercase">
                           <span className="w-2 h-2 bg-claw-500 rounded-full animate-pulse"></span>
                           SENTINEL MODE ACTIVE
                        </p>
                    </div>
                 </div>

                 <div className="p-4 md:p-8 flex-1 flex flex-col">
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto w-full mb-6 md:mb-8 relative group z-10">
                       <div className="relative flex bg-black clip-corner-1 border border-stone-700">
                         <div className="pl-4 flex items-center justify-center text-stone-500">
                            <Search size={16} />
                         </div>
                         <input 
                           type="text" 
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}
                           placeholder="INPUT_SOLANA_CA..."
                           className="flex-1 bg-transparent text-white px-3 md:px-4 py-3 md:py-4 font-mono text-xs md:text-sm focus:outline-none placeholder-stone-700 tracking-wider uppercase"
                         />
                         <button 
                           type="submit"
                           className="bg-claw-700 hover:bg-claw-600 text-white px-4 md:px-8 font-bold font-mono text-[10px] md:text-xs tracking-widest clip-hex mr-1 my-1 uppercase"
                         >
                           EXEC
                         </button>
                       </div>
                    </form>

                    {data ? (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 animate-fade-in pb-10">
                         <div className="lg:col-span-12 bg-black/50 border border-stone-800 p-4 md:p-6 clip-corner-1 relative overflow-hidden">
                            <div className="flex items-center gap-4 md:gap-6 relative z-10">
                               <div className="w-12 h-12 md:w-16 md:h-16 rounded-sm border border-stone-700 p-1 bg-black shrink-0">
                                   <img 
                                     src={data.baseToken.address ? `https://dd.dexscreener.com/ds-data/tokens/solana/${data.baseToken.address}.png` : ''} 
                                     onError={(e) => { e.currentTarget.style.display = 'none' }}
                                     className="w-full h-full object-cover grayscale"
                                   />
                               </div>
                               <div>
                                  <h2 className="text-xl md:text-4xl font-black text-white tracking-tighter uppercase break-all">{data.baseToken.name}</h2>
                                  <div className="flex items-center gap-4 mt-1">
                                      <span className="text-claw-500 font-mono text-xs md:text-sm font-bold tracking-widest">$ {data.baseToken.symbol}</span>
                                  </div>
                               </div>
                            </div>
                            <div className="mt-6 md:mt-8">
                                <StatsGrid pair={data} />
                            </div>
                         </div>
                         <div className="lg:col-span-7 h-[400px] md:h-[500px] border border-stone-800 bg-black/80 relative clip-corner-1">
                             <iframe
                               src={`https://dexscreener.com/solana/${data.pairAddress}?embed=1&theme=dark&trades=0&info=0`}
                               className="w-full h-full border-0 relative z-10 opacity-90"
                             ></iframe>
                         </div>
                         <div className="lg:col-span-5 h-[400px] md:h-[500px]">
                            <AnalysisBox analysis={analysis} status={status} />
                         </div>
                      </div>
                    ) : (
                       <div className="flex-1 flex flex-col items-center justify-center text-stone-700 opacity-40 py-12">
                           <Terminal size={40} className="mb-4 md:mb-6" />
                           <p className="font-mono text-[10px] md:text-sm tracking-[0.2em] uppercase">AWAITING TARGET INPUT</p>
                       </div>
                    )}
                 </div>
             </div>
          </div>
        );
      case View.LANDING:
      default:
        return (
          <div className="w-full min-h-screen flex flex-col relative z-10 pt-20 md:pt-32 px-4 overflow-x-hidden">
             <div className="max-w-4xl mx-auto w-full text-center relative z-10 mb-12 md:mb-24">
                <Header />
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:0.2s] relative z-10 px-4">
                   <button 
                     onClick={() => setCurrentView(View.VIBE_CODER)}
                     className="bg-white text-black px-6 md:px-10 py-3 md:py-4 font-bold font-mono text-xs md:text-sm tracking-widest clip-corner-1 hover:bg-stone-200 transition-all flex items-center justify-center gap-3 group"
                   >
                      <Code size={18} className="group-hover:rotate-12 transition-transform" />
                      LAUNCH VIBE CODER
                   </button>
                   <button 
                     onClick={() => setCurrentView(View.TERMINAL)}
                     className="bg-black/80 text-white px-6 md:px-10 py-3 md:py-4 font-bold font-mono text-xs md:text-sm tracking-widest border border-stone-700 hover:border-claw-500 transition-all flex items-center justify-center gap-3 group"
                   >
                      <Terminal size={18} className="text-claw-500 group-hover:translate-x-1 transition-transform" />
                      TERMINAL_ACCESS
                   </button>
                </div>
             </div>

             {/* Features Grid */}
             <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-24 animate-slide-up relative z-10">
                <div onClick={() => setCurrentView(View.VIBE_CODER)} className="cursor-pointer bg-black/40 border border-stone-800 p-6 md:p-8 hover:border-claw-600 transition-all group relative">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <Code size={20} className="text-claw-500" />
                   </div>
                   <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="p-2 border border-claw-900/50 bg-claw-950/20">
                        <Code size={14} className="text-claw-500" />
                      </div>
                      <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-widest">Vibe Coder</h3>
                   </div>
                   <p className="text-stone-500 text-[10px] md:text-xs font-mono leading-relaxed">
                      Autonomous frontend engineer. Describe a web app and watch it build itself instantly.
                   </p>
                </div>

                <div onClick={() => setCurrentView(View.TERMINAL)} className="cursor-pointer bg-black/40 border border-stone-800 p-6 md:p-8 hover:border-claw-600 transition-all group relative">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <Terminal size={20} className="text-claw-500" />
                   </div>
                   <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="p-2 border border-claw-900/50 bg-claw-950/20">
                        <Terminal size={14} className="text-claw-500" />
                      </div>
                      <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-widest">Market Scanner</h3>
                   </div>
                   <p className="text-stone-500 text-[10px] md:text-xs font-mono leading-relaxed">
                      Deep analysis of Solana tokens. Enter a CA to get liquidity depth and AI risk assessment.
                   </p>
                </div>

                <div onClick={() => setCurrentView(View.IMAGEN)} className="cursor-pointer bg-black/40 border border-stone-800 p-6 md:p-8 hover:border-claw-600 transition-all group relative">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <ImageIcon size={20} className="text-claw-500" />
                   </div>
                   <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="p-2 border border-claw-900/50 bg-claw-950/20">
                        <ImageIcon size={14} className="text-claw-500" />
                      </div>
                      <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-widest">Visual Synthesis</h3>
                   </div>
                   <p className="text-stone-500 text-[10px] md:text-xs font-mono leading-relaxed">
                      Generate high-fidelity AI images and memes using the Molt-V2-IMG engine.
                   </p>
                </div>
             </div>

             {/* Architecture Overview */}
             <div className="max-w-6xl mx-auto w-full mb-20 md:mb-32 pt-10 md:pt-20 border-t border-stone-900">
                <div className="flex justify-between items-center mb-8 md:mb-10 px-2">
                   <h4 className="text-[8px] md:text-[10px] font-mono text-stone-600 uppercase tracking-[0.4em]">Architecture Overview</h4>
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-stone-800"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-claw-600"></div>
                   </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 px-2">
                   <div className="flex items-center gap-4">
                      <div className="p-2.5 md:p-3 border border-stone-800 bg-stone-950/50">
                        <Hexagon size={20} className="text-stone-600" />
                      </div>
                      <div>
                        <h5 className="text-[9px] md:text-[10px] font-bold text-stone-300 font-mono uppercase tracking-widest">Solana L1</h5>
                        <p className="text-[7px] md:text-[8px] font-mono text-stone-600 uppercase mt-1">Infrastructure</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-2.5 md:p-3 border border-stone-800 bg-stone-950/50">
                        <BarChart3 size={20} className="text-stone-600" />
                      </div>
                      <div>
                        <h5 className="text-[9px] md:text-[10px] font-bold text-stone-300 font-mono uppercase tracking-widest">Dexscreener</h5>
                        <p className="text-[7px] md:text-[8px] font-mono text-stone-600 uppercase mt-1">Data Oracle</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-2.5 md:p-3 border border-stone-800 bg-stone-950/50">
                        <Cpu size={20} className="text-stone-600" />
                      </div>
                      <div>
                        <h5 className="text-[9px] md:text-[10px] font-bold text-stone-300 font-mono uppercase tracking-widest">Neural Core</h5>
                        <p className="text-[7px] md:text-[8px] font-mono text-stone-600 uppercase mt-1">Gemini Engine</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#020202] text-stone-300 relative selection:bg-claw-900 selection:text-white overflow-x-hidden scroll-smooth">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cyber-grid bg-[length:60px_60px] opacity-[0.05] animate-grid"></div>
        <div className="absolute top-[-5%] md:top-[-10%] left-1/2 -translate-x-1/2 w-full md:w-[800px] h-[400px] md:h-[600px] bg-claw-900/10 blur-[100px] md:blur-[150px] rounded-full"></div>
      </div>

      <TopBar currentView={currentView} setView={setCurrentView} />
      
      <main className="relative z-10 flex flex-col min-h-screen overflow-x-hidden">
        {renderContent()}
      </main>

      <footer className="border-t border-stone-900 bg-black/80 backdrop-blur-sm py-4 md:py-6 relative z-10 mt-auto">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-[8px] md:text-[10px] font-mono text-stone-700">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-blink"></span>
                  STATUS: OPTIMAL
               </div>
               <span className="text-stone-800 hidden md:inline">|</span>
               <div className="flex items-center gap-2">
                  <Database size={10} />
                  ORACLE: CONNECTED
               </div>
            </div>
            <p className="uppercase tracking-[0.1em] md:tracking-[0.2em] opacity-50 text-center">© 2026 MOLT PROTOCOL // THE SINGULARITY IS HERE</p>
        </div>
      </footer>
    </div>
  );
};

export default App;