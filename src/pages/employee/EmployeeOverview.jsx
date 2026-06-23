import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testApiConnection, getBroadcasts } from '../../services/api';
import { 
  Users, Activity, FileText, UserPlus, IndianRupee, 
  Wallet, Briefcase, UserCheck, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

// Dummy Data for charts
const performanceData = [
  { name: 'Jan', revenue: 4000, loans: 2400 },
  { name: 'Feb', revenue: 3000, loans: 1398 },
  { name: 'Mar', revenue: 2000, loans: 9800 },
  { name: 'Apr', revenue: 2780, loans: 3908 },
  { name: 'May', revenue: 1890, loans: 4800 },
  { name: 'Jun', revenue: 2390, loans: 3800 },
  { name: 'Jul', revenue: 3490, loans: 4300 },
];

const depositLoanData = [
  { name: 'Savings', deposit: 4000, loan: 2400 },
  { name: 'Current', deposit: 3000, loan: 1398 },
  { name: 'FD', deposit: 2000, loan: 9800 },
  { name: 'RD', deposit: 2780, loan: 3908 },
];

const pieData = [
  { name: 'Present', value: 45 },
  { name: 'Absent', value: 2 },
  { name: 'Leave', value: 3 },
];
const COLORS = ['#22c55e', '#ef4444', '#f97316'];

const SUMMARY_CARDS = [
  { title: 'Total Customers', value: '24,592', trend: '+12.5%', isUp: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { title: "Today's Txns", value: '1,432', trend: '+5.2%', isUp: true, icon: Activity, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  { title: 'Pending Loans', value: '45', trend: '-2.4%', isUp: false, icon: FileText, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  { title: 'New Accounts', value: '128', trend: '+18.2%', isUp: true, icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { title: 'Cash Available', value: '₹4.2 Cr', trend: '+1.2%', isUp: true, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { title: 'Deposits', value: '₹12.5 Cr', trend: '+8.4%', isUp: true, icon: Wallet, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { title: 'Active Loans', value: '842', trend: '+4.3%', isUp: true, icon: Briefcase, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  { title: 'Attendance', value: '45/50', trend: '90%', isUp: true, icon: UserCheck, color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/30' },
];

const RECENT_TXNS = [
  { id: 'TX-9823', name: 'Rahul Sharma', type: 'Deposit', amount: '+₹25,000', status: 'Completed', time: '10:42 AM' },
  { id: 'TX-9824', name: 'Priya Patel', type: 'Withdrawal', amount: '-₹10,000', status: 'Completed', time: '11:15 AM' },
  { id: 'TX-9825', name: 'Amit Kumar', type: 'Transfer', amount: '-₹5,000', status: 'Pending', time: '11:45 AM' },
  { id: 'TX-9826', name: 'Sneha Gupta', type: 'Deposit', amount: '+₹50,000', status: 'Completed', time: '12:30 PM' },
];

const EmployeeOverview = () => {
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState({ loading: true, data: null, error: null });
  const [broadcasts, setBroadcasts] = useState([]);

  useEffect(() => {
    const fetchBroadcasts = async () => {
      const res = await getBroadcasts();
      if (res.success && res.broadcasts.length > 0) {
        setBroadcasts(res.broadcasts);
      }
    };
    fetchBroadcasts();
    const checkApi = async () => {
      try {
        const response = await testApiConnection();
        setApiStatus({ loading: false, data: response, error: null });
      } catch (err) {
        setApiStatus({ loading: false, data: null, error: err.message });
      }
    };
    checkApi();
  }, []);

  const handleDownloadReport = () => {
    // Generate CSV content
    let csvContent = "Surya Bank - Daily Branch Report\n\n";
    
    // Summary Metrics
    csvContent += "--- SUMMARY METRICS ---\n";
    csvContent += "Metric,Value,Trend\n";
    SUMMARY_CARDS.forEach(card => {
      csvContent += `"${card.title}","${card.value}","${card.trend} ${card.isUp ? 'Up' : 'Down'}"\n`;
    });
    
    csvContent += "\n--- RECENT TRANSACTIONS ---\n";
    csvContent += "Transaction ID,Customer Name,Type,Amount,Status,Time\n";
    RECENT_TXNS.forEach(txn => {
      csvContent += `"${txn.id}","${txn.name}","${txn.type}","${txn.amount}","${txn.status}","${txn.time}"\n`;
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `surya_bank_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Urgent Manager Broadcasts */}
      {broadcasts.length > 0 && (
        <div className="space-y-3 mb-6">
          {broadcasts.slice(0, 1).map(broadcast => (
            <div key={broadcast.id} className={`p-4 rounded-xl border flex items-start gap-4 shadow-md ${broadcast.priority === 'urgent' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/50 animate-pulse-slow' : 'bg-[#F59E0B]/10 border-[#F59E0B]/30'}`}>
              <div className={`p-2 rounded-full ${broadcast.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                <Activity size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold text-lg ${broadcast.priority === 'urgent' ? 'text-red-800 dark:text-red-300' : 'text-[#F59E0B]'}`}>
                    {broadcast.priority === 'urgent' ? 'URGENT BROADCAST' : 'BRANCH ANNOUNCEMENT'}
                  </h3>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> {new Date(broadcast.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-800 dark:text-slate-200">{broadcast.message}</p>
                <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-wider">From: {broadcast.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API Connection Banner */}
      {!apiStatus.loading && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${apiStatus.data?.success ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
          <div className="flex-1">
            <h4 className={`text-sm font-bold ${apiStatus.data?.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
              Backend API Status: {apiStatus.data?.success ? 'Connected' : 'Disconnected'}
            </h4>
            <p className={`text-xs mt-1 ${apiStatus.data?.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {apiStatus.data?.success ? `Response from /api/test: "${apiStatus.data.message}"` : (apiStatus.error ? `Error: ${apiStatus.error}` : `Error: ${apiStatus.data?.message || 'Unknown'}`)}
            </p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            Download Report
          </button>
          <button 
            onClick={() => navigate('/employee/open-account')}
            className="px-4 py-2 bg-surya-primary text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            Create Customer
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map((card, index) => (
          <div key={index} className="bg-white dark:bg-surya-surfaceDark rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${card.isUp ? 'text-surya-success' : 'text-surya-danger'}`}>
                {card.isUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {card.trend}
              </span>
              <span className="text-slate-400 dark:text-slate-500 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-surya-surfaceDark rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Branch Performance</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm rounded-md py-1 px-2 text-slate-600 dark:text-slate-300 outline-none">
              <option>Last 7 months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B3D91" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0B3D91" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F4B400" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F4B400" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0B3D91" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="loans" stroke="#F4B400" strokeWidth={3} fillOpacity={1} fill="url(#colorLoans)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Attendance Chart */}
        <div className="bg-white dark:bg-surya-surfaceDark rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Today's Attendance</h3>
          <div className="flex-1 flex justify-center items-center h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Present</p>
              <p className="text-lg font-bold text-surya-success">45</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Absent</p>
              <p className="text-lg font-bold text-surya-danger">2</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">On Leave</p>
              <p className="text-lg font-bold text-surya-warning">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Tables & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
            <button className="text-sm text-surya-primary dark:text-surya-secondary font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Transaction ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {RECENT_TXNS.map((txn, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{txn.id}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{txn.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{txn.type}</td>
                    <td className={`p-4 font-bold ${txn.amount.startsWith('+') ? 'text-surya-success' : 'text-slate-800 dark:text-white'}`}>{txn.amount}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${txn.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Approvals / Notifications */}
        <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pending Approvals</h3>
            <span className="bg-surya-warning text-white text-xs font-bold px-2 py-1 rounded-full">5 New</span>
          </div>
          <div className="p-2 flex-1 overflow-y-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors border-b border-transparent dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex justify-center items-center shrink-0">
                  <FileText size={18} />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">Home Loan Request</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Ramesh Kumar - ₹45 Lakhs</p>
                </div>
                <div className="text-xs text-slate-400 flex items-center shrink-0">
                  <Clock size={12} className="mr-1" /> 2h ago
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100 dark:border-slate-700 text-center">
            <button className="text-sm text-surya-primary dark:text-surya-secondary font-medium hover:underline w-full">View All Requests</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmployeeOverview;
