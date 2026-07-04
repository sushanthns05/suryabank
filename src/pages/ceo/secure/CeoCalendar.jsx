import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, MapPin, Tag, Trash2, Loader2, ArrowLeft, Check } from 'lucide-react';
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useCeoAuth } from '../../../context/CeoAuthContext';

const CeoCalendar = () => {
  const { role } = useCeoAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Meeting');
  const [desc, setDesc] = useState('');
  const [saving, setSaving] = useState(false);

  // Load calendar items
  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'ceo_calendar'));
      const list = [];
      querySnapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });

      // Also fetch approved visitor appointments from 'ceo_appointments' and add them
      const appSnap = await getDocs(collection(db, 'ceo_appointments'));
      appSnap.forEach(doc => {
        const data = doc.data();
        if (data.status === 'approved') {
          list.push({
            id: `app-${doc.id}`,
            title: `Visitor: ${data.name} - ${data.subject}`,
            date: data.date,
            time: data.time || '10:00 AM',
            location: 'Office of the CEO',
            category: 'Visitor Appt',
            desc: data.message,
            isAppt: true
          });
        }
      });

      // Sort by date then time
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(list);
    } catch (err) {
      console.error("Failed to load calendar events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!title || !date || !time) {
      alert("Please fill in the required fields (Title, Date, Time).");
      return;
    }

    setSaving(true);
    try {
      const newEvent = {
        title,
        date,
        time,
        location,
        category,
        desc,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'ceo_calendar'), newEvent);
      setIsModalOpen(false);
      
      // Reset fields
      setTitle('');
      setDate('');
      setTime('');
      setLocation('');
      setCategory('Meeting');
      setDesc('');

      fetchCalendar();
    } catch (err) {
      console.error("Failed to save event:", err);
      alert("Database error: Could not schedule event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (id.startsWith('app-')) {
      alert("Visitor appointments must be managed via the approvals dashboard.");
      return;
    }
    if (!window.confirm("Permanently delete this event from the calendar?")) return;

    try {
      await deleteDoc(doc(db, 'ceo_calendar', id));
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Board': return 'border-red-500 bg-red-950/20 text-red-400';
      case 'Investor': return 'border-emerald-500 bg-emerald-950/20 text-emerald-400';
      case 'Travel': return 'border-cyan-500 bg-cyan-950/20 text-cyan-400';
      case 'Visitor Appt': return 'border-amber-500 bg-amber-950/20 text-amber-400';
      default: return 'border-ceo-gold bg-ceo-gold/10 text-ceo-gold';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold">Interactive Scheduler</span>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-1">Executive Calendar</h1>
          <p className="text-xs text-slate-400">Manage Board convocations, investor briefings, visitor agendas, and travel plans.</p>
        </div>
        
        {/* Only CEO, Assistant, and Admin can add events */}
        {['CEO', 'Executive Assistant', 'Administrator'].includes(role) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy text-xs font-bold shadow-lg transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} /> Schedule Event
          </button>
        )}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Events List Agenda */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar size={16} className="text-ceo-gold" /> Timeline Agenda
          </h3>

          {loading ? (
            <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-ceo-gold" size={24} />
              <span className="text-xs">Accessing Calendar Database...</span>
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-3">
              {events.map((evt) => (
                <div 
                  key={evt.id}
                  className={`p-4 rounded-2xl border bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md hover:border-slate-700 transition-colors ${getCategoryColor(evt.category)}`}
                >
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-slate-950/40">
                      {evt.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">{evt.title}</h4>
                    {evt.desc && <p className="text-[10px] text-slate-400 max-w-xl">{evt.desc}</p>}
                    
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={12} /> {evt.date} | {evt.time}</span>
                      {evt.location && <span className="flex items-center gap-1"><MapPin size={12} /> {evt.location}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  {['CEO', 'Executive Assistant', 'Administrator'].includes(role) && (
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-red-950/45 hover:text-red-400 text-slate-500 transition-colors border border-slate-850 shrink-0 self-end sm:self-center"
                      title="Remove Event"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <p>No scheduled events found in the executive database.</p>
            </div>
          )}
        </div>

        {/* Calendar Side Panel / Legend */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-805 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 text-xs">
          <h3 className="font-semibold text-sm text-white">Legend & Categories</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-950 border border-red-500 inline-block" />
              <span className="text-slate-350">Board of Directors convocations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-500 inline-block" />
              <span className="text-slate-350">Investor Briefings & Dividends Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-950 border border-cyan-500 inline-block" />
              <span className="text-slate-350">Chairman's Travel schedules</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-950 border border-amber-500 inline-block" />
              <span className="text-slate-350">Visitor Appointments (Approved)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-950 border border-ceo-gold inline-block" />
              <span className="text-slate-350">Operational Staff Meetings</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-[10px] text-slate-500 leading-relaxed">
            <span className="block font-bold text-slate-400 uppercase tracking-wider">Note:</span>
            <p>
              Events scheduled on this calendar are synchronized across the Executive Assistant Portal and CEO Command widget boards automatically.
            </p>
          </div>
        </div>

      </div>

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-serif font-bold text-white">Schedule New Convocations</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs text-left">
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">Event Title*</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Q3 Budget Auditing"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Date*</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Time*</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Board Room A"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Meeting">General Meeting</option>
                    <option value="Board">Board Convocations</option>
                    <option value="Investor">Investor Briefing</option>
                    <option value="Travel">Travel Coordination</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">Description</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Details and objectives of the meeting..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {saving ? <Loader2 className="animate-spin" size={14} /> : 'Save Calendar Entry'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default CeoCalendar;
