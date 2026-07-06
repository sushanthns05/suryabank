import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Download, CheckCircle, Play, Shield, Globe, TrendingUp, Cpu, 
  Award, FileText, Share2, Printer, Bookmark, Search, Type, 
  Moon, Sun, ZoomIn, ZoomOut, Maximize, Settings, Bot, MessageSquare, X,
  ChevronRight, ArrowRight, ShieldCheck, FileCheck, CheckCircle2, Lock
} from 'lucide-react';
import { useCeoAuth } from '../../context/CeoAuthContext';
import { generatePdfLetter } from './CeoMockData';
import EditableText from '../../components/ceo/cms/EditableText';
import EditableRichText from '../../components/ceo/cms/EditableRichText';
import EditableImage from '../../components/ceo/cms/EditableImage';

// --- MOCK DATA ---
const SECTIONS = [
  { id: 'introduction', title: 'Executive Introduction' },
  { id: 'financials', title: 'Financial Performance' },
  { id: 'digital', title: 'Digital Banking & AI' },
  { id: 'cyber', title: 'Cyber Security' },
  { id: 'esg', title: 'ESG & Sustainability' },
  { id: 'vision', title: 'Future Vision 2035' },
];

const METRICS = [
  { label: 'Revenue Growth', value: '+17.4%', icon: TrendingUp },
  { label: 'Active Customers', value: '25.2M', icon: Globe },
  { label: 'Digital Txn Rate', value: '94%', icon: Cpu },
  { label: 'ESG Investment', value: '$5.2B', icon: Award },
];

const TIMELINE = [
  { year: '2015', title: 'Foundation', desc: 'Surya Bank established with a vision for digital-first banking.' },
  { year: '2020', title: 'Digital Transformation', desc: 'Complete migration to cloud-native core banking infrastructure.' },
  { year: '2023', title: 'Global Expansion', desc: 'Opened operational hubs in Singapore, London, and New York.' },
  { year: '2025', title: 'AI Integration', desc: 'Deployed zero-trust autonomous AI systems across all major workflows.' },
];

