import React, { useState } from 'react';
import { Search, ShieldAlert, Zap, Radio, Cat, CloudLightning, Moon, Sun } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { StatsGrid } from './components/StatsGrid';
import { AnalysisBox } from './components/AnalysisBox';
import { DexPair, AnalysisStatus } from './types';
import { fetchTokenData, generateAnalysis } from './services/api';

// Background Chart Lines SVG (Dark Mode)
const ChartBackground = () => (
  <svg className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-[0.05] overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
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

// Floating Ticker Component
const FloatingTicker = ({ type, text, delay, left, duration }: { type: 'up' | 'down', text: string, delay: string, left: string, duration: string }) => {
  const isUp = type === 'up';
  return (
    <div 
      className={`fixed z-0 pointer-events-none font-mono font-black text-xl md:text-3xl opacity-0 whitespace-nowrap ${isUp ? 'text-green-500/10 animate-float-up' : 'text-red-500/10 animate-float-down'}`}
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

// Static Cat Humor Widget
const GlobalSentimentWidget = () => {
  // Randomly pick a state for visual flair (static for now, could be dynamic)
  const states = [
     { label: "ZOOMIES", icon: <CloudLightning size={16} />, color: "text-yellow-400", border: "border-yellow-500/30" },
     { label: "NAPPING", icon: <Moon size={16} />, color: "text-blue-400", border: "border-blue-500/30" },
     { label: "HUNTING", icon: <Radio size={16} />, color: "text-green-400", border: "border-green-500/30" },
  ];
  const currentState = states[Math.floor(Date.now() / 10000) % states.length]; // Psuedo-random based on load time bucket

  return (
    <div className="fixed bottom-4 right-4 hidden lg:flex flex-col gap-2 z-40 animate-fade-in">
       <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-lg shadow-2xl w-48">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
             <span className="text-[10px] font-mono text-slate-400 uppercase">Global Cat Sentiment</span>
             <Cat size={12} className="text-slate-500" />
          </div>
          <div className="flex items-center gap-2">
             <div className={`p-1.5 rounded-md bg-slate-800 ${currentState.color}`}>
                {currentState.icon}
             </div>
             <div>
                <div className={`text-xs font-black font-mono tracking-widest ${currentState.color}`}>{currentState.label}</div>
                <div className="text-[9px] text-slate-500">Market Volatility</div>
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
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-fap-900 selection:text-fap-100 relative bg-slate-950 text-slate-200">
      
      {/* Background Layer */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>
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
          
          {/* Giant Peeking Cat - No Red Laser */}
          <div className="flex justify-center -mb-20 relative z-0 pointer-events-none">
             
             {/* Tech Rings Behind */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] border border-fap-900/20 rounded-full animate-[spin_60s_linear_infinite]"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-green-900/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
             
             <div className="relative group">
                {/* The Cat Image */}
                <img 
                  src="https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/fap%20(1).png" 
                  alt="$FAP Analyst"
                  className="w-64 md:w-[450px] object-cover transform translate-y-8 relative z-10 drop-shadow-[0_0_30px_rgba(251,113,133,0.3)] transition-all duration-700 hover:scale-105"
                />
             </div>
          </div>

          {/* Search Box - HUD Style */}
          <div className="relative z-30 pt-16">
            <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
              {/* HUD Brackets */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-fap-600 opacity-70"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-fap-600 opacity-70"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-fap-600 opacity-70"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-fap-600 opacity-70"></div>

              <div className="absolute -inset-0.5 bg-gradient-to-r from-fap-900 via-fap-600 to-fap-900 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              
              <div className="relative flex shadow-2xl bg-slate-950 overflow-hidden border border-slate-800 p-2 transform transition-transform group-hover:-translate-y-1 rounded-md">
                <input
                  type="text"
                  placeholder="PASTE CONTRACT ADDRESS (CA)"
                  className="w-full bg-slate-900 text-white px-6 py-4 focus:outline-none font-mono text-sm md:text-base placeholder-slate-600 tracking-tight"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={status === AnalysisStatus.FETCHING_DATA || status === AnalysisStatus.ANALYZING}
                  className="bg-fap-600 hover:bg-fap-500 text-white px-8 py-3 font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-wait shadow-[0_0_15px_rgba(225,29,72,0.4)] group-hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] rounded-sm"
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
              <div className="mt-4 p-4 bg-red-950/50 border-l-4 border-red-500 text-red-200 text-sm font-medium shadow-lg animate-fade-in flex items-center gap-2 max-w-2xl mx-auto backdrop-blur-sm">
                <ShieldAlert size={16} /> {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {data && (
          <div className="animate-slide-up pb-20 border-t border-slate-800 pt-10">
            
            {/* Asset Header Info */}
            <div className="flex items-center gap-4 mb-6">
                 <div className="relative">
                   <div className="absolute -inset-1 bg-green-500 rounded-full blur opacity-20"></div>
                   <img src={data.baseToken.address ? `https://dd.dexscreener.com/ds-data/tokens/solana/${data.baseToken.address}.png` : ''} 
                     onError={(e) => { e.currentTarget.style.display = 'none' }}
                     alt={data.baseToken.name} 
                     className="w-14 h-14 rounded-full border-2 border-slate-800 shadow-md bg-slate-900 object-cover relative z-10" 
                   />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white flex items-center gap-2 tracking-tighter">
                    {data.baseToken.name} 
                    <span className="text-slate-500 text-xl font-bold font-mono">/ {data.baseToken.symbol}</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                     {isPumpFun && <span className="text-[9px] bg-green-900/50 border border-green-500/30 text-green-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Pump.fun Bonding</span>}
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
                <div className="lg:col-span-8 bg-slate-950 border border-slate-800 shadow-2xl h-[500px] lg:h-full relative flex flex-col rounded-xl overflow-hidden group">
                   <div className="absolute inset-0 border-2 border-transparent group-hover:border-fap-900/30 pointer-events-none transition-colors rounded-xl z-20"></div>
                   
                   {/* Chart Header */}
                   <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-2">
                         <Radio size={14} className="text-red-500 animate-pulse" />
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live DexScreener Terminal</span>
                      </div>
                      <div className="flex gap-1">
                         <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                         <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                         <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                      </div>
                   </div>
                   <div className="flex-1 relative z-10">
                      <iframe
                        src={`https://dexscreener.com/solana/${data.pairAddress}?embed=1&theme=dark&trades=1&info=0`}
                        title="DexScreener Chart"
                        className="w-full h-full border-0 absolute inset-0"
                      ></iframe>
                   </div>
                </div>

                {/* Right: Analysis (Smaller width, same height, scrollable) */}
                <div className="lg:col-span-4 h-full bg-slate-900 shadow-2xl rounded-xl overflow-hidden border border-slate-800">
                   <AnalysisBox analysis={analysis} status={status} />
                </div>

              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-12 relative overflow-hidden z-20">
        <div className="container mx-auto px-4 text-center">
           <div className="flex flex-col items-center justify-center space-y-4">
             <div className="flex items-center gap-2 text-white font-black tracking-tight text-xl">
                <span className="w-3 h-3 rounded-sm bg-fap-600 rotate-45"></span>
                FINANCIAL ADVISOR PUSSY
             </div>
             
             <p className="text-slate-500 text-xs max-w-lg mx-auto leading-relaxed font-medium">
               <strong className="text-fap-500">DISCLAIMER:</strong> This AI agent is a cat. It can make mistakes. We are not responsible for any financial losses. Invest only what you can afford to lose. The "Financial Advice" provided is satire.
             </p>
             
             <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest mt-4">
               © 2026 $FAP Protocol. All Rights Reserved.
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;