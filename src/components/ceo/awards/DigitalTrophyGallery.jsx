import React from 'react';
import { extendedAwardsList } from '../../../pages/ceo/CeoMockData';
import { Award, Search, Filter } from 'lucide-react';

const DigitalTrophyGallery = ({ onAwardClick }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-bold flex items-center gap-2">
            <Award className="text-ceo-gold" /> Digital Trophy Gallery
          </h2>
          <p className="text-xs text-slate-400 mt-1">Interactive showcase of our highest honors.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search awards..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-ceo-gold focus:outline-none"
            />
          </div>
          <button className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 hover:text-ceo-gold hover:border-ceo-gold/50 transition-colors">
            <Filter size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
        {extendedAwardsList.map((award, i) => (
          <div 
            key={award.id}
            onClick={() => onAwardClick && onAwardClick(award)}
            className="group relative h-72 bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:border-ceo-gold/50 transform-style-3d hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] shadow-xl"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* 3D Gold Trophy Representation */}
            <div className="relative w-32 h-32 mb-6 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-y-180">
              <div className="absolute inset-0 bg-ceo-gold rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              
              {/* Pseudo-3D Trophy constructed with CSS */}
              <div className="absolute inset-0 flex flex-col items-center justify-end drop-shadow-2xl">
                {/* Cup */}
                <div className="w-16 h-16 bg-gradient-to-b from-yellow-300 via-ceo-gold to-yellow-700 rounded-b-full border-t-4 border-yellow-200 shadow-inner relative z-10">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-yellow-900/30 rounded-full blur-[2px]"></div>
                </div>
                {/* Stem */}
                <div className="w-4 h-8 bg-gradient-to-r from-yellow-700 via-ceo-gold to-yellow-600 relative z-0 -mt-1"></div>
                {/* Base */}
                <div className="w-20 h-4 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-t-lg shadow-lg relative z-20"></div>
                <div className="w-24 h-4 bg-slate-800 border-t border-slate-600 rounded-b-lg shadow-2xl relative z-10"></div>
              </div>
            </div>

            <div className="text-center transform transition-transform duration-500 translate-z-10 group-hover:translate-y-[-10px]">
              <span className="text-ceo-gold font-bold text-xs mb-1 block">{award.year}</span>
              <h3 className="text-white font-serif text-sm font-bold leading-tight px-2">{award.title}</h3>
            </div>

            {/* Hover Reveal Details */}
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center border border-ceo-gold/30">
              <span className="px-3 py-1 bg-ceo-gold/20 text-ceo-gold text-[10px] font-bold uppercase rounded-full mb-3">
                {award.category}
              </span>
              <h4 className="text-white font-bold text-sm mb-2">{award.organization}</h4>
              <p className="text-xs text-slate-400 line-clamp-3 mb-4">{award.officialCitation}</p>
              <button className="text-[10px] font-bold uppercase tracking-widest text-ceo-gold border-b border-ceo-gold/30 pb-0.5 hover:border-ceo-gold transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalTrophyGallery;
