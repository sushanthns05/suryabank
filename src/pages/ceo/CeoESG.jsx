import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Leaf, Users, ShieldAlert, Award, TrendingUp } from 'lucide-react';
import { esgData } from './CeoMockData';

const CeoESG = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Sustainable Development</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">ESG Dashboard</h1>
        <p className="text-xs text-slate-400">Track carbon footprints, green funding allocations, and gender diversity targets across operations sectors.</p>
      </div>

      {/* Overview stats cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Environmental */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-805 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
              <Leaf size={20} />
            </div>
            <h3 className="font-serif text-base text-white font-semibold">Environmental</h3>
          </div>
          <ul className="space-y-2">
            {esgData.environmental.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-slate-800 last:border-0 last:pb-0">
                <span className="text-slate-400">{item.label}</span>
                <strong className="text-white">{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-805 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users size={20} />
            </div>
            <h3 className="font-serif text-base text-white font-semibold">Social</h3>
          </div>
          <ul className="space-y-2">
            {esgData.social.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-slate-800 last:border-0 last:pb-0">
                <span className="text-slate-400">{item.label}</span>
                <strong className="text-white">{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Governance */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-805 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            <h3 className="font-serif text-base text-white font-semibold">Governance</h3>
          </div>
          <ul className="space-y-2">
            {esgData.governance.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-slate-800 last:border-0 last:pb-0">
                <span className="text-slate-400">{item.label}</span>
                <strong className="text-white">{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>

      </section>

      {/* Recharts Graphical Visuals Split */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Carbon reduction AreaChart */}
        <div className="bg-slate-950 border border-slate-855 rounded-3xl p-6 space-y-4 shadow-xl">
          <div>
            <h3 className="font-semibold text-sm text-white">Carbon Footprint Reduction</h3>
            <p className="text-[10px] text-slate-500">Metric Tons CO2 Equivalent (Scope 1 & 2 Emissions)</p>
          </div>

          <div className="h-56 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={esgData.charts.carbonReduction}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
              >
                <XAxis dataKey="year" stroke="#475569" strokeWidth={0.5} tickLine={false} />
                <YAxis stroke="#475569" strokeWidth={0.5} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="co2" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fill="rgba(16, 185, 129, 0.1)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-500 text-center">98.7% paperless banking systems achieved global-wide.</p>
        </div>

        {/* Diversity Progress BarChart */}
        <div className="bg-slate-950 border border-slate-855 rounded-3xl p-6 space-y-4 shadow-xl">
          <div>
            <h3 className="font-semibold text-sm text-white">Women in Leadership Roles</h3>
            <p className="text-[10px] text-slate-500">Percentage share of VP level and above positions</p>
          </div>

          <div className="h-56 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={esgData.charts.diversityProgress}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
              >
                <XAxis dataKey="year" stroke="#475569" strokeWidth={0.5} tickLine={false} />
                <YAxis stroke="#475569" strokeWidth={0.5} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                  itemStyle={{ color: '#a855f7' }}
                />
                <Bar 
                  dataKey="ratio" 
                  fill="#A855F7" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-500 text-center">Goal: Achieve 45% gender parity across VP desks by 2027.</p>
        </div>

      </section>

      {/* Sustainable finance brief */}
      <section className="bg-slate-900 border border-slate-805 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left max-w-lg">
          <h3 className="font-serif text-lg text-white font-bold flex items-center justify-center md:justify-start gap-2">
            <Award className="text-ceo-gold" size={20} /> Sustainable Green Bond Framework
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our green finance framework has been independently audited and certified by international climate monitoring organizations, guaranteeing zero carbon-washing.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-750 text-xs font-semibold text-white transition-colors shrink-0">
          Download ESG Framework PDF
        </button>
      </section>

    </div>
  );
};

export default CeoESG;
