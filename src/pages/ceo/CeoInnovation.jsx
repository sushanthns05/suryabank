import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Cpu, ShieldCheck, Database, Key, LayoutGrid, BrainCircuit, Activity, Network,
  BarChart4, ArrowRight, Zap, Target, FileText, CheckCircle2, ChevronRight,
  TrendingUp, Fingerprint, Lock, Globe, Server, Download, PieChart, Sparkles, Send
} from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Command Dashboard' },
  { id: 'pipeline', label: 'Innovation Pipeline' },
  { id: 'portfolio', label: 'Tech Portfolio' },
  { id: 'api', label: 'API Marketplace' },
  { id: 'research', label: 'Patents & Research' },
  { id: 'ai', label: 'AI Assistant' },
  { id: 'downloads', label: 'Download Center' }
];

const METRICS = [
  { label: 'Innovation Index', value: '94.2', trend: '+2.1%', desc: 'Enterprise-wide adoption' },
  { label: 'Active R&D Projects', value: '38', trend: '+5', desc: 'Across 4 global hubs' },
  { label: 'AI Models Deployed', value: '142', trend: '+12', desc: 'Production grade' },
  { label: 'Open APIs', value: '85', trend: '+3', desc: 'Marketplace endpoints' },
  { label: 'Patents Granted', value: '1,204', trend: '+45', desc: 'Global portfolio' },
  { label: 'R&D Budget (FY26)', value: '$1.2B', trend: '+15%', desc: 'Allocated funding' },
  { label: 'Readiness Score', value: '8.9/10', trend: '+0.4', desc: 'Tech maturity average' },
  { label: 'Security Index', value: '99.9%', trend: '+0.1%', desc: 'Quantum-safe compliance' }
];

const PIPELINE_STAGES = [
  'Idea', 'Research', 'Prototype', 'Development', 'Testing', 'Pilot', 'Production', 'Global Deployment'
];

const PORTFOLIO = [
  { id: 'ai', title: 'AI Banking Integration', icon: BrainCircuit, tech: 'PyTorch, Spark MLlib, CUDA', desc: 'Predictive customer deposit trends and personalized investment advisors.', metric: 'Accuracy: 99.4%', owner: 'Dr. Sarah Chen', status: 'Global Deployment', impact: 'High', budget: '$45M' },
  { id: 'fraud', title: 'Real-time Fraud Detection', icon: ShieldCheck, tech: 'Kafka, Flink, Python ML', desc: 'Continuous stream monitoring of transaction nodes for anomaly flags.', metric: 'Uptime: 99.99%', owner: 'James Wilson', status: 'Production', impact: 'Critical', budget: '$80M' },
  { id: 'blockchain', title: 'Blockchain Settlement', icon: Network, tech: 'Solidity, Rust, Hyperledger', desc: 'Private ledger networks for secure, instant cross-border B2B clearings.', metric: 'Settlement: <10s', owner: 'Elena Rodriguez', status: 'Pilot', impact: 'High', budget: '$120M' },
  { id: 'quantum', title: 'Quantum-Safe Protection', icon: Cpu, tech: 'Lattice Cryptography, PQC', desc: 'Securing databases with quantum-resistant key exchange algorithms.', metric: 'PQC Migrated: 85%', owner: 'Dr. Alan Turing Jr.', status: 'Development', impact: 'Critical', budget: '$200M' },
  { id: 'cbdc', title: 'CBDC Infrastructure', icon: Globe, tech: 'Corda, Node.js, Go', desc: 'Framework for integration with central bank digital currencies.', metric: 'Capacity: 1M TPS', owner: 'Robert Chang', status: 'Research', impact: 'Transformational', budget: '$50M' }
];

