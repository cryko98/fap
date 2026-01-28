import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisStatus, AnalysisResult } from '../types';
import { 
  AlertTriangle, 
  TrendingUp, 
  Lock, 
  Terminal, 
  Skull, 
  Zap,
  Battery,
  Wifi,
  Search,
  Bird,
  ShieldCheck,
  ExternalLink,
  Activity
} from 'lucide-react';

interface AnalysisBoxProps {
  analysisResult: AnalysisResult | null;
  status: AnalysisStatus;
}

const INIT_STEPS = [
  "Connecting to Google Search Grid...",
  "Scanning Twitter/X Sentiment...",
  "Analyzing Liquidity Ratios...",
  "Detecting Rug Patterns...",
  "Checking Dev Wallet History...",
  "Calculating Pigeon Risk Score...",
  "Generating Verdict..."
];

const PIGEON_IMG_URL = "https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/Gemini_Generated_Image_4lewf24lewf24lew-removebg-preview.png";

const VerdictBanner = ({ text }: { text: string }) => {
  const isBuy = /BUY/i.test(text);
  const isSell = /SELL|LIQUIDATE/i.test(text);
  
  if (isBuy) {
    return (
      <div className="mt-6 p-4 bg-green-950/30 border border-green-500/30 rounded-lg flex items-center gap-4 animate-slide-up">
         <div className="bg-green-500/20 p-3 rounded-full animate-pulse">
            <TrendingUp size={24} className="text-green-400" />
         </div>
         <div>
            <h3 className="text-xl font-black text-green-400 tracking-tight">VERDICT: BUY</h3>
            <p className="text-[10px] text-green-300/70 font-mono">CONFIDENCE: HIGH • WINGS: FLAPPING</p>
         </div>
      </div>
    );
  }
  if (isSell) {
    return (
       <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-lg flex items-center gap-4 animate-slide-up">
         <div className="bg-red-500/20 p-3 rounded-full animate-pulse">
            <Skull size={24} className="text-red-400" />
         </div>
         <div>
            <h3 className="text-xl font-black text-red-400 tracking-tight">VERDICT: SELL</h3>
            <p className="text-[10px] text-red-300/70 font-mono">DANGER DETECTED • FLY AWAY</p>
         </div>
      </div>
    );
  }
  return (
     <div className="mt-6 p-4 bg-amber-950/30 border border-amber-500/30 rounded-lg flex items-center gap-4 animate-slide-up">
         <div className="bg-amber-500/20 p-3 rounded-full">
            <Lock size={24} className="text-amber-400" />
         </div>
         <div>
            <h3 className="text-xl font-black text-amber-400 tracking-tight">VERDICT: HOLD</h3>
            <p className="text-[10px] text-amber-300/70 font-mono">AWAITING FURTHER CRUMBS</p>
         </div>
      </div>
  );
};

// Risk Meter Component
const RiskMeter = ({ riskScore, liqHealth }: { riskScore: number, liqHealth: number }) => {
    // Risk: 0 (Safe) -> 100 (Dangerous)
    const isHighRisk = riskScore > 60;
    const isMediumRisk = riskScore > 30 && riskScore <= 60;
    
    let color = "text-green-400";
    let borderColor = "border-green-500";
    let label = "SAFE FLIGHT";
    
    if (isHighRisk) {
        color = "text-red-400";
        borderColor = "border-red-500";
        label = "CRASH IMMINENT";
    } else if (isMediumRisk) {
        color = "text-amber-400";
        borderColor = "border-amber-500";
        label = "TURBULENCE";
    }

    return (
        <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in">
            {/* Safety Score */}
            <div className={`bg-slate-950/50 p-3 rounded border ${borderColor} flex flex-col items-center justify-center relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 p-1 opacity-20 ${color}`}>
                   <ShieldCheck size={32} />
                </div>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Risk Meter</span>
                <span className={`text-2xl font-black ${color}`}>{riskScore}/100</span>
                <span className={`text-[8px] font-mono ${color} bg-slate-900 px-2 py-0.5 rounded mt-1`}>{label}</span>
            </div>

            {/* Liquidity Health */}
            <div className="bg-slate-950/50 p-3 rounded border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1 opacity-10 text-blue-400">
                   <Activity size={32} />
                </div>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Liq / FDV Ratio</span>
                <span className="text-2xl font-black text-blue-400">{liqHealth.toFixed(1)}%</span>
                <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{width: `${Math.min(liqHealth, 100)}%`}}></div>
                </div>
            </div>
        </div>
    );
};

