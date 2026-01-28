import React from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { useState } from 'react';

export const TopBar: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const ca = "3UQpHBZQeNyhBPMoqoYkX3hNdJ7NmHGUKrnAM6BApump";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ca);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 px-4 md:px-8 flex justify-between items-center shadow-sm z-50 relative">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-fap-600 font-bold tracking-tighter">
           <Terminal size={18} />
           <span className="hidden md:inline">F.A.P. TERMINAL v2.4</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a 
          href="https://twitter.com/i/communities/2016586395054190936" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center p-2 rounded-full hover:bg-slate-100 group"
          aria-label="X (Twitter)"
        >
          {/* X Logo SVG */}
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:fill-black transition-colors" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </a>

        <a 
          href="https://t.me/faponsol1" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-500 hover:text-[#229ED9] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-slate-100 group"
          aria-label="Telegram"
        >
          {/* Telegram Logo SVG */}
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:fill-[#229ED9] transition-colors" aria-hidden="true">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 hover:border-fap-500/50 transition-colors group shadow-sm">
          <span className="text-fap-600 font-bold text-[10px] uppercase tracking-widest">CA:</span>
          <span className="font-mono text-xs text-slate-600 truncate max-w-[100px] md:max-w-none group-hover:text-slate-900 transition-colors">{ca}</span>
          <button 
            onClick={copyToClipboard}
            className="ml-2 text-slate-400 hover:text-fap-500 transition-colors"
            title="Copy CA"
          >
            {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
};