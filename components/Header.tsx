import React from 'react';
import { Radio } from 'lucide-react';

const NEWS_ITEMS = [
  "BREAKING COO: Bitcoin CEO spotted napping on a park bench.",
  "MARKET ALERT: Hawk coins circling overhead, advises caution.",
  "INSIDER TRADING: Premium breadcrumb manipulation detected on Solana.",
  "WHALE ALERT: Fat Pigeon just bought 500 lbs of seeds with $SOL.",
  "TECHNICAL ANALYSIS: Chart pattern confirms 'Head Bobbing' formation.",
  "SEC UPDATE: Gary Gensler pooped on by anonymous flyer.",
  "LIQUIDITY: Fountain depths reaching critical levels.",
  "RUMOR: Ethereum devs distracted by shiny foil wrapper, merge delayed.",
  "STRATEGY: Buy low, fly high. It's the only way.",
  "SECURITY: 2FA now requires specific coo sequence.",
  "ECONOMY: Seed inflation creates panic in the plaza.",
];

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center pt-8 pb-6 px-4 text-center animate-fade-in relative z-20">
      
      {/* News Ticker */}
      <div className="w-full max-w-3xl mb-6 bg-white border border-green-500/20 rounded-md overflow-hidden flex items-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] relative group">
        <div className="bg-green-50 px-3 py-1.5 flex items-center gap-2 border-r border-green-100 z-20 shrink-0 relative">
          <Radio size={12} className="text-green-600 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-green-700 uppercase tracking-widest whitespace-nowrap">Breaking Coo</span>
        </div>
        
        {/* Scroller Area */}
        <div className="relative flex-1 h-8 overflow-hidden bg-slate-50">
           {/* Fixed vertical alignment: Used flexbox for centering. Animation now starts from 0 to -50% for seamless loop */}
           <div className="absolute inset-y-0 flex items-center animate-ticker whitespace-nowrap will-change-transform [animation-duration:90s]">
             {/* Duplicate items for infinite scroll effect */}
             {[...NEWS_ITEMS, ...NEWS_ITEMS].map((item, i) => (
               <span key={i} className="text-[10px] font-mono text-slate-600 mx-8 inline-flex items-center">
                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></span>
                 {item}
               </span>
             ))}
           </div>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-green-200 text-green-700 text-xs font-mono font-bold tracking-wider mb-4 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        AI ANALYST ONLINE
      </div>
      
      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter drop-shadow-sm uppercase leading-tight">
          FINANCIAL ADVISOR PIGEON
        </h1>
        <h2 className="text-4xl md:text-6xl font-black text-green-600 tracking-tighter mt-1 drop-shadow-sm">
          $FAP
        </h2>
      </div>
      
      <p className="mt-4 text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto font-mono leading-relaxed border-t border-slate-200 pt-3">
        // The sassiest algorithmic trading terminal on Wall Street. Coo Coo.
      </p>
    </header>
  );
};