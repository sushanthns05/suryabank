import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, ChevronRight, X } from 'lucide-react';
import { upcomingEvents } from './CeoMockData';

const CeoEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [registeredList, setRegisteredList] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Investor Relations', 'Board Meeting', 'Product Launch', 'CSR Program'];

  const filteredEvents = upcomingEvents.filter(evt => 
    activeFilter === 'All' || evt.category === activeFilter
  );

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpName || !rsvpEmail) return;

    setRegisteredList(prev => [...prev, selectedEvent.id]);
    setSelectedEvent(null);
    setRsvpName('');
    setRsvpEmail('');
    
    // Trigger custom success notification
    if (window.dispatchEvent) {
      const msg = `RSVP confirmed for "${selectedEvent.title}"! We've sent a calendar invite to ${rsvpEmail}.`;
      alert(msg); // Fallback if layout toast isn't captured
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Executive Schedules</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">Upcoming Events</h1>
        <p className="text-xs text-slate-400">Register for public earnings webcasts, view shareholder conference schedules, and sign up for CSR collaborations.</p>
      </div>

      {/* Filter Tabs */}
      <section className="flex gap-2 overflow-x-auto pb-2 justify-center">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              activeFilter === cat
                ? 'bg-ceo-gold border-ceo-gold text-ceo-navy'
                : 'bg-slate-905 bg-slate-900 border-slate-805 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Events Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {filteredEvents.map((evt) => {
          const isRegistered = registeredList.includes(evt.id);

          return (
            <div 
              key={evt.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-805 hover:border-ceo-gold/40 transition-all shadow-lg flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Meta Category & RSVP flag */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span className="text-ceo-gold bg-ceo-gold/10 px-2.5 py-0.5 rounded border border-ceo-gold/20">
                    {evt.category}
                  </span>
                  {isRegistered && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle size={12} /> RSVP Confirmed
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-sm font-semibold text-white group-hover:text-ceo-gold transition-colors">
                  {evt.title}
                </h3>

                {/* Event Schedule details */}
                <div className="space-y-2 pt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-500" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-500" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-500" />
                    <span>{evt.location}</span>
                  </div>
                </div>

              </div>

              {/* RSVP Action */}
              <div className="pt-6 border-t border-slate-800/80 mt-6 flex justify-between items-center">
                <span className="text-[10px] text-slate-500">
                  {evt.registrationRequired ? "Public Registration Required" : "Invite Only Session"}
                </span>
                
                {evt.registrationRequired ? (
                  <button
                    disabled={isRegistered}
                    onClick={() => setSelectedEvent(evt)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isRegistered
                        ? 'bg-slate-950 text-slate-650 cursor-not-allowed border border-slate-900'
                        : 'bg-slate-800 hover:bg-slate-700/80 text-white border border-slate-750'
                    }`}
                  >
                    {isRegistered ? "Registered" : "RSVP & Set Reminder"} <ChevronRight size={14} />
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">Board Members Only</span>
                )}
              </div>

            </div>
          );
        })}
      </section>

      {/* RSVP Modal Overlay */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
          
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-white animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="font-serif text-base font-bold text-white mb-2">Event Registration</h3>
            <p className="text-xs text-slate-400 mb-6">
              Confirm your attendance to receive streaming credentials and material files for <strong className="text-ceo-gold">"{selectedEvent.title}"</strong>.
            </p>

            <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Full Name</label>
                <input
                  required
                  type="text"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-ceo-gold/60 focus:ring-0 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Corporate Email</label>
                <input
                  required
                  type="email"
                  value={rsvpEmail}
                  onChange={(e) => setRsvpEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-ceo-gold/60 focus:ring-0 text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold text-xs shadow-lg transition-colors mt-2"
              >
                Submit RSVP Confirmation
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default CeoEvents;
