import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, MapPin, Calendar, Users, Tag, Lock, 
  Download, Eye, Maximize, X, ChevronLeft, ChevronRight, 
  Play, Pause, Info, Search, Filter, FolderPlus, UploadCloud,
  FileText, Star, Archive, BarChart2, Globe, Clock, Layers
} from 'lucide-react';
import { damEvents, galleryAnalytics } from './CeoGalleryData';
import { useCeoAuth } from '../../context/CeoAuthContext';
import { useCeoCMS } from '../../context/CeoCMSContext';

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

// --- SVG WORLD MAP COMPONENT ---
const InteractiveWorldMap = ({ events, onNodeClick }) => {
  return (
    <div className="relative w-full aspect-[21/9] bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden group">
      {/* Abstract Map Background (Simplified SVG) */}
      <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-20">
        <path d="M100,100 Q150,50 200,100 T300,100 T400,150 T500,100 T600,150 T700,100 T800,150 T900,100" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M150,200 Q200,150 250,200 T350,200 T450,250 T550,200 T650,250 T750,200 T850,250 T950,200" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
        {/* Placeholder for landmasses - representing continents abstractly */}
        <ellipse cx="250" cy="200" rx="150" ry="100" fill="currentColor" className="text-slate-700" />
        <ellipse cx="600" cy="180" rx="180" ry="120" fill="currentColor" className="text-slate-700" />
        <ellipse cx="800" cy="300" rx="100" ry="150" fill="currentColor" className="text-slate-700" />
      </svg>
      
      {/* Event Nodes */}
      {events.map((evt) => (
        <div 
          key={evt.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
          style={{ left: `${(evt.location.x / 1000) * 100}%`, top: `${(evt.location.y / 500) * 100}%` }}
          onClick={() => onNodeClick(evt.location.name)}
        >
          <div className="relative">
            <div className="w-3 h-3 bg-ceo-gold rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-ceo-gold rounded-full relative z-10 border border-slate-900" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {evt.location.name}
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <Globe size={16} className="text-ceo-gold" />
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Global Executive Footprint</span>
      </div>
    </div>
  );
};

const CeoGallery = () => {
  const { user, role } = useCeoAuth();
  const { isEditMode } = useCeoCMS();

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeYear, setActiveYear] = useState('All');
  const [activeLocationFilter, setActiveLocationFilter] = useState(null);

  // Viewer State
  const [viewingEvent, setViewingEvent] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [isMetadataOpen, setIsMetadataOpen] = useState(true);
  const [isStoryMode, setIsStoryMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // CMS State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Extracted Filter Options
  const categories = ['All', ...new Set(damEvents.map(e => e.category))];
  const years = ['All', ...new Set(damEvents.map(e => e.year.toString()))];

  // Filtering Logic
  const filteredEvents = damEvents.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = activeCategory === 'All' || evt.category === activeCategory;
    const matchesYear = activeYear === 'All' || evt.year.toString() === activeYear;
    const matchesLoc = !activeLocationFilter || evt.location.name === activeLocationFilter;
    
    // Role-based filtering (mocked)
    const matchesRole = role === 'CEO' || evt.visibility !== 'CEO Only'; 

    return matchesSearch && matchesCat && matchesYear && matchesLoc && matchesRole;
  });

  // Story Mode Autoplay Hook
  useEffect(() => {
    let interval;
    if (isStoryMode && viewingEvent && lightboxIdx !== null) {
      interval = setInterval(() => {
        setLightboxIdx(prev => (prev === viewingEvent.media.length - 1 ? 0 : prev + 1));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isStoryMode, viewingEvent, lightboxIdx]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIdx === null || !viewingEvent) return;
      if (e.key === 'ArrowRight') setLightboxIdx(prev => (prev === viewingEvent.media.length - 1 ? 0 : prev + 1));
      if (e.key === 'ArrowLeft') setLightboxIdx(prev => (prev === 0 ? viewingEvent.media.length - 1 : prev - 1));
      if (e.key === 'Escape') { setLightboxIdx(null); setViewingEvent(null); setIsStoryMode(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, viewingEvent]);

  return (
    <div className="min-h-screen pb-32 animate-in fade-in duration-500">
      
      {/* 1. HEADER & DASHBOARD */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold flex items-center gap-2 mb-2">
              <Layers size={14} /> Enterprise Digital Asset Management
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">
              Executive Media Archive
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Secure, centralized repository for all leadership engagements, international summits, and corporate press assets.
            </p>
          </div>
          {isEditMode && role === 'CEO' && (
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-xl transition-all flex items-center gap-2"
            >
              <UploadCloud size={16} /> Bulk Upload Media
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <AnimatedCounter value={galleryAnalytics.totalAssets} label="Total Assets" icon={ImageIcon} />
          <AnimatedCounter value={galleryAnalytics.totalEvents} label="Events Logged" icon={Calendar} />
          <AnimatedCounter value={galleryAnalytics.countriesVisited} label="Countries Visited" icon={Globe} />
          <AnimatedCounter value={galleryAnalytics.awardsReceived} label="Awards" icon={Star} />
          <AnimatedCounter value={galleryAnalytics.meetingsLogged} label="Meetings" icon={Users} />
          <AnimatedCounter value={galleryAnalytics.mediaCoverage} label="Media Hits" icon={BarChart2} />
        </div>

        {/* Interactive World Map */}
        <InteractiveWorldMap 
          events={damEvents} 
          onNodeClick={(loc) => setActiveLocationFilter(loc === activeLocationFilter ? null : loc)} 
        />
        {activeLocationFilter && (
          <div className="mt-2 text-xs text-ceo-gold flex items-center gap-2">
            Filtering by Location: {activeLocationFilter} 
            <button onClick={() => setActiveLocationFilter(null)} className="text-slate-400 hover:text-white"><X size={12}/></button>
          </div>
        )}
      </section>

      {/* 2. TIMELINE NAVIGATION & EVENT GRID */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Timeline Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text"
              placeholder="AI Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-ceo-gold transition-colors"
            />
          </div>

          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-6">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-4">
              <Clock size={16} className="text-ceo-gold" /> Timeline
            </div>
            
            <div className="space-y-1">
              {years.map(year => (
                <button 
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${activeYear === year ? 'bg-ceo-gold/10 text-ceo-gold border border-ceo-gold/20 font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  {year}
                  {year !== 'All' && <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded">{damEvents.filter(e => e.year.toString() === year).length}</span>}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Category</label>
              <select 
                value={activeCategory} 
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* Event Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center border-b border-slate-800 pb-4">
            <span className="text-sm font-bold text-slate-300">Showing {filteredEvents.length} Events</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <motion.div 
                layout
                key={evt.id}
                onClick={() => { setViewingEvent(evt); setLightboxIdx(0); }}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-square cursor-pointer shadow-lg hover:border-ceo-gold/40 transition-colors"
              >
                {/* Event Cover Image */}
                <img 
                  src={evt.coverImage} 
                  alt={evt.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-slate-950/80 backdrop-blur text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border border-slate-700/50 flex items-center gap-1">
                    <ImageIcon size={10} /> {evt.media.length} Assets
                  </span>
                  {evt.visibility === 'CEO Only' && (
                    <span className="bg-red-500/80 backdrop-blur text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border border-red-400/50 flex items-center gap-1">
                      <Lock size={10} /> Restricted
                    </span>
                  )}
                </div>

                {isEditMode && role === 'CEO' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* Handle Event Edit */ }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ceo-gold text-ceo-navy flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                  >
                    <Tag size={14} />
                  </button>
                )}

                {/* Bottom Overlay details */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 pt-12 flex flex-col justify-end">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-ceo-gold uppercase tracking-widest font-bold">
                      <Calendar size={12} /> {evt.month} {evt.year}
                    </div>
                    <h4 className="text-lg font-serif font-bold text-white leading-tight">{evt.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} /> {evt.location.name}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PROFESSIONAL FULLSCREEN VIEWER (LIGHTBOX) */}
      <AnimatePresence>
        {viewingEvent && lightboxIdx !== null && (
          <div className="fixed inset-0 z-[10000] bg-black flex overflow-hidden">
            
            {/* Main Viewer Area */}
            <div className={`flex-1 relative flex flex-col transition-all duration-300 ${isMetadataOpen ? 'mr-80' : 'mr-0'}`}>
              
              {/* Top Toolbar */}
              <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-4 text-white">
                  <span className="text-sm font-bold opacity-70">{lightboxIdx + 1} / {viewingEvent.media.length}</span>
                  <span className="text-xs font-mono bg-slate-900/50 px-2 py-1 rounded backdrop-blur border border-slate-700">
                    {viewingEvent.media[lightboxIdx].resolution}
                  </span>
                  {viewingEvent.media[lightboxIdx].visibility === 'CEO Only' && (
                    <span className="text-xs text-red-400 flex items-center gap-1 font-bold"><Lock size={12}/> CEO Only</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsStoryMode(!isStoryMode)} className={`p-2 rounded-lg backdrop-blur transition-colors flex items-center gap-2 ${isStoryMode ? 'bg-ceo-gold text-ceo-navy' : 'bg-slate-900/50 text-white hover:bg-slate-800'}`}>
                    {isStoryMode ? <Pause size={16}/> : <Play size={16}/>}
                    <span className="text-xs font-bold">{isStoryMode ? 'Pause' : 'Story Mode'}</span>
                  </button>
                  <button onClick={() => setZoomLevel(prev => prev === 1 ? 1.5 : 1)} className="p-2 bg-slate-900/50 hover:bg-slate-800 text-white rounded-lg backdrop-blur transition-colors">
                    <Maximize size={16} />
                  </button>
                  <button onClick={() => setIsMetadataOpen(!isMetadataOpen)} className={`p-2 rounded-lg backdrop-blur transition-colors ${isMetadataOpen ? 'bg-ceo-gold text-ceo-navy' : 'bg-slate-900/50 text-white hover:bg-slate-800'}`}>
                    <Info size={16} />
                  </button>
                  <div className="w-px h-6 bg-slate-700 mx-2" />
                  <button onClick={() => { setViewingEvent(null); setLightboxIdx(null); setIsStoryMode(false); }} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg backdrop-blur transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(prev => (prev === 0 ? viewingEvent.media.length - 1 : prev - 1)); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur z-50 transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(prev => (prev === viewingEvent.media.length - 1 ? 0 : prev + 1)); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur z-50 transition-colors">
                <ChevronRight size={24} />
              </button>

              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center p-12 overflow-hidden">
                <motion.img 
                  key={viewingEvent.media[lightboxIdx].id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: zoomLevel }}
                  transition={{ duration: 0.3 }}
                  src={viewingEvent.media[lightboxIdx].url} 
                  alt={viewingEvent.media[lightboxIdx].title}
                  className={`max-w-full max-h-full object-contain ${zoomLevel > 1 ? 'cursor-move' : 'cursor-default'}`}
                  draggable={false}
                />
              </div>

              {/* Bottom Filmstrip */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex gap-2 overflow-x-auto justify-center z-50">
                {viewingEvent.media.map((med, idx) => (
                  <button 
                    key={med.id} 
                    onClick={() => setLightboxIdx(idx)}
                    className={`shrink-0 w-16 h-16 rounded border-2 transition-all overflow-hidden ${idx === lightboxIdx ? 'border-ceo-gold scale-110 z-10' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={med.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Expandable Metadata Side-Panel */}
            <AnimatePresence>
              {isMetadataOpen && (
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 w-80 bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto z-[10001] flex flex-col"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Info size={18} className="text-ceo-gold"/> Asset Details</h3>
                    <button onClick={() => setIsMetadataOpen(false)} className="text-slate-500 hover:text-white"><X size={16}/></button>
                  </div>

                  <div className="space-y-6 flex-1">
                    {/* Basic Info */}
                    <div className="space-y-1 border-b border-slate-800 pb-4">
                      <h4 className="text-xl font-serif text-white leading-tight">{viewingEvent.media[lightboxIdx].title}</h4>
                      <p className="text-xs text-slate-400">{viewingEvent.media[lightboxIdx].description}</p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1">Date Captured</span>
                        <span className="text-slate-300">{viewingEvent.media[lightboxIdx].date.split(' ')[0]}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1">Photographer</span>
                        <span className="text-slate-300">{viewingEvent.media[lightboxIdx].photographer}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1">Event Reference</span>
                        <span className="text-ceo-gold font-mono">{viewingEvent.id}</span>
                      </div>
                    </div>

                    {/* AI Tagging */}
                    <div className="border-t border-slate-800 pt-4">
                      <span className="block text-[9px] uppercase tracking-widest text-emerald-500 font-bold mb-2 flex items-center gap-1">
                        <CheckCircle2 size={10}/> AI Vision Tags
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {viewingEvent.media[lightboxIdx].tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-300">{tag}</span>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-slate-500 italic bg-slate-900/50 p-2 rounded border border-slate-800/50">
                        " {viewingEvent.media[lightboxIdx].aiSummary} "
                      </p>
                    </div>

                    {/* CEO Private Notes */}
                    {(role === 'CEO' || role === 'Admin') && (
                      <div className="border-t border-slate-800 pt-4">
                        <span className="block text-[9px] uppercase tracking-widest text-red-400 font-bold mb-2 flex items-center gap-1">
                          <Lock size={10}/> Private Executive Notes
                        </span>
                        <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg">
                          <p className="text-xs text-slate-300 font-mono">
                            {viewingEvent.media[lightboxIdx].privateNotes || "No notes attached."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Attached Event Files */}
                    {viewingEvent.attachedFiles.length > 0 && (
                      <div className="border-t border-slate-800 pt-4">
                        <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2">Event Attachments</span>
                        <div className="space-y-2">
                          {viewingEvent.attachedFiles.map(file => (
                            <a href="#" key={file.name} className="flex items-center gap-2 p-2 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors group">
                              <FileText size={14} className="text-ceo-gold" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-white truncate group-hover:text-ceo-gold transition-colors">{file.name}</p>
                                <p className="text-[9px] text-slate-500">{file.type} • {file.size}</p>
                              </div>
                              <Download size={12} className="text-slate-500 group-hover:text-white" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-800 mt-auto space-y-2">
                    <button className="w-full py-2 bg-ceo-gold hover:bg-yellow-400 text-ceo-navy text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Download size={14} /> Download Original Asset
                    </button>
                    {isEditMode && role === 'CEO' && (
                      <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Tag size={14} /> Edit Asset Metadata
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* 4. CMS BULK UPLOAD MODAL */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <UploadCloud className="text-ceo-gold"/> Bulk Upload Assets
                </h3>
                <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>

              <div className="border-2 border-dashed border-ceo-gold/50 rounded-2xl p-12 flex flex-col items-center justify-center bg-ceo-gold/5 hover:bg-ceo-gold/10 transition-colors cursor-pointer mb-6 text-center">
                <UploadCloud size={48} className="text-ceo-gold mb-4" />
                <p className="text-white font-bold text-lg mb-2">Drag & Drop Media Files Here</p>
                <p className="text-sm text-slate-400 mb-6">Support for JPG, PNG, MP4, and PDF (Up to 5GB total)</p>
                <button className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg border border-slate-700">Browse Files</button>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                  <span>Processing Rules</span>
                  <span className="text-emerald-500">Active</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 size={12} className="text-emerald-500"/> AI Vision Auto-Tagging Enabled</div>
                <div className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 size={12} className="text-emerald-500"/> Automated Lossless Compression</div>
                <div className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 size={12} className="text-emerald-500"/> Exif Data Extraction</div>
              </div>

              <div className="flex justify-end gap-4">
                <button onClick={() => setIsUploadModalOpen(false)} className="px-6 py-3 text-slate-300 hover:text-white font-bold transition-colors">Cancel</button>
                <button onClick={() => setIsUploadModalOpen(false)} className="px-6 py-3 bg-ceo-gold hover:bg-yellow-400 text-ceo-navy font-bold rounded-xl transition-colors">
                  Begin Upload Sequence
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CeoGallery;

// Placeholder for missing icons
const CheckCircle2 = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
