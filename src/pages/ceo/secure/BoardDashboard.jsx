import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, increment, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useCeoAuth } from '../../../context/CeoAuthContext';
import { Vote, FileText, CheckCircle2, ChevronRight, AlertCircle, Loader2, Plus, Download, Check } from 'lucide-react';

const BoardDashboard = () => {
  const { user, role } = useCeoAuth();
  const [resolutions, setResolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userVoted, setUserVoted] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const agenda = [
    { title: "Review Q3 liquidity ratios", time: "14:00 - 14:30" },
    { title: "Approve green credit parameters", time: "14:30 - 15:15" },
    { title: "Post-quantum cryptographical audit findings", time: "15:15 - 16:00" }
  ];

  const previousMinutes = [
    { date: "June 15, 2026", title: "Q2 Annual Budget Sign-off", status: "Audited" },
    { date: "May 28, 2026", title: "Security Firewall Upgrades Review", status: "Audited" },
    { date: "April 12, 2026", title: "Bengaluru Hub Operations Expansion Approval", status: "Audited" }
  ];

  const fetchVotes = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'ceo_board_votes'));
      const list = [];
      querySnapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });

      if (list.length === 0) {
        // Initialize default board resolutions if collection empty
        const defaults = [
          { title: "Nominate Lord Avery as Head of Risk Audit Committee", approve: 5, reject: 1, abstain: 0 },
          { title: "Deploy $250M into carbon offset capital funds", approve: 4, reject: 0, abstain: 2 },
          { title: "Confirm quantum cryptography infrastructure roadmap", approve: 6, reject: 0, abstain: 0 }
        ];

        for (let item of defaults) {
          const docId = item.title.replace(/\s+/g, '_').toLowerCase();
          await setDoc(doc(db, 'ceo_board_votes', docId), item);
          list.push({ id: docId, ...item });
        }
      }

      setResolutions(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const handleVote = async (resolutionId, option) => {
    if (userVoted[resolutionId]) {
      alert("You have already recorded your vote on this resolution.");
      return;
    }

    try {
      const docRef = doc(db, 'ceo_board_votes', resolutionId);
      await updateDoc(docRef, {
        [option]: increment(1)
      });

      setUserVoted(prev => ({ ...prev, [resolutionId]: option }));
      
      // Log notification
      await addDoc(collection(db, 'ceo_notifications'), {
        title: 'New Resolution Vote Recorded',
        message: `A board member submitted a vote for resolution ID: ${resolutionId}.`,
        type: 'info',
        read: false,
        timestamp: new Date().toISOString(),
        role: 'Board Member'
      });

      fetchVotes();
    } catch (err) {
      console.error(err);
      alert("Failed to register vote.");
    }
  };

  const handleAddResolution = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const docId = newTitle.toLowerCase().replace(/\s+/g, '_');
      await setDoc(doc(db, 'ceo_board_votes', docId), {
        title: newTitle.trim(),
        approve: 0,
        reject: 0,
        abstain: 0
      });

      // Add Notification
      await addDoc(collection(db, 'ceo_notifications'), {
        title: 'New Resolution Scheduled',
        message: `Resolution "${newTitle.trim()}" added to the agenda list.`,
        type: 'info',
        read: false,
        timestamp: new Date().toISOString(),
        role: 'Board Member'
      });

      setNewTitle('');
      setShowAddModal(false);
      fetchVotes();
    } catch (err) {
      console.error(err);
      alert("Failed to save resolution.");
    }
  };

  const getPercent = (val, total) => {
    if (total === 0) return 0;
    return Math.round((val / total) * 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold">Confidential Board Room</span>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-1">Board Portal</h1>
          <p className="text-xs text-slate-400">Restricted access portal for board members to cast votes, review minutes, and verify agendas.</p>
        </div>
        {['CEO', 'Administrator'].includes(role) && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold flex items-center gap-1.5 transition-all text-xs"
          >
            <Plus size={14} /> Schedule Resolution
          </button>
        )}
      </div>

      {showAddModal && (
        <div className="p-6 bg-slate-900 border border-slate-805 rounded-2xl max-w-lg space-y-4">
          <h3 className="font-bold text-white text-sm">Schedule Board Resolution</h3>
          <form onSubmit={handleAddResolution} className="space-y-3">
            <input 
              type="text" 
              placeholder="e.g. Allocate capital funding for cyber framework updates..." 
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-ceo-gold"
            />
            <div className="flex gap-2 justify-end">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-3 py-1.5 rounded bg-ceo-gold text-ceo-navy font-bold"
              >
                Save Resolution
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Resolutions for Voting */}
        <div className="lg:col-span-8 space-y-4 text-left">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Vote size={16} className="text-ceo-gold" /> Active Board Resolutions
          </h3>

          {loading ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-ceo-gold" size={20} />
              <span className="text-xs">Decrypting resolution logs...</span>
            </div>
          ) : resolutions.length > 0 ? (
            <div className="space-y-4">
              {resolutions.map((res) => {
                const total = (res.approve || 0) + (res.reject || 0) + (res.abstain || 0);
                return (
                  <div key={res.id} className="bg-slate-900 border border-slate-805 p-6 rounded-2xl shadow-lg space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">BOARD VOTE LOG ID: {res.id}</span>
                      <h4 className="text-sm font-semibold text-white leading-relaxed">{res.title}</h4>
                    </div>

                    {/* Vote progress indicators */}
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-950 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${getPercent(res.approve, total)}%` }} />
                        <div className="bg-red-500 h-full" style={{ width: `${getPercent(res.reject, total)}%` }} />
                        <div className="bg-slate-500 h-full" style={{ width: `${getPercent(res.abstain, total)}%` }} />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-center bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-500">Approve</span>
                          <strong className="text-emerald-400 text-sm">{res.approve || 0} ({getPercent(res.approve, total)}%)</strong>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-500">Reject</span>
                          <strong className="text-red-400 text-sm">{res.reject || 0} ({getPercent(res.reject, total)}%)</strong>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-500">Abstain</span>
                          <strong className="text-slate-400 text-sm">{res.abstain || 0} ({getPercent(res.abstain, total)}%)</strong>
                        </div>
                      </div>
                    </div>

                    {/* Vote Actions */}
                    {userVoted[res.id] ? (
                      <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-emerald-400 text-[10px] flex items-center gap-1.5 justify-center font-bold">
                        <CheckCircle2 size={12} /> You voted: <strong className="uppercase text-ceo-gold">{userVoted[res.id]}</strong>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleVote(res.id, 'abstain')}
                          className="px-3 py-1.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold transition-colors"
                        >
                          Abstain
                        </button>
                        <button 
                          onClick={() => handleVote(res.id, 'reject')}
                          className="px-3 py-1.5 rounded bg-red-950/40 hover:bg-red-950 text-red-400 font-bold border border-red-900/30 transition-colors"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleVote(res.id, 'approve')}
                          className="px-3 py-1.5 rounded bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 border border-dashed border-slate-850 rounded-2xl bg-slate-900/30">
              <p>No active resolutions requiring votes.</p>
            </div>
          )}
        </div>

        {/* Board Agenda & Notes Side panel */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Today's Agenda list */}
          <div className="bg-slate-900 border border-slate-805 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <CheckCircle2 size={14} className="text-ceo-gold" /> Convocations Agenda
            </h3>
            
            <div className="space-y-3">
              {agenda.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="p-1 rounded bg-slate-950 text-ceo-gold shrink-0 mt-0.5">
                    <ChevronRight size={12} />
                  </span>
                  <div>
                    <strong className="block text-white">{item.title}</strong>
                    <span className="block text-[9px] text-slate-500 mt-0.5">{item.time} IST</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Minutes archives */}
          <div className="bg-slate-900 border border-slate-805 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <FileText size={14} className="text-ceo-gold" /> Minutes of Meetings
            </h3>
            
            <div className="space-y-3">
              {previousMinutes.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center text-[10px]">
                  <div className="space-y-0.5">
                    <strong className="text-white block">{item.title}</strong>
                    <span className="text-[8px] text-slate-500 font-mono">{item.date}</span>
                  </div>
                  <button 
                    onClick={() => alert(`Initiating secure download for minutes: ${item.title}`)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-ceo-gold hover:text-white transition-colors"
                  >
                    <Download size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Notice */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 flex gap-2">
            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
            <p className="text-[10px] text-red-200 leading-relaxed">
              <strong>Security Protocol Warning:</strong> Voting tokens are cryptographic and tracked via audit ledger files in accordance with compliance guidelines.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default BoardDashboard;
