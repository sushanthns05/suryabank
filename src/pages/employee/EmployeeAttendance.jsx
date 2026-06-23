import React, { useState } from 'react';
import { MapPin, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { markAttendance, getEmployeeAttendance } from '../../services/api';

const EmployeeAttendance = () => {
  const [attendanceEmployee, setAttendanceEmployee] = useState('');
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [attendanceMsg, setAttendanceMsg] = useState({ type: '', text: '' });
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  // Kengeri Branch Coordinates (Latitude, Longitude)
  const BRANCH_COORDS = { lat: 12.9176, lng: 77.4838 };
  const ALLOWED_RADIUS_METERS = 1000;

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

  const handleSelectAttendanceEmployee = async (e) => {
    const name = e.target.value;
    setAttendanceEmployee(name);
    setAttendanceMsg({ type: '', text: '' });
    if (!name) return;
    
    const res = await getEmployeeAttendance(name);
    if (res.success) {
      setAttendanceCount(res.count);
      setAttendanceHistory(res.records);
    }
  };

  const handleMarkAttendance = () => {
    if (!attendanceEmployee) {
      setAttendanceMsg({ type: 'error', text: 'Please select your name first.' });
      return;
    }
    
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

      const res = await markAttendance(attendanceEmployee, { lat: latitude, lng: longitude });
      if (res.success) {
        setAttendanceMsg({ type: 'success', text: 'Attendance marked successfully for today!' });
        setAttendanceCount(prev => prev + 1);
        const histRes = await getEmployeeAttendance(attendanceEmployee);
        if (histRes.success) setAttendanceHistory(histRes.records);
      } else {
        setAttendanceMsg({ type: 'error', text: res.message });
      }
      setIsMarkingAttendance(false);
    }, (error) => {
      setAttendanceMsg({ type: 'error', text: `Location error: ${error.message}. Please allow location access.` });
      setIsMarkingAttendance(false);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Daily Attendance</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Mark your daily presence using location verification.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
          <MapPin className="text-surya-primary" /> Daily Attendance Verification
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Select your name and mark your attendance. Your device's location will be verified against the Kengeri Satellite Town branch coordinates.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employee Name</label>
            <select 
              value={attendanceEmployee}
              onChange={handleSelectAttendanceEmployee}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary"
            >
              <option value="" disabled>Select your name</option>
              {[
                "Manjunath R - Senior Personal Bankers / Banking Associates",
                "Kumar G - Personal Bankers / Banking Associates",
                "Ramesh R - Personal Bankers / Banking Associates",
                "Satish H - Personal Bankers / Banking Associates",
                "Manish Shetty - Personal Bankers / Banking Associates",
                "Srinath J - Senior Bank Clerks / Tellers",
                "Jagdish R - Bank Clerks / Tellers",
                "Ramnath Kumar - Bank Clerks / Tellers",
                "Kushal R - Bank Clerks / Tellers",
                "Gagan S - Bank Clerks / Tellers",
                "Suresh S - Senior Relationship Manager",
                "Daranth S - Relationship Manager",
                "Krishna J - Relationship Manager",
                "Kushal N - Relationship Manager",
                "Likith Gowda - Relationship Manager",
                "Hemanth Patil - Senior Loan Officer",
                "Manjunath S R - Loan Officer",
                "Krishna Kumar - Loan Officer",
                "T Nagappa - Loan Officer",
                "Jagan Nath - Loan Officer",
                "Girish Yadav J - System Manager"
              ].map(emp => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </div>

          {attendanceEmployee && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-100">Total Days Present</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Count of your marked attendance.</p>
              </div>
              <div className="text-3xl font-bold text-surya-primary dark:text-surya-secondary">
                {attendanceCount}
              </div>
            </div>
          )}

          {attendanceMsg.text && (
            <div className={`p-4 rounded-lg flex items-start gap-3 border ${attendanceMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-300' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-300'}`}>
              {attendanceMsg.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" /> : <AlertCircle className="shrink-0 mt-0.5" />}
              <p className="text-sm font-medium">{attendanceMsg.text}</p>
            </div>
          )}

          <button 
            onClick={handleMarkAttendance}
            disabled={isMarkingAttendance || !attendanceEmployee}
            className="w-full py-3 bg-surya-primary text-white rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isMarkingAttendance ? (
              <><RefreshCw className="animate-spin" size={20} /> Verifying Location...</>
            ) : (
              <><MapPin size={20} /> Mark Attendance for Today</>
            )}
          </button>
        </div>
        
        {attendanceHistory.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Recent Attendance</h3>
            <div className="space-y-2">
              {attendanceHistory.slice(0, 5).map(record => (
                <div key={record.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{record.date}</span>
                  <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded font-bold">PRESENT</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;
