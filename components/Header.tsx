import React from 'react';
import { Radio, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center pt-8 md:pt-12 pb-8 md:pb-10 px-4 text-center animate-fade-in relative z-20 w-full">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-claw-900/30 text-claw-500 text-[9px] md:text-[10px] font-mono font-bold tracking-[0.2em] mb-6 md:mb-8 uppercase">
        <Zap size={10} className="fill-current" />
        Pincer Algorithms Online
      </div>
      
      <div className="flex flex-col items-center mb-6 md:mb-8">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-none text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">
          <span className="text-claw-600">Molt</span>GPT
        </h1>
      </div>
      
      <div className="max-w-2xl mx-auto relative px-4">
        {/* Decorative brackets */}
        <div className="absolute -left-0 md:-left-4 top-0 bottom-0 w-px bg-claw-600/50"></div>
        <div className="absolute -left-0 md:-left-4 top-0 w-2 md:w-4 h-px bg-claw-600/50"></div>
        <div className="absolute -left-0 md:-left-4 bottom-0 w-2 md:w-4 h-px bg-claw-600/50"></div>
        
        <p className="px-4 md:px-6 text-xs md:text-base text-stone-400 font-mono leading-relaxed tracking-wide text-center">
          A next-generation <span className="text-claw-500">Vibe Coder AI Agent</span>. We build autonomous web apps instantly, analyze Solana memecoins with surgical precision, and generate high-fidelity AI images. The singularity is here.
        </p>
      </div>
    </header>
  );
};