import React from 'react';
import { 
  Users, Building2, CreditCard, TrendingUp, 
  AlertTriangle, CheckCircle, ShieldAlert, ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 4000, target: 2400 },
  { name: 'Feb', revenue: 3000, target: 1398 },
  { name: 'Mar', revenue: 2000, target: 9800 },
  { name: 'Apr', revenue: 2780, target: 3908 },
  { name: 'May', revenue: 1890, target: 4800 },
  { name: 'Jun', revenue: 2390, target: 3800 },
];

const SUMMARY_CARDS = [
  { title: 'Total Bank Revenue', value: '₹4.2B', trend: '+12.5%', isUp: true, icon: TrendingUp, color: 'text-[#F59E0B]' },
  { title: 'Total Customers', value: '1.2M', trend: '+5.2%', isUp: true, icon: Users, color: 'text-blue-500' },
  { title: 'Active Branches', value: '42', trend: 'Stable', isUp: true, icon: Building2, color: 'text-emerald-500' },
  { title: 'Pending Approvals', value: '128', trend: 'Urgent', isUp: false, icon: AlertTriangle, color: 'text-red-500' },
];

const ManagerDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Executive Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Bank-wide overview and analytics for Head Office.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg text-sm font-bold hover:bg-[#F59E0B]/20 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            Generate Executive Report
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map((card, index) => (
          <div key={index} className="relative bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg overflow-hidden group hover:border-[#F59E0B]/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <card.icon size={80} className={card.color} />
            </div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-white">{card.value}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm relative z-10">
              <span className={`flex items-center font-bold ${card.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {card.trend}
              </span>
              <span className="text-slate-500 ml-2">vs last quarter</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-[#F59E0B]" size={20} /> Revenue Analytics
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#F59E0B' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security & AI Alerts */}
        <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="text-red-400" size={20} /> AI Security Alerts
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { title: 'Suspicious Transfer Detected', desc: '₹5M transfer requested from Kengeri branch.', time: '10m ago', level: 'high' },
              { title: 'Unusual Login Location', desc: 'Manager login attempt from outside state.', time: '1h ago', level: 'medium' },
              { title: 'KYC Expiry Warning', desc: '45 high-net-worth accounts missing KYC.', time: '2h ago', level: 'low' },
            ].map((alert, i) => (
              <div key={i} className={`p-3 rounded-lg border ${alert.level === 'high' ? 'bg-red-500/10 border-red-500/30' : alert.level === 'medium' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                <p className={`text-sm font-bold ${alert.level === 'high' ? 'text-red-400' : alert.level === 'medium' ? 'text-orange-400' : 'text-slate-300'}`}>{alert.title}</p>
                <p className="text-xs text-slate-400 mt-1">{alert.desc}</p>
                <p className="text-[10px] text-slate-500 mt-2">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;
