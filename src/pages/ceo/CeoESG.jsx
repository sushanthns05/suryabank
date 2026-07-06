import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { 
  Leaf, Users, ShieldAlert, Award, TrendingUp, Globe, FileText, Download, 
  MapPin, CheckCircle2, AlertTriangle, Zap, Building2, BatteryCharging, 
  Droplets, Wind, Sparkles, Send, BrainCircuit, Heart, Scale, BarChart4
} from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'ESG Scorecard' },
  { id: 'strategy', label: '2035 Roadmap' },
  { id: 'centers', label: 'Action Centers' },
  { id: 'map', label: 'Global Map' },
  { id: 'ai', label: 'AI ESG Assistant' },
  { id: 'downloads', label: 'Download Center' }
];

const METRICS = [
  { label: 'Overall ESG Score', value: 'AA+', trend: 'Upgraded', desc: 'MSCI Rating', color: 'text-emerald-400' },
  { label: 'Global ESG Ranking', value: '#12', trend: '+4', desc: 'Top 50 Global Banks', color: 'text-amber-400' },
  { label: 'Green AUM', value: '$85B', trend: '+12%', desc: 'Assets Under Management', color: 'text-emerald-400' },
  { label: 'Carbon Progress', value: '42%', trend: 'On Track', desc: 'To 2030 Net Zero Goal', color: 'text-emerald-400' },
  { label: 'Renewable Energy', value: '88%', trend: '+5%', desc: 'Corporate Operations', color: 'text-teal-400' },
  { label: 'Sustainable Branches', value: '315', trend: '+22', desc: 'LEED Certified', color: 'text-teal-400' },
  { label: 'CSR Beneficiaries', value: '1.2M', trend: '+150k', desc: 'Global Outreach', color: 'text-blue-400' },
  { label: 'Compliance Rate', value: '99.9%', trend: 'Stable', desc: 'Ethics & Governance', color: 'text-purple-400' }
];

const ROADMAP_STAGES = [
  { phase: 'Carbon Reduction', year: '2025', status: 'Completed', owner: 'Operations' },
  { phase: 'Net Zero Framework', year: '2027', status: 'In Progress', owner: 'Risk Management' },
  { phase: 'Green Infrastructure', year: '2029', status: 'Planning', owner: 'Real Estate' },
  { phase: '100% Renewable', year: '2031', status: 'Planning', owner: 'Supply Chain' },
  { phase: 'Scope 3 Neutrality', year: '2033', status: 'Future', owner: 'Global Credit' },
  { phase: '2035 Climate Vision', year: '2035', status: 'Future', owner: 'Executive Board' }
];

// Mock Chart Data
const carbonData = [
  { year: '2020', scope1: 500, scope2: 300, scope3: 1200 },
  { year: '2021', scope1: 450, scope2: 280, scope3: 1100 },
  { year: '2022', scope1: 400, scope2: 200, scope3: 950 },
  { year: '2023', scope1: 300, scope2: 150, scope3: 800 },
  { year: '2024', scope1: 200, scope2: 50, scope3: 650 },
  { year: '2025', scope1: 150, scope2: 0, scope3: 500 },
];

const diversityData = [
  { year: '2022', vp: 28, md: 15, board: 30 },
  { year: '2023', vp: 32, md: 18, board: 33 },
  { year: '2024', vp: 36, md: 22, board: 38 },
  { year: '2025', vp: 41, md: 28, board: 42 },
];

