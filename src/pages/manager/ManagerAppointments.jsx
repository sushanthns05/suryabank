import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, Users, FileText, CheckCircle, 
  XCircle, AlertCircle, Plus, Search, ChevronRight, Briefcase,
  Activity, BarChart3, ShieldCheck, Zap, Download, QrCode, Mail, 
  ArrowRight, FileBadge, CheckSquare, X, Target, Star
} from 'lucide-react';
import { getAvailableSlots, requestAppointment, subscribeToUserAppointments, subscribeToManagerTeamRequests, updateAppointmentStatus } from '../../services/appointmentService';

// Reusable animated KPI Card
const MetricCard = ({ title, value, icon: Icon, colorClass, gradient, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all group"
  >
    <div className={`absolute -right-12 -top-12 w-40 h-40 ${gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
    <div className="p-6 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
          <Icon size={24} />
        </div>
        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
      </div>
      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{title}</h3>
    </div>
  </motion.div>
);

const ManagerAppointments = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, request
  const [appointments, setAppointments] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [managerReviewComments, setManagerReviewComments] = useState('');
  
  // New Request Form State
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    purpose: '',
    agenda: '',
    priority: 'Medium',
    meetingType: 'Branch Review',
    preferredSlotId: '',
    participants: '',
    businessImpact: '',
    requiredDocuments: '',
    remarks: ''
  });

  // Drawer / Selection State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

  const currentUser = {
    name: 'Anjali Sharma',
    employeeId: 'MGR98765',
    department: 'Branch Management',
    branch: 'Mumbai Central',
    designation: 'Senior Branch Manager',
    email: 'anjali.sharma@suryabank.com',
    phone: '+91 91234 56780',
    trustScore: 94
  };

  useEffect(() => {
    // Fetch slots once or on demand
    const fetchSlots = async () => {
      setLoading(true);
      const slotsRes = await getAvailableSlots();
      if (slotsRes.success) setAvailableSlots(slotsRes.data);
      setLoading(false);
    };
    fetchSlots();

    // Subscribe to realtime appointment updates
    setLoading(true);
    const unsubscribe = subscribeToUserAppointments(currentUser.employeeId, (res) => {
      if (res.success) setAppointments(res.data);
      setLoading(false);
    });

    const unsubscribeTeam = subscribeToManagerTeamRequests(currentUser.employeeId, (res) => {
      if (res.success) setTeamRequests(res.data);
    });
    
    return () => {
      unsubscribe();
      unsubscribeTeam();
    };
  }, []);

  const fetchData = async () => {
    // Left for explicit refresh if needed by other components, though slots can be refreshed here
    const slotsRes = await getAvailableSlots();
    if (slotsRes.success) setAvailableSlots(slotsRes.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // AI Readiness calculation
  const aiReadiness = useMemo(() => {
    let score = 20; // Base score
    if (formData.subject.length > 5) score += 15;
    if (formData.purpose.length > 15) score += 15;
    if (formData.agenda.length > 30) score += 20;
    if (formData.businessImpact.length > 10) score += 20;
    if (formData.preferredSlotId) score += 10;
    return score > 100 ? 100 : score;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (aiReadiness < 60) {
      const confirmSubmit = window.confirm("Your AI Readiness Score is low. This may lead to an automatic rejection by the Executive Desk. Do you want to submit anyway?");
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    const selectedSlot = availableSlots.find(s => s.id === formData.preferredSlotId);
    
    if (!selectedSlot) {
      alert("Please select a valid available slot.");
      setSubmitting(false);
      return;
    }

    const requestPayload = {
      ...currentUser,
      ...formData,
      requestedDate: selectedSlot.date,
      requestedStartTime: selectedSlot.startTime,
      requestedEndTime: selectedSlot.endTime,
      expectedDuration: selectedSlot.duration,
      aiRecommendation: aiReadiness >= 80 ? 'APPROVE' : aiReadiness >= 60 ? 'REVIEW' : 'REJECT'
    };

    const res = await requestAppointment(requestPayload);
    if (res.success) {
      alert('Executive Meeting Request submitted successfully.');
      setActiveTab('dashboard');
      fetchData();
      setFormData({
        subject: '', purpose: '', agenda: '', priority: 'Medium', meetingType: 'Branch Review',
        preferredSlotId: '', participants: '', businessImpact: '', requiredDocuments: '', remarks: ''
      });
    } else {
      alert('Failed to request meeting: ' + res.message);
    }
    setSubmitting(false);
  };

  const openMeetingDetails = (appt) => {
    setSelectedRequest(appt);
    setDrawerOpen(true);
  };

  const handleManagerDecision = async (decision) => {
    if (!selectedRequest) return;
    const isApproved = decision === 'Approve';
    const newStatus = isApproved ? 'Waiting for CEO Approval' : 'Rejected by Manager';
    const managerStatus = isApproved ? 'Approved' : 'Rejected';
    
    const auditEntry = {
      action: `Manager ${managerStatus}`,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      role: 'Manager',
      ip: '192.168.1.101',
      device: 'Chrome on Mac'
    };

    const newHistory = [...(selectedRequest.auditHistory || []), auditEntry];

    await updateAppointmentStatus(selectedRequest.id, {
      status: newStatus,
      managerStatus,
      managerComments: managerReviewComments,
      auditHistory: newHistory
    });
    setDrawerOpen(false);
    setManagerReviewComments('');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center gap-1.5"><CheckCircle size={12} /> Approved</span>;
      case 'Pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5"><Clock size={12} /> Under Review</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1.5"><XCircle size={12} /> Declined</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">{status}</span>;
    }
  };

  const upcomingMeetings = appointments.filter(a => a.status === 'Approved');
  const pendingRequests = appointments.filter(a => a.status === 'Pending');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white pb-20 font-sans selection:bg-surya-primary/30">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-surya-primary to-yellow-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Executive Collaboration Workspace</h1>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> CEO Office Online</span>
                <span>•</span>
                <span>Secure Channel</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl">
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-700 text-surya-primary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
              Command Center
            </button>
            <button onClick={() => setActiveTab('inbox')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'inbox' ? 'bg-white dark:bg-slate-700 text-surya-primary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
              Team Inbox {teamRequests.filter(r => r.status === 'Waiting for Manager Review').length > 0 && <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">{teamRequests.filter(r => r.status === 'Waiting for Manager Review').length}</span>}
            </button>
            <button onClick={() => setActiveTab('request')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'request' ? 'bg-gradient-to-r from-surya-primary to-yellow-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
              <Plus size={16} /> New Request
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard title="Approved Exec Sessions" value={upcomingMeetings.length} icon={CalendarIcon} colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" gradient="bg-blue-500" delay={0.1} />
              <MetricCard title="Awaiting CEO Review" value={pendingRequests.length} icon={Clock} colorClass="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" gradient="bg-amber-500" delay={0.2} />
              <MetricCard title="Historical Engagements" value={appointments.length} icon={Briefcase} colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" gradient="bg-purple-500" delay={0.3} />
              <MetricCard title="Exec Trust Score" value={currentUser.trustScore} icon={Star} colorClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" gradient="bg-green-500" delay={0.4} />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Requests Table */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="text-surya-primary" /> Active Workstreams</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="Search sessions..." className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-surya-primary outline-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {loading ? (
                      <div className="py-12 text-center text-slate-500 font-medium">Syncing with Executive Calendar...</div>
                    ) : appointments.length === 0 ? (
                      <div className="py-12 text-center text-slate-500">No meeting requests found. Initiate a new workstream.</div>
                    ) : (
                      appointments.map((appt, idx) => (
                        <motion.div 
                          key={appt.id}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                          onClick={() => openMeetingDetails(appt)}
                          className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-surya-primary/30 transition-all cursor-pointer group flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              {getStatusBadge(appt.status)}
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{appt.meetingType}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-surya-primary transition-colors">{appt.subject}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{appt.purpose}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                              <CalendarIcon size={16} className="text-slate-400" />
                              {appt.requestedDate}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                              <Clock size={14} />
                              {appt.requestedStartTime} - {appt.requestedEndTime}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Insights */}
              <div className="space-y-6">
                {/* Branch Performance Summary */}
                <div className="bg-gradient-to-br from-slate-900 to-[#0B1120] border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-surya-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart3 className="text-surya-primary" /> Branch KPI Overview</h3>
                  <p className="text-sm text-slate-400 mb-6">Attach these metrics automatically to your executive requests.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Quarterly Target</span>
                        <span className="font-bold text-green-400">92%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '92%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">NPA Reduction</span>
                        <span className="font-bold text-surya-primary">85%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-surya-primary h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <button onClick={() => alert("Syncing with Outlook...")} className="w-full p-3 flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><CalendarIcon size={16} /></div>
                      Sync with Outlook
                    </button>
                    <button onClick={() => alert("Opening EA direct channel...")} className="w-full p-3 flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center"><Mail size={16} /></div>
                      Message Exec Assistant
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {activeTab === 'inbox' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-surya-primary" /> Direct Reports' Requests</h2>
              </div>
              <div className="space-y-3">
                {teamRequests.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">No team requests pending.</div>
                ) : (
                  teamRequests.map((appt, idx) => (
                    <motion.div 
                      key={appt.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      onClick={() => openMeetingDetails(appt)}
                      className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-surya-primary/30 transition-all cursor-pointer group flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          {getStatusBadge(appt.status)}
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{appt.meetingType}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-surya-primary transition-colors">{appt.subject} <span className="text-sm font-normal text-slate-500 ml-2">from {appt.name}</span></h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{appt.businessJustification || appt.purpose}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                          <CalendarIcon size={16} className="text-slate-400" />
                          {appt.requestedDate}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'request' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Compose Executive Briefing</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">The CEO's time is highly restricted. Ensure your request has significant business impact and all prerequisites are attached.</p>
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                
                {/* Section 1: Core Strategy */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <Target size={16} /> Core Strategic Intent
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Executive Summary (Subject)</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none transition-all dark:text-white" placeholder="e.g. Approval for $50M Tier-1 Corporate Loan Expansion" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                      <select name="meetingType" value={formData.meetingType} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none dark:text-white">
                        <option>Strategic Decision</option>
                        <option>Financial Review</option>
                        <option>Crisis Management</option>
                        <option>Board Prep</option>
                        <option>Branch Review</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Priority Classification</label>
                      <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none dark:text-white">
                        <option>Standard</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical / Urgent</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Primary Business Impact (ROI / Risk)</label>
                      <textarea name="businessImpact" value={formData.businessImpact} onChange={handleInputChange} required rows="2" className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none resize-none dark:text-white" placeholder="How does this affect Surya Bank's bottom line or strategic positioning?"></textarea>
                    </div>
                  </div>
                </div>

                {/* Section 2: Scheduling Engine */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <CalendarIcon size={16} /> Intelligent Scheduling
                  </h3>
                  
                  {loading ? (
                    <div className="p-8 text-center text-slate-500 font-bold border border-slate-200 dark:border-slate-700 border-dashed rounded-2xl bg-slate-50 dark:bg-slate-800/30">Syncing with CEO Calendar...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-8 text-center text-red-500 font-bold border border-red-200 dark:border-red-900/30 border-dashed rounded-2xl bg-red-50 dark:bg-red-900/10">No available slots. The CEO's calendar is fully booked.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto custom-scrollbar p-1">
                      {availableSlots.map(slot => (
                        <div 
                          key={slot.id}
                          onClick={() => setFormData({...formData, preferredSlotId: slot.id})}
                          className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${formData.preferredSlotId === slot.id ? 'border-surya-primary bg-surya-primary/5 shadow-md scale-[1.02]' : 'border-slate-200 dark:border-slate-700 hover:border-surya-primary/50 bg-white dark:bg-slate-800'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-900 dark:text-white">{slot.date}</span>
                            {formData.preferredSlotId === slot.id && <CheckCircle size={18} className="text-surya-primary" />}
                          </div>
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center mb-1">
                            <Clock size={14} className="mr-1.5 text-surya-primary" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-xs font-bold text-slate-400 dark:text-slate-500">
                            {slot.duration} mins allocation
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 3: Deep Context & AI */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <Activity size={16} /> Briefing Materials & AI Validation
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Detailed Agenda (Bulleted)</label>
                        <textarea name="agenda" value={formData.agenda} onChange={handleInputChange} required rows="4" className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none resize-none dark:text-white" placeholder="- Topic 1 (5 mins)&#10;- Topic 2 (10 mins)"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Required Participants</label>
                        <input type="text" name="participants" value={formData.participants} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none dark:text-white" placeholder="Name, Title" />
                      </div>
                    </div>
                    
                    {/* AI Readiness Panel */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-400 mb-4 font-bold text-sm uppercase tracking-wider">
                          <Activity size={16} /> AI Readiness Score
                        </div>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-6xl font-black tracking-tighter">{aiReadiness}</span>
                          <span className="text-xl text-slate-400 mb-1">/100</span>
                        </div>
                        <p className="text-sm text-slate-300 mb-6">
                          {aiReadiness < 60 ? 'Insufficient detail. High risk of rejection by EA.' : aiReadiness < 80 ? 'Good context. Ready for standard review.' : 'Excellent briefing. Highly likely to be approved.'}
                        </p>
                      </div>
                      
                      <div className="relative z-10 space-y-2">
                        <div className="text-xs font-bold text-slate-400 mb-2">CHECKLIST</div>
                        <div className={`flex items-center gap-2 text-sm ${formData.subject.length > 5 ? 'text-green-400' : 'text-slate-500'}`}><CheckSquare size={14}/> Executive Summary</div>
                        <div className={`flex items-center gap-2 text-sm ${formData.businessImpact.length > 10 ? 'text-green-400' : 'text-slate-500'}`}><CheckSquare size={14}/> Business Impact</div>
                        <div className={`flex items-center gap-2 text-sm ${formData.agenda.length > 30 ? 'text-green-400' : 'text-slate-500'}`}><CheckSquare size={14}/> Detailed Agenda</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4">
                  <button type="button" onClick={() => setActiveTab('dashboard')} className="px-6 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Discard Draft</button>
                  <button type="submit" disabled={submitting || !formData.preferredSlotId} className={`px-8 py-4 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${submitting || !formData.preferredSlotId ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-surya-primary to-yellow-600 hover:shadow-xl hover:-translate-y-1'}`}>
                    {submitting ? 'Transmitting...' : 'Submit to Executive Desk'} <ArrowRight size={18} />
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- Interactive Meeting Details Drawer --- */}
      <AnimatePresence>
        {drawerOpen && selectedRequest && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto border-l border-slate-200 dark:border-slate-800"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedRequest.status)}
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{selectedRequest.meetingType}</span>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={24} /></button>
              </div>

              <div className="p-8 space-y-10">
                
                {/* Header Info */}
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{selectedRequest.subject}</h2>
                  <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-2"><CalendarIcon size={16} className="text-surya-primary"/> {selectedRequest.requestedDate}</div>
                    <div className="flex items-center gap-2"><Clock size={16} className="text-surya-primary"/> {selectedRequest.requestedStartTime} - {selectedRequest.requestedEndTime}</div>
                    <div className="flex items-center gap-2"><Users size={16} className="text-surya-primary"/> {selectedRequest.participants || 'Only You'}</div>
                  </div>
                </div>

                {/* Progress Tracker (Timeline) */}
                <div className="relative pt-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Execution Timeline</h3>
                  <div className="absolute left-4 top-16 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                  
                  <div className="space-y-8 relative z-10">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-surya-primary text-white flex items-center justify-center shrink-0 shadow-md"><CheckCircle size={16} /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Request Submitted</h4>
                        <p className="text-sm text-slate-500">AI Readiness Score: {selectedRequest.aiRecommendation === 'APPROVE' ? 'Excellent' : 'Standard'}</p>
                      </div>
                    </div>
                    
                    {selectedRequest.status === 'Approved' ? (
                      <>
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 shadow-md"><CheckCircle size={16} /></div>
                          <div>
                            <h4 className="font-bold text-green-600 dark:text-green-400">CEO Approval Granted</h4>
                            <p className="text-sm text-slate-500">Slot locked on executive calendar.</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0"><Clock size={16} /></div>
                          <div>
                            <h4 className="font-bold text-slate-400">Meeting Execution</h4>
                            <p className="text-sm text-slate-500">Awaiting scheduled date.</p>
                          </div>
                        </div>
                      </>
                    ) : selectedRequest.status === 'Rejected' ? (
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-md"><XCircle size={16} /></div>
                        <div>
                          <h4 className="font-bold text-red-600 dark:text-red-400">Request Declined</h4>
                          <p className="text-sm text-slate-500">Reason: {selectedRequest.reason || 'Conflict with board priorities.'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse"><Clock size={16} /></div>
                        <div>
                          <h4 className="font-bold text-amber-600 dark:text-amber-400">Under Executive Review</h4>
                          <p className="text-sm text-slate-500">Pending review by Chief of Staff.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Core Content */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Business Impact</h3>
                    <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                      {selectedRequest.businessImpact || selectedRequest.purpose}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Detailed Agenda</h3>
                    <div className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap leading-relaxed">
                      {selectedRequest.agenda}
                    </div>
                  </div>
                </div>

                {/* CEO Notes & Action Items (Mocked for approved/past meetings) */}
                {selectedRequest.status === 'Approved' && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FileBadge size={16} /> Executive Office Directives</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckSquare size={18} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Ensure Q3 projections are attached prior to the meeting.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckSquare size={18} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Keep presentation strictly under 10 minutes.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  {selectedRequest.requesterRole === 'Employee' && selectedRequest.status === 'Waiting for Manager Review' ? (
                    <div className="space-y-4">
                      <textarea
                        value={managerReviewComments}
                        onChange={(e) => setManagerReviewComments(e.target.value)}
                        placeholder="Add manager comments/feedback before deciding..."
                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none resize-none dark:text-white"
                        rows="3"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleManagerDecision('Reject')} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                          <XCircle size={18} /> Reject
                        </button>
                        <button onClick={() => handleManagerDecision('Approve')} className="p-4 bg-surya-primary text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <CheckCircle size={18} /> Approve & Forward to CEO
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedRequest.status === 'Approved' && (
                        <button onClick={() => setShowPassModal(true)} className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                          <QrCode size={18} /> Digital Pass
                        </button>
                      )}
                      <button onClick={() => alert("Minutes generation pending execution.")} className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                        <Download size={18} /> Download Brief
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Digital Meeting Pass Modal --- */}
      <AnimatePresence>
        {showPassModal && selectedRequest && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="bg-gradient-to-r from-surya-primary to-yellow-600 p-6 text-center text-white relative">
                <button onClick={() => setShowPassModal(false)} className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={20} /></button>
                <ShieldCheck size={40} className="mx-auto mb-2 opacity-80" />
                <h3 className="font-black text-xl uppercase tracking-widest">Executive Pass</h3>
                <p className="text-sm text-white/80 font-medium">Valid for Single Entry</p>
              </div>
              <div className="p-8 text-center space-y-6">
                <div className="bg-white p-4 rounded-2xl inline-block mx-auto border-4 border-slate-100 shadow-inner">
                  {/* Mock QR Code visually represented */}
                  <div className="w-40 h-40 bg-slate-900 rounded-lg flex items-center justify-center">
                    <QrCode size={100} className="text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-lg">{currentUser.name}</h4>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{currentUser.designation}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm font-bold text-slate-700 dark:text-slate-300 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date</span>
                    <span>{selectedRequest.requestedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time</span>
                    <span>{selectedRequest.requestedStartTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location</span>
                    <span className="text-surya-primary">Executive Suite</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManagerAppointments;