// Citations Component
const SourceList = ({ sources }: { sources: { title: string, uri: string }[] }) => {
    if (!sources || sources.length === 0) return null;
    return (
        <div className="mt-4 pt-4 border-t border-slate-800 animate-fade-in">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Search size={10} /> Intel Gathered From:
            </h4>
            <div className="flex flex-wrap gap-2">
                {sources.slice(0, 3).map((source, idx) => (
                    <a 
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors border border-slate-700 truncate max-w-[150px]"
                        title={source.title}
                    >
                        <ExternalLink size={8} />
                        <span className="truncate">{source.title}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export const AnalysisBox: React.FC<AnalysisBoxProps> = ({ analysisResult, status }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [initStep, setInitStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const analysisText = analysisResult?.text || '';

  useEffect(() => {
    if (status === AnalysisStatus.ANALYZING || status === AnalysisStatus.FETCHING_DATA) {
      setInitStep(0);
      const interval = setInterval(() => {
        setInitStep(prev => (prev < INIT_STEPS.length - 1 ? prev + 1 : prev));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    if (status === AnalysisStatus.COMPLETE && analysisText) {
      setDisplayedText('');
      let i = 0;
      const speed = 10; 
      const intervalId = setInterval(() => {
        setDisplayedText(analysisText.slice(0, i));
        i++;
        if (scrollRef.current) {
           scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        if (i > analysisText.length) {
          clearInterval(intervalId);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [analysisText, status]);

  const isTypingComplete = displayedText.length === analysisText.length && analysisText.length > 0;
  const isActive = status === AnalysisStatus.ANALYZING || status === AnalysisStatus.COMPLETE;

  if (status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) return null;

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden flex flex-col animate-fade-in shadow-2xl relative border border-slate-700">
      <div className="absolute inset-0 opacity-10 bg-grid-pattern pointer-events-none"></div>

      {/* Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-help">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 animate-spin-slow blur-[2px]"></div>
            <img src={PIGEON_IMG_URL} alt="Analyst" className="w-8 h-8 rounded-full border border-slate-700 relative z-10 object-cover bg-slate-900" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-950 rounded-full z-20"></div>
          </div>
          <div>
              <h3 className="font-mono font-black text-slate-100 text-xs tracking-widest uppercase flex items-center gap-2">
                F.A.P. INTELLIGENCE <span className="text-[8px] px-1 py-0.5 bg-fap-900/50 text-fap-300 rounded border border-fap-800">PRO</span>
              </h3>
              <div className="flex items-center gap-2 text-[8px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><Wifi size={8} /> UPLINK_SECURE</span>
                  <span className="flex items-center gap-1 text-green-500"><Battery size={8} /> ONLINE</span>
              </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-slate-900 rounded border border-slate-800">
             <Search size={10} className="text-slate-500" />
             <span className="text-[9px] text-slate-400 font-mono">LIVE_SEARCH_ACTIVE</span>
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-1"></span>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden relative bg-slate-900/90">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03]">
             <img src={PIGEON_IMG_URL} alt="" className="w-64 h-64 object-contain grayscale invert" />
        </div>

        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto relative scroll-smooth z-10">
            <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0 opacity-5">
                <div className="w-full h-1 bg-white absolute top-0 animate-scanline blur-[1px]"></div>
            </div>

            {(status === AnalysisStatus.ANALYZING || status === AnalysisStatus.FETCHING_DATA) ? (
              <div className="h-full flex flex-col justify-center items-center relative z-20">
                 <div className="w-full max-w-sm font-mono text-xs">
                    {INIT_STEPS.map((step, index) => (
                      <div key={index} className={`flex items-center gap-3 mb-3 transition-all duration-300 ${index > initStep ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                         <span className={`flex items-center justify-center w-4 h-4 rounded-full text-[8px] ${index === initStep ? 'bg-amber-500 text-slate-900 animate-pulse' : 'bg-slate-800 text-green-500'}`}>
                            {index === initStep ? <Zap size={8} fill="currentColor" /> : '✓'}
                         </span>
                         <span className={index === initStep ? 'text-amber-400 font-bold tracking-wide' : 'text-slate-500'}>
                           {step}
                         </span>
                      </div>
                    ))}
                    <div className="mt-8 relative">
                       <div className="h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-amber-500 to-pink-500 animate-[chart-flow_1.5s_ease-in-out_infinite]" style={{width: '30%'}}></div>
                       </div>
                       <p className="text-center text-[8px] text-slate-600 mt-2 font-mono uppercase tracking-widest animate-pulse">Researching Web Data...</p>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="font-mono text-slate-300 text-sm leading-relaxed relative z-20">
                 {/* Visual Metrics Header */}
                 {analysisResult && (
                    <RiskMeter 
                        riskScore={analysisResult.riskScore} 
                        liqHealth={analysisResult.liquidityHealth} 
                    />
                 )}

                 <div className="mb-4 flex items-center justify-between border-b border-slate-700/50 pb-3">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Terminal size={12} className="text-fap-500" /> 
                       REPORT
                    </span>
                 </div>
                 
                 <div className="prose prose-invert prose-sm max-w-none">
                     <ReactMarkdown 
                       components={{
                         strong: ({node, children, ...props}) => {
                             const text = String(children);
                             let styleClass = "text-yellow-400 border-yellow-500/20 bg-yellow-500/5";
                             if (text.includes('%') || text.includes('$')) styleClass = "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
                             return <span className={`font-mono font-bold ${styleClass} px-1 py-0.5 rounded mx-0.5 border-b inline-block`} {...props}>{children}</span>;
                         }
                       }}
                     >
                       {displayedText}
                     </ReactMarkdown>
                 </div>
                 
                 {!isTypingComplete && (
                   <span className="inline-block w-2.5 h-4 bg-fap-500 ml-1 animate-blink align-middle shadow-[0_0_8px_#fb7185]"></span>
                 )}

                 {isTypingComplete && analysisResult && (
                    <>
                        <VerdictBanner text={analysisResult.text} />
                        <SourceList sources={analysisResult.sources} />
                    </>
                 )}
              </div>
            )}
        </div>
      </div>
      
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-600 font-mono flex-shrink-0 z-30">
         <span className="flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
             SYSTEM_READY
         </span>
         <span className="opacity-50">COO_OS v9.2.0 (SEARCH_ENABLED)</span>
      </div>
    </div>
  );
};