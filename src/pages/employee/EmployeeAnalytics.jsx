import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, Users, Activity, CreditCard } from 'lucide-react';

const revenueData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
  { name: 'Jul', income: 3490, expenses: 4300 },
];

const loanDistribution = [
  { name: 'Home Loans', value: 400 },
  { name: 'Auto Loans', value: 300 },
  { name: 'Personal', value: 300 },
  { name: 'Business', value: 200 },
];

const transactionVolume = [
  { time: '08:00', volume: 120 },
  { time: '10:00', volume: 450 },
  { time: '12:00', volume: 320 },
  { time: '14:00', volume: 680 },
  { time: '16:00', volume: 550 },
  { time: '18:00', volume: 200 },
];

const COLORS = ['#0B3D91', '#F4B400', '#22c55e', '#ef4444'];

const EmployeeAnalytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Financial Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Detailed branch performance and predictive insights.</p>
        </div>
        <select className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-surya-primary shadow-sm">
          <option>This Month</option>
          <option>Last Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Net Revenue', val: '₹14.2 Cr', trend: '+8.4%', icon: IndianRupee, isUp: true },
          { title: 'Customer Acquisition', val: '1,240', trend: '+12.1%', icon: Users, isUp: true },
          { title: 'Transaction Success', val: '99.8%', trend: '+0.2%', icon: Activity, isUp: true },
          { title: 'NPA (Default Rate)', val: '1.2%', trend: '-0.5%', icon: CreditCard, isUp: false }, // Down is good for NPA
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-surya-surfaceDark p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.title}</p>
              <h4 className="text-xl font-bold text-slate-800 dark:text-white mt-1">{kpi.val}</h4>
            </div>
            <div className={`flex flex-col items-end ${kpi.isUp ? 'text-surya-success' : 'text-surya-success'}`}>
              <div className={`p-2 rounded-lg ${kpi.isUp ? 'bg-green-100 dark:bg-green-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                <kpi.icon size={20} />
              </div>
              <span className="text-sm font-bold mt-2 flex items-center">
                {kpi.isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="bg-white dark:bg-surya-surfaceDark p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Income vs Expenses (Lakhs)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="income" name="Income" fill="#0B3D91" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expenses" name="Expenses" fill="#F4B400" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loan Portfolio Distribution Pie Chart */}
        <div className="bg-white dark:bg-surya-surfaceDark p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Loan Portfolio Distribution</h3>
          <div className="flex-1 flex items-center justify-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {loanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Transaction Volume Area Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-surya-surfaceDark p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Today's Transaction Volume</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="volume" name="Transactions" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeAnalytics;
