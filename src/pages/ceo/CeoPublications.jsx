import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Eye, X, BookOpen, Search, Filter, 
  BarChart2, Clock, Globe, Award, Share2, Bookmark,
  ChevronRight, ArrowRight, ShieldCheck, FileCheck, CheckCircle2, Lock,
  TrendingUp, DownloadCloud, Users, Layers, Tag, Calendar
} from 'lucide-react';
import { advancedPublications, libraryKPIs } from './CeoPublicationsData';
import { useCeoAuth } from '../../context/CeoAuthContext';
import { useCeoCMS } from '../../context/CeoCMSContext';
import { generatePdfLetter } from './CeoMockData';

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ value, label, icon: Icon, prefix = '', suffix = '' }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur hover:border-ceo-gold/40 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</span>
        <Icon size={16} className="text-ceo-gold opacity-50 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-2xl md:text-3xl font-serif font-bold text-white">
        {prefix}{value}{suffix}
      </div>
    </div>
  );
};

const CeoPublications = () => {
  const { user, role } = useCeoAuth();
  const { isEditMode } = useCeoCMS();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTopic, setActiveTopic] = useState('All');
  const [activeAudience, setActiveAudience] = useState('All');
  
  // AI Research Assistant State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState([
    { role: 'assistant', content: 'I am the Executive AI Research Assistant. I can summarize this document, explain technical concepts, or find related publications. How can I help?' }
  ]);

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if(!aiQuery.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', content: aiQuery }]);
    setAiQuery('');
    setTimeout(() => {
      setAiChat(prev => [...prev, { role: 'assistant', content: 'Based on the current document context, the integration of post-quantum cryptography is prioritized to mitigate risks from polynomial-time quantum algorithms against standard RSA encryption.' }]);
    }, 1000);
  };

  // CMS State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState(null);

  // Filter Options Extraction
  const categories = ['All', ...new Set(advancedPublications.map(p => p.category))];
  const topics = ['All', ...new Set(advancedPublications.map(p => p.topic))];
  const audiences = ['All', ...new Set(advancedPublications.flatMap(p => p.audience.split(', ')))];

  // Featured Pub
  const featuredPub = advancedPublications[0];

  // Filtering Logic
  const filteredPubs = advancedPublications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pub.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pub.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = activeCategory === 'All' || pub.category === activeCategory;
    const matchesTopic = activeTopic === 'All' || pub.topic === activeTopic;
    const matchesAudience = activeAudience === 'All' || pub.audience.includes(activeAudience);
    return matchesSearch && matchesCat && matchesTopic && matchesAudience;
  });

  const handleDownload = (pub) => {
    generatePdfLetter(pub.title, pub.content.replace(/<[^>]+>/g, ''), user?.email);
  };

  return (
    <div className="min-h-screen pb-32 animate-in fade-in duration-500">
      
      {/* 1. HEADER & EXECUTIVE DASHBOARD (KPIs) */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold flex items-center gap-2 mb-2">
              <ShieldCheck size={14} /> Executive Research Library
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">
              Knowledge Platform
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Enterprise repository for corporate filings, macroeconomic research, cybersecurity whitepapers, and strategic frameworks.
            </p>
          </div>
          {isEditMode && role === 'CEO' && (
            <button 
              onClick={() => { setEditingPub(null); setIsUploadModalOpen(true); }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-xl transition-all"
            >
              + Upload Publication
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <AnimatedCounter value={libraryKPIs.totalPublications} label="Total Publications" icon={BookOpen} />
          <AnimatedCounter value={libraryKPIs.totalDownloads} label="Total Downloads" icon={DownloadCloud} />
          <AnimatedCounter value={libraryKPIs.readingHoursThisYear} label="Reading Hours (YTD)" icon={Clock} />
          <AnimatedCounter value={libraryKPIs.totalCitations} label="Citations" icon={Award} />
          <AnimatedCounter value={libraryKPIs.countriesAccessing} label="Countries Accessing" icon={Globe} />
        </div>
      </section>

      {/* 2. FEATURED PUBLICATION HERO */}
      <section className="mb-16">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 p-8 lg:p-12 shadow-2xl flex flex-col md:flex-row gap-12 items-center">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ceo-gold/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex-1 space-y-6 relative z-10">
            <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest">
              <span className="px-2 py-1 bg-ceo-gold/10 text-ceo-gold rounded border border-ceo-gold/20 flex items-center gap-1">
                <Star size={12} /> Featured
              </span>
              <span className="text-slate-500 flex items-center gap-1"><Calendar size={12}/> {featuredPub.date}</span>
              <span className="text-slate-500 flex items-center gap-1"><Clock size={12}/> {featuredPub.readTime}</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">
              {featuredPub.title}
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              {featuredPub.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-slate-400">AV</div>
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-slate-400">RC</div>
              </div>
              <div className="text-xs text-slate-400">
                <span className="font-bold text-white">{featuredPub.author}</span><br/>
                {featuredPub.department}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setViewingPub(featuredPub)}
                className="px-6 py-3 bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold rounded-xl flex items-center gap-2 transition-transform hover:-translate-y-0.5"
              >
                <Eye size={16} /> Open Interactive Reader
              </button>
              <button 
                onClick={() => handleDownload(featuredPub)}
                className="p-3 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white rounded-xl transition-colors"
              >
                <Download size={16} />
              </button>
              <button className="p-3 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white rounded-xl transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/3 shrink-0 perspective-1000">
            <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 rounded-lg shadow-2xl p-6 flex flex-col transform rotate-y-[-10deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-0">
              <div className="h-2 w-12 bg-ceo-gold mb-4" />
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-2">Surya Bank Labs</div>
              <h3 className="text-lg font-serif text-white font-bold leading-tight mb-auto">{featuredPub.title}</h3>
              <div className="text-xs text-slate-500 font-mono mt-8 border-t border-slate-800 pt-4">
                DOC_REF: {featuredPub.id} <br/>
                CLASSIFICATION: RESTRICTED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ADVANCED SEARCH & GRID */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sticky Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-ceo-gold transition-colors"
            />
          </div>

          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-6">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-4">
              <Filter size={16} className="text-ceo-gold" /> Advanced Filters
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Document Type</label>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left text-xs px-3 py-2 rounded-lg transition-colors ${activeCategory === cat ? 'bg-ceo-gold/10 text-ceo-gold border border-ceo-gold/20' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Topic</label>
              <select 
                value={activeTopic} 
                onChange={(e) => setActiveTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
              </select>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Target Audience</label>
              <select 
                value={activeAudience} 
                onChange={(e) => setActiveAudience(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                {audiences.map(aud => <option key={aud} value={aud}>{aud}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-300">Showing {filteredPubs.length} Results</span>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              Sort by: <select className="bg-transparent border-none text-white focus:outline-none"><option>Newest First</option><option>Most Cited</option></select>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredPubs.map((pub) => (
              <motion.div 
                layout
                key={pub.id}
                className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-ceo-gold/40 transition-all shadow-lg flex flex-col justify-between group backdrop-blur"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span className="text-ceo-gold bg-ceo-gold/10 px-2 py-0.5 rounded border border-ceo-gold/20 flex items-center gap-1">
                      <Layers size={10} /> {pub.category}
                    </span>
                    <span className="flex items-center gap-1"><Clock size={10}/> {pub.readTime}</span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-white group-hover:text-ceo-gold transition-colors line-clamp-2 leading-tight">
                    {pub.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {pub.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {pub.tags.slice(0,3).map(tag => (
                      <span key={tag} className="text-[9px] px-2 py-1 rounded-md bg-slate-800 text-slate-400 flex items-center gap-1">
                        <Tag size={8}/> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">Author: <span className="text-slate-300">{pub.author}</span></span>
                    <span className="text-[10px] text-slate-500 block">Views: {pub.analytics.views.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {isEditMode && role === 'CEO' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingPub(pub); setIsUploadModalOpen(true); }}
                        className="w-8 h-8 rounded-full bg-ceo-gold text-ceo-navy flex items-center justify-center transition-colors shadow-lg animate-pulse"
                        title="Edit Publication"
                      >
                        <Tag size={14} /> {/* Using Tag as a generic edit icon since Pencil isn't imported */}
                      </button>
                    )}
                    <button
                      onClick={() => setViewingPub(pub)}
                      className="w-8 h-8 rounded-full bg-slate-800 hover:bg-ceo-gold text-white hover:text-ceo-navy flex items-center justify-center transition-colors shadow-lg"
                      title="Open Interactive Reader"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDownload(pub)}
                      className="w-8 h-8 rounded-full bg-slate-800 hover:bg-ceo-gold text-white hover:text-ceo-navy flex items-center justify-center transition-colors shadow-lg"
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredPubs.length === 0 && (
            <div className="py-24 text-center border border-dashed border-slate-800 rounded-3xl">
              <Search className="mx-auto text-slate-600 mb-4" size={32} />
              <h3 className="text-white font-bold mb-2">No publications found</h3>
              <p className="text-sm text-slate-400">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. INTERACTIVE DOCUMENT READER MODAL */}
      <AnimatePresence>
        {viewingPub && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed inset-0 z-[10000] flex ${readerTheme === 'dark' ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}
          >
            {/* Top Toolbar */}
            <div className={`absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 border-b z-50 ${readerTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <button onClick={() => setViewingPub(null)} className="flex items-center gap-2 hover:text-ceo-gold font-bold text-sm transition-colors">
                  <ArrowRight size={16} className="rotate-180" /> Back to Library
                </button>
                <div className="h-6 w-px bg-slate-500 mx-2" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold">{viewingPub.category}</span>
                <span className="font-serif font-bold truncate max-w-sm">{viewingPub.title}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-700 bg-slate-800/50">
                  <button onClick={() => setReaderZoom(Math.max(50, readerZoom - 10))} className="p-1 hover:text-ceo-gold"><Search size={14} className="opacity-50" /></button>
                  <span className="text-xs font-mono w-12 text-center">{readerZoom}%</span>
                  <button onClick={() => setReaderZoom(Math.min(200, readerZoom + 10))} className="p-1 hover:text-ceo-gold"><Search size={14} /></button>
                </div>
                <button onClick={() => setReaderTheme(readerTheme === 'dark' ? 'light' : 'dark')} className="p-2 hover:text-ceo-gold rounded-lg transition-colors">
                  <Globe size={16} />
                </button>
                <button onClick={() => handleDownload(viewingPub)} className="p-2 hover:text-ceo-gold rounded-lg transition-colors">
                  <Download size={16} />
                </button>
                <button onClick={() => setIsAiOpen(!isAiOpen)} className={`p-2 rounded-lg border transition-colors flex items-center gap-2 ${isAiOpen ? 'bg-ceo-gold text-ceo-navy border-ceo-gold' : 'hover:text-ceo-gold border-transparent'}`}>
                  <BookOpen size={16} /> <span className="text-xs font-bold">AI Assistant</span>
                </button>
              </div>
            </div>

            {/* Reader Layout */}
            <div className="flex w-full pt-16 h-full overflow-hidden">
              
              {/* Left TOC Sidebar */}
              <div className={`w-64 shrink-0 border-r overflow-y-auto p-6 ${readerTheme === 'dark' ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-100/50'}`}>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-6">Contents</h4>
                <nav className="space-y-4 text-sm font-semibold">
                  <a href="#" className="block text-ceo-gold">1. Abstract & Introduction</a>
                  <a href="#" className="block hover:text-ceo-gold transition-colors">2. Methodology</a>
                  <a href="#" className="block hover:text-ceo-gold transition-colors">3. Key Findings</a>
                  <a href="#" className="block hover:text-ceo-gold transition-colors">4. Strategic Implications</a>
                  <a href="#" className="block hover:text-ceo-gold transition-colors">5. Conclusion</a>
                </nav>

                <div className="mt-12 pt-6 border-t border-slate-700/50 space-y-4 text-xs">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Document Info</h4>
                  <div className="flex justify-between"><span className="text-slate-500">Author</span><span>{viewingPub.author}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Date</span><span>{viewingPub.date}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Version</span><span className="font-mono">{viewingPub.version}</span></div>
                  <div className="flex justify-between text-emerald-500"><span className="flex items-center gap-1"><Lock size={10}/> Status</span><span>{viewingPub.status}</span></div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto p-12 scroll-smooth">
                <div 
                  className={`max-w-3xl mx-auto prose ${readerTheme === 'dark' ? 'prose-invert' : ''}`}
                  style={{ fontSize: `${readerZoom}%` }}
                  dangerouslySetInnerHTML={{ __html: viewingPub.content }}
                />
              </div>

              {/* Sliding AI Panel */}
              <AnimatePresence>
                {isAiOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 400, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className={`shrink-0 border-l flex flex-col ${readerTheme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
                  >
                    <div className={`p-4 border-b flex justify-between items-center ${readerTheme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-ceo-gold/20 flex items-center justify-center text-ceo-gold"><BookOpen size={12}/></div>
                        <span className="font-bold text-sm">Research Assistant</span>
                      </div>
                      <button onClick={() => setIsAiOpen(false)} className="hover:text-ceo-gold"><X size={16}/></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                      {aiChat.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-ceo-gold text-ceo-navy font-medium rounded-tr-sm' : (readerTheme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-800') + ' rounded-tl-sm'}`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={`p-4 border-t ${readerTheme === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
                      <form onSubmit={handleAiSubmit} className="relative">
                        <input 
                          type="text" 
                          value={aiQuery}
                          onChange={(e) => setAiQuery(e.target.value)}
                          placeholder="Ask about this document..."
                          className={`w-full border rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-ceo-gold ${readerTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                        />
                        <button type="submit" className="absolute right-2 top-2 p-1.5 rounded-lg bg-ceo-gold text-slate-900 hover:bg-yellow-400 transition-colors">
                          <ArrowRight size={16} />
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. CMS UPLOAD / EDIT MODAL */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <h3 className="text-2xl font-serif font-bold text-white">
                  {editingPub ? 'Edit Publication Metadata' : 'Upload New Publication'}
                </h3>
                <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Document Title</label>
                    <input type="text" defaultValue={editingPub?.title || ''} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-ceo-gold" placeholder="Enter title" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Author / Department</label>
                    <input type="text" defaultValue={editingPub?.author || ''} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-ceo-gold" placeholder="e.g. Risk Management" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                    <select defaultValue={editingPub?.category || 'Whitepapers'} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-ceo-gold">
                      {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workflow Status</label>
                    <select defaultValue={editingPub?.status || 'Draft'} className="w-full bg-slate-950 border border-ceo-gold rounded-lg p-3 text-ceo-gold font-bold focus:outline-none">
                      <option value="Draft">Draft</option>
                      <option value="Compliance Review">Compliance Review</option>
                      <option value="CEO Approval">Pending CEO Approval</option>
                      <option value="Published">Published (Public)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Executive Summary</label>
                  <textarea defaultValue={editingPub?.summary || ''} rows={4} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-ceo-gold" placeholder="Brief summary of the publication..." />
                </div>

                {!editingPub && (
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-950 hover:bg-slate-900 transition-colors cursor-pointer">
                    <DownloadCloud size={48} className="text-slate-500 mb-4" />
                    <p className="text-white font-bold mb-1">Drag and drop PDF or DOCX</p>
                    <p className="text-xs text-slate-500">or click to browse local files</p>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
                  <button onClick={() => setIsUploadModalOpen(false)} className="px-6 py-3 text-slate-300 hover:text-white font-bold transition-colors">Cancel</button>
                  <button onClick={() => setIsUploadModalOpen(false)} className="px-6 py-3 bg-ceo-gold hover:bg-yellow-400 text-ceo-navy font-bold rounded-xl transition-colors">
                    {editingPub ? 'Save Changes' : 'Upload to Repository'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CeoPublications;

// Placeholder for Star icon used above
const Star = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
