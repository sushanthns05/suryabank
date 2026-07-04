import React, { useState, useEffect } from 'react';
import { 
  MapPin, CheckCircle, AlertCircle, RefreshCw, Clock, 
  Users, CheckSquare, XSquare, Calendar as CalendarIcon, Filter
} from 'lucide-react';
import { markAttendance, getEmployeeAttendance, getEmployees, getTodayAttendance, markAllAttendance, getAttendanceByDate } from '../../services/api';

const ManagerAttendance = () => {
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [attendanceMsg, setAttendanceMsg] = useState({ type: '', text: '' });
  const [managerAttendanceCount, setManagerAttendanceCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));

  const MANAGER_NAME = "Sushanth N S - Manager and Head of Bank";
  const BRANCH_COORDS = { lat: 12.9176, lng: 77.4838 };
  const ALLOWED_RADIUS_METERS = 1000;

  const [roster, setRoster] = useState([]);

  const fetchRosterData = async (dateStr) => {
    const targetDate = dateStr || selectedDate;
    const [empRes, attRes] = await Promise.all([getEmployees(), getAttendanceByDate(targetDate)]);
    if (empRes.success && attRes.success) {
      const todayAtt = attRes.records;
      
      const formattedRoster = empRes.data.map(emp => {
        const attRecord = todayAtt.find(r => r.employeeName && r.employeeName.includes(emp.fullName));
        let status = 'Absent';
        let checkIn = '-';
        let workTime = '-';

        if (attRecord) {
          status = attRecord.status === 'Absent' ? 'Absent' : 'Present';
          if (status === 'Present') {
            const checkInDate = new Date(attRecord.timestamp);
            checkIn = checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            if (targetDate === new Date().toLocaleDateString('en-CA')) {
              const diffMs = new Date() - checkInDate;
              const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
              const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              workTime = `${diffHrs}h ${diffMins}m`;
            } else {
              workTime = 'Completed';
            }
          }
        }

        return {
          id: emp.id,
          name: emp.fullName,
          role: emp.role || 'Employee',
          checkIn,
          workTime,
          status
        };
      });
      setRoster(formattedRoster);
    }
  };

  useEffect(() => {
    // Fetch manager's own attendance count
    const fetchMyAttendance = async () => {
      const res = await getEmployeeAttendance(MANAGER_NAME);
      if (res.success) {
        setManagerAttendanceCount(res.count);
      }
    };

    fetchMyAttendance();
  }, []);

  useEffect(() => {
    fetchRosterData(selectedDate);
  }, [selectedDate]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleMarkAttendance = () => {
    setAttendanceMsg({ type: '', text: '' });
    setIsMarkingAttendance(true);

    if (!navigator.geolocation) {
      setAttendanceMsg({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      setIsMarkingAttendance(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const distance = getDistance(BRANCH_COORDS.lat, BRANCH_COORDS.lng, latitude, longitude);
      
      if (distance > ALLOWED_RADIUS_METERS) {
        setAttendanceMsg({ type: 'error', text: `Security block: You are ${Math.round(distance)}m away from the branch. Must be within ${ALLOWED_RADIUS_METERS}m to mark attendance.` });
        setIsMarkingAttendance(false);
        return;
      }

      const res = await markAttendance(MANAGER_NAME, { lat: latitude, lng: longitude });
      if (res.success) {
        setAttendanceMsg({ type: 'success', text: 'Attendance marked successfully for today!' });
        setManagerAttendanceCount(prev => prev + 1);
      } else {
        setAttendanceMsg({ type: 'error', text: res.message });
      }
      setIsMarkingAttendance(false);
    }, (error) => {
      setAttendanceMsg({ type: 'error', text: `Location error: ${error.message}. Please allow location access.` });
      setIsMarkingAttendance(false);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  const handleMarkAll = async (status) => {
    if (window.confirm(`Are you sure you want to mark all employees as ${status} for ${selectedDate}?`)) {
      setIsMarkingAll(true);
      const res = await markAllAttendance(status, selectedDate);
      if (res.success) {
        setAttendanceMsg({ type: 'success', text: `Successfully marked all as ${status} for ${selectedDate}!` });
        await fetchRosterData(selectedDate);
      } else {
        setAttendanceMsg({ type: 'error', text: res.message });
      }
      setIsMarkingAll(false);
    }
  };

  const filteredRoster = roster.filter(emp => {
    if (filter === 'present') return emp.status === 'Present';
    if (filter === 'absent') return emp.status === 'Absent';
    return true;
  });

  const presentCount = roster.filter(e => e.status === 'Present').length;
  const absentCount = roster.filter(e => e.status === 'Absent').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Attendance & Roster Oversight</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your check-in and monitor staff presence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Manager Self-Check-In */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden p-6 relative">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-yellow-600 flex items-center justify-center shadow-lg">
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Manager Check-In</h2>
                <p className="text-xs text-slate-400">GPS Location Verification required.</p>
              </div>
            </div>

            <div className="bg-[#0F172A]/80 border border-slate-700 rounded-xl p-4 mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Authenticated As</p>
              <p className="font-bold text-slate-200">Sushanth N S</p>
              <p className="text-sm text-[#F59E0B] mt-0.5">Manager and Head of Bank</p>
            </div>

            <div className="flex justify-between items-center mb-6 px-2">
              <p className="text-sm font-bold text-slate-400">Total Days Present</p>
              <p className="text-2xl font-black text-emerald-400">{managerAttendanceCount}</p>
            </div>

            {attendanceMsg.text && (
              <div className={`p-4 rounded-xl flex items-start gap-3 mb-6 border ${attendanceMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                {attendanceMsg.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
                <p className="text-sm font-bold">{attendanceMsg.text}</p>
              </div>
            )}

            <button 
              onClick={handleMarkAttendance}
              disabled={isMarkingAttendance}
              className="w-full py-3.5 bg-gradient-to-r from-[#F59E0B] to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-xl font-bold shadow-lg shadow-[#F59E0B]/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
            >
              {isMarkingAttendance ? (
                <><RefreshCw className="animate-spin" size={20} /> Verifying GPS...</>
              ) : (
                <><CheckSquare size={20} /> Verify & Mark Attendance</>
              )}
            </button>
          </div>

          <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl p-6">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2"><Clock size={16} className="text-[#F59E0B]" /> Branch Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Current Time</span>
                <span className="text-sm font-bold text-slate-200">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Date</span>
                <span className="text-sm font-bold text-slate-200">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="border-t border-slate-700/50 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Shift</span>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded">Morning Shift</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Employee Oversight Roster */}
        <div className="lg:col-span-2">
          <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl h-full flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-700/50 bg-[#0F172A]/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-[#F59E0B]" />
                <h2 className="text-lg font-bold text-white">Employee Roster Log</h2>
              </div>
              
              <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3">
                <div className="flex items-center gap-2 bg-[#0F172A] p-1 rounded-lg border border-slate-700 mr-2">
                  <CalendarIcon size={16} className="text-slate-400 ml-2" />
                  <input 
                    type="date" 
                    value={selectedDate}
                    max={new Date().toLocaleDateString('en-CA')}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-sm text-slate-200 outline-none px-2 py-1 [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleMarkAll('Present')} 
                    disabled={isMarkingAll}
                    className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-md text-xs font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    Mark All Present
                  </button>
                  <button 
                    onClick={() => handleMarkAll('Absent')} 
                    disabled={isMarkingAll}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-md text-xs font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    Mark All Absent
                  </button>
                </div>
                <div className="flex items-center gap-3 bg-[#0F172A] p-1 rounded-lg border border-slate-700">
                  <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-300'}`}>All ({roster.length})</button>
                  <button onClick={() => setFilter('present')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${filter === 'present' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-emerald-400'}`}>Present ({presentCount})</button>
                  <button onClick={() => setFilter('absent')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${filter === 'absent' ? 'bg-red-500/20 text-red-400' : 'text-slate-400 hover:text-red-400'}`}>Absent ({absentCount})</button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0F172A]/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/50">
                    <th className="p-4 font-bold">Employee Name & Role</th>
                    <th className="p-4 font-bold text-center">Status</th>
                    <th className="p-4 font-bold text-center">Check-In</th>
                    <th className="p-4 font-bold text-right">Work Time</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-700/30">
                  {filteredRoster.map(emp => (
                    <tr key={emp.id} className="hover:bg-[#0F172A]/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-200">{emp.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{emp.role}</p>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${emp.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          {emp.status === 'Present' ? <CheckSquare size={12} /> : <XSquare size={12} />}
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-mono text-xs ${emp.status === 'Present' ? 'text-slate-300' : 'text-slate-600'}`}>{emp.checkIn}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-mono font-bold ${emp.status === 'Present' ? 'text-[#F59E0B]' : 'text-slate-600'}`}>{emp.workTime}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-700/50 bg-[#0F172A]/80 flex justify-between items-center text-xs text-slate-500">
              <p className="flex items-center gap-1"><Filter size={12}/> Showing {filteredRoster.length} records</p>
              <p className="flex items-center gap-1"><CalendarIcon size={12}/> Log for {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ManagerAttendance;
