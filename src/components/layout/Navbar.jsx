import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Bell, CheckCircle, Info } from 'lucide-react';
import Button from '../ui/Button';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
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
    
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const backendUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:5000' 
          : 'https://suryabank.onrender.com';
        const res = await fetch(`${backendUrl}/api/notifications`);
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    
    fetchNotifications();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://suryabank.onrender.com';
      await fetch(`${backendUrl}/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Check if it's a page with a light background at the top (Dashboard, AuthPage, etc.)
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin') || (location.pathname.includes('/employee') && !location.pathname.includes('/employee-login'));
  const hasLightBg = isDashboard || location.pathname.includes('/auth');
  const isDarkBg = !hasLightBg && !isScrolled;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass' : ''} ${isDarkBg ? 'navbar-dark' : ''}`}>
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="Surya Bank Logo" className="navbar-logo" />
          <span className="brand-text">Surya<span className="brand-accent">Bank</span></span>
        </Link>

        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          {isAuthenticated && userRole !== 'employee' && <Link to={dashboardPath} className="nav-link">{dashboardLabel}</Link>}
        </div>

        <div className="navbar-actions desktop-only flex items-center">
          <div className="relative mr-4" ref={notifRef}>
            <button 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={20} className={isDarkBg ? 'text-white' : 'text-slate-700'} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white m-0">Notifications</h3>
                  {unreadCount > 0 && <span className="bg-surya-primary text-white text-xs px-2 py-1 rounded-full">{unreadCount} New</span>}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${!notif.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onClick={() => !notif.is_read && markAsRead(notif.id)}
                      >
                        <div className="flex items-start">
                          <div className={`mt-1 mr-3 ${notif.type === 'Maintenance' ? 'text-amber-500' : 'text-blue-500'}`}>
                            {notif.type === 'Maintenance' ? <Info size={18} /> : <CheckCircle size={18} />}
                          </div>
                          <div>
                            <h4 className={`text-sm mb-1 ${!notif.is_read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                              {notif.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2">{notif.description}</p>
                            <span className="text-[10px] text-slate-400 mt-2 block">
                              {new Date(notif.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          {isAuthenticated ? (
            <Button variant="outline" className="login-btn" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" className="login-btn">Login</Button>
              </Link>
              <Link to="/auth">
                <Button variant="primary">Open Account</Button>
              </Link>
            </>
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
          <div className="mobile-actions">
            {isAuthenticated ? (
              <Button variant="outline" className="w-full mb-2" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>Logout</Button>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full mb-2">Login</Button>
                </Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Open Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
