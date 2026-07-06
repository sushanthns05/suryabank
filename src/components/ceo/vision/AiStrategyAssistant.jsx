import React, { useState } from 'react';
import { Bot, Send, Maximize2, Minimize2, Sparkles, X, ChevronRight } from 'lucide-react';

const AiStrategyAssistant = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Good day. I am your Executive Strategy AI. I can forecast outcomes, summarize vision pillars, and analyze the innovation index. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs);
    setInput('');

    // Simulate AI response based on strategy mock data
    setTimeout(() => {
      setMessages([...newMsgs, { 
        role: 'assistant', 
        content: `Based on the Strategic Blueprint, our current Digital Adoption is at 94% and AI Transformation Index is at 88. If we increase R&D budget by 10%, we project a 15% CAGR in revenue by 2030.` 
      }]);
    }, 1000);
  };

  const suggestedQueries = [
    "Summarize the Global Expansion strategy",
    "What is the status of the Cybersecurity Shield?",
    "Forecast 2030 ESG impact"
  ];

  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-ceo-navy border border-ceo-gold/50 text-white px-5 py-3 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 transition-all group"
      >
        <div className="relative">
          <Bot size={20} className="text-ceo-gold" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ceo-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ceo-gold"></span>
          </span>
        </div>
        <span className="text-sm font-bold font-serif">Strategy AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-10">
      {/* Header */}
      <div className="bg-ceo-navy border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg">
            <Bot size={20} className="text-ceo-gold" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif">Surya Executive AI</h3>
            <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(true)} className="p-1 text-slate-400 hover:text-white transition-colors">
            <Minimize2 size={16} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-ceo-gold text-slate-900 font-medium rounded-tr-sm' 
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
            }`}>
              {msg.role === 'assistant' && i === 0 && (
                <Sparkles size={14} className="text-ceo-gold mb-2 inline-block mr-1" />
              )}
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 space-y-1">
          {suggestedQueries.map((q, i) => (
            <button 
              key={i}
              onClick={() => setInput(q)}
              className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-ceo-gold bg-slate-900 border border-slate-800 hover:border-ceo-gold/30 rounded-lg transition-colors flex items-center justify-between"
            >
              {q} <ChevronRight size={12} />
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about strategy or forecasts..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ceo-gold/50 transition-colors"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="bg-ceo-gold text-slate-900 p-2 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default AiStrategyAssistant;
