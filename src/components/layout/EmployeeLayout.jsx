import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserPlus, FileText, CreditCard, 
  Briefcase, Building, Settings, LogOut, Menu, Search, 
  Bell, Moon, Sun, X, UserCheck
} from 'lucide-react';
import { applyPendingUpdates } from '../../services/api';

const SIDEBAR_MENU = [
  {
    title: 'Dashboard',
    items: [
      { name: 'Overview', path: '/employee', icon: LayoutDashboard },
      { name: 'Analytics', path: '/employee/analytics', icon: FileText },
    ]
  },
  {
    title: 'Customer Management',
    items: [
      { name: 'Search Customer', path: '/employee/customers', icon: Search },
      { name: 'Open Account', path: '/employee/open-account', icon: UserPlus },
      { name: 'Download Forms', path: '/employee/download-form', icon: FileText },
    ]
  },
  {
    title: 'Loan Management',
    items: [
      { name: 'Loan Approval', path: '/employee/loans', icon: Briefcase },
    ]
  },
  {
    title: 'Settings',
    items: [
      { name: 'Profile', path: '/employee/profile', icon: Settings },
      { name: 'Mark Attendance', path: '/employee/attendance', icon: UserCheck },
    ]
  }
];

const EmployeeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Loan Request', desc: 'Ramesh Kumar applied for a Home Loan', time: '2m ago', unread: true },
    { id: 2, title: 'System Update', desc: 'Server maintenance scheduled for 2 AM', time: '1h ago', unread: true },
    { id: 3, title: 'Account Approved', desc: 'Priya Patel savings account approved', time: '3h ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Check and apply any pending customer profile updates silently
    applyPendingUpdates().catch(err => console.error('Error applying pending updates:', err));
  }, [location.pathname]);

  useEffect(() => {
    // Check local storage for dark mode preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      navigate('/employee-login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden bg-surya-bgLight dark:bg-surya-bgDark text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surya-surfaceDark border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
          <span className="text-2xl font-bold text-surya-primary dark:text-surya-secondary">Surya Bank</span>
          <button className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {SIDEBAR_MENU.map((section, index) => (
            <div key={index} className="mb-6 px-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{section.title}</h3>
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.path || (location.pathname === '/employee' && item.path === '/employee');
                  return (
                    <li key={itemIndex}>
                      <button 
                        onClick={() => { navigate(item.path); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-surya-primary text-white dark:bg-surya-secondary dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                      >
                        <item.icon size={18} className={`mr-3 ${isActive ? 'text-white dark:text-slate-900' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                        {item.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-sm font-medium text-surya-danger rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-surya-surfaceDark border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center flex-1">
            <button className="md:hidden mr-4 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search customers, accounts..." 
                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-surya-primary dark:focus:ring-surya-secondary focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-surya-danger"></span>
                )}
              </button>
              
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                    <span onClick={handleMarkAllAsRead} className="text-xs text-surya-primary dark:text-surya-secondary cursor-pointer hover:underline">Mark all as read</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => handleNotificationClick(notif.id)}
                        className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${notif.unread ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className={`text-sm font-medium ${notif.unread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{notif.title}</p>
                          {notif.unread && <span className="w-2 h-2 rounded-full bg-surya-primary mt-1 shrink-0 ml-2"></span>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.desc}</p>
                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-slate-100 dark:border-slate-700">
                    <button 
                      onClick={() => { setIsNotificationOpen(false); navigate('/employee/notifications'); }}
                      className="text-sm text-surya-primary dark:text-surya-secondary hover:underline font-medium w-full"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full bg-surya-primary text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-surya-primary dark:hover:ring-offset-slate-900 transition-all"
              >
                E
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Employee User</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">employee@suryabank.com</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => { setIsProfileOpen(false); navigate('/employee/profile'); }} className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Settings size={16} className="mr-2" />
                      Profile Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                    <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-sm text-surya-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeLayout;
