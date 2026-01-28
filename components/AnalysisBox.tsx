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
  Bird
} from 'lucide-react';

interface AnalysisBoxProps {
  analysis: string;
  status: AnalysisStatus;
}

// Pigeon-Themed Initialization Steps
const INIT_STEPS = [
  "Waking up the Analyst...",
  "Preening feathers...",
  "Flying to the keyboard...",
  "Spotting crumbs on the chart...",
  "Judging developer statues...",
  "Sharpening beak...",
  "Calculating seed-fit margins...",
  "Pecking report with beak..."
];

const PIGEON_IMG_URL = "https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/Gemini_Generated_Image_4lewf24lewf24lew-removebg-preview.png";

const VerdictBanner = ({ type }: { type: 'buy' | 'sell' | 'hold' }) => {
  if (type === 'buy') {
    return (
      <div className="mt-8 relative group perspective-1000 animate-slide-up">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-1000 animate-pulse"></div>
        <div className="relative p-6 md:p-8 bg-slate-950 border border-green-500/50 rounded-lg overflow-hidden flex flex-col items-center text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
            
            <div className="mb-4 text-green-500 animate-bounce relative z-10 p-3 bg-green-500/10 rounded-full border border-green-500/30">
               <TrendingUp size={48} strokeWidth={2} />
            </div>
            
            <h2 className="relative z-10 text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-green-400 tracking-tighter drop-shadow-sm mb-2">
                BUY
            </h2>
            
            <div className="relative z-10 flex items-center gap-2 mt-2 px-4 py-1 bg-green-900/60 border border-green-500/50 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <p className="font-mono text-green-300 font-bold tracking-[0.2em] text-[10px] md:text-xs">WINGS UP: ALPHA CONFIRMED</p>
            </div>
        </div>
      </div>
    );
  }
  if (type === 'sell') {
    return (
      <div className="mt-8 relative group perspective-1000 animate-slide-up">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-1000 animate-pulse"></div>
        <div className="relative p-6 md:p-8 bg-slate-950 border border-red-500/50 rounded-lg overflow-hidden flex flex-col items-center text-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
            
            <div className="mb-4 text-red-500 animate-pulse relative z-10 p-3 bg-red-500/10 rounded-full border border-red-500/30">
               <Skull size={48} strokeWidth={2} />
            </div>
            
            <h2 className="relative z-10 text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-red-500 tracking-tighter drop-shadow-sm mb-2 uppercase">
                SELL
            </h2>
            
            <div className="relative z-10 flex items-center gap-2 mt-2 px-4 py-1 bg-red-900/60 border border-red-500/50 rounded-full backdrop-blur-sm">
                <AlertTriangle size={12} className="text-red-400" />
                <p className="font-mono text-red-300 font-bold tracking-[0.2em] text-[10px] md:text-xs">HAWK WARNING</p>
            </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-8 relative group perspective-1000 animate-slide-up">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
        <div className="relative p-6 md:p-8 bg-slate-950 border border-amber-500/50 rounded-lg overflow-hidden flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
            
            <div className="mb-4 text-amber-500 relative z-10 p-3 bg-amber-500/10 rounded-full border border-amber-500/30">
               <Lock size={48} strokeWidth={2} />
            </div>
            
            <h2 className="relative z-10 text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-500 tracking-tighter drop-shadow-sm mb-2">
                HOLD
            </h2>
            
            <div className="relative z-10 flex items-center gap-2 mt-2 px-4 py-1 bg-amber-900/60 border border-amber-500/50 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <p className="font-mono text-amber-300 font-bold tracking-[0.2em] text-[10px] md:text-xs">WAITING ON STATUE...</p>
            </div>
        </div>
    </div>
  );
};

// Pigeon Vitals Panel (Sidebar)
const PigeonVitals = ({ active }: { active: boolean }) => (
  <div className="hidden md:flex flex-col w-32 border-l border-slate-800 bg-slate-950/80 p-3 text-[10px] font-mono text-slate-500 select-none overflow-hidden relative backdrop-blur-sm z-20">
     <div className="mb-4 pb-2 border-b border-slate-800">
        <div className="text-slate-400 font-bold tracking-widest mb-2 flex items-center gap-1">
            <Activity size={10} /> VITALS
        </div>
     </div>
     
     {/* Status Bars */}
     <div className="space-y-4">
        <div>
            <div className="flex justify-between mb-1 text-xs">
                <span>MOOD</span>
                <span className={active ? "text-green-400" : "text-slate-600"}>COOING</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[90%]"></div>
            </div>
        </div>
        
        <div>
            <div className="flex justify-between mb-1 text-xs">
                <span>COO</span>
                <span className={active ? "text-pink-400" : "text-slate-600"}>LOUD</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 w-[100%] animate-pulse"></div>
            </div>
        </div>

        <div>
            <div className="flex justify-between mb-1 text-xs">
                <span>HUNGER</span>
                <span className={active ? "text-orange-400" : "text-slate-600"}>NEED SEEDS</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[40%]"></div>
            </div>
        </div>
     </div>

     {/* Active Scanning Visual */}
     <div className="mt-auto relative border border-slate-800 bg-slate-900/50 rounded p-2 text-center">
        <Bird size={16} className={`mx-auto mb-1 ${active ? 'text-blue-400 animate-bounce' : 'text-slate-700'}`} />
        <span className="text-[8px] tracking-wider block">NEURAL ENGINE</span>
        {active && <span className="text-[8px] text-green-500 animate-blink">● ONLINE</span>}
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
    // Robust Regex to find "Verdict:" followed by the decision, ignoring markdown and case
    // This looks for patterns like "Verdict: BUY", "Verdict: **BUY**", "Verdict: 'BUY'", etc.
    const match = analysis.match(/Verdict:\s*(?:\*\*)?\s*["']?(BUY|SELL|HOLD|LIQUIDATE)["']?\s*(?:\*\*)?/i);
    
    if (match) {
        const decision = match[1].toUpperCase();
        if (decision === 'BUY') return 'buy';
        if (decision === 'SELL' || decision === 'LIQUIDATE') return 'sell';
        if (decision === 'HOLD') return 'hold';
    }
    
    // Fallback only if the strict pattern is missing, to avoid returning null unnecessarily
    const text = analysis.toUpperCase();
    if (text.includes("VERDICT: BUY")) return 'buy';
    if (text.includes("VERDICT: SELL")) return 'sell';
    if (text.includes("VERDICT: HOLD")) return 'hold';
    
    return null;
  };

  const isTypingComplete = displayedText.length === analysis.length && analysis.length > 0;
  const verdictType = isTypingComplete ? getVerdictType() : null;
  const isActive = status === AnalysisStatus.ANALYZING || status === AnalysisStatus.COMPLETE;

  if (status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) return null;

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden flex flex-col animate-fade-in shadow-2xl relative border border-slate-700">
      
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern pointer-events-none"></div>

      {/* Header - Pigeon Professional Style */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          {/* Analyst Avatar */}
          <div className="relative group cursor-help">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 animate-spin-slow blur-[2px]"></div>
            <img 
                src={PIGEON_IMG_URL} 
                alt="Analyst" 
                className="w-8 h-8 rounded-full border border-slate-700 relative z-10 object-cover bg-slate-900"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-950 rounded-full z-20"></div>
          </div>
          
          <div>
              <h3 className="font-mono font-black text-slate-100 text-xs tracking-widest uppercase flex items-center gap-2">
                F.A.P. INTELLIGENCE <span className="text-[8px] px-1 py-0.5 bg-fap-900/50 text-fap-300 rounded border border-fap-800">PRO</span>
              </h3>
              <div className="flex items-center gap-2 text-[8px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><Wifi size={8} /> UPLINK_SECURE</span>
                  <span className="flex items-center gap-1 text-green-500"><Battery size={8} /> ANALYST_ONLINE</span>
              </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-slate-900 rounded border border-slate-800">
             <Search size={10} className="text-slate-500" />
             <span className="text-[9px] text-slate-400 font-mono">SCANNING_CITY</span>
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-1"></span>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative bg-slate-900/90">
        
        {/* Pigeon Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03]">
             <img src={PIGEON_IMG_URL} alt="" className="w-64 h-64 object-contain grayscale invert" />
        </div>

        {/* Central Display */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto relative scroll-smooth z-10">
            
            {/* SCANNING LINE ANIMATION */}
            <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0 opacity-5">
                <div className="w-full h-1 bg-white absolute top-0 animate-scanline blur-[1px]"></div>
            </div>

            {/* LOADING STATE - Pigeon Boot Sequence */}
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
                       <p className="text-center text-[8px] text-slate-600 mt-2 font-mono uppercase tracking-widest animate-pulse">Processing Crumbs...</p>
                    </div>
                 </div>
              </div>
            ) : (
              /* COMPLETED STATE - Analysis Text */
              <div className="font-mono text-slate-300 text-sm leading-relaxed relative z-20">
                 <div className="mb-6 flex items-center justify-between border-b border-slate-700/50 pb-3">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Terminal size={12} className="text-fap-500" /> 
                       SUBJECT: <span className="text-white font-bold bg-slate-800 px-1 rounded">$FAP</span>
                    </span>
                    <span className="text-[10px] text-fap-400 border border-fap-900/50 bg-fap-950/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(251,113,133,0.1)]">
                       GENERATED BY PIGEON
                    </span>
                 </div>
                 
                 <div className="prose prose-invert prose-sm max-w-none">
                     <ReactMarkdown 
                       components={{
                         strong: ({node, children, ...props}) => {
                             const text = String(children);
                             let styleClass = "text-yellow-400 border-yellow-500/20 bg-yellow-500/5";
                             
                             if (text.includes('%')) {
                                 if (text.includes('-')) {
                                      styleClass = "text-red-400 border-red-500/20 bg-red-500/5";
                                 } else {
                                      styleClass = "text-green-400 border-green-500/20 bg-green-500/5";
                                 }
                             } else if (text.includes('$')) {
                                 styleClass = "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
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
        <PigeonVitals active={isActive} />

      </div>
      
      {/* Footer */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-600 font-mono flex-shrink-0 z-30">
         <span className="flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
             SYSTEM_READY
         </span>
         <span className="opacity-50">COO_OS v9.0.1 (CITY_TIME: 2)</span>
      </div>
    </div>
  );
};