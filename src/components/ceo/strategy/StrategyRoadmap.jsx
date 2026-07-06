import React from 'react';
import { strategyRoadmapNodes } from '../../../pages/ceo/CeoMockData';
import { Network, ArrowDown, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

const StrategyRoadmap = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-ceo-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-10 relative z-10">
        <Network className="text-ceo-gold" />
        <h2 className="text-2xl font-serif text-white font-bold">Cascading Strategy Roadmap</h2>
      </div>

      <div className="flex flex-col items-center space-y-6 relative z-10">
        
        {/* Level 1: Vision */}
        <div className="w-full max-w-lg bg-gradient-to-b from-ceo-navy to-slate-900 border border-ceo-gold/40 p-5 rounded-2xl text-center shadow-[0_0_20px_rgba(212,175,55,0.15)] transform hover:scale-105 transition-transform cursor-default">
          <p className="text-[10px] text-ceo-gold uppercase font-bold tracking-widest mb-2">Corporate Vision 2030</p>
          <h3 className="text-lg font-bold text-white font-serif">{strategyRoadmapNodes.vision}</h3>
        </div>

        <ArrowDown className="text-slate-700 animate-bounce" size={24} />

        {/* Level 2: Objectives */}
        <div className="w-full flex flex-col md:flex-row justify-center gap-4">
          {strategyRoadmapNodes.objectives.map((obj, i) => (
            <div key={i} className="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-xl hover:border-slate-600 transition-colors">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-1">Strategic Objective</p>
              <h4 className="text-sm font-bold text-white mb-3">{obj.name}</h4>
              <div className="flex justify-between items-center text-xs">
                <span className={`px-2 py-0.5 rounded-full font-bold ${obj.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  {obj.status}
                </span>
                <span className="text-slate-400 font-bold">{obj.progress}%</span>
              </div>
              {/* Progress bar */}
              <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${obj.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        <ArrowDown className="text-slate-700" size={24} />

        {/* Level 3: Pillars & Budgets */}
        <div className="w-full flex flex-col md:flex-row justify-center gap-4">
          {strategyRoadmapNodes.pillars.map((pillar, i) => (
            <div key={i} className="flex-1 bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors">
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-1">Pillar: {pillar.objective}</p>
                <h4 className="text-sm font-bold text-white group-hover:text-ceo-gold transition-colors">{pillar.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-300 block">{pillar.budget}</span>
                <ChevronRight size={14} className="text-slate-500 inline-block mt-1 group-hover:text-ceo-gold transition-colors" />
              </div>
            </div>
          ))}
        </div>

        <ArrowDown className="text-slate-700" size={24} />

        {/* Level 4: Projects */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {strategyRoadmapNodes.projects.map((proj, i) => {
            const isCompleted = proj.status === 'Completed';
            const isDelayed = proj.status === 'Delayed';
            const StatusIcon = isCompleted ? CheckCircle2 : Clock;
            const statusColor = isCompleted ? 'text-emerald-400' : (isDelayed ? 'text-rose-400' : 'text-blue-400');

            return (
              <div key={i} className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-2 truncate">{proj.pillar}</p>
                <h5 className="text-xs font-bold text-white mb-3">{proj.name}</h5>
                <div className="flex justify-between items-center mt-auto border-t border-slate-800/50 pt-2">
                  <span className={`text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider ${statusColor}`}>
                    <StatusIcon size={12} /> {proj.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{proj.eta}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default StrategyRoadmap;
