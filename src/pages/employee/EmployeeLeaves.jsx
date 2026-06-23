import React, { useState, useEffect } from 'react';
import { 
  Calendar, Send, Clock, CheckCircle, XCircle, 
  RefreshCw, AlertTriangle, User
} from 'lucide-react';
import { getEmployees, applyLeave, getEmployeeLeaves } from '../../services/api';

const EmployeeLeaves = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [statusMessage, setStatusMessage] = useState(null);

  // Fetch employees for the dropdown
  useEffect(() => {
    const fetchEmps = async () => {
      const res = await getEmployees();
      if (res.success) {
        setEmployees(res.data);
        // Default select if not set
        if (res.data.length > 0 && !selectedEmployeeId) {
          setSelectedEmployeeId(res.data[0].id);
        }
      }
    };
    fetchEmps();
  }, []);

  // Fetch history when employee changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedEmployeeId) return;
      setIsLoading(true);
      const res = await getEmployeeLeaves(selectedEmployeeId);
      if (res.success) {
        setLeaveHistory(res.data);
      }
      setIsLoading(false);
    };
    fetchHistory();
  }, [selectedEmployeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      setStatusMessage({ type: 'error', text: 'Please select an employee profile first.' });
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setStatusMessage({ type: 'error', text: 'End date cannot be before start date.' });
      return;
    }

    setIsSubmitting(true);
    const res = await applyLeave({
      employeeId: selectedEmployeeId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason
    });

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Leave request submitted successfully. Awaiting manager approval.' });
      setFormData({ startDate: '', endDate: '', reason: '' });
      setLeaveHistory([res.data, ...leaveHistory]);
    } else {
      setStatusMessage({ type: 'error', text: res.message || 'Failed to submit leave request.' });
    }
    setIsSubmitting(false);

    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar className="text-surya-primary dark:text-surya-secondary" size={28} />
            Leave Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Apply for leave and track your request statuses.
          </p>
        </div>

        {/* Identity Selector */}
        <div className="bg-white dark:bg-surya-surfaceDark p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <User className="text-slate-400" size={18} />
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Applying As</label>
            <select 
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-800 dark:text-white focus:ring-0 p-0 cursor-pointer"
            >
              <option value="" disabled>Select Profile...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id} className="dark:bg-slate-800">{emp.fullName} ({emp.employeeId})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Application Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Send size={20} className="text-surya-primary dark:text-surya-secondary" />
              New Leave Request
            </h2>

            {statusMessage && (
              <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                {statusMessage.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
                <p>{statusMessage.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:border-surya-primary dark:focus:border-surya-secondary focus:ring-1 focus:ring-surya-primary dark:focus:ring-surya-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                  <input 
                    type="date" 
                    required 
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:border-surya-primary dark:focus:border-surya-secondary focus:ring-1 focus:ring-surya-primary dark:focus:ring-surya-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason for Leave</label>
                <textarea 
                  required
                  placeholder="Please provide a brief reason..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:border-surya-primary dark:focus:border-surya-secondary focus:ring-1 focus:ring-surya-primary dark:focus:ring-surya-secondary min-h-[120px] resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !selectedEmployeeId}
                className="w-full py-2.5 bg-surya-primary hover:bg-surya-primary/90 dark:bg-surya-secondary dark:hover:bg-surya-secondary/90 text-white dark:text-slate-900 font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* History Area */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Clock size={20} className="text-surya-primary dark:text-surya-secondary" />
                Your Leave History
              </h2>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                  <RefreshCw size={24} className="animate-spin mb-4 text-surya-primary dark:text-surya-secondary" />
                  <p>Loading history...</p>
                </div>
              ) : leaveHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-center">
                  <Calendar size={48} className="mb-4 opacity-20" />
                  <p>No leave requests found.</p>
                  <p className="text-sm mt-1 opacity-70">Your applied leaves will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveHistory.map((leave) => (
                    <div key={leave.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-bold text-slate-800 dark:text-white">
                            {new Date(leave.startDate).toLocaleDateString('en-GB')} to {new Date(leave.endDate).toLocaleDateString('en-GB')}
                          </p>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            leave.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' :
                            leave.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30' :
                            'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30'
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{leave.reason}</p>
                      </div>
                      <div className="text-xs text-slate-400 text-right whitespace-nowrap">
                        Applied on<br/>{new Date(leave.createdAt).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeLeaves;