const CeoInnovation = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pulseNodes, setPulseNodes] = useState(false);
  const [activeArea, setActiveArea] = useState(PORTFOLIO[0]);
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleGenerateAPIKey = () => {
    const key = 'SURYA_LIVE_' + Math.random().toString(36).substring(2, 15).toUpperCase();
    alert(`Your new Enterprise API Key is:\n\n${key}\n\nPlease store this securely. It will not be shown again.`);
  };

  const handleDownload = (doc) => {
    try {
      const pdf = new jsPDF();
      pdf.setFillColor(15, 23, 42); // slate-900 background
      pdf.rect(0, 0, 210, 297, 'F');
      
      pdf.setTextColor(212, 175, 55); // ceo-gold
      pdf.setFontSize(24);
      pdf.text('Surya Bank Enterprise', 20, 30);
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text(doc.title, 20, 50);
      
      pdf.setFontSize(11);
      pdf.setTextColor(148, 163, 184); // slate-400
      pdf.text('Document Classification: CONFIDENTIAL - INTERNAL USE ONLY', 20, 70);
      pdf.text(`Document Type: ${doc.type}`, 20, 80);
      pdf.text(`Generated: ${new Date().toLocaleDateString()} | System: Innovation Command Center`, 20, 90);
      
      pdf.setTextColor(226, 232, 240); // slate-200
      pdf.setFontSize(14);
      pdf.text('Executive Summary', 20, 115);
      
      pdf.setFontSize(11);
      pdf.setTextColor(148, 163, 184); // slate-400
      
      const content = "This document serves as an official executive record of Surya Bank's strategic innovation initiatives. " +
        "It outlines the operational frameworks, risk mitigation strategies, and performance metrics " +
        "associated with our global technology portfolio. The contents herein are intended exclusively for the " +
        "Executive Board and authorized leadership personnel.\n\n" +
        "Surya Bank remains committed to pioneering enterprise-grade solutions that optimize " +
        "global financial infrastructure while adhering to strict regulatory and compliance standards. " +
        "Recent quarterly analyses indicate substantial progress toward our strategic milestones, " +
        "driven by advanced AI integrations, quantum-resistant cryptography, and robust corporate governance.\n\n" +
        "Furthermore, our ongoing investments in open banking APIs and blockchain settlement corridors " +
        "have positioned the institution to dramatically reduce latency and intermediary costs across all " +
        "cross-border value clearings.\n\n" +
        "For detailed technical specifications, financial breakdowns, or further strategic inquiries, please " +
        "refer to the centralized data repositories or contact the Chief Innovation Office.";
        
      const splitText = pdf.splitTextToSize(content, 170);
      pdf.text(splitText, 20, 125);
      
      pdf.setTextColor(212, 175, 55);
      pdf.setFontSize(10);
      pdf.text('Authorized by: Office of the Founder, Chairman & CEO', 20, 270);
      pdf.text('Surya Bank Global Headquarters - R&D Division', 20, 280);

      pdf.save(`${doc.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Failed to generate PDF. Please ensure jsPDF is available.');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => setPulseNodes(prev => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAiSubmit = (text) => {
    if (!text.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', text }]);
    setAiQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      let response = "I've analyzed the R&D database. Our current focus is heavily indexed toward quantum resilience and AI integration.";
      const q = text.toLowerCase();
      if (q.includes('patent') || q.includes('portfolio')) {
        response = "We currently hold 1,204 granted patents globally, with 45 approved this quarter alone, primarily in cryptography and decentralized ledger technologies.";
      } else if (q.includes('budget') || q.includes('spend')) {
        response = "The FY26 R&D budget is set at $1.2B. $200M is specifically earmarked for Quantum-Safe protection and $120M for Blockchain Settlement infrastructure.";
      } else if (q.includes('report') || q.includes('board')) {
        response = "I have drafted an executive summary of our Q3 Innovation metrics for the Board. Would you like me to send it to the Executive Download Center as a PDF?";
      }
      setAiChat(prev => [...prev, { role: 'ai', text: response }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <div key={i} className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-slate-800 hover:border-[#D4AF37]/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/20 transition-all"></div>
            <h4 className="text-sm font-bold text-slate-400 mb-2">{m.label}</h4>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-white tracking-tight">{m.value}</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-400/10 px-2 py-1 rounded-lg">
                {m.trend}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-3">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="text-[#D4AF37]" size={20} /> Technology Adoption Trajectory
          </h3>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-slate-800 pb-2 pl-2">
            {[40, 55, 45, 70, 65, 85, 80, 95].map((h, i) => (
              <div key={i} className="w-full bg-gradient-to-t from-[#D4AF37]/20 to-[#D4AF37]/80 rounded-t-sm hover:opacity-80 transition-opacity relative group" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-xs px-2 py-1 rounded-md text-white transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2 pl-2">
            <span>Q1 '25</span><span>Q2 '25</span><span>Q3 '25</span><span>Q4 '25</span>
            <span>Q1 '26</span><span>Q2 '26</span><span>Q3 '26</span><span>Q4 '26</span>
          </div>
        </div>
        
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieChart className="text-[#D4AF37]" size={20} /> Budget Allocation
          </h3>
          <div className="flex items-center justify-center h-64 relative">
            <div className="w-48 h-48 rounded-full border-[16px] border-slate-800 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[16px] border-[#D4AF37] opacity-80" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)' }}></div>
              <div className="absolute inset-0 rounded-full border-[16px] border-indigo-500 opacity-80" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 0, 50% 0)' }}></div>
              <div className="absolute inset-0 rounded-full border-[16px] border-emerald-500 opacity-80" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0)' }}></div>
              <div className="text-center">
                <div className="text-2xl font-black text-white">$1.2B</div>
                <div className="text-xs text-slate-400">Total Budget</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs font-bold">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span> R&D (55%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Pilot (25%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Scale (20%)</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPipeline = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-8">
        <h3 className="text-xl font-bold text-white mb-8">Global Innovation Lifecycle</h3>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-[60%] h-1 bg-gradient-to-r from-indigo-500 via-[#D4AF37] to-emerald-500 -translate-y-1/2 rounded-full">
             <div className="absolute top-0 right-0 bottom-0 left-0 bg-[length:20px_20px] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%,transparent_100%)] animate-[shimmer_1s_infinite_linear]"></div>
          </div>
          
          <div className="relative flex justify-between items-center z-10">
            {PIPELINE_STAGES.map((stage, i) => {
              const isPast = i < 5;
              const isActive = i === 5;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isPast ? 'bg-emerald-500 border-emerald-400 text-white' : 
                    isActive ? 'bg-[#D4AF37] border-white text-slate-900 scale-125 shadow-[0_0_20px_rgba(212,175,55,0.5)]' : 
                    'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                    {isPast ? <CheckCircle2 size={16} /> : <span className="font-bold text-sm">{i+1}</span>}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider text-center w-24 ${isActive ? 'text-[#D4AF37]' : isPast ? 'text-slate-300' : 'text-slate-600'}`}>{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PORTFOLIO.map((p, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-800 rounded-lg text-[#D4AF37]">
                <p.icon size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold">{p.title}</h4>
                <p className="text-xs text-slate-400">{p.owner}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                p.status === 'Production' || p.status === 'Global Deployment' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                p.status === 'Pilot' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20' :
                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}>
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 items-stretch">
      <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl relative min-h-[350px] flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute top-4 left-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Live Architecture Graph</span>
        </div>
        <svg viewBox="0 0 300 300" className="w-full max-w-[280px]">
          <circle cx="150" cy="150" r="15" fill="rgba(212,175,55,0.15)" className="animate-pulse" />
          <circle cx="150" cy="150" r="8" fill="#D4AF37" stroke="#FFF" strokeWidth="2" />
          {[
            { x: 50, y: 70, id: 'ai' }, { x: 250, y: 70, id: 'fraud' },
            { x: 50, y: 230, id: 'blockchain' }, { x: 250, y: 230, id: 'quantum' },
            { x: 150, y: 30, id: 'cbdc' }
          ].map((node, index) => (
            <g key={index} className="cursor-pointer group" onClick={() => setActiveArea(PORTFOLIO.find(a => a.id === node.id))}>
              <line 
                x1="150" y1="150" x2={node.x} y2={node.y} 
                stroke={activeArea.id === node.id ? '#D4AF37' : '#1e293b'} 
                strokeWidth="1.5" strokeDasharray={pulseNodes ? "4,4" : "0,0"} className="transition-colors duration-300"
              />
              <circle cx={node.x} cy={node.y} r={activeArea.id === node.id ? 14 : 10} fill={activeArea.id === node.id ? 'rgba(212,175,55,0.2)' : 'rgba(30,41,59,0.3)'} className="transition-all duration-300"/>
              <circle cx={node.x} cy={node.y} r="5" fill={activeArea.id === node.id ? '#D4AF37' : '#334155'} stroke="#FFF" strokeWidth="1"/>
            </g>
          ))}
        </svg>
      </div>

      <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] uppercase font-bold tracking-wider mb-3">
                {activeArea.status}
              </span>
              <h3 className="text-2xl font-serif text-white font-bold flex items-center gap-3">
                <activeArea.icon size={28} className="text-[#D4AF37]" />
                {activeArea.title}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Project Owner</p>
              <p className="text-white font-bold">{activeArea.owner}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Business Value</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{activeArea.desc}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Technology Stack</h4>
              <p className="text-sm text-[#D4AF37] font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">{activeArea.tech}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-500 mb-1">Key Metric</p>
              <p className="text-lg font-bold text-emerald-400">{activeArea.metric}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-500 mb-1">Impact Level</p>
              <p className="text-lg font-bold text-white">{activeArea.impact}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-500 mb-1">Approved Budget</p>
              <p className="text-lg font-bold text-white">{activeArea.budget}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAiAssistant = () => (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Sparkles size={160} />
      </div>
      <div className="p-6 bg-indigo-500/10 border-b border-indigo-500/20 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl"><BrainCircuit className="text-indigo-400" size={24} /></div>
          <div>
            <h3 className="font-bold text-indigo-300 text-lg">Innovation Intelligence Assistant</h3>
            <p className="text-xs text-indigo-400/60">Powered by Surya Enterprise AI</p>
          </div>
        </div>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4 z-10">
        {aiChat.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Sparkles className="text-indigo-400" size={32} />
            </div>
            <div className="max-w-md">
              <h4 className="text-lg font-bold text-white mb-2">How can I assist your R&D analysis?</h4>
              <p className="text-sm text-slate-400">Ask me to summarize technology stacks, explain AI models, generate board presentations, or forecast ROI for our pipeline.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg mt-4">
              {['"Summarize the Quantum portfolio"', '"What is our R&D budget?"', '"How many patents are granted?"', '"Draft a board report"'].map(prompt => (
                <button 
                  key={prompt} onClick={() => handleAiSubmit(prompt.replace(/"/g, ''))}
                  className="px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-indigo-600/20 text-xs text-slate-300 border border-slate-700 hover:border-indigo-500/50 transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {aiChat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm shadow-lg' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm shadow-md'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiTyping && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm flex gap-2 items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800 z-10">
        <div className="relative">
          <input 
            type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit(aiQuery)}
            placeholder="Query the innovation database..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-5 pr-12 py-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button 
            onClick={() => handleAiSubmit(aiQuery)} disabled={isAiTyping || !aiQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderApiMarketplace = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">API Marketplace Catalog</h3>
          <p className="text-sm text-slate-400">Enterprise integration endpoints available for internal and partner developers.</p>
        </div>
        <button onClick={handleGenerateAPIKey} className="px-4 py-2 bg-[#D4AF37] text-slate-900 font-bold text-sm rounded-lg hover:bg-amber-400 transition-colors">
          Generate API Key
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Payments Core', 'Identity & Auth', 'KYC/AML Fraud', 'Financial Analytics', 'Open Banking Data', 'Loan Origination'].map((api, i) => (
          <div key={i} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-[#D4AF37]/40 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Database size={24} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">v3.4.1</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{api} API</h4>
            <p className="text-xs text-slate-400 mb-4">GraphQL and REST endpoints for secure {api.toLowerCase()} integration.</p>
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Latency</span><span className="text-white font-mono">12ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Uptime</span><span className="text-emerald-400 font-mono">99.999%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Auth</span><span className="text-white font-mono">OAuth 2.0 / mTLS</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPatents = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <h4 className="text-sm font-bold text-slate-400">Total Granted</h4>
          <p className="text-3xl font-black text-white mt-2">1,204</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <h4 className="text-sm font-bold text-slate-400">Pending Review</h4>
          <p className="text-3xl font-black text-white mt-2">342</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <h4 className="text-sm font-bold text-slate-400">Active Licensing</h4>
          <p className="text-3xl font-black text-white mt-2">$85M/yr</p>
        </div>
      </div>
      
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/50 text-xs uppercase font-bold text-slate-500">
            <tr>
              <th className="px-6 py-4">Patent Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Filing Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {[
              { title: 'Quantum-Resistant Key Exchange in Distributed Ledgers', cat: 'Cryptography', status: 'Granted', date: 'Oct 12, 2024' },
              { title: 'Predictive Liquidity Routing via Neural Networks', cat: 'AI/ML', status: 'Pending', date: 'Jan 05, 2025' },
              { title: 'Zero-Knowledge Proof Identity Verification Auth', cat: 'Security', status: 'Granted', date: 'Mar 22, 2023' },
              { title: 'Autonomous Smart Contract Settlement Resolution', cat: 'Blockchain', status: 'Pending', date: 'Feb 18, 2026' }
            ].map((p, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{p.title}</td>
                <td className="px-6 py-4"><span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">{p.cat}</span></td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs font-bold ${p.status === 'Granted' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Granted' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{p.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#D4AF37] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">View PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDownloads = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {[
        { title: 'Q3 Innovation Board Report', type: 'PDF Deck', size: '4.2 MB', icon: FileText },
        { title: 'Quantum Readiness Whitepaper', type: 'Research PDF', size: '8.1 MB', icon: FileText },
        { title: 'Global Patent Portfolio FY25', type: 'Excel Data', size: '12.5 MB', icon: Database },
        { title: 'Surya AI Architecture Diagram', type: 'Visio', size: '1.8 MB', icon: Network },
        { title: 'API Integration Guidelines', type: 'PDF Manual', size: '5.5 MB', icon: FileText }
      ].map((doc, i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:bg-slate-800/50 transition-colors group cursor-pointer">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:text-[#D4AF37] transition-colors"><doc.icon size={24} /></div>
            <span className="text-[10px] font-mono text-slate-500">{doc.size}</span>
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">{doc.title}</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{doc.type}</p>
          </div>
          <button onClick={() => handleDownload(doc)} className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-[#D4AF37] hover:text-slate-900 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2">
            <Download size={16} /> Download
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 min-h-screen pb-12">
      
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-8 lg:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-700 p-[2px] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <Network className="text-[#D4AF37]" size={30} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D4AF37] tracking-tight">
                Innovation & Research Center
              </h1>
              <p className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mt-2">
                Enterprise Command Center
              </p>
            </div>
          </div>
          
          <button onClick={() => setActiveTab('ai')} className="px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/50 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] flex items-center gap-2">
            <Sparkles size={18} /> Ask AI Assistant
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 bg-slate-900/40 p-2 rounded-2xl border border-slate-800">
        {TABS.map(tab => (
          <button 
            key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-white shadow-lg border border-slate-700' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'pipeline' && renderPipeline()}
        {activeTab === 'portfolio' && renderPortfolio()}
        {activeTab === 'api' && renderApiMarketplace()}
        {activeTab === 'research' && renderPatents()}
        {activeTab === 'ai' && renderAiAssistant()}
        {activeTab === 'downloads' && renderDownloads()}
      </div>
      
      {/* Shared Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: -40px 0; }
          100% { background-position: 40px 0; }
        }
      `}} />
    </div>
  );
};

export default CeoInnovation;
