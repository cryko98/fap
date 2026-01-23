import React, { useState } from 'react';
import { Search, ShieldAlert, Zap, Radio, CloudLightning, Moon, Snowflake, Fish } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { StatsGrid } from './components/StatsGrid';
import { AnalysisBox } from './components/AnalysisBox';
import { DexPair, AnalysisStatus } from './types';
import { fetchTokenData, generateAnalysis } from './services/api';

// Background Chart Lines SVG (Light Mode - Darker lines)
const ChartBackground = () => (
  <svg className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-[0.08] overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
      <linearGradient id="gradRed" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="50%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    
    <path 
      d="M-1000 800 L -800 700 L -600 750 L -400 500 L -200 600 L 0 400 L 200 500 L 400 300 L 600 400 L 800 200 L 1000 300 L 1200 100 L 1400 200 L 1600 50 L 1800 150 L 2000 50 L 2200 200 L 2400 100 L 2600 300 L 2800 150 L 3000 250" 
      fill="none" 
      stroke="url(#gradGreen)" 
      strokeWidth="2" 
      className="animate-chart-flow"
    />
    
    <path 
      d="M-1000 200 L -800 400 L -600 300 L -400 600 L -200 500 L 0 800 L 200 700 L 400 900 L 600 800 L 800 950 L 1000 800 L 1200 900 L 1400 850 L 1600 1000 L 1800 900 L 2000 1100 L 2200 950 L 2400 1050 L 2600 800 L 2800 900 L 3000 800" 
      fill="none" 
      stroke="url(#gradRed)" 
      strokeWidth="2" 
      className="animate-chart-flow-reverse opacity-70"
    />
  </svg>
);

// Floating Ticker Component (Darker text for light bg)
const FloatingTicker = ({ type, text, delay, left, duration }: { type: 'up' | 'down', text: string, delay: string, left: string, duration: string }) => {
  const isUp = type === 'up';
  return (
    <div 
      className={`fixed z-0 pointer-events-none font-mono font-black text-xl md:text-3xl opacity-0 whitespace-nowrap ${isUp ? 'text-green-600/10 animate-float-up' : 'text-red-600/10 animate-float-down'}`}
      style={{ 
        left, 
        animationDelay: delay,
        animationDuration: duration
      }}
    >
      {text}
    </div>
  );
};

// Static Penguin Humor Widget (Light Mode)
const GlobalSentimentWidget = () => {
  // Randomly pick a state for visual flair (static for now, could be dynamic)
  const states = [
     { label: "SLIDING", icon: <CloudLightning size={16} />, color: "text-amber-500", border: "border-amber-200" },
     { label: "HUDDLING", icon: <Moon size={16} />, color: "text-blue-500", border: "border-blue-200" },
     { label: "FISHING", icon: <Radio size={16} />, color: "text-green-600", border: "border-green-200" },
  ];
  const currentState = states[Math.floor(Date.now() / 10000) % states.length]; // Psuedo-random based on load time bucket

  return (
    <div className="fixed bottom-4 right-4 hidden lg:flex flex-col gap-2 z-40 animate-fade-in">
       <div className="bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-lg shadow-xl w-48">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
             <span className="text-[10px] font-mono text-slate-500 uppercase">Global Penguin Sentiment</span>
             <Snowflake size={12} className="text-slate-400" />
          </div>
          <div className="flex items-center gap-2">
             <div className={`p-1.5 rounded-md bg-slate-50 border ${currentState.border} ${currentState.color}`}>
                {currentState.icon}
             </div>
             <div>
                <div className={`text-xs font-black font-mono tracking-widest ${currentState.color}`}>{currentState.label}</div>
                <div className="text-[9px] text-slate-400">Ice Sheet Stability</div>
             </div>
          </div>
       </div>
    </div>
  );
};

