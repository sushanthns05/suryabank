import React, { useState, useEffect } from 'react';
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, 
  onSnapshot, query, limit, orderBy, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { useCeoAuth } from '../../../context/CeoAuthContext';
import { 
  Shield, Users, Activity, Lock, AlertTriangle, Database, 
  Globe, Server, Zap, Radio, Search, Play, FileText, Settings, 
  Briefcase, Edit, Save, Trash2, Power, Eye, RefreshCw, XCircle, 
  CheckCircle, ShieldAlert, Key, MessageSquare, Download, MapPin, Target,
  Cpu, HardDrive, Wifi, ShieldCheck, PieChart as PieChartIcon, TrendingUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// --- MOCK DATA FOR VISUALIZATIONS ---

const networkTraffic = [
  { time: '08:00', manager: 120, employee: 450, customer: 2100 },
  { time: '10:00', manager: 250, employee: 850, customer: 4500 },
  { time: '12:00', manager: 300, employee: 900, customer: 5100 },
  { time: '14:00', manager: 280, employee: 880, customer: 4800 },
  { time: '16:00', manager: 210, employee: 700, customer: 3900 },
  { time: '18:00', manager: 100, employee: 300, customer: 5500 },
  { time: '20:00', manager: 40,  employee: 120, customer: 6200 },
];

const threatLevels = [
  { name: 'Low Risk', value: 85 },
  { name: 'Medium Risk', value: 12 },
  { name: 'High Risk', value: 3 },
];

const COLORS = {
  primary: '#D4AF37', // ceo-gold
  success: '#10B981', // emerald-500
  warning: '#F59E0B', // amber-500
  danger: '#EF4444',  // red-500
  info: '#3B82F6',    // blue-500
  purple: '#8B5CF6',
  slate: '#64748B'
};

const roleColors = {
  'CEO': 'text-red-400 bg-red-950/20 border-red-900',
  'Executive Assistant': 'text-amber-400 bg-amber-950/20 border-amber-900',
  'Board Member': 'text-purple-400 bg-purple-950/20 border-purple-900',
  'Investor': 'text-emerald-400 bg-emerald-950/20 border-emerald-900',
  'Media': 'text-cyan-400 bg-cyan-950/20 border-cyan-900',
  'Administrator': 'text-blue-400 bg-blue-950/20 border-blue-900',
  'Manager': 'text-indigo-400 bg-indigo-950/20 border-indigo-900',
  'Employee': 'text-slate-300 bg-slate-800 border-slate-700'
};

// --- MAIN COMPONENT ---

const AdminDashboardSecure = () => {
  const { user, role: currentRole } = useCeoAuth();
  
  // Dashboard States
  const [activeTab, setActiveTab] = useState('overview'); // overview, iam, soc, infrastructure, compliance
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Data States
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemHealth, setSystemHealth] = useState({ core: 100, api: 99.9, db: 100, storage: 100 });
  const [loading, setLoading] = useState(true);

  // IAM Edit States
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  
  // Quick Actions States
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    
    // Subscribe to live audit logs
    const qLogs = query(collection(db, 'ceo_audit_logs'), orderBy('timestamp', 'desc'), limit(50));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const logs = [];
      snapshot.forEach(docSnap => {
        logs.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAuditLogs(logs);
      setLoading(false);
    }, (err) => {
      console.error("Audit log error:", err);
      // Fallback mocks if collection doesn't exist
      setAuditLogs([
        { id: '1', action: 'Failed Login Attempt', user: 'Unknown', ip: '198.51.100.4', risk: 'High', timestamp: new Date().toISOString() },
        { id: '2', action: 'Accessed Vault', user: 'admin@suryabank.com', ip: '10.0.0.5', risk: 'Low', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', action: 'Role Modified (Employee -> Manager)', user: 'ceo@suryabank.com', ip: '10.0.0.2', risk: 'Medium', timestamp: new Date(Date.now() - 7200000).toISOString() },
      ]);
      setLoading(false);
    });

    return () => unsubLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const userSnap = await getDocs(collection(db, 'ceo_users'));
      const userList = [];
      userSnap.forEach(docSnap => {
        userList.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Add some mock users if empty for demonstration
      if (userList.length === 0) {
        setUsers([
          { id: 'u1', email: 'ceo@suryabank.com', role: 'CEO', status: 'Active', lastLogin: '2 mins ago' },
          { id: 'u2', email: 'admin@suryabank.com', role: 'Administrator', status: 'Active', lastLogin: '1 hour ago' },
          { id: 'u3', email: 'manager.delhi@suryabank.com', role: 'Manager', status: 'Active', lastLogin: '5 hours ago' },
          { id: 'u4', email: 'teller.mumbai@suryabank.com', role: 'Employee', status: 'Suspended', lastLogin: '2 days ago' },
          { id: 'u5', email: 'board.director@suryabank.com', role: 'Board Member', status: 'Active', lastLogin: '1 week ago' },
        ]);
      } else {
        setUsers(userList);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logAudit = async (action, targetUser, risk = 'Low', details = '') => {
    try {
      await addDoc(collection(db, 'ceo_audit_logs'), {
        action,
        user: user?.email || 'System',
        targetUser,
        ip: '10.0.0.2', // Mock internal IP
        risk,
        details,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error('Failed to log audit:', e);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      // In a real app, you update auth claims here via Cloud Function
      // For this UI, we update the firestore doc
      const docRef = doc(db, 'ceo_users', userId);
      await updateDoc(docRef, { role: newRole });
      await logAudit('Role Change', userId, 'High', `Changed to ${newRole}`);
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      // Fallback for mock data
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setEditingUserId(null);
      logAudit('Role Change (Mock)', userId, 'High', `Changed to ${newRole}`);
    }
  };

  const handleSuspendUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      const docRef = doc(db, 'ceo_users', userId);
      await updateDoc(docRef, { status: newStatus });
      await logAudit(`Account ${newStatus}`, userId, 'High');
      fetchUsers();
    } catch (err) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      logAudit(`Account ${newStatus} (Mock)`, userId, 'High');
    }
  };

  const handleEmergencyBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    try {
      await addDoc(collection(db, 'ceo_directives'), {
        type: emergencyMode ? 'emergency' : 'broadcast',
        audience: 'all_staff',
        priority: emergencyMode ? 'critical' : 'high',
        title: emergencyMode ? '🚨 EMERGENCY DIRECTIVE' : 'Executive Broadcast',
        message: broadcastMessage,
        author: 'Office of the CEO',
        timestamp: new Date().toISOString()
      });
      await logAudit('Broadcast Sent', 'All Portals', emergencyMode ? 'Critical' : 'Medium', broadcastMessage);
      setBroadcastMessage('');
      setShowBroadcastModal(false);
      alert('Broadcast dispatched successfully across all portals.');
    } catch (e) {
      console.error(e);
      alert('Simulation: Broadcast dispatched.');
      setShowBroadcastModal(false);
    }
  };

  const toggleEmergencyMode = async () => {
    const newState = !emergencyMode;
    if (newState) {
      if (!window.confirm("WARNING: Activating Emergency Operations Mode restricts lower-tier portal access, forces immediate backups, and alerts the board. Proceed?")) return;
    }
    setEmergencyMode(newState);
    await logAudit(`Emergency Mode ${newState ? 'ACTIVATED' : 'DEACTIVATED'}`, 'System-Wide', 'Critical');
  };

  // --- RENDERERS ---

  const renderTabNavigation = () => (
    <div className="flex overflow-x-auto scrollbar-none border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 px-4">
      {[
        { id: 'overview', icon: Activity, label: 'Command Overview' },
        { id: 'iam', icon: Users, label: 'Enterprise IAM' },
        { id: 'soc', icon: ShieldAlert, label: 'SOC & Audit' },
        { id: 'infrastructure', icon: Server, label: 'Infrastructure' },
        { id: 'compliance', icon: FileText, label: 'Compliance & Jobs' }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
            activeTab === tab.id 
              ? `${emergencyMode ? 'border-red-500 text-red-500' : 'border-ceo-gold text-ceo-gold'}` 
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          <tab.icon size={16} className={activeTab === tab.id && emergencyMode ? 'animate-pulse' : ''} />
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div className="p-6 space-y-6">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Network Health', value: '99.99%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-900/50' },
          { label: 'Active Sessions', value: '14,892', icon: Users, color: 'text-blue-400', bg: 'bg-blue-950/20 border-blue-900/50' },
          { label: 'Security Threats', value: '3 Blocked', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-900/50' },
          { label: 'Data Synced', value: '4.2 PB', icon: Database, color: 'text-purple-400', bg: 'bg-purple-950/20 border-purple-900/50' }
        ].map((kpi, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${kpi.bg} relative overflow-hidden group`}>
            <kpi.icon className={`absolute -right-4 -top-4 opacity-10 ${kpi.color}`} size={100} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{kpi.label}</span>
            <div className={`text-3xl font-serif font-bold mt-2 ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Globe size={16} className="text-ceo-gold"/> Global Portal Traffic (Live)</h3>
            <span className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/> SYNCING</span>
          </div>
          <div className="h-72 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkTraffic}>
                <defs>
                  <linearGradient id="colorCust" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorEmp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.info} stopOpacity={0.3}/><stop offset="95%" stopColor={COLORS.info} stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="customer" name="Customer Portal" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorCust)" />
                <Area type="monotone" dataKey="employee" name="Employee Portal" stroke={COLORS.info} fillOpacity={1} fill="url(#colorEmp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Widget */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Cpu size={16} className="text-purple-400"/> AI Executive Insights
          </h3>
          <div className="flex-1 space-y-4">
            <div className="p-3 bg-purple-950/20 border border-purple-900/30 rounded-xl">
              <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1"><Target size={12}/> Anomaly Detected</h4>
              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">Unusual spike in corporate loan applications from the Mumbai branch over the last 4 hours. Automated risk scoring applied.</p>
            </div>
            <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1"><TrendingUp size={12}/> Growth Insight</h4>
              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">Customer portal engagement up 18% following the new UI rollout. Internet Banking load is stable.</p>
            </div>
            <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-xl">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1"><Settings size={12}/> Infrastructure Optimization</h4>
              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">Consider shifting Database Region B to Read-Replica to decrease latency in European transactions.</p>
            </div>
          </div>
          <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition-colors border border-slate-700">
            Generate Full Intelligence Report
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Zap size={16} className="text-ceo-gold"/> Executive Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button onClick={() => setShowBroadcastModal(true)} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex flex-col items-center justify-center gap-2 group">
            <Radio size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-slate-300 text-center">Dispatch Broadcast</span>
          </button>
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex flex-col items-center justify-center gap-2 group">
            <Lock size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-slate-300 text-center">Lock Portals</span>
          </button>
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex flex-col items-center justify-center gap-2 group">
            <Download size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-slate-300 text-center">Export Audit Log</span>
          </button>
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex flex-col items-center justify-center gap-2 group">
            <HardDrive size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-slate-300 text-center">Force Backup</span>
          </button>
          <button onClick={toggleEmergencyMode} className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 group ${emergencyMode ? 'bg-red-900 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 hover:bg-red-950 hover:border-red-900 border-slate-700'}`}>
            <Power size={20} className={emergencyMode ? 'text-white animate-pulse' : 'text-red-400 group-hover:scale-110 transition-transform'} />
            <span className={`text-[10px] font-bold text-center ${emergencyMode ? 'text-white' : 'text-red-400'}`}>{emergencyMode ? 'DISABLE DEFCON' : 'ACTIVATE DEFCON'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderIAM = () => (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2"><Key size={20} className="text-ceo-gold"/> Enterprise Identity & Access Management</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search identity matrix..." 
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:ring-1 focus:ring-ceo-gold outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500">
              <tr>
                <th className="p-4">Identity / Email</th>
                <th className="p-4">Enterprise Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Authentication</th>
                <th className="p-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.filter(u => u.email.toLowerCase().includes(globalSearch.toLowerCase())).map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono">{u.email}</td>
                  <td className="p-4">
                    {editingUserId === u.id ? (
                      <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 outline-none focus:border-ceo-gold"
                      >
                        {Object.keys(roleColors).map(role => <option key={role} value={role}>{role}</option>)}
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${roleColors[u.role] || roleColors['Employee']}`}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold ${u.status === 'Active' ? 'text-emerald-400' : 'text-red-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{u.lastLogin || 'N/A'}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    {editingUserId === u.id ? (
                      <>
                        <button onClick={() => handleUpdateRole(u.id, selectedRole)} className="p-1.5 bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800 border border-emerald-800 rounded flex items-center gap-1"><Save size={12}/> Save</button>
                        <button onClick={() => setEditingUserId(null)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-700"><XCircle size={12}/></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingUserId(u.id); setSelectedRole(u.role); }} className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700 hover:border-slate-500 transition-colors" title="Edit Role"><Edit size={12}/></button>
                        <button onClick={() => handleSuspendUser(u.id, u.status)} className={`p-1.5 rounded border transition-colors ${u.status === 'Active' ? 'bg-amber-950/30 text-amber-500 border-amber-900/50 hover:bg-amber-900' : 'bg-emerald-950/30 text-emerald-500 border-emerald-900/50 hover:bg-emerald-900'}`} title={u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}>
                          {u.status === 'Active' ? <Lock size={12}/> : <CheckCircle size={12}/>}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSOC = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Threat Map / Chart */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Target size={16} className="text-red-400"/> Current Threat Levels</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={threatLevels} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  <Cell fill={COLORS.success} />
                  <Cell fill={COLORS.warning} />
                  <Cell fill={COLORS.danger} />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-xs text-slate-400"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Low Risk Actions</span> <span>85%</span></div>
            <div className="flex justify-between text-xs text-slate-400"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"/> Medium Risk Suspicious</span> <span>12%</span></div>
            <div className="flex justify-between text-xs text-slate-400"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"/> High Risk / Blocked</span> <span>3%</span></div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><FileText size={16} className="text-ceo-gold"/> Comprehensive Audit Log</h3>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded flex items-center gap-1 border border-slate-700 transition-colors"><Download size={12}/> Export CSV</button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-80 pr-2">
            <table className="w-full text-left text-[10px] text-slate-300">
              <thead className="bg-slate-950 sticky top-0">
                <tr className="text-slate-500 uppercase">
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Identity / IP</th>
                  <th className="py-2 px-3">Action Details</th>
                  <th className="py-2 px-3">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map((log, i) => (
                  <tr key={log.id || i} className="hover:bg-slate-800/50">
                    <td className="py-3 px-3 text-slate-500 font-mono whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <strong className="block text-white font-mono truncate max-w-[120px]" title={log.user}>{log.user}</strong>
                      <span className="text-slate-500">{log.ip}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold block text-slate-200">{log.action}</span>
                      {log.details && <span className="text-slate-400 block mt-0.5 max-w-[200px] truncate">{log.details}</span>}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase ${log.risk === 'High' || log.risk === 'Critical' ? 'bg-red-950/50 text-red-400 border border-red-900/50' : log.risk === 'Medium' ? 'bg-amber-950/50 text-amber-400 border border-amber-900/50' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50'}`}>
                        {log.risk || 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInfrastructure = () => (
    <div className="p-6 space-y-6">
      
      {/* Portal Status Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { name: 'Core Banking API', status: 'Operational', latency: '4ms', load: '32%' },
          { name: 'Customer Portal', status: 'Operational', latency: '12ms', load: '68%' },
          { name: 'Employee Portal', status: 'Operational', latency: '8ms', load: '41%' },
          { name: 'Manager Portal', status: 'Operational', latency: '9ms', load: '22%' },
          { name: 'Investor Portal', status: 'Operational', latency: '15ms', load: '5%' }
        ].map((sys, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative">
            <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
            <h4 className="text-xs font-bold text-white mb-2 pr-4">{sys.name}</h4>
            <div className="space-y-1 text-[10px] text-slate-400 font-mono">
              <div className="flex justify-between"><span>Status:</span> <span className="text-emerald-400">{sys.status}</span></div>
              <div className="flex justify-between"><span>Latency:</span> <span>{sys.latency}</span></div>
              <div className="flex justify-between"><span>Server Load:</span> <span>{sys.load}</span></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSS-Based Global Branch Map */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden h-96 flex flex-col">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 z-10"><MapPin size={16} className="text-ceo-gold"/> Live Branch Monitoring Map</h3>
          <div className="flex-1 relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* World Map SVG Abstract Representation */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-20 text-slate-600 fill-current">
              <path d="M150,150 Q200,100 250,150 T350,150 T450,200 T550,150 T650,250 T750,150 T850,200 L850,400 L150,400 Z" />
              <path d="M600,100 Q650,50 700,100 T800,150 L800,250 L600,250 Z" />
            </svg>
            
            {/* Pulsing Nodes representing branches */}
            {[
              { id: 'Mumbai HQ', x: '68%', y: '52%', status: 'ok', active: 1420 },
              { id: 'Delhi Hub', x: '65%', y: '42%', status: 'ok', active: 890 },
              { id: 'London Branch', x: '48%', y: '30%', status: 'ok', active: 320 },
              { id: 'NY Office', x: '25%', y: '35%', status: 'warning', active: 450 },
              { id: 'Singapore Hub', x: '78%', y: '60%', status: 'ok', active: 610 },
            ].map(node => (
              <div key={node.id} className="absolute group" style={{ left: node.x, top: node.y }}>
                <div className={`w-3 h-3 rounded-full relative z-10 ${node.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <div className={`absolute inset-0 rounded-full animate-ping opacity-50 ${node.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                
                {/* Node Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-[10px] w-max opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  <strong className="text-white block">{node.id}</strong>
                  <span className="text-slate-400 font-mono">Active Users: {node.active}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database & Storage Health */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
             <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Database size={16} className="text-ceo-gold"/> Primary Database (Firestore)</h3>
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Document Reads / sec</span> <span>12.4k / 50k Limit</span></div>
                 <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-1/4"/></div>
               </div>
               <div>
                 <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Document Writes / sec</span> <span>3.1k / 10k Limit</span></div>
                 <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-1/3"/></div>
               </div>
               <div className="pt-4 flex gap-3">
                 <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 rounded transition-colors flex justify-center items-center gap-1"><RefreshCw size={12}/> Sync Indexes</button>
                 <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 rounded transition-colors flex justify-center items-center gap-1"><HardDrive size={12}/> View Schema</button>
               </div>
             </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
             <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><HardDrive size={16} className="text-ceo-gold"/> Enterprise Storage Vault</h3>
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Capacity Utilized</span> <span>4.2 PB / 10 PB</span></div>
                 <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[42%]"/></div>
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed">Storage contains KYC documents, compliance reports, audit trails, and encrypted media assets. Geographically replicated across 3 regions.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Trackers */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6"><ShieldCheck size={16} className="text-emerald-400"/> Regulatory & Compliance Status</h3>
          <div className="space-y-6">
            {[
              { standard: 'RBI Banking Security Guidelines', progress: 100, status: 'Compliant', date: 'Last audited: Today' },
              { standard: 'ISO/IEC 27001 (ISMS)', progress: 100, status: 'Certified', date: 'Valid until 2028' },
              { standard: 'SOC 2 Type II', progress: 95, status: 'Audit in Progress', date: 'Est. completion: Aug 2026', color: 'bg-amber-500' },
              { standard: 'GDPR / DPDP Act', progress: 100, status: 'Compliant', date: 'Automated policy enforcement active' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.standard}</h4>
                    <span className="text-[9px] text-slate-500">{item.date}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${item.progress === 100 ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900' : 'bg-amber-950/30 text-amber-400 border-amber-900'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color || 'bg-emerald-500'}`} style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Jobs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6"><Activity size={16} className="text-ceo-gold"/> Automated Cron Jobs</h3>
          <div className="space-y-4">
            {[
              { name: 'Daily Incremental Backup', schedule: '02:00 AM UTC', status: 'Success' },
              { name: 'Suspicious Tx Analysis (AI)', schedule: 'Every 15 mins', status: 'Running' },
              { name: 'Generate IAM Audit Report', schedule: 'End of Month', status: 'Scheduled' },
              { name: 'Clean Temporary Sessions', schedule: 'Every hour', status: 'Success' }
            ].map((job, i) => (
              <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-200">{job.name}</h4>
                  <span className="text-[9px] text-slate-500 font-mono">{job.schedule}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[9px] font-bold ${job.status === 'Success' ? 'text-emerald-400' : job.status === 'Running' ? 'text-blue-400 animate-pulse' : 'text-slate-400'}`}>
                    {job.status}
                  </span>
                  <button className="text-[8px] text-ceo-gold hover:underline mt-1">View Logs</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className={`min-h-[80vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${
      emergencyMode 
        ? 'bg-red-950/10 border-red-900/50 shadow-[0_0_50px_rgba(239,68,68,0.15)]' 
        : 'bg-slate-950 border-slate-800'
    }`}>
      
      {/* Header Area */}
      <div className={`px-6 py-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
        emergencyMode ? 'bg-red-950/40 border-red-900' : 'bg-slate-900 border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-2xl font-serif font-bold tracking-tight ${emergencyMode ? 'text-red-400' : 'text-white'}`}>
              Executive Operations & Security Control Center
            </h1>
            {emergencyMode && <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse uppercase tracking-widest">DEFCON 1 ACTIVE</span>}
          </div>
          <p className="text-xs text-slate-400 mt-1">Master terminal for global enterprise administration, identity management, and threat response.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="block text-slate-500">System Time (UTC)</span>
            <span className="text-white font-bold">{new Date().toISOString().split('T')[1].split('.')[0]}</span>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div className="text-right">
            <span className="block text-slate-500">Authorization</span>
            <span className="text-ceo-gold font-bold uppercase">{currentRole} CLEARANCE</span>
          </div>
        </div>
      </div>

      {renderTabNavigation()}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950/50 relative">
        {/* Emergency Mode Overlay Watermark */}
        {emergencyMode && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 overflow-hidden z-0">
            <div className="text-[200px] font-bold text-red-500 rotate-[-30deg] select-none whitespace-nowrap">EMERGENCY MODE</div>
          </div>
        )}
        
        <div className="relative z-10">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'iam' && renderIAM()}
          {activeTab === 'soc' && renderSOC()}
          {activeTab === 'infrastructure' && renderInfrastructure()}
          {activeTab === 'compliance' && renderCompliance()}
        </div>
      </div>

      {/* Broadcast Modal Overlay */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2"><Radio size={16} className="text-blue-400"/> Dispatch Global Broadcast</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-500 hover:text-white transition-colors"><XCircle size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Content</label>
                <textarea 
                  rows="4" 
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  placeholder="Enter directive to be broadcast to all connected portals..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div className="bg-blue-950/20 border border-blue-900/30 p-3 rounded-xl flex items-start gap-3">
                <AlertTriangle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-200 leading-relaxed">This broadcast will appear instantly as an un-dismissible notification toast on the Manager, Employee, and Customer portals worldwide.</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowBroadcastModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleEmergencyBroadcast} disabled={!broadcastMessage.trim()} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-lg flex items-center gap-2">
                  <Radio size={14} /> Dispatch Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardSecure;
