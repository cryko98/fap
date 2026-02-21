import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisStatus, DexPair } from '../types';
import { 
  AlertTriangle, 
  TrendingUp, 
  Lock, 
  Activity, 
  Terminal, 
  Cpu,
  ShieldAlert,
  Search,
  ExternalLink,
  Droplets,
  Anchor,
  Compass
} from 'lucide-react';

interface AnalysisBoxProps {
  analysis: string;
  status: AnalysisStatus;
  pair?: DexPair | null;
}

const INIT_STEPS = [
  "Calibrating Hydro-Sensors...",
  "Scanning Ocean Floor (Solana L1)...",
  "Detecting Whale Movements...",
  "Analyzing Bubble Patterns...",
  "Preparing Pinchers..."
];

export const AnalysisBox: React.FC<AnalysisBoxProps> = ({ analysis, status, pair }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [initStep, setInitStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (status === AnalysisStatus.ANALYZING || status === AnalysisStatus.FETCHING_DATA) {
      setInitStep(0);
      const interval = setInterval(() => {
        setInitStep(prev => (prev < INIT_STEPS.length - 1 ? prev + 1 : prev));
      }, 600);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    if (status === AnalysisStatus.COMPLETE && analysis) {
      setDisplayedText('');
      let i = 0;
      const speed = 10; 
      
      const intervalId = setInterval(() => {
        setDisplayedText(analysis.slice(0, i));
        i++;
        if (scrollRef.current) {
           scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        if (i > analysis.length) {
          clearInterval(intervalId);
        }
      }, speed);
      
      return () => clearInterval(intervalId);
    }
  }, [analysis, status]);

  if (status === AnalysisStatus.IDLE) {
    return (
      <div className="font-mono text-stone-500 text-xs animate-pulse">
        {'>'} STANDBY_MODE: AWAITING_INPUT...
      </div>
    );
  }

  if (status === AnalysisStatus.ERROR) return null;

  const isPumpFun = pair?.dexId === 'pump';
  const pumpFunUrl = pair ? `https://pump.fun/coin/${pair.baseToken.address}` : '#';

  return (
    <div className="w-full h-full flex flex-col relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative scroll-smooth z-10 custom-scrollbar">
            {/* Loading State */}
            {(status === AnalysisStatus.ANALYZING || status === AnalysisStatus.FETCHING_DATA) ? (
              <div className="h-full flex flex-col justify-start relative z-20">
                 <div className="w-full font-mono text-[10px] md:text-xs">
                    {INIT_STEPS.map((step, index) => (
                      <div key={index} className={`flex items-center gap-3 mb-2 transition-all duration-100 ${index > initStep ? 'opacity-20' : 'opacity-100'}`}>
                         <span className={`text-[10px] ${index === initStep ? 'text-blob-500' : 'text-stone-600'}`}>
                            {index === initStep ? '>' : '#'}
                         </span>
                         <span className={index === initStep ? 'text-blob-400 font-bold' : 'text-stone-500'}>
                           {step}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
              /* Analysis Text */
              <div className="font-mono text-stone-300 text-xs md:text-sm leading-relaxed relative z-20 pb-4">
                 {/* Extra Info Section */}
                 {pair && (
                   <div className="mb-6 grid grid-cols-2 gap-2 border-b border-stone-800 pb-4">
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 uppercase tracking-tighter">
                         <Droplets size={12} className="text-blob-500" />
                         <span>Liq/MC: {((pair.liquidity.usd / (pair.marketCap || pair.fdv)) * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 uppercase tracking-tighter">
                         <Anchor size={12} className="text-blob-500" />
                         <span>Floor: {pair.dexId.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 uppercase tracking-tighter">
                         <Compass size={12} className="text-blob-500" />
                         <span>Chain: SOLANA</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 uppercase tracking-tighter">
                         <TrendingUp size={12} className="text-blob-500" />
                         <span>24h Vol: ${(pair.volume.h24 / 1000).toFixed(1)}K</span>
                      </div>
                   </div>
                 )}

                 <div className="prose prose-invert prose-p:my-2 prose-headings:text-blob-500 prose-headings:font-bold prose-headings:text-sm prose-strong:text-blob-400 prose-strong:font-normal max-w-none
                   [&_h1]:text-2xl [&_h1]:text-white [&_h1]:bg-blob-600/20 [&_h1]:p-4 [&_h1]:border-l-4 [&_h1]:border-blob-500 [&_h1]:mt-6 [&_h1]:mb-2 [&_h1]:clip-corner-1 [&_h1]:animate-pulse">
                     <ReactMarkdown>{displayedText}</ReactMarkdown>
                 </div>
                 <span className="inline-block w-2 h-4 bg-blob-500 ml-1 animate-blink align-middle"></span>

                 {/* Buy Button */}
                 {status === AnalysisStatus.COMPLETE && (
                   <div className="mt-8 flex flex-col gap-3">
                      <a 
                        href={pumpFunUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 w-full py-4 px-6 font-black italic tracking-tighter uppercase transition-all clip-corner-1 shadow-lg hover:shadow-blob-500/20 ${
                          isPumpFun 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-500 hover:to-emerald-600' 
                          : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                        }`}
                      >
                        <ExternalLink size={18} />
                        {isPumpFun ? 'BUY ON PUMP.FUN' : 'VIEW ON DEXSCREENER'}
                      </a>
                      {!isPumpFun && (
                        <p className="text-[9px] text-stone-600 text-center font-mono">
                          * TARGET HAS GRADUATED FROM BONDING CURVE *
                        </p>
                      )}
                   </div>
                 )}
              </div>
            )}
      </div>
    </div>
  );
};
