import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, CreditCard, Banknote, Clock, MapPin, CheckCircle, 
  AlertTriangle, Sun, CloudRain, Bell, Calendar, Award, FileText, ArrowUpRight, TrendingUp, Power
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { updateBranchStatus } from '../../services/api';

// --- MOCK DATA ---
const growthData = [
  { month: 'Jan', deposits: 45, loans: 28 },
  { month: 'Feb', deposits: 52, loans: 32 },
  { month: 'Mar', deposits: 48, loans: 40 },
  { month: 'Apr', deposits: 61, loans: 38 },
  { month: 'May', deposits: 59, loans: 45 },
  { month: 'Jun', deposits: 75, loans: 52 },
];

const transactionData = [
  { type: 'UPI', volume: 4500, amount: '₹12.5M' },
  { type: 'NEFT', volume: 1200, amount: '₹8.2M' },
  { type: 'RTGS', volume: 300, amount: '₹15.4M' },
  { type: 'Cash', volume: 850, amount: '₹4.5M' },
];

const ManagerBranchManagement = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBranchOpen, setIsBranchOpen] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const branchStatusRef = doc(db, 'settings', 'branch_status');
    const unsubscribe = onSnapshot(branchStatusRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsBranchOpen(docSnap.data().isOpen);
      }
    });
    return () => unsubscribe();
  }, []);

  // Automatic open/close based on time (09:00 AM to 04:00 PM)
  useEffect(() => {
    const hour = currentTime.getHours();
    const shouldBeOpen = hour >= 9 && hour < 16; // Open from 09:00 to 15:59. Closes exactly at 16:00 (4 PM)
    
    if (isBranchOpen !== shouldBeOpen && !isUpdating) {
      const autoUpdateStatus = async () => {
        setIsUpdating(true);
        await updateBranchStatus(shouldBeOpen);
        setIsUpdating(false);
      };
      autoUpdateStatus();
    }
  }, [currentTime, isBranchOpen, isUpdating]);

  const handleToggleStatus = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    await updateBranchStatus(!isBranchOpen);
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. BRANCH HEADER & LIVE STATUS */}
      <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-800 border border-slate-700 flex items-center justify-center shadow-inner shrink-0">
              <Building2 size={32} className="text-[#F59E0B]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white tracking-tight">Kengeri Satellite Town Branch</h1>
                <button 
                  disabled={true}
                  title="Branch status is automatically managed (09:00 AM - 04:00 PM)"
                  className={`px-4 py-2.5 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 transition-all transform shadow-xl disabled:cursor-not-allowed ${
                    isBranchOpen 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 border border-emerald-400 opacity-90' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30 border border-red-400 opacity-90'
                  }`}
                >
                  <Power size={18} className={isBranchOpen ? 'animate-pulse text-emerald-100' : 'text-red-100'} /> 
                  {isBranchOpen ? 'Branch is OPEN' : 'Branch is CLOSED'}
                </button>
              </div>
              <div className="flex flex-wrap items-center text-slate-400 text-sm mt-2 gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500" /> BDA Complex Area, Kengeri, Bengaluru</span>
                <span className="flex items-center gap-1.5"><Award size={14} className="text-[#F59E0B]" /> Branch Code: <strong>SURY-0123</strong></span>
                <span className="flex items-center gap-1.5"><UserIcon size={14} className="text-slate-500" /> Manager: <strong>Yashwanth SB</strong></span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-stretch shrink-0">
            {/* Clock Widget */}
            <div className="bg-[#0F172A]/80 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-center min-w-[140px]">
              <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider mb-1">
                <Clock size={14} /> Local Time
              </div>
              <div className="text-xl font-mono font-bold text-white tabular-nums">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
            </div>
            
            {/* Weather Widget */}
            <div className="bg-[#0F172A]/80 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4 min-w-[160px]">
              <Sun size={32} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <div>
                <div className="text-xl font-bold text-white">29°C</div>
                <div className="text-xs text-slate-400">Mostly Sunny</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Kengeri, KA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: MAIN ANALYTICS & OPERATIONS (Takes 3 columns on large screens) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* 2. CORE KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Total Customers" value="1,245" trend="+12 this week" icon={Users} color="text-blue-400" />
            <KpiCard title="Active Loans" value="₹14.2M" trend="85 Accounts" icon={Banknote} color="text-emerald-400" />
            <KpiCard title="Today's Deposits" value="₹850K" trend="+5.2% vs yesterday" icon={TrendingUp} color="text-[#F59E0B]" />
            <KpiCard title="Staff Attendance" value="20/22" trend="2 on leave" icon={CheckCircle} color="text-purple-400" />
          </div>

          {/* 3. CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Growth Chart */}
            <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Monthly Growth</h3>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">₹ Millions</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLoan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}/>
                    <Area type="monotone" dataKey="deposits" name="Deposits" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorDep)" />
                    <Area type="monotone" dataKey="loans" name="Loans Disbursed" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorLoan)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transaction Volume Chart */}
            <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Today's Transactions</h3>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">Live</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.5} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{fill: '#fff', fontSize: 12, fontWeight: 'bold'}} width={50} />
                    <Tooltip 
                      cursor={{fill: '#334155', opacity: 0.2}}
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} 
                    />
                    <Bar dataKey="volume" name="Volume (Count)" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* 4. DAILY OPERATIONS & VAULT CENTER */}
          <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-lg overflow-hidden">
            <div className="p-5 border-b border-slate-700/50 bg-[#0F172A]/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="text-[#F59E0B]" size={20}/> Daily Operations & Vault Center
              </h3>
              <button className="text-xs text-[#F59E0B] hover:text-yellow-400 font-bold flex items-center gap-1 transition-colors">
                View Full Logs <ArrowUpRight size={14}/>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
              
              {/* Vault Status */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-300">Main Vault Cash</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">HEALTHY</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">₹4,500,000</div>
                <div className="text-xs text-slate-400 mb-4">Opening Balance: ₹4,250,000</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">ATM 1 (Off-site)</span>
                    <span className="text-emerald-400">78%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '78%'}}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-slate-400">ATM 2 (On-site)</span>
                    <span className="text-orange-400">32%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{width: '32%'}}></div>
                  </div>
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-300">Pending Actions</span>
                  <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center">8</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]/50 border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400"><Users size={14}/></div>
                      <div>
                        <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">KYC Verifications</p>
                        <p className="text-[10px] text-slate-500">3 pending reviews</p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors"/>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]/50 border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]"><Banknote size={14}/></div>
                      <div>
                        <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">Loan Disbursements</p>
                        <p className="text-[10px] text-slate-500">5 pending approvals</p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors"/>
                  </div>
                </div>
              </div>

              {/* Complaints & Alerts */}
              <div className="p-6">
                 <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-300">Security & Complaints</span>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 border-l-4 border-l-red-500">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={14} className="text-red-400"/>
                      <p className="text-xs font-bold text-red-400">Large Transaction Alert</p>
                    </div>
                    <p className="text-[11px] text-slate-300">Cash withdrawal of ₹500,000 flagged at counter 3. Requires authorization.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 border-l-4 border-l-orange-500">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={14} className="text-orange-400"/>
                      <p className="text-xs font-bold text-orange-400">Customer Complaint</p>
                    </div>
                    <p className="text-[11px] text-slate-300">Ticket #8924: Dispute regarding ATM failure at Kengeri Metro Station.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WIDGETS PANEL */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Branch Ranking Widget */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
              <Award size={100} className="text-[#F59E0B]" />
            </div>
            <h3 className="text-sm font-bold text-slate-400 mb-1">Regional Ranking</h3>
            <div className="text-4xl font-bold text-white mb-2 flex items-baseline gap-1">
              #2 <span className="text-sm font-normal text-slate-400">/ 14 Branches</span>
            </div>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp size={12}/> Moved up 1 rank this month
            </p>
          </div>

          {/* Announcements Widget */}
          <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 bg-[#0F172A]/50 flex items-center gap-2">
              <Bell size={16} className="text-[#F59E0B]" />
              <h3 className="text-sm font-bold text-white">Head Office Circulars</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="text-[10px] text-slate-500 font-mono">TODAY</span>
                <p className="text-sm text-slate-200 mt-1 hover:text-[#F59E0B] transition-colors cursor-pointer">Revised interest rates for Senior Citizen Fixed Deposits effective immediately.</p>
              </div>
              <div className="pt-4 border-t border-slate-700/50">
                <span className="text-[10px] text-slate-500 font-mono">YESTERDAY</span>
                <p className="text-sm text-slate-200 mt-1 hover:text-[#F59E0B] transition-colors cursor-pointer">Mandatory security drill protocol updates for all metropolitan branches.</p>
              </div>
            </div>
          </div>

          {/* Appointments / Schedule Widget */}
          <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 bg-[#0F172A]/50 flex items-center gap-2">
              <Calendar size={16} className="text-[#F59E0B]" />
              <h3 className="text-sm font-bold text-white">Today's Schedule</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-3">
                <div className="text-xs font-bold text-slate-400 w-12 shrink-0 pt-0.5">10:30 AM</div>
                <div className="border-l-2 border-[#F59E0B] pl-3">
                  <p className="text-sm font-bold text-white">Corporate Loan Review</p>
                  <p className="text-xs text-slate-400 mt-0.5">Meeting with TechVision Inc. directors</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-xs font-bold text-slate-400 w-12 shrink-0 pt-0.5">01:00 PM</div>
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="text-sm font-bold text-white">Branch Staff Meeting</p>
                  <p className="text-xs text-slate-400 mt-0.5">Weekly performance alignment</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-xs font-bold text-slate-400 w-12 shrink-0 pt-0.5">04:15 PM</div>
                <div className="border-l-2 border-emerald-500 pl-3">
                  <p className="text-sm font-bold text-white">Cash Vault Audit</p>
                  <p className="text-xs text-slate-400 mt-0.5">End of day verification</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper component for KPI Cards
const KpiCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg relative overflow-hidden group">
    <div className={`w-10 h-10 rounded-lg bg-[#0F172A] border border-slate-700 flex items-center justify-center mb-4 ${color}`}>
      <Icon size={20} />
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
    <p className="text-[11px] font-medium text-slate-400">{trend}</p>
    
    <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-150 transition-transform duration-500 pointer-events-none">
      <Icon size={80} className={color} />
    </div>
  </div>
);

// Helper component since User is not imported directly above to avoid clash
const UserIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default ManagerBranchManagement;
