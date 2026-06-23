import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, AlertTriangle, FileText, Settings, 
  MessageSquare, Circle, CheckCheck, Trash2, Clock
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'alert',
    title: 'High-Value Transfer Flagged',
    message: 'An outward RTGS transfer of ₹15,00,000 on Account 948201847563 has been paused for manager verification.',
    time: '10 mins ago',
    unread: true,
  },
  {
    id: 2,
    type: 'task',
    title: 'Pending Loan Approval',
    message: 'Loan Application L-1045 has passed Level 1 Employee Verification and is awaiting your final signature.',
    time: '45 mins ago',
    unread: true,
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message from Head Office',
    message: 'Please submit the monthly branch performance audit by Friday COB.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 4,
    type: 'system',
    title: 'Server Maintenance Scheduled',
    message: 'Surya Bank core banking servers will undergo maintenance on Sunday from 02:00 AM to 04:00 AM.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 5,
    type: 'task',
    title: 'Customer KYC Expiring',
    message: '3 High-Net-Worth individuals require KYC renewal within the next 7 days. Please assign an officer.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 6,
    type: 'alert',
    title: 'Multiple Failed Logins',
    message: 'Employee ID EMP-102 has locked their account after 5 failed login attempts.',
    time: '2 days ago',
    unread: false,
  }
];

const ManagerNotifications = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all'); // 'all', 'unread'

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;
  
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    return true;
  });

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertTriangle size={20} className="text-red-500" />;
      case 'task': return <FileText size={20} className="text-[#F59E0B]" />;
      case 'system': return <Settings size={20} className="text-blue-500" />;
      case 'message': return <MessageSquare size={20} className="text-emerald-500" />;
      default: return <Bell size={20} className="text-slate-400" />;
    }
  };

  const getBgColor = (type, unread) => {
    if (!unread) return 'bg-[#1E293B]/40 border-slate-700/30'; // Read state
    
    switch(type) {
      case 'alert': return 'bg-red-500/10 border-red-500/30';
      case 'task': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'system': return 'bg-blue-500/10 border-blue-500/30';
      case 'message': return 'bg-emerald-500/10 border-emerald-500/30';
      default: return 'bg-[#1E293B] border-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            Notification Center
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/20">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your branch alerts and system updates.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${unreadCount > 0 ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-[#0F172A] text-slate-500 cursor-not-allowed border border-slate-700/50'}`}
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
          <button 
            onClick={clearAll}
            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-700/50 bg-[#0F172A]/80">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-4 text-sm font-bold transition-all relative ${filter === 'all' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
          >
            All Notifications
            {filter === 'all' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F59E0B]"></span>}
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`px-6 py-4 text-sm font-bold transition-all relative flex items-center gap-2 ${filter === 'unread' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Unread
            {unreadCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'unread' ? 'bg-[#F59E0B] text-white' : 'bg-slate-700 text-slate-300'}`}>
                {unreadCount}
              </span>
            )}
            {filter === 'unread' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F59E0B]"></span>}
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-700/50 min-h-[400px]">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-16 text-slate-500 opacity-60">
              <Bell size={64} className="mb-4 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-400">You're all caught up!</h2>
              <p className="mt-1">There are no {filter === 'unread' ? 'unread ' : ''}notifications to display.</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                onClick={() => notification.unread && markAsRead(notification.id)}
                className={`p-5 flex gap-4 transition-all duration-300 cursor-pointer ${notification.unread ? 'hover:bg-[#0F172A]/50' : ''} ${getBgColor(notification.type, notification.unread)} border-l-4 ${notification.unread ? 'border-l-[#F59E0B]' : 'border-l-transparent'}`}
              >
                <div className="mt-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#0F172A] border ${notification.unread ? 'border-slate-600 shadow-lg' : 'border-slate-700/50 opacity-60'}`}>
                    {getIcon(notification.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`font-bold truncate ${notification.unread ? 'text-white' : 'text-slate-400'}`}>
                      {notification.title}
                    </h3>
                    <span className="flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap shrink-0 mt-0.5">
                      <Clock size={12} /> {notification.time}
                    </span>
                  </div>
                  
                  <p className={`mt-1 text-sm ${notification.unread ? 'text-slate-300' : 'text-slate-500'} line-clamp-2`}>
                    {notification.message}
                  </p>
                  
                  {notification.unread && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] flex items-center gap-1">
                        <Circle size={8} fill="currentColor" /> Click to mark as read
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerNotifications;
