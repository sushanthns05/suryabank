import React, { useState } from 'react';
import { extendedAwardsList } from '../../../pages/ceo/CeoMockData';
import { ChevronDown, Trophy, MapPin, Calendar, Award } from 'lucide-react';

const InteractiveTimeline = ({ onAwardClick }) => {
  const [filterYear, setFilterYear] = useState('All');
  
  const years = ['All', ...new Set(extendedAwardsList.map(a => a.year))].sort((a, b) => b === 'All' ? -1 : b.localeCompare(a));
  
  const filteredAwards = filterYear === 'All' 
    ? extendedAwardsList 
    : extendedAwardsList.filter(a => a.year === filterYear);

  // Group by year
  const grouped = filteredAwards.reduce((acc, award) => {
    if (!acc[award.year]) acc[award.year] = [];
    acc[award.year].push(award);
    return acc;
  }, {});

  const sortedYears = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-bold flex items-center gap-2">
            <Trophy className="text-ceo-gold" /> Recognition Timeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">Explore our history of global excellence.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Filter:</span>
          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:border-ceo-gold focus:outline-none"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-12">
        {sortedYears.map((year, index) => (
          <div key={year} className="relative animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
            {/* Year Marker */}
            <div className="absolute -left-[33px] bg-slate-900 border-2 border-ceo-gold text-ceo-gold font-bold text-xs rounded-full w-16 h-8 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] z-10">
              {year}
            </div>

            <div className="pl-12 space-y-6 pt-1">
              {grouped[year].map((award, i) => (
                <div 
                  key={award.id}
                  onClick={() => onAwardClick && onAwardClick(award)}
                  className="group relative bg-slate-950/50 border border-slate-800 rounded-2xl p-5 hover:border-ceo-gold/50 hover:bg-slate-900 transition-all cursor-pointer overflow-hidden shadow-lg"
                >
                  {/* Subtle glass reflection */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  
                  <div className="flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform group-hover:border-ceo-gold/30">
                      <Award className="text-ceo-gold opacity-80" size={28} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full bg-slate-800">
                          {award.category}
                        </span>
                        <span className="text-[10px] font-bold text-ceo-gold flex items-center gap-1">
                          <MapPin size={10} /> {award.location}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white font-serif group-hover:text-ceo-gold transition-colors">
                        {award.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 mb-3">
                        {award.organization}
                      </p>
                      
                      <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                        {award.description}
                      </p>
                    </div>

                    <div className="hidden md:flex shrink-0 items-center justify-center self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0">
                      <div className="w-10 h-10 rounded-full bg-ceo-gold/10 border border-ceo-gold/30 flex items-center justify-center">
                        <ChevronDown className="text-ceo-gold -rotate-90" size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTimeline;
