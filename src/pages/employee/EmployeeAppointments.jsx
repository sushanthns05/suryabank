import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, Users, FileText, CheckCircle, 
  XCircle, AlertCircle, Plus, Search, ChevronRight, Briefcase,
  Activity, ShieldCheck, Zap, Download, QrCode, Mail, 
  ArrowRight, FileBadge, CheckSquare, X, Target, Star,
  UploadCloud, FileUp, Info, ListChecks, CalendarDays
} from 'lucide-react';
import { getAvailableSlots, requestAppointment, subscribeToUserAppointments } from '../../services/appointmentService';

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

const EmployeeAppointments = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, request
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Request Form State
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    purpose: '',
    businessJustification: '',
    expectedOutcome: '',
    agenda: '',
    priority: 'Medium',
    meetingType: 'In Person',
    preferredSlotId: '',
    alternateSlotId: '',
    participants: '',
    remarks: '',
    attachments: false
  });

  // Drawer / Selection State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

  const currentUser = {
    name: 'Ravi Kumar',
    employeeId: 'EMP12345',
    managerId: 'MGR98765',
    requesterRole: 'Employee',
    department: 'Retail Banking',
    branch: 'Mumbai Central',
    designation: 'Senior Relationship Manager',
    email: 'ravi.kumar@suryabank.com',
    phone: '+91 98765 43210'
  };

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      const slotsRes = await getAvailableSlots();
      if (slotsRes.success) setAvailableSlots(slotsRes.data);
      setLoading(false);
    };
    fetchSlots();

    setLoading(true);
    const unsubscribe = subscribeToUserAppointments(currentUser.employeeId, (res) => {
      if (res.success) setAppointments(res.data);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    const slotsRes = await getAvailableSlots();
    if (slotsRes.success) setAvailableSlots(slotsRes.data);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // AI Readiness & Probability calculations
  const aiMetrics = useMemo(() => {
    let score = 10; 
    let probability = 5;
    const missingDocs = [];

    if (formData.subject.length > 5) { score += 10; probability += 5; }
    if (formData.businessJustification.length > 20) { score += 25; probability += 20; }
    else missingDocs.push('Business Justification too brief');
    
    if (formData.expectedOutcome.length > 15) { score += 15; probability += 15; }
    if (formData.agenda.length > 30) { score += 20; probability += 20; }
    else missingDocs.push('Detailed Agenda missing');

    if (formData.preferredSlotId) { score += 10; probability += 10; }
    if (formData.alternateSlotId) { score += 5; probability += 15; }

    if (formData.attachments) { score += 5; probability += 10; }
    else missingDocs.push('Supporting presentation/documents required');

    return { 
      score: score > 100 ? 100 : score, 
      probability: probability > 100 ? 100 : probability,
      missingDocs
    };
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (aiMetrics.score < 70) {
      const confirmSubmit = window.confirm("AI indicates missing crucial documents or details. Executive Office may reject this. Submit anyway?");
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    const selectedSlot = availableSlots.find(s => s.id === formData.preferredSlotId);
    
    if (!selectedSlot) {
      alert("Please select a valid preferred slot.");
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
      aiRecommendation: aiMetrics.score >= 85 ? 'APPROVE' : aiMetrics.score >= 60 ? 'REVIEW' : 'REJECT',
      status: 'Waiting for Manager Review',
      managerStatus: 'Pending',
      ceoStatus: 'Pending',
      auditHistory: [
        {
          action: 'Request Created',
          timestamp: new Date().toISOString(),
          actor: currentUser.name,
          role: 'Employee',
          ip: '192.168.1.104',
          device: 'Chrome on Windows'
        }
      ]
    };

    const res = await requestAppointment(requestPayload);
    if (res.success) {
      alert('Enterprise Meeting Request submitted to Manager Queue successfully.');
      setActiveTab('dashboard');
      fetchData();
      setFormData({
        subject: '', purpose: '', businessJustification: '', expectedOutcome: '',
        agenda: '', priority: 'Medium', meetingType: 'In Person',
        preferredSlotId: '', alternateSlotId: '', participants: '', remarks: '', attachments: false
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

  const upcomingMeetings = appointments.filter(a => a.status === 'Approved');
  const pendingRequests = appointments.filter(a => a.status === 'Pending');

  // Multi-stage pipeline renderer
  const renderPipeline = (status) => {
    const steps = [
      { id: 1, label: 'Submitted', desc: 'System logged' },
      { id: 2, label: 'Manager Review', desc: 'Direct supervisor check' },
      { id: 3, label: 'Exec Office', desc: 'CEO vetting' },
      { id: 4, label: 'Scheduled', desc: 'Calendar locked' }
    ];

    let currentStep = 2; // Waiting for Manager Review
    if (status === 'Waiting for CEO Approval') currentStep = 3;
    if (status === 'Approved') currentStep = 4;
    if (status === 'Rejected' || status === 'Rejected by Manager') currentStep = (status === 'Rejected by Manager') ? 2 : 3;

    return (
      <div className="relative pt-4">
        <div className="absolute left-[19px] top-6 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
        <div className="space-y-6 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = step.id < currentStep || (step.id === currentStep && status === 'Approved');
            const isCurrent = step.id === currentStep;
            const isRejectedStep = (status === 'Rejected' || status === 'Rejected by Manager') && isCurrent;

            let iconBg = 'bg-slate-200 dark:bg-slate-800 text-slate-400';
            let icon = <Clock size={16} />;
            let titleColor = 'text-slate-400';

            if (isCompleted && !isRejectedStep) {
              iconBg = 'bg-surya-primary text-white shadow-md';
              icon = <CheckCircle size={16} />;
              titleColor = 'text-slate-900 dark:text-white font-bold';
            } else if (isCurrent && status === 'Approved') {
              iconBg = 'bg-green-500 text-white shadow-md shadow-green-500/20';
              icon = <CheckCircle size={16} />;
              titleColor = 'text-green-600 dark:text-green-400 font-bold';
            } else if (isCurrent && isRejectedStep) {
              iconBg = 'bg-red-500 text-white shadow-md shadow-red-500/20';
              icon = <XCircle size={16} />;
              titleColor = 'text-red-600 dark:text-red-400 font-bold';
            } else if (isCurrent) {
              iconBg = 'bg-amber-500 text-white shadow-md shadow-amber-500/20 animate-pulse';
              titleColor = 'text-amber-600 dark:text-amber-400 font-bold';
            }

            return (
              <div key={step.id} className="flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${iconBg} transition-colors duration-500`}>
                  {icon}
                </div>
                <div className="pt-2">
                  <h4 className={`text-sm ${titleColor}`}>{step.label}</h4>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white pb-20 font-sans selection:bg-surya-primary/30">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-surya-primary to-yellow-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <CalendarDays size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Enterprise Appointment System</h1>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Connected</span>
                <span>•</span>
                <span>Tier-3 Access</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl">
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-700 text-surya-primary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
              My Dashboard
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
              <MetricCard title="Approved Exec Sessions" value={upcomingMeetings.length} icon={CheckCircle} colorClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" gradient="bg-green-500" delay={0.1} />
              <MetricCard title="In Approval Pipeline" value={pendingRequests.length} icon={Activity} colorClass="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" gradient="bg-amber-500" delay={0.2} />
              <MetricCard title="Total Requests Filed" value={appointments.length} icon={Briefcase} colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" gradient="bg-purple-500" delay={0.3} />
              <MetricCard title="Average AI Quality" value="84%" icon={Star} colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" gradient="bg-blue-500" delay={0.4} />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Requests Table */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><ListChecks className="text-surya-primary" /> Active Submissions</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="Search requests..." className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-surya-primary outline-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {loading ? (
                      <div className="py-12 text-center text-slate-500 font-medium">Syncing with Central Pipeline...</div>
                    ) : appointments.length === 0 ? (
                      <div className="py-12 text-center text-slate-500">No meeting requests found. Start a new workflow.</div>
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
                              {appt.status === 'Approved' ? <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-600 dark:text-green-400">SCHEDULED</span> : 
                               appt.status === 'Rejected' ? <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-600 dark:text-red-400">REJECTED</span> :
                               <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">IN PIPELINE</span>}
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{appt.meetingType}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-surya-primary transition-colors">{appt.subject}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{appt.businessJustification || appt.purpose}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                              <CalendarIcon size={16} className="text-slate-400" />
                              {appt.requestedDate}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                              <Clock size={14} />
                              {appt.requestedStartTime}
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
                <div className="bg-gradient-to-br from-slate-900 to-[#0B1120] border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-surya-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Info className="text-surya-primary" /> Approval Protocol</h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    All executive meetings require a multi-tier approval. Ensure comprehensive business justification is provided.
                  </p>
                  <ul className="text-sm space-y-3 font-medium text-slate-300">
                    <li className="flex gap-2"><ArrowRight size={16} className="text-surya-primary shrink-0"/> Direct Manager Review</li>
                    <li className="flex gap-2"><ArrowRight size={16} className="text-surya-primary shrink-0"/> Executive Office Vetting</li>
                    <li className="flex gap-2"><ArrowRight size={16} className="text-surya-primary shrink-0"/> Final CEO Confirmation</li>
                  </ul>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {activeTab === 'request' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Initialize Enterprise Workflow</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Follow the enterprise protocol for requesting executive bandwidth. Missing documentation will cause automatic pipeline rejection.</p>
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                
                {/* Section 1: Core Strategy */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <Target size={16} /> 1. Strategic Context
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Executive Summary (Subject)</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none transition-all dark:text-white" placeholder="e.g. Seeking Approval for Core Banking Migration" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Business Justification *</label>
                      <textarea name="businessJustification" value={formData.businessJustification} onChange={handleInputChange} required rows="2" className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none resize-none dark:text-white" placeholder="Why does this require the CEO's direct attention?"></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Expected Outcome / Resolution *</label>
                      <textarea name="expectedOutcome" value={formData.expectedOutcome} onChange={handleInputChange} required rows="2" className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none resize-none dark:text-white" placeholder="What specific decision or action is required by the end of the meeting?"></textarea>
                    </div>
                  </div>
                </div>

                {/* Section 2: Details & Agenda */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <ListChecks size={16} /> 2. Agenda & Participants
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Detailed Agenda (Bulleted) *</label>
                      <textarea name="agenda" value={formData.agenda} onChange={handleInputChange} required rows="3" className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none resize-none dark:text-white" placeholder="- Architecture Review (5 mins)&#10;- Budget Approval (10 mins)"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Requested Attendees</label>
                      <input type="text" name="participants" value={formData.participants} onChange={handleInputChange} required className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none dark:text-white" placeholder="e.g. CTO, CFO, Lead Architect" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Priority Classification</label>
                      <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-surya-primary outline-none dark:text-white">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical / Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Scheduling Selection */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <CalendarIcon size={16} /> 3. CEO Availability 
                    </h3>
                    <span className="text-xs font-bold text-surya-primary bg-surya-primary/10 px-2 py-1 rounded">Live Sync</span>
                  </div>
                  
                  {loading ? (
                    <div className="p-8 text-center text-slate-500 font-bold border border-slate-200 dark:border-slate-700 border-dashed rounded-2xl bg-slate-50 dark:bg-slate-800/30">Querying Master Calendar...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-8 text-center text-red-500 font-bold border border-red-200 dark:border-red-900/30 border-dashed rounded-2xl bg-red-50 dark:bg-red-900/10">No slots available.</div>
                  ) : (
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select your <strong>Preferred</strong> time block:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-48 overflow-y-auto custom-scrollbar p-1 mb-4">
                        {availableSlots.map(slot => (
                          <div 
                            key={`pref-${slot.id}`}
                            onClick={() => setFormData({...formData, preferredSlotId: slot.id})}
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${formData.preferredSlotId === slot.id ? 'border-surya-primary bg-surya-primary/5 shadow-md scale-[1.02]' : 'border-slate-200 dark:border-slate-700 hover:border-surya-primary/50 bg-white dark:bg-slate-800'}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-slate-900 dark:text-white">{slot.date}</span>
                              {formData.preferredSlotId === slot.id && <CheckCircle size={18} className="text-surya-primary" />}
                            </div>
                            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center mb-1">
                              <Clock size={14} className="mr-1.5 text-surya-primary" />
                              {slot.startTime}
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select an <strong>Alternative</strong> time block (Optional):</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-48 overflow-y-auto custom-scrollbar p-1">
                        {availableSlots.filter(s => s.id !== formData.preferredSlotId).map(slot => (
                          <div 
                            key={`alt-${slot.id}`}
                            onClick={() => setFormData({...formData, alternateSlotId: slot.id})}
                            className={`cursor-pointer rounded-2xl p-3 border transition-all ${formData.alternateSlotId === slot.id ? 'border-blue-500 bg-blue-500/5 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-blue-500/50 bg-white dark:bg-slate-800'}`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">{slot.date}</span>
                              {formData.alternateSlotId === slot.id && <CheckCircle size={14} className="text-blue-500" />}
                            </div>
                            <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              {slot.startTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 4: Attachments & AI Validation */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <FileUp size={16} /> 4. Required Documentation & Validation
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Mock File Upload */}
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/30">
                      <UploadCloud size={40} className="text-slate-400 mb-4" />
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Upload Presentation / Deck</h4>
                      <p className="text-sm text-slate-500 mb-6">PDF, PPTX up to 50MB. Executive Office requires briefs 48h prior.</p>
                      
                      <label className="flex items-center gap-3 cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl shadow-sm hover:border-surya-primary transition-all">
                        <input type="checkbox" name="attachments" checked={formData.attachments} onChange={handleInputChange} className="w-5 h-5 accent-surya-primary" />
                        <span className="text-sm font-bold">I confirm documents are attached in system</span>
                      </label>
                    </div>
                    
                    {/* AI Readiness Panel */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-600/20 to-transparent"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider">
                            <Activity size={16} /> Readiness Engine
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black">{aiMetrics.probability}%</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Approval Prob.</div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                              <span>Profile Completion</span>
                              <span>{aiMetrics.score}/100</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                              <div className={`h-2 rounded-full ${aiMetrics.score > 80 ? 'bg-green-500' : aiMetrics.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${aiMetrics.score}%`}}></div>
                            </div>
                          </div>
                          
                          {aiMetrics.missingDocs.length > 0 && (
                            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                              <p className="text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider flex items-center gap-1"><AlertCircle size={12}/> Critical Missing Assets:</p>
                              <ul className="text-sm text-amber-200 space-y-1 list-disc pl-4">
                                {aiMetrics.missingDocs.map((doc, i) => <li key={i}>{doc}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4">
                  <button type="submit" disabled={submitting || !formData.preferredSlotId} className={`px-10 py-4 rounded-xl font-bold text-white flex items-center gap-3 transition-all ${submitting || !formData.preferredSlotId ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-surya-primary to-yellow-600 hover:shadow-xl hover:-translate-y-1'}`}>
                    {submitting ? 'Transmitting...' : 'Initiate Approval Pipeline'} <ArrowRight size={20} />
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- Interactive Pipeline Drawer --- */}
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
              <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center z-20 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-black uppercase tracking-widest text-slate-500">Pipeline Tracker</span>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={24} /></button>
              </div>

              <div className="p-8 space-y-10">
                {/* Header Info */}
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{selectedRequest.subject}</h2>
                  <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-2"><CalendarIcon size={16} className="text-surya-primary"/> {selectedRequest.requestedDate}</div>
                    <div className="flex items-center gap-2"><Clock size={16} className="text-surya-primary"/> {selectedRequest.requestedStartTime}</div>
                    <div className="flex items-center gap-2"><Users size={16} className="text-surya-primary"/> {selectedRequest.participants || 'Only You'}</div>
                  </div>
                </div>

                {/* Animated Pipeline */}
                {renderPipeline(selectedRequest.status)}

                {/* Core Content / Brief */}
                <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Business Justification</h3>
                    <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed text-sm">
                      {selectedRequest.businessJustification || selectedRequest.purpose}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Agenda & Expected Outcome</h3>
                    <div className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                      <strong>Expected Outcome:</strong><br/>
                      {selectedRequest.expectedOutcome || 'Strategic alignment and decision.'}<br/><br/>
                      <strong>Agenda:</strong><br/>
                      {selectedRequest.agenda}
                    </div>
                  </div>
                </div>

                {/* Executive Notes (Only visible if Approved or Rejected) */}
                {selectedRequest.status !== 'Waiting for Manager Review' && selectedRequest.status !== 'Pending' && (
                  <div className={`border rounded-2xl p-6 ${selectedRequest.status === 'Approved' || selectedRequest.status === 'Waiting for CEO Approval' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'}`}>
                    <h3 className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${selectedRequest.status === 'Approved' || selectedRequest.status === 'Waiting for CEO Approval' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                      <FileBadge size={16} /> Official Management Feedback
                    </h3>
                    <div className="space-y-4">
                      {selectedRequest.managerComments && (
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Manager Feedback</div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                            {selectedRequest.managerComments}
                          </p>
                        </div>
                      )}
                      {selectedRequest.ceoComments && (
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">CEO Office Feedback</div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                            {selectedRequest.ceoComments}
                          </p>
                        </div>
                      )}
                      {!selectedRequest.managerComments && !selectedRequest.ceoComments && (
                         <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                         {selectedRequest.status === 'Approved' ? 'Pipeline approved. Ensure all prerequisites are met 24h prior to the session.' : 'Pipeline halted. Request lacked sufficient business justification or conflicted with higher priorities.'}
                       </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {selectedRequest.status === 'Approved' ? (
                    <>
                      <button onClick={() => setShowPassModal(true)} className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                        <QrCode size={18} /> Access Pass
                      </button>
                      <button onClick={() => alert("Syncing with corporate calendar...")} className="p-4 bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
                        <CalendarIcon size={18} /> Add to Calendar
                      </button>
                    </>
                  ) : (
                    <button className="col-span-2 p-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                      <AlertCircle size={18} /> Awaiting Pipeline Completion
                    </button>
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
                <h3 className="font-black text-xl uppercase tracking-widest">Digital Boarding Pass</h3>
                <p className="text-sm text-white/80 font-medium">Clearance Level: Tier-3 Exec</p>
              </div>
              <div className="p-8 text-center space-y-6">
                <div className="bg-white p-4 rounded-2xl inline-block mx-auto border-4 border-slate-100 shadow-inner">
                  {/* Mock QR Code */}
                  <div className="w-40 h-40 bg-slate-900 rounded-lg flex items-center justify-center">
                    <QrCode size={100} className="text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-lg">{currentUser.name}</h4>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{currentUser.designation}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm font-bold text-slate-700 dark:text-slate-300 space-y-3">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-400">Date</span>
                    <span>{selectedRequest.requestedDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-400">Time</span>
                    <span>{selectedRequest.requestedStartTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Meeting ID</span>
                    <span className="text-surya-primary">EXEC-{selectedRequest.id.substring(0,6).toUpperCase()}</span>
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

export default EmployeeAppointments;
