import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Users, FileText, CreditCard, 
  Briefcase, Settings, LogOut, Menu, Search, ShieldCheck,
  Bell, Moon, Sun, X, MessageSquare, ClipboardList, UserCheck
} from 'lucide-react';

const SIDEBAR_MENU = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', path: '/manager', icon: LayoutDashboard },
      { name: 'Branch Management', path: '/manager/branches', icon: Building2 },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Customers', path: '/manager/customers', icon: Users },
      { name: 'Loans', path: '/manager/loans', icon: Briefcase },
      { name: 'Employees', path: '/manager/employees', icon: UserCheck },
      { name: 'Attendance', path: '/manager/attendance', icon: ClipboardList },
      { name: 'Transactions', path: '/manager/transactions', icon: CreditCard },
    ]
  },
  {
    title: 'Oversight',
    items: [
      { name: 'Reports', path: '/manager/reports', icon: FileText },
      { name: 'Audit & Compliance', path: '/manager/audit', icon: ShieldCheck },
    ]
  },
  {
    title: 'Communication',
    items: [
      { name: 'Messages', path: '/manager/communication', icon: MessageSquare },
      { name: 'Notifications', path: '/manager/notifications', icon: Bell },
    ]
  },
  {
    title: 'Settings',
    items: [
      { name: 'System Settings', path: '/manager/settings', icon: Settings },
    ]
  }
];

const ManagerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default dark mode for premium feel
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // Authentication Check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('managerAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/manager-login');
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (localStorage.managerTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.managerTheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.managerTheme = 'light';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('managerAuthenticated');
    localStorage.removeItem('managerRole');
    localStorage.removeItem('managerBranch');
    navigate('/manager-login');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#0F172A] text-slate-200' : 'bg-[#F8FAFC] text-slate-800'} transition-colors duration-300`}>
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200'} border-r transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-inherit">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Surya Bank Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#F59E0B] to-yellow-500 bg-clip-text text-transparent">Surya Bank</span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-slate-200" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {SIDEBAR_MENU.map((section, index) => (
            <div key={index} className="mb-6 px-4">
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{section.title}</h3>
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.path || (location.pathname === '/manager' && item.path === '/manager');
                  return (
                    <li key={itemIndex}>
                      <button 
                        onClick={() => { navigate(item.path); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-[#F59E0B]/20 to-transparent text-[#F59E0B] border-l-2 border-[#F59E0B]' : isDarkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent' : 'text-slate-600 hover:bg-slate-100 border-l-2 border-transparent'}`}
                      >
                        <item.icon size={18} className={`mr-3 ${isActive ? 'text-[#F59E0B]' : 'opacity-70'}`} />
                        {item.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-inherit">
          <button onClick={handleLogout} className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className={`h-16 flex items-center justify-between px-4 sm:px-6 ${isDarkMode ? 'bg-[#1E293B]/80 border-[#334155]' : 'bg-white/80 border-slate-200'} border-b backdrop-blur-md sticky top-0 z-40`}>
          <div className="flex items-center flex-1">
            <button className="md:hidden mr-4 text-slate-400 hover:text-slate-200" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search global records..." 
                className={`w-full pl-10 pr-4 py-2 rounded-full border-transparent focus:ring-2 focus:ring-[#F59E0B] outline-none transition-all text-sm ${isDarkMode ? 'bg-[#0F172A] focus:bg-[#0F172A]' : 'bg-slate-100 focus:bg-white'}`}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-400 hover:bg-slate-800 transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F59E0B] to-yellow-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  M
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold">Admin User</p>
                  <p className="text-[10px] text-[#F59E0B]">{localStorage.getItem('managerRole') || 'Manager'}</p>
                </div>
              </button>
              
              {isProfileOpen && (
                <div className={`absolute right-0 mt-2 w-48 border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200'}`}>
                  <div className="p-2 border-b border-inherit">
                    <button onClick={() => { setIsProfileOpen(false); navigate('/manager/profile'); }} className="w-full flex items-center px-3 py-2 text-sm hover:bg-[#0F172A]/50 rounded-lg transition-colors">
                      <Settings size={16} className="mr-2" />
                      Profile Settings
                    </button>
                  </div>
                  <div className="p-2">
                    <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative z-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ManagerLayout;