const CeoESG = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCenter, setActiveCenter] = useState('finance');
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleDownload = (doc) => {
    try {
      const pdf = new jsPDF();
      pdf.setFillColor(15, 23, 42); // slate-900 background
      pdf.rect(0, 0, 210, 297, 'F');
      
      pdf.setTextColor(16, 185, 129); // emerald-500
      pdf.setFontSize(24);
      pdf.text('Surya Bank Enterprise', 20, 30);
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text(doc.title, 20, 50);
      
      pdf.setFontSize(11);
      pdf.setTextColor(148, 163, 184); // slate-400
      pdf.text('Document Classification: CONFIDENTIAL - INTERNAL USE ONLY', 20, 70);
      pdf.text(`Document Type: ${doc.type}`, 20, 80);
      pdf.text(`Generated: ${new Date().toLocaleDateString()} | System: ESG Intelligence Center`, 20, 90);
      
      pdf.setTextColor(226, 232, 240); // slate-200
      pdf.setFontSize(14);
      pdf.text('Executive Summary', 20, 115);
      
      pdf.setFontSize(11);
      pdf.setTextColor(148, 163, 184); // slate-400
      
      const content = "This document serves as an official executive record of Surya Bank's strategic sustainability initiatives. " +
        "It outlines the environmental, social, and governance (ESG) frameworks, climate risk mitigation strategies, " +
        "and impact performance metrics associated with our global portfolio. The contents herein are intended exclusively " +
        "for the Executive Board, key investors, and authorized regulatory personnel.\n\n" +
        "Surya Bank remains resolutely committed to pioneering enterprise-grade green finance solutions that optimize " +
        "global economic transition while adhering to strict environmental taxonomy standards. " +
        "Recent quarterly analyses indicate substantial progress toward our 2035 Net Zero milestones, " +
        "driven by stringent carbon footprint tracking, extensive green bond issuances, and robust corporate governance.\n\n" +
        "Furthermore, our ongoing investments in community social infrastructure and gender parity initiatives " +
        "have positioned the institution as a leading global entity in corporate social responsibility.\n\n" +
        "For detailed technical specifications, emission breakdowns, or further strategic inquiries, please " +
        "refer to the centralized sustainability data repositories or contact the Chief Sustainability Office.";
        
      const splitText = pdf.splitTextToSize(content, 170);
      pdf.text(splitText, 20, 125);
      
      pdf.setTextColor(16, 185, 129); // emerald-500
      pdf.setFontSize(10);
      pdf.text('Authorized by: Office of the Founder, Chairman & CEO', 20, 270);
      pdf.text('Surya Bank Global Headquarters - Sustainability Division', 20, 280);

      pdf.save(`${doc.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Failed to generate PDF. Please ensure jsPDF is available.');
    }
  };

  const handleAiSubmit = (text) => {
    if (!text.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', text }]);
    setAiQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      let response = "I've analyzed our global sustainability records. Our environmental and governance metrics are outperforming baseline targets.";
      const q = text.toLowerCase();
      if (q.includes('carbon') || q.includes('emission')) {
        response = "We have reduced Scope 1 & 2 emissions by 65% since 2020. Scope 3 emissions are down 30%, primarily due to stricter green lending criteria.";
      } else if (q.includes('diversity') || q.includes('women')) {
        response = "Women currently represent 42% of our Board of Directors and 41% of Vice Presidents globally. We are on track to hit 45% gender parity by 2027.";
      } else if (q.includes('report') || q.includes('investor')) {
        response = "I have generated an executive summary of our Q3 ESG metrics tailored for investor relations. It is now available in the Download Center.";
      } else if (q.includes('risk') || q.includes('climate')) {
        response = "Physical climate risks to our coastal real estate portfolio have been mitigated via insurance hedges. Transition risks in our energy lending book have decreased by 18% year-over-year.";
      }
      setAiChat(prev => [...prev, { role: 'ai', text: response }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Level Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-emerald-500/30 hover:border-emerald-500/60 transition-all group shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform"><Leaf size={24} /></div>
            <span className="text-3xl font-black text-white">94</span>
          </div>
          <h3 className="font-bold text-slate-300">Environmental Score</h3>
          <p className="text-xs text-slate-500 mt-2">Carbon neutrality & green financing.</p>
        </div>
        
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-blue-500/30 hover:border-blue-500/60 transition-all group shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform"><Users size={24} /></div>
            <span className="text-3xl font-black text-white">91</span>
          </div>
          <h3 className="font-bold text-slate-300">Social Score</h3>
          <p className="text-xs text-slate-500 mt-2">Diversity, equity, and inclusion (DEI).</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30 hover:border-purple-500/60 transition-all group shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform"><Scale size={24} /></div>
            <span className="text-3xl font-black text-white">98</span>
          </div>
          <h3 className="font-bold text-slate-300">Governance Score</h3>
          <p className="text-xs text-slate-500 mt-2">Ethics, risk, and board independence.</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-slate-800 hover:border-slate-600 transition-colors">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{m.label}</h4>
            <div className="flex items-end justify-between">
              <span className={`text-2xl font-black ${m.color}`}>{m.value}</span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md">{m.trend}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 truncate">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-white text-sm">Carbon Emissions Trajectory</h3>
              <p className="text-[10px] text-slate-500">Metric Tons CO2e (Scopes 1-3)</p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-1 rounded-lg">-65% vs Baseline</span>
          </div>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={carbonData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="year" stroke="#475569" strokeWidth={0.5} tickLine={false} />
                <YAxis stroke="#475569" strokeWidth={0.5} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="scope3" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Scope 3" />
                <Area type="monotone" dataKey="scope2" stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} name="Scope 2" />
                <Area type="monotone" dataKey="scope1" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Scope 1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-white text-sm">Executive Diversity Metrics</h3>
              <p className="text-[10px] text-slate-500">% Female Representation in Leadership</p>
            </div>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-1 rounded-lg">On Track: 45%</span>
          </div>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diversityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="year" stroke="#475569" strokeWidth={0.5} tickLine={false} />
                <YAxis stroke="#475569" strokeWidth={0.5} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="vp" name="Vice Presidents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="md" name="Managing Directors" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="board" name="Board of Directors" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-xl">
        <h3 className="text-xl font-serif font-bold text-white mb-8 flex items-center gap-2">
          <Globe className="text-emerald-400" /> Path to 2035 Climate Vision
        </h3>
        
        <div className="relative pl-8 md:pl-0">
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-1 bg-slate-800 md:-translate-x-1/2 rounded-full"></div>
          <div className="absolute left-[39px] md:left-1/2 top-0 h-[40%] w-1 bg-gradient-to-b from-emerald-500 to-teal-400 md:-translate-x-1/2 rounded-full"></div>
          
          <div className="space-y-12">
            {ROADMAP_STAGES.map((stage, i) => {
              const isEven = i % 2 === 0;
              const isPast = i < 2;
              const isActive = i === 2;
              return (
                <div key={i} className={`relative flex flex-col md:flex-row items-center justify-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`w-full md:w-1/2 flex ${isEven ? 'justify-start md:pl-16' : 'justify-end md:pr-16'} pl-16 md:pl-0`}>
                    <div className={`p-6 rounded-2xl border w-full max-w-sm transition-all shadow-xl ${
                      isActive ? 'bg-slate-800/80 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 
                      isPast ? 'bg-slate-900/40 border-emerald-500/20' : 
                      'bg-slate-900/40 border-slate-800'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-2xl font-black ${isActive ? 'text-emerald-400' : isPast ? 'text-emerald-400/50' : 'text-slate-600'}`}>{stage.year}</span>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                          isPast ? 'bg-slate-800 text-slate-400 border border-slate-700' : 
                          'bg-slate-950 text-slate-600 border border-slate-800'
                        }`}>{stage.status}</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1">{stage.phase}</h4>
                      <p className="text-xs text-slate-500">Owned by: <strong className="text-slate-300">{stage.owner}</strong></p>
                    </div>
                  </div>
                  
                  <div className="absolute left-10 md:left-1/2 w-8 h-8 rounded-full border-4 border-slate-900 -translate-x-1/2 flex items-center justify-center z-10 transition-colors shadow-lg shadow-black/50" style={{ backgroundColor: isActive || isPast ? '#10b981' : '#334155' }}>
                    {(isActive || isPast) && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCenters = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Center Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-slate-900/40 p-2 rounded-xl border border-slate-800 mb-6">
        {[
          { id: 'finance', icon: Leaf, label: 'Green Finance' },
          { id: 'social', icon: Heart, label: 'Social Impact' },
          { id: 'gov', icon: Scale, label: 'Governance' },
          { id: 'risk', icon: AlertTriangle, label: 'Climate Risk' }
        ].map(c => (
          <button 
            key={c.id} onClick={() => setActiveCenter(c.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeCenter === c.id 
                ? 'bg-slate-800 text-white shadow-lg border border-slate-700' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
            }`}
          >
            <c.icon size={16} className={activeCenter === c.id ? 'text-emerald-400' : ''} /> {c.label}
          </button>
        ))}
      </div>

      {activeCenter === 'finance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {['Green Bonds', 'Renewable Energy Financing', 'Sustainable Mortgages', 'Impact Investments', 'Carbon Credit Trading', 'ESG-Linked Corporate Loans'].map((item, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Leaf size={24} /></div>
              <h4 className="text-lg font-bold text-white mb-2">{item}</h4>
              <p className="text-xs text-slate-400 mb-4">Dedicated capital pools allocated for certified sustainable projects globally.</p>
              <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-4">
                <span className="text-slate-500">Portfolio Size</span>
                <span className="font-mono text-emerald-400 font-bold">${Math.floor(Math.random() * 10 + 2)}.4 Billion</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCenter === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {['Financial Inclusion', 'Women Empowerment', 'Rural Banking Access', 'STEM Education Grants', 'Community Healthcare', 'Micro-Finance Startups'].map((item, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Heart size={24} /></div>
              <h4 className="text-lg font-bold text-white mb-2">{item}</h4>
              <p className="text-xs text-slate-400 mb-4">Empowering underdeveloped communities through targeted banking solutions.</p>
              <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-4">
                <span className="text-slate-500">Lives Impacted</span>
                <span className="font-mono text-blue-400 font-bold">{Math.floor(Math.random() * 500 + 100)}k+ Beneficiaries</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCenter === 'gov' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {[
            { t: 'Board Independence', desc: '85% of board members are independent directors. Zero conflicts of interest recorded in FY25.', score: '99.9%' },
            { t: 'AI Ethics Governance', desc: 'Strict ethical guidelines and bias testing applied to all credit decision algorithms.', score: '100%' },
            { t: 'Anti-Corruption Framework', desc: 'Global rollout of zero-tolerance policy with automated transaction surveillance.', score: '99.5%' },
            { t: 'Executive Pay Linked to ESG', desc: '30% of executive variable compensation is tied directly to carbon reduction metrics.', score: 'Adopted' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex justify-between items-center hover:border-purple-500/40 transition-colors">
              <div>
                <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2"><ShieldAlert size={16} className="text-purple-400" /> {item.t}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <span className="bg-purple-500/10 text-purple-400 font-mono font-bold text-sm px-3 py-1.5 rounded-lg border border-purple-500/20 shrink-0 ml-4">{item.score}</span>
            </div>
          ))}
        </div>
      )}

      {activeCenter === 'risk' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <div className="bg-slate-900/60 border border-amber-500/30 rounded-3xl p-6 shadow-xl">
            <h4 className="font-bold text-amber-400 mb-4 flex items-center gap-2"><AlertTriangle size={20} /> Physical Climate Risks</h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-sm text-white font-bold mb-1"><span>Coastal Real Estate Portfolio</span><span className="text-red-400">High Risk</span></div>
                <p className="text-xs text-slate-500">Exposure to rising sea levels in APAC region. 80% hedged via cat-bonds.</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-sm text-white font-bold mb-1"><span>Data Center Operations</span><span className="text-amber-400">Medium Risk</span></div>
                <p className="text-xs text-slate-500">Extreme heatwaves affecting cooling costs. Migrating to nordic facilities.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-indigo-500/30 rounded-3xl p-6 shadow-xl">
            <h4 className="font-bold text-indigo-400 mb-4 flex items-center gap-2"><TrendingUp size={20} /> Transition Risks</h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-sm text-white font-bold mb-1"><span>Fossil Fuel Lending Book</span><span className="text-red-400">High Risk</span></div>
                <p className="text-xs text-slate-500">Carbon tax policy exposure. Divesting $15B by 2028.</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-sm text-white font-bold mb-1"><span>Regulatory Compliance</span><span className="text-emerald-400">Low Risk</span></div>
                <p className="text-xs text-slate-500">Ahead of SEC and EU taxonomy disclosure requirements.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMap = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] shadow-xl">
        <div className="absolute top-6 left-6 z-10">
          <h3 className="text-xl font-bold text-white mb-2">Global ESG Footprint</h3>
          <p className="text-xs text-slate-400 max-w-xs">Live tracking of sustainable branches, renewable energy hubs, and global CSR outreach programs.</p>
          
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div> Renewable Data Centers</div>
            <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-3 rounded-full bg-blue-400"></div> Major CSR Operations</div>
            <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-3 rounded-full bg-teal-400"></div> LEED Platinum Branches</div>
          </div>
        </div>

        {/* Abstract Stylized Map SVG */}
        <svg viewBox="0 0 1000 500" className="w-full max-w-4xl opacity-40 mt-10">
          <path d="M150,150 Q200,100 300,120 T500,180 T700,100 T900,150" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
          <path d="M100,250 Q250,200 400,300 T600,200 T800,350" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
          <path d="M200,400 Q350,350 500,450 T750,350 T950,400" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* Map Points */}
          <circle cx="200" cy="180" r="8" fill="#34d399" className="animate-pulse" /> {/* NY */}
          <circle cx="450" cy="150" r="10" fill="#34d399" className="animate-pulse" /> {/* London */}
          <circle cx="500" cy="200" r="6" fill="#60a5fa" /> {/* Frankfurt */}
          <circle cx="650" cy="280" r="12" fill="#34d399" className="animate-pulse" /> {/* India */}
          <circle cx="750" cy="220" r="8" fill="#2dd4bf" /> {/* Singapore */}
          <circle cx="850" cy="180" r="6" fill="#60a5fa" /> {/* Tokyo */}
          <circle cx="300" cy="350" r="10" fill="#60a5fa" /> {/* Brazil */}
          <circle cx="550" cy="380" r="8" fill="#2dd4bf" /> {/* South Africa */}
          
          {/* Connectivity lines */}
          <line x1="450" y1="150" x2="650" y2="280" stroke="#34d399" strokeWidth="1" opacity="0.5" />
          <line x1="200" y1="180" x2="450" y2="150" stroke="#34d399" strokeWidth="1" opacity="0.5" />
          <line x1="650" y1="280" x2="750" y2="220" stroke="#2dd4bf" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
    </div>
  );

  const renderAiAssistant = () => (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Leaf size={200} />
      </div>
      <div className="p-6 bg-emerald-500/10 border-b border-emerald-500/20 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl"><Leaf className="text-emerald-400" size={24} /></div>
          <div>
            <h3 className="font-bold text-emerald-400 text-lg">Sustainability Intelligence AI</h3>
            <p className="text-xs text-emerald-400/60">Powered by Surya Enterprise AI</p>
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Leaf className="text-emerald-400" size={32} />
            </div>
            <div className="max-w-md">
              <h4 className="text-lg font-bold text-white mb-2">How can I assist your ESG analysis?</h4>
              <p className="text-xs text-slate-400">Ask me to summarize our carbon footprint, analyze executive diversity, generate board reports, or explain climate risks.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg mt-4">
              {['"Summarize our Carbon Reduction"', '"How is our executive diversity?"', '"Explain our climate risks"', '"Generate an investor ESG report"'].map(prompt => (
                <button 
                  key={prompt} onClick={() => handleAiSubmit(prompt.replace(/"/g, ''))}
                  className="px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-emerald-600/20 text-xs text-slate-300 border border-slate-700 hover:border-emerald-500/50 transition-all text-left"
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
                <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-sm shadow-lg' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm shadow-md'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiTyping && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm flex gap-2 items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
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
            placeholder="Query the ESG intelligence engine..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-5 pr-12 py-4 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button 
            onClick={() => handleAiSubmit(aiQuery)} disabled={isAiTyping || !aiQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderDownloads = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {[
        { title: 'Annual Corporate Sustainability Report', type: 'PDF Report', size: '14.2 MB', icon: FileText, color: 'text-emerald-400' },
        { title: 'Climate Risk & TCFD Disclosures', type: 'Regulatory PDF', size: '8.5 MB', icon: ShieldAlert, color: 'text-amber-400' },
        { title: 'Green Finance Framework', type: 'Whitepaper', size: '5.1 MB', icon: Leaf, color: 'text-teal-400' },
        { title: 'Investor ESG Presentation Deck', type: 'PPTX Deck', size: '22.4 MB', icon: BarChart4, color: 'text-[#D4AF37]' },
        { title: 'Global Diversity & Inclusion Metrics', type: 'Excel Data', size: '3.8 MB', icon: Users, color: 'text-blue-400' }
      ].map((doc, i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:bg-slate-800/80 transition-colors group cursor-pointer shadow-lg hover:shadow-xl">
          <div className="flex justify-between items-start mb-8">
            <div className={`p-4 bg-slate-950 rounded-2xl ${doc.color} group-hover:scale-110 transition-transform shadow-inner`}><doc.icon size={28} /></div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded-md">{doc.size}</span>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg leading-tight mb-2">{doc.title}</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{doc.type}</p>
          </div>
          <button 
            onClick={() => handleDownload(doc)}
            className="mt-8 w-full py-3 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-emerald-500 shadow-md"
          >
            <Download size={16} /> Secure Download
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
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-700 p-[2px] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <Leaf className="text-[#D4AF37]" size={30} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D4AF37] tracking-tight">
                ESG Intelligence Center
              </h1>
              <p className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mt-2">
                Executive Sustainability Dashboard
              </p>
            </div>
          </div>
          
          <button onClick={() => setActiveTab('ai')} className="px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/50 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-2">
            <Sparkles size={18} /> Ask ESG AI
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
        {activeTab === 'strategy' && renderRoadmap()}
        {activeTab === 'centers' && renderCenters()}
        {activeTab === 'map' && renderMap()}
        {activeTab === 'ai' && renderAiAssistant()}
        {activeTab === 'downloads' && renderDownloads()}
      </div>
      
    </div>
  );
};

export default CeoESG;
