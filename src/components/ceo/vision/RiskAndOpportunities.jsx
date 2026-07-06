import React, { useState } from 'react';
import { extendedVisionPillars } from '../../../pages/ceo/CeoMockData';
import { ShieldAlert, Rocket, ChevronRight } from 'lucide-react';

const RiskAndOpportunities = () => {
  const [selectedPillarId, setSelectedPillarId] = useState(extendedVisionPillars[0].id);
  const activePillar = extendedVisionPillars.find(p => p.id === selectedPillarId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar Selector */}
      <div className="w-full md:w-1/3 bg-slate-950/50 border-r border-slate-800 p-6">
        <h3 className="text-lg font-serif text-white font-bold mb-4">Strategic Radar</h3>
        <div className="space-y-2">
          {extendedVisionPillars.map(pillar => (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillarId(pillar.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                selectedPillarId === pillar.id 
                  ? 'bg-ceo-gold/10 border border-ceo-gold/30 text-ceo-gold' 
                  : 'bg-transparent border border-transparent text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="text-sm font-bold truncate">{pillar.title}</span>
              <ChevronRight size={14} className={selectedPillarId === pillar.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} />
            </button>
          ))}
        </div>
      </div>

      {/* Details Area */}
      <div className="w-full md:w-2/3 p-6 md:p-8 animate-in fade-in duration-300">
        <h2 className="text-2xl font-bold text-white mb-8">{activePillar.title}</h2>
        
        <div className="space-y-8">
          {/* Risks */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="text-rose-400" size={18} />
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Strategic Risks</h3>
            </div>
            <ul className="space-y-3 mb-4">
              {activePillar.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-rose-400 mt-1">•</span> {risk}
                </li>
              ))}
            </ul>
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Mitigation Plan</p>
              <p className="text-sm text-slate-300">{activePillar.mitigation}</p>
            </div>
          </div>

          <div className="h-px bg-slate-800 w-full" />

          {/* Opportunities */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="text-emerald-400" size={18} />
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Growth Opportunities</h3>
            </div>
            <ul className="space-y-3">
              {activePillar.opportunities.map((opp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
                  <span className="text-emerald-400 mt-0.5"><Rocket size={14} /></span> {opp}
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default RiskAndOpportunities;
