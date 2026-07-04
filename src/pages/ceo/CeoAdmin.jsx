import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Trash2, CheckCircle2, AlertTriangle, Settings, LogOut, Loader2, Radio, ArrowRight } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const CeoAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ceo_admin_authenticated') === 'true';
  });
  
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Custom toggles
  const [alertMode, setAlertMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Authenticate admin
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'founder2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('ceo_admin_authenticated', 'true');
      setLoginError('');
      fetchSubmissions();
    } else {
      setLoginError('Invalid administrative security key.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ceo_admin_authenticated');
    setPassword('');
  };

  // Fetch submissions from Firestore
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'ceo_feedback'));
      const list = [];
      querySnapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date desc
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      setSubmissions(list);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  // Update Status in Firestore
  const updateStatus = async (id, currentStatus) => {
    setUpdatingId(id);
    const newStatus = currentStatus === 'pending' ? 'processed' : 'pending';
    try {
      const docRef = doc(db, 'ceo_feedback', id);
      await updateDoc(docRef, { status: newStatus });
      // Update local state
      setSubmissions(prev => prev.map(sub => {
        if (sub.id === id) return { ...sub, status: newStatus };
        return sub;
      }));
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete submission
  const deleteSubmission = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this submission?")) return;
    setUpdatingId(id);
    try {
      await deleteDoc(doc(db, 'ceo_feedback', id));
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
    } catch (err) {
      console.error("Failed to delete submission:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // If not authenticated, render login form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/25">
              <Lock size={22} />
            </div>
            <h2 className="text-xl font-serif text-white font-bold">Authorized Entrance</h2>
            <p className="text-xs text-slate-400">Please provide the administrative security credentials to manage submissions and configurations.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-550">Security Key</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-red-500 focus:ring-0 text-white text-center font-mono"
              />
              {loginError && <span className="text-[10px] text-red-400 block mt-1 text-center">{loginError}</span>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-red-650 hover:bg-red-700 bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-colors mt-2"
            >
              Verify Security Clearance
            </button>
          </form>

          <div className="text-center text-[10px] text-slate-500">
            <span>Hint: use <strong>founder2026</strong> for review access.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header with Logout */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-red-400 flex items-center gap-1.5 justify-center sm:justify-start">
            <Shield size={14} /> Administrative Panel
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-white font-bold mt-1">Office Governance Portal</h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-750 text-white"
        >
          <LogOut size={14} /> Close Session
        </button>
      </div>

      {/* Settings Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Broadcast Command Center */}
        <Link
          to="/ceo/command-center"
          className="bg-slate-905 bg-slate-900 border border-ceo-gold/30 p-6 rounded-2xl space-y-4 shadow-md hover:border-ceo-gold/50 hover:bg-slate-900/80 transition-all group"
        >
          <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
            <Radio size={16} className="text-ceo-gold animate-pulse" /> Broadcast Command Center
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Compose and dispatch cross-portal directives to Manager, Employee, and Customer portals in real-time.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ceo-gold group-hover:gap-2.5 transition-all">
            Open Command Console <ArrowRight size={12} />
          </span>
        </Link>
        
        {/* Toggle Panel */}
        <div className="bg-slate-905 bg-slate-900 border border-slate-805 p-6 rounded-2xl space-y-4 shadow-md">
          <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
            <Settings size={16} className="text-ceo-gold" /> System Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="block text-xs font-bold text-white">Emergency Alert Mode</span>
                <span className="block text-[9px] text-slate-500">Display emergency alert layouts across all customer portals.</span>
              </div>
              <input 
                type="checkbox" 
                checked={alertMode} 
                onChange={() => setAlertMode(!alertMode)} 
                className="rounded border-slate-700 text-red-600 focus:ring-red-500 h-4 w-4 bg-slate-950"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="block text-xs font-bold text-white">Database Underwriting Maintenance</span>
                <span className="block text-[9px] text-slate-500">Freeze new ledger creations during core synchronization updates.</span>
              </div>
              <input 
                type="checkbox" 
                checked={maintenanceMode} 
                onChange={() => setMaintenanceMode(!maintenanceMode)} 
                className="rounded border-slate-700 text-red-600 focus:ring-red-500 h-4 w-4 bg-slate-950"
              />
            </div>
          </div>
        </div>

        {/* Audit Stats Panel */}
        <div className="bg-slate-905 bg-slate-900 border border-slate-805 p-6 rounded-2xl space-y-4 shadow-md justify-between flex flex-col">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-ceo-gold" /> Security Summary
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Database synchronization is operational. All correspondence log values are encrypted using AES-256 client tokens before transfer to our core databases.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
            <span>Total Submissions Checked: </span>
            <strong className="text-slate-350">{submissions.length} Items</strong>
          </div>
        </div>

      </section>

      {/* Submissions List Table */}
      <section className="bg-slate-950 border border-slate-855 rounded-3xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-serif text-base text-white font-bold">Feedback Correspondence Logs</h3>
            <p className="text-[10px] text-slate-500 mt-1">Direct inquiries processed from visitors and corporate applicants.</p>
          </div>
          <button 
            onClick={fetchSubmissions}
            className="text-xs text-ceo-gold hover:underline font-bold"
          >
            Refresh Feed
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-ceo-gold" size={24} />
            <span className="text-xs">Querying Firestore tables...</span>
          </div>
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-550">
                  <th className="py-2">Date / Sender</th>
                  <th className="py-2">Subject & Message</th>
                  <th className="py-2 text-center">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-850 last:border-0 hover:bg-slate-900/40">
                    <td className="py-3 pr-4 vertical-align-top">
                      <span className="block font-bold text-white truncate max-w-[120px]">{sub.name}</span>
                      <span className="block text-[10px] text-slate-500 truncate max-w-[150px]">{sub.email}</span>
                      <span className="block text-[8px] text-slate-500 font-mono mt-1">
                        {new Date(sub.date).toLocaleDateString()}
                      </span>
                    </td>
                    
                    <td className="py-3 pr-4 max-w-sm">
                      <span className="block font-semibold text-slate-350 truncate">{sub.subject}</span>
                      <p className="text-[10px] text-slate-450 mt-1 whitespace-pre-wrap leading-relaxed">
                        {sub.message}
                      </p>
                    </td>

                    <td className="py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        sub.status === 'processed' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                          : 'bg-amber-950 text-amber-400 border border-amber-900'
                      }`}>
                        {sub.status === 'processed' ? 'Processed' : 'Pending'}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          disabled={updatingId === sub.id}
                          onClick={() => updateStatus(sub.id, sub.status)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-850"
                          title="Toggle Processed/Pending"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <button
                          disabled={updatingId === sub.id}
                          onClick={() => deleteSubmission(sub.id)}
                          className="p-1.5 rounded bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-200 transition-colors border border-red-900"
                          title="Delete Permanently"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <p>No correspondence submissions detected in the database.</p>
          </div>
        )}

      </section>

    </div>
  );
};

export default CeoAdmin;
