import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Download, Shuffle, Loader2, Aperture, Command, Film, Layers, Monitor } from 'lucide-react';
import { generateMemeImage } from '../services/api';

const PROMPTS = [
  "A futuristic red cyber-crab manipulating a holographic stock market interface",
  "Cyberpunk New York City 2026, red neon Molt Protocol advertisements",
  "Abstract data visualization of a blockchain transaction exploding into red crystal shards",
  "The MoltGPT Agent sitting on a throne made of computer servers and cables",
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
      const imgData = await generateMemeImage(prompt, "https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/ping%20(4).png");
      setGeneratedImage(imgData);
    } catch (err: any) {
      setError(`Synthesis Failed: ${err.message || 'GPU Error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `molt-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 md:p-6 animate-fade-in pt-24 md:pt-32">
      <div className="w-full mb-6 md:mb-8 animate-slide-up flex flex-col md:flex-row justify-between items-start md:items-end gap-2 border-b border-stone-800 pb-4">
         <div>
            <h2 className="text-xl md:text-3xl text-white font-black italic flex items-center gap-3 tracking-tighter">
                <Film className="text-claw-500" size={24} /> VISUAL_SYNTHESIS
            </h2>
            <p className="text-[9px] md:text-xs text-stone-500 font-mono mt-1 uppercase tracking-widest">
                Render Engine V2.0 // 8K Output
            </p>
         </div>
         <div className="flex gap-2">
            <div className="px-2 py-0.5 bg-stone-900 border border-stone-700 text-[8px] text-stone-400 font-mono">
               GPU: 45°C
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="bg-obsidian-900/80 border border-stone-800 p-1 clip-corner-1 backdrop-blur-md">
                <div className="bg-black/50 p-4 md:p-6 border border-stone-800/50">
                    <div className="flex items-center gap-2 mb-4 text-claw-500 border-b border-claw-900/30 pb-2">
                       <Aperture size={14} className="animate-spin-slow" />
                       <h2 className="font-mono font-bold tracking-widest text-[10px] md:text-xs uppercase">Vector Input</h2>
                    </div>
                    <div className="space-y-4 md:space-y-6">
                       <div className="relative">
                          <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="ENTER PARAMETERS..."
                                className="w-full h-32 md:h-40 bg-black border border-stone-700 text-stone-300 p-3 md:p-4 text-xs font-mono rounded-none focus:border-claw-600 focus:outline-none resize-none"
                            />
                            <button onClick={handleRandom} className="absolute bottom-2 right-2 text-stone-600 hover:text-claw-500 bg-stone-900 p-1 border border-stone-800">
                                <Shuffle size={12} />
                            </button>
                       </div>
                       <button
                          onClick={handleGenerate}
                          disabled={loading || !prompt}
                          className="w-full bg-claw-700 hover:bg-claw-600 text-white font-bold py-3 md:py-4 px-4 flex items-center justify-center gap-3 font-mono text-xs md:text-sm tracking-[0.1em] transition-all clip-corner-2 uppercase border border-claw-600 disabled:opacity-50"
                       >
                          {loading ? <Loader2 size={16} className="animate-spin" /> : <Command size={16} />}
                          {loading ? 'PROCESSING...' : 'INITIALIZE RENDER'}
                       </button>
                       <div className="w-full bg-stone-900 h-1.5 border border-stone-800 relative">
                           <div className="h-full bg-claw-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                       </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="w-full lg:w-2/3">
             <div className="w-full h-full bg-black border border-stone-800 p-1 relative min-h-[300px] md:min-h-[500px] flex flex-col">
                <div className="absolute top-2 left-2 z-20 flex gap-2">
                    <span className="bg-black/80 text-claw-400 text-[8px] font-mono px-1.5 py-0.5 border border-claw-900/50 backdrop-blur">
                    VP_01
                    </span>
                </div>
                <div className="flex-1 bg-stone-950 relative flex items-center justify-center overflow-hidden group">
                    {loading ? (
                    <div className="flex flex-col items-center gap-4 w-full px-6 z-10 text-center">
                        <div className="w-16 h-16 relative">
                            <div className="absolute inset-0 border-t-2 border-claw-500 rounded-full animate-spin"></div>
                            <ImageIcon size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-claw-900" />
                        </div>
                        <p className="font-mono text-[10px] text-stone-600 uppercase tracking-widest">Synthesizing...</p>
                    </div>
                    ) : generatedImage ? (
                    <>
                        <img src={generatedImage} alt="Synthesized Output" className="max-w-full max-h-[600px] object-contain animate-fade-in relative z-10" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                            <button onClick={handleDownload} className="bg-claw-600 text-white px-6 py-2 font-bold font-mono text-[10px] flex items-center gap-2 clip-corner-1 uppercase tracking-widest">
                                <Download size={14} /> Download
                            </button>
                        </div>
                    </>
                    ) : (
                    <div className="text-center opacity-30">
                        <ImageIcon size={48} className="mx-auto text-stone-600 mb-4" strokeWidth={1} />
                        <p className="font-mono text-[10px] text-stone-500 uppercase">System Idle</p>
                    </div>
                    )}
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};