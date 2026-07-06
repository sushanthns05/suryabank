import React from 'react';
import { transformationAnalytics } from '../../../pages/ceo/CeoMockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

const COLORS = ['#D4AF37', '#38BDF8', '#10B981', '#A78BFA', '#F43F5E'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl z-50">
        <p className="text-white text-xs font-bold mb-1">{label || payload[0].name || payload[0].payload.name || payload[0].payload.pillar}</p>
        <p className="text-ceo-gold text-sm font-bold">
          {payload[0].value} <span className="text-[10px] text-slate-400 font-normal">{payload[0].name === 'progress' ? '%' : ''}</span>
        </p>
      </div>
    );
  }
  return null;
};

const StrategicAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Innovation Index Growth - Area Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-ceo-gold" size={18} />
            <h3 className="text-lg font-serif text-white font-bold">Innovation Index Trajectory</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transformationAnalytics.innovationIndex} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#fff', stroke: '#10B981', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Investment Allocation - Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="text-ceo-gold" size={18} />
              <h3 className="text-lg font-serif text-white font-bold">Capital Allocation</h3>
            </div>
            <div className="space-y-3">
              {transformationAnalytics.investmentAllocation.map((cat, idx) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-48 w-full md:w-1/2 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transformationAnalytics.investmentAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {transformationAnalytics.investmentAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Progress by Pillar - Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-ceo-gold" size={18} />
          <h3 className="text-lg font-serif text-white font-bold">Execution Progress by Pillar</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transformationAnalytics.progressByPillar} margin={{ top: 20, right: 10, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
              <XAxis dataKey="pillar" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} angle={-45} textAnchor="end" />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
              <Bar dataKey="progress" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {transformationAnalytics.progressByPillar.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.progress > 85 ? '#D4AF37' : '#38BDF8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StrategicAnalytics;
