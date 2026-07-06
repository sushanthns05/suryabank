import React from 'react';
import { extendedVisionPillars } from '../../../pages/ceo/CeoMockData';
import { Layers, CheckCircle2, Circle } from 'lucide-react';

const InitiativesGrid = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-8">
        <Layers className="text-ceo-gold" />
        <h2 className="text-2xl font-serif text-white font-bold">Strategic Initiatives Portfolio</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {extendedVisionPillars.map((initiative, i) => (
          <div key={initiative.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-ceo-gold/30 transition-all shadow-xl flex flex-col group">
            
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-[9px] font-bold uppercase tracking-widest text-slate-400 rounded-full">
                {initiative.phase}
              </span>
              <span className="text-sm font-bold text-emerald-400">{initiative.progress}%</span>
            </div>

            <h3 className="text-xl font-bold text-white font-serif mb-2 group-hover:text-ceo-gold transition-colors">{initiative.title}</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed flex-1">{initiative.detail}</p>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Key Objectives</p>
                <ul className="space-y-1.5">
                  {initiative.objectives.slice(0, 2).map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                      <span className="truncate">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Budget Allocation</p>
                  <p className="text-sm font-bold text-white">{initiative.budget}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Target Date</p>
                  <p className="text-sm font-bold text-white">{initiative.completion}</p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default InitiativesGrid;
