import React from 'react';
import { Terminal, Home, Code, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { View } from '../types';

interface TopBarProps {
  currentView: View;
  setView: (view: View) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentView, setView }) => {
  const [copied, setCopied] = useState(false);
  const ca = "HLrpvnCNUhLdpAKG97QnMJaC2NkQH3pZM1xDCKGGpump";
  const xLink = "https://twitter.com/i/communities/2017643567527956513";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ca);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const NavButton = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`relative px-2 md:px-4 py-2 flex items-center gap-1 md:gap-2 transition-all duration-300 ${
        currentView === view ? 'text-white' : 'text-stone-500 hover:text-stone-300'
      }`}
    >
      <Icon size={14} className={currentView === view ? 'text-claw-500' : ''} />
      <span className="font-mono text-[9px] md:text-[10px] font-bold tracking-widest uppercase hidden sm:block">
        {label}
      </span>
      {currentView === view && (
        <div className="absolute -top-1 left-0 w-full h-px bg-claw-600 shadow-[0_0_10px_#dc2626]"></div>
      )}
    </button>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2 md:p-4">
      <div className="max-w-7xl mx-auto border-b border-stone-800/50 bg-black/80 backdrop-blur-md flex justify-between items-center h-14 px-2 md:px-4">
        
        {/* Brand Side */}
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0"
          onClick={() => setView(View.LANDING)}
        >
          <div className="w-6 h-6 md:w-8 md:h-8 relative shrink-0">
             <img 
               src="https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/ping%20(4).png" 
               alt="MoltGPT Logo" 
               className="w-full h-full object-cover grayscale brightness-125"
             />
          </div>
          <div className="flex flex-col hidden xs:flex">
             <h1 className="text-xs md:text-base font-black italic tracking-tighter leading-none text-white uppercase">
               <span className="text-claw-500">Molt</span>GPT
             </h1>
             <span className="text-[7px] md:text-[8px] font-mono text-stone-600 tracking-widest uppercase">
               Sys.Online
             </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-0.5 md:gap-1 overflow-x-auto scrollbar-hide">
          <NavButton view={View.LANDING} icon={Home} label="Core" />
          <NavButton view={View.VIBE_CODER} icon={Code} label="Vibe" />
          <NavButton view={View.TERMINAL} icon={Terminal} label="Scanner" />
          <NavButton view={View.IMAGEN} icon={ImageIcon} label="Visuals" />
        </div>

        {/* Social / CA Side */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-6 shrink-0">
          <a 
             href={xLink} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-stone-500 hover:text-white transition-colors p-1 md:p-0"
             aria-label="X Community"
          >
             <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
               <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
             </svg>
          </a>

          <div 
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 md:gap-3 cursor-pointer group px-2 py-1 border border-stone-800 hover:border-claw-900 transition-colors bg-stone-900/20"
          >
            <div className="flex flex-col items-end">
              <span className="text-[7px] text-stone-600 font-mono uppercase tracking-widest hidden md:block">Contract</span>
              <span className="font-mono text-[9px] md:text-[10px] text-stone-400 group-hover:text-claw-400 transition-colors">
                {ca.slice(0, 4)}...{ca.slice(-4)}
              </span>
            </div>
            {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="text-stone-700" />}
          </div>
        </div>
      </div>
    </div>
  );
};