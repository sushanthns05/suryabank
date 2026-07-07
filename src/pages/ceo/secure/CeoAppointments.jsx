import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, Users, CheckCircle, 
  XCircle, AlertCircle, Plus, Search, ChevronRight, 
  MoreVertical, FileText, Activity, BrainCircuit, 
  TrendingUp, ShieldAlert, BarChart3, Star, Zap,
  Briefcase, Coffee, Video, MapPin, Download, Share2,
  CalendarDays, Settings, BellRing, FileBadge
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { getAvailableSlots, subscribeToCEOAppointments, updateAppointmentStatus, addMeetingSlot } from '../../../services/appointmentService';
import { useCeoCMS } from '../../../context/CeoCMSContext';
import EditableText from '../../../components/ceo/cms/EditableText';

// --- MOCK DATA FOR ENTERPRISE DEMO ---
const mockAnalyticsData = [
  { name: 'Mon', requests: 12, approved: 8, duration: 4.5 },
  { name: 'Tue', requests: 19, approved: 12, duration: 6 },
  { name: 'Wed', requests: 15, approved: 10, duration: 5.5 },
  { name: 'Thu', requests: 22, approved: 14, duration: 7 },
  { name: 'Fri', requests: 10, approved: 6, duration: 3 },
];

const mockDeptData = [
  { name: 'Finance', value: 35 },
  { name: 'Risk', value: 25 },
  { name: 'IT & Eng', value: 20 },
  { name: 'Retail', value: 15 },
  { name: 'HR', value: 5 },
];

const COLORS = ['#D4AF37', '#1E3A8A', '#475569', '#F59E0B', '#10B981'];

const mockTimeline = [
  { time: '08:00', title: 'Executive Briefing', type: 'internal', status: 'completed' },
  { time: '09:30', title: 'Board Meeting', type: 'board', status: 'current' },
  { time: '11:00', title: 'Manager Meeting', type: 'internal', status: 'upcoming' },
  { time: '12:30', title: 'Lunch & Personal Time', type: 'personal', status: 'upcoming' },
  { time: '14:00', title: 'Investor Call (Q3)', type: 'external', status: 'upcoming' },
  { time: '16:00', title: 'Product Review', type: 'internal', status: 'upcoming' },
  { time: '17:30', title: 'Employee Town Hall', type: 'company', status: 'upcoming' },
];

const mockAiInsights = [
  { id: 1, title: 'Schedule Conflict Risk', desc: 'Upcoming travel to London conflicts with 3 proposed meetings.', type: 'warning' },
  { id: 2, title: 'Strategic Focus', desc: '70% of today\'s meetings align with Q3 Growth Objectives.', type: 'positive' },
  { id: 3, title: 'Energy Optimizer', desc: 'Consider blocking 15:00-16:00 to recharge before the Town Hall.', type: 'suggestion' },
];

