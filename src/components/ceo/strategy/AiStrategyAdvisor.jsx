import React, { useState } from 'react';
import { Bot, Send, Minimize2, Sparkles, ChevronRight } from 'lucide-react';

const AiStrategyAdvisor = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Good day. I am your AI Strategy Advisor. I can forecast outcomes, compare business units, and generate executive summaries based on live market data and our internal roadmap. How can I assist?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs);
    setInput('');

    setTimeout(() => {
      setMessages([...newMsgs, { 
        role: 'assistant', 
        content: `Analyzing "${input}"... Based on our current roadmap and macro indicators, accelerating the Digital Infrastructure pillar (currently 92% complete) by reallocating $200M from Corporate Banking could improve our overall ROE by 0.4% next quarter. However, this increases risk in cross-border settlements.` 
      }]);
    }, 1200);
  };

  const suggestedQueries = [
    "Forecast Q4 Retail Revenue Growth",
    "Compare SME vs Corporate Banking ROE",
    "What are the risks of the ESG pipeline?",
    "Summarize the Global Expansion strategy"
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
        <span className="text-sm font-bold font-serif">Strategy AI Advisor</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[550px] animate-in slide-in-from-bottom-10">
      
      {/* Header */}
      <div className="bg-ceo-navy border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg">
            <Bot size={20} className="text-ceo-gold" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif">AI Strategy Advisor</h3>
            <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online & Connected
            </p>
          </div>
        </div>
        <button onClick={() => setIsMinimized(true)} className="p-1 text-slate-400 hover:text-white transition-colors">
          <Minimize2 size={16} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-ceo-gold text-slate-900 font-medium rounded-tr-sm' 
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm shadow-md'
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
          placeholder="Ask for forecasts or strategic advice..."
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

export default AiStrategyAdvisor;
