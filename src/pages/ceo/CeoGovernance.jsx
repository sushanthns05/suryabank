import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, BookOpen, Scale, Award, ChevronDown, CheckCircle,
  BarChart3, Network, FileText, AlertTriangle, Crosshair, Brain, 
  Download, Printer, Share2, Search, X, Maximize2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { jsPDF } from 'jspdf';
import { useCeoAuth } from '../../context/CeoAuthContext';
import {
  governanceKPIs, kpiTrends, executiveProfiles, orgHierarchy,
  boardCommittees, upcomingMeetings, corporateDocuments, riskHeatmap,
  successionPipeline, decisionMatrix
} from './CeoGovernanceData';

const SECTIONS = [
  { id: 'dashboard', label: 'Command Dashboard', icon: BarChart3 },
  { id: 'org-chart', label: 'Org Intelligence', icon: Network },
  { id: 'board-portal', label: 'Board Center', icon: Users },
  { id: 'risk-succession', label: 'Risk & Succession', icon: AlertTriangle },
  { id: 'documents', label: 'Document Vault', icon: FileText },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Brain },
];

const OrgNode = ({ node, onSelect }) => {
  const [expanded, setExpanded] = useState(true);
  const profile = executiveProfiles[node.name];
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        layout
        className="relative group cursor-pointer"
        onClick={() => onSelect(node.name)}
      >
        <div className={`w-64 p-4 rounded-xl border transition-all duration-300 shadow-lg relative z-10 ${profile ? 'bg-slate-900 border-ceo-gold hover:shadow-ceo-gold/20' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}>
          <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${profile ? 'text-ceo-gold' : 'text-slate-500'}`}>{node.title}</span>
          <span className="block font-serif text-sm font-semibold text-white truncate">{node.name}</span>
          {profile && (
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 bg-ceo-gold rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={12} className="text-slate-900" />
            </div>
          )}
        </div>
        
        {hasChildren && (
          <button 
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 z-20"
          >
            <ChevronDown size={14} className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center"
          >
            <div className="h-8 w-0.5 bg-slate-800" />
            <div className="relative flex justify-center w-full">
              <div className="absolute top-0 w-[calc(100%-16rem)] h-0.5 bg-slate-800" />
              <div className="flex justify-center gap-8 w-full pt-4">
                {node.children.map((child, idx) => (
                  <div key={idx} className="relative flex flex-col items-center">
                    <div className="absolute -top-4 w-0.5 h-4 bg-slate-800" />
                    <OrgNode node={child} onSelect={onSelect} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CeoGovernance = () => {
  const { user } = useCeoAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState([]);

  // Scroll Spy Observer
  useEffect(() => {
    const observers = SECTIONS.map(sec => {
      const el = document.getElementById(sec.id);
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveSection(sec.id);
      }, { rootMargin: '-20% 0px -60% 0px' });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(obs => obs?.disconnect());
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', content: aiQuery }]);
    const query = aiQuery;
    setAiQuery('');
    
    setTimeout(() => {
      setAiChat(prev => [...prev, { 
        role: 'assistant', 
        content: `Analyzing governance documentation for "${query}"... The corporate charter dictates that all decisions regarding this must pass through the Risk Committee and require a two-thirds majority from the Executive Board.` 
      }]);
    }, 1200);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    
    // Background & Watermark
    doc.setFillColor(7, 26, 53); // CEO Navy
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(255, 255, 255);
    
    // Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(24);
    doc.text("SURYA BANK", 20, 30);
    doc.setFontSize(12);
    doc.setTextColor(212, 175, 55); // Gold
    doc.text("CORPORATE GOVERNANCE & INTELLIGENCE REPORT", 20, 40);
    
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    
    let y = 60;
    
    doc.text(`Generated By: ${user?.email || 'CEO Office'}`, 20, y); y += 10;
    doc.text(`Timestamp: ${new Date().toISOString()}`, 20, y); y += 20;

    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("EXECUTIVE DASHBOARD METRICS", 20, y); y += 10;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`Governance Score: ${governanceKPIs.governanceScore}/100`, 20, y); y += 7;
    doc.text(`Compliance Score: ${governanceKPIs.complianceScore}/100`, 20, y); y += 7;
    doc.text(`ESG Score: ${governanceKPIs.esgScore}/100`, 20, y); y += 7;
    doc.text(`Active Corporate Policies: ${governanceKPIs.corporatePolicies}`, 20, y); y += 7;
    
    y += 15;
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("CRITICAL RISK ESCALATIONS", 20, y); y += 10;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    riskHeatmap.forEach(r => {
      doc.text(`• [SEV ${r.severity}] ${r.title} (Owner: ${r.owner})`, 20, y);
      y += 7;
    });

    y += 15;
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("ACTIVE BOARD COMMITTEES", 20, y); y += 10;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    boardCommittees.forEach(c => {
      doc.text(`• ${c.name} - Chair: ${c.chair}`, 20, y);
      y += 7;
    });

    // Verification Seal
    doc.setDrawColor(212, 175, 55);
    doc.rect(140, 250, 50, 25, 'S');
    doc.setTextColor(212, 175, 55);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text("SURYA BANK GOVERNANCE", 143, 256);
    doc.text("SECURE EXPORT", 148, 262);
    doc.setFont("Helvetica", "normal");
    doc.text(`ID: ${Math.random().toString(36).substr(2, 8).toUpperCase()}`, 150, 268);

    doc.save("Surya_Bank_Governance_Report.pdf");
  };

  const handleDownloadDocument = (document) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFillColor(15, 23, 42); // slate-950
    pdf.rect(0, 0, 210, 40, 'F');
    pdf.setTextColor(212, 175, 55); // gold
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("SURYA BANK", 105, 20, { align: "center" });
    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184); // slate-400
    pdf.text("CORPORATE POLICY DOCUMENT", 105, 28, { align: "center" });

    // Title
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(16);
    pdf.text(document.title, 20, 60);
    
    // Metadata
    pdf.setFontSize(10);
    pdf.setFont("Helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Category: ${document.category}`, 20, 70);
    pdf.text(`Version: ${document.version}`, 20, 77);
    pdf.text(`Last Updated: ${document.lastUpdated}`, 20, 84);

    // Body (Mock content)
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const content = `This is a certified digital copy of the ${document.title}.\n\n` +
      `As part of Surya Bank's commitment to transparent corporate governance and\n` +
      `regulatory compliance, this document is strictly maintained under version control.\n\n` +
      `All executives, board members, and relevant stakeholders are required to adhere\n` +
      `to the frameworks and guidelines outlined within this policy.\n\n` +
      `For the full extended text of this document, please access the internal \n` +
      `Surya Bank Secure Vault or contact the Office of the Corporate Secretary.\n\n` +
      `\n\n\n\n` +
      `[END OF DOCUMENT EXTRACT]`;
      
    pdf.text(content, 20, 100);

    // Verification Seal
    pdf.setDrawColor(212, 175, 55);
    pdf.rect(140, 250, 50, 25, 'S');
    pdf.setTextColor(212, 175, 55);
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text("SURYA BANK", 143, 256);
    pdf.text("VERIFIED COPY", 148, 262);
    pdf.setFont("Helvetica", "normal");
    pdf.text(`ID: ${Math.random().toString(36).substr(2, 8).toUpperCase()}`, 150, 268);

    pdf.save(`${document.title.replace(/\s+/g, '_')}_${document.version}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 pb-32 font-sans relative">
      
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 px-6 py-3 flex flex-wrap justify-between items-center gap-4 text-sm shadow-xl">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSection === sec.id ? 'bg-ceo-gold text-ceo-navy shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <sec.icon size={16} /> {sec.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownloadPdf} className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-ceo-gold transition-colors tooltip-trigger" title="Download Formal Governance Report">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-24 mt-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3 py-1 bg-ceo-gold/10 border border-ceo-gold/30 text-ceo-gold text-[10px] uppercase font-bold tracking-widest rounded-full">
            Corporate Governance & Leadership Intelligence
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-ceo-gold to-yellow-200">Oversight Center</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Real-time executive oversight, organizational intelligence, and board-level risk monitoring across the global Surya Bank enterprise.
          </p>
        </div>

        {/* 1. Dashboard */}
        <section id="dashboard" className="scroll-mt-24 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Governance Score</span>
              <span className="text-4xl font-serif font-bold text-white">{governanceKPIs.governanceScore}<span className="text-lg text-ceo-gold">/100</span></span>
            </div>
            <div className="col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Compliance Health</span>
              <span className="text-4xl font-serif font-bold text-white">{governanceKPIs.complianceScore}<span className="text-lg text-emerald-500">%</span></span>
            </div>
            <div className="col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Board Members</span>
              <span className="text-4xl font-serif font-bold text-white">{governanceKPIs.boardMembers}</span>
              <span className="text-[9px] text-slate-400 mt-1">{governanceKPIs.independentDirectors} Independent</span>
            </div>
            <div className="col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Corporate Policies</span>
              <span className="text-4xl font-serif font-bold text-white">{governanceKPIs.corporatePolicies}</span>
              <span className="text-[9px] text-emerald-400 mt-1">100% Up to date</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Pillar Performance Trends</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpiTrends}>
                    <defs>
                      <linearGradient id="colorGov" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEsg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="governance" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorGov)" />
                    <Area type="monotone" dataKey="esg" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorEsg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider w-full text-left">Oversight Radar</h3>
              <div className="h-64 w-full max-w-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                    { subject: 'Audit', A: 98, fullMark: 100 },
                    { subject: 'Risk', A: 96, fullMark: 100 },
                    { subject: 'Tech', A: 97, fullMark: 100 },
                    { subject: 'ESG', A: 92, fullMark: 100 },
                    { subject: 'Compliance', A: 98, fullMark: 100 },
                    { subject: 'Ethics', A: 100, fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10}} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Governance" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Org Chart */}
        <section id="org-chart" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Network size={24} className="text-ceo-gold" />
            <h2 className="text-2xl font-serif text-white font-bold">Enterprise Organization Map</h2>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 overflow-x-auto shadow-xl relative min-h-[600px] flex justify-center custom-scrollbar">
            <OrgNode node={orgHierarchy} onSelect={(name) => executiveProfiles[name] && setSelectedExecutive(executiveProfiles[name])} />
          </div>
        </section>

        {/* 3. Board Portal */}
        <section id="board-portal" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Users size={24} className="text-ceo-gold" />
            <h2 className="text-2xl font-serif text-white font-bold">Board & Committees Center</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Committees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {boardCommittees.map((com, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-ceo-gold/50 transition-colors shadow-lg group">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-white">{com.name}</h4>
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${com.health === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {com.health}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Chair</span>
                        <span className="text-slate-300 font-semibold">{com.chair}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Pending Actions</span>
                        <span className="text-ceo-gold font-bold">{com.pendingActions}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">YTD Meetings</span>
                        <span className="text-slate-300">{com.meetingsYTD}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Upcoming Board Meetings</h3>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                {upcomingMeetings.map((mtg) => (
                  <div key={mtg.id} className="p-4 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-700 transition-colors">
                    <span className="text-[10px] text-ceo-gold uppercase font-bold tracking-wider mb-1 block">{mtg.date} • {mtg.time}</span>
                    <h5 className="font-bold text-sm text-white mb-2">{mtg.title}</h5>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{mtg.type}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{mtg.status}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                  Open Board Calendar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Risk & Succession */}
        <section id="risk-succession" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle size={24} className="text-ceo-gold" />
            <h2 className="text-2xl font-serif text-white font-bold">Risk Matrix & Succession</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Succession Pipeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Executive Succession Pipeline</h3>
              <div className="space-y-6">
                {successionPipeline.map((role, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                      <div>
                        <h4 className="font-bold text-white">{role.role}</h4>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Current: {role.current}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
                      <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <span className="block text-slate-500 mb-1">Ready Now</span>
                        {role.readyNow.map(r => <div key={r}>{r}</div>)}
                      </div>
                      <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <span className="block text-slate-500 mb-1">1-3 Years</span>
                        {role.ready1To3.map(r => <div key={r}>{r}</div>)}
                      </div>
                      <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-400">
                        <span className="block text-slate-500 mb-1">3-5 Years</span>
                        {role.ready3To5.map(r => <div key={r}>{r}</div>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Heatmap */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Governance Risk Heatmap</h3>
              <div className="space-y-3">
                {riskHeatmap.map(risk => (
                  <div key={risk.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-lg flex flex-col justify-center items-center shrink-0 border ${
                      risk.severity === 5 ? 'bg-red-500/20 border-red-500/50 text-red-500' :
                      risk.severity === 4 ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' :
                      'bg-yellow-500/20 border-yellow-500/50 text-yellow-500'
                    }`}>
                      <span className="text-[9px] uppercase font-bold">SEV</span>
                      <span className="text-lg font-black">{risk.severity}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-white">{risk.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Owner: {risk.owner} • Category: {risk.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Document Center */}
        <section id="documents" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText size={24} className="text-ceo-gold" />
            <h2 className="text-2xl font-serif text-white font-bold">Corporate Document Vault</h2>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="p-4 font-bold">Document Title</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Version</th>
                    <th className="p-4 font-bold">Last Updated</th>
                    <th className="p-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {corporateDocuments.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="p-4 font-semibold text-white">{doc.title}</td>
                      <td className="p-4 text-slate-400">
                        <span className="px-2 py-1 rounded bg-slate-800 text-[10px] uppercase font-bold">{doc.category}</span>
                      </td>
                      <td className="p-4 text-slate-300 font-mono text-xs">{doc.version}</td>
                      <td className="p-4 text-slate-400">{doc.lastUpdated}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDownloadDocument(doc)}
                          className="text-ceo-gold hover:text-yellow-300 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 6. AI Assistant */}
        <section id="ai-assistant" className="scroll-mt-24">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ceo-gold/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Brain size={24} className="text-ceo-gold" />
              <h2 className="text-2xl font-serif text-white font-bold">AI Governance Intelligence</h2>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 h-64 overflow-y-auto mb-4 space-y-4 custom-scrollbar relative z-10">
              <div className="flex gap-3 text-sm text-slate-300">
                <div className="w-8 h-8 rounded-full bg-ceo-gold/20 flex items-center justify-center shrink-0">
                  <Brain size={16} className="text-ceo-gold" />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none leading-relaxed">
                  Welcome to the Governance Intelligence Terminal. You can query the corporate charter, check committee alignments, request succession pipeline data, or summarize recent board minutes.
                </div>
              </div>
              
              {aiChat.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 text-sm ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-ceo-gold/20 text-ceo-gold'}`}>
                    {msg.role === 'user' ? <Users size={16} /> : <Brain size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl leading-relaxed max-w-[80%] ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSubmit} className="relative z-10 flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Query board minutes, policies, or structural hierarchy..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ceo-gold focus:ring-1 focus:ring-ceo-gold transition-all"
              />
              <button type="submit" className="px-6 py-3 bg-ceo-gold text-ceo-navy font-bold rounded-xl hover:bg-yellow-500 transition-colors flex items-center gap-2">
                <Search size={16} /> Query Database
              </button>
            </form>
          </div>
        </section>

      </div>

      {/* Slide-out Executive Profile Panel */}
      <AnimatePresence>
        {selectedExecutive && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExecutive(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto custom-scrollbar shadow-2xl"
            >
              <div className="p-6 pb-24 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <img src={selectedExecutive.image} alt={selectedExecutive.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-ceo-gold/50 shadow-lg" />
                    <div>
                      <h2 className="text-2xl font-serif text-white font-bold">{selectedExecutive.name}</h2>
                      <p className="text-ceo-gold font-bold text-sm">{selectedExecutive.title}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Crosshair size={12} /> {selectedExecutive.location}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedExecutive(null)} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-800 pb-2">Professional Biography</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{selectedExecutive.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Tenure</span>
                    <span className="text-lg font-bold text-white">{selectedExecutive.experience}</span>
                  </div>
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Committees</span>
                    <span className="text-lg font-bold text-white">{selectedExecutive.committees.length} Active</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-800 pb-2">Academic Qualifications</h3>
                  <ul className="space-y-2">
                    {selectedExecutive.qualifications.map(q => (
                      <li key={q} className="text-sm text-slate-300 flex items-center gap-2"><Award size={14} className="text-ceo-gold" /> {q}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-800 pb-2">Key Strategic Initiatives</h3>
                  <ul className="space-y-2">
                    {selectedExecutive.initiatives.map(i => (
                      <li key={i} className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> {i}</li>
                    ))}
                  </ul>
                </div>
                
                <button className="w-full py-3 rounded-xl bg-ceo-gold text-ceo-navy font-bold hover:bg-yellow-500 transition-colors shadow-lg flex justify-center items-center gap-2">
                  <Download size={18} /> Export Full Profile
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CeoGovernance;
