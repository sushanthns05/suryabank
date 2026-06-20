import React from 'react';
import { Clock, Bell, FileText, CheckCircle, Info } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New Loan Request', desc: 'Ramesh Kumar applied for a Home Loan of ₹45 Lakhs. Requires immediate review.', time: '2m ago', type: 'loan', read: false },
  { id: 2, title: 'System Update', desc: 'Server maintenance scheduled for 2 AM on Sunday. Expected downtime: 15 mins.', time: '1h ago', type: 'system', read: false },
  { id: 3, title: 'Account Approved', desc: 'Priya Patel savings account approved successfully by Admin.', time: '3h ago', type: 'success', read: true },
  { id: 4, title: 'Suspicious Activity', desc: 'Multiple failed login attempts on Account #7829.', time: '1d ago', type: 'alert', read: true },
  { id: 5, title: 'Branch Meeting', desc: 'Monthly branch performance review at 4 PM tomorrow.', time: '1d ago', type: 'info', read: true }
];

const getIcon = (type) => {
  switch (type) {
    case 'loan': return <FileText size={20} className="text-blue-500" />;
    case 'system': return <Info size={20} className="text-slate-500" />;
    case 'success': return <CheckCircle size={20} className="text-green-500" />;
    case 'alert': return <Bell size={20} className="text-red-500" />;
    default: return <Bell size={20} className="text-surya-primary" />;
  }
};

const EmployeeNotifications = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">All Notifications</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View and manage your recent alerts and updates.</p>
      </div>
      
      <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex space-x-4 text-sm font-medium">
            <button className="text-surya-primary dark:text-surya-secondary border-b-2 border-surya-primary dark:border-surya-secondary pb-1">All</button>
            <button className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">Unread</button>
          </div>
          <button className="text-sm text-surya-primary dark:text-surya-secondary hover:underline font-medium">Mark all as read</button>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <div key={notif.id} className={`p-5 flex items-start hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30 dark:bg-slate-800/20' : ''}`}>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full mr-4 shrink-0 mt-1">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-base font-bold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {notif.title}
                  </h4>
                  <div className="flex items-center text-xs text-slate-400">
                    <Clock size={14} className="mr-1" />
                    {notif.time}
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notif.desc}</p>
              </div>
              {!notif.read && (
                <div className="ml-4 shrink-0 mt-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-surya-primary"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeNotifications;
