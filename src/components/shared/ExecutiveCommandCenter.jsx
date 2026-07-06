import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCeoDirectives } from '../../hooks/useCeoDirectives';
import { 
  Crown, Megaphone, CheckCircle, Clock, ShieldAlert, Sparkles, 
  CalendarDays, Paperclip, MessageSquare, AlertCircle,
  FileText, CheckCircle2, RefreshCw, Briefcase,
  Search, Filter, Mic, Send, Zap, ChevronDown, Activity, User, Target, ChevronRight
} from 'lucide-react';

const PORTAL_AUDIENCES = {
  managers: ['managers', 'all_staff'],
  employees: ['employees', 'all_staff']
};

const ExecutiveCommandCenter = ({ portal = 'managers', role = 'Manager' }) => {
  const [ceoTasks, setCeoTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { directives } = useCeoDirectives(portal, { limit: 5 });
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString());
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const fileInputRef = useRef(null);

  // New states for interactive components
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [taskComments, setTaskComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Simulated successful upload of: ${file.name}`);
    }
  };

  const handleAiSubmit = (queryText) => {
    if (!queryText.trim()) return;
    
    setAiChat(prev => [...prev, { role: 'user', text: queryText }]);
    setAiQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      let responseText = "I've analyzed your request and updated your workspace. Is there anything else you need?";
      const q = queryText.toLowerCase();
      if (q.includes('urgent')) {
        const urgentCount = ceoTasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length;
        responseText = `You currently have ${urgentCount} urgent tasks pending. Let me know if you want me to prioritize them for you.`;
      } else if (q.includes('report')) {
        responseText = `I'm compiling your branch performance and task completion metrics. The report will be ready in a few moments. Would you like me to email it directly to the regional director?`;
      } else if (q.includes('hello') || q.includes('hi')) {
        responseText = `Hello! How can I assist you with your tasks today?`;
      } else if (q.includes('schedule') || q.includes('calendar')) {
        responseText = `You have 3 upcoming deadlines this week. I have synced your calendar. Your next meeting is "Q3 Strategy Review" at 2:00 PM tomorrow.`;
      } else if (q.includes('manager') || q.includes('message')) {
        responseText = `I've drafted the following message: "Hi Manager, I've completed 100% of my urgent tasks and am currently wrapping up the remaining items..." Shall I send it?`;
      }

      setAiChat(prev => [...prev, { role: 'ai', text: responseText }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    if (action === 'Mark Attendance') {
      setAttendanceMarked(true);
      return;
    }
    
    // Wire to AI Assistant
    const aiQueries = {
      'Generate Report': 'Please generate a comprehensive progress report for my current tasks.',
      'Open Calendar': 'Show me my schedule and upcoming deadlines for the week.',
      'Message Manager': 'Draft a message to my manager regarding my task progress.'
    };
    
    if (aiQueries[action]) {
      handleAiSubmit(aiQueries[action]);
    }
  };

  const handleAddComment = (taskId) => {
    if (!newComment.trim()) return;
    setTaskComments(prev => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), { text: newComment, time: 'Just now', sender: 'You' }]
    }));
    setNewComment('');
  };

  useEffect(() => {
    const employeeId = localStorage.getItem('employeeId') || '';
    const audiences = PORTAL_AUDIENCES[portal] || [];

    const qTasks = query(collection(db, 'ceo_tasks'), orderBy('timestamp', 'desc'));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.status !== 'archived' && (audiences.includes(data.audience) || data.assignedEmployee === employeeId || data.assignedManager === employeeId || data.department === localStorage.getItem('managerBranch'))) {
          list.push({ id: docSnap.id, ...data });
        }
      });
      setCeoTasks(list);
      setLoadingTasks(false);
      setSyncTime(new Date().toLocaleTimeString());
    });

    return () => unsubTasks();
  }, [portal]);

  const handleUpdateTaskProgress = async (id, currentProgress) => {
    try {
      const newProgress = Math.min((currentProgress || 0) + 25, 100);
      const updates = { progress: newProgress };
      if (newProgress === 100) updates.status = 'Completed';
      else updates.status = 'In Progress';
      
      await updateDoc(doc(db, 'ceo_tasks', id), updates);
    } catch (err) {
      console.error("Failed to update task progress", err);
    }
  };

  const filteredTasks = ceoTasks.filter(task => {
    if (filter !== 'All' && task.status !== filter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const kpiData = {
    total: ceoTasks.length,
    pending: ceoTasks.filter(t => t.status === 'Pending').length,
    inProgress: ceoTasks.filter(t => t.status === 'In Progress').length,
    completed: ceoTasks.filter(t => t.status === 'Completed' || t.status?.includes('Approved')).length,
    urgent: ceoTasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length
  };

  return (
    <div className="mb-8 w-full animate-in fade-in duration-700">
      
      {/* Hidden File Input for Attachments */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      
      {/* Top Header - Executive Office Branding */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-t-2xl border border-slate-700 shadow-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-700 p-[2px] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <Crown className="text-[#D4AF37]" size={28} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D4AF37] tracking-tight">
                Executive Command Center
              </h1>
              <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mt-1 flex items-center gap-2">
                Official Office of the Founder, Chairman & CEO
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 bg-slate-950/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Secure Enterprise Link</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Last Synced: {syncTime}</div>
          </div>
        </div>
      </div>

      {/* Main Command Center Layout */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        
        {/* LEFT PANEL: Dashboard & Tasks (70%) */}
        <div className="lg:w-[70%] flex flex-col gap-6">
          
          {/* KPI Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-indigo-500/50 transition-all group shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform"><Target size={20} /></div>
                <span className="text-2xl font-black text-white">{kpiData.total}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-400">Total Assigned</h3>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-amber-500/50 transition-all group shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform"><Activity size={20} /></div>
                <span className="text-2xl font-black text-white">{kpiData.inProgress}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-400">In Progress</h3>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-red-500/50 transition-all group shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform"><ShieldAlert size={20} /></div>
                <span className="text-2xl font-black text-white">{kpiData.urgent}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-400">Urgent Tasks</h3>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-emerald-500/50 transition-all group shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform"><CheckCircle2 size={20} /></div>
                <span className="text-2xl font-black text-white">{kpiData.completed}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-400">Completed</h3>
            </div>
          </div>

          {/* Task Filters & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/40 p-2 rounded-2xl border border-slate-800">
            <div className="flex gap-2 flex-wrap w-full sm:w-auto p-1">
              {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Premium Task Cards List */}
          <div className="space-y-4">
            {loadingTasks ? (
              <div className="h-48 flex items-center justify-center">
                <RefreshCw className="animate-spin text-indigo-500" size={32} />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-12 text-center">
                <CheckCircle className="mx-auto text-slate-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">No Tasks Found</h3>
                <p className="text-slate-400">You're all caught up with executive directives.</p>
              </div>
            ) : (
              filteredTasks.map(task => {
                const isCompleted = task.status === 'Completed' || task.status?.includes('Approved');
                const progress = task.progress || 0;
                const isCommentsOpen = expandedComments[task.id];
                const isDropdownOpen = activeDropdown === task.id;
                const comments = taskComments[task.id] || [];
                
                return (
                  <div key={task.id} className={`bg-slate-900/80 backdrop-blur-md rounded-2xl border ${isCompleted ? 'border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'border-slate-700/80 shadow-xl'} overflow-hidden group hover:border-[#D4AF37]/40 transition-colors duration-300`}>
                    
                    {/* Card Header */}
                    <div className="px-6 py-4 border-b border-slate-800 flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'}`}>
                            {task.status}
                          </span>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${task.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : task.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                            {task.priority || 'High'} Priority
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(task.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{task.title}</h3>
                        <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-3xl whitespace-pre-wrap">{task.description}</p>
                      </div>
                      
                      {/* Radial Progress / Action Button */}
                      <div className="shrink-0 flex flex-col items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                        {!isCompleted ? (
                          <button 
                            onClick={() => handleUpdateTaskProgress(task.id, task.progress)}
                            className="h-12 px-6 w-full lg:w-auto bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                          >
                            <Zap size={16} /> Update Progress
                          </button>
                        ) : (
                          <div className="h-12 px-6 w-full lg:w-auto bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default">
                            <CheckCircle2 size={18} /> Marked Complete
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Task Timeline & Metadata Footer */}
                    <div className="px-6 py-4 bg-slate-950/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
                          <span className="text-slate-500">Execution Progress</span>
                          <span className={progress === 100 ? 'text-emerald-400' : 'text-indigo-400'}>{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ease-out relative ${progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} style={{ width: `${progress}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_1s_infinite_linear]"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0 relative">
                        <button onClick={handleFileUploadClick} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" title="Upload Attachments"><Paperclip size={18} /></button>
                        <button onClick={() => setExpandedComments(prev => ({...prev, [task.id]: !prev[task.id]}))} className={`p-2 rounded-lg transition-colors ${isCommentsOpen ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`} title="Comments">
                          <MessageSquare size={18} />
                        </button>
                        <div className="relative">
                          <button onClick={() => setActiveDropdown(isDropdownOpen ? null : task.id)} className={`p-2 rounded-lg transition-colors ${isDropdownOpen ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`} title="More Actions">
                            <Activity size={18} />
                          </button>
                          {isDropdownOpen && (
                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-10 animate-in slide-in-from-bottom-2 fade-in">
                              <button onClick={() => { alert('Task Escalated to CEO'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50 font-semibold">Escalate to CEO</button>
                              <button onClick={() => { alert('Extension Requested'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50 font-semibold">Request Extension</button>
                              <button onClick={() => { alert('Task Archived'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors font-bold">Archive Task</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Comments Section */}
                    {isCommentsOpen && (
                      <div className="px-6 py-4 bg-slate-900 border-t border-slate-800/80 animate-in slide-in-from-top-2">
                        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                          {comments.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">No comments yet. Start the discussion.</p>
                          ) : (
                            comments.map((c, i) => (
                              <div key={i} className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-indigo-400">{c.sender}</span>
                                  <span className="text-[10px] text-slate-500">{c.time}</span>
                                </div>
                                <p className="text-sm text-slate-300 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50 inline-block self-start">{c.text}</p>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Type a comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter') handleAddComment(task.id); }}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                          />
                          <button onClick={() => handleAddComment(task.id)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors">Post</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Sidebar Widgets (30%) */}
        <div className="lg:w-[30%] flex flex-col gap-6">
          
          {/* Executive Announcements (Replaces CEO Directive Banner) */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/30 shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-b border-[#D4AF37]/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Megaphone className="text-[#D4AF37]" size={18} />
                <h3 className="font-bold text-[#D4AF37] uppercase tracking-wider text-sm">Announcements</h3>
              </div>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
              </span>
            </div>
            <div className="p-4 flex-1 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {directives.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No recent announcements.</p>
              ) : (
                directives.map(dir => (
                  <div key={dir.id} className="group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1.5 rounded-full ${dir.priority === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-[#D4AF37]'}`}>
                        {dir.priority === 'critical' ? <AlertCircle size={14} /> : <FileText size={14} />}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${dir.priority === 'critical' ? 'text-red-400' : 'text-slate-200'} group-hover:text-indigo-400 transition-colors`}>{dir.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{dir.message}</p>
                        <div className="text-[10px] text-slate-500 mt-2 font-mono flex items-center gap-2">
                          <Clock size={10} />
                          {new Date(dir.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-px bg-slate-800 my-4 group-last:hidden"></div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-[#D4AF37]/20 bg-[#D4AF37]/5">
              <button className="w-full text-xs font-bold text-[#D4AF37] hover:text-amber-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-1">
                View All Archives <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* AI Task Assistant */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-indigo-500/30 shadow-xl overflow-hidden flex flex-col relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles size={80} />
            </div>
            <div className="p-4 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center gap-2">
              <Sparkles className="text-indigo-400" size={18} />
              <h3 className="font-bold text-indigo-300 uppercase tracking-wider text-sm">Surya AI Assistant</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col h-[300px]">
              {aiChat.length === 0 ? (
                <>
                  <p className="text-sm text-slate-400 mb-4 flex-1">
                    Ask me to summarize tasks, prioritize your day, or draft a response to the CEO.
                  </p>
                  <div className="space-y-2 mb-4">
                    {['"Summarize my urgent tasks"', '"Draft a progress report"'].map(prompt => (
                      <button 
                        key={prompt} 
                        onClick={() => handleAiSubmit(prompt.replace(/"/g, ''))}
                        className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 custom-scrollbar pr-2">
                  {aiChat.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 rounded-xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex items-start">
                      <div className="p-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="relative mt-auto">
                <input 
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit(aiQuery)}
                  placeholder="Ask AI..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button 
                  onClick={() => handleAiSubmit(aiQuery)}
                  disabled={isAiTyping || !aiQuery.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-xl p-5">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleQuickAction('Generate Report')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-white transition-all">
                <FileText size={20} />
                <span className="text-xs font-bold text-center">Generate Report</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('Mark Attendance')} 
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${attendanceMarked ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 hover:bg-emerald-600 border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-white'}`}
              >
                <CheckCircle2 size={20} />
                <span className="text-xs font-bold text-center">{attendanceMarked ? 'Attendance Marked!' : 'Mark Attendance'}</span>
              </button>
              
              <button onClick={() => handleQuickAction('Open Calendar')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-amber-600 border border-slate-700 hover:border-amber-500 text-slate-400 hover:text-white transition-all">
                <CalendarDays size={20} />
                <span className="text-xs font-bold text-center">Open Calendar</span>
              </button>
              
              <button onClick={() => handleQuickAction('Message Manager')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-slate-400 hover:text-white transition-all">
                <MessageSquare size={20} />
                <span className="text-xs font-bold text-center">Message Manager</span>
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Required Keyframes for shimmer animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: -20px 0; }
          100% { background-position: 20px 0; }
        }
      `}} />
    </div>
  );
};

export default ExecutiveCommandCenter;
