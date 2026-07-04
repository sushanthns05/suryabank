import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useCeoAuth } from '../../../context/CeoAuthContext';
import { ClipboardList, Plane, Calendar, UserCheck, Loader2, Plus, Bell } from 'lucide-react';

const EADashboard = () => {
  const { user } = useCeoAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Travel Coordination Form State
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelers, setTravelers] = useState('Chairman Only');
  const [travelList, setTravelList] = useState([
    { destination: "Zurich (FinTech Summit)", date: "2026-07-15", travelers: "Chairman + 2 Advisors" },
    { destination: "Singapore (APAC Branch)", date: "2026-08-02", travelers: "Chairman Only" }
  ]);

  // Reminders Form State
  const [reminderText, setReminderText] = useState('');
  const [reminders, setReminders] = useState([
    { text: "Confirm speech guidelines for Annual Summit", date: "Today" },
    { text: "Approve board Q3 minutes printouts", date: "Tomorrow" }
  ]);

  const fetchEALogs = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'ceo_appointments'));
      const list = [];
      querySnapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAppointments(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load travel logs from calendar database
  const fetchTravelCoordinates = async () => {
    try {
      const q = query(collection(db, 'ceo_calendar'), where('category', '==', 'Travel'));
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        list.push({
          destination: data.location || data.title.replace('Travel: ', ''),
          date: data.date,
          travelers: data.desc ? data.desc.replace('Travel logistics configured: ', '') : 'Chairman Only'
        });
      });
      if (list.length > 0) {
        setTravelList(list);
      }
    } catch (err) {
      console.error("Failed to load travel:", err);
    }
  };

  useEffect(() => {
    fetchEALogs();
    fetchTravelCoordinates();
  }, []);

  const handlePreApprove = async (id) => {
    try {
      const docRef = doc(db, 'ceo_appointments', id);
      await updateDoc(docRef, { status: 'pre-approved' });
      
      // Log notification for CEO approval
      await addDoc(collection(db, 'ceo_notifications'), {
        title: 'Visitor Pre-Approved',
        message: `An appointment requires final CEO authorization.`,
        type: 'approval',
        read: false,
        timestamp: new Date().toISOString(),
        role: 'CEO'
      });

      alert("Appointment pre-approved. Forwarded to the CEO for final clearance.");
      fetchEALogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      const docRef = doc(db, 'ceo_appointments', id);
      await updateDoc(docRef, { status: 'rejected' });
      alert("Appointment request rejected.");
      fetchEALogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTravel = async (e) => {
    e.preventDefault();
    if (!destination || !travelDate) return;

    try {
      const travelData = {
        title: `Travel: ${destination}`,
        date: travelDate,
        time: '08:00 AM',
        location: destination,
        category: 'Travel',
        desc: `Travel logistics configured: ${travelers}`,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'ceo_calendar'), travelData);
      
      // Update local state list
      setTravelList(prev => [...prev, { destination, date: travelDate, travelers }]);
      setDestination('');
      setTravelDate('');
      setTravelers('Chairman Only');
      alert("Travel plan successfully registered and synchronized on the CEO Calendar.");
    } catch (err) {
      console.error(err);
      alert("Failed to register travel plan in database.");
    }
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!reminderText) return;
    setReminders([...reminders, { text: reminderText, date: "Just now" }]);
    setReminderText('');
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold">Executive Assistant Console</span>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-1">Assistant Dashboard</h1>
        <p className="text-xs text-slate-400">Triage bookings, schedule corporate travel coordinates, and handle executive correspondence logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Visitor Requests triages */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ClipboardList size={16} className="text-ceo-gold" /> Visitor Triage Desk
          </h3>

          {loading ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-ceo-gold" size={20} />
              <span className="text-xs">Accessing appointment database...</span>
            </div>
          ) : pendingAppointments.length > 0 ? (
            <div className="space-y-3">
              {pendingAppointments.map((appt) => (
                <div 
                  key={appt.id} 
                  className="bg-slate-900 border border-slate-805 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs"
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <strong className="text-white">{appt.name}</strong>
                      <span className="text-[9px] text-slate-400">({appt.email})</span>
                    </div>
                    <p className="font-semibold text-ceo-gold text-[10px]">{appt.subject}</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{appt.message}</p>
                    <div className="text-[9px] text-slate-500 font-mono">Requested: {appt.date} at {appt.time || 'TBD'}</div>
                  </div>

                  <div className="flex gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleReject(appt.id)}
                      className="px-3 py-1.5 rounded bg-slate-950 hover:bg-red-950 text-red-400 text-[10px] font-bold border border-slate-850"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handlePreApprove(appt.id)}
                      className="px-3 py-1.5 rounded bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy text-[10px] font-bold flex items-center gap-1"
                    >
                      <UserCheck size={12} /> Pre-Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 border border-dashed border-slate-850 rounded-2xl bg-slate-900/30">
              <p>No new visitor bookings awaiting triage review.</p>
            </div>
          )}
        </div>

        {/* Reminders & Travel forms */}
        <div className="lg:col-span-4 space-y-6 text-xs text-left">
          
          {/* Reminders list */}
          <div className="bg-slate-900 border border-slate-805 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Bell size={14} className="text-ceo-gold" /> Operational Reminders
            </h3>
            <div className="space-y-2">
              {reminders.map((rem, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                  <p className="text-slate-300 leading-relaxed">{rem.text}</p>
                  <span className="block text-[8px] text-slate-500 mt-1">{rem.date}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddReminder} className="flex gap-2 items-center">
              <input
                type="text"
                required
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                placeholder="New reminder note..."
                className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
              <button type="submit" className="p-2 rounded bg-ceo-gold text-ceo-navy hover:bg-ceo-gold-hover transition-colors">
                <Plus size={14} />
              </button>
            </form>
          </div>

          {/* Travel Coordination */}
          <div className="bg-slate-900 border border-slate-805 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Plane size={14} className="text-ceo-gold" /> Flight & Travel Coordinates
            </h3>
            <div className="space-y-2">
              {travelList.map((trv, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-850 space-y-0.5">
                  <strong className="block text-white">{trv.destination}</strong>
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>Date: {trv.date}</span>
                    <span>{trv.travelers}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddTravel} className="space-y-2 pt-2 border-t border-slate-850">
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination City"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
              <input
                type="date"
                required
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
              >
                <option value="Chairman Only">Chairman Only</option>
                <option value="Chairman + Staff">Chairman + Assistant</option>
                <option value="Chairman + 2 Advisors">Chairman + Delegation</option>
              </select>
              <button type="submit" className="w-full py-2 rounded bg-slate-800 text-white hover:bg-slate-700 font-bold font-mono transition-colors text-[10px]">
                Add Travel Plan
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default EADashboard;
