import React from 'react';
import { macroEconomicData } from '../../../pages/ceo/CeoMockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Radar, TrendingUp, TrendingDown, Minus, Briefcase } from 'lucide-react';

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp size={16} className="text-emerald-400" />;
  if (trend === 'down') return <TrendingDown size={16} className="text-rose-400" />;
  return <Minus size={16} className="text-slate-400" />;
};

const MarketIntelligence = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-8">
        <Radar className="text-ceo-gold" />
        <h2 className="text-2xl font-serif text-white font-bold">Market Intelligence & Competitor Benchmarking</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Macro Indicators */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">Macroeconomic Indicators</h3>
          <div className="grid grid-cols-2 gap-4">
            {macroEconomicData.indicators.map((ind, i) => (
              <div key={i} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{ind.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">{ind.value}</span>
                  <TrendIcon trend={ind.trend} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Matrix */}
        <div className="lg:col-span-2">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">Tier-1 Bank Competitor Analysis</h3>
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Institution</th>
                    <th className="px-6 py-4">Digital Adoption</th>
                    <th className="px-6 py-4">ROE</th>
                    <th className="px-6 py-4">Cost-Income Ratio</th>
                    <th className="px-6 py-4">NPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {macroEconomicData.competitorComparison.map((comp, i) => {
                    const isSurya = comp.bank === "Surya Bank";
                    return (
                      <tr key={i} className={isSurya ? 'bg-ceo-gold/5' : 'hover:bg-slate-900/50 transition-colors'}>
                        <td className="px-6 py-4 font-bold flex items-center gap-2">
                          {isSurya && <Briefcase size={14} className="text-ceo-gold" />}
                          <span className={isSurya ? 'text-ceo-gold' : 'text-slate-300'}>{comp.bank}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={isSurya ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{comp.digitalAdoption}%</span>
                            {isSurya && <div className="h-1 w-12 bg-slate-800 rounded-full"><div className="h-full bg-emerald-400 rounded-full w-[94%]" /></div>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white font-medium">{comp.roe}%</td>
                        <td className="px-6 py-4 text-slate-400">{comp.costIncomeRatio}%</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${comp.npa <= 1.2 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {comp.npa}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketIntelligence;
