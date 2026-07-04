import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { galleryItems } from './CeoMockData';

const CeoGallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const categories = ['All', 'Leadership', 'Conferences', 'Awards', 'Banking Events', 'CSR', 'International Visits'];

  const filteredItems = galleryItems.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  const openLightbox = (item) => {
    const idx = galleryItems.findIndex(i => i.id === item.id);
    setLightboxIdx(idx);
  };

  const closeLightbox = () => {
    setLightboxIdx(null);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setLightboxIdx(prev => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setLightboxIdx(prev => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Media Archives</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">Image Gallery</h1>
        <p className="text-xs text-slate-400">View official photographic records of leadership convocations, international collaborations, and community outreach.</p>
      </div>

      {/* Category Tabs */}
      <section className="flex gap-2 overflow-x-auto pb-2 justify-center">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              activeCategory === cat
                ? 'bg-ceo-gold border-ceo-gold text-ceo-navy'
                : 'bg-slate-905 bg-slate-900 border-slate-805 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Grid Layout (Masonry simulation) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => openLightbox(item)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-805 aspect-video cursor-pointer shadow-lg hover:border-ceo-gold/40 transition-colors"
          >
            {/* Image */}
            <img 
              src={item.imageUrl} 
              alt={item.caption} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 duration-500"
              loading="lazy"
            />

            {/* Hover overlay details */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-ceo-gold tracking-widest">{item.category}</span>
                <h4 className="text-xs font-semibold text-white truncate">{item.caption}</h4>
                <div className="flex justify-between items-center text-[9px] text-slate-400">
                  <span>{item.date}</span>
                  <span className="flex items-center gap-0.5"><ZoomIn size={10} /> Zoom View</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox Modal Overlay */}
      {lightboxIdx !== null && (
        <div 
          className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur flex flex-col justify-between p-4"
          onClick={closeLightbox}
        >
          {/* Top Bar controls */}
          <div className="flex justify-between items-center text-xs text-slate-400 w-full max-w-5xl mx-auto py-2">
            <span>Press Archive Image ({lightboxIdx + 1} / {galleryItems.length})</span>
            <button 
              onClick={closeLightbox}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Center Image & Nav */}
          <div className="relative flex-grow flex items-center justify-center max-w-5xl mx-auto w-full">
            {/* Left Nav Button */}
            <button 
              onClick={showPrev}
              className="absolute left-2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-800/80 text-white transition-colors z-20"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Lightbox Active Image */}
            <img 
              src={galleryItems[lightboxIdx].imageUrl} 
              alt={galleryItems[lightboxIdx].caption} 
              className="max-h-[70vh] max-w-[85vw] object-contain rounded-lg border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Stop closing on click
            />

            {/* Right Nav Button */}
            <button 
              onClick={showNext}
              className="absolute right-2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-800/80 text-white transition-colors z-20"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Caption Info */}
          <div className="w-full max-w-2xl mx-auto text-center space-y-2 py-4">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-ceo-gold/10 text-ceo-gold text-[10px] uppercase font-bold tracking-widest border border-ceo-gold/20">
              {galleryItems[lightboxIdx].category}
            </span>
            <p className="text-sm font-semibold text-white leading-relaxed">{galleryItems[lightboxIdx].caption}</p>
            <span className="block text-[10px] text-slate-500 font-mono">Date Captured: {galleryItems[lightboxIdx].date} | Surya Bank Corporate Press Assets</span>
          </div>

        </div>
      )}

    </div>
  );
};

export default CeoGallery;