const App: React.FC = () => {
  const [address, setAddress] = useState('');
  const [data, setData] = useState<DexPair | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    // Reset state
    setStatus(AnalysisStatus.FETCHING_DATA);
    setError(null);
    setData(null);
    setAnalysis('');

    try {
      // Fetch DexScreener Data
      const tokenData = await fetchTokenData(address.trim());

      if (!tokenData) {
        setError("Asset not found. Please provide a valid Solana CA or Pump.fun URL.");
        setStatus(AnalysisStatus.ERROR);
        return;
      }

      setData(tokenData);
      setStatus(AnalysisStatus.ANALYZING);

      // Fetch AI Analysis with safety wrapper
      const aiResponse = await generateAnalysis(tokenData);
      setAnalysis(aiResponse);
      setStatus(AnalysisStatus.COMPLETE);

    } catch (err: any) {
      console.error("Critical Application Error:", err);
      // Ensure we don't get stuck in loading state
      setError(`System Error: ${err.message || "Unknown error occurred"}`);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const isPumpFun = data?.baseToken.address.toLowerCase().endsWith('pump');

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-fap-100 selection:text-fap-900 relative bg-slate-50 text-slate-800">
      
      {/* Background Layer */}
      <div className="fixed inset-0 bg-white z-0"></div>
      <ChartBackground />
      
      {/* Floating Tickers Background */}
      <FloatingTicker type="up" text="+$420.69" left="5%" delay="0s" duration="18s" />
      <FloatingTicker type="down" text="-12.5%" left="15%" delay="5s" duration="20s" />
      <FloatingTicker type="up" text="+500x" left="25%" delay="2s" duration="15s" />
      <FloatingTicker type="down" text="-$69.00" left="80%" delay="1s" duration="22s" />
      <FloatingTicker type="up" text="+0.5 SOL" left="90%" delay="7s" duration="17s" />
      <FloatingTicker type="down" text="-99%" left="60%" delay="3s" duration="19s" />
      <FloatingTicker type="up" text="MOON" left="40%" delay="8s" duration="25s" />
      <FloatingTicker type="down" text="RUGGED" left="70%" delay="12s" duration="21s" />

      <TopBar />
      <GlobalSentimentWidget />
      
      <main className="flex-grow container mx-auto max-w-[1400px] px-4 relative z-10">
        
        <Header />

        {/* Hero Section: Cat & Search */}
        <div className="max-w-4xl mx-auto mb-12 relative">
          
          {/* Giant Peeking Penguin - No Red Laser */}
          <div className="flex justify-center -mb-20 relative z-0 pointer-events-none">
             
             {/* Tech Rings Behind - Lighter Colors */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] border border-fap-200 rounded-full animate-[spin_60s_linear_infinite]"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-green-200 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
             
             <div className="relative group">
                {/* The Penguin Image */}
                <img 
                  src="https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/ping-removebg-preview%20(1).png" 
                  alt="$FAP Analyst"
                  className="w-64 md:w-[450px] object-cover transform translate-y-8 relative z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-700 hover:scale-105"
                />
             </div>
          </div>

          {/* Search Box - HUD Style (Light) */}
          <div className="relative z-30 pt-16">
            <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
              {/* HUD Brackets - Slate 300 */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-slate-300 opacity-70"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-slate-300 opacity-70"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-slate-300 opacity-70"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-slate-300 opacity-70"></div>

              <div className="absolute -inset-0.5 bg-gradient-to-r from-fap-300 via-fap-200 to-fap-300 rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
              
              <div className="relative flex shadow-xl bg-white overflow-hidden border border-slate-200 p-2 transform transition-transform group-hover:-translate-y-1 rounded-md">
                <input
                  type="text"
                  placeholder="PASTE CONTRACT ADDRESS (CA)"
                  className="w-full bg-slate-50 text-slate-900 px-6 py-4 focus:outline-none font-mono text-sm md:text-base placeholder-slate-400 tracking-tight"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={status === AnalysisStatus.FETCHING_DATA || status === AnalysisStatus.ANALYZING}
                  className="bg-fap-600 hover:bg-fap-500 text-white px-8 py-3 font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-wait shadow-[0_4px_14px_rgba(225,29,72,0.3)] group-hover:shadow-[0_6px_20px_rgba(225,29,72,0.4)] rounded-sm"
                >
                  {status === AnalysisStatus.FETCHING_DATA ? (
                    <span className="font-mono text-xs flex items-center gap-2">
                       <Zap size={14} className="animate-bounce" /> SCANNING
                    </span>
                  ) : (
                    <>
                      <Search size={18} /> <span className="font-mono tracking-wide text-sm">ANALYZE</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium shadow-lg animate-fade-in flex items-center gap-2 max-w-2xl mx-auto backdrop-blur-sm">
                <ShieldAlert size={16} /> {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {data && (
          <div className="animate-slide-up pb-20 border-t border-slate-200 pt-10">
            
            {/* Asset Header Info */}
            <div className="flex items-center gap-4 mb-6">
                 <div className="relative">
                   <div className="absolute -inset-1 bg-green-400 rounded-full blur opacity-20"></div>
                   <img src={data.baseToken.address ? `https://dd.dexscreener.com/ds-data/tokens/solana/${data.baseToken.address}.png` : ''} 
                     onError={(e) => { e.currentTarget.style.display = 'none' }}
                     alt={data.baseToken.name} 
                     className="w-14 h-14 rounded-full border-2 border-slate-200 shadow-md bg-white object-cover relative z-10" 
                   />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2 tracking-tighter">
                    {data.baseToken.name} 
                    <span className="text-slate-400 text-xl font-bold font-mono">/ {data.baseToken.symbol}</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                     {isPumpFun && <span className="text-[9px] bg-green-50 border border-green-200 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Pump.fun Bonding</span>}
                     <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        CA: <span className="text-slate-400">{data.baseToken.address.slice(0, 8)}...{data.baseToken.address.slice(-8)}</span>
                     </span>
                  </div>
                </div>
            </div>

            {/* Layout Block */}
            <div className="space-y-6">
              
              {/* TOP: Coin Data Grid (Full Width) */}
              <div className="w-full">
                 <StatsGrid pair={data} />
              </div>

              {/* BOTTOM: Split View (Chart | Analysis) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[650px]">
                
                {/* Left: Chart (Larger width) */}
                <div className="lg:col-span-8 bg-white border border-slate-200 shadow-xl h-[500px] lg:h-full relative flex flex-col rounded-xl overflow-hidden group">
                   <div className="absolute inset-0 border-2 border-transparent group-hover:border-fap-200 pointer-events-none transition-colors rounded-xl z-20"></div>
                   
                   {/* Chart Header */}
                   <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-2">
                         <Radio size={14} className="text-red-500 animate-pulse" />
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live DexScreener Terminal</span>
                      </div>
                      <div className="flex gap-1">
                         <div className="w-2 h-2 rounded-full bg-red-400/50"></div>
                         <div className="w-2 h-2 rounded-full bg-yellow-400/50"></div>
                         <div className="w-2 h-2 rounded-full bg-green-400/50"></div>
                      </div>
                   </div>
                   <div className="flex-1 relative z-10">
                      {/* Embed - Note: DexScreener embed supports dark/light theme, we switch to light if available, but usually 'light' theme is standard white */}
                      <iframe
                        src={`https://dexscreener.com/solana/${data.pairAddress}?embed=1&theme=light&trades=1&info=0`}
                        title="DexScreener Chart"
                        className="w-full h-full border-0 absolute inset-0"
                      ></iframe>
                   </div>
                </div>

                {/* Right: Analysis (Smaller width, same height, scrollable) */}
                <div className="lg:col-span-4 h-full bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
                   <AnalysisBox analysis={analysis} status={status} />
                </div>

              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 relative overflow-hidden z-20">
        <div className="container mx-auto px-4 text-center">
           <div className="flex flex-col items-center justify-center space-y-3">
             <div className="flex items-center gap-2 text-slate-900 font-black tracking-tight text-xl">
                <span className="w-3 h-3 rounded-sm bg-fap-600 rotate-45"></span>
                FINANCIAL ADVISOR PENGUIN
             </div>
             
             <p className="text-slate-500 text-[11px] max-w-4xl mx-auto leading-relaxed font-medium tracking-wide">
               <strong className="text-fap-600">DISCLAIMER:</strong> I am a Financial Advisor Penguin. Do not expect ultra high-tech analysis, but for a flightless bird, I utilize real market data and legitimate strategy. I am the smartest financial advisor penguin in existence, but this is still satire. Not financial advice. Noot noot.
             </p>
             
             <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest mt-2">
               © 2026 $FAP Protocol. All Rights Reserved.
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;