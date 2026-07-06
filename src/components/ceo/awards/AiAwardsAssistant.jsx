import React, { useState } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Mic, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  "Summarize 2026 achievements",
  "Generate executive bio for presentation",
  "Compare ESG vs Tech awards",
  "Explain lattice cryptography impact"
];

const AiAwardsAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello. I am the Executive Honors AI Assistant. How can I help you analyze Mr. Sushanth's global achievements?" }
  ]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `Analyzing your request regarding "${text}". Based on the official Executive Honors records, Surya Bank has secured 85 global awards, primarily leading in the Leadership and Technology categories. Our most recent pinnacle achievement is the Global Banker of the Year (2026).` 
      }]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-ceo-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] p-4 rounded-full transition-all group animate-bounce-slow"
      >
        <div className="absolute inset-0 bg-ceo-gold rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <Bot size={28} className="text-ceo-gold relative z-10" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-500 ease-in-out flex flex-col bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl ${
      isMinimized 
        ? 'bottom-6 right-6 w-72 h-14 rounded-2xl' 
        : 'bottom-6 right-6 w-96 h-[500px] rounded-3xl sm:w-[400px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50 rounded-t-3xl cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ceo-gold/20 flex items-center justify-center relative">
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900"></span>
            <Bot size={16} className="text-ceo-gold" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-none">Honors AI</h4>
            <p className="text-[9px] text-ceo-gold uppercase tracking-widest mt-1 font-bold flex items-center gap-1">
              <Sparkles size={8} /> Assistant Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-slate-500 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button className="text-slate-500 hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm leading-relaxed rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-ceo-gold text-slate-900 font-medium rounded-tr-sm' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-slate-300 hover:text-ceo-gold hover:border-ceo-gold/50 transition-colors shrink-0"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-950/50 rounded-b-3xl flex gap-2 items-center">
            <button className="p-2 text-slate-400 hover:text-ceo-gold transition-colors">
              <Mic size={18} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask about global recognition..."
              className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder:text-slate-600"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="p-2 bg-ceo-gold text-slate-900 rounded-full disabled:opacity-50 disabled:bg-slate-700 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AiAwardsAssistant;
