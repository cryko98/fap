import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisStatus } from '../types';
import { 
  AlertTriangle, 
  TrendingUp, 
  Lock, 
  Activity, 
  Terminal, 
  Cpu,
  ShieldAlert,
  Search
} from 'lucide-react';

interface AnalysisBoxProps {
  analysis: string;
  status: AnalysisStatus;
}

const INIT_STEPS = [
  "Initializing Neural Link...",
  "Accessing Global Market Database (2026)...",
  "Scanning Blockchain Ledger...",
  "Calculating Predictive Outcomes...",
  "Synthesizing Strategic Verdict..."
];

export const AnalysisBox: React.FC<AnalysisBoxProps> = ({ analysis, status }) => {
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
      const speed = 5; 
      
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

  if (status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) return null;

  return (
    <div className="w-full h-full bg-black border border-claw-900/50 flex flex-col shadow-[0_0_30px_rgba(220,38,38,0.1)]">
      
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern pointer-events-none"></div>

      {/* Header */}
      <div className="bg-obsidian-900 px-4 py-2 border-b border-claw-900/30 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-2">
            <Cpu size={14} className="text-claw-500 animate-pulse" />
            <span className="font-mono text-xs text-claw-100 tracking-widest">CLAWGPT_CORE</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 bg-claw-900/20 border border-claw-900/50 rounded">
             <span className="w-1.5 h-1.5 bg-claw-500 rounded-full animate-blink"></span>
             <span className="text-[9px] text-claw-400 font-mono">LIVE_FEED</span>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden relative bg-black/90">
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto relative scroll-smooth z-10">
            
            {/* Scanline */}
            <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0 opacity-10">
                <div className="w-full h-0.5 bg-claw-500 absolute top-0 animate-scanline blur-[1px]"></div>
            </div>

            {/* Loading State */}
            {(status === AnalysisStatus.ANALYZING || status === AnalysisStatus.FETCHING_DATA) ? (
              <div className="h-full flex flex-col justify-center items-center relative z-20">
                 <div className="w-full max-w-sm font-mono text-xs">
                    {INIT_STEPS.map((step, index) => (
                      <div key={index} className={`flex items-center gap-3 mb-2 transition-all duration-100 ${index > initStep ? 'opacity-20' : 'opacity-100'}`}>
                         <span className={`text-[10px] ${index === initStep ? 'text-claw-500' : 'text-stone-600'}`}>
                            {index === initStep ? '>' : '#'}
                         </span>
                         <span className={index === initStep ? 'text-claw-400 font-bold' : 'text-stone-500'}>
                           {step}
                         </span>
                      </div>
                    ))}
                    <div className="mt-6 h-0.5 w-full bg-obsidian-800">
                        <div className="h-full bg-claw-600 animate-[chart-flow_1s_ease-in-out_infinite]" style={{width: '50%'}}></div>
                    </div>
                 </div>
              </div>
            ) : (
              /* Analysis Text */
              <div className="font-mono text-stone-300 text-xs md:text-sm leading-relaxed relative z-20">
                 <div className="prose prose-invert prose-p:my-2 prose-headings:text-claw-500 prose-headings:font-bold prose-headings:text-sm prose-strong:text-claw-400 prose-strong:font-normal max-w-none">
                     <ReactMarkdown>{displayedText}</ReactMarkdown>
                 </div>
                 <span className="inline-block w-2 h-4 bg-claw-500 ml-1 animate-blink align-middle"></span>
              </div>
            )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-obsidian-950 px-4 py-1 border-t border-claw-900/30 flex justify-between items-center text-[9px] text-stone-600 font-mono flex-shrink-0 z-30">
         <span>SENTINEL_ID: CLAW-8821</span>
         <span>ENCRYPTION: AES-256</span>
      </div>
    </div>
  );
};