import React, { useState } from 'react';
import { globalExpansionData } from '../../../pages/ceo/CeoMockData';
import { Globe2, Crosshair, ArrowRight, TrendingUp } from 'lucide-react';

const StrategyExpansionMap = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Additional strategy data appended to the existing nodes
  const strategyNodes = globalExpansionData.nodes.map(node => ({
    ...node,
    partnership: node.country === 'Singapore' ? 'Monetary Authority of Singapore (MAS)' : (node.country === 'London' ? 'Barclays Syndicate' : 'Internal Build'),
    potential: node.status === 'active' ? 'Captured' : '$2.4B Market Cap'
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-bold flex items-center gap-2">
            <Globe2 className="text-ceo-gold" /> Global Expansion Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">Tracking current operations, pipelines, and market potential.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Active Market
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 border border-amber-300"></span> Pipeline Target
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Map */}
        <div className="lg:col-span-2 relative w-full aspect-[2/1.2] bg-slate-950/80 rounded-2xl border border-slate-800/50 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          {strategyNodes.map((node, i) => {
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
                {isActive && (
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: pulseColor, width: '100%', height: '100%', transform: 'scale(3)' }}></div>
                )}
                <div className={`relative w-4 h-4 ${nodeColor} rounded-full border-2 border-slate-900 shadow-lg z-10 transition-transform duration-300 hover:scale-150`}></div>
                
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-2xl animate-in fade-in zoom-in-95 pointer-events-none z-50">
                    <h4 className="text-white text-sm font-bold mb-1">{node.country}</h4>
                    <p className="text-[10px] text-emerald-400 font-bold mb-2">{node.metric}</p>
                    <div className="space-y-1 pt-2 border-t border-slate-700">
                      <p className="text-[9px] text-slate-400">Partner: <span className="text-white">{node.partnership}</span></p>
                      <p className="text-[9px] text-slate-400">Potential: <span className="text-ceo-gold">{node.potential}</span></p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30">
            <path d="M 20% 35% Q 30% 20% 45% 30%" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
            <path d="M 45% 30% Q 55% 40% 60% 45%" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M 60% 45% Q 70% 55% 78% 60%" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
          </svg>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes dash { to { stroke-dashoffset: -100; } }
          `}} />
        </div>

        {/* Sidebar Data */}
        <div className="space-y-6">
          <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Crosshair size={14} className="text-amber-500" /> Pipeline Targets
            </h3>
            <div className="space-y-3">
              {strategyNodes.filter(n => n.status === 'planned').map((node, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-ceo-gold transition-colors">{node.country}</h4>
                    <p className="text-[10px] text-slate-500">{node.partnership}</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-ceo-gold transition-colors transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-500" /> Regional KPIs
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-bold text-slate-300">APAC Growth</span>
                  <span className="text-xs font-bold text-emerald-400">+14.2%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-bold text-slate-300">EMEA Penetration</span>
                  <span className="text-xs font-bold text-blue-400">+8.4%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StrategyExpansionMap;
