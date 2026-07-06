import React from 'react';
import { investorViewData } from '../../../pages/ceo/CeoMockData';
import { Briefcase, LineChart, PieChart as PieIcon, Lightbulb } from 'lucide-react';

const InvestorView = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-8">
        <Briefcase className="text-ceo-gold" />
        <h2 className="text-2xl font-serif text-white font-bold">Investor & Shareholder Briefing</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Value Creation */}
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <LineChart className="text-emerald-400" size={16} />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Value Creation Strategy</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{investorViewData.valueCreation}</p>
        </div>

        {/* Capital Allocation */}
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <PieIcon className="text-blue-400" size={16} />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Capital Allocation</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{investorViewData.capitalAllocation}</p>
        </div>

        {/* Innovation Pipeline */}
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-amber-400" size={16} />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Innovation Pipeline</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{investorViewData.innovationPipeline}</p>
        </div>

        {/* Future Outlook */}
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ceo-gold/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="text-ceo-gold" size={16} />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Future Outlook</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{investorViewData.futureOutlook}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvestorView;
