import React from 'react';
import { awardsAnalytics } from '../../../pages/ceo/CeoMockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#D4AF37', '#38BDF8', '#34D399', '#A78BFA', '#F472B6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="text-white text-xs font-bold mb-1">{label || payload[0].name}</p>
        <p className="text-ceo-gold text-lg font-bold">
          {payload[0].value} <span className="text-[10px] text-slate-400 font-normal">Awards</span>
        </p>
      </div>
    );
  }
  return null;
};

const ExecutiveAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Awards by Year - Area Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-ceo-gold" size={18} />
            <h3 className="text-lg font-serif text-white font-bold">Recognition Growth Trend</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={awardsAnalytics.awardsByYear} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="count" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, fill: '#fff', stroke: '#D4AF37', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Distribution - Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-ceo-gold" size={18} />
            <h3 className="text-lg font-serif text-white font-bold">Global Distribution</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={awardsAnalytics.globalDistribution} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.3} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis dataKey="region" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} width={90} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {awardsAnalytics.globalDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Awards by Category - Pie Chart & Legend */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 w-full flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="text-ceo-gold" size={18} />
            <h3 className="text-lg font-serif text-white font-bold">Recognition by Category</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Our accolades reflect a balanced commitment across visionary leadership, technological innovation, and sustainable finance. Leadership and Technology remain our strongest pillars of global recognition.
          </p>
          <div className="space-y-3">
            {awardsAnalytics.awardsByCategory.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">{cat.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-64 w-full md:w-1/2 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={awardsAnalytics.awardsByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {awardsAnalytics.awardsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveAnalytics;
