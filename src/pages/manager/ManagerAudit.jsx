import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, ShieldAlert, Activity, 
  Search, RefreshCw, Lock, Eye, CheckCircle 
} from 'lucide-react';
import { getAuditLogs, createAuditLog } from '../../services/api';

const ManagerAudit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  // Auto-seeding logic
  const ensureMockData = async (existingLogs) => {
    if (existingLogs.length === 0) {
      console.log("No audit logs found, seeding security events...");
      try {
        const events = [
          { action: 'System Authentication', detail: 'Multiple failed login attempts detected for Employee ID: EMP-102.', performedBy: 'System Firewall', riskLevel: 'medium', status: 'Blocked' },
          { action: 'Manager Override', detail: 'Loan L-1045 limit overridden by Branch Manager.', performedBy: 'Sushanth N S', riskLevel: 'high', status: 'Logged' },
          { action: 'Account Freeze', detail: 'Account 948201847563 frozen due to suspicious activity pattern.', performedBy: 'Automated Risk Engine', riskLevel: 'critical', status: 'Active' },
          { action: 'KYC Verification', detail: 'Manual KYC override approved for Customer C-992.', performedBy: 'Sushanth N S', riskLevel: 'medium', status: 'Logged' },
          { action: 'Vault Access', detail: 'Main Vault accessed outside standard operating hours.', performedBy: 'EMP-045', riskLevel: 'high', status: 'Flagged' },
          { action: 'Data Export', detail: 'Bulk customer transaction data exported to PDF.', performedBy: 'Sushanth N S', riskLevel: 'low', status: 'Logged' },
        ];
        
        for (const ev of events) {
          // Delay slightly so timestamps differ
          await new Promise(r => setTimeout(r, 100));
          await createAuditLog(ev);
        }
        return true; // Seeded
      } catch (err) {
        console.error("Failed to seed audit logs:", err);
      }
    }
    return false;
  };

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      let data = await getAuditLogs();
      if (data.success) {
        let currentLogs = data.data;
        const seeded = await ensureMockData(currentLogs);
        if (seeded) {
          data = await getAuditLogs(); // Re-fetch
          currentLogs = data.data;
        }
        setLogs(currentLogs);
      } else {
        setError(data.error || 'Failed to fetch audit logs');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = (log.action.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (log.detail.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = filterLevel === 'all' || log.riskLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getRiskColor = (level) => {
    switch(level) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  const criticalCount = logs.filter(l => l.riskLevel === 'critical').length;
  const highCount = logs.filter(l => l.riskLevel === 'high').length;
  const complianceScore = Math.max(0, 100 - (criticalCount * 5) - (highCount * 2));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Audit & Compliance Center</h1>
          <p className="text-slate-400 text-sm mt-1">Immutable security ledger and regulatory monitoring.</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="px-4 py-2 bg-[#1E293B] border border-slate-600 text-slate-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Sync Security Logs
        </button>
      </div>

      {/* Top Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compliance Health */}
        <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Compliance Health</p>
            <div className="flex items-end gap-2">
              <h2 className={`text-5xl font-black ${complianceScore >= 95 ? 'text-emerald-400' : complianceScore >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                {complianceScore}%
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-2">Target: &gt; 98% (RBI Guideline)</p>
          </div>
          <div className="w-20 h-20 relative">
            <svg viewBox="0 0 36 36" className="w-20 h-20 circular-chart">
              <path className="text-slate-700" strokeWidth="3" fill="none" stroke="currentColor" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className={complianceScore >= 95 ? 'text-emerald-400' : complianceScore >= 80 ? 'text-yellow-400' : 'text-red-400'} strokeWidth="3" fill="none" stroke="currentColor" strokeDasharray={`${complianceScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <ShieldCheck size={24} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${complianceScore >= 95 ? 'text-emerald-400' : complianceScore >= 80 ? 'text-yellow-400' : 'text-red-400'}`} />
          </div>
        </div>

        {/* Security Alerts */}
        <div className={`md:col-span-2 rounded-2xl p-6 border shadow-xl relative overflow-hidden ${criticalCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-[#1E293B]/60 border-slate-700/50'}`}>
          {criticalCount > 0 && <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><ShieldAlert size={100} className="text-red-500" /></div>}
          
          <div className="flex items-center gap-3 mb-4">
            {criticalCount > 0 ? <AlertTriangle size={20} className="text-red-500 animate-pulse" /> : <CheckCircle size={20} className="text-emerald-500" />}
            <h2 className={`text-lg font-bold ${criticalCount > 0 ? 'text-red-400' : 'text-white'}`}>Active Security Alerts</h2>
          </div>
          
          {criticalCount > 0 ? (
            <div className="space-y-3 relative z-10">
              {logs.filter(l => l.riskLevel === 'critical').slice(0, 2).map(alert => (
                <div key={alert.id} className="bg-[#0F172A]/80 border border-red-500/30 p-3 rounded-lg flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 animate-ping"></div>
                  <div>
                    <p className="font-bold text-red-400 text-sm">{alert.action}</p>
                    <p className="text-xs text-slate-300 mt-1">{alert.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center opacity-70">
              <ShieldCheck size={32} className="text-emerald-500 mb-2" />
              <p className="text-emerald-400 font-bold">No Critical Security Flags</p>
              <p className="text-xs text-slate-400">System operating within normal parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Immutable Ledger Table */}
      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-700/50 bg-[#0F172A]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Lock size={18} className="text-[#F59E0B]" />
            <h2 className="text-lg font-bold text-white">Immutable Audit Trail</h2>
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all text-sm"
              />
            </div>
            <select 
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="py-2 px-3 bg-[#0F172A] border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-[#F59E0B]"
            >
              <option value="all">All Risks</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A]/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/50">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Security Action</th>
                <th className="p-4 font-medium">Performed By</th>
                <th className="p-4 font-medium text-center">Risk Level</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-700/30">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <RefreshCw size={32} className="animate-spin text-[#F59E0B] mx-auto mb-4" />
                    <p className="text-slate-400">Loading secure logs...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-red-500">
                    <ShieldAlert size={32} className="mx-auto mb-4" />
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-400">
                    <Activity size={48} className="mx-auto mb-4 opacity-50 text-slate-500" />
                    <p className="text-lg">No audit logs found.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#0F172A]/40 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-xs text-slate-400 bg-[#0F172A] px-2 py-1 rounded border border-slate-700">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">{log.action}</p>
                      <p className="text-xs text-slate-400 mt-1">{log.detail}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                          <Eye size={12} className="text-slate-300" />
                        </div>
                        <span className="text-slate-300 text-xs font-bold">{log.performedBy}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2 py-1 border rounded text-[10px] font-bold uppercase tracking-wider ${getRiskColor(log.riskLevel)}`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-bold text-slate-300">{log.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-700/50 bg-[#0F172A]/80 flex justify-between items-center text-xs text-slate-500">
          <p className="flex items-center gap-1"><Lock size={12}/> Logs are immutable and cryptographically secured.</p>
          <p>Total Records: {filteredLogs.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerAudit;
