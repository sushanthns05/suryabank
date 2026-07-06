import React from 'react';
import { extendedVisionPillars } from '../../../pages/ceo/CeoMockData';
import { Activity } from 'lucide-react';

const VisionProgressTracker = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-8">
        <Activity className="text-ceo-gold" />
        <h2 className="text-2xl font-serif text-white font-bold">Execution Health</h2>
      </div>

      <div className="space-y-6">
        {extendedVisionPillars.map((pillar, i) => (
          <div key={pillar.id} className="group" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-ceo-gold transition-colors">{pillar.title}</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{pillar.owner}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-white">{pillar.progress}%</span>
              </div>
            </div>
            
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-ceo-navy via-ceo-gold to-yellow-300 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${pillar.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisionProgressTracker;
