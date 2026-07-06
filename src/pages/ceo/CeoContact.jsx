import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, HelpCircle, Loader2, CheckCircle2,
  Calendar as CalendarIcon, Clock, Users, ShieldAlert, AlertTriangle,
  UploadCloud, FileText, Bot, Building, Briefcase, Activity, Lock, Search,
  ChevronRight, Paperclip, Check, Eye
} from 'lucide-react';
import { contactAnalytics, staffDirectory, mockInbox, availableAppointments } from './CeoContactData';
import { useCeoAuth } from '../../context/CeoAuthContext';
import { useCeoCMS } from '../../context/CeoCMSContext';

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ value, label, icon: Icon, alert }) => {
  return (
    <div className={`p-4 rounded-2xl bg-slate-900 border ${alert ? 'border-rose-500/50' : 'border-slate-800'} backdrop-blur shadow-lg flex flex-col justify-between group relative overflow-hidden`}>
      {alert && <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-xl animate-pulse" />}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <span className={`text-[10px] uppercase tracking-widest font-bold ${alert ? 'text-rose-400' : 'text-slate-400'}`}>{label}</span>
        <Icon size={14} className={alert ? 'text-rose-400' : 'text-ceo-gold'} />
      </div>
      <div className={`text-2xl font-serif font-bold relative z-10 ${alert ? 'text-white' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
};

const CeoContact = () => {
  const { user, role } = useCeoAuth();
  const { isEditMode } = useCeoCMS();

  // Navigation State
  const [activeTab, setActiveTab] = useState('Inquiry'); // Inquiry, Appointment, Emergency, Inbox(CEO)

  // Form State
  const [inquiryType, setInquiryType] = useState('General');
  const [formFields, setFormFields] = useState({ name: '', email: '', subject: '', message: '', reference: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  
  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // AI Assistant State
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // CEO Inbox State
  const [inboxFilter, setInboxFilter] = useState('All');
  const [viewingMessage, setViewingMessage] = useState(null);

  const handleInputChange = (e) => {
    setFormFields({...formFields, [e.target.name]: e.target.value});
  };

  const simulateAiRouting = () => {
    if(formFields.message.length > 10) {
      setAiAnalysis("Routing determined: " + (inquiryType === 'Investor Relations' ? 'Investor Team' : 'CEO Office'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-32 animate-in fade-in duration-500">
      
      {/* 1. HEADER & EXECUTIVE DASHBOARD */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold flex items-center gap-2 mb-2">
              <Building size={14} /> Executive Correspondence Center
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">
              Contact Office
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Secure portal for institutional inquiries, appointment scheduling, and emergency escalations directed to the Chairman & CEO.
            </p>
          </div>
          {role === 'CEO' && (
            <button 
              onClick={() => setActiveTab('Inbox')}
              className="px-6 py-3 bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy rounded-lg font-bold text-sm shadow-xl transition-all flex items-center gap-2"
            >
              <Lock size={16} /> Open Executive Inbox
            </button>
          )}
        </div>

        {/* Dashboard KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <AnimatedCounter value={contactAnalytics.unreadMessages} label="Unread" icon={Mail} />
          <AnimatedCounter value={contactAnalytics.pendingRequests} label="Pending" icon={Clock} />
          <AnimatedCounter value={contactAnalytics.vipAppointments} label="VIP Appts" icon={CalendarIcon} />
          <AnimatedCounter value={contactAnalytics.investorQueries} label="Investors" icon={Activity} />
          <AnimatedCounter value={contactAnalytics.govCommunications} label="Gov Comm" icon={Building} />
          <AnimatedCounter value={contactAnalytics.boardInvitations} label="Board Invites" icon={Briefcase} />
          <AnimatedCounter value={contactAnalytics.mediaRequests} label="Media" icon={Users} />
          <AnimatedCounter value={0} label="Emergencies" icon={ShieldAlert} alert={true} />
        </div>
      </section>

      {/* TABS NAVIGATION */}
      {role !== 'CEO' || activeTab !== 'Inbox' ? (
        <section className="flex gap-2 overflow-x-auto mb-8 border-b border-slate-800 pb-px">
          <button onClick={() => setActiveTab('Inquiry')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Inquiry' ? 'border-ceo-gold text-ceo-gold' : 'border-transparent text-slate-400 hover:text-white'}`}>General Inquiry</button>
          <button onClick={() => setActiveTab('Appointment')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Appointment' ? 'border-ceo-gold text-ceo-gold' : 'border-transparent text-slate-400 hover:text-white'}`}>Request Appointment</button>
          <button onClick={() => setActiveTab('Emergency')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'Emergency' ? 'border-rose-500 text-rose-500' : 'border-transparent text-rose-500/60 hover:text-rose-400'}`}>
            <ShieldAlert size={14}/> Emergency Channel
          </button>
        </section>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: OFFICE INFO / DIRECTORY */}
        {role !== 'CEO' || activeTab !== 'Inbox' ? (
          <div className="lg:col-span-4 space-y-6">
            
            {/* Interactive HQ Map */}
            <div className="p-1 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-800">
              <div className="aspect-[4/3] rounded-[22px] bg-slate-950 overflow-hidden relative flex items-center justify-center">
                {/* Abstract Grid Map */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border border-ceo-gold/20 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 border border-ceo-gold/40 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-16 h-16 bg-ceo-gold/10 rounded-full flex items-center justify-center text-ceo-gold shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                        <MapPin size={24} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-xl text-center">
                  <h4 className="text-white text-xs font-bold mb-0.5">Surya Financial Center HQ</h4>
                  <p className="text-[10px] text-slate-400">Level 42, Outer Ring Road, Bengaluru</p>
                </div>
              </div>
            </div>

            {/* Executive Directory */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Users size={16} className="text-ceo-gold"/> Executive Directory
                </h3>
                {isEditMode && role === 'CEO' && <button className="text-[10px] bg-ceo-gold/20 text-ceo-gold px-2 py-1 rounded">Edit</button>}
              </div>
              
              <div className="space-y-4">
                {staffDirectory.map((staff, i) => (
                  <div key={i} className="flex gap-3 items-start pb-4 border-b border-slate-800/50 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-serif font-bold text-xs shrink-0">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{staff.name}</h4>
                      <p className="text-[10px] text-ceo-gold">{staff.role}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <a href={`mailto:${staff.email}`} className="text-[9px] text-slate-400 hover:text-white flex items-center gap-1"><Mail size={10}/> Email</a>
                        <a href={`tel:${staff.phone}`} className="text-[9px] text-slate-400 hover:text-white flex items-center gap-1"><Phone size={10}/> Call</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* RIGHT COLUMN: DYNAMIC FORMS & INBOX */}
        <div className={role === 'CEO' && activeTab === 'Inbox' ? 'lg:col-span-12' : 'lg:col-span-8'}>
          
          {submitSuccess ? (
            <div className="h-full min-h-[500px] flex items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center">
              <div className="space-y-6 max-w-md">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                </div>
                <h2 className="text-3xl font-serif text-white font-bold">Submission Secured</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your communication has been encrypted and routed to the appropriate department. You will receive an acknowledgment at <strong>{formFields.email}</strong> shortly.
                </p>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-500">
                  Tracking Reference: SURYA-2026-{Math.floor(Math.random()*10000)}
                </div>
                <button onClick={() => setSubmitSuccess(false)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : activeTab === 'Inquiry' ? (
            /* GENERAL INQUIRY FORM */
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-serif text-white font-bold mb-2">Secure Inquiry Form</h2>
                  <p className="text-xs text-slate-400">All submissions are subjected to AI classification and SLA tracking.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Lock size={12}/> Encrypted Channel
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Inquiry Category</label>
                    <select 
                      value={inquiryType} 
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ceo-gold transition-colors"
                    >
                      <option>General Corporate Inquiry</option>
                      <option>Investor Relations</option>
                      <option>Media & Press Request</option>
                      <option>Government / Regulatory</option>
                      <option>Board of Directors</option>
                    </select>
                  </div>
                  {inquiryType === 'Investor Relations' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Portfolio / Shareholder ID</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ceo-gold transition-colors" placeholder="e.g. SH-10948" />
                    </div>
                  )}
                  {inquiryType === 'Media & Press Request' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Publication Name</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ceo-gold transition-colors" placeholder="e.g. Financial Times" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Full Name</label>
                    <input required name="name" value={formFields.name} onChange={handleInputChange} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ceo-gold transition-colors" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Corporate Email</label>
                    <input required name="email" value={formFields.email} onChange={handleInputChange} type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ceo-gold transition-colors" placeholder="name@company.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Subject</label>
                  <input required name="subject" value={formFields.subject} onChange={handleInputChange} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ceo-gold transition-colors" placeholder="Inquiry subject" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Message Details</label>
                    {aiAnalysis && <span className="text-[10px] text-emerald-500 flex items-center gap-1"><Bot size={12}/> {aiAnalysis}</span>}
                  </div>
                  <textarea 
                    required 
                    name="message" 
                    value={formFields.message} 
                    onChange={handleInputChange} 
                    onBlur={simulateAiRouting}
                    rows={6} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ceo-gold transition-colors resize-none" 
                    placeholder="Provide detailed context for your inquiry..." 
                  />
                </div>

                {/* Secure File Upload UI */}
                <div className="border-2 border-dashed border-slate-700 hover:border-ceo-gold/50 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-950 transition-colors cursor-pointer group">
                  <UploadCloud size={32} className="text-slate-500 group-hover:text-ceo-gold transition-colors mb-3" />
                  <p className="text-white font-bold text-sm mb-1">Attach Supporting Documents</p>
                  <p className="text-[10px] text-slate-500">PDF, DOCX, XLSX (Max 10MB). E2E Encrypted.</p>
                </div>

                <button disabled={submitting} type="submit" className="w-full py-4 bg-ceo-gold hover:bg-yellow-400 text-ceo-navy font-bold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {submitting ? 'Encrypting & Routing...' : 'Submit Secure Inquiry'}
                </button>
              </form>
            </div>
          ) : activeTab === 'Appointment' ? (
            /* APPOINTMENT SCHEDULING FORM */
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="mb-8 border-b border-slate-800 pb-6">
                <h2 className="text-2xl font-serif text-white font-bold mb-2">Request Executive Appointment</h2>
                <p className="text-xs text-slate-400">View available slots and submit an agenda for CEO approval.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Calendar UI */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest flex items-center gap-2">
                    <CalendarIcon size={14}/> Select Available Date
                  </label>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {availableAppointments.map((app, i) => (
                      <button 
                        key={i} type="button" onClick={() => setSelectedDate(app.date)}
                        className={`shrink-0 w-24 h-24 rounded-2xl border flex flex-col items-center justify-center transition-all ${selectedDate === app.date ? 'bg-ceo-gold/10 border-ceo-gold text-ceo-gold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                      >
                        <span className="text-xs uppercase font-bold">{new Date(app.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-3xl font-serif font-bold text-white my-1">{new Date(app.date).getDate()}</span>
                        <span className="text-[9px]">{app.slots.length} Slots</span>
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {selectedDate && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest flex items-center gap-2">
                        <Clock size={14}/> Select Time Slot
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {availableAppointments.find(a => a.date === selectedDate)?.slots.map(slot => (
                          <button 
                            key={slot} type="button" onClick={() => setSelectedTime(slot)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${selectedTime === slot ? 'bg-ceo-gold text-ceo-navy border-ceo-gold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Meeting Format</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ceo-gold">
                      <option>Virtual (Secure Video Link)</option>
                      <option>In-Person (HQ Executive Boardroom)</option>
                      <option>In-Person (Off-site)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Duration</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ceo-gold">
                      <option>15 Minutes (Briefing)</option>
                      <option>30 Minutes (Standard)</option>
                      <option>60 Minutes (Comprehensive)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Proposed Agenda</label>
                  <textarea rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ceo-gold resize-none" placeholder="Outline the primary topics of discussion..." />
                </div>

                <button disabled={!selectedTime || submitting} type="submit" className="w-full py-4 bg-ceo-gold hover:bg-yellow-400 text-ceo-navy font-bold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <CalendarIcon size={18} />}
                  Request Calendar Slot
                </button>
              </form>
            </div>
          ) : activeTab === 'Emergency' ? (
            /* EMERGENCY CHANNEL */
            <div className="bg-rose-950/20 border border-rose-900/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="mb-8 border-b border-rose-900/50 pb-6 flex items-start gap-4">
                <div className="p-3 bg-rose-500/20 text-rose-500 rounded-xl shrink-0"><AlertTriangle size={32}/></div>
                <div>
                  <h2 className="text-2xl font-serif text-rose-400 font-bold mb-2">Emergency Reporting Channel</h2>
                  <p className="text-xs text-rose-300/70">For critical compliance violations, major cyber incidents, or whistleblower reports. Submissions bypass standard routing and immediately alert the CEO and Chief of Security.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-rose-400 tracking-widest">Incident Type</label>
                  <select className="w-full bg-slate-950 border border-rose-900/50 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500">
                    <option>Corporate Fraud / Embezzlement</option>
                    <option>Cybersecurity Breach (Level 1)</option>
                    <option>Whistleblower (Anonymous)</option>
                    <option>Physical Branch Emergency</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-rose-400 tracking-widest">Incident Description</label>
                  <textarea required rows={6} className="w-full bg-slate-950 border border-rose-900/50 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 resize-none" placeholder="Provide absolute specifics. Location, individuals involved, timestamps..." />
                </div>

                <div className="flex items-center gap-3 p-4 bg-rose-950/40 border border-rose-900/50 rounded-xl">
                  <input type="checkbox" id="anon" className="w-4 h-4 accent-rose-500" />
                  <label htmlFor="anon" className="text-xs text-rose-200 font-semibold cursor-pointer">Submit anonymously (Removes IP tracking and identity metadata)</label>
                </div>

                <button disabled={submitting} type="submit" className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldAlert size={18} />}
                  Escalate Critical Report
                </button>
              </form>
            </div>
          ) : activeTab === 'Inbox' && role === 'CEO' ? (
            /* EXECUTIVE INBOX (CEO ONLY) */
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[600px]">
              
              {/* Inbox Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h2 className="text-xl font-serif text-white font-bold flex items-center gap-2">
                  <Lock size={18} className="text-ceo-gold"/> Executive Inbox
                </h2>
                <div className="flex gap-2">
                  {['All', 'Critical', 'Pending', 'Action Required'].map(f => (
                    <button 
                      key={f} onClick={() => setInboxFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${inboxFilter === f ? 'bg-ceo-gold text-ceo-navy' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Message List */}
                <div className="w-2/5 border-r border-slate-800 overflow-y-auto bg-slate-900/50">
                  {mockInbox.map(msg => (
                    <div 
                      key={msg.id} 
                      onClick={() => setViewingMessage(msg)}
                      className={`p-4 border-b border-slate-800 cursor-pointer transition-colors ${viewingMessage?.id === msg.id ? 'bg-ceo-gold/5 border-l-2 border-l-ceo-gold' : 'hover:bg-slate-800 border-l-2 border-l-transparent'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${msg.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'}`}>
                          {msg.priority}
                        </span>
                        <span className="text-[10px] text-slate-500">{new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1 truncate">{msg.subject}</h4>
                      <p className="text-xs text-slate-400 truncate">{msg.senderName} • {msg.senderOrg}</p>
                    </div>
                  ))}
                </div>

                {/* Message Detail View */}
                <div className="w-3/5 bg-slate-950 flex flex-col">
                  {viewingMessage ? (
                    <div className="p-8 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-serif text-white font-bold mb-2">{viewingMessage.subject}</h3>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Users size={12}/> {viewingMessage.senderName}</span>
                            <span className="flex items-center gap-1"><Building size={12}/> {viewingMessage.senderOrg}</span>
                          </div>
                        </div>
                        <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-xs text-white font-mono">{viewingMessage.id}</span>
                      </div>

                      <div className="flex gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 mb-6 text-xs">
                        <div><span className="block text-[9px] text-slate-500 uppercase font-bold">Assigned To</span><span className="text-white">{viewingMessage.department}</span></div>
                        <div className="w-px bg-slate-700" />
                        <div><span className="block text-[9px] text-slate-500 uppercase font-bold">Status</span><span className="text-emerald-400">{viewingMessage.status}</span></div>
                        <div className="w-px bg-slate-700" />
                        <div><span className="block text-[9px] text-slate-500 uppercase font-bold">SLA Limit</span><span className="text-ceo-gold">{viewingMessage.sla}</span></div>
                      </div>

                      <div className="prose prose-invert prose-sm max-w-none flex-1">
                        <p className="leading-relaxed text-slate-300">{viewingMessage.message}</p>
                      </div>

                      {viewingMessage.attachments > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-500 mb-3 block flex items-center gap-2"><Paperclip size={12}/> {viewingMessage.attachments} Attached Files</span>
                          <div className="flex gap-2">
                            <div className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs flex items-center gap-2 hover:bg-slate-800 cursor-pointer text-white">
                              <FileText size={14} className="text-ceo-gold"/> corporate_ledger_q3.pdf
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-8 flex gap-3">
                        <button className="px-6 py-3 bg-ceo-gold hover:bg-yellow-400 text-ceo-navy font-bold text-xs rounded-xl flex-1 flex justify-center items-center gap-2 transition-colors">
                          <Send size={14} /> Respond Securely
                        </button>
                        <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors">
                          Forward to {viewingMessage.department}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                      <Mail size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-bold">Select a message to view</p>
                      <p className="text-xs mt-1">Inbox automatically decrypts upon selection.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

        </div>
      </div>

    </div>
  );
};

export default CeoContact;
