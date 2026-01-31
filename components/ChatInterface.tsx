import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Terminal, ShieldAlert, Wifi, Battery, MessageSquare, Search } from 'lucide-react';
import { generateChatResponse } from '../services/api';

const LOGO_URL = "https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/neww/ping%20(4).png";

const SUGGESTIONS = [
  "Price of Solana?",
  "Latest crypto news",
  "Analyze Bitcoin trend",
  "What is the Molt Protocol?",
  "Check Rug status"
];

export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string, type?: 'system' | 'msg'}[]>([
    { 
      role: 'agent', 
      type: 'system',
      content: "IDENTITY CONFIRMED: MoltGPT V2.6 // SENTINEL\n\nMISSION PARAMETERS LOADED:\n> Solana Chain Analysis & Pattern Recognition\n> Real-Time Market Data Retrieval (Google Search Uplink)\n> Temporal Market Data Retrieval (Year 2026)\n\nI am the pincer that separates signal from noise. How may I assist your portfolio today?" 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, manualMsg?: string) => {
    e?.preventDefault();
    const msgToSend = manualMsg || input;
    
    if (!msgToSend.trim() || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msgToSend }]);
    setLoading(true);

    const history = messages
      .filter(m => m.type !== 'system')
      .map(m => `${m.role.toUpperCase()}: ${m.content}`);

    try {
      const response = await generateChatResponse(msgToSend, history);
      setMessages(prev => [...prev, { role: 'agent', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'agent', content: "Error: Neural connection interrupted by network entropy." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full max-w-6xl mx-auto flex flex-col p-4 md:p-6 animate-fade-in pt-32 relative min-h-screen">
      
      <div className="mb-6 animate-slide-up flex justify-between items-end">
        <div>
            <h2 className="text-2xl text-white font-black italic flex items-center gap-3 tracking-tighter">
              <div className="w-8 h-8 rounded-sm overflow-hidden border border-claw-500/50">
                 <img src={LOGO_URL} className="w-full h-full object-cover" />
              </div>
              NEURAL LINK_V2
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-1 tracking-wider pl-1">
            DIRECT UPLINK TO 2026 PREDICTION ENGINE
            </p>
        </div>
        <div className="hidden md:flex gap-4 text-stone-600 font-mono text-[10px]">
            <span className="flex items-center gap-1"><Wifi size={12}/> CONN_GOOD</span>
            <span className="flex items-center gap-1"><Battery size={12}/> PWR_100%</span>
        </div>
      </div>

      {/* Container Frame */}
      <div className="flex-1 bg-obsidian-900/80 border border-stone-800 flex flex-col overflow-hidden relative clip-corner-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md min-h-[600px] mb-8">
        
        {/* Decorative Borders */}
        <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-claw-900 rounded-tl-lg pointer-events-none z-20"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-claw-900 rounded-br-lg pointer-events-none z-20"></div>

        {/* Background FX - Watermark */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <img 
               src={LOGO_URL} 
               className="w-[500px] h-[500px] object-contain opacity-5 grayscale mix-blend-screen"
            />
        </div>

        {/* Header */}
        <div className="bg-black/40 backdrop-blur border-b border-stone-800 p-4 flex justify-between items-center z-10">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-blink absolute -right-0.5 -top-0.5 z-10"></div>
                 <div className="p-2 bg-stone-900 border border-stone-700 rounded-sm">
                    <Bot className="text-claw-500" size={20} />
                 </div>
              </div>
              <div className="flex flex-col">
                 <span className="text-claw-100 font-mono text-xs font-bold tracking-widest uppercase">Encrypted Channel</span>
                 <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-claw-500 rounded-full"></span>
                    <span className="text-[9px] text-stone-500 font-mono uppercase">Hash: #88291AA</span>
                 </div>
              </div>
           </div>
           
           <div className="hidden md:block">
              <div className="h-8 w-32 bg-stone-900/50 border border-stone-800 relative overflow-hidden">
                 <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-claw-500/20 to-transparent animate-scanline"></div>
                 <div className="flex items-center justify-center h-full text-[9px] font-mono text-stone-500">
                    SIGNAL_STABLE
                 </div>
              </div>
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10 scroll-smooth" ref={scrollRef}>
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'agent' && (
                  <div className={`w-10 h-10 clip-hex flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'system' ? 'bg-yellow-950/20 border border-yellow-700/50' : 'bg-claw-950 border border-claw-900/50'
                  }`}>
                     {msg.type === 'system' ? <ShieldAlert size={16} className="text-yellow-500" /> : <img src={LOGO_URL} className="w-full h-full object-cover opacity-80" />}
                  </div>
                )}
                
                <div className={`max-w-[85%] md:max-w-[70%] text-sm font-mono leading-relaxed p-5 clip-corner-1 border relative ${
                  msg.role === 'user' 
                    ? 'bg-stone-900 text-stone-200 border-stone-700' 
                    : msg.type === 'system' 
                       ? 'bg-yellow-900/10 text-yellow-500 border-yellow-900/30'
                       : 'bg-black/80 text-claw-50 border-claw-900/30 shadow-[0_0_15px_rgba(220,38,38,0.05)]'
                }`}>
                   {/* Tiny decoration on message box */}
                   <div className={`absolute top-0 right-0 p-1 ${msg.role === 'user' ? 'bg-stone-700' : 'bg-claw-900'}`}></div>

                   <p className="whitespace-pre-wrap">{msg.content}</p>
                   {msg.role === 'agent' && msg.type !== 'system' && (
                     <div className="mt-3 pt-2 border-t border-claw-900/20 text-[9px] text-claw-600 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Terminal size={10} /> Verified Prediction // 2026
                     </div>
                   )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-10 h-10 bg-stone-800 border border-stone-600 flex items-center justify-center flex-shrink-0 clip-hex">
                     <User size={16} className="text-stone-300" />
                  </div>
                )}
             </div>
           ))}
           
           {loading && (
             <div className="flex gap-4 animate-pulse">
               <div className="w-10 h-10 bg-claw-950 border border-claw-900/50 flex items-center justify-center flex-shrink-0 clip-hex">
                  <img src={LOGO_URL} className="w-full h-full object-cover" />
               </div>
               <div className="flex items-center gap-1 h-10 px-4 bg-black/40 border border-claw-900/20 clip-corner-1">
                  <span className="w-1.5 h-1.5 bg-claw-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-claw-600 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                  <span className="w-1.5 h-1.5 bg-claw-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
               </div>
             </div>
           )}
        </div>

        {/* Input & Suggestions */}
        <div className="p-4 bg-black/60 border-t border-stone-800 z-10 backdrop-blur">
           
           {/* Suggestions */}
           {!loading && (
             <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {SUGGESTIONS.map((suggestion, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleSend(undefined, suggestion)}
                     className="whitespace-nowrap px-3 py-1 bg-stone-900/50 border border-stone-700 text-stone-400 text-[10px] font-mono hover:text-claw-500 hover:border-claw-500/50 transition-colors rounded-sm"
                   >
                     {suggestion}
                   </button>
                ))}
             </div>
           )}

           <form onSubmit={handleSend} className="relative flex items-center gap-0">
              <div className="bg-stone-900 h-12 flex items-center px-4 border-y border-l border-stone-700 text-claw-500 font-mono">
                 <Terminal size={18} />
              </div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="INPUT COMMAND OR QUERY..."
                className="flex-1 bg-black border border-stone-700 text-white h-12 px-4 focus:outline-none focus:border-claw-600 font-mono text-sm placeholder-stone-700 transition-all tracking-wider"
                autoFocus
              />
              <button 
                type="submit" 
                disabled={loading || !input}
                className="bg-claw-700 hover:bg-claw-600 text-white h-12 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-claw-700 font-bold uppercase tracking-widest text-xs"
              >
                Send_CMD
              </button>
           </form>
           <div className="flex justify-between items-center mt-2 px-1">
              <div className="text-[9px] text-stone-600 font-mono flex items-center gap-2">
                 <span className="w-1 h-1 bg-green-500 rounded-full"></span> SYSTEM READY
              </div>
              <div className="text-[9px] text-stone-700 font-mono uppercase">
                  Caution: High Volatility
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};