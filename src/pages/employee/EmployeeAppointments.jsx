import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Users, FileText, CheckCircle, 
  XCircle, AlertCircle, Plus, Search, ChevronRight, Briefcase
} from 'lucide-react';
import { getAvailableSlots, requestAppointment, getUserAppointments } from '../../services/appointmentService';

const EmployeeAppointments = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    purpose: '',
    agenda: '',
    priority: 'Medium',
    meetingType: 'In Person',
    preferredSlotId: '',
    participants: '',
    remarks: ''
  });

  const currentUser = {
    name: 'Ravi Kumar',
    employeeId: 'EMP12345',
    department: 'Retail Banking',
    branch: 'Mumbai Central',
    designation: 'Senior Relationship Manager',
    email: 'ravi.kumar@suryabank.com',
    phone: '+91 98765 43210'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slotsRes, apptsRes] = await Promise.all([
        getAvailableSlots(),
        getUserAppointments(currentUser.employeeId)
      ]);
      
      if (slotsRes.success) setAvailableSlots(slotsRes.data);
      if (apptsRes.success) setAppointments(apptsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const selectedSlot = availableSlots.find(s => s.id === formData.preferredSlotId);
    
    if (!selectedSlot) {
      alert("Please select a valid available slot.");
      setSubmitting(false);
      return;
    }

    const requestPayload = {
      ...currentUser,
      ...formData,
      requestedDate: selectedSlot.date,
      requestedStartTime: selectedSlot.startTime,
      requestedEndTime: selectedSlot.endTime,
      expectedDuration: selectedSlot.duration,
    };

    const res = await requestAppointment(requestPayload);
    if (res.success) {
      alert('Meeting requested successfully!');
      setActiveTab('dashboard');
      fetchData();
      setFormData({
        subject: '',
        purpose: '',
        agenda: '',
        priority: 'Medium',
        meetingType: 'In Person',
        preferredSlotId: '',
        participants: '',
        remarks: ''
      });
    } else {
      alert('Failed to request meeting: ' + res.message);
    }
    setSubmitting(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      case 'Rescheduled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1"><AlertCircle size={12} /> Rescheduled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{status}</span>;
    }
  };

  const upcomingMeetings = appointments.filter(a => a.status === 'Approved');
  const pendingRequests = appointments.filter(a => a.status === 'Pending');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Executive Appointment Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your meeting requests with the CEO and Chairman</p>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-700 text-surya-primary dark:text-surya-secondary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('request')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'request' ? 'bg-surya-primary text-white dark:bg-surya-secondary dark:text-slate-900 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Plus size={16} />
            New Request
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-surya-primary/5 dark:bg-surya-secondary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <CalendarIcon size={24} />
                </div>
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{upcomingMeetings.length}</span>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Upcoming Meetings</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Approved sessions with the CEO</p>
            </div>
            
            <div className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                  <Clock size={24} />
                </div>
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{pendingRequests.length}</span>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Pending Requests</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Awaiting executive approval</p>
            </div>
            
            <div className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400">
                  <Briefcase size={24} />
                </div>
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{appointments.length}</span>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Total Requests</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lifetime meeting history</p>
            </div>
          </div>

          <div className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Meeting Requests</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search requests..." className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-surya-primary focus:border-transparent outline-none w-64 dark:text-white" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject & Purpose</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">Loading your requests...</td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col items-center justify-center">
                          <CalendarIcon size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No meeting requests yet</p>
                          <p className="text-sm mt-1">Submit a new request to schedule time with the CEO</p>
                          <button onClick={() => setActiveTab('request')} className="mt-4 px-4 py-2 bg-surya-primary text-white rounded-lg hover:bg-surya-primary/90 transition-colors">Create Request</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{appt.subject}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{appt.purpose}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                            <CalendarIcon size={14} className="mr-2 text-slate-400" />
                            {appt.requestedDate}
                          </div>
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <Clock size={14} className="mr-2" />
                            {appt.requestedStartTime} - {appt.requestedEndTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center">
                            {appt.meetingType === 'Video Conference' ? <Users size={14} className="mr-2 text-slate-400" /> : <Briefcase size={14} className="mr-2 text-slate-400" />}
                            {appt.meetingType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${appt.priority === 'High' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : appt.priority === 'Critical' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                            {appt.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(appt.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-surya-primary dark:text-surya-secondary hover:underline text-sm font-medium">View Details</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'request' && (
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Request CEO Appointment</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please provide detailed context for your meeting request. The Executive Office reviews all submissions.</p>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Meeting Details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Meeting Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject / Title *</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none transition-shadow" placeholder="e.g. Quarterly Retail Branch Review" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Purpose *</label>
                    <input type="text" name="purpose" value={formData.purpose} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none transition-shadow" placeholder="Brief 1-sentence summary of the meeting goal" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meeting Type *</label>
                    <select name="meetingType" value={formData.meetingType} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none transition-shadow">
                      <option>In Person</option>
                      <option>Video Conference</option>
                      <option>Phone Call</option>
                      <option>Board Meeting</option>
                      <option>Project Review</option>
                      <option>Strategy Discussion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority Level *</label>
                    <select name="priority" value={formData.priority} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none transition-shadow">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Scheduling Selection */}
              <div>
                <div className="flex justify-between items-end mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Select Available Slot *</h3>
                  <span className="text-xs text-surya-primary dark:text-surya-secondary bg-surya-primary/10 dark:bg-surya-secondary/10 px-2 py-1 rounded">Smart Date Selection</span>
                </div>
                
                {loading ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 border-dashed rounded-xl">
                    Loading CEO availability...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 border-dashed rounded-xl">
                    <CalendarIcon size={32} className="mx-auto mb-3 opacity-50" />
                    No available slots found currently. Please check back later or contact the Executive Assistant directly for urgent matters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {availableSlots.map(slot => (
                      <div 
                        key={slot.id}
                        onClick={() => setFormData({...formData, preferredSlotId: slot.id})}
                        className={`cursor-pointer border rounded-xl p-4 transition-all ${formData.preferredSlotId === slot.id ? 'border-surya-primary dark:border-surya-secondary bg-surya-primary/5 dark:bg-surya-secondary/10 ring-1 ring-surya-primary' : 'border-slate-200 dark:border-slate-700 hover:border-surya-primary/50 bg-white dark:bg-slate-800'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-slate-900 dark:text-white">{slot.date}</span>
                          {formData.preferredSlotId === slot.id && <CheckCircle size={18} className="text-surya-primary dark:text-surya-secondary" />}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center mb-1">
                          <Clock size={14} className="mr-1.5" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                          {slot.duration} mins • {slot.meetingType}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!formData.preferredSlotId && availableSlots.length > 0 && (
                  <p className="text-xs text-red-500 mt-2">* Please select an available slot</p>
                )}
              </div>

              {/* Extended Details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Extended Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Agenda *</label>
                    <textarea name="agenda" value={formData.agenda} onChange={handleInputChange} required rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none transition-shadow resize-none" placeholder="1. Project Status Update (10m)&#10;2. Q3 Financial Projections (15m)&#10;3. Key Decisions Needed (5m)"></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Participants (comma separated)</label>
                      <input type="text" name="participants" value={formData.participants} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none transition-shadow" placeholder="e.g. Jane Doe, John Smith" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Additional Remarks</label>
                      <input type="text" name="remarks" value={formData.remarks} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none transition-shadow" placeholder="Any special requirements..." />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={submitting || !formData.preferredSlotId}
                className={`px-8 py-2.5 rounded-xl text-white font-medium shadow-sm transition-all flex items-center ${submitting || !formData.preferredSlotId ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed' : 'bg-surya-primary hover:bg-surya-primary/90 dark:bg-surya-secondary dark:text-slate-900 dark:hover:bg-surya-secondary/90'}`}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
                {!submitting && <ChevronRight size={18} className="ml-2 -mr-1" />}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeAppointments;
