import React, { useState, useEffect } from 'react';
import { 
  X, User, CheckCircle, Clock, FileText, 
  AlertTriangle, Star, Activity, RefreshCw, Send, Check, TrendingUp
} from 'lucide-react';
import { 
  getEmployeeTasks, assignTask, updateTaskStatus,
  getEmployeeLeaves, updateLeaveStatus,
  getEvaluations, addEvaluation,
  getWarnings, issueWarning,
  updateEmployee
} from '../../services/api';

const EmployeeDetailsModal = ({ employee, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [newEval, setNewEval] = useState({ rating: 5, comments: '', recommendPromotion: false });
  const [newWarning, setNewWarning] = useState({ reason: '', severity: 'Low' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hike State
  const [localEmployee, setLocalEmployee] = useState(employee);
  const [isApplyingHike, setIsApplyingHike] = useState(false);
  const [hikeApplied, setHikeApplied] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const [tasksRes, leavesRes, evalsRes, warnsRes] = await Promise.all([
        getEmployeeTasks(employee.id),
        getEmployeeLeaves(employee.id),
        getEvaluations(employee.id),
        getWarnings(employee.id)
      ]);

      if (tasksRes.success) setTasks(tasksRes.data);
      if (leavesRes.success) setLeaves(leavesRes.data);
      if (evalsRes.success) setEvaluations(evalsRes.data);
      if (warnsRes.success) setWarnings(warnsRes.data);
      setLoading(false);
    };

    fetchAllData();
  }, [employee.id]);

  // Actions
  const handleAssignTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await assignTask({ employeeId: employee.id, ...newTask });
    if (res.success) {
      setTasks([res.data, ...tasks]);
      setNewTask({ title: '', description: '', dueDate: '' });
    }
    setIsSubmitting(false);
  };

  const handleUpdateTask = async (taskId, status) => {
    const res = await updateTaskStatus(taskId, status);
    if (res.success) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    }
  };

  const handleUpdateLeave = async (leaveId, status) => {
    const res = await updateLeaveStatus(leaveId, status);
    if (res.success) {
      setLeaves(leaves.map(l => l.id === leaveId ? { ...l, status } : l));
    }
  };

  const handleAddEvaluation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await addEvaluation({ employeeId: employee.id, ...newEval });
    if (res.success) {
      setEvaluations([res.data, ...evaluations]);
      setNewEval({ rating: 5, comments: '', recommendPromotion: false });
    }
    setIsSubmitting(false);
  };

  const handleIssueWarning = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await issueWarning({ employeeId: employee.id, ...newWarning });
    if (res.success) {
      setWarnings([res.data, ...warnings]);
      setNewWarning({ reason: '', severity: 'Low' });
    }
    setIsSubmitting(false);
  };

  // Render Helpers
  const renderTabButton = (id, label, icon) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`px-4 py-3 flex items-center gap-2 font-bold text-sm transition-all border-b-2 ${activeTab === id ? 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
    >
      {icon} {label}
    </button>
  );

  const currentYearLeaves = leaves.filter(l => {
    const leaveYear = new Date(l.startDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return leaveYear === currentYear && (l.status === 'approved' || l.status === 'pending');
  });

  const totalLeaveDays = currentYearLeaves.reduce((total, l) => {
    const start = new Date(l.startDate);
    const end = new Date(l.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return total + diffDays;
  }, 0);

  const baseSalary = Number(localEmployee.salary || 0);
  const effectiveSalary = totalLeaveDays > 18 ? baseSalary * 0.98 : baseSalary;

  // Hike Eligibility Logic
  const hasCompletedTask = tasks.filter(t => t.status === 'completed').length > 0;
  const hasGoodRating = evaluations.length > 0 && evaluations[0].rating >= 4;
  const hasNoWarnings = warnings.length === 0;
  const hasHikeThisYear = localEmployee.lastHikeYear === new Date().getFullYear() || hikeApplied;
  const isEligibleForHike = hasCompletedTask && hasGoodRating && hasNoWarnings && !hasHikeThisYear;

  const handleApplyHike = async () => {
    setIsApplyingHike(true);
    const newSalary = Math.round(baseSalary * 1.05); // 5% increase
    const currentYear = new Date().getFullYear();
    const res = await updateEmployee(localEmployee.id, { salary: newSalary, lastHikeYear: currentYear });
    if (res.success) {
      setLocalEmployee({ ...localEmployee, salary: newSalary, lastHikeYear: currentYear });
      setHikeApplied(true);
    }
    setIsApplyingHike(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-[#0F172A]/80 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-[#F59E0B] flex items-center justify-center font-bold text-2xl shadow-inner border border-slate-600">
              {localEmployee.fullName?.charAt(0) || 'E'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{localEmployee.fullName}</h2>
              <p className="text-slate-400">{localEmployee.designation} • <span className="text-[#F59E0B]">{localEmployee.employeeId}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-slate-700/50 bg-[#0F172A]/50 overflow-x-auto custom-scrollbar">
          {renderTabButton('overview', 'Overview', <User size={16}/>)}
          {renderTabButton('tasks', 'Tasks', <CheckCircle size={16}/>)}
          {renderTabButton('leaves', 'Leave Requests', <Clock size={16}/>)}
          {renderTabButton('performance', 'Performance', <Star size={16}/>)}
          {renderTabButton('warnings', 'Warnings', <AlertTriangle size={16}/>)}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0F172A]/10 custom-scrollbar relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <RefreshCw size={32} className="animate-spin mb-4 text-[#F59E0B]" />
              <p>Loading employee data...</p>
            </div>
          ) : (
            <div className="h-full">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-xl">
                      <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><User size={18} className="text-[#F59E0B]"/> Personal Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-700/50 pb-2">
                          <span className="text-slate-400">Status</span>
                          <span className={`font-bold ${localEmployee.status === 'Active' ? 'text-emerald-400' : 'text-red-400'}`}>{localEmployee.status}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700/50 pb-2">
                          <span className="text-slate-400">Branch</span>
                          <span className="text-slate-200 font-bold">{localEmployee.branch}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700/50 pb-2">
                          <span className="text-slate-400">System ID</span>
                          <span className="text-slate-200 font-mono">{localEmployee.employeeId}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700/50 pb-2">
                          <span className="text-slate-400">Base Salary</span>
                          <span className="text-slate-200 font-bold">₹{baseSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pb-2">
                          <span className="text-slate-400 flex items-center gap-1">
                            Effective Salary
                            {totalLeaveDays > 18 && (
                              <span title="2% deduction applied due to exceeding 18 days of leave" className="text-red-400 cursor-help">
                                <AlertTriangle size={14} />
                              </span>
                            )}
                          </span>
                          <span className={`font-bold ${totalLeaveDays > 18 ? 'text-red-400' : 'text-emerald-400'}`}>
                            ₹{effectiveSalary.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-xl">
                      <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><Activity size={18} className="text-[#F59E0B]"/> Quick Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0F172A] p-4 rounded-lg border border-slate-700 text-center">
                          <p className="text-2xl font-black text-[#F59E0B]">{tasks.filter(t => t.status === 'completed').length}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase mt-1">Tasks Completed</p>
                        </div>
                        <div className="bg-[#0F172A] p-4 rounded-lg border border-slate-700 text-center">
                          <p className="text-2xl font-black text-emerald-400">{leaves.filter(l => l.status === 'approved').length}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase mt-1">Approved Leaves</p>
                        </div>
                        <div className="bg-[#0F172A] p-4 rounded-lg border border-slate-700 text-center">
                          <p className="text-2xl font-black text-yellow-400">{evaluations.length > 0 ? evaluations[0].rating : '-'}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase mt-1">Latest Rating</p>
                        </div>
                        <div className="bg-[#0F172A] p-4 rounded-lg border border-slate-700 text-center">
                          <p className="text-2xl font-black text-red-400">{warnings.length}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase mt-1">Warnings</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TASKS TAB */}
              {activeTab === 'tasks' && (
                <div className="space-y-6">
                  <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-xl">
                    <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><FileText size={18} className="text-[#F59E0B]"/> Assign New Task</h3>
                    <form onSubmit={handleAssignTask} className="flex flex-col sm:flex-row gap-4">
                      <input 
                        type="text" required placeholder="Task Title" 
                        value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                        className="flex-1 bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                      />
                      <input 
                        type="date" required 
                        value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                        className="bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                      />
                      <button disabled={isSubmitting} className="px-6 py-2 bg-[#F59E0B] hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                        {isSubmitting ? <RefreshCw size={16} className="animate-spin"/> : <Send size={16}/>} Assign
                      </button>
                    </form>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-slate-200 mb-4">Task History</h3>
                    <div className="space-y-3">
                      {tasks.length === 0 ? <p className="text-slate-500 text-sm">No tasks assigned yet.</p> : tasks.map(task => (
                        <div key={task.id} className="bg-[#1E293B] border border-slate-700 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white">{task.title}</p>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {task.status}
                              </span>
                            </p>
                          </div>
                          {task.status !== 'completed' && (
                            <button onClick={() => handleUpdateTask(task.id, 'completed')} className="p-2 bg-[#0F172A] hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-lg border border-slate-700 transition-colors" title="Mark Completed">
                              <Check size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LEAVES TAB */}
              {activeTab === 'leaves' && (
                <div className="space-y-6">
                  <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-xl border-l-4 border-l-[#F59E0B]">
                    <p className="text-sm text-slate-300 font-bold">Manager Instructions:</p>
                    <p className="text-xs text-slate-400 mt-1">Review leave requests below. Approving a request will automatically notify the employee and adjust roster visibility.</p>
                  </div>
                  
                  <div className="space-y-3">
                    {leaves.length === 0 ? <p className="text-slate-500 text-sm">No leave requests found.</p> : leaves.map(leave => (
                      <div key={leave.id} className="bg-[#1E293B] border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <p className="font-bold text-white">{leave.reason || 'Personal Leave'}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                          </p>
                          <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${leave.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : leave.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {leave.status}
                          </span>
                        </div>
                        {leave.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateLeave(leave.id, 'approved')} className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-lg text-sm transition-colors">Approve</button>
                            <button onClick={() => handleUpdateLeave(leave.id, 'rejected')} className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-lg text-sm transition-colors">Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PERFORMANCE TAB */}
              {activeTab === 'performance' && (
                <div className="space-y-6">

                  {/* ANNUAL REVIEW SECTION */}
                  <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-xl">
                    <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-[#F59E0B]"/> Annual Salary Review</h3>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-sm">
                        <p className="text-slate-400 mb-2">Eligibility Criteria:</p>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2">
                            {hasGoodRating ? <CheckCircle size={14} className="text-emerald-400"/> : <X size={14} className="text-red-400"/>}
                            <span className={hasGoodRating ? 'text-slate-300' : 'text-slate-500'}>Latest Rating 4+ Stars</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {hasNoWarnings ? <CheckCircle size={14} className="text-emerald-400"/> : <X size={14} className="text-red-400"/>}
                            <span className={hasNoWarnings ? 'text-slate-300' : 'text-slate-500'}>Zero Active Warnings</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {hasCompletedTask ? <CheckCircle size={14} className="text-emerald-400"/> : <X size={14} className="text-red-400"/>}
                            <span className={hasCompletedTask ? 'text-slate-300' : 'text-slate-500'}>Completed Tasks</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-700/50 flex flex-col items-center min-w-[200px]">
                        {hasHikeThisYear ? (
                          <div className="flex flex-col items-center text-emerald-400">
                            <CheckCircle size={28} className="mb-2"/>
                            <span className="font-bold text-sm text-center">Hike Applied<br/>for {new Date().getFullYear()}</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-slate-400 text-xs mb-2">Current Base: ₹{baseSalary.toLocaleString()}</p>
                            <button 
                              onClick={handleApplyHike}
                              disabled={!isEligibleForHike || isApplyingHike}
                              className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                isEligibleForHike 
                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-500/20' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              {isApplyingHike ? <RefreshCw size={16} className="animate-spin"/> : <TrendingUp size={16}/>}
                              Apply 5% Hike
                            </button>
                            {!isEligibleForHike && <p className="text-[10px] text-slate-500 mt-2 text-center">Does not meet criteria</p>}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-xl">
                    <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><Star size={18} className="text-[#F59E0B]"/> Submit Evaluation</h3>
                    <form onSubmit={handleAddEvaluation} className="space-y-4">
                      <div className="flex gap-6 items-center">
                        <label className="text-sm font-bold text-slate-300">Performance Rating (1-5):</label>
                        <select required value={newEval.rating} onChange={e => setNewEval({...newEval, rating: Number(e.target.value)})} className="bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2 text-white">
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                        </select>
                      </div>
                      <textarea required placeholder="Evaluation Comments & Feedback" value={newEval.comments} onChange={e => setNewEval({...newEval, comments: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F59E0B] min-h-[100px]"></textarea>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={newEval.recommendPromotion} onChange={e => setNewEval({...newEval, recommendPromotion: e.target.checked})} className="w-4 h-4 rounded border-slate-700 text-[#F59E0B] focus:ring-[#F59E0B] bg-[#0F172A]"/>
                        <span className="text-sm font-bold text-slate-300">Recommend for Promotion / Salary Hike</span>
                      </label>
                      <button disabled={isSubmitting} className="px-6 py-2 bg-[#F59E0B] hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                        {isSubmitting ? <RefreshCw size={16} className="animate-spin"/> : <Check size={16}/>} Submit Evaluation
                      </button>
                    </form>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-200 mb-4">Evaluation History</h3>
                    <div className="space-y-3">
                      {evaluations.length === 0 ? <p className="text-slate-500 text-sm">No evaluations recorded.</p> : evaluations.map(ev => (
                        <div key={ev.id} className="bg-[#1E293B] border border-slate-700 p-4 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex text-[#F59E0B]">
                              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < ev.rating ? 'currentColor' : 'none'} className={i >= ev.rating ? 'text-slate-600' : ''}/>)}
                            </div>
                            <span className="text-xs text-slate-400">{new Date(ev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-slate-300">{ev.comments}</p>
                          {ev.recommendPromotion && (
                            <div className="mt-3 inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full">
                              ⭐ Recommended for Promotion
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* WARNINGS TAB */}
              {activeTab === 'warnings' && (
                <div className="space-y-6">
                  <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-xl">
                    <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2"><AlertTriangle size={18}/> Issue Formal Warning</h3>
                    <form onSubmit={handleIssueWarning} className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input type="text" required placeholder="Reason for Warning (e.g. Late Arrival, Policy Violation)" value={newWarning.reason} onChange={e => setNewWarning({...newWarning, reason: e.target.value})} className="flex-1 bg-[#0F172A] border border-red-500/50 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500" />
                        <select value={newWarning.severity} onChange={e => setNewWarning({...newWarning, severity: e.target.value})} className="bg-[#0F172A] border border-red-500/50 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500">
                          <option value="Low">Low Severity</option>
                          <option value="Medium">Medium Severity</option>
                          <option value="High">High Severity</option>
                        </select>
                      </div>
                      <button disabled={isSubmitting} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                        {isSubmitting ? <RefreshCw size={16} className="animate-spin"/> : <AlertTriangle size={16}/>} Issue Warning
                      </button>
                    </form>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-200 mb-4">Disciplinary Record</h3>
                    <div className="space-y-3">
                      {warnings.length === 0 ? <p className="text-slate-500 text-sm">Clean record. No warnings issued.</p> : warnings.map(warn => (
                        <div key={warn.id} className="bg-[#1E293B] border border-slate-700 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white">{warn.reason}</p>
                            <p className="text-xs text-slate-400 mt-1">Issued on {new Date(warn.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase border ${warn.severity === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : warn.severity === 'Medium' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                            {warn.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
