import React from 'react';
import { 
  Users, Building2, CreditCard, TrendingUp, 
  AlertTriangle, CheckCircle, ShieldAlert, ArrowUpRight, Megaphone, Send
} from 'lucide-react';
import { createBroadcast } from '../../services/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { generateDashboardPDF } from '../../utils/pdfGenerator';

const revenueData = [
  { name: 'Jan', revenue: 4000, target: 2400 },
  { name: 'Feb', revenue: 3000, target: 1398 },
  { name: 'Mar', revenue: 2000, target: 9800 },
  { name: 'Apr', revenue: 2780, target: 3908 },
  { name: 'May', revenue: 1890, target: 4800 },
  { name: 'Jun', revenue: 2390, target: 3800 },
];

const BANK_SUMMARY_CARDS = [
  { title: 'Total Bank Revenue', value: '₹4.2B', trend: '+12.5%', isUp: true, icon: TrendingUp, color: 'text-[#F59E0B]' },
  { title: 'Total Customers', value: '1.2M', trend: '+5.2%', isUp: true, icon: Users, color: 'text-blue-500' },
  { title: 'Active Branches', value: '42', trend: 'Stable', isUp: true, icon: Building2, color: 'text-emerald-500' },
  { title: 'Pending Approvals', value: '128', trend: 'Urgent', isUp: false, icon: AlertTriangle, color: 'text-red-500' },
];

const BRANCH_SUMMARY_CARDS = [
  { title: 'Branch Revenue', value: '₹42.5M', trend: '+8.4%', isUp: true, icon: TrendingUp, color: 'text-[#F59E0B]' },
  { title: 'Branch Customers', value: '1,240', trend: '+2.1%', isUp: true, icon: Users, color: 'text-blue-500' },
  { title: 'Active Employees', value: '22', trend: 'Stable', isUp: true, icon: Building2, color: 'text-emerald-500' },
  { title: 'Pending Approvals', value: '5', trend: 'Manageable', isUp: true, icon: CheckCircle, color: 'text-emerald-500' },
];

const ManagerDashboard = () => {
  const [broadcastMessage, setBroadcastMessage] = React.useState('');
  const [broadcastPriority, setBroadcastPriority] = React.useState('standard');
  const [isBroadcasting, setIsBroadcasting] = React.useState(false);
  const [broadcastStatus, setBroadcastStatus] = React.useState(null);

  const role = localStorage.getItem('managerRole') || 'Manager';
  const branch = localStorage.getItem('managerBranch') || 'Head Office';
  const isBranchManager = role === 'Branch Manager';

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setIsBroadcasting(true);
    const res = await createBroadcast({
      message: broadcastMessage,
      priority: broadcastPriority,
      author: role === 'Branch Manager' ? 'Branch Manager' : 'Head Office'
    });

    if (res.success) {
      setBroadcastStatus('success');
      setBroadcastMessage('');
    } else {
      setBroadcastStatus('error');
    }
    setIsBroadcasting(false);
    
    setTimeout(() => setBroadcastStatus(null), 3000);
  };

  const summaryCards = isBranchManager ? BRANCH_SUMMARY_CARDS : BANK_SUMMARY_CARDS;
  const title = isBranchManager ? `${branch} Branch Dashboard` : 'Executive Dashboard';
  const subtitle = isBranchManager ? `Performance and analytics for ${branch} branch.` : 'Bank-wide overview and analytics for Head Office.';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{title}</h1>
          <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => generateDashboardPDF(title, summaryCards)} className="px-4 py-2 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg text-sm font-bold hover:bg-[#F59E0B]/20 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            {isBranchManager ? 'Generate Branch Report' : 'Generate Executive Report'}
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
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
              { title: 'Suspicious Transfer Detected', desc: `₹5M transfer requested from ${isBranchManager ? 'your' : 'Kengeri'} branch.`, time: '10m ago', level: 'high' },
              { title: 'Unusual Login Location', desc: 'Manager login attempt from outside state.', time: '1h ago', level: 'medium' },
              { title: 'KYC Expiry Warning', desc: `${isBranchManager ? '12' : '45'} high-net-worth accounts missing KYC.`, time: '2h ago', level: 'low' },
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

      {/* Branch Announcer / Broadcast Center */}
      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-xl overflow-hidden mt-6">
        <div className="p-5 border-b border-slate-700/50 bg-[#0F172A]/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-yellow-600 flex items-center justify-center">
            <Megaphone size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Branch Broadcast System</h2>
            <p className="text-xs text-slate-400">Instantly announce messages to all employee dashboards.</p>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleBroadcast}>
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Message</label>
              <textarea 
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Type your announcement here..."
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] resize-none h-24"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    value="standard" 
                    checked={broadcastPriority === 'standard'}
                    onChange={() => setBroadcastPriority('standard')}
                    className="accent-[#F59E0B]"
                  />
                  <span className="text-sm text-slate-300">Standard</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    value="urgent" 
                    checked={broadcastPriority === 'urgent'}
                    onChange={() => setBroadcastPriority('urgent')}
                    className="accent-red-500"
                  />
                  <span className="text-sm font-bold text-red-400">Urgent Alert</span>
                </label>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {broadcastStatus === 'success' && <span className="text-sm font-bold text-emerald-400">Broadcast Sent!</span>}
                {broadcastStatus === 'error' && <span className="text-sm font-bold text-red-400">Failed to send.</span>}
                
                <button 
                  type="submit"
                  disabled={isBroadcasting || !broadcastMessage.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#F59E0B] to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/20 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send size={16} className={isBroadcasting ? "animate-pulse" : ""} />
                  {isBroadcasting ? 'Broadcasting...' : 'Broadcast to Branch'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;
