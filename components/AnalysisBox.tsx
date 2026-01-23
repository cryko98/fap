import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisStatus } from '../types';
import { 
  AlertTriangle, 
  TrendingUp, 
  Lock, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Skull, 
  Zap,
  Battery,
  Wifi,
  Search,
  Snowflake
} from 'lucide-react';

interface AnalysisBoxProps {
  analysis: string;
  status: AnalysisStatus;
}

// Penguin-Themed Initialization Steps
const INIT_STEPS = [
  "Waking up the Analyst...",
  "Waddling to the keyboard...",
  "Sliding into liquidity pool...",
  "Detecting seal odors...",
  "Judging developer wallet history...",
  "Sharpening flippers...",
  "Calculating fish-fit margins...",
  "Typing report with beak..."
];

const PENGUIN_IMG_URL = "https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/ping-removebg-preview%20(1).png";

const VerdictBanner = ({ type }: { type: 'buy' | 'sell' | 'hold' }) => {
  if (type === 'buy') {
    return (
      <div className="mt-8 relative group perspective-1000 animate-slide-up">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
        <div className="relative p-6 md:p-8 bg-white border border-green-200 rounded-lg overflow-hidden flex flex-col items-center text-center shadow-lg">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            <div className="mb-4 text-green-600 animate-bounce relative z-10 p-3 bg-green-50 rounded-full border border-green-100">
               <TrendingUp size={48} strokeWidth={2} />
            </div>
            
            <h2 className="relative z-10 text-5xl md:text-7xl font-black text-green-600 tracking-tighter drop-shadow-sm mb-2">
                BUY
            </h2>
            
            <div className="relative z-10 flex items-center gap-2 mt-2 px-4 py-1 bg-green-100 border border-green-200 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <p className="font-mono text-green-700 font-bold tracking-[0.2em] text-[10px] md:text-xs">FLIPPERS UP: ALPHA CONFIRMED</p>
            </div>
        </div>
      </div>
    );
  }
  if (type === 'sell') {
    return (
      <div className="mt-8 relative group perspective-1000 animate-slide-up">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-400 via-rose-300 to-red-400 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
        <div className="relative p-6 md:p-8 bg-white border border-red-200 rounded-lg overflow-hidden flex flex-col items-center text-center shadow-lg">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            <div className="mb-4 text-red-600 animate-pulse relative z-10 p-3 bg-red-50 rounded-full border border-red-100">
               <Skull size={48} strokeWidth={2} />
            </div>
            
            <h2 className="relative z-10 text-4xl md:text-6xl font-black text-red-600 tracking-tighter drop-shadow-sm mb-2 uppercase">
                LIQUIDATE
            </h2>
            
            <div className="relative z-10 flex items-center gap-2 mt-2 px-4 py-1 bg-red-100 border border-red-200 rounded-full">
                <AlertTriangle size={12} className="text-red-500" />
                <p className="font-mono text-red-700 font-bold tracking-[0.2em] text-[10px] md:text-xs">AVALANCHE WARNING</p>
            </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-8 relative group perspective-1000 animate-slide-up">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-300 to-amber-400 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
        <div className="relative p-6 md:p-8 bg-white border border-amber-200 rounded-lg overflow-hidden flex flex-col items-center text-center shadow-lg">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            <div className="mb-4 text-amber-500 relative z-10 p-3 bg-amber-50 rounded-full border border-amber-100">
               <Lock size={48} strokeWidth={2} />
            </div>
            
            <h2 className="relative z-10 text-5xl md:text-7xl font-black text-amber-500 tracking-tighter drop-shadow-sm mb-2">
                HOLD
            </h2>
            
            <div className="relative z-10 flex items-center gap-2 mt-2 px-4 py-1 bg-amber-100 border border-amber-200 rounded-full">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <p className="font-mono text-amber-700 font-bold tracking-[0.2em] text-[10px] md:text-xs">WAITING AT ICE HOLE...</p>
            </div>
        </div>
    </div>
  );
};

// Penguin Vitals Panel (Sidebar)
const PenguinVitals = ({ active }: { active: boolean }) => (
  <div className="hidden md:flex flex-col w-32 border-l border-slate-200 bg-white/90 p-3 text-[10px] font-mono text-slate-500 select-none overflow-hidden relative backdrop-blur-sm z-20">
     <div className="mb-4 pb-2 border-b border-slate-200">
        <div className="text-slate-500 font-bold tracking-widest mb-2 flex items-center gap-1">
            <Activity size={10} /> VITALS
        </div>
     </div>
     
     {/* Status Bars */}
     <div className="space-y-4">
        <div>
            <div className="flex justify-between mb-1 text-xs">
                <span>MOOD</span>
                <span className={active ? "text-green-600" : "text-slate-400"}>CHILLING</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[90%]"></div>
            </div>
        </div>
        
        <div>
            <div className="flex justify-between mb-1 text-xs">
                <span>NOOT</span>
                <span className={active ? "text-pink-500" : "text-slate-400"}>LOUD</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 w-[100%] animate-pulse"></div>
            </div>
        </div>

        <div>
            <div className="flex justify-between mb-1 text-xs">
                <span>HUNGER</span>
                <span className={active ? "text-orange-500" : "text-slate-400"}>NEED FISH</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[40%]"></div>
            </div>
        </div>
     </div>

     {/* Active Scanning Visual */}
     <div className="mt-auto relative border border-slate-200 bg-slate-50 rounded p-2 text-center">
        <Snowflake size={16} className={`mx-auto mb-1 ${active ? 'text-blue-500 animate-spin-slow' : 'text-slate-400'}`} />
        <span className="text-[8px] tracking-wider block text-slate-500">NEURAL ENGINE</span>
        {active && <span className="text-[8px] text-green-600 animate-blink">● ONLINE</span>}
     </div>
  </div>
);

export const AnalysisBox: React.FC<AnalysisBoxProps> = ({ analysis, status }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [initStep, setInitStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Simulation of initialization steps
  useEffect(() => {
    if (status === AnalysisStatus.ANALYZING || status === AnalysisStatus.FETCHING_DATA) {
      setInitStep(0);
      const interval = setInterval(() => {
        setInitStep(prev => (prev < INIT_STEPS.length - 1 ? prev + 1 : prev));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Typewriter effect
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

  const getVerdictType = (): 'buy' | 'sell' | 'hold' | null => {
    const text = analysis.toUpperCase();
    if (text.includes("LIQUIDATE")) return 'sell';
    if (text.includes("BUY")) return 'buy';
    if (text.includes("HOLD")) return 'hold';
    return null;
  };

  const isTypingComplete = displayedText.length === analysis.length && analysis.length > 0;
  const verdictType = isTypingComplete ? getVerdictType() : null;
  const isActive = status === AnalysisStatus.ANALYZING || status === AnalysisStatus.COMPLETE;

  if (status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) return null;

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col animate-fade-in shadow-xl relative border border-slate-200">
      
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-40 bg-grid-pattern pointer-events-none"></div>

      {/* Header - Penguin Professional Style */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Analyst Avatar */}
          <div className="relative group cursor-help">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-75 animate-spin-slow blur-[1px]"></div>
            <img 
                src={PENGUIN_IMG_URL} 
                alt="Analyst" 
                className="w-8 h-8 rounded-full border border-slate-200 relative z-10 object-cover bg-white"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full z-20"></div>
          </div>
          
          <div>
              <h3 className="font-mono font-black text-slate-800 text-xs tracking-widest uppercase flex items-center gap-2">
                F.A.P. INTELLIGENCE <span className="text-[8px] px-1 py-0.5 bg-fap-100 text-fap-700 rounded border border-fap-200">PRO</span>
              </h3>
              <div className="flex items-center gap-2 text-[8px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><Wifi size={8} /> UPLINK_SECURE</span>
                  <span className="flex items-center gap-1 text-green-600"><Battery size={8} /> ANALYST_ONLINE</span>
              </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-slate-50 rounded border border-slate-200">
             <Search size={10} className="text-slate-400" />
             <span className="text-[9px] text-slate-500 font-mono">SCANNING_ICE</span>
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-1"></span>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative bg-white/95">
        
        {/* Penguin Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03]">
             <img src={PENGUIN_IMG_URL} alt="" className="w-64 h-64 object-contain grayscale" />
        </div>

        {/* Central Display */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto relative scroll-smooth z-10">
            
            {/* SCANNING LINE ANIMATION */}
            <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0 opacity-5">
                <div className="w-full h-1 bg-black absolute top-0 animate-scanline blur-[1px]"></div>
            </div>

            {/* LOADING STATE - Penguin Boot Sequence */}
            {(status === AnalysisStatus.ANALYZING || status === AnalysisStatus.FETCHING_DATA) ? (
              <div className="h-full flex flex-col justify-center items-center relative z-20">
                 <div className="w-full max-w-sm font-mono text-xs">
                    {INIT_STEPS.map((step, index) => (
                      <div key={index} className={`flex items-center gap-3 mb-3 transition-all duration-300 ${index > initStep ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                         <span className={`flex items-center justify-center w-4 h-4 rounded-full text-[8px] ${index === initStep ? 'bg-amber-400 text-white animate-pulse' : 'bg-slate-100 text-green-600'}`}>
                            {index === initStep ? <Zap size={8} fill="currentColor" /> : '✓'}
                         </span>
                         <span className={index === initStep ? 'text-amber-600 font-bold tracking-wide' : 'text-slate-400'}>
                           {step}
                         </span>
                      </div>
                    ))}
                    <div className="mt-8 relative">
                       <div className="h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-amber-400 to-pink-400 animate-[chart-flow_1.5s_ease-in-out_infinite]" style={{width: '30%'}}></div>
                       </div>
                       <p className="text-center text-[8px] text-slate-400 mt-2 font-mono uppercase tracking-widest animate-pulse">Processing Sardines...</p>
                    </div>
                 </div>
              </div>
            ) : (
              /* COMPLETED STATE - Analysis Text */
              <div className="font-mono text-slate-800 text-sm leading-relaxed relative z-20">
                 <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Terminal size={12} className="text-fap-600" /> 
                       SUBJECT: <span className="text-fap-700 font-bold bg-fap-50 px-1 rounded">$FAP</span>
                    </span>
                    <span className="text-[10px] text-fap-600 border border-fap-200 bg-fap-50 px-2 py-0.5 rounded shadow-sm">
                       GENERATED BY PENGUIN
                    </span>
                 </div>
                 
                 <div className="prose prose-sm max-w-none">
                     <ReactMarkdown 
                       components={{
                         strong: ({node, children, ...props}) => {
                             const text = String(children);
                             let styleClass = "text-amber-600 border-amber-200 bg-amber-50";
                             
                             if (text.includes('%')) {
                                 if (text.includes('-')) {
                                      styleClass = "text-red-600 border-red-200 bg-red-50";
                                 } else {
                                      styleClass = "text-green-600 border-green-200 bg-green-50";
                                 }
                             } else if (text.includes('$')) {
                                 styleClass = "text-cyan-700 border-cyan-200 bg-cyan-50";
                             }
                        
                             return (
                                 <span className={`font-mono font-bold ${styleClass} px-1 py-0.5 rounded mx-0.5 border-b inline-block`} {...props}>
                                     {children}
                                 </span>
                             );
                         }
                       }}
                     >
                       {displayedText}
                     </ReactMarkdown>
                 </div>
                 
                 {!isTypingComplete && (
                   <span className="inline-block w-2.5 h-4 bg-fap-500 ml-1 animate-blink align-middle shadow-[0_0_8px_#fb7185]"></span>
                 )}

                 {/* Verdict Banner */}
                 {verdictType && <VerdictBanner type={verdictType} />}
              </div>
            )}
        </div>

        {/* Right Sidebar - Vitals */}
        <PenguinVitals active={isActive} />

      </div>
      
      {/* Footer */}
      <div className="bg-white px-4 py-2 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-500 font-mono flex-shrink-0 z-30">
         <span className="flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
             SYSTEM_READY
         </span>
         <span className="opacity-70">NOOT_OS v9.0.1 (ICE_AGE: 2)</span>
      </div>
    </div>
  );
};