const CeoMessage = () => {
  const { user } = useCeoAuth();
  
  // Reading Experience State
  const [activeSection, setActiveSection] = useState('introduction');
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(true); // Premium dark by default
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState([
    { role: 'assistant', content: 'Hello. I am the Executive AI Assistant for the Chairman\'s Office. How can I help you analyze this document?' }
  ]);
  
  // Progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [readPercent, setReadPercent] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setReadPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

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

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', content: aiQuery }]);
    const query = aiQuery;
    setAiQuery('');
    
    setTimeout(() => {
      setAiChat(prev => [...prev, { 
        role: 'assistant', 
        content: `Analyzing your request regarding "${query}" against the Chairman's 2025/2026 Address... The document highlights a 17.4% revenue growth and massive investments in Post-Quantum Cryptography.` 
      }]);
    }, 1500);
  };

  const handlePrint = () => window.print();
  const handleDownload = () => {
    const fullLetterText = `Dear Shareholders, Partners, and Friends,

FY2025 has been a year of remarkable transformation and unprecedented capital strength for Surya Bank. In the face of dynamic macroeconomic conditions, we have not only weathered global volatility but have emerged as the definitive leader in enterprise-grade financial technology.

We have expanded our active customer network to 25 million and committed over $5 Billion in sustainable climate-focused assets. Our core operations are now backed by advanced AI intelligence and zero-trust transaction structures, ensuring that every interaction within our ecosystem is frictionless and cryptographically impenetrable.

FINANCIAL PERFORMANCE
In the past fiscal year, Surya Bank reported record gross revenues of $4.8 Billion, representing a 17.4% growth year-over-year. Our net profit margins expanded to 31.2%, supported directly by the automated efficiencies of our proprietary AI risk systems.

Our capital reserves remain Fortress-level. We are positioned not just to survive economic downturns, but to actively acquire market share during them. The bank's Common Equity Tier 1 (CET1) capital ratio stands at a solid 16.4%, and our liquidity coverage ratio is maintained at 185%, far exceeding international Basel III compliance limits. We have continuously delivered robust dividend distributions to our equity partners, maintaining an uninterrupted streak for 12 consecutive quarters.

DIGITAL BANKING & AI
Our transition to a fully AI-driven core architecture has eliminated over 4.2 million hours of manual processing time annually. This has directly translated into superior customer experiences, with mortgage approvals now averaging under 4 minutes.

CYBER SECURITY & TECHNOLOGICAL SOVEREIGNTY
Security is the foundation of digital trust. Through our technology centers, we have completed the initial migration phase of core ledgers to lattice-based post-quantum cryptography. In an era where quantum computing threats are emerging, Surya Bank depositors can rest assured that their accounts are protected by next-generation cryptographic standards.

We will continue to build, expand, and safeguard the interests of our stakeholders with unwavering integrity. Thank you for your continued trust and partnership in this journey.`;

    generatePdfLetter("Chairman's Annual Shareholder Address", fullLetterText, user?.email);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? (isHighContrast ? 'bg-black text-white' : 'bg-slate-950 text-slate-300') : 'bg-[#F8FAFC] text-slate-900'} pb-32 font-sans relative`} style={{ fontSize: `${fontSize}px` }}>
      
      {/* Sticky Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-ceo-gold z-50 origin-left" style={{ scaleX }} />
      
      {/* Tools & Accessibility Bar */}
      <div className={`sticky top-0 z-40 backdrop-blur-md border-b ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'} px-6 py-3 flex flex-wrap justify-between items-center gap-4 text-sm`}>
        <div className="flex items-center gap-6">
          <span className="font-bold tracking-widest uppercase text-[10px] flex items-center gap-2">
            <ShieldCheck size={14} className="text-ceo-gold" /> Office of the Chairman
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 size={12} /> Verified Publication
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* A11y Controls */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'}`}>
            <button onClick={() => setFontSize(f => Math.max(12, f - 1))} className="p-1 hover:text-ceo-gold"><ZoomOut size={14} /></button>
            <button onClick={() => setFontSize(f => Math.min(24, f + 1))} className="p-1 hover:text-ceo-gold"><ZoomIn size={14} /></button>
            <div className="w-px h-4 bg-slate-500 mx-1" />
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-1 hover:text-ceo-gold">
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
          
          {/* Action Tools */}
          <button onClick={handlePrint} className="p-2 hover:text-ceo-gold transition-colors"><Printer size={16} /></button>
          <button onClick={handleDownload} className="p-2 hover:text-ceo-gold transition-colors"><Download size={16} /></button>
          <button className="p-2 hover:text-ceo-gold transition-colors"><Share2 size={16} /></button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-16 flex flex-col lg:flex-row gap-12 relative z-10">
        
        {/* LEFT SIDEBAR - Table of Contents */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Contents</p>
              <nav className="space-y-1 border-l border-slate-800 ml-2 pl-4">
                {SECTIONS.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      const el = document.getElementById(sec.id);
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className={`block w-full text-left py-2 text-sm transition-all duration-300 relative ${
                      activeSection === sec.id 
                        ? 'text-ceo-gold font-bold translate-x-2' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {activeSection === sec.id && (
                      <span className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2 h-2 bg-ceo-gold rounded-full" />
                    )}
                    {sec.title}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Document Info</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">ID</span><span className="font-mono">SBC-2026-04</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Read Time</span><span>12 mins</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Progress</span><span>{readPercent}%</span></div>
                <div className="pt-2 mt-2 border-t border-slate-800 flex items-center gap-2 text-emerald-500">
                  <Lock size={12} /> SHA-256 Secured
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN DOCUMENT BODY */}
        <div className="flex-1 max-w-3xl pb-32">
          
          {/* HERO SECTION */}
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 relative"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ceo-gold/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ceo-gold/30 bg-ceo-gold/5 text-ceo-gold text-[10px] font-bold uppercase tracking-widest mb-6">
              <Award size={14} /> Annual Shareholder Address 2025–2026
            </div>
            
            <EditableText 
              as="h1"
              collectionName="cms_pages" 
              documentId="ceo_message" 
              fieldKey="hero_title"
              fallbackText="Engineering the Future of Global Finance."
              className="text-5xl lg:text-7xl font-serif font-bold leading-[1.1] mb-6 tracking-tight block w-full"
            />
            
            <EditableText 
              as="p"
              collectionName="cms_pages" 
              documentId="ceo_message" 
              fieldKey="hero_subtitle"
              fallbackText="A comprehensive review of our financial performance, quantum-safe security initiatives, and unwavering commitment to sustainable growth."
              className={`text-xl leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} max-w-2xl block w-full`}
            />
          </motion.header>

          {/* EXECUTIVE PROFILE PANEL */}
          <div className={`p-8 lg:p-10 rounded-3xl mb-24 border shadow-2xl flex flex-col md:flex-row gap-8 items-center ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-40 h-40 shrink-0 rounded-full overflow-hidden border-2 border-ceo-gold p-1 bg-slate-950 relative">
              <img src="/sns.jpg" alt="Chairman Portrait" className="w-full h-full object-cover rounded-full relative z-10 grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <EditableText 
                as="h2"
                collectionName="cms_pages" 
                documentId="ceo_message" 
                fieldKey="profile_name"
                fallbackText="Sushanth NS"
                className="text-3xl font-serif font-bold mb-1 block w-full"
              />
              <EditableText 
                as="p"
                collectionName="cms_pages" 
                documentId="ceo_message" 
                fieldKey="profile_title"
                fallbackText="Founder, Chairman & Chief Executive Officer"
                className="text-ceo-gold font-bold uppercase tracking-widest text-xs mb-4 block w-full"
              />
              <EditableText 
                as="p"
                collectionName="cms_pages" 
                documentId="ceo_message" 
                fieldKey="profile_quote"
                fallbackText='"Our mandate is not merely to participate in the financial ecosystem, but to architect its ultimate, most secure iteration. Trust is the currency of the future, and we are its primary custodians."'
                className={`text-sm leading-relaxed font-serif italic ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-6 block w-full`}
              />
              <img src="/signature.png" alt="Digital Signature" className="h-12 invert opacity-80 mix-blend-screen" />
            </div>
          </div>

          {/* DOCUMENT CONTENT */}
          <article className="space-y-32">
            
            {/* SECTION: INTRODUCTION */}
            <section id="introduction">
              <h2 className="text-sm font-bold uppercase tracking-widest text-ceo-gold mb-6 flex items-center gap-4">
                <span className="w-8 h-px bg-ceo-gold"></span> Executive Introduction
              </h2>
              <EditableRichText 
                collectionName="cms_pages"
                documentId="ceo_message"
                fieldKey="intro_body"
                fallbackHtml={`<p class="text-xl leading-relaxed font-light ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}"><span class="float-left text-7xl font-serif text-ceo-gold leading-none pr-4 pt-2">F</span>Y2025 has been a year of remarkable transformation and unprecedented capital strength for Surya Bank. In the face of dynamic macroeconomic conditions, we have not only weathered global volatility but have emerged as the definitive leader in enterprise-grade financial technology.</p><p class="mt-6 leading-relaxed">We have expanded our active customer network to 25 million and committed over $5 Billion in sustainable climate-focused assets. Our core operations are now backed by advanced AI intelligence and zero-trust transaction structures, ensuring that every interaction within our ecosystem is frictionless and cryptographically impenetrable.</p>`}
              />
            </section>

            {/* HIGHLIGHT: STRATEGIC ACHIEVEMENTS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {METRICS.map((metric, i) => (
                <div key={i} className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <metric.icon size={24} className="mx-auto mb-3 text-ceo-gold" />
                  <div className="text-3xl font-bold font-serif text-white mb-1">{metric.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* SECTION: FINANCIALS */}
            <section id="financials">
              <h2 className="text-sm font-bold uppercase tracking-widest text-ceo-gold mb-6 flex items-center gap-4">
                <span className="w-8 h-px bg-ceo-gold"></span> Financial Performance
              </h2>
              <EditableRichText 
                collectionName="cms_pages"
                documentId="ceo_message"
                fieldKey="financials_body"
                fallbackHtml={`<p>In the past fiscal year, Surya Bank reported record gross revenues of <strong>$4.8 Billion</strong>, representing a 17.4% growth year-over-year. Our net profit margins expanded to 31.2%, supported directly by the automated efficiencies of our proprietary AI risk systems.</p><blockquote class="border-l-4 border-ceo-gold pl-8 py-4 my-12 italic text-3xl font-serif leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} relative"><div class="absolute top-0 left-4 text-7xl text-ceo-gold/20 font-serif leading-none">"</div>Our capital reserves remain Fortress-level. We are positioned not just to survive economic downturns, but to actively acquire market share during them.</blockquote><p>The bank's Common Equity Tier 1 (CET1) capital ratio stands at a solid 16.4%, and our liquidity coverage ratio is maintained at 185%, far exceeding international Basel III compliance limits. We have continuously delivered robust dividend distributions to our equity partners, maintaining an uninterrupted streak for 12 consecutive quarters.</p>`}
                className="leading-relaxed"
              />
            </section>

            {/* VIDEO ADDRESS */}
            <section id="digital">
              <h2 className="text-sm font-bold uppercase tracking-widest text-ceo-gold mb-6 flex items-center gap-4">
                <span className="w-8 h-px bg-ceo-gold"></span> Digital Banking & AI
              </h2>
              <div className={`rounded-3xl border overflow-hidden shadow-2xl relative mb-12 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100'}`}>
                <div className="aspect-video relative flex items-center justify-center group cursor-pointer">
                  <img src="/sns.jpg" alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover object-top opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="relative z-10 w-20 h-20 rounded-full bg-ceo-gold/90 text-slate-900 flex items-center justify-center pl-2 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_50px_rgba(212,175,55,0.4)]">
                    <Play size={32} />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                      <span className="px-2 py-1 rounded bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Official Video Address</span>
                      <h3 className="text-xl font-bold text-white">Q4 Earnings & Technology Strategy Briefing</h3>
                    </div>
                    <span className="text-sm font-mono text-white bg-black/60 px-2 py-1 rounded">45:20</span>
                  </div>
                </div>
              </div>
              <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                Our transition to a fully AI-driven core architecture has eliminated over 4.2 million hours of manual processing time annually. This has directly translated into superior customer experiences, with mortgage approvals now averaging under 4 minutes.
              </p>
            </section>

            {/* SECTION: CYBER */}
            <section id="cyber">
              <h2 className="text-sm font-bold uppercase tracking-widest text-ceo-gold mb-6 flex items-center gap-4">
                <span className="w-8 h-px bg-ceo-gold"></span> Cyber Security
              </h2>
              <EditableRichText 
                collectionName="cms_pages"
                documentId="ceo_message"
                fieldKey="cyber_body"
                fallbackHtml={`<p>Security is the foundation of digital trust. Through our technology centers, we have completed the initial migration phase of core ledgers to lattice-based post-quantum cryptography. In an era where quantum computing threats are emerging, Surya Bank depositors can rest assured that their accounts are protected by next-generation cryptographic standards.</p>`}
                className="leading-relaxed"
              />
            </section>
            
            {/* TIMELINE */}
            <section id="vision">
              <div className="py-8">
                <h3 className="font-serif text-3xl font-bold mb-16 text-center">Chronology of Expansion</h3>
                <div className="relative border-l border-slate-800 ml-4 md:ml-12 space-y-16">
                  {TIMELINE.map((item, i) => (
                    <div key={i} className="relative pl-12 group">
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 group-hover:bg-ceo-gold group-hover:border-ceo-gold transition-colors shadow-[0_0_15px_rgba(212,175,55,0)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                      <span className="text-ceo-gold font-mono font-bold text-xl mb-2 block">{item.year}</span>
                      <h4 className="text-2xl font-serif font-bold mb-3">{item.title}</h4>
                      <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FOOTER AREA */}
            <footer className="pt-24 pb-10 border-t border-slate-800 mt-24">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-white mb-2">Sincerely,</h3>
                  <img src="/signature.png" alt="Digital Signature" className="h-16 invert opacity-80 mix-blend-screen mb-4 mt-2" />
                  <h4 className="text-xl font-serif font-bold text-white">Sushanth NS</h4>
                  <p className="text-xs text-ceo-gold font-bold uppercase tracking-widest mt-1">Founder & Chairman</p>
                  <p className="text-xs text-slate-500 mt-6 max-w-sm leading-relaxed">
                    This document is cryptographically verified and forms the official annual communication from the Office of the Chairman. For investor relations, please contact ir@suryabank.com.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 w-36 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <FileCheck size={28} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest">Verified<br/>Publication</span>
                  </div>
                  <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 w-36 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <Shield size={28} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest">Tamper<br/>Protected</span>
                  </div>
                </div>
              </div>
            </footer>

          </article>
        </div>
      </div>

      {/* AI EXECUTIVE ASSISTANT (FLOATING) */}
      <div className="fixed bottom-[100px] right-6 z-50">
        <AnimatePresence>
          {isAiOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ceo-gold/10 flex items-center justify-center text-ceo-gold">
                    <Bot size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">Executive Assistant</span>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
                <button onClick={() => setIsAiOpen(false)} className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"><X size={16} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm font-sans">
                {aiChat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-ceo-gold text-slate-900 font-medium rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700 leading-relaxed'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-slate-950 border-t border-slate-800">
                <form onSubmit={handleAiSubmit} className="relative">
                  <input 
                    type="text" 
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ask about financials, ESG, etc..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-ceo-gold transition-colors"
                  />
                  <button type="submit" className="absolute right-2 top-2 p-1.5 rounded-lg bg-ceo-gold text-slate-900 hover:bg-white transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsAiOpen(!isAiOpen)}
          className="w-16 h-16 rounded-full bg-ceo-gold text-slate-900 flex items-center justify-center shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform"
        >
          {isAiOpen ? <X size={24} /> : <MessageSquare size={24} fill="currentColor" />}
        </button>
      </div>

    </div>
  );
};

export default CeoMessage;
