import React, { useState, useEffect } from 'react';
import { User, Award, Edit, Trash2, Plus, Loader2, Save } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useCeoAuth } from '../../../context/CeoAuthContext';

const CeoProfileEditor = () => {
  const { role } = useCeoAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile data state fields
  const [name, setName] = useState('Sushanth NS');
  const [title, setTitle] = useState('CEO, Chairman & Founder, Surya Bank');
  const [biography, setBiography] = useState('Sushanth NS is a visionary leader with Wharton & Stanford credentials. Under his guidance, Surya Bank has evolved into an international financial hub utilizing quantum cryptography and clean ESG investments.');
  const [education, setEducation] = useState('Stanford Graduate School of Business (MBA), Wharton School (Finance)');
  
  // Custom stats state array
  const [stats, setStats] = useState([
    { label: "Assets Managed", value: "$450B" },
    { label: "Active Investors", value: "24,000+" },
    { label: "Green Funding Ratio", value: "62%" }
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'ceo_profile_data', 'main_profile');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || 'Sushanth NS');
        setTitle(data.title || 'CEO, Chairman & Founder, Surya Bank');
        setBiography(data.biography || '');
        setEducation(data.education || '');
        setStats(data.stats || []);
      } else {
        // Initialize default record
        await setDoc(docRef, { name, title, biography, education, stats });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!['CEO', 'Executive Assistant', 'Administrator'].includes(role)) {
      alert("Access Denied: Only CEO, Assistant, and Admins can mutate executive assets.");
      return;
    }

    setSaving(true);
    try {
      const docRef = doc(db, 'ceo_profile_data', 'main_profile');
      await updateDoc(docRef, { name, title, biography, education, stats });
      alert("Executive profile updated successfully in Firestore.");
    } catch (err) {
      console.error(err);
      alert("Database write error: Could not save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddStat = () => {
    if (!newLabel || !newValue) return;
    setStats([...stats, { label: newLabel, value: newValue }]);
    setNewLabel('');
    setNewValue('');
  };

  const handleDeleteStat = (indexToDelete) => {
    setStats(stats.filter((_, idx) => idx !== indexToDelete));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold">Content Management Panel</span>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-1">Profile & Bio Editor</h1>
        <p className="text-xs text-slate-400">Modify credentials, biographical outlines, and key performance statistics visible on the main portal.</p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <Loader2 className="animate-spin text-ceo-gold" size={24} />
          <span className="text-xs">Fetching Profile records...</span>
        </div>
      ) : (
        <form onSubmit={handleSaveProfile} className="space-y-6 text-xs text-left max-w-3xl">
          
          <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              <User size={16} className="text-ceo-gold" /> Personal Identity Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">Executive Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">Official Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-550">Education Summary</label>
              <input
                type="text"
                required
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-550">Biographical Narrative</label>
              <textarea
                rows={5}
                required
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              <Award size={16} className="text-ceo-gold" /> Key Metrics & Statistics
            </h3>

            {/* List current stats */}
            <div className="space-y-2">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500">{stat.label}</span>
                    <strong className="text-white text-xs">{stat.value}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteStat(idx)}
                    className="p-1.5 rounded bg-slate-900 hover:bg-red-950 hover:text-red-400 text-slate-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new stat fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">Metric Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Asset Growth"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">Value</label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g. +14.2% YoY"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddStat}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus size={14} /> Add Metric
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={14} /> Syncing updates with database...
              </>
            ) : (
              <>
                <Save size={14} /> Commit Changes to Production
              </>
            )}
          </button>

        </form>
      )}

    </div>
  );
};

export default CeoProfileEditor;
