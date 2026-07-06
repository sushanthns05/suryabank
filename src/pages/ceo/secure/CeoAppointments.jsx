import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Users, CheckCircle, 
  XCircle, AlertCircle, Plus, Search, ChevronRight, 
  MoreVertical, FileText, Activity
} from 'lucide-react';
import { getAvailableSlots, addMeetingSlot, getCEOAppointments, updateAppointmentStatus, addMeetingTasks } from '../../../services/appointmentService';

const CeoAppointments = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Slot Form State
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotData, setSlotData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    duration: '30',
    meetingType: 'Open Slot',
    maxParticipants: '5',
    location: 'CEO Office'
  });

  // Review Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewAction, setReviewAction] = useState(null); // 'approve', 'reject', 'reschedule'
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slotsRes, apptsRes] = await Promise.all([
        getAvailableSlots(),
        getCEOAppointments()
      ]);
      
      if (slotsRes.success) setSlots(slotsRes.data);
      if (apptsRes.success) setAppointments(apptsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    const res = await addMeetingSlot(slotData);
    if (res.success) {
      setShowSlotModal(false);
      setSlotData({
        date: '', startTime: '', endTime: '', duration: '30',
        meetingType: 'Open Slot', maxParticipants: '5', location: 'CEO Office'
      });
      fetchData();
    } else {
      alert('Failed to add slot: ' + res.message);
    }
  };

  const handleReviewAction = async () => {
    if (!selectedRequest || !reviewAction) return;

    let status = '';
    if (reviewAction === 'approve') status = 'Approved';
    if (reviewAction === 'reject') status = 'Rejected';
    if (reviewAction === 'reschedule') status = 'Rescheduled';

    const res = await updateAppointmentStatus(selectedRequest.id, {
      status,
      reason: reviewNotes
    });

    if (res.success) {
      setSelectedRequest(null);
      setReviewAction(null);
      setReviewNotes('');
      fetchData();
    } else {
      alert('Action failed: ' + res.message);
    }
  };

  const pendingRequests = appointments.filter(a => a.status === 'Pending');
  const upcomingMeetings = appointments.filter(a => a.status === 'Approved');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Executive Appointment Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Command center for scheduling, approvals, and meeting management</p>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-700 text-surya-primary dark:text-surya-secondary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Review Requests
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'calendar' ? 'bg-white dark:bg-slate-700 text-surya-primary dark:text-surya-secondary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Availability Calendar
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Card */}
              <div className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Command Center Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300">Pending Approvals</span>
                    <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2.5 py-0.5 rounded-full text-xs font-bold">{pendingRequests.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300">Upcoming Meetings</span>
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-bold">{upcomingMeetings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300">Total Requests</span>
                    <span className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-bold">{appointments.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-surya-primary to-yellow-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-20">
                  <Activity size={100} />
                </div>
                <h3 className="font-bold mb-1 relative z-10">AI Scheduling Assistant</h3>
                <p className="text-sm text-white/80 relative z-10 mb-4">The assistant has pre-screened incoming requests based on your current strategic priorities.</p>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors w-full">View Insights</button>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pending Requests Review</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-surya-primary focus:border-transparent outline-none w-64 dark:text-white" />
                  </div>
                </div>
                
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {loading ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading requests...</div>
                  ) : pendingRequests.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                      <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                      <p className="text-lg font-medium">All caught up!</p>
                      <p className="text-sm">There are no pending meeting requests.</p>
                    </div>
                  ) : (
                    pendingRequests.map(req => (
                      <div key={req.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-surya-primary to-yellow-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                              {req.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{req.subject}</h3>
                                {req.priority === 'Critical' && <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Critical</span>}
                                {req.priority === 'High' && <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">High</span>}
                              </div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{req.name} • {req.designation} • {req.department}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{req.purpose}</p>
                              
                              <div className="flex flex-wrap items-center gap-4 mt-3">
                                <span className="flex items-center text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                  <CalendarIcon size={12} className="mr-1.5" />
                                  {req.requestedDate}
                                </span>
                                <span className="flex items-center text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                  <Clock size={12} className="mr-1.5" />
                                  {req.requestedStartTime} - {req.requestedEndTime}
                                </span>
                                <span className="flex items-center text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                  {req.meetingType === 'Video Conference' ? <Users size={12} className="mr-1.5" /> : <FileText size={12} className="mr-1.5" />}
                                  {req.meetingType}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 shrink-0 md:flex-col md:items-end">
                            <button 
                              onClick={() => setSelectedRequest(req)}
                              className="px-4 py-2 bg-surya-primary text-white dark:bg-surya-secondary dark:text-slate-900 text-sm font-medium rounded-lg hover:shadow-md transition-shadow"
                            >
                              Review Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Availability Calendar</h2>
            <button 
              onClick={() => setShowSlotModal(true)}
              className="px-4 py-2 bg-surya-primary text-white dark:bg-surya-secondary dark:text-slate-900 rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow-md transition-shadow"
            >
              <Plus size={16} className="mr-2" /> Add Availability Slot
            </button>
          </div>
          
          <div className="bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slots.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                  No availability slots configured. Click "Add Availability Slot" to open your calendar.
                </div>
              ) : (
                slots.map(slot => (
                  <div key={slot.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-surya-primary dark:hover:border-surya-secondary transition-colors relative group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{slot.date}</span>
                      <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Available</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <Clock size={16} className="mr-2 text-surya-primary dark:text-surya-secondary" />
                        {slot.startTime} to {slot.endTime} ({slot.duration} mins)
                      </div>
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <Users size={16} className="mr-2 text-slate-400" />
                        {slot.meetingType} (Max: {slot.maxParticipants})
                      </div>
                    </div>
                    <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all">
                      <XCircle size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surya-surfaceDark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Availability Slot</h3>
              <button onClick={() => setShowSlotModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAddSlot} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input type="date" required value={slotData.date} onChange={e => setSlotData({...slotData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input type="time" required value={slotData.startTime} onChange={e => setSlotData({...slotData, startTime: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                  <input type="time" required value={slotData.endTime} onChange={e => setSlotData({...slotData, endTime: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meeting Type Preference</label>
                <select value={slotData.meetingType} onChange={e => setSlotData({...slotData, meetingType: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-surya-primary outline-none">
                  <option>Open Slot (Any)</option>
                  <option>Video Conference Only</option>
                  <option>In Person Only</option>
                  <option>Board / Committee</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowSlotModal(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-surya-primary text-white dark:bg-surya-secondary dark:text-slate-900 font-medium rounded-lg hover:shadow-md transition-shadow">Publish Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surya-surfaceDark w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Review Meeting Request</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Requester Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-surya-primary to-yellow-500 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-inner">
                  {selectedRequest.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{selectedRequest.name}</h4>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedRequest.designation} • {selectedRequest.department}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedRequest.email} • {selectedRequest.phone}</p>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Subject</h5>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedRequest.subject}</p>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Meeting Type & Priority</h5>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedRequest.meetingType} • <span className={selectedRequest.priority === 'High' || selectedRequest.priority === 'Critical' ? 'text-red-500' : ''}>{selectedRequest.priority} Priority</span></p>
                </div>
                <div className="col-span-2">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Purpose</h5>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{selectedRequest.purpose}</p>
                </div>
                <div className="col-span-2">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Detailed Agenda</h5>
                  <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                    {selectedRequest.agenda}
                  </div>
                </div>
                <div className="col-span-2">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Requested Time</h5>
                  <div className="flex items-center text-sm font-bold text-surya-primary dark:text-surya-secondary">
                    <CalendarIcon size={16} className="mr-2" />
                    {selectedRequest.requestedDate} @ {selectedRequest.requestedStartTime} - {selectedRequest.requestedEndTime}
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Executive Decision</h5>
                
                {!reviewAction ? (
                  <div className="flex gap-3">
                    <button onClick={() => setReviewAction('approve')} className="flex-1 py-3 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors flex justify-center items-center">
                      <CheckCircle size={18} className="mr-2" /> Approve Request
                    </button>
                    <button onClick={() => setReviewAction('reschedule')} className="flex-1 py-3 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex justify-center items-center">
                      <Clock size={18} className="mr-2" /> Reschedule
                    </button>
                    <button onClick={() => setReviewAction('reject')} className="flex-1 py-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex justify-center items-center">
                      <XCircle size={18} className="mr-2" /> Reject
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className={`p-4 rounded-xl border ${reviewAction === 'approve' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : reviewAction === 'reject' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                      <h4 className={`font-bold mb-2 flex items-center ${reviewAction === 'approve' ? 'text-green-700 dark:text-green-400' : reviewAction === 'reject' ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>
                        {reviewAction === 'approve' && <><CheckCircle size={18} className="mr-2" /> Approving Meeting</>}
                        {reviewAction === 'reject' && <><XCircle size={18} className="mr-2" /> Rejecting Meeting</>}
                        {reviewAction === 'reschedule' && <><Clock size={18} className="mr-2" /> Rescheduling Meeting</>}
                      </h4>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Add notes for the employee (Optional)</label>
                      <textarea 
                        value={reviewNotes} 
                        onChange={e => setReviewNotes(e.target.value)} 
                        rows="3" 
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-surya-primary" 
                        placeholder={reviewAction === 'approve' ? "Looking forward to it..." : reviewAction === 'reject' ? "Please refine the agenda and resubmit..." : "Please select another slot next week..."}
                      ></textarea>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setReviewAction(null)} className="px-4 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Back</button>
                      <button onClick={handleReviewAction} className={`flex-1 py-2.5 rounded-lg text-white font-bold shadow-sm ${reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : reviewAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        Confirm Action
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CeoAppointments;
