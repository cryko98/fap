import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisStatus } from '../types';
import { Bot, FileText, Printer, AlertTriangle, TrendingUp, Ban, Lock } from 'lucide-react';

interface AnalysisBoxProps {
  analysis: string;
  status: AnalysisStatus;
}

const VerdictBanner = ({ type }: { type: 'buy' | 'sell' | 'hold' }) => {
  if (type === 'buy') {
    return (
      <div className="mt-8 p-6 bg-green-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-transform border-4 border-green-400 text-center animate-slide-up">
        <div className="flex justify-center mb-2">
           <TrendingUp size={48} className="animate-bounce" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">BUY POSITION</h2>
        <p className="font-mono text-green-100 font-bold tracking-widest">STRONG ACCUMULATION SIGNAL</p>
      </div>
    );
  }
  if (type === 'sell') {
    return (
      <div className="mt-8 p-6 bg-red-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-transform border-4 border-red-400 text-center animate-slide-up">
        <div className="flex justify-center mb-2">
           <AlertTriangle size={48} className="animate-pulse" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">LIQUIDATE</h2>
        <p className="font-mono text-red-100 font-bold tracking-widest">CRITICAL DUMP IMMINENT</p>
      </div>
    );
  }
  return (
    <div className="mt-8 p-6 bg-amber-500 text-white rounded-xl shadow-lg transform hover:scale-105 transition-transform border-4 border-amber-300 text-center animate-slide-up">
      <div className="flex justify-center mb-2">
         <Lock size={48} />
      </div>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">HOLD</h2>
      <p className="font-mono text-amber-100 font-bold tracking-widest">AWAIT FURTHER DATA</p>
    </div>
  );
};

export const AnalysisBox: React.FC<AnalysisBoxProps> = ({ analysis, status }) => {
  const [displayedText, setDisplayedText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Typewriter effect
  useEffect(() => {
    if (status === AnalysisStatus.COMPLETE && analysis) {
      setDisplayedText('');
      let i = 0;
      const speed = 10; // Faster typing speed
      
      const intervalId = setInterval(() => {
        setDisplayedText(analysis.slice(0, i));
        i++;
        
        // Auto scroll to bottom while typing
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

  // Determine verdict based on analysis text content
  const getVerdictType = (): 'buy' | 'sell' | 'hold' | null => {
    const text = analysis.toUpperCase();
    if (text.includes("LIQUIDATE")) return 'sell';
    if (text.includes("BUY")) return 'buy';
    if (text.includes("HOLD")) return 'hold';
    return null;
  };

  const isTypingComplete = displayedText.length === analysis.length && analysis.length > 0;
  const verdictType = isTypingComplete ? getVerdictType() : null;

  if (status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) return null;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col h-full animate-fade-in ring-1 ring-slate-900/5">
      {/* Header */}
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm">
             <FileText size={16} className="text-fap-600" />
          </div>
          <span className="font-bold text-slate-700 text-xs uppercase tracking-widest">Analyst Report // $FAP</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Printer size={14} />
          <span>CONFIDENTIAL</span>
        </div>
      </div>
      
      {/* Content */}
      <div ref={scrollRef} className="p-6 flex-1 font-mono text-slate-800 overflow-y-auto bg-white relative scroll-smooth">
        {status === AnalysisStatus.ANALYZING || status === AnalysisStatus.FETCHING_DATA ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
             <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-fap-600 animate-spin"></div>
                <img 
                  src="https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/fap%20(1).png" 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-white shadow-sm" 
                  alt="Loading"
                />
             </div>
             <div className="space-y-2 text-center">
                <p className="text-slate-900 font-bold text-sm tracking-widest animate-pulse">
                   {status === AnalysisStatus.FETCHING_DATA ? "ESTABLISHING BLOCKCHAIN UPLINK" : "PROCESSING FINANCIAL METRICS"}
                </p>
                <p className="text-slate-400 text-xs">Please wait while the pussy analyzes the charts...</p>
             </div>
          </div>
        ) : (
          <div className="prose prose-sm prose-slate max-w-none pb-4">
             <div className="mb-4 pb-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase">Generated by AI Terminal</span>
                <span className="text-xs font-bold text-fap-600 bg-fap-50 px-2 py-1 rounded">FINAL VERDICT READY</span>
             </div>
             
             <ReactMarkdown 
               components={{
                 strong: ({node, ...props}) => <span className="font-bold text-fap-700 bg-fap-50 px-1 rounded-sm" {...props} />
               }}
             >
               {displayedText}
             </ReactMarkdown>
             
             {!isTypingComplete && (
               <span className="inline-block w-2 h-4 bg-fap-600 ml-1 animate-pulse align-middle"></span>
             )}

             {/* Verdict Banner - Only shows when typing is done */}
             {verdictType && <VerdictBanner type={verdictType} />}
          </div>
        )}
      </div>
      
      {/* Footer of the box */}
      <div className="bg-slate-50 px-5 py-2 border-t border-slate-200 text-[10px] text-slate-400 font-mono flex justify-between uppercase flex-shrink-0">
        <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        <span>Secure Connection</span>
      </div>
    </div>
  );
};