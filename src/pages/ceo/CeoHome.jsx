import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Star, Users, Briefcase, TrendingUp, Award, Clock } from 'lucide-react';
import { biography } from './CeoMockData';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const CeoHome = () => {
  const navigate = useNavigate();
  const [activeHub, setActiveHub] = useState(null);
  const [tickerPrice, setTickerPrice] = useState(48.50);
  const [tickerChange, setTickerChange] = useState('+1.25%');
  const [dbProfile, setDbProfile] = useState(null);

  // Fetch CEO profile dynamically from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'ceo_profile_data', 'main_profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDbProfile(docSnap.data());
        }
      } catch (err) {
        console.error("Failed to load CEO profile data:", err);
      }
    };
    fetchProfile();
  }, []);

  const activeProfile = {
    name: dbProfile?.name || biography.name,
    title: dbProfile?.title || biography.title,
    quote: dbProfile?.biography ? (dbProfile.biography.length > 120 ? dbProfile.biography.substring(0, 117) + "..." : dbProfile.biography) : biography.quote,
    stats: dbProfile?.stats || biography.stats
  };

  // Banking centers coordinates and info
  const hubs = [
    { id: 'ny', name: 'New York Hub', x: 200, y: 110, desc: 'Corporate syndicate debt underwriting and private wealth asset desks.' },
    { id: 'ldn', name: 'London Hub', x: 420, y: 85, desc: 'Global currency hedging engines and Eurobond operations.' },
    { id: 'blr', name: 'Bengaluru Headquarters', x: 630, y: 180, desc: 'Surya Financial Center - core retail ledgers, AI risk engines, and operations.' },
    { id: 'sg', name: 'Singapore Hub', x: 710, y: 220, desc: 'Open Banking API laboratories and wealth distribution networks.' },
    { id: 'fra', name: 'Frankfurt Office', x: 450, y: 100, desc: 'European digital-first challenger expansion and regulatory compliance compliance.' }
  ];

  // Mock stock price ticker movement
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 0.2;
      setTickerPrice(prev => parseFloat((prev + delta).toFixed(2)));
      setTickerChange(delta >= 0 ? `+${delta.toFixed(2)}%` : `${delta.toFixed(2)}%`);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] rounded-3xl overflow-hidden bg-gradient-to-br from-ceo-navy via-slate-900 to-ceo-dark border border-slate-800 flex flex-col justify-between p-8 md:p-12 shadow-2xl">
        
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ceo-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Top Ticker Bar */}
        <div className="z-10 flex flex-wrap gap-4 justify-between items-center bg-slate-950/60 backdrop-blur border border-slate-800/80 rounded-2xl px-6 py-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-slate-300 uppercase tracking-wider">Surya Bank Stock (SURY)</span>
          </div>
          <div className="flex items-center gap-4 text-gray-200">
            <span>Price: <strong className="text-white">${tickerPrice}</strong></span>
            <span className={tickerChange.startsWith('+') ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {tickerChange}
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1"><Clock size={12} /> Real-Time Feed</span>
          </div>
        </div>

        {/* Hero Body Content */}
        <div className="z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto pt-8 items-center">
          
          {/* Hero Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ceo-gold/10 border border-ceo-gold/20 text-ceo-gold text-xs font-semibold">
              <Star size={12} /> Executive Leadership Portal
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight leading-tight text-white">
              Office of the CEO,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ceo-gold via-yellow-200 to-white font-bold">
                Chairman & Founder
              </span>
            </h1>

            <p className="text-2xl font-semibold text-slate-300">
              {activeProfile.name}
            </p>

            <blockquote className="border-l-2 border-ceo-gold pl-4 text-slate-400 italic text-base max-w-lg leading-relaxed">
              "{activeProfile.quote}"
            </blockquote>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => navigate('/ceo/vision')}
                className="px-6 py-3.5 rounded-xl bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold shadow-lg shadow-ceo-gold/15 transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                View Vision <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => navigate('/ceo/message')}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 text-white font-semibold transition-all hover:-translate-y-0.5"
              >
                Read Shareholder Letter
              </button>
              <button 
                onClick={() => navigate('/ceo/about')}
                className="px-6 py-3.5 rounded-xl bg-transparent hover:bg-slate-850/60 border border-transparent hover:border-slate-800 text-slate-300 hover:text-white font-medium transition-all"
              >
                Leadership Journey
              </button>
            </div>
          </div>

          {/* Hero Portrait Placeholder */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-ceo-gold/10 to-blue-500/10 rounded-3xl blur-2xl -z-10" />
            <div className="relative border border-slate-700 p-3 bg-slate-900/60 backdrop-blur rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 overflow-hidden relative flex flex-col justify-end border border-slate-850">
                {/* Visual Portrait */}
                <img 
                  src="/sns.jpg" 
                  alt={activeProfile.name} 
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = document.getElementById('profile-placeholder');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                
                {/* Visual Placeholder Art fallback */}
                <div id="profile-placeholder" className="hidden absolute inset-0 flex-col items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="w-32 h-32 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-ceo-gold font-serif text-4xl">
                    S
                  </div>
                </div>

                {/* Glassy Overlay for text content */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent pt-20 pb-6 px-6 text-center z-10">
                  <h3 className="font-serif text-lg text-white font-semibold">{activeProfile.name}</h3>
                  <p className="text-xs text-ceo-gold tracking-widest uppercase mt-1">Surya Bank Group Founder</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Floating statistics counters */}
        <div className="z-10 grid grid-cols-2 md:grid-cols-5 gap-4 pt-10 border-t border-slate-800/80 mt-12 text-center md:text-left">
          {activeProfile.stats.map((stat, idx) => (
            <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
              <span className="block text-2xl font-bold text-white tracking-tight">{stat.value}</span>
              <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

      </section>

      {/* Global Interactive Map of Banking Hubs */}
      <section className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif text-white font-bold">Global Presence & Hub Network</h2>
          <p className="text-xs text-slate-400">
            Surya Bank operates trading desks, risk analytics centers, and retail channels across primary economic portals. Hover over a marker to see hub activities.
          </p>
        </div>

        {/* SVG World Map */}
        <div className="relative overflow-x-auto min-h-[300px]">
          <svg viewBox="0 0 1000 400" className="w-full h-auto min-w-[750px] opacity-75">
            {/* Simple Grid Background */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="1000" height="400" fill="url(#grid)" />

            {/* Stylized Continents (Rough shapes for high-tech aesthetic) */}
            {/* North America */}
            <path d="M 50,80 L 120,60 L 220,100 L 250,150 L 150,220 L 120,180 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="5,5" />
            {/* South America */}
            <path d="M 200,240 L 240,230 L 300,320 L 260,380 L 220,320 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="5,5" />
            {/* Europe */}
            <path d="M 380,60 L 480,50 L 510,120 L 430,160 L 380,120 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="5,5" />
            {/* Africa */}
            <path d="M 400,180 L 500,170 L 530,280 L 460,340 L 420,250 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="5,5" />
            {/* Asia */}
            <path d="M 550,60 L 800,50 L 880,180 L 750,260 L 600,220 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="5,5" />
            {/* Australia */}
            <path d="M 800,280 L 920,270 L 900,350 L 810,340 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="5,5" />

            {/* Glowing lines connecting hubs to Bengaluru HQ */}
            {hubs.map(hub => {
              if (hub.id === 'blr') return null;
              return (
                <path
                  key={`line-${hub.id}`}
                  d={`M 630,180 Q ${(630 + hub.x)/2},${(180 + hub.y)/2 - 30} ${hub.x},${hub.y}`}
                  fill="none"
                  stroke="url(#goldGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="4,6"
                  className="animate-pulse"
                />
              );
            })}
            
            {/* Gradient definition for connecting lines */}
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0B3D91" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Interactive Hub Dots */}
            {hubs.map(hub => (
              <g 
                key={hub.id} 
                className="cursor-pointer"
                onMouseEnter={() => setActiveHub(hub)}
                onMouseLeave={() => setActiveHub(null)}
              >
                {/* Outer pulsing ring */}
                <circle 
                  cx={hub.x} 
                  cy={hub.y} 
                  r={activeHub?.id === hub.id ? 15 : 8} 
                  fill={hub.id === 'mum' ? 'rgba(212,175,55,0.2)' : 'rgba(11,61,145,0.2)'}
                  className="transition-all duration-300 animate-ping"
                />
                {/* Inner Core Dot */}
                <circle 
                  cx={hub.x} 
                  cy={hub.y} 
                  r={hub.id === 'mum' ? 6 : 4} 
                  fill={hub.id === 'mum' ? '#D4AF37' : '#0B3D91'} 
                  stroke="#FFFFFF" 
                  strokeWidth="1.5"
                />
              </g>
            ))}
          </svg>

          {/* Details Overlay Card */}
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-xl shadow-2xl transition-all">
            {activeHub ? (
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded bg-ceo-gold/10 text-ceo-gold text-[10px] uppercase font-bold tracking-wider">
                  Active Connection
                </span>
                <h4 className="font-semibold text-sm text-white">{activeHub.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{activeHub.desc}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  Interactive Directory
                </span>
                <h4 className="font-semibold text-sm text-white">Select a Banking Center</h4>
                <p className="text-xs text-slate-400">Hover over any glowing location node to inspect asset classes and local operations desk activities.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Philosophy Brief */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-serif text-white font-bold leading-tight">
            Commitment to Modern,<br />
            <span className="text-ceo-gold font-sans font-semibold text-2xl tracking-normal block mt-1">Sustainable Global Capital</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            As commercial frameworks transform under digital demands, Surya Bank maintains the conviction that institutional liquidity must act as a force for climate preservation, inclusive growth, and cryptographic integrity. 
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <Globe className="text-ceo-gold shrink-0" size={24} />
              <div>
                <span className="block font-bold text-white text-sm">15 Markets</span>
                <span className="block text-[10px] text-slate-500 uppercase">Unified Regulatory Compliance</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <Users className="text-ceo-gold shrink-0" size={24} />
              <div>
                <span className="block font-bold text-white text-sm">25M+ Customers</span>
                <span className="block text-[10px] text-slate-500 uppercase">Retail and Enterprise Wallets</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-center space-y-6 shadow-xl">
          <Award className="mx-auto text-ceo-gold" size={40} />
          <h3 className="font-serif text-lg text-white font-bold">2026 Executive Mandates</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            "We do not build banking interfaces to replicate yesterday's ledgers. We build networks to secure tomorrow's opportunities."
          </p>
          <button 
            onClick={() => navigate('/ceo/about')}
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Review Executive Biography
          </button>
        </div>
      </section>

    </div>
  );
};

export default CeoHome;
