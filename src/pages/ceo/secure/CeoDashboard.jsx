import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, setDoc, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useCeoAuth } from '../../../context/CeoAuthContext';
import { 
  Activity, Check, X, Shield, ShieldAlert, Clock, TrendingUp, Users, 
  FileText, Layers, Lock, AlertTriangle, RefreshCw, MessageSquare, 
  Calendar, Building, Server, CheckCircle2, ChevronRight, HelpCircle,
  Send, Radio, Loader2, Megaphone
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

const CeoDashboard = () => {
  const { user, role } = useCeoAuth();
  
  // Dashboard Sub-Tab
  const [activeTab, setActiveTab] = useState('operations'); // operations | integrations | approvals | cybersecurity | compliance

  // Core Approvals state (loads from Firestore or populates default)
  const [approvals, setApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loadingApprovals, setLoadingApprovals] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    aum: '$485.4B',
    customers: '24.8M',
    employees: '12,482',
    cyberScore: '98/100',
    aumGrowth: '+16.4%',
    custGrowth: '+8.2%',
    empGrowth: '+2.1%',
    threatStatus: 'Optimal'
  });

  // System Live Status logs
  const [operations, setOperations] = useState([
    { name: 'Core Banking Ledger', status: 'Optimal', latency: '4ms', uptime: '99.99%', health: 100 },
    { name: 'UPI & Payment Gateway', status: 'Optimal', latency: '12ms', uptime: '99.95%', health: 100 },
    { name: 'ATM Network', status: 'Warning', latency: '48ms', uptime: '98.8%', health: 85 },
    { name: 'Employee HR Portal', status: 'Optimal', latency: '8ms', uptime: '99.9%', health: 100 },
    { name: 'AI Floating Assistant', status: 'Optimal', latency: '15ms', uptime: '99.99%', health: 100 },
    { name: 'Firewall & Shield Gateway', status: 'Optimal', latency: '2ms', uptime: '100%', health: 100 }
  ]);

  // HR Division metrics
  const hrMetrics = {
    totalActive: '10,240 Online',
    onLeave: '184',
    trainingsComplete: '94.2%',
    deptPerformance: [
      { name: 'Retail', score: 94 },
      { name: 'Corporate', score: 91 },
      { name: 'Security', score: 98 },
      { name: 'Treasury', score: 89 },
      { name: 'Support', score: 95 }
    ]
  };

  // Manager budget utilization
  const managerBudgets = [
    { department: 'Innovation Lab', budget: '$18M', spent: '$12.4M', requests: 2 },
    { department: 'Risk Management', budget: '$8M', spent: '$6.1M', requests: 0 },
    { department: 'Global Operations', budget: '$35M', spent: '$29.0M', requests: 4 },
    { department: 'Corporate Marketing', budget: '$12M', spent: '$9.2M', requests: 1 }
  ];

  // Cybersecurity events logs
  const securityThreats = [
    { ip: '198.51.100.42', event: 'DDoS mitigation triggers on API Gateway', severity: 'High', action: 'Blocked & Logged', timestamp: '11:42:01' },
    { ip: '203.0.113.115', event: 'Multiple failed manager portal authentication trials', severity: 'Medium', action: 'IP Blacklisted', timestamp: '11:28:15' },
    { ip: '103.241.12.8', event: 'CEO Workspace session created', severity: 'Low', action: 'Token Signed', timestamp: '11:58:00' }
  ];

  // Recharts mock customer growth dataset
  const customerGrowthData = [
    { month: 'Jan', count: 20 },
    { month: 'Feb', count: 21 },
    { month: 'Mar', count: 22 },
    { month: 'Apr', count: 23 },
    { month: 'May', count: 24.2 },
    { month: 'Jun', count: 24.8 }
  ];

  // Quick-send directive widget state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickMessage, setQuickMessage] = useState('');
  const [quickAudience, setQuickAudience] = useState('all_staff');
  const [quickSending, setQuickSending] = useState(false);
  const [quickStatus, setQuickStatus] = useState(null);

  const handleQuickSend = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickMessage.trim()) return;

    setQuickSending(true);
    try {
      await addDoc(collection(db, 'ceo_directives'), {
        type: 'broadcast',
        audience: quickAudience,
        priority: 'standard',
        title: quickTitle.trim(),
        message: quickMessage.trim(),
        author: 'CEO Office — Sushanth NS',
        authorEmail: user?.email || 'ceo@suryabank.com',
        status: 'active',
        timestamp: new Date().toISOString()
      });
      setQuickTitle('');
      setQuickMessage('');
      setQuickStatus('success');
    } catch (err) {
      console.error(err);
      setQuickStatus('error');
    } finally {
      setQuickSending(false);
      setTimeout(() => setQuickStatus(null), 3000);
    }
  };

  // Load and listen to unified approvals from Firestore
  useEffect(() => {
    setLoadingApprovals(true);
    const q = query(collection(db, 'ceo_approvals'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Self-populate Firestore with high-fidelity approvals if empty
        const initialApprovals = [
          { 
            category: 'Corporate Loan Request', 
            title: 'Adani Infrastructure Green Energy expansion', 
            amount: '$45,000,000', 
            applicant: 'G. Adani (Chairman)', 
            date: '2026-07-04', 
            status: 'Pending', 
            comments: [{ user: 'Executive Assistant', text: 'Balance sheet, assets, and regulatory clearances verified. Approved to escalate.' }],
            details: 'Financial loan request for Q3 solar power installations project across Andhra Pradesh and Gujarat hubs.'
          },
          { 
            category: 'Procurement Contract', 
            title: 'HQ Datacenter Quantum Compute Cluster acquisition', 
            amount: '$1,250,000', 
            applicant: 'Dr. A. Roy (CTO)', 
            date: '2026-07-03', 
            status: 'Pending', 
            comments: [],
            details: 'Upgrading the cryptography firewall framework to fully quantum-resistant standards to prevent future transaction tampering.'
          },
          { 
            category: 'Recruitment Approval', 
            title: 'Hire VP Cybersecurity Engineering Operations', 
            amount: '$320,000 / yr', 
            applicant: 'V. Sharma (Head HR)', 
            date: '2026-07-04', 
            status: 'Pending', 
            comments: [],
            details: 'Replacement search for leading the internal threat analysis and vulnerability division operations at Bengaluru Central HQ.'
          }
        ];

        for (const app of initialApprovals) {
          const docRef = doc(collection(db, 'ceo_approvals'));
          await setDoc(docRef, app);
        }
      } else {
        const list = [];
        snapshot.forEach(docSnap => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        setApprovals(list);
      }
      setLoadingApprovals(false);
    }, (err) => {
      console.error("Failed to sync approvals:", err);
      setLoadingApprovals(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAction = async (approvalId, newStatus) => {
    try {
      const docRef = doc(db, 'ceo_approvals', approvalId);
      await updateDoc(docRef, { status: newStatus });

      // Add audit notification log
      await addDoc(collection(db, 'ceo_notifications'), {
        title: `Document ${newStatus}`,
        message: `Clearance Action: ${role || 'CEO'} has designated status as ${newStatus} for approval ID ${approvalId}.`,
        type: newStatus === 'Approved' ? 'info' : 'warning',
        read: false,
        timestamp: new Date().toISOString(),
        role: role || 'CEO'
      });

      setSelectedApproval(null);
    } catch (e) {
      console.error(e);
      alert("Failed to sign off approval action.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedApproval) return;

    try {
      const updatedComments = [
        ...(selectedApproval.comments || []),
        { user: role || 'CEO', text: newComment.trim(), time: new Date().toLocaleTimeString() }
      ];
      
      const docRef = doc(db, 'ceo_approvals', selectedApproval.id);
      await updateDoc(docRef, { comments: updatedComments });
      
      setSelectedApproval(prev => ({ ...prev, comments: updatedComments }));
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'High': return 'bg-red-950/40 text-red-400 border border-red-900';
      case 'Medium': return 'bg-amber-950/40 text-amber-400 border border-amber-900';
      default: return 'bg-blue-950/40 text-blue-400 border border-blue-900';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Welcome Command Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-ceo-navy via-slate-900 to-slate-950 border border-slate-805 shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ceo-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-ceo-gold/15 text-ceo-gold border border-ceo-gold/30 px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">CLEARANCE: LEVEL 5 (CEO EXECUTIVE OFFICE)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-mono">Live Systems Connection Online</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold tracking-tight">Executive Command Center</h1>
          <p className="text-xs text-slate-400">Integrations oversight and authorization portal. Active Session: <strong className="text-white font-mono">{user?.email}</strong></p>
        </div>
        <div className="flex gap-3 relative shrink-0">
          <Link to="/ceo/calendar" className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700">
            <Calendar size={14} className="text-ceo-gold" /> Calendar Portal
          </Link>
          <Link to="/ceo/vault" className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700">
            <Layers size={14} className="text-ceo-gold" /> Secure Vault
          </Link>
        </div>
      </div>

      {/* Quick-Send Directive Widget */}
      <div className="bg-slate-900 border border-slate-805 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-ceo-gold" />
            <h3 className="text-sm font-serif font-bold text-white">Quick Broadcast</h3>
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Cross-Portal Dispatch</span>
          </div>
          <Link to="/ceo/command-center" className="text-[10px] font-bold text-ceo-gold hover:underline flex items-center gap-1">
            <Radio size={12} /> Full Command Center <ChevronRight size={12} />
          </Link>
        </div>
        <form onSubmit={handleQuickSend} className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <select
            value={quickAudience}
            onChange={(e) => setQuickAudience(e.target.value)}
            className="md:col-span-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-ceo-gold focus:outline-none"
          >
            <option value="all_staff">All Staff</option>
            <option value="managers">Managers</option>
            <option value="employees">Employees</option>
            <option value="customers">Customers</option>
          </select>
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Subject line..."
            className="md:col-span-3 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-ceo-gold focus:outline-none"
            required
          />
          <input
            type="text"
            value={quickMessage}
            onChange={(e) => setQuickMessage(e.target.value)}
            placeholder="Directive message..."
            className="md:col-span-5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-ceo-gold focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={quickSending || !quickTitle.trim() || !quickMessage.trim()}
            className="md:col-span-2 py-2 rounded-lg bg-ceo-gold hover:bg-yellow-500 text-ceo-navy font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
          >
            {quickSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {quickSending ? 'Sending...' : 'Dispatch'}
          </button>
        </form>
        {quickStatus === 'success' && (
          <p className="text-emerald-400 text-[10px] font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} /> Directive dispatched successfully.
          </p>
        )}
        {quickStatus === 'error' && (
          <p className="text-red-400 text-[10px] font-bold mt-2 flex items-center gap-1">
            <AlertTriangle size={12} /> Failed to dispatch. Try again.
          </p>
        )}
      </div>

      {/* Main KPI Counters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-805 p-5 rounded-2xl shadow-lg space-y-2 relative overflow-hidden group hover:border-ceo-gold/20 transition-all">
          <div className="absolute right-3 top-3 text-ceo-gold opacity-15"><Building size={28} /></div>
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Total Assets Managed</span>
          <strong className="block text-2xl font-serif text-white font-bold">{stats.aum}</strong>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1"><TrendingUp size={12} /> {stats.aumGrowth} Growth</span>
        </div>
        <div className="bg-slate-900 border border-slate-805 p-5 rounded-2xl shadow-lg space-y-2 relative overflow-hidden group hover:border-ceo-gold/20 transition-all">
          <div className="absolute right-3 top-3 text-ceo-gold opacity-15"><Users size={28} /></div>
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Active Customers</span>
          <strong className="block text-2xl font-serif text-white font-bold">{stats.customers}</strong>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1"><TrendingUp size={12} /> {stats.custGrowth} YoY Growth</span>
        </div>
        <div className="bg-slate-900 border border-slate-805 p-5 rounded-2xl shadow-lg space-y-2 relative overflow-hidden group hover:border-ceo-gold/20 transition-all">
          <div className="absolute right-3 top-3 text-ceo-gold opacity-15"><Layers size={28} /></div>
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">HR Employee Count</span>
          <strong className="block text-2xl font-serif text-white font-bold">{stats.employees}</strong>
          <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={12} /> {hrMetrics.totalActive}</span>
        </div>
        <div className="bg-slate-900 border border-slate-805 p-5 rounded-2xl shadow-lg space-y-2 relative overflow-hidden group hover:border-ceo-gold/20 transition-all">
          <div className="absolute right-3 top-3 text-ceo-gold opacity-15"><Shield size={28} /></div>
          <span className="text-[9px] uppercase font-bold text-slate-550 tracking-wider">Cybersecurity Risk Score</span>
          <strong className="block text-2xl font-serif text-emerald-400 font-bold">{stats.cyberScore}</strong>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1"><Lock size={12} /> Threat Grid {stats.threatStatus}</span>
        </div>
      </div>

      {/* Internal Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('operations')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
            activeTab === 'operations' ? 'border-ceo-gold text-ceo-gold' : 'border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Activity size={14} /> Systems & Banking Operations
          </div>
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
            activeTab === 'integrations' ? 'border-ceo-gold text-ceo-gold' : 'border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building size={14} /> Portal Telemetry Integrations
          </div>
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 relative ${
            activeTab === 'approvals' ? 'border-ceo-gold text-ceo-gold' : 'border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} /> Executive Approval Desk
            {approvals.filter(a => a.status === 'Pending').length > 0 && (
              <span className="bg-ceo-gold text-ceo-navy font-bold rounded-full w-4 h-4 text-[9px] flex items-center justify-center">
                {approvals.filter(a => a.status === 'Pending').length}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('cybersecurity')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
            activeTab === 'cybersecurity' ? 'border-ceo-gold text-ceo-gold' : 'border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} /> Security Command Grid
          </div>
        </button>
      </div>

      {/* Main Tab Switch Container */}
      <div className="bg-slate-900/40 border border-slate-805 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        
        {/* TAB 1: OPERATIONS */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-lg font-serif font-bold text-white">Live Operations Monitor</h2>
                <p className="text-xs text-slate-400">Real-time uptime metrics, latency rates, and server indicators.</p>
              </div>
              <button 
                onClick={() => {
                  setOperations(prev => prev.map(o => ({
                    ...o,
                    latency: `${Math.floor(Math.random() * 20) + 2}ms`
                  })));
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Refresh logs"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {operations.map((op, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-805 p-4 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <strong className="text-white text-sm block">{op.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">Response Speed: {op.latency}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                      op.status === 'Optimal' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/60' : 'bg-amber-950/50 text-amber-400 border border-amber-900/60'
                    }`}>
                      {op.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-450">
                      <span>Uptime: {op.uptime}</span>
                      <span>Health Score: {op.health}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${op.health === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${op.health}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compliance warning alert panel */}
            <div className="p-4 bg-amber-950/20 border border-amber-900/50 rounded-2xl flex gap-3 text-xs">
              <AlertTriangle className="text-amber-500 shrink-0" size={18} />
              <div className="space-y-1">
                <strong className="text-amber-200 block">UPI Gateway Alert Logged</strong>
                <p className="text-slate-400 leading-normal text-[11px]">
                  Payment transaction rates spiked in Bengaluru branch servers, causing latency latency of 48ms. Back-up gateways have loaded successfully. Uptime standards preserved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PORTAL TELEMETRY */}
        {activeTab === 'integrations' && (
          <div className="space-y-8">
            {/* Split layout: Customer growth & HR scores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
              
              {/* Customer Portal Trends */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Customer Portal Acquisition Trend</h3>
                  <p className="text-xs text-slate-400">Total savings account balances and digital signups registered (in Millions).</p>
                </div>
                
                <div className="h-56 w-full bg-slate-950/80 rounded-2xl p-4 border border-slate-805">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAum" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#475569" fontSize={10} />
                      <YAxis stroke="#475569" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155' }} />
                      <Area type="monotone" dataKey="count" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorAum)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* HR / Employee Performance */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Employee HR Performance metrics</h3>
                  <p className="text-xs text-slate-400">Average departmental completion of regulatory compliance training and productivity benchmarks.</p>
                </div>

                <div className="h-56 w-full bg-slate-950/80 rounded-2xl p-4 border border-slate-805">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hrMetrics.deptPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#475569" fontSize={10} />
                      <YAxis stroke="#475569" fontSize={10} domain={[80, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155' }} />
                      <Bar dataKey="score" fill="#d4af37" radius={[4, 4, 0, 0]}>
                        {hrMetrics.deptPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#d4af37' : '#9a7b1c'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Manager budgets board */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Manager Portal Allocation & Budgets</h3>
                <p className="text-xs text-slate-400">Department budget balances and pending recruitment hiring requisitions from managers.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-350 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Department Division</th>
                      <th className="py-3 px-4">Budget Cap</th>
                      <th className="py-3 px-4">Utilized Funds</th>
                      <th className="py-3 px-4">Pending Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managerBudgets.map((mb, index) => (
                      <tr key={index} className="border-b border-slate-850 hover:bg-slate-900/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">{mb.department}</td>
                        <td className="py-3 px-4 font-mono">{mb.budget}</td>
                        <td className="py-3 px-4 font-mono">{mb.spent}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            mb.requests > 0 ? 'bg-ceo-gold/20 text-ceo-gold' : 'bg-slate-800/50 text-slate-500'
                          }`}>
                            {mb.requests} Requests
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: APPROVAL CENTER */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-serif font-bold text-white">Executive Sign-Off Desk</h2>
              <p className="text-xs text-slate-400">Review, append comments, and authorize or reject high-value actions.</p>
            </div>

            {loadingApprovals ? (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-ceo-gold" size={24} />
                <span className="text-xs">Connecting securely to authorization desk...</span>
              </div>
            ) : approvals.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs">
                
                {/* List of approvals */}
                <div className="lg:col-span-6 space-y-3">
                  {approvals.map((app) => (
                    <div 
                      key={app.id} 
                      onClick={() => setSelectedApproval(app)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                        selectedApproval?.id === app.id 
                          ? 'bg-slate-900 border-ceo-gold shadow-md' 
                          : 'bg-slate-900/60 border-slate-805 hover:bg-slate-900 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                          {app.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          app.status === 'Pending' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/60' :
                          app.status === 'Approved' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60' :
                          'bg-red-950/40 text-red-400 border border-red-900/60'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-white leading-snug">{app.title}</h4>
                      <div className="flex justify-between text-[10px] text-slate-450">
                        <span>Requester: {app.applicant}</span>
                        <strong className="text-ceo-gold font-mono">{app.amount}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detail View / Actions */}
                <div className="lg:col-span-6 bg-slate-900/80 border border-slate-805 p-6 rounded-2xl space-y-6">
                  {selectedApproval ? (
                    <div className="space-y-6 text-left">
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase font-mono text-ceo-gold font-bold">CLEARANCE ITEM DETAILS</span>
                        <h3 className="text-base font-bold text-white font-serif leading-snug">{selectedApproval.title}</h3>
                        <div className="grid grid-cols-2 gap-4 bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[11px]">
                          <div>
                            <span className="text-slate-500 block text-[9px] uppercase font-bold">Sum Requested</span>
                            <strong className="text-white text-xs">{selectedApproval.amount}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px] uppercase font-bold">Submission Date</span>
                            <strong className="text-white text-xs">{selectedApproval.date}</strong>
                          </div>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed mt-2">{selectedApproval.details}</p>
                      </div>

                      {/* Comment History */}
                      <div className="space-y-3">
                        <strong className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Clearance History & Audit</strong>
                        <div className="space-y-2 max-h-36 overflow-y-auto px-1">
                          {selectedApproval.comments && selectedApproval.comments.length > 0 ? (
                            selectedApproval.comments.map((c, idx) => (
                              <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[10px] space-y-1">
                                <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                                  <span>{c.user}</span>
                                  <span>{c.time || 'Logged'}</span>
                                </div>
                                <p className="text-slate-300 leading-normal">{c.text}</p>
                              </div>
                            ))
                          ) : (
                            <span className="text-slate-500 block py-2">No comments have been logged yet.</span>
                          )}
                        </div>

                        {/* Add Comment Form */}
                        <form onSubmit={handleAddComment} className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Add sign-off comment or query..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-white focus:outline-none focus:border-ceo-gold/60"
                          />
                          <button 
                            type="submit" 
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                          >
                            Add
                          </button>
                        </form>
                      </div>

                      {/* Action buttons */}
                      {selectedApproval.status === 'Pending' && (
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => handleAction(selectedApproval.id, 'Rejected')}
                            className="w-1/3 py-2.5 rounded-lg border border-slate-800 hover:bg-red-950 hover:text-red-400 text-white font-bold transition-all"
                          >
                            Deny
                          </button>
                          <button
                            onClick={() => handleAction(selectedApproval.id, 'Changes Requested')}
                            className="w-1/3 py-2.5 rounded-lg border border-slate-850 hover:bg-slate-800 text-slate-300 font-bold transition-all"
                          >
                            Query
                          </button>
                          <button
                            onClick={() => handleAction(selectedApproval.id, 'Approved')}
                            className="w-1/3 py-2.5 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold transition-all"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-24 text-center text-slate-550">
                      <HelpCircle className="mx-auto mb-3 opacity-20" size={32} />
                      <p>Select a clearance document from the left list to review detailed profiles and audit history.</p>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 border border-dashed border-slate-850 rounded-2xl">
                No active sign-off actions logged.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CYBERSECURITY */}
        {activeTab === 'cybersecurity' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-serif font-bold text-white">Cybersecurity Shield Control</h2>
              <p className="text-xs text-slate-400">Live network threat logs, intrusion updates, and firewall logs.</p>
            </div>

            {/* Severity metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-900 border border-slate-805 rounded-xl space-y-1">
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Intrusion Attempts Today</span>
                <strong className="text-white text-lg font-mono">1,482 Attempts</strong>
                <span className="text-emerald-400 text-[10px] block font-semibold">100% Mitigated</span>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-805 rounded-xl space-y-1">
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Active Firewalls Status</span>
                <strong className="text-emerald-400 text-lg font-mono">ALL OPERATIONAL</strong>
                <span className="text-slate-450 text-[10px] block">Global Clusters Shielded</span>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-805 rounded-xl space-y-1">
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Next Automated Scan</span>
                <strong className="text-white text-lg font-mono">00:41:20</strong>
                <span className="text-slate-450 text-[10px] block">Full cryptographic audit</span>
              </div>
            </div>

            {/* Threat Feed Log */}
            <div className="space-y-3">
              <strong className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live System Threat Stream</strong>
              
              <div className="space-y-2">
                {securityThreats.map((threat, index) => (
                  <div key={index} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono ${getSeverityBadge(threat.severity)}`}>
                          {threat.severity}
                        </span>
                        <strong className="text-white font-mono">{threat.ip}</strong>
                      </div>
                      <p className="text-slate-400 text-[10px]">{threat.event}</p>
                    </div>
                    <div className="text-right self-end sm:self-center">
                      <span className="text-[10px] text-ceo-gold font-bold block">{threat.action}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{threat.timestamp} IST</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default CeoDashboard;
