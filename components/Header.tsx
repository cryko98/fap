import React from 'react';
import { Radio } from 'lucide-react';

const NEWS_ITEMS = [
  "BREAKING MEW-S: Bitcoin CEO declares nap time effective immediately.",
  "MARKET ALERT: Dog coins smelling weird today, advises caution.",
  "INSIDER TRADING: Red Laser Dot manipulation detected on Solana.",
  "WHALE ALERT: Fat cat just bought 500 lbs of tuna with $SOL.",
  "TECHNICAL ANALYSIS: Chart pattern confirms 'Dead Cat Bounce' is actually 'Alive Cat Jump'.",
  "SEC UPDATE: Gary Gensler hissed at by local stray.",
  "LIQUIDITY: Milk bowl depths reaching critical levels.",
  "RUMOR: Ethereum devs distracted by laser pointer, merge delayed.",
  "STRATEGY: Buy high, sell meow. It's the only way.",
  "SECURITY: 2FA now requires belly rub verification.",
  "ECONOMY: Kibble inflation creates panic in the kitchen sector.",
];

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center pt-8 pb-6 px-4 text-center animate-fade-in relative z-20">
      
      {/* News Ticker */}
      <div className="w-full max-w-3xl mb-6 bg-slate-900/80 border border-green-500/30 rounded-md overflow-hidden flex items-center shadow-[0_0_15px_rgba(34,197,94,0.1)] backdrop-blur-sm relative group">
        <div className="bg-green-600/20 px-3 py-1.5 flex items-center gap-2 border-r border-green-500/30 z-20 shrink-0 relative bg-slate-900/50 backdrop-blur-md">
          <Radio size={12} className="text-green-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-widest whitespace-nowrap">Breaking Mews</span>
        </div>
        
        {/* Scroller Area */}
        <div className="relative flex-1 h-8 overflow-hidden bg-slate-950/30">
           {/* Fixed vertical alignment: Used flexbox for centering. Animation now starts from 0 to -50% for seamless loop */}
           <div className="absolute inset-y-0 flex items-center animate-ticker whitespace-nowrap will-change-transform [animation-duration:90s]">
             {/* Duplicate items for infinite scroll effect */}
             {[...NEWS_ITEMS, ...NEWS_ITEMS].map((item, i) => (
               <span key={i} className="text-[10px] font-mono text-slate-300 mx-8 inline-flex items-center">
                 <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-2"></span>
                 {item}
               </span>
             ))}
           </div>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-green-500/30 text-green-400 text-xs font-mono font-bold tracking-wider mb-4 shadow-sm backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        AI ANALYST ONLINE
      </div>
      
      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-2xl uppercase leading-tight">
          FINANCIAL ADVISOR PUSSY
        </h1>
        <h2 className="text-4xl md:text-6xl font-black text-green-500 tracking-tighter mt-1 drop-shadow-[0_0_25px_rgba(34,197,94,0.5)]">
          $FAP
        </h2>
      </div>
      
      <p className="mt-4 text-sm md:text-base text-slate-400 font-medium max-w-xl mx-auto font-mono leading-relaxed border-t border-slate-800 pt-3">
        // The sassiest algorithmic trading terminal on Solana.
      </p>
    </header>
  );
};