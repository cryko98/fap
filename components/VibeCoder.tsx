import React, { useState, useRef, useEffect } from 'react';
import { Code, Play, Download, Copy, Github, Loader2, Terminal, Bot, User, Send, Wand2, MousePointerClick } from 'lucide-react';
import { generateWebAppCode, VibeCoderResponse } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DEFAULT_SUGGESTIONS = [
  "Add a neon glow button",
  "Make the background animated",
  "Add a crypto price ticker",
  "Implement a high score counter",
  "Switch to cyberpunk color theme",
  "Add sound effects on click"
];

export const VibeCoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Vibe Coder Online. Describe the web app you want to build, and I will generate the code." }
  ]);
  const [code, setCode] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [loading, setLoading] = useState(false);
  const [iframeFocused, setIframeFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (manualPrompt?: string) => {
    const promptToSend = manualPrompt || input;
    if (!promptToSend.trim() || loading) return;

    // Add User Message
    setMessages(prev => [...prev, { role: 'user', content: promptToSend }]);
    setInput('');
    setLoading(true);

    try {
      // Pass existing code as context for iterative updates
      const response: VibeCoderResponse = await generateWebAppCode(promptToSend, code);
      
      setCode(response.html);
      setSuggestions(response.suggestions || DEFAULT_SUGGESTIONS);
      
      setMessages(prev => [...prev, { role: 'assistant', content: "Code compiled successfully. Preview updated." }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Compilation failed. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  return (
    <div className="w-full h-full max-w-[1800px] mx-auto p-2 md:p-6 animate-fade-in pt-24 md:pt-32 min-h-screen flex flex-col">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-800 pb-4 gap-4">
         <div>
            <h2 className="text-2xl md:text-3xl text-white font-black italic flex items-center gap-3 tracking-tighter">
                <Code className="text-claw-500" size={24} /> VIBE_CODER
            </h2>
            <p className="text-[10px] md:text-xs text-stone-500 font-mono mt-2 tracking-widest uppercase">
                Autonomous HTML5 Engine // Iterative Development
            </p>
         </div>
         {code && (
           <div className="flex gap-3 w-full md:w-auto">
              <button onClick={copyCode} className="flex-1 md:flex-none justify-center px-4 py-2 bg-stone-900 border border-stone-700 hover:border-white text-xs font-mono text-stone-300 flex items-center gap-2 transition-colors">
                 <Copy size={12} /> COPY CODE
              </button>
           </div>
         )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[700px]">
        
        {/* Left Panel: Chat Interface */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 h-[500px] lg:h-auto">
            <div className="flex-1 bg-obsidian-900/80 border border-stone-800 clip-corner-1 flex flex-col overflow-hidden relative shadow-lg backdrop-blur-md">
                
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                   {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                         <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center border ${msg.role === 'assistant' ? 'bg-claw-900/20 border-claw-900/50 text-claw-500' : 'bg-stone-800 border-stone-700 text-stone-400'}`}>
                            {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                         </div>
                         <div className={`p-3 text-xs font-mono leading-relaxed max-w-[85%] ${msg.role === 'assistant' ? 'bg-black/40 border border-stone-800 text-stone-300' : 'bg-stone-900 border border-stone-700 text-white'}`}>
                            {msg.content}
                         </div>
                      </div>
                   ))}
                   {loading && (
                      <div className="flex gap-3">
                         <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border bg-claw-900/20 border-claw-900/50 text-claw-500">
                            <Bot size={16} />
                         </div>
                         <div className="p-3 bg-black/40 border border-stone-800 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin text-claw-500" />
                            <span className="text-[10px] font-mono text-stone-500 animate-pulse">WRITING_CODE...</span>
                         </div>
                      </div>
                   )}
                   <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                <div className="px-4 pb-2">
                   <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {suggestions.map((s, i) => (
                         <button 
                           key={i}
                           onClick={() => handleSend(s)}
                           disabled={loading}
                           className="flex-shrink-0 px-3 py-1 bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-500 hover:text-claw-400 hover:border-claw-900 transition-colors whitespace-nowrap"
                         >
                            {s}
                         </button>
                      ))}
                   </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-black border-t border-stone-800">
                   <div className="flex gap-2 relative">
                      <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Describe changes or new features..."
                        className="flex-1 bg-stone-900/50 border border-stone-700 p-3 text-xs font-mono text-white focus:outline-none focus:border-claw-600 resize-none h-20"
                      />
                      <button 
                        onClick={() => handleSend()}
                        disabled={loading || !input.trim()}
                        className="absolute bottom-2 right-2 p-2 bg-claw-700 text-white hover:bg-claw-600 disabled:opacity-50 transition-colors"
                      >
                         <Send size={14} />
                      </button>
                   </div>
                </div>
            </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="w-full lg:w-2/3 bg-black border border-stone-800 relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.3)] min-h-[500px]">
            <div className="h-10 bg-obsidian-950 border-b border-stone-800 flex items-center justify-between px-4">
               <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
               </div>
               <div className="text-[10px] font-mono text-stone-600 flex items-center gap-2">
                  {loading && <Loader2 size={10} className="animate-spin" />}
                  PREVIEW_MODE: LIVE
               </div>
            </div>

            <div 
              className="flex-1 bg-stone-900/50 relative overflow-hidden group"
              onClick={() => setIframeFocused(true)}
            >
               {!code ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-600 opacity-50">
                     <Wand2 size={64} className="mb-4 text-claw-900" strokeWidth={1} />
                     <p className="font-mono text-xs uppercase tracking-widest text-center">
                        Waiting for Neural Input...<br/>
                        <span className="text-[10px] text-stone-700 normal-case mt-2 block">Tell the chat what to build.</span>
                     </p>
                  </div>
               ) : (
                 <>
                  {/* Click Overlay to fix focus issues - disappears when focused */}
                  {!iframeFocused && (
                    <div 
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer group-hover:flex hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIframeFocused(true);
                      }}
                    >
                       <div className="bg-black/80 text-white px-4 py-2 rounded-full font-mono text-xs flex items-center gap-2 border border-stone-700 backdrop-blur-md shadow-xl">
                          <MousePointerClick size={14} /> Click to Focus App
                       </div>
                    </div>
                  )}

                  <iframe 
                    title="preview"
                    srcDoc={code}
                    className="w-full h-full border-none bg-white"
                    // Adding specific sandbox permissions and allow-scripts
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock"
                    allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write"
                    onLoad={(e) => {
                       // Attempt to focus iframe on load
                       const iframe = e.target as HTMLIFrameElement;
                       iframe.focus();
                    }}
                  />
                  
                  {/* Focus Reset Button (Bottom Right) */}
                  {iframeFocused && (
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         setIframeFocused(false);
                       }}
                       className="absolute bottom-4 right-4 z-20 bg-black/50 hover:bg-black text-stone-500 hover:text-white p-2 rounded-full backdrop-blur-sm border border-stone-800 transition-all text-[10px]"
                       title="Unfocus App (Enable Page Scrolling)"
                     >
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