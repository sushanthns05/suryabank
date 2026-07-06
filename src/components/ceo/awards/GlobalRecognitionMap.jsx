import React, { useState } from 'react';
import { extendedAwardsList } from '../../../pages/ceo/CeoMockData';
import { Globe2, MapPin } from 'lucide-react';

const GlobalRecognitionMap = ({ onAwardClick }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  // Simplified pseudo-map dots representing regions where Surya Bank has won awards.
  // In a real app with react-simple-maps, this would be a full topology map.
  // For zero external dependencies, we'll build a stylized dot-matrix abstract map.
  
  // Approximate relative positions (x, y) from 0 to 100 percentages.
  const mapNodes = [
    { country: 'United States', x: 20, y: 35, id: 'aw4' },
    { country: 'United Kingdom', x: 45, y: 30, id: 'aw1' },
    { country: 'Switzerland', x: 50, y: 35, id: 'aw3' },
    { country: 'Hong Kong', x: 80, y: 45, id: 'aw5' },
    { country: 'Singapore', x: 78, y: 60, id: 'aw2' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl overflow-hidden relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10">
        <div>
          <h2 className="text-2xl font-serif text-white font-bold flex items-center gap-2">
            <Globe2 className="text-ceo-gold" /> Global Recognition Map
          </h2>
          <p className="text-xs text-slate-400 mt-1">Interactive overview of our worldwide achievements.</p>
        </div>
        <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mt-4 sm:mt-0">
          <span className="w-2 h-2 rounded-full bg-ceo-gold animate-pulse"></span> Active Regions
        </div>
      </div>

      <div className="relative w-full aspect-[2/1] bg-slate-950/50 rounded-2xl border border-slate-800/50 overflow-hidden">
        {/* Abstract Map Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Map Nodes */}
        {mapNodes.map((node, i) => {
          const award = extendedAwardsList.find(a => a.id === node.id);
          const isHovered = hoveredCountry === node.country;
          
          return (
            <div 
              key={i}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredCountry(node.country)}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => onAwardClick && onAwardClick(award)}
            >
              {/* Pulse effect */}
              <div className="absolute inset-0 bg-ceo-gold rounded-full opacity-40 animate-ping" style={{ width: '100%', height: '100%', transform: 'scale(2.5)' }}></div>
              
              {/* Core Node */}
              <div className="relative w-4 h-4 bg-ceo-gold rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(212,175,55,0.8)] z-10 transition-transform duration-300 hover:scale-150"></div>
              
              {/* Tooltip */}
              {isHovered && award && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl animate-in fade-in zoom-in-95 pointer-events-none z-50">
                  <div className="text-[10px] text-ceo-gold font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin size={10} /> {award.location}
                  </div>
                  <h4 className="text-white text-xs font-bold leading-tight mb-1">{award.title}</h4>
                  <p className="text-[9px] text-slate-400 uppercase">{award.organization}</p>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Aesthetic connection lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20">
          <path d="M 20% 35% Q 30% 20% 45% 30% T 50% 35% T 80% 45% T 78% 60%" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

      </div>
    </div>
  );
};

export default GlobalRecognitionMap;
