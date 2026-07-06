import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, CheckCircle, ChevronRight, X, Users, Globe, Play,
  MessageSquare, BarChart3, Download, Video, Award, Radio, Settings, Plus, Edit2, Trash2,
  FileText, ShieldAlert, Bot, Search, Send, Link, Building
} from 'lucide-react';
import { 
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { jsPDF } from 'jspdf';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// --- CONSTANTS ---
const TABS = [
  { id: 'upcoming', label: 'Upcoming Events' },
  { id: 'live', label: 'Live Event Center' },
  { id: 'analytics', label: 'Event Analytics' },
  { id: 'archive', label: 'Archive & Downloads' },
  { id: 'ai', label: 'AI Event Assistant' }
];

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const ANALYTICS_DATA = [
  { month: 'Jan', attendees: 4500, satisfaction: 94 },
  { month: 'Feb', attendees: 5200, satisfaction: 92 },
  { month: 'Mar', attendees: 8100, satisfaction: 96 },
  { month: 'Apr', attendees: 6300, satisfaction: 95 },
  { month: 'May', attendees: 9500, satisfaction: 98 },
  { month: 'Jun', attendees: 12400, satisfaction: 97 },
];

const DEFAULT_EVENTS = [
  {
    title: "Global Shareholder Meeting 2026",
    category: "Investor Relations",
    date: "2026-08-15",
    time: "09:00 AM EST",
    location: "Surya Bank HQ, New York & Virtual",
    audience: "Shareholders & Board",
    isFeatured: true,
    imgUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    overview: "Annual general meeting detailing Q3 performance, strategic roadmap for 2027, and the dividend rollout schedule.",
    status: "Upcoming"
  },
  {
    title: "Project Quantum Security Summit",
    category: "Product Launch",
    date: "2026-07-20",
    time: "02:00 PM EST",
    location: "Virtual Broadcast",
    audience: "Media & Enterprise Clients",
    isFeatured: false,
    imgUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    overview: "Official demonstration of the new zero-trust core banking infrastructure.",
    status: "Upcoming"
  },
  {
    title: "ESG Sustainability Forum",
    category: "CSR Program",
    date: "2026-06-10",
    time: "10:00 AM EST",
    location: "London Office",
    audience: "Public",
    isFeatured: false,
    imgUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    overview: "Panel discussion on achieving our Net Zero 2035 targets.",
    status: "Archived"
  }
];

const CeoEvents = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isEditMode, setIsEditMode] = useState(false);
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Modal States
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, item: null });
  const [eventDetailModal, setEventDetailModal] = useState(null);

  // Live Center State
  const [liveChat, setLiveChat] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // AI State
  const [aiChat, setAiChat] = useState([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // FIRESTORE SYNC
  useEffect(() => {
    const eventsRef = collection(db, 'ceo_events');
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      if (snapshot.empty) {
        setEvents([]);
      } else {
        const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const seedDatabase = async () => {
    try {
      setLoading(true);
      const eventsRef = collection(db, 'ceo_events');
      for (const evt of DEFAULT_EVENTS) {
        await addDoc(eventsRef, evt);
      }
      alert("Database seeded successfully.");
    } catch (e) {
      console.error("Seeding error:", e);
    } finally {
      setLoading(false);
    }
  };

  // COUNTDOWN LOGIC
  useEffect(() => {
    const featured = events.find(e => e.isFeatured && e.status === 'Upcoming');
    if (!featured) return;

    const timer = setInterval(() => {
      const target = new Date(`${featured.date}T${featured.time.split(' ')[0]}`); // Rough parsing
      const now = new Date();
      
      // If parsing fails or target is invalid, default to 30 days
      if (isNaN(target.getTime())) {
        target.setDate(now.getDate() + 30);
      }

      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [events]);

  // CRUD HANDLERS
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const eventData = Object.fromEntries(fd.entries());
    eventData.isFeatured = fd.get('isFeatured') === 'on';

    try {
      if (modalConfig.item?.id) {
        const docRef = doc(db, 'ceo_events', modalConfig.item.id);
        await updateDoc(docRef, eventData);
      } else {
        await addDoc(collection(db, 'ceo_events'), { ...eventData, status: 'Upcoming' });
      }
      setModalConfig({ isOpen: false, type: null, item: null });
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if(window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDoc(doc(db, 'ceo_events', id));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const toggleRSVP = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
    } else {
      setRegisteredEvents(prev => [...prev, eventId]);
      alert("Successfully registered for event. A calendar hold has been placed.");
    }
  };

  // PDF DOWNLOADER
  const handleDownloadBrochure = (event) => {
    try {
      const pdf = new jsPDF();
      pdf.setFillColor(15, 23, 42); 
      pdf.rect(0, 0, 210, 297, 'F');
      
      pdf.setTextColor(212, 175, 55); 
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SURYA BANK ENTERPRISE', 20, 30);
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      const titleLines = pdf.splitTextToSize(event.title, 170);
      pdf.text(titleLines, 20, 45);

      pdf.setFontSize(12);
      pdf.setTextColor(148, 163, 184);
      pdf.setFont('helvetica', 'normal');
      const startY = 45 + (titleLines.length * 8) + 5;
      pdf.text(`Date: ${event.date}`, 20, startY);
      pdf.text(`Time: ${event.time}`, 20, startY + 7);
      pdf.text(`Location: ${event.location}`, 20, startY + 14);
      pdf.text(`Audience: ${event.audience}`, 20, startY + 21);
      
      pdf.setDrawColor(212, 175, 55);
      pdf.line(20, startY + 30, 190, startY + 30);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      const descLines = pdf.splitTextToSize(event.overview || "No overview available.", 170);
      pdf.text(descLines, 20, startY + 40);

      pdf.save(`SuryaBank_${event.title.replace(/\s+/g, '_')}_Brochure.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate brochure.');
    }
  };

  // AI HANDLER
  const handleAiSubmit = () => {
    if (!aiQuery.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', text: aiQuery }]);
    setAiQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      let response = "I have reviewed our enterprise event calendar. ";
      const lower = aiQuery.toLowerCase();
      if (lower.includes('schedule') || lower.includes('upcoming')) {
        response += `We have ${events.filter(e => e.status === 'Upcoming').length} upcoming events. The most notable is the Global Shareholder Meeting.`;
      } else if (lower.includes('rsvp') || lower.includes('register')) {
        response += "I can automatically register you for any upcoming board or investor meetings. Just let me know which one.";
      } else {
        response += "I can assist with scheduling, providing agendas, or managing your RSVPs. What do you need?";
      }
      
      setAiChat(prev => [...prev, { role: 'ai', text: response }]);
      setIsAiTyping(false);
    }, 1500);
  };

  // RENDERERS
  const renderKPIs = () => {
    const kpis = [
      { label: 'Total Events (YTD)', value: events.length.toString(), icon: <Calendar size={20} /> },
      { label: 'Upcoming Events', value: events.filter(e => e.status === 'Upcoming').length.toString(), icon: <Clock size={20} /> },
      { label: 'Total Attendees', value: '24,500+', icon: <Users size={20} /> },
      { label: 'Global Reach', value: '18 Countries', icon: <Globe size={20} /> },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
            <div className="p-2 bg-slate-800 rounded-lg text-[#D4AF37] w-fit mb-4">{kpi.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{kpi.label}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderUpcoming = () => {
    const featured = events.find(e => e.isFeatured && e.status === 'Upcoming');
    const upcoming = events.filter(e => e.status === 'Upcoming');

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {events.length === 0 && !loading && (
          <div className="p-8 border border-dashed border-slate-700 rounded-2xl text-center">
            <p className="text-slate-400 mb-4">No events found in the database.</p>
            <button onClick={seedDatabase} className="bg-[#D4AF37] text-slate-900 px-6 py-2 rounded-xl font-bold text-sm">Initialize Default Events</button>
          </div>
        )}

        {/* Featured Hero */}
        {featured && (
          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
            {isEditMode && (
              <button onClick={() => setModalConfig({ isOpen: true, type: 'event', item: featured })} className="absolute top-4 right-4 z-20 p-2 bg-[#D4AF37] text-slate-900 rounded-lg shadow-lg hover:bg-amber-400">
                <Edit2 size={16} />
              </button>
            )}
            <img src={featured.imgUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"} alt="Hero" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="max-w-2xl">
                <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                  <Radio size={12} className="inline mr-1 animate-pulse" /> Live Broadcast Scheduled
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">{featured.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-slate-300 font-bold mb-6">
                  <span className="flex items-center gap-1"><Calendar size={16} className="text-[#D4AF37]" /> {featured.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={16} className="text-[#D4AF37]" /> {featured.location}</span>
                  <span className="flex items-center gap-1"><Users size={16} className="text-[#D4AF37]" /> {featured.audience}</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setEventDetailModal(featured)}
                    className="bg-[#D4AF37] text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors"
                  >
                    View Details & Agenda
                  </button>
                  <button 
                    onClick={() => handleDownloadBrochure(featured)}
                    className="bg-slate-800/80 backdrop-blur text-white border border-slate-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} /> Brochure
                  </button>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex gap-4">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-[#D4AF37] font-mono min-w-[3ch]">{value.toString().padStart(2, '0')}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">{unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Event Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif font-bold text-white">Upcoming Schedule</h3>
            {isEditMode && (
              <button onClick={() => setModalConfig({ isOpen: true, type: 'event', item: null })} className="bg-[#D4AF37] text-slate-900 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-amber-400">
                <Plus size={14} /> Add Event
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map(evt => (
              <div key={evt.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:-translate-y-1 hover:border-slate-600 transition-all group relative flex flex-col">
                {isEditMode && (
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button onClick={(e) => { e.stopPropagation(); setModalConfig({ isOpen: true, type: 'event', item: evt }); }} className="p-1.5 bg-slate-800 text-slate-300 rounded hover:text-white"><Edit2 size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(evt.id); }} className="p-1.5 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/40"><Trash2 size={14} /></button>
                  </div>
                )}
                <div className="text-[10px] uppercase font-bold text-[#D4AF37] mb-3">{evt.category}</div>
                <h4 className="text-lg font-serif font-bold text-white mb-4 pr-16 leading-tight">{evt.title}</h4>
                <div className="space-y-2 text-xs text-slate-400 mb-6 flex-1">
                  <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-500" /> {evt.date} @ {evt.time}</div>
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-500" /> {evt.location}</div>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-between items-center mt-auto">
                  <button onClick={() => setEventDetailModal(evt)} className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1">Details <ChevronRight size={14} /></button>
                  <button 
                    onClick={() => toggleRSVP(evt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${registeredEvents.includes(evt.id) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                  >
                    {registeredEvents.includes(evt.id) ? <><CheckCircle size={14} /> Registered</> : 'RSVP Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLiveCenter = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stream Simulator */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden flex flex-col relative h-[600px]">
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-rose-500 text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
            <Radio size={14} className="animate-pulse" /> LIVE
          </div>
          <div className="flex-1 bg-black relative flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="stage" />
            <div className="relative z-10 w-24 h-24 bg-[#D4AF37]/20 rounded-full flex items-center justify-center animate-pulse cursor-pointer hover:scale-110 transition-transform">
              <Play size={40} className="text-[#D4AF37] ml-2" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white text-xs font-bold">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Users size={14} /> 12,408 Watching</span>
                <span className="flex items-center gap-1 text-[#D4AF37]"><Award size={14} /> CEO Keynote</span>
              </div>
              <span>01:14:22</span>
            </div>
          </div>
        </div>

        {/* Live Chat & Q&A */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl flex flex-col h-[600px] overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2"><MessageSquare size={16} className="text-[#D4AF37]" /> Live Q&A</h3>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded">Moderated</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {liveChat.map((msg, i) => (
              <div key={i} className="text-sm">
                <span className="font-bold text-[#D4AF37] text-xs mr-2">{msg.author}:</span>
                <span className="text-slate-300">{msg.text}</span>
              </div>
            ))}
            {liveChat.length === 0 && <div className="text-slate-500 text-xs text-center mt-10">Live chat is open. Ask the speakers a question.</div>}
          </div>
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && chatInput.trim()) {
                  setLiveChat([...liveChat, { author: 'You', text: chatInput }]);
                  setChatInput('');
                }
              }}
              placeholder="Submit a question..." 
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
            />
            <button 
              onClick={() => {
                if(chatInput.trim()) {
                  setLiveChat([...liveChat, { author: 'You', text: chatInput }]);
                  setChatInput('');
                }
              }}
              className="bg-[#D4AF37] text-slate-900 px-4 rounded-xl flex items-center justify-center hover:bg-amber-400 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Attendance Trends */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-[400px] flex flex-col">
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><BarChart3 className="text-[#D4AF37]" size={20} /> Attendance & Engagement Trends</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickFormatter={(val) => `${val/1000}k`} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="attendees" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Map */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-[400px] flex flex-col relative overflow-hidden">
          <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2 relative z-10"><Globe className="text-[#D4AF37]" size={20} /> Global Attendee Distribution</h3>
          <p className="text-xs text-slate-400 mb-4 relative z-10">Real-time geographic tracking of registered virtual attendees.</p>
          <div className="flex-1 w-full bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden relative">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }} style={{ width: "100%", height: "100%" }}>
              <ZoomableGroup center={[0, 20]} zoom={1} minZoom={1} maxZoom={4}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#1e293b"
                        stroke="#334155"
                        strokeWidth={0.5}
                        style={{ default: { outline: "none" }, hover: { fill: "#475569", outline: "none" }, pressed: { fill: "#D4AF37", outline: "none" } }}
                      />
                    ))
                  }
                </Geographies>
                {/* Simulated markers for dense attendee regions */}
                <Marker coordinates={[-74.006, 40.7128]}><circle r={8} fill="#D4AF37" className="animate-ping opacity-75" /><circle r={4} fill="#D4AF37" /></Marker>
                <Marker coordinates={[-0.1276, 51.5074]}><circle r={6} fill="#D4AF37" className="animate-ping opacity-75" /><circle r={3} fill="#D4AF37" /></Marker>
                <Marker coordinates={[103.8198, 1.3521]}><circle r={5} fill="#D4AF37" className="animate-ping opacity-75" /><circle r={2.5} fill="#D4AF37" /></Marker>
                <Marker coordinates={[139.6917, 35.6895]}><circle r={4} fill="#D4AF37" className="animate-ping opacity-75" /><circle r={2} fill="#D4AF37" /></Marker>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>

      </div>
    </div>
  );

  const renderArchive = () => {
    const archived = events.filter(e => e.status === 'Archived');

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-colors"></div>
          <h3 className="text-white font-bold text-xl mb-6 relative z-10 flex items-center gap-2"><Download className="text-[#D4AF37]" /> Historical Archive & Downloads</h3>
          <p className="text-sm text-slate-400 mb-8 relative z-10">Access recordings, slide decks, and official transcripts from past events.</p>
          
          <div className="space-y-4 relative z-10">
            {archived.length === 0 && <p className="text-slate-500 text-sm">No archived events found.</p>}
            {archived.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-600 transition-colors cursor-pointer group/item relative">
                {isEditMode && (
                  <div className="absolute top-2 right-16 flex gap-1 z-10">
                    <button onClick={(e) => { e.stopPropagation(); setModalConfig({ isOpen: true, type: 'event', item: doc }); }} className="p-1 bg-slate-800 text-slate-300 rounded hover:text-white hover:bg-slate-700"><Edit2 size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(doc.id); }} className="p-1 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/40"><Trash2 size={12} /></button>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 rounded-lg text-slate-400 group-hover/item:text-[#D4AF37] transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold">{doc.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{doc.date} • {doc.location}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <button className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-xs font-bold flex items-center gap-1">
                    <Play size={14} /> Watch
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDownloadBrochure(doc); }}
                    className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 flex items-center gap-1 text-xs font-bold"
                  >
                    <Download size={14} /> Deck
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAiAssistant = () => (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-[600px] flex flex-col animate-in fade-in duration-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
      
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
          <Bot className="text-[#D4AF37]" size={24} />
        </div>
        <div>
          <h3 className="text-white font-bold text-xl">Event Intelligence AI</h3>
          <p className="text-xs text-slate-400">Summarize agendas, schedule reminders, and query past event statistics.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar mb-6">
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex-shrink-0 flex items-center justify-center">
            <Bot size={16} className="text-slate-900" />
          </div>
          <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200 shadow-md">
            Welcome to the Executive Event AI Assistant. I am synced with your personal calendar and the global enterprise event database. How can I assist you with scheduling today?
          </div>
        </div>
        
        {aiChat.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700' : 'bg-[#D4AF37]'}`}>
              {msg.role === 'user' ? <Search size={14} className="text-white" /> : <Bot size={16} className="text-slate-900" />}
            </div>
            <div className={`rounded-2xl p-4 text-sm shadow-md max-w-[80%] ${msg.role === 'user' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex-shrink-0 flex items-center justify-center">
              <Bot size={16} className="text-slate-900" />
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
          placeholder="E.g., Which board meetings are scheduled for next month?"
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
        <button 
          onClick={handleAiSubmit}
          disabled={!aiQuery.trim() || isAiTyping}
          className="bg-[#D4AF37] hover:bg-amber-400 text-slate-900 px-6 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );

  // EVENT DETAIL OVERLAY
  const renderEventDetail = () => {
    if (!eventDetailModal) return null;
    const evt = eventDetailModal;

    return (
      <div className="fixed inset-0 z-[1000] flex justify-center bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto py-10 px-4">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl shadow-2xl relative overflow-hidden my-auto">
          <button onClick={() => setEventDetailModal(null)} className="absolute top-6 right-6 p-2 bg-slate-800/80 backdrop-blur rounded-full text-slate-400 hover:text-white hover:bg-slate-700 z-20">
            <X size={20} />
          </button>
          
          <div className="h-64 relative overflow-hidden">
             <img src={evt.imgUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} alt="Cover" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
             <div className="absolute bottom-6 left-8">
               <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/10 px-3 py-1 rounded border border-[#D4AF37]/30 backdrop-blur">{evt.category}</span>
             </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">{evt.title}</h2>
                <div className="flex gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={14}/> {evt.date} @ {evt.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {evt.location}</span>
                </div>
              </div>
              <button 
                onClick={() => { toggleRSVP(evt.id); setEventDetailModal(null); }}
                className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${registeredEvents.includes(evt.id) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#D4AF37] text-slate-900 hover:bg-amber-400'}`}
              >
                {registeredEvents.includes(evt.id) ? 'Registered' : 'RSVP Now'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Event Overview</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{evt.overview || "Join the executive board and global shareholders for an in-depth session covering strategic initiatives and financial outlooks."}</p>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-4">Agenda Highlights</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-4 text-sm"><div className="text-[#D4AF37] font-bold w-16">09:00</div><div className="text-slate-300 border-l border-slate-700 pl-4">Opening Keynote by Chairman & CEO</div></li>
                    <li className="flex gap-4 text-sm"><div className="text-[#D4AF37] font-bold w-16">10:30</div><div className="text-slate-300 border-l border-slate-700 pl-4">Financial Outlook & Strategic Roadmap</div></li>
                    <li className="flex gap-4 text-sm"><div className="text-[#D4AF37] font-bold w-16">13:00</div><div className="text-slate-300 border-l border-slate-700 pl-4">Live Q&A Session</div></li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Building size={16} className="text-[#D4AF37]"/> Venue Access</h4>
                  <p className="text-xs text-slate-400 mb-2">Physical attendance requires Level 4 biometric clearance. Virtual attendance requires enterprise SSO.</p>
                  <button className="text-[#D4AF37] text-xs font-bold hover:underline flex items-center gap-1">Security Instructions <ChevronRight size={12}/></button>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Download size={16} className="text-[#D4AF37]"/> Resources</h4>
                  <button onClick={() => handleDownloadBrochure(evt)} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                    <FileText size={14}/> Download PDF Brochure
                  </button>
                  <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 mt-2">
                    <Calendar size={14}/> Add to Calendar
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  // CRUD MODAL
  const renderCrudModal = () => {
    if (!modalConfig.isOpen) return null;

    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950/50">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="text-[#D4AF37]" size={20} /> 
              {modalConfig.item ? 'Edit Event' : 'Create New Event'}
            </h3>
            <button onClick={() => setModalConfig({ isOpen: false, type: null, item: null })} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSaveEvent} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Event Title</label>
                <input name="title" defaultValue={modalConfig.item?.title || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                <select name="category" defaultValue={modalConfig.item?.category || 'Investor Relations'} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none">
                  <option value="Investor Relations">Investor Relations</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="CSR Program">CSR Program</option>
                  <option value="Board Meeting">Board Meeting</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                <select name="status" defaultValue={modalConfig.item?.status || 'Upcoming'} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
                <input type="date" name="date" defaultValue={modalConfig.item?.date || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-400 mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Time</label>
                <input type="text" name="time" placeholder="e.g. 09:00 AM EST" defaultValue={modalConfig.item?.time || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                <input type="text" name="location" placeholder="e.g. Virtual, New York HQ" defaultValue={modalConfig.item?.location || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Target Audience</label>
                <input type="text" name="audience" placeholder="e.g. Public, Shareholders, Media" defaultValue={modalConfig.item?.audience || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Cover Image URL</label>
                <input type="text" name="imgUrl" defaultValue={modalConfig.item?.imgUrl || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Overview / Description</label>
                <textarea name="overview" defaultValue={modalConfig.item?.overview || ''} rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>

              <div className="col-span-2 flex items-center gap-2 mt-2">
                <input type="checkbox" name="isFeatured" id="isFeatured" defaultChecked={modalConfig.item?.isFeatured || false} className="w-4 h-4 accent-[#D4AF37]" />
                <label htmlFor="isFeatured" className="text-sm font-bold text-slate-300">Set as Featured Event (Hero section)</label>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-slate-900 pb-2">
              <button type="button" onClick={() => setModalConfig({ isOpen: false, type: null, item: null })} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl text-sm font-bold bg-[#D4AF37] text-slate-900 hover:bg-amber-400 transition-colors">Save Event</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 relative">
      
      {/* Header & Edit Mode */}
      <div className="flex justify-end pt-4 pr-4 relative z-50">
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg border ${
            isEditMode 
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 hover:bg-rose-500/30' 
            : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700 backdrop-blur-md'
          }`}
        >
          {isEditMode ? <ShieldAlert size={14} /> : <Settings size={14} />}
          {isEditMode ? 'Exit Edit Mode' : 'Enable Edit Mode'}
        </button>
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">Global Operations</span>
        <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">Executive Event Platform</h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
          The centralized hub for corporate scheduling, live investor broadcasts, board meetings, and enterprise collaboration across Surya Bank's global footprint.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 sticky top-4 z-40 shadow-xl shadow-slate-950/20">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab.id 
              ? 'bg-[#D4AF37] text-slate-900 shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-105' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPIs rendered globally across main tabs */}
      {['upcoming', 'live', 'analytics'].includes(activeTab) && renderKPIs()}

      {/* Content Area */}
      <div className="min-h-[600px] mt-8">
        {activeTab === 'upcoming' && renderUpcoming()}
        {activeTab === 'live' && renderLiveCenter()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'archive' && renderArchive()}
        {activeTab === 'ai' && renderAiAssistant()}
      </div>

      {/* Modals */}
      {renderEventDetail()}
      {renderCrudModal()}
      
    </div>
  );
};

export default CeoEvents;
