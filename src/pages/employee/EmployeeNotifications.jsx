import React, { useState } from 'react';
import { Clock, Bell, FileText, Crown, AlertTriangle, Info } from 'lucide-react';
import { useCeoDirectives } from '../../hooks/useCeoDirectives';

const getIcon = (type, priority) => {
  if (priority === 'critical') return <AlertTriangle size={20} className="text-red-500" />;
  switch (type) {
    case 'task': return <FileText size={20} className="text-blue-500" />;
    case 'announcement': return <Info size={20} className="text-slate-500" />;
    case 'broadcast': return <Bell size={20} className="text-surya-primary" />;
    default: return <Crown size={20} className="text-surya-primary" />;
  }
};

const formatTimeAgo = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins || 1}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const EmployeeNotifications = () => {
  const { directives, loading } = useCeoDirectives('employees');
  const [filter, setFilter] = useState('all');
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('employee_read_directives') || '[]');
    } catch {
      return [];
    }
  });

  const notifications = directives.map((d) => ({
    id: d.id,
    title: d.title,
    desc: d.message,
    time: formatTimeAgo(d.timestamp),
    type: d.type,
    priority: d.priority,
    author: d.author,
    read: readIds.includes(d.id),
  }));

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAsRead = (id) => {
    if (readIds.includes(id)) return;
    const updated = [...readIds, id];
    setReadIds(updated);
    localStorage.setItem('employee_read_directives', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem('employee_read_directives', JSON.stringify(allIds));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          All Notifications
          {unreadCount > 0 && (
            <span className="bg-surya-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {unreadCount} New
            </span>
          )}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Live directives from the CEO Office and executive broadcasts.
        </p>
      </div>
      
      <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex space-x-4 text-sm font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`pb-1 ${filter === 'all' ? 'text-surya-primary dark:text-surya-secondary border-b-2 border-surya-primary dark:border-surya-secondary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`pb-1 flex items-center gap-1.5 ${filter === 'unread' ? 'text-surya-primary dark:text-surya-secondary border-b-2 border-surya-primary dark:border-surya-secondary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="bg-surya-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
          </div>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-sm text-surya-primary dark:text-surya-secondary hover:underline font-medium disabled:opacity-40 disabled:no-underline"
          >
            Mark all as read
          </button>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800 min-h-[300px]">
          {loading ? (
            <div className="p-16 text-center text-slate-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-surya-primary mx-auto mb-4"></div>
              Loading directives...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <Crown size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <p className="font-medium text-slate-600 dark:text-slate-400">No {filter === 'unread' ? 'unread ' : ''}directives</p>
              <p className="text-sm mt-1">CEO Office broadcasts will appear here.</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-5 flex items-start hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30 dark:bg-slate-800/20' : ''} ${notif.priority === 'critical' && !notif.read ? 'border-l-4 border-l-red-500' : !notif.read ? 'border-l-4 border-l-surya-primary' : ''}`}
              >
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full mr-4 shrink-0 mt-1">
                  {getIcon(notif.type, notif.priority)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className={`text-base font-bold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </h4>
                    <div className="flex items-center text-xs text-slate-400 shrink-0">
                      <Clock size={14} className="mr-1" />
                      {notif.time}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">{notif.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">{notif.author}</p>
                </div>
                {!notif.read && (
                  <div className="ml-4 shrink-0 mt-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-surya-primary"></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeNotifications;
