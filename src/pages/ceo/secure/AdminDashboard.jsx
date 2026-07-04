import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useCeoAuth } from '../../../context/CeoAuthContext';
import { Shield, Users, Mail, History, Trash2, Loader2, Edit, Save, BarChart3, Lock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const roleColors = {
  'CEO': 'text-red-400 bg-red-950/20 border-red-900',
  'Executive Assistant': 'text-amber-400 bg-amber-950/20 border-amber-900',
  'Board Member': 'text-purple-400 bg-purple-950/20 border-purple-900',
  'Investor': 'text-emerald-400 bg-emerald-950/20 border-emerald-900',
  'Media': 'text-cyan-400 bg-cyan-950/20 border-cyan-900',
  'Administrator': 'text-blue-400 bg-blue-950/20 border-blue-900'
};

const COLORS = ['#D4AF37', '#38BDF8', '#10B981', '#F43F5E', '#A855F7', '#EC4899'];

const trafficData = [
  { name: 'Mon', visits: 120, downloads: 4 },
  { name: 'Tue', visits: 190, downloads: 6 },
  { name: 'Wed', visits: 240, downloads: 9 },
  { name: 'Thu', visits: 310, downloads: 12 },
  { name: 'Fri', visits: 280, downloads: 8 },
  { name: 'Sat', visits: 140, downloads: 3 },
  { name: 'Sun', visits: 110, downloads: 2 }
];

const AdminDashboard = () => {
  const { role: currentRole } = useCeoAuth();
  
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  // Dynamic Audit logs combined state
  const [liveAuditLogs, setLiveAuditLogs] = useState([]);
  const [totalDownloadsCount, setTotalDownloadsCount] = useState(0);
  const [activeSessionCount, setActiveSessionCount] = useState(0);
  const [roleBreakdown, setRoleBreakdown] = useState([]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const userSnap = await getDocs(collection(db, 'ceo_users'));
      const userList = [];
      const rolesCounts = {};
      userSnap.forEach(docSnap => {
        const uData = docSnap.data();
        userList.push({ id: docSnap.id, ...uData });
        rolesCounts[uData.role] = (rolesCounts[uData.role] || 0) + 1;
      });
      setUsers(userList);

      // Map roles distribution for pie chart
      const distribution = Object.keys(rolesCounts).map(rName => ({
        name: rName,
        value: rolesCounts[rName]
      }));
      setRoleBreakdown(distribution.length > 0 ? distribution : [
        { name: 'CEO', value: 1 },
        { name: 'EA', value: 1 },
        { name: 'Admin', value: 1 }
      ]);

      // Fetch contact feedback
      const feedbackSnap = await getDocs(collection(db, 'ceo_feedback'));
      const feedbackList = [];
      feedbackSnap.forEach(docSnap => {
        feedbackList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setFeedback(feedbackList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time listener for logs & activities
  useEffect(() => {
    fetchAdminData();

    // 1. Subscribe to Session Logs
    const qSessions = query(collection(db, 'ceo_session_logs'));
    const unsubSessions = onSnapshot(qSessions, (snapshot) => {
      setActiveSessionCount(snapshot.size);
      
      // Load last 15 session activities
      const sessions = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        sessions.push({
          timestamp: data.timestamp || new Date().toISOString(),
          user: data.email || 'Anonymous',
          action: `${data.action} (${data.role || 'Clearance'})`,
          ip: data.ip || '127.0.0.1',
          type: 'session'
        });
      });

      // 2. Subscribe to Download Logs
      const unsubDownloads = onSnapshot(collection(db, 'ceo_download_logs'), (dlSnapshot) => {
        setTotalDownloadsCount(dlSnapshot.size);

        const downloads = [];
        dlSnapshot.forEach(docSnap => {
          const data = docSnap.data();
          downloads.push({
            timestamp: data.timestamp || new Date().toISOString(),
            user: data.userEmail || 'Anonymous',
            action: `Downloaded Secure PDF: "${data.docTitle || 'Paper'}"`,
            ip: data.ipAddress || '198.51.100.82',
            type: 'download'
          });
        });

        // Merge, sort, and slice logs
        const combined = [...sessions, ...downloads];
        combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLiveAuditLogs(combined.slice(0, 15));
      });

      return () => unsubDownloads();
    }, (err) => {
      console.error(err);
    });

    return () => unsubSessions();
  }, []);

  const handleUpdateRole = async (userId) => {
    try {
      const docRef = doc(db, 'ceo_users', userId);
      await updateDoc(docRef, { role: selectedRole });
      setEditingUserId(null);
      alert("User role clearance clearance modified.");
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert("Failed to modify user role.");
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Permanently delete this feedback entry?")) return;
    try {
      await deleteDoc(doc(db, 'ceo_feedback', id));
      setFeedback(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Security Control Desk</span>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-1">Admin Command Center</h1>
          <p className="text-xs text-slate-400">Control role clearances, audit executive actions, and monitor global usage analytics.</p>
        </div>
      </div>

      {/* Analytics Counter metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-805 p-5 rounded-2xl shadow-lg space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-500">Registered Accounts</span>
          <strong className="block text-2xl font-serif text-white font-bold">{users.length}</strong>
          <span className="text-[10px] text-slate-450">Active IAM entries</span>
        </div>
        <div className="bg-slate-900 border border-slate-805 p-5 rounded-2xl shadow-lg space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-500">Total Audit Logs</span>
          <strong className="block text-2xl font-serif text-white font-bold">{activeSessionCount + totalDownloadsCount}</strong>
          <span className="text-[10px] text-slate-450">Session + File logs</span>
        </div>
        <div className="bg-slate-900 border border-slate-805 p-5 rounded-2xl shadow-lg space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-500">Secure Downloads</span>
          <strong className="block text-2xl font-serif text-ceo-gold font-bold">{totalDownloadsCount}</strong>
          <span className="text-[10px] text-slate-450">Watermark stamped exports</span>
        </div>
        <div className="bg-slate-900 border border-slate-805 p-5 rounded-2xl shadow-lg space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-550">Feedback Correspondence</span>
          <strong className="block text-2xl font-serif text-emerald-400 font-bold">{feedback.length}</strong>
          <span className="text-[10px] text-slate-450">Triaged contact entries</span>
        </div>
      </div>

      {/* Analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly traffic charts */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-805 p-6 rounded-3xl shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={14} className="text-ceo-gold" /> System Traffic & Document Downloads
          </h3>
          <div className="h-64 sm:h-72 w-full text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                <Legend />
                <Bar dataKey="visits" name="Page Hits" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                <Bar dataKey="downloads" name="Secure Downloads" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Role breakdown */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-805 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
            User Roles Distribution
          </h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[9px] pt-4 border-t border-slate-850">
            {roleBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* User Role management */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Users Table */}
          <div className="bg-slate-900 border border-slate-805 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-ceo-gold" /> Registered Security Profiles
            </h3>

            {loading ? (
              <div className="py-12 text-center text-slate-500">
                <Loader2 className="animate-spin text-ceo-gold mx-auto" size={24} />
              </div>
            ) : (
              <div className="overflow-x-auto text-[11px] text-left">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Account email</th>
                      <th className="py-3 px-2">Assigned Clearance</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-850 hover:bg-slate-950/20 text-slate-350">
                        <td className="py-3 px-2 font-mono font-semibold text-white">{u.email}</td>
                        <td className="py-3 px-2">
                          {editingUserId === u.id ? (
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white focus:outline-none"
                            >
                              <option value="CEO">CEO</option>
                              <option value="Executive Assistant">Executive Assistant</option>
                              <option value="Board Member">Board Member</option>
                              <option value="Investor">Investor</option>
                              <option value="Media">Media</option>
                              <option value="Administrator">Administrator</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase ${roleColors[u.role] || 'border-slate-800 bg-slate-900 text-slate-400'}`}>
                              {u.role}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          {editingUserId === u.id ? (
                            <button
                              onClick={() => handleUpdateRole(u.id)}
                              className="p-1 rounded bg-ceo-gold text-ceo-navy hover:bg-ceo-gold-hover flex items-center gap-1 font-bold"
                            >
                              <Save size={12} /> Save
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingUserId(u.id);
                                setSelectedRole(u.role);
                              }}
                              className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              <Edit size={12} /> Clearance
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Feedback Moderation List */}
          <div className="bg-slate-900 border border-slate-805 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Mail size={16} className="text-ceo-gold" /> Correspondence Triage Inbox
            </h3>

            {feedback.length > 0 ? (
              <div className="space-y-3 text-xs text-left">
                {feedback.map((fb) => (
                  <div key={fb.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <strong className="text-white block">{fb.name} <span className="font-mono text-[9px] text-slate-500">({fb.email})</span></strong>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{fb.message}</p>
                      <span className="block text-[8px] text-slate-600">Submitted: {fb.timestamp?.toDate ? fb.timestamp.toDate().toLocaleString() : fb.timestamp || 'TBD'}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteFeedback(fb.id)}
                      className="p-1.5 rounded bg-slate-900 hover:bg-red-950 text-red-400 hover:text-red-300 shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500">
                <p>No correspondence submissions registered.</p>
              </div>
            )}
          </div>

        </div>

        {/* Real-Time Live Audit Logs Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-805 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 text-xs text-left">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <History size={14} className="text-ceo-gold" /> System Activity Audit
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {liveAuditLogs.length > 0 ? (
              liveAuditLogs.map((log, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
                  <div className="flex justify-between items-center text-[8px] text-slate-500">
                    <span>{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}</span>
                    <span className="font-mono">IP: {log.ip}</span>
                  </div>
                  <strong className="block text-slate-350 font-mono text-[9px] truncate">{log.user}</strong>
                  <p className="text-[10px] text-slate-400 leading-normal">{log.action}</p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500">
                No activity logs verified in database registry.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
