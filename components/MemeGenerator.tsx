import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Download, Shuffle, Loader2 } from 'lucide-react';
import { generateMemeImage } from '../services/api';

interface MemeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl: string;
}

const FUNNY_PROMPTS = [
  "Photorealistic Fap penguin in a bespoke suit analyzing a crashing red candle chart",
  "Fap penguin as a Wall Street CEO, sitting at a mahogany desk with a golden fish",
  "Cinematic shot of Fap penguin giving financial advice to a group of confused seals",
  "Fap penguin in a luxury private jet looking at a crypto chart on a tablet",
  "Realistic Fap penguin wearing a trading headset screaming 'BUY THE DIP' on the trading floor",
  "Fap penguin crying over a frozen laptop screen showing -99% portfolio",
  "Fap penguin buried in a pile of cash inside an igloo office",
  "Close up of Fap penguin staring intensely at a Bloomberg terminal",
  "Fap penguin shredding paper documents labeled 'SEC SUBPOENA'"
];

export const MemeGenerator: React.FC<MemeGeneratorProps> = ({ isOpen, onClose, logoUrl }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRandom = () => {
    const random = FUNNY_PROMPTS[Math.floor(Math.random() * FUNNY_PROMPTS.length)];
    setPrompt(random);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imgData = await generateMemeImage(prompt, logoUrl);
      setGeneratedImage(imgData);
    } catch (err: any) {
      setError("Failed to generate meme. The AI might be freezing up.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `fap-meme-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Window */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-fap-500" />
            <h3 className="font-black text-slate-800 tracking-tight uppercase">FAP Meme Generator</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          
          {/* Image Display Area */}
          <div className="aspect-square w-full bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group">
            {loading ? (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Loader2 size={32} className="animate-spin text-fap-500" />
                <span className="text-xs font-mono animate-pulse">COOKING MEME...</span>
              </div>
            ) : generatedImage ? (
              <>
                <img src={generatedImage} alt="Generated Meme" className="w-full h-full object-cover" />
                {/* Hover overlay for quick save */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={handleDownload}
                    className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                  >
                    <Download size={16} /> Quick Save
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-6 text-slate-400">
                <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">Enter a prompt below to generate a realistic image.</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-fap-50 text-fap-700 px-3 py-1.5 rounded-lg border border-fap-100 text-xs font-bold shadow-sm">
                   <Sparkles size={12} className="fill-current" />
                   <span>TIP: Use "Fap" in your prompt to add the penguin!</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your scene... (e.g. 'Photorealistic Fap penguin in a bespoke suit')"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-fap-500/20 resize-none h-20"
              />
              <button 
                onClick={handleRandom}
                className="absolute right-2 bottom-2 text-slate-400 hover:text-fap-500 transition-colors bg-white/80 p-1 rounded-full hover:bg-white"
                title="Random Prompt"
              >
                <Shuffle size={16} />
              </button>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full bg-fap-600 hover:bg-fap-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-fap-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? 'GENERATING...' : 'GENERATE MEME'}
            </button>
            
            {/* Explicit Download Button (Visible when image exists) */}
            {generatedImage && !loading && (
               <button
                  onClick={handleDownload}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-2 animate-fade-in"
               >
                  <Download size={18} /> DOWNLOAD IMAGE
               </button>
            )}

            {error && (
               <p className="text-red-500 text-xs text-center mt-1 font-medium">{error}</p>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-center">
          <p className="text-[10px] text-slate-400 font-mono">POWERED BY GEMINI 2.5 FLASH IMAGE</p>
        </div>
      </div>
    </div>
  );
};