const CeoAppointments = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, calendar, requests, analytics
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState(null); 
  const [reviewNotes, setReviewNotes] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [requestFilter, setRequestFilter] = useState('Pending');

  // CMS
  const { isEditMode } = useCeoCMS();

  // Calendar Dynamic Dates & Block Time
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [blockForm, setBlockForm] = useState({
    dayIndex: 0,
    startTime: '09:00',
    endTime: '10:00',
    title: 'Focus Time'
  });

  // Availability Modal State
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilityForm, setAvailabilityForm] = useState({
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    duration: '1 hour'
  });

  useEffect(() => {
    const fetchSlots = async () => {
      const slotsRes = await getAvailableSlots();
      if (slotsRes.success) setAvailableSlots(slotsRes.data);
    };
    fetchSlots();
  }, []);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    const res = await addMeetingSlot({
      date: availabilityForm.date,
      startTime: availabilityForm.startTime,
      endTime: availabilityForm.endTime,
      duration: availabilityForm.duration
    });
    
    if (res.success) {
      alert('Availability slot added successfully');
      setShowAvailabilityModal(false);
      setAvailableSlots([...availableSlots, res.data]);
    } else {
      alert('Failed to add slot: ' + res.message);
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const distance = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distance);
    
    const weekDays = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push({ name: `${dayNames[i]} ${d.getDate()}`, index: i });
    }
    return weekDays;
  };
  const currentWeek = getWeekDates();

  const timeToPercentage = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const decimalHours = hours + (minutes / 60);
    if (decimalHours < 8) return 0;
    if (decimalHours > 18) return 100;
    return ((decimalHours - 8) / 10) * 100;
  };

  const calculateTopAndHeight = (start, end) => {
    const startPct = timeToPercentage(start);
    const endPct = timeToPercentage(end);
    const height = Math.max(endPct - startPct, 5);
    return { top: `${startPct}%`, height: `${height}%` };
  };

  const handleBlockTime = (e) => {
    e.preventDefault();
    setBlockedSlots([...blockedSlots, { ...blockForm, id: Date.now() }]);
    setShowBlockModal(false);
  };

  const handleQuickAction = (action) => {
    const pendingReqs = appointments.filter(a => a.status === 'Pending');
    switch(action) {
      case 'approve_routine':
        const routine = pendingReqs.filter(r => r.priority !== 'Critical' && r.priority !== 'High');
        routine.forEach(r => updateAppointmentStatus(r.id, { status: 'Approved', reason: 'Bulk approved routine requests.' }));
        setAppointments(prev => prev.map(a => routine.find(ro => ro.id === a.id) ? { ...a, status: 'Approved' } : a));
        alert(`${routine.length} routine requests approved.`);
        break;
      case 'reject_conflicts':
        const conflicts = pendingReqs.filter(r => r.aiRecommendation === 'REJECT');
        conflicts.forEach(r => updateAppointmentStatus(r.id, { status: 'Rejected', reason: 'Bulk rejected due to conflicts.' }));
        setAppointments(prev => prev.map(a => conflicts.find(co => co.id === a.id) ? { ...a, status: 'Rejected' } : a));
        alert(`${conflicts.length} conflicting requests rejected.`);
        break;
      case 'block_tomorrow':
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        let dayIndex = tomorrow.getDay() - 1;
        if (dayIndex === -1) dayIndex = 6;
        setBlockedSlots([...blockedSlots, { id: Date.now(), dayIndex, startTime: '08:00', endTime: '18:00', title: 'Full Day Block' }]);
        alert('Tomorrow has been blocked.');
        break;
      case 'sync_outlook':
        alert('Successfully synced with Outlook Calendar!');
        break;
      case 'optimize':
        alert('Schedule optimized based on AI insights.');
        break;
      case 'settings':
        alert('Opening configuration settings...');
        break;
      default: break;
    }
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCEOAppointments((res) => {
      if (res.success) {
        // Enhance raw data with mock enterprise fields for the demo without overriding essential IDs
        const enhanced = res.data.map((appt, i) => ({
          ...appt,
          riskLevel: ['Low', 'Medium', 'High'][i % 3],
          aiRecommendation: appt.aiRecommendation || (i % 2 === 0 ? 'APPROVE' : (i % 3 === 0 ? 'REJECT' : 'RESCHEDULE')),
          aiReason: appt.aiReason || (i % 2 === 0 ? 'High strategic value. No conflicts.' : 'Conflicts with Q3 reporting focus.'),
          businessValue: appt.businessValue || ['Critical', 'High', 'Medium'][i % 3],
          department: appt.department || ['Finance', 'Risk', 'Technology'][i % 3],
          branch: appt.branch || 'Global HQ',
          score: Math.floor(Math.random() * 30) + 70
        }));
        setAppointments(enhanced);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleReviewAction = async () => {
    if (!selectedRequest || !reviewAction) return;
    
    let status = reviewAction === 'approve' ? 'Approved' : reviewAction === 'reject' ? 'Rejected' : 'Rescheduled';
    
    const auditEntry = {
      action: `CEO ${status}`,
      timestamp: new Date().toISOString(),
      actor: 'CEO Office',
      role: 'CEO',
      ip: '10.0.0.1',
      device: 'iPad Pro'
    };

    const newHistory = [...(selectedRequest.auditHistory || []), auditEntry];

    // Optimistic UI Update (Snapshot will override this shortly)
    setAppointments(prev => prev.map(a => a.id === selectedRequest.id ? { ...a, status, ceoStatus: status, ceoComments: reviewNotes } : a));
    setDrawerOpen(false);
    setReviewAction(null);
    setReviewNotes('');
    
    await updateAppointmentStatus(selectedRequest.id, { 
      status, 
      ceoStatus: status,
      ceoComments: reviewNotes,
      auditHistory: newHistory
    });
  };

  const pendingRequests = appointments.filter(a => a.status === 'Waiting for CEO Approval' || a.status === 'Pending');
  const filteredRequests = appointments
    .filter(a => requestFilter === 'All' ? true : (requestFilter === 'Pending' ? (a.status === 'Waiting for CEO Approval' || a.status === 'Pending') : a.status === requestFilter))
    .filter(a => 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white pb-20 font-sans">
      
      {/* --- TOP COMMAND BAR --- */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/60 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-surya-primary via-yellow-600 to-surya-primary dark:from-yellow-400 dark:via-yellow-200 dark:to-yellow-500 tracking-tight">
            <EditableText 
              collectionName="cms_pages"
              documentId="ceo_appointments"
              fieldKey="mainTitle"
              fallbackText="CEO Decision Center"
            />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            <EditableText 
              collectionName="cms_pages"
              documentId="ceo_appointments"
              fieldKey="subTitle"
              fallbackText="Enterprise Scheduling & Strategic Alignment Command"
            />
          </p>
        </div>
        
        <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
          {['dashboard', 'calendar', 'requests', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all duration-300 ${
                activeTab === tab 
                ? 'bg-white dark:bg-slate-700 text-surya-primary dark:text-yellow-400 shadow-md transform scale-[1.02]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-[1600px] mx-auto space-y-8">
        
        {/* --- TAB: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <KPICard title="Pending Requests" value={pendingRequests.length} icon={AlertCircle} color="text-orange-500" bg="bg-orange-500/10" />
              <KPICard title="Today's Meetings" value={mockTimeline.length} icon={CalendarIcon} color="text-blue-500" bg="bg-blue-500/10" />
              <KPICard title="Exec Utilization" value="84%" icon={Zap} color="text-surya-primary dark:text-yellow-400" bg="bg-yellow-500/10" trend="+2%" />
              <KPICard title="Avg Approval Time" value="1.2h" icon={Clock} color="text-green-500" bg="bg-green-500/10" trend="-15m" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Timeline */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Clock className="text-surya-primary dark:text-yellow-500" /> 
                      <EditableText 
                        collectionName="cms_pages"
                        documentId="ceo_appointments"
                        fieldKey="timelineTitle"
                        fallbackText="Today's Executive Timeline" 
                      />
                    </h2>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Live Sync Active</span>
                  </div>
                  
                  <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[1.45rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                    {mockTimeline.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
                          item.status === 'completed' ? 'bg-green-500' : 
                          item.status === 'current' ? 'bg-surya-primary dark:bg-yellow-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                        }`}>
                          {item.status === 'completed' ? <CheckCircle size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                              item.type === 'board' ? 'text-purple-500' : 
                              item.type === 'external' ? 'text-blue-500' : 
                              item.type === 'personal' ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'
                            }`}>{item.type}</span>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.time}</span>
                          </div>
                          <h3 className="text-lg font-bold">{item.title}</h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Assistant Panel */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 border border-slate-700/50 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <BrainCircuit size={150} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-surya-primary/20 rounded-xl"><BrainCircuit className="text-surya-primary dark:text-yellow-400" /></div>
                      <h2 className="text-xl font-bold">
                        <EditableText 
                          collectionName="cms_pages"
                          documentId="ceo_appointments"
                          fieldKey="aiAssistantTitle"
                          fallbackText="Executive AI Assistant" 
                        />
                      </h2>
                    </div>
                    
                    <div className="space-y-4">
                      {mockAiInsights.map(insight => (
                        <div key={insight.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            {insight.type === 'warning' ? <ShieldAlert size={16} className="text-red-400" /> : 
                             insight.type === 'positive' ? <TrendingUp size={16} className="text-green-400" /> : 
                             <Activity size={16} className="text-blue-400" />}
                            <h3 className="text-sm font-bold">{insight.title}</h3>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{insight.desc}</p>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => handleQuickAction('optimize')} className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold backdrop-blur-md transition-colors flex items-center justify-center gap-2">
                      <Settings size={16} /> Optimize Schedule
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Zap className="text-surya-primary" />
                    <EditableText 
                      collectionName="cms_pages"
                      documentId="ceo_appointments"
                      fieldKey="quickActionsTitle"
                      fallbackText="Quick Actions" 
                    />
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <QuickActionBtn onClick={() => handleQuickAction('approve_routine')} icon={CheckCircle} label="Approve Routine" color="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" />
                    <QuickActionBtn onClick={() => handleQuickAction('reject_conflicts')} icon={XCircle} label="Reject Conflicts" color="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400" />
                    <QuickActionBtn onClick={() => handleQuickAction('block_tomorrow')} icon={CalendarDays} label="Block Tomorrow" color="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" />
                    <QuickActionBtn onClick={() => handleQuickAction('sync_outlook')} icon={Share2} label="Sync Outlook" color="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB: REQUESTS QUEUE --- */}
        {activeTab === 'requests' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search requests by name or subject..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-surya-primary outline-none transition-all dark:text-white"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <select 
                  value={requestFilter}
                  onChange={(e) => setRequestFilter(e.target.value)}
                  className="flex-1 md:w-48 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                >
                  <option value="Pending">Pending Approvals</option>
                  <option value="Approved">Upcoming / Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="All">All Requests</option>
                </select>
                <button onClick={() => handleQuickAction('settings')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><Settings size={20} /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-20 text-center text-slate-500">Processing Requests...</div>
              ) : filteredRequests.length === 0 ? (
                <div className="col-span-full py-20 text-center text-slate-500">No requests found for this category.</div>
              ) : (
                filteredRequests.map((req, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={req.id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all group relative cursor-pointer"
                    onClick={() => { setSelectedRequest(req); setReviewAction(null); setReviewNotes(''); setDrawerOpen(true); }}
                  >
                    {/* Priority Strip */}
                    <div className={`h-1.5 w-full ${req.priority === 'Critical' ? 'bg-red-500' : req.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-600 dark:from-slate-700 dark:to-slate-500 text-white flex items-center justify-center font-bold shadow-inner text-lg">
                            {req.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{req.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{req.designation} • {req.department}</p>
                          </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          req.priority === 'Critical' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {req.priority}
                        </div>
                      </div>

                      <h4 className="font-bold text-lg mb-2 line-clamp-1">{req.subject}</h4>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="flex items-center text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2 py-1 rounded-md">
                          <CalendarIcon size={12} className="mr-1.5 text-surya-primary" /> {req.requestedDate}
                        </span>
                        <span className="flex items-center text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2 py-1 rounded-md">
                          <Clock size={12} className="mr-1.5 text-surya-primary" /> {req.requestedStartTime}
                        </span>
                      </div>

                      {/* AI Block */}
                      <div className={`mt-4 p-3 rounded-xl border ${
                        req.aiRecommendation === 'APPROVE' ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/50' : 
                        req.aiRecommendation === 'REJECT' ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50' : 
                        'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/50'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <BrainCircuit size={14} className={
                            req.aiRecommendation === 'APPROVE' ? 'text-green-600 dark:text-green-400' : 
                            req.aiRecommendation === 'REJECT' ? 'text-red-600 dark:text-red-400' : 
                            'text-yellow-600 dark:text-yellow-400'
                          }/>
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                            req.aiRecommendation === 'APPROVE' ? 'text-green-700 dark:text-green-400' : 
                            req.aiRecommendation === 'REJECT' ? 'text-red-700 dark:text-red-400' : 
                            'text-yellow-700 dark:text-yellow-400'
                          }`}>
                            AI: {req.aiRecommendation}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{req.aiReason}</p>
                      </div>

                    </div>
                    <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center group-hover:bg-surya-primary group-hover:text-white transition-colors">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-white/80">Review Full Request</span>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-white" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* --- TAB: CALENDAR --- */}
        {activeTab === 'calendar' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold">Executive Calendar</h2>
                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                  <button className="px-3 py-1 bg-white dark:bg-slate-700 rounded-md text-sm font-bold shadow-sm">Week</button>
                  <button className="px-3 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-sm font-bold">Month</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowAvailabilityModal(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold flex items-center shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <Plus size={16} className="mr-2" /> Set Availability
                </button>
                <button 
                  onClick={() => setShowBlockModal(true)}
                  className="px-4 py-2 bg-surya-primary text-white dark:bg-surya-secondary dark:text-slate-900 rounded-xl text-sm font-bold flex items-center shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <Plus size={16} className="mr-2" /> Block Time
                </button>
              </div>
            </div>
            
            {/* Mock Calendar Grid */}
            <div className="flex-1 p-6 bg-slate-50/30 dark:bg-black/20">
              <div className="grid grid-cols-6 gap-4 h-full">
                {/* Time column */}
                <div className="col-span-1 space-y-12 pt-12 border-r border-slate-200 dark:border-slate-800 text-right pr-4 text-xs font-bold text-slate-400">
                  <div>08:00 AM</div>
                  <div>10:00 AM</div>
                  <div>12:00 PM</div>
                  <div>02:00 PM</div>
                  <div>04:00 PM</div>
                  <div>06:00 PM</div>
                </div>
                {/* Day columns */}
                {currentWeek.map((dayObj) => (
                  <div key={dayObj.index} className="col-span-1 relative border-r border-slate-100 dark:border-slate-800/50 last:border-0 min-h-[400px]">
                    <div className="text-center font-bold text-sm mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">{dayObj.name}</div>
                    
                    {/* Render User Blocked Slots */}
                    {blockedSlots.filter(s => Number(s.dayIndex) === dayObj.index).map(slot => {
                      const pos = calculateTopAndHeight(slot.startTime, slot.endTime);
                      return <CalendarBlock key={slot.id} top={pos.top} height={pos.height} title={slot.title} type="personal" />;
                    })}

                    {/* Mock blocks overlay */}
                    {dayObj.index === 0 && <CalendarBlock top="10%" height="20%" title="Board Mtg" type="board" />}
                    {dayObj.index === 1 && <CalendarBlock top="30%" height="15%" title="Branch Review" type="internal" />}
                    {dayObj.index === 2 && <CalendarBlock top="50%" height="10%" title="Lunch" type="personal" />}
                    {dayObj.index === 3 && <CalendarBlock top="20%" height="25%" title="Investor Call" type="external" />}
                    {dayObj.index === 4 && <CalendarBlock top="60%" height="30%" title="Strategy Q3" type="internal" />}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB: ANALYTICS --- */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Meeting Volume (Weekly)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockAnalyticsData}>
                      <defs>
                        <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                      <Area type="monotone" dataKey="requests" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
                      <Area type="monotone" dataKey="approved" stroke="#1E3A8A" strokeWidth={3} fillOpacity={0.1} fill="#1E3A8A" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Departmental Distribution</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={mockDeptData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                        {mockDeptData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>

      {/* --- EXECUTIVE MEETING DRAWER --- */}
      <AnimatePresence>
        {drawerOpen && selectedRequest && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => { setDrawerOpen(false); setReviewAction(null); setReviewNotes(''); }}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-start">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase rounded">{selectedRequest.meetingType}</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300 text-xs font-bold uppercase rounded">ID: {selectedRequest.employeeId}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{selectedRequest.subject}</h2>
                </div>
                <button onClick={() => { setDrawerOpen(false); setReviewAction(null); setReviewNotes(''); }} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                  <XCircle size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                
                {/* Employee Profile Card */}
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-surya-primary to-yellow-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white dark:ring-slate-900">
                    {selectedRequest.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedRequest.name}</h3>
                    <p className="text-sm font-medium text-slate-500">{selectedRequest.designation} • {selectedRequest.department}</p>
                    <div className="flex gap-4 mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1"><MapPin size={12}/> {selectedRequest.branch}</span>
                      <span className="flex items-center gap-1"><Briefcase size={12}/> Tenure: 4 Yrs</span>
                    </div>
                  </div>
                  <div className="text-center px-4 border-l border-slate-200 dark:border-slate-700">
                    <div className="text-2xl font-black text-surya-primary dark:text-yellow-500">{selectedRequest.score}</div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Trust Score</div>
                  </div>
                </div>

                {/* AI Recommendation Highlight */}
                <div className={`p-5 rounded-2xl border ${
                  selectedRequest.aiRecommendation === 'APPROVE' ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800/50' : 
                  'bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800/50'
                }`}>
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2">
                    <BrainCircuit size={16} /> AI Scheduling Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Recommendation</div>
                      <div className={`font-black text-lg ${selectedRequest.aiRecommendation === 'APPROVE' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedRequest.aiRecommendation}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Business Impact</div>
                      <div className="font-black text-lg text-slate-800 dark:text-white">{selectedRequest.businessValue}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-slate-500 mb-1">Reasoning</div>
                      <div className="text-sm font-medium">{selectedRequest.aiReason} Estimated ROI is positive based on previous engagements with this department.</div>
                    </div>
                  </div>
                </div>

                {/* Meeting Specifics */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">Request Details</h4>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <span className="block text-xs text-slate-400 mb-1">Requested Time</span>
                      <span className="flex items-center font-bold text-sm bg-slate-100 dark:bg-slate-800 w-fit px-3 py-1.5 rounded-lg"><CalendarIcon size={14} className="mr-2 text-surya-primary"/> {selectedRequest.requestedDate} @ {selectedRequest.requestedStartTime}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 mb-1">Meeting Mode</span>
                      <span className="flex items-center font-bold text-sm bg-slate-100 dark:bg-slate-800 w-fit px-3 py-1.5 rounded-lg">
                        {selectedRequest.meetingType === 'Video Conference' ? <Video size={14} className="mr-2 text-blue-500"/> : <Users size={14} className="mr-2 text-green-500"/>} 
                        {selectedRequest.meetingType}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-xs text-slate-400 mb-1">Purpose & Agenda</span>
                      <p className="text-sm bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 leading-relaxed">
                        {selectedRequest.purpose}
                        <br/><br/>
                        <span className="font-bold">Proposed Agenda:</span><br/>
                        {selectedRequest.agenda || '1. Overview\n2. Key Metrics Review\n3. Strategic Approvals'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manager Feedback */}
                {selectedRequest.managerComments && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-500 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
                      <FileBadge size={14} /> Manager Endorsement
                    </h4>
                    <p className="text-sm bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 leading-relaxed italic text-slate-700 dark:text-slate-300">
                      "{selectedRequest.managerComments}"
                    </p>
                  </div>
                )}

                {/* Audit Log */}
                {selectedRequest.auditHistory && selectedRequest.auditHistory.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
                      <ShieldAlert size={14} /> Enterprise Audit Trail
                    </h4>
                    <div className="space-y-3">
                      {selectedRequest.auditHistory.map((log, i) => (
                        <div key={i} className="text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{log.action}</span> by {log.actor} ({log.role})
                          </div>
                          <div className="text-right text-slate-400">
                            <div>{new Date(log.timestamp).toLocaleString()}</div>
                            <div className="text-[10px] uppercase">IP: {log.ip} • {log.device}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Executive Private Notes */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
                    <ShieldAlert size={14} /> Executive Private Notes
                  </h4>
                  <textarea 
                    className="w-full h-24 bg-yellow-50/30 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                    placeholder="Add private notes here. Only visible to you..."
                  ></textarea>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                
                {!reviewAction ? (
                  <div className="flex gap-3">
                    <button onClick={() => setReviewAction('reject')} className="px-6 py-3.5 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors">
                      Decline
                    </button>
                    <button onClick={() => setReviewAction('reschedule')} className="flex-1 py-3.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Suggest New Time
                    </button>
                    <button onClick={() => setReviewAction('approve')} className="flex-1 py-3.5 rounded-xl font-black bg-gradient-to-r from-surya-primary to-yellow-600 text-white shadow-lg shadow-surya-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                      APPROVE & SCHEDULE
                    </button>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                      {reviewAction === 'approve' ? <span className="text-green-600">Confirming Approval</span> : 
                       reviewAction === 'reject' ? <span className="text-red-600">Confirming Rejection</span> : 
                       <span className="text-blue-600">Suggesting Reschedule</span>}
                    </div>
                    <textarea 
                      value={reviewNotes} 
                      onChange={e => setReviewNotes(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-surya-primary"
                      placeholder="Add a note to the employee (optional)..."
                      rows="2"
                    />
                    <div className="flex gap-3">
                      <button onClick={() => setReviewAction(null)} className="px-6 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">Back</button>
                      <button onClick={handleReviewAction} className={`flex-1 py-3 rounded-xl font-black text-white shadow-lg ${
                        reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30' : 
                        reviewAction === 'reject' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30' : 
                        'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                      }`}>
                        EXECUTE DECISION
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- SET AVAILABILITY MODAL --- */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-green-50 dark:bg-green-900/30">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><CheckCircle size={20} className="text-green-500" /> Publish Availability Slot</h3>
              <button onClick={() => setShowAvailabilityModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAddAvailability} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input type="date" required value={availabilityForm.date} onChange={e => setAvailabilityForm({...availabilityForm, date: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input type="time" required value={availabilityForm.startTime} onChange={e => setAvailabilityForm({...availabilityForm, startTime: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                  <input type="time" required value={availabilityForm.endTime} onChange={e => setAvailabilityForm({...availabilityForm, endTime: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration text (e.g. 1 hour)</label>
                <input type="text" required value={availabilityForm.duration} onChange={e => setAvailabilityForm({...availabilityForm, duration: e.target.value})} placeholder="1 hour" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAvailabilityModal(false)} className="px-4 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-green-500 text-white font-bold rounded-lg hover:shadow-md transition-shadow">Publish Slot</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* --- BLOCK TIME MODAL --- */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><CalendarDays size={20} className="text-surya-primary" /> Block Time on Calendar</h3>
              <button onClick={() => setShowBlockModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleBlockTime} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Day of Week</label>
                <select 
                  value={blockForm.dayIndex} 
                  onChange={e => setBlockForm({...blockForm, dayIndex: e.target.value})} 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-surya-primary"
                >
                  {currentWeek.map(d => <option key={d.index} value={d.index}>{d.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input type="time" required value={blockForm.startTime} onChange={e => setBlockForm({...blockForm, startTime: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-surya-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                  <input type="time" required value={blockForm.endTime} onChange={e => setBlockForm({...blockForm, endTime: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-surya-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason / Title</label>
                <input type="text" required value={blockForm.title} onChange={e => setBlockForm({...blockForm, title: e.target.value})} placeholder="e.g. Deep Work, Out of Office" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-surya-primary" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowBlockModal(false)} className="px-4 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-surya-primary text-white dark:bg-surya-secondary dark:text-slate-900 font-bold rounded-lg hover:shadow-md transition-shadow">Block Schedule</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

// --- HELPER COMPONENTS ---

const KPICard = ({ title, value, icon: Icon, color, bg, trend }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${bg} blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white">{value}</h3>
        {trend && <span className="text-xs font-bold text-green-500 mt-2 block">{trend} vs last week</span>}
      </div>
      <div className={`p-3 rounded-2xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const QuickActionBtn = ({ icon: Icon, label, color, onClick }) => (
  <button onClick={onClick} className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-xs transition-transform hover:-translate-y-1 ${color}`}>
    <Icon size={24} />
    {label}
  </button>
);

const CalendarBlock = ({ top, height, title, type }) => {
  const colors = {
    board: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800/50 dark:text-purple-400',
    internal: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-400',
    external: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800/50 dark:text-orange-400',
    personal: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-400',
  };
  
  return (
    <div 
      className={`absolute w-[90%] left-[5%] rounded-lg p-2 border shadow-sm text-xs cursor-pointer hover:shadow-md transition-all ${colors[type] || colors.internal}`}
      style={{ top, height }}
    >
      <div className="font-bold line-clamp-1">{title}</div>
    </div>
  );
};

export default CeoAppointments;
