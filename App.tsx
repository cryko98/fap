import React, { useState } from 'react';
import { Search, ExternalLink, ShieldAlert, Zap, Radio, Target, ArrowUp, ArrowDown } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { StatsGrid } from './components/StatsGrid';
import { AnalysisBox } from './components/AnalysisBox';
import { DexPair, AnalysisStatus } from './types';
import { fetchTokenData, generateAnalysis } from './services/api';

// Floating background element component
const FloatingIndex = ({ type, delay, left, duration }: { type: 'up' | 'down', delay: string, left: string, duration: string }) => {
  const isUp = type === 'up';
  return (
    <div 
      className={`fixed z-0 pointer-events-none font-black text-2xl md:text-4xl opacity-0 ${isUp ? 'text-green-500/20 animate-float-up' : 'text-red-500/20 animate-float-down'}`}
      style={{ 
        left, 
        animationDelay: delay,
        animationDuration: duration
      }}
    >
      {isUp ? <ArrowUp /> : <ArrowDown />}
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

    // Fetch DexScreener Data
    const tokenData = await fetchTokenData(address.trim());

    if (!tokenData) {
      setError("Asset not found. Please provide a valid Solana CA or Pump.fun URL.");
      setStatus(AnalysisStatus.ERROR);
      return;
    }

    setData(tokenData);
    setStatus(AnalysisStatus.ANALYZING);

    // Fetch AI Analysis
    const aiResponse = await generateAnalysis(tokenData);
    setAnalysis(aiResponse);
    setStatus(AnalysisStatus.COMPLETE);
  };

  const isPumpFun = data?.baseToken.address.toLowerCase().endsWith('pump');

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-fap-200 relative">
      
      {/* Floating Indices Background */}
      <FloatingIndex type="up" left="5%" delay="0s" duration="18s" />
      <FloatingIndex type="down" left="15%" delay="5s" duration="20s" />
      <FloatingIndex type="up" left="25%" delay="2s" duration="15s" />
      <FloatingIndex type="down" left="80%" delay="1s" duration="22s" />
      <FloatingIndex type="up" left="90%" delay="7s" duration="17s" />
      <FloatingIndex type="down" left="60%" delay="3s" duration="19s" />
      <FloatingIndex type="up" left="40%" delay="8s" duration="25s" />

      <TopBar />
      
      <main className="flex-grow container mx-auto max-w-[1400px] px-4 relative z-10">
        
        <Header />

        {/* Hero Section: Cat & Search */}
        <div className="max-w-4xl mx-auto mb-10 relative">
          
          {/* Giant Peeking Cat - No Red Laser */}
          <div className="flex justify-center -mb-16 relative z-0">
             
             {/* Tech Rings Behind */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-200/50 rounded-full animate-[spin_60s_linear_infinite]"></div>
             
             <div className="relative group">
                {/* The Cat Image */}
                <img 
                  src="https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/fap.png" 
                  alt="$FAP Analyst"
                  className="w-80 md:w-[450px] object-cover transform translate-y-8 relative z-10 drop-shadow-2xl transition-all duration-700 hover:scale-105"
                />
             </div>
          </div>

          {/* Search Box - HUD Style */}
          <div className="relative z-30 pt-10">
            <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
              {/* HUD Brackets */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-slate-400 opacity-50"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-slate-400 opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-slate-400 opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-slate-400 opacity-50"></div>

              <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 via-fap-200 to-slate-200 rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
              
              <div className="relative flex shadow-2xl bg-white overflow-hidden border border-slate-200 p-2 transform transition-transform group-hover:-translate-y-1">
                <input
                  type="text"
                  placeholder="PASTE CONTRACT ADDRESS (CA) OR PUMP.FUN URL"
                  className="w-full bg-white text-slate-900 px-6 py-4 focus:outline-none font-mono text-sm md:text-base placeholder-slate-400 tracking-tight"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={status === AnalysisStatus.FETCHING_DATA || status === AnalysisStatus.ANALYZING}
                  className="bg-slate-900 hover:bg-fap-600 text-white px-8 py-3 font-bold flex items-center gap-2 transition-all disabled:opacity-80 disabled:cursor-wait shadow-lg hover:shadow-fap-500/20 group-hover:px-10"
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
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium shadow-sm animate-fade-in flex items-center gap-2 max-w-2xl mx-auto">
                <ShieldAlert size={16} /> {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section - Fixed Layout */}
        {data && (
          <div className="animate-slide-up pb-20 border-t border-slate-200/50 pt-10">
            
            {/* Asset Header Info */}
            <div className="flex items-center gap-4 mb-6">
                 <div className="relative">
                   <img src={data.baseToken.address ? `https://dd.dexscreener.com/ds-data/tokens/solana/${data.baseToken.address}.png` : ''} 
                     onError={(e) => { e.currentTarget.style.display = 'none' }}
                     alt={data.baseToken.name} 
                     className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-white object-cover" 
                   />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tighter">
                    {data.baseToken.name} 
                    <span className="text-slate-400 text-lg font-bold font-mono">/ {data.baseToken.symbol}</span>
                  </h2>
                  <div className="flex items-center gap-2">
                     {isPumpFun && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded font-bold uppercase">Pump.fun</span>}
                     <span className="text-[10px] text-slate-400 font-mono">{data.baseToken.address.slice(0, 8)}...{data.baseToken.address.slice(-8)}</span>
                  </div>
                </div>
            </div>

            {/* MAIN GRID LAYOUT: Fixed height on desktop to maintain proportions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[600px]">
              
              {/* Left Column: Chart (Takes 2/3 width) - Stretches to full height of parent grid on desktop */}
              <div className="lg:col-span-8 bg-white border border-slate-200 shadow-xl h-[500px] lg:h-full relative flex flex-col">
                 {/* Chart Header */}
                 <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2 flex-shrink-0">
                    <Radio size={14} className="text-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Live Chart Feed</span>
                 </div>
                 <div className="flex-1 relative">
                    <iframe
                      src={`https://dexscreener.com/solana/${data.pairAddress}?embed=1&theme=light&trades=0&info=0`}
                      title="DexScreener Chart"
                      className="w-full h-full border-0 absolute inset-0"
                    ></iframe>
                 </div>
              </div>

              {/* Right Column: Split Top/Bottom (Takes 1/3 width) */}
              <div className="lg:col-span-4 flex flex-col gap-4 h-full">
                
                {/* Top Box: Coin Datas - Auto height based on content */}
                <div className="flex-shrink-0 bg-white border border-slate-200 p-4 shadow-lg flex flex-col">
                   <StatsGrid pair={data} />
                </div>

                {/* Bottom Box: Prediction/Advice - Takes remaining space and scrolls */}
                <div className="flex-grow min-h-0 bg-white shadow-lg rounded-lg">
                   <AnalysisBox analysis={analysis} status={status} />
                </div>

              </div>
              
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 relative overflow-hidden z-20">
        <div className="container mx-auto px-4 text-center">
           <div className="flex flex-col items-center justify-center space-y-4">
             <div className="flex items-center gap-2 text-slate-900 font-black tracking-tight text-xl">
                <span className="w-3 h-3 rounded-sm bg-fap-600 rotate-45"></span>
                FINANCIAL ADVISOR PUSSY
             </div>
             
             <p className="text-slate-500 text-xs max-w-lg mx-auto leading-relaxed font-medium">
               <strong className="text-fap-600">DISCLAIMER:</strong> This AI agent is a cat. It can make mistakes. We are not responsible for any financial losses. Invest only what you can afford to lose.
             </p>
             
             <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest mt-4">
               © 2026 $FAP Protocol. All Rights Reserved.
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;