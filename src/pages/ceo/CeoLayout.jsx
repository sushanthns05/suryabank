import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { Menu, X, Globe, Moon, Sun, ArrowUp, Search, Shield, ChevronDown, Command, Check, Volume2, Bell } from 'lucide-react';
import CeoCommandPalette from './CeoCommandPalette';

// Auth and Database imports for Secure Board & Notifications
import { useCeoAuth } from '../../context/CeoAuthContext';
import { useCeoCMS } from '../../context/CeoCMSContext';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Pencil, Save, XCircle } from 'lucide-react';

// Translations dictionary for demo-purposes of multi-language compliance
const translations = {
  en: {
    home: "Home", about: "About", leadership: "Leadership", vision: "Vision", strategy: "Strategy", 
    innovation: "Innovation", esg: "ESG", governance: "Governance", media: "Media",
    investors: "Investors", publications: "Publications", awards: "Awards", events: "Events",
    gallery: "Gallery", contact: "Contact", admin: "Admin", officeTitle: "Office of the CEO, Chairman & Founder",
    searchPlaceholder: "Search or press Ctrl+K", backToTop: "Back to Top"
  },
  de: {
    home: "Startseite", about: "Über uns", leadership: "Führung", vision: "Vision", strategy: "Strategie", 
    innovation: "Innovation", esg: "ESG", governance: "Governance", media: "Medien",
    investors: "Investoren", publications: "Publikationen", awards: "Auszeichnungen", events: "Termine",
    gallery: "Galerie", contact: "Kontakt", admin: "Admin", officeTitle: "Büro des CEO, Vorsitzenden & Gründers",
    searchPlaceholder: "Suchen oder Strg+K drücken", backToTop: "Zurück nach oben"
  },
  es: {
    home: "Inicio", about: "Biografía", leadership: "Liderazgo", vision: "Visión", strategy: "Estrategia", 
    innovation: "Innovación", esg: "ESG", governance: "Gobernanza", media: "Prensa",
    investors: "Inversores", publications: "Publicaciones", awards: "Premios", events: "Eventos",
    gallery: "Galería", contact: "Contacto", admin: "Administración", officeTitle: "Oficina del CEO, Presidente y Fundador",
    searchPlaceholder: "Buscar o presionar Ctrl+K", backToTop: "Volver arriba"
  },
  hi: {
    home: "मुख्य पृष्ठ", about: "परिचय", leadership: "नेतृत्व", vision: "दृष्टिकोण", strategy: "रणनीति", 
    innovation: "नवाचार", esg: "ईएसजी", governance: "शासन", media: "मीडिया",
    investors: "निवेशक", publications: "प्रकाशन", awards: "पुरस्कार", events: "कार्यक्रम",
    gallery: "गैलरी", contact: "संपर्क", admin: "व्यवस्थापक", officeTitle: "सीईओ, अध्यक्ष और संस्थापक का कार्यालय",
    searchPlaceholder: "खोजें या Ctrl+K दबाएं", backToTop: "ऊपर जाएं"
  }
};

const CeoLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('ceo_lang');
    return ['en', 'de', 'es', 'hi'].includes(saved) ? saved : 'en';
  });
  const [darkMode, setDarkMode] = useState(true); // Default to premium dark
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  // Custom toast notification states
  const [toasts, setToasts] = useState([]);

  // Auth and real-time alerts
  const { user, role, logout } = useCeoAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Executive CMS Context
  const { isEditMode, toggleEditMode } = useCeoCMS();

  const t = translations[lang];

  // Subscribe to real-time action items/notifications depending on role
  useEffect(() => {
    if (!user || !role) {
      setNotifications([]);
      setNotificationCount(0);
      return;
    }

    const q = query(
      collection(db, 'ceo_notifications'),
      where('read', '==', false)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (!data.role || data.role === role || role === 'CEO' || role === 'Administrator') {
          list.push({ id: docSnap.id, ...data });
        }
      });
      setNotifications(list);
      setNotificationCount(list.length);
    }, (err) => {
      console.error(err);
    });

    return () => unsubscribe();
  }, [user, role]);

  const handleNotificationClick = async (item) => {
    try {
      const docRef = doc(db, 'ceo_notifications', item.id);
      await updateDoc(docRef, { read: true });
      setIsNotificationsOpen(false);
      
      // Determine navigation based on notification type
      if (item.type === 'approval') {
        if (role === 'CEO') navigate('/ceo/dashboard');
        else if (role === 'Executive Assistant') navigate('/ceo/ea');
      } else if (item.type === 'security') {
        if (role === 'Administrator' || role === 'CEO') navigate('/ceo/admin');
      }
    } catch (e) {
      console.error("Error clearing notification:", e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      for (const item of notifications) {
        const docRef = doc(db, 'ceo_notifications', item.id);
        await updateDoc(docRef, { read: true });
      }
      setIsNotificationsOpen(false);
      addToast("Cleared all notification alerts", "info");
    } catch (e) {
      console.error(e);
    }
  };

  // Click-away listener for language & profile dropdowns
  useEffect(() => {
    const closeDropdowns = () => {
      setIsLangOpen(false);
      setIsProfileDropdownOpen(false);
      setIsNotificationsOpen(false);
    };
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  // Shortcut command listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K opens Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      
      // Accessibility: Alt + Keys
      if (e.altKey) {
        if (e.key === 'h') { e.preventDefault(); navigateTo('home'); }
        if (e.key === 'a') { e.preventDefault(); navigateTo('about'); }
        if (e.key === 'v') { e.preventDefault(); navigateTo('vision'); }
        if (e.key === 's') { e.preventDefault(); navigateTo('strategy'); }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll listener for progress and back-to-top
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Class Toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Dynamic SEO Metadata injections based on route
  useEffect(() => {
    const path = location.pathname;
    let title = "Sushanth NS | CEO, Chairman & Founder, Surya Bank";
    let desc = "Official executive portal of Sushanth NS. Visionary leadership, green banking strategy, and annual shareholder reports for Surya Bank.";
    
    if (path.includes('/about')) {
      title = "About Sushanth NS | Biography & Career Milestones";
      desc = "Learn about the education, Stanford/Wharton credentials, and career achievements of Sushanth NS, Founder of Surya Bank.";
    } else if (path.includes('/message')) {
      title = "Chairman's Annual Letter | Sushanth NS";
      desc = "Read the latest annual shareholder address outlining strategic initiatives, tech innovations, and global economic forecasts.";
    } else if (path.includes('/strategy')) {
      title = "Surya Bank Strategy & Divisions Dashboard";
      desc = "Explore our core banking verticals: Retail, Corporate, SME, and Investment banking dashboards and market shares.";
    } else if (path.includes('/esg')) {
      title = "ESG Dashboard | Sustainable Executive Actions";
      desc = "Review our carbon reduction milestones, community funding reports, and women-in-leadership percentages.";
    } else if (path.includes('/admin')) {
      title = "Secure Executive Admin | Office of Sushanth NS";
      desc = "Authorized portal management panel.";
    }

    document.title = title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;

    // Structured Data JSON-LD injection
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Sushanth NS",
      "jobTitle": "CEO, Chairman & Founder",
      "worksFor": {
        "@type": "Organization",
        "name": "Surya Bank",
        "url": "https://ceo-suryabank.web.app/"
      },
      "url": "https://ceo-suryabank.web.app/",
      "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
    };

    let scriptTag = document.getElementById('jsonLdSchema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'jsonLdSchema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.innerHTML = JSON.stringify(structuredData);

  }, [location]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const navigateTo = (action) => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
    if (action === 'home') navigate('/ceo');
    else navigate(`/ceo/${action}`);
    addToast(`Navigated to ${action.toUpperCase()}`, 'success');
  };

  const getBreadcrumb = () => {
    const path = location.pathname.replace('/ceo', '').replace('/', '');
    if (!path) return 'Home';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-ceo-dark text-gray-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-ceo-gold via-amber-400 to-yellow-300 z-[10001] transition-all"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Toast Container */}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-xl border flex items-center gap-2 animate-in slide-in-from-left duration-200 ${
              toast.type === 'success' 
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700' 
                : toast.type === 'error'
                  ? 'bg-rose-900/90 text-rose-100 border-rose-700'
                  : 'bg-slate-900/90 text-slate-100 border-slate-700'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            <p className="text-xs font-semibold">{toast.message}</p>
          </div>
        ))}
      </div>

      {/* Sticky Header */}
      <header className={`sticky top-0 z-[999] border-b backdrop-blur-md transition-all ${
        darkMode ? 'bg-ceo-navy/90 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Office Title */}
          <Link to="/ceo" className="flex items-center gap-3 group" onClick={() => addToast("Welcome to Executive Office", "info")}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-ceo-gold to-yellow-500 flex items-center justify-center font-bold text-ceo-navy text-xl group-hover:scale-105 transition-transform shadow-md">
              S
            </div>
            <div>
              <span className="block font-serif text-lg tracking-wider font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-ceo-gold group-hover:text-ceo-gold transition-colors">
                Sushanth NS
              </span>
              <span className="block text-[10px] tracking-widest text-ceo-gold uppercase">
                {t.officeTitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <button 
              onClick={() => setActiveMegaMenu(activeMegaMenu === 'bio' ? null : 'bio')}
              className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors ${activeMegaMenu === 'bio' ? 'text-ceo-gold font-bold' : 'hover:text-ceo-gold'}`}
            >
              Biography & Leadership <ChevronDown size={14} />
            </button>

            <button 
              onClick={() => setActiveMegaMenu(activeMegaMenu === 'strategy' ? null : 'strategy')}
              className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors ${activeMegaMenu === 'strategy' ? 'text-ceo-gold font-bold' : 'hover:text-ceo-gold'}`}
            >
              Strategy & Innovation <ChevronDown size={14} />
            </button>

            <button 
              onClick={() => setActiveMegaMenu(activeMegaMenu === 'stakeholders' ? null : 'stakeholders')}
              className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors ${activeMegaMenu === 'stakeholders' ? 'text-ceo-gold font-bold' : 'hover:text-ceo-gold'}`}
            >
              Relations & Media <ChevronDown size={14} />
            </button>

            <button 
              onClick={() => navigateTo('contact')}
              className={`py-2 text-sm font-medium transition-colors hover:text-ceo-gold ${location.pathname.includes('/contact') ? 'text-ceo-gold' : ''}`}
            >
              {t.contact}
            </button>

            <button 
              onClick={() => navigateTo('admin')}
              className={`flex items-center gap-1 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors ${location.pathname.includes('/admin') ? 'text-red-300 font-bold' : ''}`}
            >
              <Shield size={14} /> {t.admin}
            </button>
          </nav>

          {/* Interactive controls */}
          <div className="flex items-center gap-4">

            {/* User Dropdown Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-all text-[11px] font-bold text-white flex items-center gap-1.5 relative"
                >
                  <span className="w-2 h-2 rounded-full bg-ceo-gold inline-block animate-pulse" />
                  <span className="hidden sm:inline uppercase text-[9px]">{role}</span>
                  <ChevronDown size={10} />
                  
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold rounded-full w-4 h-4 text-[9px] flex items-center justify-center animate-bounce">
                      {notificationCount}
                    </span>
                  )}
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-2 z-[1001] text-xs text-left" onClick={(e) => e.stopPropagation()}>
                    <div className="px-4 py-2 border-b border-slate-850 space-y-0.5">
                      <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Access Clearance</span>
                      <strong className="text-white font-serif">{role}</strong>
                      <span className="block text-[9px] text-slate-400 font-mono truncate">{user.email}</span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      {role === 'CEO' && (
                        <>
                          <Link to="/ceo/dashboard" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-ceo-gold transition-colors font-semibold">
                            CEO Command Dashboard
                          </Link>
                          <Link to="/ceo/command-center" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-ceo-gold hover:bg-slate-900 transition-colors font-bold border border-ceo-gold/20 bg-ceo-gold/5 mt-1">
                            Master Command Center
                          </Link>
                        </>
                      )}
                      {role === 'Executive Assistant' && (
                        <>
                          <Link to="/ceo/ea" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-ceo-gold transition-colors font-semibold">
                            Assistant Dashboard
                          </Link>
                          <Link to="/ceo/command-center" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-ceo-gold hover:bg-slate-900 transition-colors font-bold mt-1">
                            Master Command Center
                          </Link>
                        </>
                      )}
                      {role === 'Board Member' && (
                        <Link to="/ceo/board" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-ceo-gold transition-colors font-semibold">
                          Board Portal
                        </Link>
                      )}
                      {role === 'Investor' && (
                        <Link to="/ceo/investor-dashboard" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-ceo-gold transition-colors font-semibold">
                          Investor Portal
                        </Link>
                      )}
                      {role === 'Media' && (
                        <Link to="/ceo/media-secure" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-ceo-gold transition-colors font-semibold">
                          Media Portal
                        </Link>
                      )}
                      {role === 'Administrator' && (
                        <Link to="/ceo/admin" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-ceo-gold transition-colors font-semibold">
                          Admin Command
                        </Link>
                      )}

                      <Link to="/ceo/calendar" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white transition-colors">
                        Executive Calendar
                      </Link>
                      <Link to="/ceo/appointments" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white transition-colors">
                        Appointment Center
                      </Link>
                      <Link to="/ceo/launch-control" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white transition-colors">
                        Executive Launch Control
                      </Link>
                      <Link to="/ceo/vault" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white transition-colors">
                        Confidential Vault
                      </Link>

                      {['CEO', 'Executive Assistant', 'Administrator'].includes(role) && (
                        <Link to="/ceo/profile-editor" onClick={() => setIsProfileDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white transition-colors">
                          Profile & Bio Editor
                        </Link>
                      )}
                    </div>

                    <div className="p-1 border-t border-slate-850 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                          addToast("Terminated secure session", "info");
                          navigate("/ceo");
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-red-450 hover:bg-red-950/30 hover:text-red-400 font-bold transition-colors"
                      >
                        Terminate Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/ceo/login"
                className="px-3 py-1.5 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy text-xs font-bold transition-all"
              >
                Executive Portal
              </Link>
            )}
            
            {/* Search Icon */}
            <button 
              onClick={() => setIsCommandOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-800/80 transition-colors text-slate-400 hover:text-white"
              title="Search Ctrl+K"
            >
              <Search size={18} />
            </button>

            {/* Notifications Dropdown Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationsOpen(!isNotificationsOpen);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-800/80 transition-colors text-slate-400 hover:text-white relative"
                  title="Notifications"
                >
                  <Bell size={18} />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white font-bold rounded-full w-4 h-4 text-[9px] flex items-center justify-center animate-bounce">
                      {notificationCount}
                    </span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl py-3 z-[1001] text-xs text-left" onClick={(e) => e.stopPropagation()}>
                    <div className="px-4 pb-2 border-b border-slate-850 flex justify-between items-center">
                      <span className="font-bold text-white uppercase tracking-wider text-[10px]">Real-Time Security Alerts</span>
                      {notificationCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead} 
                          className="text-[9px] text-ceo-gold hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto mt-2 px-1 space-y-1">
                      {notifications.length > 0 ? (
                        notifications.map((item) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleNotificationClick(item)}
                            className="p-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-855 transition-colors cursor-pointer space-y-1"
                          >
                            <div className="flex justify-between items-center">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                item.type === 'security' ? 'bg-red-950/40 text-red-400 border border-red-900' :
                                item.type === 'warning' ? 'bg-amber-950/40 text-amber-400 border border-amber-900' :
                                'bg-blue-950/40 text-blue-400 border border-blue-900'
                              }`}>
                                {item.type}
                              </span>
                              <span className="text-[8px] text-slate-500 font-mono">
                                {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Just now'}
                              </span>
                            </div>
                            <strong className="block text-slate-200">{item.title}</strong>
                            <p className="text-[10px] text-slate-450 leading-snug">{item.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-slate-500">
                          No new unread notification logs.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangOpen(!isLangOpen);
                }}
                className="p-2 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center gap-1 text-slate-400 hover:text-white"
              >
                <Globe size={18} />
                <span className="text-xs font-bold uppercase">{lang}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-[1001]" onClick={(e) => e.stopPropagation()}>
                  {['en', 'de', 'es', 'hi'].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        localStorage.setItem('ceo_lang', l);
                        setIsLangOpen(false);
                        addToast(`Language updated to ${l.toUpperCase()}`, 'info');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-slate-800 hover:text-ceo-gold flex items-center justify-between"
                    >
                      <span className="uppercase">{l}</span>
                      {lang === l && <Check size={12} className="text-ceo-gold" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={() => {
                setDarkMode(!darkMode);
                addToast(`Theme toggled to ${!darkMode ? 'Dark' : 'Light'}`, 'info');
              }}
              className="p-2 rounded-lg hover:bg-slate-800/80 transition-colors text-slate-400 hover:text-white"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800/80 transition-colors text-slate-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>

        {/* Mega Menu overlay panels */}
        {activeMegaMenu && (
          <div 
            className="absolute left-0 right-0 border-b shadow-2xl bg-slate-950/95 border-slate-800 p-8 animate-in slide-in-from-top-4 duration-200"
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
              
              {activeMegaMenu === 'bio' && (
                <>
                  <div>
                    <h3 className="text-ceo-gold font-serif text-sm tracking-wider uppercase mb-4">Sushanth NS</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Explore the foundational journey, values, education background, and core accomplishments of the Chairman.
                    </p>
                    <button 
                      onClick={() => navigateTo('about')}
                      className="text-xs font-bold text-white hover:text-ceo-gold transition-colors flex items-center gap-1"
                    >
                      View Biography & Timeline →
                    </button>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <button onClick={() => navigateTo('about')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Executive Profile</h4>
                      <p className="text-xs text-slate-500 mt-1">Detailed history, Wharton / Stanford credentials, and values.</p>
                    </button>
                    <button onClick={() => navigateTo('message')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Chairman's Letter</h4>
                      <p className="text-xs text-slate-500 mt-1">Expandable shareholder brief and digital dynamic PDF downloads.</p>
                    </button>
                    <button onClick={() => navigateTo('governance')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Governance & Committees</h4>
                      <p className="text-xs text-slate-500 mt-1">Interactive org chart of board members and risk structures.</p>
                    </button>
                    <button onClick={() => navigateTo('awards')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Awards & Timeline</h4>
                      <p className="text-xs text-slate-500 mt-1">Global Banker of the Year and tech leadership credentials.</p>
                    </button>
                  </div>
                </>
              )}

              {activeMegaMenu === 'strategy' && (
                <>
                  <div>
                    <h3 className="text-ceo-gold font-serif text-sm tracking-wider uppercase mb-4">Vision & Tactics</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      How Surya Bank designs future payment networks, coordinates global trade finance, and builds inclusive structures.
                    </p>
                    <button 
                      onClick={() => navigateTo('vision')}
                      className="text-xs font-bold text-white hover:text-ceo-gold transition-colors flex items-center gap-1"
                    >
                      View Vision Priorities →
                    </button>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <button onClick={() => navigateTo('vision')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">8 Vision Cards</h4>
                      <p className="text-xs text-slate-500 mt-1">Deep-dive details on AI systems, global finance, inclusion.</p>
                    </button>
                    <button onClick={() => navigateTo('strategy')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Strategy Dashboard</h4>
                      <p className="text-xs text-slate-500 mt-1">Retail, corporate and asset management growth stats with charts.</p>
                    </button>
                    <button onClick={() => navigateTo('innovation')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Innovation Center</h4>
                      <p className="text-xs text-slate-500 mt-1">Interactive cryptographic nodes, Open APIs, fraud detectors.</p>
                    </button>
                    <button onClick={() => navigateTo('esg')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">ESG Carbon Dashboard</h4>
                      <p className="text-xs text-slate-500 mt-1">Dynamic data charts on women leadership and environment.</p>
                    </button>
                  </div>
                </>
              )}

              {activeMegaMenu === 'stakeholders' && (
                <>
                  <div>
                    <h3 className="text-ceo-gold font-serif text-sm tracking-wider uppercase mb-4">Media & Relations</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Financial audit reports, earnings schedules, speech scripts, and official photographic archives.
                    </p>
                    <button 
                      onClick={() => navigateTo('investors')}
                      className="text-xs font-bold text-white hover:text-ceo-gold transition-colors flex items-center gap-1"
                    >
                      Investor Portal →
                    </button>
                  </div>
                  <div className="col-span-2 grid grid-cols-3 gap-4">
                    <button onClick={() => navigateTo('investors')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Investor Portal</h4>
                      <p className="text-xs text-slate-500 mt-1">Stock performance & quarterly reports.</p>
                    </button>
                    <button onClick={() => navigateTo('media')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Media Center</h4>
                      <p className="text-xs text-slate-500 mt-1">Speeches transcripts & news search.</p>
                    </button>
                    <button onClick={() => navigateTo('events')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Upcoming Events</h4>
                      <p className="text-xs text-slate-500 mt-1">Quarterly earnings & schedules.</p>
                    </button>
                    <button onClick={() => navigateTo('publications')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Publications</h4>
                      <p className="text-xs text-slate-500 mt-1">Whitepapers & research library.</p>
                    </button>
                    <button onClick={() => navigateTo('gallery')} className="text-left p-3 rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all">
                      <h4 className="font-semibold text-sm text-white">Media Gallery</h4>
                      <p className="text-xs text-slate-500 mt-1">Press imagery lightbox viewer.</p>
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}
      </header>

      {/* Mobile Slide-Out Navigation Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[998] lg:hidden flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-slate-900 text-white p-6 flex flex-col h-full overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between mb-8">
              <span className="font-serif text-lg text-ceo-gold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 text-lg">
              <button onClick={() => navigateTo('home')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Home</button>
              <button onClick={() => navigateTo('about')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Biography</button>
              <button onClick={() => navigateTo('message')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Chairman's Letter</button>
              <button onClick={() => navigateTo('vision')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Vision</button>
              <button onClick={() => navigateTo('strategy')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Strategy</button>
              <button onClick={() => navigateTo('innovation')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Innovation Center</button>
              <button onClick={() => navigateTo('esg')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">ESG</button>
              <button onClick={() => navigateTo('governance')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Governance</button>
              <button onClick={() => navigateTo('investors')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Investor Relations</button>
              <button onClick={() => navigateTo('media')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Media Center</button>
              <button onClick={() => navigateTo('publications')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Publications</button>
              <button onClick={() => navigateTo('awards')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Awards</button>
              <button onClick={() => navigateTo('events')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Events</button>
              <button onClick={() => navigateTo('gallery')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Gallery</button>
              <button onClick={() => navigateTo('contact')} className="text-left hover:text-ceo-gold py-2 border-b border-slate-850">Contact Office</button>
              <button onClick={() => navigateTo('admin')} className="text-left text-red-400 hover:text-red-300 py-2 flex items-center gap-2">
                <Shield size={16} /> Admin Portal
              </button>
              {(role === 'CEO' || role === 'Executive Assistant') && (
                <button onClick={() => navigateTo('command-center')} className="text-left text-ceo-gold hover:text-yellow-400 py-2 flex items-center gap-2 font-bold border-t border-slate-850 pt-4 mt-2">
                  <Command size={16} /> Master Command Center
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Trail */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        <div className="flex items-center gap-2">
          <Link to="/ceo" className="hover:text-ceo-gold transition-colors">Executive</Link>
          <span>/</span>
          <span className="text-ceo-gold font-semibold">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Main Pages Outlet */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Floating Executive Edit Mode Toggle (CEO ONLY) */}
      {role === 'CEO' && (
        <div className="fixed bottom-6 right-6 z-[10000]">
          <button
            onClick={toggleEditMode}
            className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 font-bold border ${
              isEditMode 
                ? 'bg-rose-600 text-white border-rose-500 hover:bg-rose-700 animate-pulse' 
                : 'bg-ceo-gold text-ceo-navy border-yellow-400 hover:scale-105'
            }`}
          >
            {isEditMode ? (
              <>
                <XCircle size={18} />
                <span className="text-sm">Exit CMS</span>
              </>
            ) : (
              <>
                <Pencil size={18} />
                <span className="text-sm">Executive Edit Mode</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className={`border-t mt-16 transition-colors ${
        darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-ceo-gold flex items-center justify-center font-bold text-ceo-navy">S</div>
                <span className="font-serif text-white font-semibold tracking-wider">Surya Bank</span>
              </div>
              <p className="text-xs leading-relaxed">
                Office of the CEO, Chairman & Founder. Coordinating financial integrity, technical advancements, and global ESG commitments across commercial channels.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-200 uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigateTo('about')} className="hover:text-ceo-gold">Biography</button></li>
                <li><button onClick={() => navigateTo('message')} className="hover:text-ceo-gold">Chairman's Letter</button></li>
                <li><button onClick={() => navigateTo('vision')} className="hover:text-ceo-gold">Vision</button></li>
                <li><button onClick={() => navigateTo('strategy')} className="hover:text-ceo-gold">Banking Strategy</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-200 uppercase tracking-wider mb-4">Stakeholders</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigateTo('investors')} className="hover:text-ceo-gold">Investor Center</button></li>
                <li><button onClick={() => navigateTo('publications')} className="hover:text-ceo-gold">Whitepapers & Research</button></li>
                <li><button onClick={() => navigateTo('esg')} className="hover:text-ceo-gold">Sustainability Reports</button></li>
                <li><button onClick={() => navigateTo('governance')} className="hover:text-ceo-gold">Governance Principles</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-200 uppercase tracking-wider mb-4">Accessibility & Contact</h4>
              <p className="text-xs leading-relaxed mb-2">
                Corporate HQ: Level 42, Surya Financial Center, Bengaluru.
              </p>
              <p className="text-xs">
                Email: <a href="mailto:ceo.office@suryabank.com" className="hover:text-ceo-gold">ceo.office@suryabank.com</a>
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded">WCAG AA Compliant</span>
                <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded">SSL Secure</span>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500">
            <p>&copy; {new Date().getFullYear()} Surya Bank Group. All Rights Reserved. Private & Confidential.</p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Use</span>
              <span className="hover:text-white cursor-pointer">Site Map</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Command Palette Overlay */}
      <CeoCommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Back to top button */}
      {showScrollTop && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            addToast("Scrolled to Top", "info");
          }}
          className="fixed bottom-6 right-6 z-[999] bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy p-3 rounded-full shadow-2xl transition-all hover:scale-105"
          title={t.backToTop}
        >
          <ArrowUp size={20} />
        </button>
      )}

    </div>
  );
};

export default CeoLayout;
