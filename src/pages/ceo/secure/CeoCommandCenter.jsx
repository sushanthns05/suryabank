import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useCeoAuth } from '../../../context/CeoAuthContext';
import { 
  Send, Radio, Users, Building2, Globe, Trash2, Archive, 
  Loader2, CheckCircle2, AlertTriangle, Megaphone, Target,
  Clock, Filter, ChevronDown
} from 'lucide-react';

const AUDIENCES = [
  { id: 'all_staff', label: 'Entire Organization', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  { id: 'managers', label: 'Managers Only', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  { id: 'employees', label: 'Employees Only', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { id: 'customers', label: 'All Customers', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 'premium_customers', label: 'Premium Customers', icon: Target, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 'retail', label: 'Retail Department', icon: Building2, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' },
  { id: 'corporate', label: 'Corporate Department', icon: Building2, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
  { id: 'bengaluru_branch', label: 'Bengaluru Branch', icon: Radio, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
  { id: 'executives', label: 'Executive Leadership', icon: Target, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
];

const TYPES = [
  { id: 'broadcast', label: 'Broadcast', desc: 'General announcement' },
  { id: 'task', label: 'Task / Directive', desc: 'Actionable directive' },
  { id: 'announcement', label: 'Announcement', desc: 'Public-facing notice' },
];

const PRIORITIES = [
  { id: 'standard', label: 'Standard', color: 'text-slate-300' },
  { id: 'urgent', label: 'Urgent', color: 'text-amber-400' },
  { id: 'critical', label: 'Critical', color: 'text-red-400' },
];

const CeoCommandCenter = () => {
  const { user, role } = useCeoAuth();
  
  // Compose state
  const [type, setType] = useState('broadcast');
  const [audience, setAudience] = useState('all_staff');
  const [priority, setPriority] = useState('standard');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedManager, setAssignedManager] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  // Feed state
  const [directives, setDirectives] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filterAudience, setFilterAudience] = useState('all');
  const [loading, setLoading] = useState(true);

  // Real-time listener for directives & tasks
  useEffect(() => {
    const q1 = query(collection(db, 'ceo_directives'), orderBy('timestamp', 'desc'));
    const unsub1 = onSnapshot(q1, (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() }));
      setDirectives(list);
      setLoading(false);
    }, (err) => {
      console.error('Failed to fetch directives:', err);
      setLoading(false);
    });

    const q2 = query(collection(db, 'ceo_tasks'), orderBy('timestamp', 'desc'));
    const unsub2 = onSnapshot(q2, (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() }));
      setTasks(list);
    }, (err) => console.error(err));

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSending(true);
    try {
      if (type === 'task') {
        await addDoc(collection(db, 'ceo_tasks'), {
          type,
          audience,
          priority,
          title: title.trim(),
          description: message.trim(),
          deadline: deadline || 'No deadline',
          department: audience, // mapping audience to department for simplicity
          assignedManager: assignedManager.trim(),
          assignedEmployee: assignedEmployee.trim(),
          author: 'CEO Office — Sushanth NS',
          status: 'Pending',
          progress: 0,
          timestamp: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, 'ceo_directives'), {
          type,
          audience,
          priority,
          title: title.trim(),
          message: message.trim(),
          author: 'CEO Office — Sushanth NS',
          authorEmail: user?.email || 'ceo@suryabank.com',
          status: 'active',
          timestamp: new Date().toISOString()
        });
      }
      
      setTitle('');
      setMessage('');
      setDeadline('');
      setAssignedManager('');
      setAssignedEmployee('');
      setPriority('standard');
      setSendStatus('success');
    } catch (err) {
      console.error(err);
      setSendStatus('error');
    } finally {
      setSending(false);
      setTimeout(() => setSendStatus(null), 3000);
    }
  };

  const handleArchive = async (id, isTask = false) => {
    try {
      const col = isTask ? 'ceo_tasks' : 'ceo_directives';
      await updateDoc(doc(db, col, id), { status: 'archived' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveTask = async (id) => {
    try {
      await updateDoc(doc(db, 'ceo_tasks', id), { status: 'CEO Approved', progress: 100 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, isTask = false) => {
    if (!window.confirm('Permanently delete this?')) return;
    try {
      const col = isTask ? 'ceo_tasks' : 'ceo_directives';
      await deleteDoc(doc(db, col, id));
    } catch (err) {
      console.error(err);
    }
  };

  const allItems = [...directives, ...tasks].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const filteredDirectives = allItems.filter(d => 
    filterAudience === 'all' || d.audience === filterAudience
  );

  const activeCount = allItems.filter(d => d.status !== 'archived').length;

  const getAudienceInfo = (id) => AUDIENCES.find(a => a.id === id) || AUDIENCES[2];
  const getPriorityColor = (p) => {
    if (p === 'critical') return 'bg-red-500/10 text-red-400 border-red-500/30';
    if (p === 'urgent') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-slate-800 text-slate-400 border-slate-700';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold flex items-center gap-1.5">
            <Radio size={12} className="animate-pulse" /> Cross-Portal Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-1">Executive Directive Console</h1>
          <p className="text-xs text-slate-400 mt-1">
            Issue broadcasts, tasks, and announcements to Manager, Employee, and Customer portals in real-time.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {activeCount} Active Items
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            {allItems.length} Total
          </div>
        </div>
      </div>

      {/* Audience Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {AUDIENCES.slice(0, 5).map(aud => {
          const count = allItems.filter(d => d.audience === aud.id && d.status !== 'archived').length;
          return (
            <div key={aud.id} className={`p-4 rounded-xl border ${aud.bg} flex items-center gap-3`}>
              <aud.icon size={20} className={aud.color} />
              <div>
                <p className="text-lg font-bold text-white">{count}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">{aud.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Compose Panel */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Megaphone size={16} className="text-ceo-gold" />
              <h3 className="text-sm font-serif font-bold text-white">Compose Directive</h3>
            </div>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {TYPES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`py-2 px-2 rounded-lg text-center transition-all border text-[10px] font-bold ${
                        type === t.id 
                          ? 'bg-ceo-gold/10 border-ceo-gold/40 text-ceo-gold' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Target Audience</label>
                <div className="grid grid-cols-2 gap-2">
                  {AUDIENCES.map(aud => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => setAudience(aud.id)}
                      className={`py-2 px-2 rounded-lg flex items-center gap-1.5 transition-all border text-[10px] font-bold ${
                        audience === aud.id 
                          ? `${aud.bg} ${aud.color}` 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <aud.icon size={12} />
                      {aud.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Priority</label>
                <div className="flex gap-3">
                  {PRIORITIES.map(p => (
                    <label key={p.id} className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="priority" 
                        checked={priority === p.id}
                        onChange={() => setPriority(p.id)}
                        className="accent-ceo-gold"
                      />
                      <span className={`text-xs font-bold ${p.color}`}>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Subject Line</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Performance Review Required"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-ceo-gold focus:outline-none"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">{type === 'task' ? 'Task Description' : 'Message Body'}</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={type === 'task' ? "Describe the task requirements..." : "Write the directive details..."}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white resize-none leading-relaxed focus:border-ceo-gold focus:outline-none"
                />
              </div>

              {/* Extra fields for tasks */}
              {type === 'task' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Deadline</label>
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-ceo-gold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Assign to Manager (Optional)</label>
                      <input
                        type="text"
                        value={assignedManager}
                        onChange={(e) => setAssignedManager(e.target.value)}
                        placeholder="Manager ID / Name"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-ceo-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={sending || !title.trim() || !message.trim()}
                className="w-full py-3 rounded-lg bg-ceo-gold hover:bg-yellow-500 text-ceo-navy font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sending ? (
                  <><Loader2 className="animate-spin" size={14} /> Dispatching...</>
                ) : (
                  <><Send size={14} /> Dispatch Directive</>
                )}
              </button>

              {sendStatus === 'success' && (
                <p className="text-emerald-400 text-center text-xs font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 size={14} /> Directive dispatched to {getAudienceInfo(audience).label}
                </p>
              )}
              {sendStatus === 'error' && (
                <p className="text-red-400 text-center text-xs font-bold flex items-center justify-center gap-1">
                  <AlertTriangle size={14} /> Failed to dispatch. Try again.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Active Directives Feed */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              <Radio size={14} className="text-ceo-gold" /> Live Directive Feed
            </h3>
            <div className="flex gap-2 flex-wrap">
              {['all', ...AUDIENCES.map(a => a.id)].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterAudience(f)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                    filterAudience === f 
                      ? 'bg-ceo-gold/10 border-ceo-gold/30 text-ceo-gold' 
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {f === 'all' ? 'All' : AUDIENCES.find(a => a.id === f)?.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-ceo-gold" size={24} />
              <span className="text-xs">Loading directive feed...</span>
            </div>
          ) : filteredDirectives.length === 0 ? (
            <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <Megaphone size={32} className="mx-auto mb-3 text-slate-700" />
              <p className="text-sm font-bold text-slate-400">No directives found</p>
              <p className="text-xs mt-1">Compose a new directive from the panel on the left.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
              {filteredDirectives.map(d => {
                const audInfo = getAudienceInfo(d.audience);
                const isArchived = d.status === 'archived';
                
                return (
                  <div 
                    key={d.id} 
                    className={`rounded-xl border p-4 transition-all ${
                      isArchived 
                        ? 'bg-slate-950/50 border-slate-850 opacity-60' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Top row: badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${audInfo.bg} ${audInfo.color}`}>
                        <audInfo.icon size={10} />
                        {audInfo.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getPriorityColor(d.priority)}`}>
                        {d.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-800 text-slate-500 border border-slate-700">
                        {d.type}
                      </span>
                      {isArchived && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-800 text-slate-600 border border-slate-700">
                          Archived
                        </span>
                      )}
                    </div>

                    {/* Title & message */}
                    <h4 className="text-sm font-bold text-white mb-1">{d.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{d.message || d.description}</p>
                    
                    {d.type === 'task' && (
                      <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500">Progress: <strong className="text-white">{d.progress || 0}%</strong></span>
                          <span className="text-slate-500">Status: <strong className="text-ceo-gold">{d.status}</strong></span>
                          {d.deadline && <span className="text-slate-500">Deadline: <strong className="text-white">{d.deadline}</strong></span>}
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-ceo-gold" style={{ width: `${d.progress || 0}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 pt-3 border-t border-slate-850 gap-2">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Clock size={10} />
                        {new Date(d.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        <span className="text-slate-600">•</span>
                        <span>{d.author}</span>
                      </div>
                        <div className="flex gap-2">
                        {d.type === 'task' && (d.status === 'Manager Approved' || d.status === 'Completed') && !isArchived && (
                          <button
                            onClick={() => handleApproveTask(d.id)}
                            className="px-2 py-1 rounded bg-emerald-900/50 hover:bg-emerald-900 text-emerald-400 hover:text-white transition-colors text-[10px] font-bold flex items-center gap-1"
                            title="Approve Task"
                          >
                            <CheckCircle2 size={12} /> Approve
                          </button>
                        )}
                        {!isArchived && (
                          <button
                            onClick={() => handleArchive(d.id, d.type === 'task')}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors"
                            title="Archive"
                          >
                            <Archive size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(d.id, d.type === 'task')}
                          className="p-1.5 rounded bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CeoCommandCenter;
