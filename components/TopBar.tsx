import React from 'react';
import { Twitter, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const TopBar: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const ca = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Placeholder CA

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ca);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 py-3 px-4 md:px-8 flex justify-between items-center shadow-sm z-50 relative">
      <a 
        href="https://x.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span className="hidden md:inline font-medium">@FinancialAdvisorPussy</span>
      </a>

      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
        <span className="text-gray-500 font-bold text-xs uppercase">CA:</span>
        <span className="font-mono text-sm text-gray-800 truncate max-w-[150px] md:max-w-none">{ca}</span>
        <button 
          onClick={copyToClipboard}
          className="ml-2 text-gray-500 hover:text-fap-600 transition-colors"
          title="Copy CA"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};