import React from 'react';
import { Copy, Check, Terminal, Home, Cpu, Image as ImageIcon, Crosshair, Code } from 'lucide-react';
import { useState } from 'react';
import { View } from '../types';

interface TopBarProps {
  currentView: View;
  setView: (view: View) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentView, setView }) => {
  const [copied, setCopied] = useState(false);
  const ca = "ALt6kFe9Fe7QuBTbM92Wu1c2e4Gn3YZPYVVU7hQRpump";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ca);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const NavButton = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`relative group px-3 md:px-4 py-2 flex items-center gap-2 transition-all duration-300 overflow-hidden ${
        currentView === view ? 'text-claw-500' : 'text-stone-500 hover:text-stone-300'
      }`}
    >
      <div className={`absolute inset-0 border border-claw-800/50 skew-x-12 transform transition-all ${
        currentView === view ? 'bg-claw-900/20 translate-y-0 opacity-100' : 'translate-y-full opacity-0 group-hover:opacity-50 group-hover:translate-y-0'
      }`}></div>
      
      <Icon size={18} className={`relative z-10 transition-transform ${currentView === view ? 'scale-110 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : ''}`} />
      <span className="relative z-10 font-mono text-xs font-bold tracking-widest uppercase hidden md:block">
        {label}
      </span>
      
      {currentView === view && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-claw-500 shadow-[0_0_10px_#dc2626]"></span>
      )}
    </button>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2 md:p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto bg-black/90 backdrop-blur-xl border border-stone-800 pointer-events-auto clip-hex shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center h-14 md:h-16 px-3 md:px-6 relative overflow-hidden">
          
          {/* Moving Scanline Decoration inside Header */}
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none"></div>
          
          {/* Branding */}
          <div 
            className="flex items-center gap-2 md:gap-4 cursor-pointer group shrink-0"
            onClick={() => setView(View.LANDING)}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 relative">
               <div className="absolute inset-0 bg-claw-600 blur opacity-20 animate-pulse"></div>
               <img 
                 src="https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/ping%20(4).png" 
                 alt="Molt Logo" 
                 className="w-full h-full object-cover clip-corner-1 border border-claw-500/50 relative z-10"
               />
            </div>
            <div className="flex flex-col hidden sm:flex">
               <h1 className="text-xl font-black italic tracking-tighter leading-none text-white">
                 <span className="text-claw-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">Molt</span>GPT
               </h1>
               <div className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-blink"></span>
                 <span className="text-[9px] font-mono text-stone-500 tracking-[0.2em] uppercase">
                   Sys.Online
                 </span>
               </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-0 md:gap-2 overflow-x-auto scrollbar-hide px-2">
            <NavButton view={View.LANDING} icon={Home} label="Core" />
            <NavButton view={View.VIBE_CODER} icon={Code} label="Vibe Coder" />
            <NavButton view={View.TERMINAL} icon={Terminal} label="Scanner" />
            <NavButton view={View.IMAGEN} icon={ImageIcon} label="Visuals" />
          </div>

          {/* CA & Details */}
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <div className="hidden lg:block h-8 w-px bg-stone-800 rotate-12"></div>
            
            {/* Telegram Link */}
             <a 
               href="https://t.me/moltgpt" 
               target="_blank" 
               rel="noopener noreferrer"
               className="group flex items-center justify-center w-7 h-7 md:w-8 md:h-8 border border-stone-800 bg-black hover:bg-stone-900 hover:border-claw-500 transition-all clip-hex"
            >
               <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-400 group-hover:text-white fill-current">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.06-.14-.04-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
               </svg>
            </a>

            {/* X (Twitter) Link */}
            <a 
               href="https://twitter.com/i/communities/2017643567527956513" 
               target="_blank" 
               rel="noopener noreferrer"
               className="group flex items-center justify-center w-7 h-7 md:w-8 md:h-8 border border-stone-800 bg-black hover:bg-stone-900 hover:border-claw-500 transition-all clip-hex"
            >
               <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-400 group-hover:text-white fill-current">
                 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
               </svg>
            </a>

            <div className="hidden lg:block h-8 w-px bg-stone-800 rotate-12"></div>
            
            <div 
              onClick={copyToClipboard}
              className="group cursor-pointer flex flex-col items-end"
            >
              <div className="hidden md:flex items-center gap-2 text-[10px] text-stone-500 font-mono uppercase tracking-widest mb-0.5">
                Contract Address <Crosshair size={10} className="text-claw-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-stone-300 group-hover:text-claw-400 transition-colors hidden sm:block">
                  {ca.slice(0, 4)}...{ca.slice(-4)}
                </span>
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-stone-600 group-hover:text-white" />}
              </div>
            </div>
          </div>

        </div>
        
        {/* Bottom decoration line */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-claw-900 to-transparent opacity-50"></div>
      </div>
    </div>
  );
};