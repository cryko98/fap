import React from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { useState } from 'react';

export const TopBar: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const ca = "DtkdfG3HKcjkauQZW5wsJT4BFKZwvNGgNoMo6kfcpump";

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
          href="https://x.com/i/communities/2015027863213453416/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 text-xs font-mono uppercase group"
        >
          {/* X Logo SVG - Dark for light mode */}
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current group-hover:fill-black transition-colors" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
          <span className="hidden sm:inline font-bold">Community</span>
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