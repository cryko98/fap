import React, { useState, useEffect } from 'react';
import { Search, Zap, Shield, Globe, Cpu, ChevronRight, Terminal, Database, Lock, Activity, Eye, Play, Hexagon, BarChart3, Wifi, Server, Radio, Code, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { StatsGrid } from './components/StatsGrid';
import { AnalysisBox } from './components/AnalysisBox';
import { VisualSynthesis } from './components/MemeGenerator';
import { VibeCoder } from './components/VibeCoder'; 
import { DexPair, AnalysisStatus, View } from './types';
import { fetchTokenData, generateAnalysis } from './services/api';

const LOGO_URL = "https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/ping%20(4).png";
const CA = "xxxxxxxxxxxxxxxxxxxxxxx";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCa, setCopiedCa] = useState(false);

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

  const handleCopyCa = () => {
    navigator.clipboard.writeText(CA);
    setCopiedCa(true);
    setTimeout(() => setCopiedCa(false), 2000);
  };

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
         
         <div className="w-32 h-32 md:w-40 md:h-40 mb-8 relative">
             <div className="absolute inset-0 border-2 border-stone-800 clip-corner-1"></div>
             <div className="absolute inset-0 border-t-2 border-blob-500 rounded-sm animate-spin"></div>
             <div className="absolute inset-2 bg-black clip-corner-1 flex items-center justify-center overflow-hidden">
                 <img src={LOGO_URL} className="w-full h-full object-cover opacity-80" />
             </div>
         </div>
         
         <div className="text-center relative z-10">
            <h1 className="text-3xl md:text-4xl text-white font-black tracking-tighter mb-2 animate-glitch">
              <span className="text-blob-500">The Blue</span> Lobstar
            </h1>
            <div className="flex items-center justify-center gap-2 text-[10px] text-blob-400 font-mono tracking-[0.3em]">
               <span className="animate-blink">_</span> INITIALIZING_OCEAN_PROTOCOLS
            </div>
         </div>
         
         <div className="absolute bottom-10 left-0 w-full px-8 md:px-12">
            <div className="h-0.5 bg-stone-900 w-full overflow-hidden">
               <div className="h-full bg-blob-600 w-full animate-boot-bar"></div>
            </div>
            <div className="flex justify-between mt-2 text-[8px] text-stone-600 font-mono uppercase">
               <span>Calibrating Pinchers...</span>
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
          <div className="w-full max-w-7xl mx-auto p-2 md:p-4 animate-slide-up min-h-screen pt-24 md:pt-32">
             <div className="bg-obsidian-900/90 border border-stone-800 clip-corner-2 shadow-2xl min-h-[800px] flex flex-col relative backdrop-blur-md">
                 
                 {/* Decorative Lines */}
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blob-600 to-transparent opacity-50"></div>
                 <div className="absolute -left-2 top-20 w-1 h-20 bg-blob-600/30"></div>

                 {/* Terminal Header */}
                 <div className="p-4 md:p-8 border-b border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40">
                    <div>
                        <h2 className="text-xl md:text-2xl text-white font-black italic tracking-tighter flex items-center gap-3">
                           <Terminal className="text-blob-500" /> 
                           DEEP_SEA_SCANNER <span className="text-xs align-top text-stone-500 font-normal mt-1">V.3.0</span>
                        </h2>
                        <p className="text-xs text-stone-500 font-mono mt-2 flex items-center gap-2">
                           <span className="w-2 h-2 bg-blob-500 rounded-full animate-pulse"></span>
                           HYDRO-SENSORS ACTIVE
                        </p>
                    </div>
                    <div className="flex gap-2 md:gap-4">
                        <div className="px-2 md:px-3 py-1 bg-blob-900/20 border border-blob-900/50 text-[10px] text-blob-400 font-mono">
                           SECURE
                        </div>
                        <div className="px-2 md:px-3 py-1 bg-stone-900 border border-stone-800 text-[10px] text-stone-500 font-mono">
                           12ms
                        </div>
                    </div>
                 </div>

                 <div className="p-3 md:p-6 lg:p-8 flex-1 flex flex-col">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto w-full mb-8 relative group z-10">
                       <div className="absolute -inset-1 bg-gradient-to-r from-blob-600 to-stone-800 rounded opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>
                       <div className="relative flex flex-col sm:flex-row bg-black clip-corner-1 border border-stone-700">
                         <div className="pl-4 flex items-center justify-center text-stone-500 py-2 sm:py-0">
                            <Search size={18} />
                         </div>
                         <input 
                           type="text" 
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}
                           placeholder="INPUT_SOLANA_CONTRACT_ADDRESS..."
                           className="flex-1 bg-transparent text-white px-4 py-3 md:py-4 font-mono text-sm focus:outline-none placeholder-stone-700 tracking-wider"
                         />
                         <button 
                           type="submit"
                           disabled={status === AnalysisStatus.FETCHING_DATA || status === AnalysisStatus.ANALYZING}
                           className="bg-blob-700 hover:bg-blob-600 text-white px-8 py-3 md:py-0 font-bold font-mono text-xs tracking-widest disabled:opacity-50 transition-colors clip-hex mr-1 my-1"
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
                         <div className="lg:col-span-12 bg-black/50 border border-stone-800 p-4 md:p-6 clip-corner-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                               <Activity size={100} />
                            </div>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                               <div className="w-16 h-16 rounded-sm border border-stone-700 p-1 bg-black">
                                   <img 
                                     src={data.baseToken.address ? `https://dd.dexscreener.com/ds-data/tokens/solana/${data.baseToken.address}.png` : ''} 
                                     onError={(e) => { e.currentTarget.style.display = 'none' }}
                                     className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                                   />
                               </div>
                               <div className="text-center sm:text-left">
                                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">{data.baseToken.name}</h2>
                                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-1">
                                      <span className="text-blob-500 font-mono text-sm font-bold tracking-widest">$ {data.baseToken.symbol}</span>
                                      <span className="text-stone-600 text-[10px] font-mono border border-stone-800 px-2 py-0.5 rounded-full">SOLANA_L1</span>
                                  </div>
                               </div>
                            </div>
                            <div className="mt-8">
                                <StatsGrid pair={data} />
                            </div>
                         </div>

                         {/* Chart */}
                         <div className="lg:col-span-8 bg-black/50 border border-stone-800 p-1 clip-corner-1 min-h-[500px] relative">
                             <div className="absolute top-2 left-2 z-10 flex gap-2">
                                <div className="px-2 py-1 bg-blob-900/30 border border-blob-500/30 text-[10px] text-blob-400 font-mono">LIVE_FEED</div>
                             </div>
                             <iframe 
                               src={`https://dexscreener.com/solana/${data.pairAddress}?embed=1&theme=dark&trades=0&info=0`}
                               className="w-full h-full"
                               style={{ border: 0 }}
                             ></iframe>
                         </div>

                         {/* AI Analysis Terminal */}
                         <div className="lg:col-span-4 bg-black border border-stone-800 clip-corner-1 flex flex-col relative overflow-hidden">
                             <div className="p-3 border-b border-stone-800 bg-stone-950 flex justify-between items-center">
                                <span className="text-xs font-mono text-blob-500 font-bold flex items-center gap-2">
                                   <Hexagon size={12} /> BLOB_CORE
                                </span>
                                <div className="w-2 h-2 bg-blob-500 rounded-full animate-pulse"></div>
                             </div>
                             <div className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-y-auto custom-scrollbar relative">
                                {status === AnalysisStatus.ANALYZING ? (
                                   <div className="space-y-2 text-blob-400">
                                      <p className="animate-pulse">{'>'} ESTABLISHING_UPLINK...</p>
                                      <p className="animate-pulse delay-75">{'>'} PARSING_ON_CHAIN_DATA...</p>
                                      <p className="animate-pulse delay-150">{'>'} CALCULATING_RISK_VECTORS...</p>
                                      <p className="animate-pulse delay-300">{'>'} CONSULTING_THE_BLUE_ORACLE...</p>
                                   </div>
                                ) : (
                                   <div className="relative z-10">
                                      <div className="text-stone-500 mb-4 border-b border-stone-800 pb-2">
                                         TERMINAL ACCESS GRANTED. **ENACTING PROTOCOL: BLOB_SENTINEL_
                                      </div>
                                      <AnalysisBox analysis={analysis} />
                                   </div>
                                )}
                                {/* Scanline effect */}
                                <div className="absolute inset-0 bg-repeat-y pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                             </div>
                         </div>
                      </div>
                    ) : (
                       <div className="flex-1 flex flex-col items-center justify-center text-stone-700 opacity-50">
                          <Activity size={64} className="mb-4 opacity-20" />
                          <p className="font-mono text-xs tracking-widest">AWAITING_TARGET_COORDINATES</p>
                       </div>
                    )}
                 </div>
             </div>
          </div>
        );
      default:
        return (
           <div className="min-h-screen flex items-center justify-center text-white">
              <div className="text-center">
                 <h1 className="text-4xl font-black mb-4">SYSTEM_ERROR</h1>
                 <p className="font-mono text-stone-500">VIEW_MODULE_NOT_FOUND</p>
                 <button onClick={() => setCurrentView(View.TERMINAL)} className="mt-8 px-6 py-2 border border-blob-500 text-blob-500 font-mono hover:bg-blob-500 hover:text-white transition-colors">
                    RETURN_TO_TERMINAL
                 </button>
              </div>
           </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 text-stone-300 selection:bg-blob-500/30 selection:text-blob-200 font-sans relative overflow-x-hidden">
      
      {/* Fixed CA Banner */}
      <div className="fixed top-0 left-0 w-full z-50 bg-blob-900/20 backdrop-blur-sm border-b border-blob-500/20 py-2 text-center">
          <div className="flex items-center justify-center gap-3 font-mono text-xs md:text-sm">
             <span className="text-blob-400 font-bold">CA:</span>
             <span className="text-white tracking-wider">{CA}</span>
             <button 
               onClick={handleCopyCa}
               className="ml-2 p-1 hover:bg-blob-500/20 rounded transition-colors text-blob-400"
             >
               {copiedCa ? <Check size={14} /> : <Copy size={14} />}
             </button>
          </div>
      </div>

      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-[0.03] pointer-events-none z-0"></div>
      
      {/* Navigation */}
      <TopBar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content */}
      <main className="relative z-10">
         {renderContent()}
      </main>

    </div>
  );
};

export default App;
