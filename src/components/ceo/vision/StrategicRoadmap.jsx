import React, { useState } from 'react';
import { extendedVisionPillars } from '../../../pages/ceo/CeoMockData';
import { Target, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Activity, Users, Lightbulb, Link2 } from 'lucide-react';

const StrategicRoadmap = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-bold flex items-center gap-2">
            <Target className="text-ceo-gold" /> Strategic Blueprint & Roadmap
          </h2>
          <p className="text-xs text-slate-400 mt-1">Detailed execution paths for all foundational pillars.</p>
        </div>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[28px] before:w-px before:bg-slate-800">
        {extendedVisionPillars.map((pillar, index) => {
          const isExpanded = expandedId === pillar.id;
          const statusColor = pillar.health === 'On Track' ? 'text-emerald-400' : (pillar.health === 'Delayed' ? 'text-rose-400' : 'text-amber-400');
          const StatusIcon = pillar.health === 'On Track' ? ShieldCheck : (pillar.health === 'Delayed' ? AlertTriangle : Activity);

          return (
            <div key={pillar.id} className="relative z-10 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
              <div 
                onClick={() => toggleExpand(pillar.id)}
                className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  isExpanded ? 'bg-slate-950 border-ceo-gold/40' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'
                }`}
              >
                {/* Connection Node */}
                <div className={`w-6 h-6 mt-1 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isExpanded ? 'bg-slate-900 border-ceo-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-slate-900 border-slate-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-ceo-gold' : 'bg-slate-500'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-ceo-gold transition-colors">{pillar.title}</h3>
                      <p className="text-xs text-slate-400">{pillar.desc}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                        <StatusIcon size={12} /> {pillar.health}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-lg uppercase tracking-wider font-bold">
                        {pillar.phase}
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-slate-800/50 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                      
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Lightbulb size={14} /> Core Objectives
                          </h4>
                          <ul className="space-y-2">
                            {pillar.objectives.map((obj, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-ceo-gold mt-1">•</span> {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Target size={14} /> Key Performance Indicators
                          </h4>
                          <ul className="space-y-2">
                            {pillar.kpis.map((kpi, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-emerald-400 mt-1">✓</span> {kpi}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Budget Allocation</p>
                            <p className="text-lg font-bold text-white">{pillar.budget}</p>
                          </div>
                          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Completion</p>
                            <p className="text-lg font-bold text-white">{pillar.completion}</p>
                          </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Users size={12} /> Executive Owner
                          </h4>
                          <p className="text-sm font-bold text-ceo-gold">{pillar.owner}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Link2 size={14} /> Strategic Mitigation
                          </h4>
                          <p className="text-sm text-slate-400 italic">"{pillar.mitigation}"</p>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StrategicRoadmap;
