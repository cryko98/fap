import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisStatus } from '../types';
import { 
  Cpu,
} from 'lucide-react';

interface AnalysisBoxProps {
  analysis: string;
  status: AnalysisStatus;
}

const INIT_STEPS = [
  "Initializing Neural Link...",
  "Accessing Market DB (2026)...",
  "Scanning Ledger...",
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
    <div className="w-full h-full bg-black border border-claw-900/50 flex flex-col shadow-[0_0_30px_rgba(220,38,38,0.1)] relative">
      <div className="bg-obsidian-900 px-3 py-2 border-b border-claw-900/30 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
            <Cpu size={12} className="text-claw-500 animate-pulse" />
            <span className="font-mono text-[10px] text-white tracking-widest uppercase">
               MOLT_CORE
            </span>
        </div>
        <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-claw-900/20 border border-claw-900/50 rounded">
             <span className="w-1 h-1 bg-claw-500 rounded-full animate-blink"></span>
             <span className="text-[8px] text-claw-400 font-mono">LIVE</span>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden relative bg-black/90 min-h-0">
        <div ref={scrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto relative scroll-smooth z-10">
            {(status === AnalysisStatus.ANALYZING || status === AnalysisStatus.FETCHING_DATA) ? (
              <div className="h-full flex flex-col justify-center items-center">
                 <div className="w-full max-w-xs font-mono text-[10px] md:text-xs">
                    {INIT_STEPS.map((step, index) => (
                      <div key={index} className={`flex items-center gap-2 mb-2 ${index > initStep ? 'opacity-20' : 'opacity-100'}`}>
                         <span className={index === initStep ? 'text-claw-500' : 'text-stone-600'}>
                            {index === initStep ? '>' : '#'}
                         </span>
                         <span className={index === initStep ? 'text-claw-400' : 'text-stone-500'}>
                           {step}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
              <div className="font-mono text-stone-300 text-xs md:text-sm leading-relaxed relative z-20">
                 <div className="prose prose-invert prose-p:my-2 prose-headings:text-claw-500 prose-headings:font-bold prose-headings:text-xs prose-strong:text-claw-400 max-w-none">
                     <ReactMarkdown>{displayedText}</ReactMarkdown>
                 </div>
                 <span className="inline-block w-2 h-4 bg-claw-500 ml-1 animate-blink align-middle"></span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};