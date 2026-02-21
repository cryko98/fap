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
  "Calibrating Hydro-Sensors...",
  "Scanning Ocean Floor (Solana L1)...",
  "Detecting Whale Movements...",
  "Analyzing Bubble Patterns...",
  "Preparing Pinchers..."
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
                 <div className="prose prose-invert prose-p:my-2 prose-headings:text-blob-500 prose-headings:font-bold prose-headings:text-sm prose-strong:text-blob-400 prose-strong:font-normal max-w-none
                   [&_h1]:text-2xl [&_h1]:text-white [&_h1]:bg-blob-600/20 [&_h1]:p-4 [&_h1]:border-l-4 [&_h1]:border-blob-500 [&_h1]:mt-6 [&_h1]:mb-2 [&_h1]:clip-corner-1 [&_h1]:animate-pulse">
                     <ReactMarkdown>{displayedText}</ReactMarkdown>
                 </div>
                 <span className="inline-block w-2 h-4 bg-blob-500 ml-1 animate-blink align-middle"></span>
              </div>
            )}
      </div>
    </div>
  );
};
