import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Bell, CheckCircle, Info, Clock, Download } from 'lucide-react';
import Button from '../ui/Button';
import CustomerAnnouncementBanner from '../shared/CustomerAnnouncementBanner';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isBranchOpen, setIsBranchOpen] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const notifRef = useRef(null);
  const location = useLocation();

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole') || 'customer';

  let dashboardPath = '/dashboard';
  let dashboardLabel = 'Dashboard';
  if (userRole === 'admin') {
    dashboardPath = '/admin';
    dashboardLabel = 'Admin Portal';
  } else if (userRole === 'employee') {
    dashboardPath = '/employee';
    dashboardLabel = 'Employee Portal';
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    // Fetch notifications from Firestore
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = [];
      snapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(notifs);
    }, (error) => {
      console.error("Failed to fetch notifications from Firestore:", error);
    });
    
    // Fetch branch status
    const branchStatusRef = doc(db, 'settings', 'branch_status');
    const unsubscribeBranch = onSnapshot(branchStatusRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsBranchOpen(docSnap.data().isOpen);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      unsubscribe();
      unsubscribeBranch();
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const notifRef = doc(db, 'notifications', id);
      await updateDoc(notifRef, { is_read: true });
      // The local state will update automatically via onSnapshot
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    setSelectedNotification(notif);
    setNotificationsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Check if it's a page with a light background at the top (Dashboard, AuthPage, etc.)
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin') || (location.pathname.includes('/employee') && !location.pathname.includes('/employee-login'));
  const hasLightBg = isDashboard || location.pathname.includes('/auth');
  const isDarkBg = !hasLightBg && !isScrolled;

  return (
    <>
    <div className="print:hidden">
      <CustomerAnnouncementBanner />
    </div>
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 print:hidden ${isScrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Surya Bank Logo" className="h-8 w-auto object-contain" />
          <span className="font-heading text-2xl font-bold text-white tracking-tight">Surya<span className="text-primary-gold">Bank</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-primary-gold transition-colors">Home</Link>
          <Link to="/services" className="text-sm font-medium text-slate-300 hover:text-primary-gold transition-colors">Services</Link>
          <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-primary-gold transition-colors">About Us</Link>
          {isAuthenticated && userRole !== 'employee' && <Link to={dashboardPath} className="text-sm font-medium text-slate-300 hover:text-primary-gold transition-colors">{dashboardLabel}</Link>}
          {isInstallable && (
            <button onClick={handleInstallClick} className="text-sm font-bold text-primary-gold flex items-center hover:text-white transition-colors">
              <Download size={16} className="mr-1" /> Install App
            </button>
          )}
          <div className={`ml-4 px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${isBranchOpen ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isBranchOpen ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse' : 'bg-red-500 dark:bg-red-400'}`}></span>
            Branch: {isBranchOpen ? 'OPEN' : 'CLOSED'}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="relative" ref={notifRef}>
            <button 
              className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={20} className="text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/50 dark:border-slate-700/50 overflow-hidden z-50 transform origin-top-right transition-all duration-300">
                <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white m-0 flex items-center">
                    <Bell size={16} className="mr-2 text-surya-primary" /> Notifications
                  </h3>
                  {unreadCount > 0 && <span className="bg-surya-primary text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">{unreadCount} New</span>}
                </div>
                <div className="max-h-[26rem] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                        <Bell size={24} className="text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="text-slate-500 font-medium text-sm">No new notifications</p>
                      <p className="text-slate-400 text-xs mt-1">You're all caught up!</p>
                    </div>
                  ) : (
                    notifications.map(notif => {
                      const dateObj = new Date(notif.timestamp || notif.created_at);
                      const isValidDate = !isNaN(dateObj.getTime());
                      
                      return (
                        <div 
                          key={notif.id} 
                          className={`p-4 border-b border-slate-100/50 dark:border-slate-700/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 cursor-pointer transition-colors duration-200 ${!notif.is_read ? 'bg-blue-50/40 dark:bg-blue-900/10 relative overflow-hidden' : ''}`}
                          onClick={() => handleNotificationClick(notif)}
                        >
                          {!notif.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-surya-primary"></div>}
                          <div className="flex items-start">
                            <div className={`mt-1 mr-3 p-2 rounded-full ${notif.type?.includes('Maintenance') ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                              {notif.type?.includes('Maintenance') ? <Info size={16} /> : <CheckCircle size={16} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm ${!notif.is_read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                  {notif.title || 'System Update'}
                                </h4>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notif.description}</p>
                              {isValidDate && (
                                <span className="text-[10px] font-medium text-slate-400 mt-2 block">
                                  {dateObj.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200/50 dark:border-slate-700/50 text-center">
                    <button className="text-xs font-semibold text-surya-primary hover:text-surya-primary/80 transition-colors">
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {isAuthenticated ? (
            <button className="px-5 py-2 rounded-full border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-colors" onClick={handleLogout}>Logout</button>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <button className="px-5 py-2 rounded-full border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-colors">Login</button>
              </Link>
              <Link to="/account-opening-form">
                <button className="px-5 py-2 rounded-full bg-gradient-to-r from-primary-gold to-yellow-500 text-bg-primary text-sm font-bold hover:shadow-lg hover:shadow-primary-gold/30 transition-all transform hover:-translate-y-0.5">Open Account</button>
              </Link>
            </div>
          )}
        </div>

        <button 
          className="mobile-menu-btn mobile-only" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass">
          <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/services" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link to="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          {isAuthenticated && userRole !== 'employee' && <Link to={dashboardPath} className="mobile-link" onClick={() => setMobileMenuOpen(false)}>{dashboardLabel}</Link>}
          {isInstallable && (
            <button onClick={() => { setMobileMenuOpen(false); handleInstallClick(); }} className="mobile-link text-surya-primary flex items-center w-full text-left font-bold">
              <Download size={18} className="mr-2" /> Install Surya Bank App
            </button>
          )}
          <div className="mobile-actions">
            {isAuthenticated ? (
              <Button variant="outline" className="w-full mb-2" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>Logout</Button>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full mb-2">Login</Button>
                </Link>
                <Link to="/account-opening-form" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Open Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Notification Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedNotification(null)}>
          <div 
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform scale-100 transition-transform flex flex-col max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 md:p-8 border-b flex-shrink-0 ${selectedNotification.type?.includes('Maintenance') ? 'border-amber-100 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/10' : 'border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${selectedNotification.type?.includes('Maintenance') ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'}`}>
                  {selectedNotification.type?.includes('Maintenance') ? <Info size={14} className="mr-1.5" /> : <CheckCircle size={14} className="mr-1.5" />}
                  {selectedNotification.type || 'Notification'}
                </div>
                <button onClick={() => setSelectedNotification(null)} className="p-2 bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedNotification.title}</h2>
              {(!isNaN(new Date(selectedNotification.timestamp || selectedNotification.created_at).getTime())) && (
                <p className="text-sm text-slate-500 font-medium flex items-center">
                  <Clock size={14} className="mr-1.5" />
                  {new Date(selectedNotification.timestamp || selectedNotification.created_at).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            <div className="p-6 md:p-8 bg-white dark:bg-slate-800 overflow-y-auto custom-scrollbar flex-grow">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
                  {selectedNotification.description}
                </p>
              </div>
              <div className="mt-8 flex justify-end flex-shrink-0">
                <Button variant="primary" onClick={() => setSelectedNotification(null)} className="px-6 rounded-xl">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
