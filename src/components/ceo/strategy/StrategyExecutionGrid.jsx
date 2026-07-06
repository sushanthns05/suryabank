import React, { useState } from 'react';
import { extendedStrategyPillars } from '../../../pages/ceo/CeoMockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { X, Target, Zap, Leaf, Users, ShieldAlert, Rocket, Briefcase, Activity } from 'lucide-react';

const ICON_MAP = {
  Users: Users,
  Target: Target,
  Zap: Zap,
  Leaf: Leaf
};

const StrategyExecutionGrid = () => {
  const [selectedPillar, setSelectedPillar] = useState(null);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="text-ceo-gold" />
        <h2 className="text-2xl font-serif text-white font-bold">Strategy Execution Center</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {extendedStrategyPillars.map((pillar) => {
          const IconComp = ICON_MAP[pillar.icon] || Target;
          return (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar)}
              className="text-left p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-ceo-gold/40 transition-all shadow-xl hover:-translate-y-1 duration-300 flex flex-col justify-between group h-full"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-ceo-gold group-hover:bg-ceo-gold/10 transition-colors shadow-lg">
                    <IconComp size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-950 px-3 py-1 rounded-full uppercase tracking-wider border border-slate-800">
                    {pillar.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white font-bold group-hover:text-ceo-gold transition-colors">{pillar.title}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">{pillar.department}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{pillar.mission}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Progress</span>
                  <span className="text-sm font-bold text-emerald-400">{pillar.progress}%</span>
                </div>
                <span className="text-[11px] font-bold text-ceo-gold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  Open Center →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Modal Overlay */}
      {selectedPillar && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" 
            onClick={() => setSelectedPillar(null)}
          />

          <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedPillar(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all z-10"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-ceo-gold/10 border border-ceo-gold/30 flex items-center justify-center text-ceo-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                {React.createElement(ICON_MAP[selectedPillar.icon] || Target, { size: 32 })}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold px-3 py-1 bg-ceo-gold/10 rounded-full border border-ceo-gold/20 inline-block mb-2">
                  Executive Execution Center
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-white font-bold">{selectedPillar.title}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Mission & Outcomes */}
              <div className="lg:col-span-2 space-y-8">
                
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-2">
                    <Target size={14} /> Mission Statement
                  </h3>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed font-serif italic">"{selectedPillar.mission}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">Strategic Objectives</h3>
                    <ul className="space-y-3">
                      {selectedPillar.objectives.map((obj, idx) => (
                        <li key={idx} className="text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                          <span className="text-ceo-gold mt-1">•</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
                      <ShieldAlert size={14} className="text-rose-400" /> Strategic Risks
                    </h3>
                    <ul className="space-y-3">
                      {selectedPillar.risks.map((risk, idx) => (
                        <li key={idx} className="text-sm text-rose-300 leading-relaxed flex items-start gap-3 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                          <span className="text-rose-400 mt-0.5"><ShieldAlert size={14} /></span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20">
                  <h3 className="text-xs uppercase tracking-wider text-emerald-500 font-bold mb-2 flex items-center gap-2">
                    <Rocket size={14} /> Mitigation Strategy
                  </h3>
                  <p className="text-sm text-emerald-400/90">{selectedPillar.mitigation}</p>
                </div>

                {/* Chart */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Growth Trend</span>
                    <span className="text-xs font-bold text-ceo-gold bg-ceo-gold/10 px-3 py-1 rounded-full">{selectedPillar.growthLabel}</span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedPillar.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="year" stroke="#475569" strokeWidth={0.5} tickLine={false} tick={{fontSize: 10}} />
                        <YAxis stroke="#475569" strokeWidth={0.5} tickLine={false} tick={{fontSize: 10}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#d4af37', fontWeight: 'bold' }}
                          labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="assets" stroke="#D4AF37" strokeWidth={3} fill="url(#colorAssets)" activeDot={{ r: 6, fill: '#fff', stroke: '#D4AF37' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Right Column: Execution Ownership & KPIs */}
              <div className="space-y-6">
                
                {/* Executive Ownership */}
                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
                    <Users size={14} /> Executive Ownership
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Executive Sponsor</p>
                      <p className="text-sm text-ceo-gold font-bold">{selectedPillar.sponsor}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Business Unit</p>
                      <p className="text-sm text-white font-bold">{selectedPillar.department}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Project Manager</p>
                      <p className="text-sm text-white font-bold">{selectedPillar.projectManager}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Supporting Teams</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedPillar.supportingTeams.map((team, idx) => (
                          <span key={idx} className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md">
                            {team}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
                    <Activity size={14} /> Strategic Logistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Budget Allocation</p>
                      <p className="text-lg text-white font-bold">{selectedPillar.budget}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Timeline</p>
                      <p className="text-xs text-white font-bold mt-1">{selectedPillar.timeline}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Expected ROI</p>
                    <p className="text-sm text-emerald-400 font-bold">{selectedPillar.roi}</p>
                  </div>
                </div>

                {/* Execution KPIs */}
                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">Execution Metrics</h3>
                  <div className="space-y-3">
                    {selectedPillar.metrics.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800/50">
                        <span className="text-xs font-bold text-slate-400">{m.label}</span>
                        <span className="text-sm font-bold text-white">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StrategyExecutionGrid;
