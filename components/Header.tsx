import React from 'react';
import { Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center pt-12 pb-6 px-4 text-center animate-fade-in">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-mono font-bold tracking-wider mb-4 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        MARKET ANALYTICS: ONLINE
      </div>
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
        Financial Advisor <span className="text-fap-600">Pussy</span>
      </h1>
      <p className="mt-3 text-lg text-slate-500 font-medium max-w-xl mx-auto font-sans leading-relaxed">
        Advanced Algorithmic Memecoin Analysis & Advisory Terminal
      </p>
    </header>
  );
};