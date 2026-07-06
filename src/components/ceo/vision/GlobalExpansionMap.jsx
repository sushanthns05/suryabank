import React, { useState } from 'react';
import { globalExpansionData } from '../../../pages/ceo/CeoMockData';
import { Globe2, MapPin } from 'lucide-react';

const GlobalExpansionMap = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10">
        <div>
          <h2 className="text-2xl font-serif text-white font-bold flex items-center gap-2">
            <Globe2 className="text-ceo-gold" /> Global Expansion Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">Mapping our institutional footprint and planned market entries.</p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Active
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 border border-amber-300"></span> Planned
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[2/1] bg-slate-950/80 rounded-2xl border border-slate-800/50 overflow-hidden">
        {/* Abstract Map Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Map Nodes */}
        {globalExpansionData.nodes.map((node, i) => {
          const isActive = node.status === 'active';
          const isHovered = hoveredNode === node.country;
          const nodeColor = isActive ? 'bg-emerald-500' : 'bg-amber-500';
          const pulseColor = isActive ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)';

          return (
            <div 
              key={i}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredNode(node.country)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Pulse effect */}
              {isActive && (
                <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: pulseColor, width: '100%', height: '100%', transform: 'scale(3)' }}></div>
              )}
              
              {/* Core Node */}
              <div className={`relative w-3 h-3 ${nodeColor} rounded-full border-2 border-slate-900 shadow-lg z-10 transition-transform duration-300 hover:scale-150`}></div>
              
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-slate-800 border border-slate-700 rounded-lg p-2 shadow-2xl animate-in fade-in zoom-in-95 pointer-events-none z-50 text-center">
                  <h4 className="text-white text-xs font-bold leading-tight mb-1">{node.country}</h4>
                  <p className="text-[9px] text-ceo-gold uppercase font-bold tracking-wider">{node.metric}</p>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Connection lines representing data/money flow */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30">
          {/* NYC to London */}
          <path d="M 20% 35% Q 30% 20% 45% 30%" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
          {/* London to Dubai */}
          <path d="M 45% 30% Q 55% 40% 60% 45%" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" />
          {/* Dubai to SG */}
          <path d="M 60% 45% Q 70% 55% 78% 60%" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
          {/* SG to HK */}
          <path d="M 78% 60% Q 85% 50% 80% 45%" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" />
        </svg>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dash {
            to { stroke-dashoffset: -100; }
          }
        `}} />
      </div>
    </div>
  );
};

export default GlobalExpansionMap;
