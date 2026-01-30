import React, { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Download, Shuffle, Loader2, Aperture, Command, Film, Layers, Monitor } from 'lucide-react';
import { generateMemeImage } from '../services/api';

const PROMPTS = [
  "A futuristic red cyber-crab manipulating a holographic stock market interface",
  "Cyberpunk New York City 2026, rain slicked streets, red neon Claw Protocol advertisements",
  "Abstract data visualization of a blockchain transaction exploding into red crystal shards",
  "A high-tech server room with red ambient lighting and a mechanical claw sentinel guarding it",
  "Cinematic macro shot of a robotic eye reflecting a green candlestick chart",
  "A dark hooded figure holding a glowing red orb in a futuristic trading floor",
  "The ClawGPT Agent sitting on a throne made of computer servers and cables",
  "A hyper-realistic golden coin with a crab insignia floating in zero gravity"
];

export const VisualSynthesis: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + Math.random() * 5 : prev));
      }, 300);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleRandom = () => {
    const random = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPrompt(random);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imgData = await generateMemeImage(prompt, "https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/ChatGPT%20Image%202026.%20jan.%2030.%2023_05_42.png");
      setGeneratedImage(imgData);
    } catch (err: any) {
      setError(`Synthesis Failed: ${err.message || 'GPU Cluster Unresponsive'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `claw-synthesis-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 md:p-6 animate-fade-in pt-32">
      
      {/* Header */}
      <div className="w-full mb-8 animate-slide-up flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stone-800 pb-4">
         <div>
            <h2 className="text-3xl text-white font-black italic flex items-center gap-3 tracking-tighter">
                <Film className="text-claw-500" size={32} /> VISUAL_SYNTHESIS
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-2 tracking-widest uppercase">
                Render Engine V2.0 // 8K Resolution Output
            </p>
         </div>
         <div className="flex gap-2">
            <div className="px-3 py-1 bg-stone-900 border border-stone-700 text-[10px] text-stone-400 font-mono">
               GPU_TEMP: 45°C
            </div>
            <div className="px-3 py-1 bg-stone-900 border border-stone-700 text-[10px] text-green-500 font-mono">
               VRAM: OK
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Control Panel (Left) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Input Module */}
            <div className="bg-obsidian-900/80 border border-stone-800 p-1 clip-corner-1 backdrop-blur-md">
                <div className="bg-black/50 p-6 border border-stone-800/50 h-full">
                    <div className="flex items-center gap-2 mb-4 text-claw-500 border-b border-claw-900/30 pb-2">
                       <Aperture size={16} className="animate-spin-slow" />
                       <h2 className="font-mono font-bold tracking-widest text-xs uppercase">Vector Input</h2>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="relative group">
                          <label className="text-[9px] font-mono text-stone-500 uppercase mb-2 block tracking-wider">Prompt String</label>
                          <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="ENTER VISUAL PARAMETERS..."
                                className="w-full h-40 bg-black border border-stone-700 text-stone-300 p-4 text-xs font-mono rounded-none focus:border-claw-600 focus:outline-none resize-none leading-relaxed tracking-wide"
                            />
                            {/* Decorative corners on textarea */}
                            <div className="absolute top-6 left-0 w-2 h-2 border-t border-l border-stone-500 pointer-events-none opacity-50"></div>
                            <div className="absolute bottom-2 right-0 w-2 h-2 border-b border-r border-stone-500 pointer-events-none opacity-50"></div>

                            <button 
                                onClick={handleRandom}
                                className="absolute bottom-4 right-4 text-stone-600 hover:text-claw-500 transition-colors bg-stone-900 p-1 border border-stone-800"
                                title="Randomize"
                            >
                                <Shuffle size={14} />
                            </button>
                       </div>

                       <button
                          onClick={handleGenerate}
                          disabled={loading || !prompt}
                          className="w-full bg-claw-700 hover:bg-claw-600 text-white font-bold py-4 px-4 flex items-center justify-center gap-3 font-mono text-sm tracking-[0.2em] transition-all clip-corner-2 uppercase border border-claw-600 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                          {loading ? <Loader2 size={16} className="animate-spin" /> : <Command size={16} />}
                          {loading ? 'PROCESSING...' : 'INITIALIZE RENDER'}
                       </button>

                       {/* Progress Bar Visual */}
                       <div className="w-full bg-stone-900 h-2 border border-stone-800 relative">
                           <div 
                             className="h-full bg-claw-600 transition-all duration-300"
                             style={{ width: `${progress}%` }}
                           ></div>
                           {/* Hash marks */}
                           <div className="absolute inset-0 flex justify-between px-1">
                                {[...Array(10)].map((_, i) => <div key={i} className="w-px h-full bg-black/50"></div>)}
                           </div>
                       </div>

                       {error && (
                          <div className="p-3 bg-red-950/30 border-l-2 border-red-500 text-red-400 text-[10px] font-mono animate-glitch">
                             ERR_CODE_500: {error}
                          </div>
                       )}
                    </div>
                </div>
            </div>

            {/* Stats Module */}
            <div className="bg-obsidian-900/50 border border-stone-800 p-4 clip-corner-1">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">Core Metrics</h3>
                  <Monitor size={14} className="text-stone-600" />
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-mono text-stone-400 border-b border-stone-800/50 pb-1">
                     <span>MODEL_VERSION</span>
                     <span className="text-claw-400">CLAW-V2-IMG</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-stone-400 border-b border-stone-800/50 pb-1">
                     <span>RENDER_QUEUE</span>
                     <span className={loading ? "text-yellow-500 animate-pulse" : "text-stone-500"}>
                        {loading ? "BUSY" : "IDLE"}
                     </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-stone-400">
                     <span>OUTPUT_FMT</span>
                     <span>PNG / 8K</span>
                  </div>
               </div>
            </div>
        </div>

        {/* Viewport (Right) */}
        <div className="w-full lg:w-2/3">
             <div className="w-full h-full bg-black border border-stone-800 p-1 relative min-h-[500px] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col">
                
                {/* Viewport UI Overlay */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="bg-black/80 text-claw-400 text-[9px] font-mono px-2 py-1 border border-claw-900/50 backdrop-blur">
                    VIEWPORT_01
                    </span>
                    <span className="bg-black/80 text-stone-500 text-[9px] font-mono px-2 py-1 border border-stone-800 backdrop-blur">
                    1024x1024
                    </span>
                </div>
                
                <div className="absolute top-4 right-4 z-20">
                     <Layers size={16} className="text-stone-600" />
                </div>

                {/* Main Canvas */}
                <div className="flex-1 bg-cyber-grid bg-[length:40px_40px] relative flex items-center justify-center overflow-hidden group bg-stone-950">
                    
                    {/* Corner Markers */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-stone-700"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-stone-700"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-stone-700"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-stone-700"></div>

                    {loading ? (
                    <div className="flex flex-col items-center gap-6 w-full px-12 z-10">
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 border-2 border-stone-800 rounded-full"></div>
                            <div className="absolute inset-0 border-t-2 border-claw-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-4 border-2 border-stone-800 rounded-full"></div>
                            <div className="absolute inset-4 border-b-2 border-claw-500 rounded-full animate-spin [animation-direction:reverse]"></div>
                            <ImageIcon size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-claw-900" />
                        </div>
                        <div className="text-center">
                            <p className="font-mono text-xs text-claw-500 animate-pulse tracking-[0.3em] uppercase">Synthesizing</p>
                            <p className="font-mono text-[9px] text-stone-600 mt-2">Allocating Neural Buffers...</p>
                        </div>
                    </div>
                    ) : generatedImage ? (
                    <>
                        <img src={generatedImage} alt="Synthesized Output" className="w-full h-full object-contain animate-fade-in relative z-10" />
                        
                        {/* Download Overlay */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                            <button 
                                onClick={handleDownload}
                                className="bg-claw-600 text-white px-8 py-3 font-bold font-mono text-xs flex items-center gap-3 hover:bg-claw-500 transition-colors clip-corner-1 uppercase tracking-widest border border-white/20"
                            >
                                <Download size={16} /> Save to Drive
                            </button>
                        </div>
                    </>
                    ) : (
                    <div className="text-center opacity-30">
                        <ImageIcon size={80} className="mx-auto text-stone-600 mb-6" strokeWidth={1} />
                        <p className="font-mono text-xs text-stone-500 uppercase tracking-widest">System Idle</p>
                    </div>
                    )}
                </div>

                {/* Bottom Status Bar */}
                <div className="h-6 bg-black border-t border-stone-800 flex items-center justify-between px-2">
                    <div className="flex gap-2">
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-stone-800'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse [animation-delay:0.2s]' : 'bg-stone-800'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse [animation-delay:0.4s]' : 'bg-stone-800'}`}></div>
                    </div>
                    <div className="text-[8px] font-mono text-stone-600">
                        CLAW_RENDER_ENGINE
                    </div>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};