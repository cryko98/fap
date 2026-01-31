import React, { useState, useRef, useEffect } from 'react';
import { Code, Bot, User, Send, Loader2, Copy, MousePointerClick, Wand2 } from 'lucide-react';
import { generateWebAppCode, VibeCoderResponse } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DEFAULT_SUGGESTIONS = ["Add glow", "Animated BG", "Price ticker", "Cyberpunk theme"];

export const VibeCoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Vibe Coder Online. Describe your vision." }
  ]);
  const [code, setCode] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [loading, setLoading] = useState(false);
  const [iframeFocused, setIframeFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (manualPrompt?: string) => {
    const promptToSend = manualPrompt || input;
    if (!promptToSend.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: promptToSend }]);
    setInput('');
    setLoading(true);
    try {
      const response: VibeCoderResponse = await generateWebAppCode(promptToSend, code);
      setCode(response.html);
      setSuggestions(response.suggestions?.slice(0, 4) || DEFAULT_SUGGESTIONS);
      setMessages(prev => [...prev, { role: 'assistant', content: "Code compiled. Preview updated." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Compilation failed." }]);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Copied!");
  };

  return (
    <div className="w-full h-full max-w-[1800px] mx-auto p-4 md:p-6 animate-fade-in pt-24 md:pt-32 min-h-screen flex flex-col">
      <div className="mb-6 flex justify-between items-end border-b border-stone-800 pb-4">
         <div>
            <h2 className="text-xl md:text-3xl text-white font-black italic flex items-center gap-3 tracking-tighter">
                <Code className="text-claw-500" size={24} /> VIBE_CODER
            </h2>
            <p className="text-[9px] md:text-xs text-stone-500 font-mono mt-1 tracking-widest uppercase">
                Autonomous HTML5 Engine
            </p>
         </div>
         {code && (
           <button onClick={copyCode} className="px-3 py-1 bg-stone-900 border border-stone-700 text-[10px] font-mono text-stone-300 transition-colors">
              COPY CODE
           </button>
         )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
        {/* Chat Panel */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 min-h-[400px]">
            <div className="flex-1 bg-obsidian-900/80 border border-stone-800 flex flex-col overflow-hidden relative shadow-lg backdrop-blur-md">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                   {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                         <div className={`w-6 h-6 shrink-0 flex items-center justify-center border ${msg.role === 'assistant' ? 'bg-claw-900/20 border-claw-900/50 text-claw-500' : 'bg-stone-800 border-stone-700 text-stone-400'}`}>
                            {msg.role === 'assistant' ? <Bot size={12} /> : <User size={12} />}
                         </div>
                         <div className={`p-2 text-[10px] md:text-xs font-mono leading-relaxed max-w-[85%] ${msg.role === 'assistant' ? 'bg-black/40 border border-stone-800 text-stone-300' : 'bg-stone-900 border border-stone-700 text-white'}`}>
                            {msg.content}
                         </div>
                      </div>
                   ))}
                   <div ref={messagesEndRef} />
                </div>
                <div className="px-4 pb-2">
                   <div className="flex gap-2 overflow-x-auto pb-2">
                      {suggestions.map((s, i) => (
                         <button key={i} onClick={() => handleSend(s)} disabled={loading} className="shrink-0 px-2 py-1 bg-stone-900 border border-stone-800 text-[9px] font-mono text-stone-500 transition-colors whitespace-nowrap">
                            {s}
                         </button>
                      ))}
                   </div>
                </div>
                <div className="p-3 bg-black border-t border-stone-800">
                   <div className="flex gap-2 relative">
                      <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your vision..."
                        className="flex-1 bg-stone-900/50 border border-stone-700 p-2 text-[10px] md:text-xs font-mono text-white focus:outline-none resize-none h-16"
                      />
                      <button onClick={() => handleSend()} disabled={loading || !input.trim()} className="absolute bottom-1.5 right-1.5 p-1.5 bg-claw-700 text-white disabled:opacity-50">
                         <Send size={12} />
                      </button>
                   </div>
                </div>
            </div>
        </div>

        {/* Preview Panel */}
        <div className="w-full lg:w-2/3 bg-black border border-stone-800 relative flex flex-col min-h-[400px] md:min-h-[500px]">
            <div className="h-8 bg-obsidian-950 border-b border-stone-800 flex items-center justify-between px-3">
               <div className="text-[9px] font-mono text-stone-600 flex items-center gap-2">
                  {loading && <Loader2 size={10} className="animate-spin" />}
                  PREVIEW: LIVE
               </div>
            </div>
            <div className="flex-1 bg-stone-900/50 relative group" onClick={() => setIframeFocused(true)}>
               {!code ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-600 opacity-50 px-6 text-center">
                     <Wand2 size={48} className="mb-4 text-claw-900" />
                     <p className="font-mono text-[10px] uppercase tracking-widest">
                        Awaiting Neural Input...
                     </p>
                  </div>
               ) : (
                 <>
                  {!iframeFocused && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer group-hover:flex hidden" onClick={(e) => { e.stopPropagation(); setIframeFocused(true); }}>
                       <div className="bg-black/80 text-white px-3 py-1.5 rounded-full font-mono text-[10px] flex items-center gap-2 border border-stone-700 backdrop-blur-md">
                          <MousePointerClick size={12} /> Focus App
                       </div>
                    </div>
                  )}
                  <iframe title="preview" srcDoc={code} className="w-full h-full border-none bg-white" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock" allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write" />
                  {iframeFocused && (
                     <button onClick={(e) => { e.stopPropagation(); setIframeFocused(false); }} className="absolute bottom-2 right-2 z-20 bg-black/50 text-stone-500 p-1.5 rounded-full border border-stone-800 text-[8px] font-mono">
                        Release Focus
                     </button>
                  )}
                 </>
               )}
            </div>
        </div>
      </div>
    </div>
  );
};