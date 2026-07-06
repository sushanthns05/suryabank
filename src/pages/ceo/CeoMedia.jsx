import React, { useState, useEffect } from 'react';
import { 
  Search, Play, Volume2, Video, FileText, Download, AudioLines,
  TrendingUp, Globe, Newspaper, Radio, Mic2, FileVideo, FileAudio, 
  Share2, Bookmark, BarChart4, Send, MessageSquare, Award, MonitorPlay,
  Briefcase, Landmark, CheckCircle2, Bot, X, Clock, Edit3, Trash2, Plus, Edit2, Settings
} from 'lucide-react';
import { 
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { jsPDF } from 'jspdf';

// --- INITIAL MOCK DATA ---
const TABS = [
  { id: 'newsroom', label: 'Executive Newsroom' },
  { id: 'multimedia', label: 'Multimedia Center' },
  { id: 'analytics', label: 'Media Analytics' },
  { id: 'ai', label: 'AI Media Assistant' },
  { id: 'downloads', label: 'Press & Downloads' }
];

const KPIS = [
  { label: 'Media Mentions (30d)', value: '14,285', trend: '+12.4%', icon: <Newspaper size={20} /> },
  { label: 'Press Releases (YTD)', value: '42', trend: '+4.0%', icon: <FileText size={20} /> },
  { label: 'Global Reach', value: '42 Countries', trend: 'Expanding', icon: <Globe size={20} /> },
  { label: 'Sentiment Index', value: '94.2/100', trend: '+2.1 pts', icon: <TrendingUp size={20} /> }
];

const ANALYTICS_DATA = [
  { month: 'Jan', positive: 4000, neutral: 2400, negative: 400 },
  { month: 'Feb', positive: 3000, neutral: 1398, negative: 210 },
  { month: 'Mar', positive: 2000, neutral: 9800, negative: 290 },
  { month: 'Apr', positive: 2780, neutral: 3908, negative: 200 },
  { month: 'May', positive: 1890, neutral: 4800, negative: 218 },
  { month: 'Jun', positive: 2390, neutral: 3800, negative: 250 },
  { month: 'Jul', positive: 3490, neutral: 4300, negative: 210 }
];

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// --- COMPONENT ---
const CeoMedia = () => {
  const [activeTab, setActiveTab] = useState('newsroom');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Dynamic State
  const [tickerItems, setTickerItems] = useState([
    "BREAKING: Surya Bank announces $45M investment in Quantum-Safe Cryptography.",
    "Q3 FY2026 Earnings: Record $12.8B Net Profit, crushing consensus estimates.",
    "AWARDS: CEO Sushanth NS named 'Global Banker of the Year 2026' by Financial Times.",
    "ESG MILESTONE: $15B Green Bond issuance oversubscribed by 300%."
  ]);
  
  const [featuredStory, setFeaturedStory] = useState({
    headline: "Surya Bank Launches Next-Generation 'Zero-Trust' Global Core Banking Infrastructure",
    summary: "In a landmark keynote address, the Office of the CEO detailed the successful deployment of Project Quantum—a proprietary zero-trust distributed ledger system designed to secure cross-border sovereign asset transfers against next-generation cyber threats.",
    date: "July 5, 2026",
    readTime: "8 Min Read",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  });

  const [newsFeed, setNewsFeed] = useState([
    { id: 1, title: 'Chairman\'s Address: Navigating Macroeconomic Volatility', type: 'Speech Transcript', date: 'Jul 2, 2026', readTime: '15 Min Read' },
    { id: 2, title: 'Strategic Acquisition of APAC Fintech Innovator "NexEdge"', type: 'Press Release', date: 'Jun 28, 2026', readTime: '5 Min Read' },
    { id: 3, title: 'Interview: CFO on Capital Liquidity and Dividend Strategy', type: 'Exclusive Interview', date: 'Jun 20, 2026', readTime: '12 Min Read' },
    { id: 4, title: '2035 Net Zero Accelerated Timelines Announced', type: 'ESG Policy Update', date: 'Jun 15, 2026', readTime: '8 Min Read' }
  ]);

  const [multimedia, setMultimedia] = useState([
    { id: 101, title: 'Global Markets Q3 Briefing', type: 'Video Broadcast', duration: '45:00', iconType: 'video' },
    { id: 102, title: 'Podcast: The Future of Sovereign Wealth', type: 'Audio Series', duration: '32:15', iconType: 'audio' },
    { id: 103, title: 'Keynote: Davos Economic Forum 2026', type: 'Live Event Recording', duration: '1:15:00', iconType: 'video' }
  ]);

  const [downloads, setDownloads] = useState([
    { id: 201, title: 'Official Press Kit 2026', type: 'ZIP Archive', size: '45 MB' },
    { id: 202, title: 'Executive Leadership Portraits', type: 'High-Res Images', size: '120 MB' },
    { id: 203, title: 'Corporate Brand Guidelines', type: 'PDF Document', size: '12 MB' },
    { id: 204, title: 'Vector Logos (SVG/EPS)', type: 'Brand Assets', size: '4 MB' }
  ]);

  // Player states
  const [playingMedia, setPlayingMedia] = useState(null);
  
  // AI States
  const [aiChat, setAiChat] = useState([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, item: null });

  // HANDLERS
  const handleAiSubmit = (text) => {
    if (!text.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', text }]);
    setAiQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      let response = "I am scanning the global media corpus and internal archives. ";
      const lower = text.toLowerCase();
      if (lower.includes('quantum')) response = "Project Quantum was announced on July 5, 2026. It is a $45M investment into zero-trust distributed ledger infrastructure. Media sentiment surrounding this announcement is 96% positive.";
      else if (lower.includes('press kit')) response = "I have compiled the latest Executive Press Kit. You can download it directly from the 'Press & Downloads' tab, which includes high-res portraits and official bios.";
      else if (lower.includes('sentiment')) response = "Overall media sentiment for Surya Bank is currently 94.2/100, up 2.1 points this month. The primary drivers of positive sentiment are our ESG milestones and record Q3 earnings.";
      else response += "Our executive media intelligence systems indicate widespread positive coverage. How else may I assist with your corporate communications?";
      
      setAiChat(prev => [...prev, { role: 'ai', text: response }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const handleAssetDownload = (doc) => {
    try {
      const pdf = new jsPDF();
      pdf.setFillColor(15, 23, 42); 
      pdf.rect(0, 0, 210, 297, 'F');
      
      pdf.setTextColor(212, 175, 55); 
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SURYA BANK ENTERPRISE', 20, 30);
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text(doc.title, 20, 45);

      pdf.setFontSize(12);
      pdf.setTextColor(148, 163, 184);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Asset Type: ${doc.type}`, 20, 55);
      pdf.text(`File Size: ${doc.size}`, 20, 62);
      pdf.text(`Verification ID: MN-2026-DL${doc.id}`, 20, 69);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 76);
      
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(1);
      pdf.line(20, 85, 190, 85);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text("This document serves as an official surrogate wrapper for the requested secure asset.", 20, 95);
      pdf.text("Internal verification complete. Authorized by Global Corporate Communications.", 20, 102);

      pdf.save(`SuryaBank_${doc.title.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate secure asset download.');
    }
  };

  const handleGeneratePressRelease = () => {
    try {
      const pdf = new jsPDF();
      pdf.setFillColor(255, 255, 255); 
      pdf.rect(0, 0, 210, 297, 'F');
      
      pdf.setTextColor(15, 23, 42); 
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SURYA BANK - OFFICIAL PRESS RELEASE', 20, 30);
      
      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105); 
      pdf.setFont('helvetica', 'normal');
      pdf.text(`FOR IMMEDIATE RELEASE | Date: ${featuredStory.date}`, 20, 45);
      
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(1);
      pdf.line(20, 50, 190, 50);

      pdf.setFontSize(16);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      const titleLines = pdf.splitTextToSize(featuredStory.headline, 170);
      pdf.text(titleLines, 20, 65);

      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      pdf.setFont('helvetica', 'normal');
      const bodyText = featuredStory.summary + `\n\n"This represents a paradigm shift in institutional banking security," stated Sushanth NS, Founder, Chairman & CEO. "By integrating quantum-safe cryptography into our core settlement nodes, we are ensuring that our clients' capital remains impenetrable against both current and future systemic vectors."\n\nFor media inquiries, please contact:\nGlobal Corporate Communications\nSurya Bank Limited\npress@suryabank.com`;
      
      const bodyLines = pdf.splitTextToSize(bodyText, 170);
      pdf.text(bodyLines, 20, 65 + (titleLines.length * 10) + 10);

      pdf.save('Surya_Bank_Press_Release.pdf');
    } catch (e) {
      console.error(e);
      alert('Failed to generate PDF.');
    }
  };

  // CRUD Handlers
  const deleteItem = (id, type) => {
    if(type === 'news') setNewsFeed(prev => prev.filter(i => i.id !== id));
    if(type === 'media') setMultimedia(prev => prev.filter(i => i.id !== id));
    if(type === 'download') setDownloads(prev => prev.filter(i => i.id !== id));
  };

  const saveItem = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const item = Object.fromEntries(fd.entries());
    
    if (modalConfig.type === 'news') {
      if (modalConfig.item?.id) {
        setNewsFeed(prev => prev.map(i => i.id === modalConfig.item.id ? { ...i, id: i.id } : i));
      } else {
        setNewsFeed(prev => [{ ...item, id: Date.now() }, ...prev]);
      }
    } else if (modalConfig.type === 'media') {
      if (modalConfig.item?.id) {
        setMultimedia(prev => prev.map(i => i.id === modalConfig.item.id ? { ...i, id: i.id } : i));
      } else {
        setMultimedia(prev => [{ ...item, id: Date.now() }, ...prev]);
      }
    } else if (modalConfig.type === 'download') {
      if (modalConfig.item?.id) {
        setDownloads(prev => prev.map(i => i.id === modalConfig.item.id ? { ...i, id: i.id } : i));
      } else {
        setDownloads(prev => [{ ...item, id: Date.now() }, ...prev]);
      }
    } else if (modalConfig.type === 'featured') {
       setFeaturedStory({ ...featuredStory, ...item });
    } else if (modalConfig.type === 'ticker') {
       setTickerItems(item.text.split('\n').filter(t => t.trim() !== ''));
    }
    
    setModalConfig({ isOpen: false, type: null, item: null });
  };

  // RENDERERS

  const renderNewsroom = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Ticker */}
      <div className="w-full bg-[#D4AF37] text-slate-950 font-bold text-xs py-2 overflow-hidden flex items-center shadow-[0_0_15px_rgba(212,175,55,0.2)] rounded-lg relative">
        <div className="px-4 border-r border-slate-900 flex-shrink-0 z-10 bg-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
          Breaking News
          {isEditMode && (
            <button onClick={() => setModalConfig({ isOpen: true, type: 'ticker', item: { text: tickerItems.join('\n') } })} className="p-1 hover:bg-black/10 rounded">
              <Edit3 size={12} />
            </button>
          )}
        </div>
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] pl-4">
          {tickerItems.join("   •   ")}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-800 rounded-lg text-[#D4AF37]">{kpi.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${kpi.trend.includes('+') || kpi.trend === 'Expanding' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Story */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl group flex flex-col relative">
          {isEditMode && (
            <button 
              onClick={() => setModalConfig({ isOpen: true, type: 'featured', item: featuredStory })}
              className="absolute top-4 right-4 z-20 p-2 bg-[#D4AF37] text-slate-900 rounded-lg shadow-lg hover:bg-amber-400"
            >
              <Edit3 size={16} />
            </button>
          )}
          <div className="h-64 overflow-hidden relative flex-shrink-0">
            <img src={featuredStory.img} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider mb-2 block border border-[#D4AF37]/30 bg-[#D4AF37]/10 w-fit px-2 py-1 rounded">Featured Annoucement</span>
              <h2 className="text-2xl font-serif font-bold text-white leading-tight">{featuredStory.headline}</h2>
            </div>
          </div>
          <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase mb-4">
                <span>{featuredStory.date}</span>
                <span>{featuredStory.readTime}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {featuredStory.summary}
              </p>
            </div>
            <div className="flex gap-4 pt-4 border-t border-slate-800 mt-auto">
              <button onClick={handleGeneratePressRelease} className="flex flex-1 items-center justify-center gap-2 px-4 py-2 bg-[#D4AF37] text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors text-xs">
                <Download size={14} /> Download Press Release
              </button>
              <button className="p-2 border border-slate-700 text-slate-400 rounded-xl hover:text-white hover:bg-slate-800 transition-colors">
                <Share2 size={16} />
              </button>
              <button className="p-2 border border-slate-700 text-slate-400 rounded-xl hover:text-white hover:bg-slate-800 transition-colors">
                <Bookmark size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Feed */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col relative">
          {isEditMode && (
            <button 
              onClick={() => setModalConfig({ isOpen: true, type: 'news', item: null })}
              className="absolute top-4 right-4 z-20 p-2 bg-[#D4AF37] text-slate-900 rounded-lg shadow-lg hover:bg-amber-400"
            >
              <Plus size={16} />
            </button>
          )}
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><Radio className="text-[#D4AF37]" size={20} /> Latest Briefings</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {newsFeed.map(news => (
              <div key={news.id} className="p-4 border border-slate-800 bg-slate-950/50 rounded-xl hover:border-slate-600 transition-colors cursor-pointer group relative">
                {isEditMode && (
                  <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <button onClick={(e) => { e.stopPropagation(); setModalConfig({ isOpen: true, type: 'news', item: news }); }} className="p-1 bg-slate-800 text-slate-300 rounded hover:text-white hover:bg-slate-700"><Edit2 size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteItem(news.id, 'news'); }} className="p-1 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/40"><Trash2 size={12} /></button>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37]">{news.type}</span>
                  <span className="text-[10px] text-slate-500">{news.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white mb-2 leading-snug pr-12">{news.title}</h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                  <Clock size={10} /> {news.readTime}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-3 border border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition-colors text-xs">View Full Archive</button>
        </div>
      </div>
    </div>
  );

  const renderMultimedia = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Media Player */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col">
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><MonitorPlay className="text-[#D4AF37]" size={20} /> Media Player</h3>
          
          <div className="flex-1 bg-black rounded-2xl border border-slate-700 overflow-hidden relative flex items-center justify-center min-h-[300px]">
            {playingMedia ? (
              <div className="w-full p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  {playingMedia.iconType === 'video' ? <Video size={32} className="text-[#D4AF37]" /> : <AudioLines size={32} className="text-[#D4AF37]" />}
                </div>
                <h4 className="text-white font-bold">{playingMedia.title}</h4>
                <p className="text-slate-400 text-xs">Playing {playingMedia.type}... ({playingMedia.duration})</p>
                
                <div className="w-full h-1 bg-slate-800 mt-8 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4AF37] w-1/3 rounded-full animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 flex flex-col items-center gap-2">
                <Play size={48} className="opacity-20" />
                <span className="text-sm font-bold uppercase tracking-widest">Select Media to Play</span>
              </div>
            )}
          </div>
        </div>

        {/* Media Library */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative">
          {isEditMode && (
            <button 
              onClick={() => setModalConfig({ isOpen: true, type: 'media', item: null })}
              className="absolute top-4 right-4 z-20 p-2 bg-[#D4AF37] text-slate-900 rounded-lg shadow-lg hover:bg-amber-400"
            >
              <Plus size={16} />
            </button>
          )}
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><Briefcase className="text-[#D4AF37]" size={20} /> Media Library</h3>
          <div className="space-y-3">
            {multimedia.map(item => (
              <div 
                key={item.id} 
                onClick={() => setPlayingMedia(item)}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between group relative ${playingMedia?.id === item.id ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'}`}
              >
                {isEditMode && (
                  <div className="absolute right-14 flex gap-1 z-10">
                    <button onClick={(e) => { e.stopPropagation(); setModalConfig({ isOpen: true, type: 'media', item }); }} className="p-1 bg-slate-800 text-slate-300 rounded hover:text-white hover:bg-slate-700"><Edit2 size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id, 'media'); }} className="p-1 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/40"><Trash2 size={12} /></button>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${playingMedia?.id === item.id ? 'bg-[#D4AF37] text-slate-900' : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
                    {item.iconType === 'video' ? <Video size={16} /> : <Mic2 size={16} />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${playingMedia?.id === item.id ? 'text-[#D4AF37]' : 'text-slate-200'}`}>{item.title}</h4>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{item.type}</span>
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
                  {item.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sentiment Chart */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-[400px] flex flex-col">
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><BarChart4 className="text-[#D4AF37]" size={20} /> Media Sentiment Analysis</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNeu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickFormatter={(val) => `${val/1000}k`} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPos)" />
                <Area type="monotone" dataKey="neutral" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorNeu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Coverage Map */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-[400px] flex flex-col relative overflow-hidden">
          <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2 relative z-10"><Globe className="text-[#D4AF37]" size={20} /> Global Media Coverage</h3>
          <p className="text-xs text-slate-400 mb-4 relative z-10">Real-time geographical tracking of press mentions and syndication.</p>
          <div className="flex-1 w-full bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden relative">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }} style={{ width: "100%", height: "100%" }}>
              <ZoomableGroup center={[0, 20]} zoom={1} minZoom={1} maxZoom={4}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#1e293b"
                        stroke="#334155"
                        strokeWidth={0.5}
                        style={{ default: { outline: "none" }, hover: { fill: "#475569", outline: "none" }, pressed: { fill: "#D4AF37", outline: "none" } }}
                      />
                    ))
                  }
                </Geographies>
                <Marker coordinates={[-74.006, 40.7128]}><circle r={6} fill="#D4AF37" className="animate-ping opacity-75" /><circle r={3} fill="#D4AF37" /></Marker>
                <Marker coordinates={[-0.1276, 51.5074]}><circle r={4} fill="#10b981" className="animate-ping opacity-75" /><circle r={2} fill="#10b981" /></Marker>
                <Marker coordinates={[103.8198, 1.3521]}><circle r={4} fill="#10b981" className="animate-ping opacity-75" /><circle r={2} fill="#10b981" /></Marker>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAiAssistant = () => (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
      
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
          <Bot className="text-[#D4AF37]" size={24} />
        </div>
        <div>
          <h3 className="text-white font-bold text-xl">Media Intelligence AI</h3>
          <p className="text-xs text-slate-400">Summarize announcements, draft press kits, and query historical transcripts.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar mb-6">
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex-shrink-0 flex items-center justify-center">
            <Bot size={16} className="text-slate-900" />
          </div>
          <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200 shadow-md">
            Welcome to the Executive Media AI Assistant. I have deeply indexed all Surya Bank press releases, executive speeches, ESG commitments, and global media mentions. How can I assist you with corporate communications today?
          </div>
        </div>
        
        {aiChat.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700' : 'bg-[#D4AF37]'}`}>
              {msg.role === 'user' ? <Search size={14} className="text-white" /> : <Bot size={16} className="text-slate-900" />}
            </div>
            <div className={`rounded-2xl p-4 text-sm shadow-md max-w-[80%] ${msg.role === 'user' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex-shrink-0 flex items-center justify-center">
              <Bot size={16} className="text-slate-900" />
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit(aiQuery)}
          placeholder="E.g., Generate a summary of the Q3 earnings press release..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
        <button 
          onClick={() => handleAiSubmit(aiQuery)}
          disabled={!aiQuery.trim() || isAiTyping}
          className="bg-[#D4AF37] hover:bg-amber-400 text-slate-900 px-6 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );

  const renderPressHub = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Downloads */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
          {isEditMode && (
            <button 
              onClick={() => setModalConfig({ isOpen: true, type: 'download', item: null })}
              className="absolute top-4 right-4 z-20 p-2 bg-[#D4AF37] text-slate-900 rounded-lg shadow-lg hover:bg-amber-400"
            >
              <Plus size={16} />
            </button>
          )}
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-colors"></div>
          <h3 className="text-white font-bold text-xl mb-6 relative z-10 flex items-center gap-2"><Download className="text-[#D4AF37]" /> Download Center</h3>
          <p className="text-sm text-slate-400 mb-8 relative z-10">Access high-resolution brand assets, official press kits, and corporate guidelines.</p>
          
          <div className="space-y-4 relative z-10">
            {downloads.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-600 transition-colors cursor-pointer group/item relative">
                {isEditMode && (
                  <div className="absolute top-2 right-12 flex gap-1 z-10">
                    <button onClick={(e) => { e.stopPropagation(); setModalConfig({ isOpen: true, type: 'download', item: doc }); }} className="p-1 bg-slate-800 text-slate-300 rounded hover:text-white hover:bg-slate-700"><Edit2 size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteItem(doc.id, 'download'); }} className="p-1 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/40"><Trash2 size={12} /></button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover/item:text-[#D4AF37] transition-colors">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold pr-16">{doc.title}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAssetDownload(doc); }}
                  className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-[#D4AF37]/20"
                >
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Press Relations Contact */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-slate-600/5 rounded-full blur-3xl"></div>
          <h3 className="text-white font-bold text-xl mb-6 relative z-10 flex items-center gap-2"><MessageSquare className="text-[#D4AF37]" /> Press Relations</h3>
          <p className="text-sm text-slate-400 mb-8 relative z-10">Direct communication channels for accredited journalists, analysts, and media outlets.</p>
          
          <div className="space-y-6 relative z-10">
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-600 transition-colors cursor-pointer">
              <h4 className="text-[#D4AF37] font-bold mb-1">Global Corporate Communications</h4>
              <p className="text-xs text-slate-400 mb-4">For general media inquiries, interview requests, and press accreditation.</p>
              <div className="text-sm text-white font-mono bg-slate-900 p-2 rounded inline-block border border-slate-800">press@suryabank.com</div>
              <div className="mt-2 text-sm text-slate-300 font-mono">+1 (212) 555-0198</div>
            </div>
            
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-600 transition-colors cursor-pointer">
              <h4 className="text-emerald-500 font-bold mb-1">Investor Relations Desk</h4>
              <p className="text-xs text-slate-400 mb-4">For financial analysts, institutional investors, and earnings inquiries.</p>
              <div className="text-sm text-white font-mono bg-slate-900 p-2 rounded inline-block border border-slate-800">investors@suryabank.com</div>
              <div className="mt-2 text-sm text-slate-300 font-mono">+1 (212) 555-0199</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // MODAL RENDERER
  const renderModal = () => {
    if (!modalConfig.isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950/50">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="text-[#D4AF37]" size={20} /> 
              {modalConfig.item ? 'Edit Content' : 'Add New Content'}
            </h3>
            <button onClick={() => setModalConfig({ isOpen: false, type: null, item: null })} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={saveItem} className="p-6 space-y-4">
            
            {modalConfig.type === 'ticker' && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Ticker Items (One per line)</label>
                <textarea name="text" defaultValue={modalConfig.item?.text || ''} required rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>
            )}

            {modalConfig.type === 'news' && (
              <>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Title</label><input name="title" defaultValue={modalConfig.item?.title || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Type</label><input name="type" defaultValue={modalConfig.item?.type || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Date</label><input name="date" defaultValue={modalConfig.item?.date || new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Read Time</label><input name="readTime" defaultValue={modalConfig.item?.readTime || '5 Min Read'} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                </div>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Photo Attachment URL (Optional)</label><input name="imgUrl" defaultValue={modalConfig.item?.imgUrl || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" placeholder="https://..." /></div>
                <div><label className="text-xs font-bold text-slate-400 uppercase">PDF Attachment URL (Optional)</label><input name="pdfUrl" defaultValue={modalConfig.item?.pdfUrl || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" placeholder="https://..." /></div>
              </>
            )}

            {modalConfig.type === 'media' && (
              <>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Title</label><input name="title" defaultValue={modalConfig.item?.title || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Type</label><input name="type" defaultValue={modalConfig.item?.type || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Duration</label><input name="duration" defaultValue={modalConfig.item?.duration || '10:00'} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Icon Type (video/audio)</label><input name="iconType" defaultValue={modalConfig.item?.iconType || 'video'} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                </div>
              </>
            )}

            {modalConfig.type === 'download' && (
              <>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Title</label><input name="title" defaultValue={modalConfig.item?.title || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Type</label><input name="type" defaultValue={modalConfig.item?.type || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Size</label><input name="size" defaultValue={modalConfig.item?.size || '1 MB'} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
              </>
            )}

            {modalConfig.type === 'featured' && (
              <>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Headline</label><input name="headline" defaultValue={modalConfig.item?.headline || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Summary</label><textarea name="summary" defaultValue={modalConfig.item?.summary || ''} required rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Date</label><input name="date" defaultValue={modalConfig.item?.date || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Read Time</label><input name="readTime" defaultValue={modalConfig.item?.readTime || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" /></div>
                </div>
              </>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button type="button" onClick={() => setModalConfig({ isOpen: false, type: null, item: null })} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl text-sm font-bold bg-[#D4AF37] text-slate-900 hover:bg-amber-400 transition-colors">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 relative">
      
      {/* Header */}
      <div className="flex justify-end pt-4 pr-4">
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg border ${
            isEditMode 
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 hover:bg-rose-500/30' 
            : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700 backdrop-blur-md'
          }`}
        >
          {isEditMode ? <ShieldAlert size={14} /> : <Settings size={14} />}
          {isEditMode ? 'Exit Edit Mode' : 'Enable Edit Mode'}
        </button>
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">
          <Radio size={14} className="animate-pulse" /> Live Broadcast Active
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">Media Command Center</h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
          The official executive newsroom and media intelligence platform of Surya Bank. Access global press releases, strategic announcements, multimedia archives, and real-time media analytics.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 sticky top-4 z-40">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab.id 
              ? 'bg-[#D4AF37] text-slate-900 shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-105' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px] mt-8">
        {activeTab === 'newsroom' && renderNewsroom()}
        {activeTab === 'multimedia' && renderMultimedia()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'ai' && renderAiAssistant()}
        {activeTab === 'downloads' && renderPressHub()}
      </div>

      {/* CRUD Modal */}
      {renderModal()}
    </div>
  );
};

export default CeoMedia;
