import React from 'react';
import { leadershipImpactData } from '../../../pages/ceo/CeoMockData';
import { Lightbulb, ShieldCheck, Landmark } from 'lucide-react';

const LeadershipImpact = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-purple-500/30 transition-colors shadow-xl group">
        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <Lightbulb className="text-purple-400" size={24} />
        </div>
        <h3 className="text-lg font-serif text-white font-bold mb-3">Innovation & Tech</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {leadershipImpactData.innovation}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-emerald-500/30 transition-colors shadow-xl group">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <ShieldCheck className="text-emerald-400" size={24} />
        </div>
        <h3 className="text-lg font-serif text-white font-bold mb-3">ESG & Sustainability</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {leadershipImpactData.esg}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-blue-500/30 transition-colors shadow-xl group">
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <Landmark className="text-blue-400" size={24} />
        </div>
        <h3 className="text-lg font-serif text-white font-bold mb-3">Corporate Governance</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {leadershipImpactData.governance}
        </p>
      </div>
    </div>
  );
};

export default LeadershipImpact;
