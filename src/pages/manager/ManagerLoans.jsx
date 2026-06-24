import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, XCircle, RefreshCw, AlertCircle, FileText, IndianRupee, ShieldAlert, TrendingUp } from 'lucide-react';
import { getLoans, updateLoanStatus, createLoan } from '../../services/api';
import { sendLoanFinalEmail } from '../../utils/emailService';

const ManagerLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Auto-seeding logic to ensure the manager has data to test
  const ensureMockData = async (existingLoans) => {
    if (existingLoans.length === 0) {
      console.log("No loans found, seeding mock data...");
      try {
        await createLoan({ customerName: 'Rahul Sharma', type: 'Home Loan', amount: 4500000, tenure: 240, riskScore: 85, cibil: 780 });
        await createLoan({ customerName: 'Priya Patel', type: 'Personal Loan', amount: 500000, tenure: 36, riskScore: 92, cibil: 810 });
        await createLoan({ customerName: 'Amit Kumar', type: 'Car Loan', amount: 800000, tenure: 60, riskScore: 45, cibil: 650 });
        
        // We also need some that are already Level 1 Verified so the manager can approve them immediately!
        const l1 = await createLoan({ customerName: 'Neha Gupta', type: 'Business Loan', amount: 2500000, tenure: 120, riskScore: 88, cibil: 790 });
        await updateLoanStatus(l1.data.id, 'level_1_verified');
        const l2 = await createLoan({ customerName: 'Sanjay Reddy', type: 'Education Loan', amount: 1500000, tenure: 84, riskScore: 75, cibil: 710 });
        await updateLoanStatus(l2.data.id, 'level_1_verified');
      } catch (err) {
        console.error("Failed to seed data:", err);
      }
      return true; // indicates data was seeded
    }
    return false;
  };

  const fetchLoans = async () => {
    setLoading(true);
    setError('');
    try {
      let data = await getLoans();
      if (data.success) {
        let currentLoans = data.data;
        const seeded = await ensureMockData(currentLoans);
        if (seeded) {
          data = await getLoans(); // Re-fetch after seeding
          currentLoans = data.data;
        }
        // Manager focuses primarily on level 1 verified, but can see all.
        setLoans(currentLoans);
      } else {
        setError(data.error || 'Failed to fetch loans');
      }
    } catch (err) {
      setError(err.message || 'Network error while fetching loans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      const data = await updateLoanStatus(id, status);
      if (data.success) {
        setLoans(loans.map(loan => loan.id === id ? { ...loan, status } : loan));
        
        // Find loan to send email
        const targetLoan = loans.find(l => l.id === id);
        if (targetLoan && targetLoan.email && targetLoan.email !== 'N/A (Guest from Services)') {
          if (status === 'approved' || status === 'rejected') {
            sendLoanFinalEmail(targetLoan.email, targetLoan.customerName, targetLoan.type, status).catch(err => console.error("EmailJS Error:", err));
          }
        }
        
        if (selectedLoan && selectedLoan.id === id) {
          setSelectedLoan(null); // close modal after action
        }
      }
    } catch (err) {
      alert('Failed to update loan status.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter to show level_1_verified first
  const pendingManagerApproval = loans.filter(l => l.status === 'level_1_verified');
  const otherLoans = loans.filter(l => l.status !== 'level_1_verified');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Manager Loan Center</h1>
          <p className="text-slate-400 text-sm mt-1">Final executive approval for verified loan applications.</p>
        </div>
        <button 
          onClick={fetchLoans}
          className="px-4 py-2 bg-[#1E293B] border border-slate-600 text-slate-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Sync Live Queue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg border-l-4 border-l-[#F59E0B]">
          <p className="text-sm font-medium text-slate-400 mb-1">Awaiting Your Approval</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-white">{pendingManagerApproval.length}</h3>
            <span className="text-xs text-[#F59E0B] font-bold pb-1">Level 1 Verified</span>
          </div>
        </div>
        <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg border-l-4 border-l-emerald-500">
          <p className="text-sm font-medium text-slate-400 mb-1">Total Approved Value</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-white">
              {formatCurrency(loans.filter(l => l.status === 'approved').reduce((acc, l) => acc + Number(l.amount), 0))}
            </h3>
          </div>
        </div>
        <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-slate-400 mb-1">Awaiting Employee Review</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-white">{loans.filter(l => l.status === 'pending').length}</h3>
            <span className="text-xs text-slate-400 pb-1">Unverified Applications</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 bg-[#0F172A]/80 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <ShieldAlert size={18} className="text-[#F59E0B]"/>
            Final Approval Queue
          </h3>
          <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-xs px-2 py-1 rounded font-bold">Action Required: {pendingManagerApproval.length}</span>
        </div>
        
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 text-slate-400">
            <RefreshCw className="animate-spin mb-4 text-[#F59E0B]" size={32} />
            <p>Loading application queue...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-64 text-red-500">
            <AlertCircle size={32} className="mb-4" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#0F172A]/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/50">
                  <th className="p-4 font-medium">Application</th>
                  <th className="p-4 font-medium">Applicant</th>
                  <th className="p-4 font-medium">Loan Request</th>
                  <th className="p-4 font-medium">Risk Score</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-700/30">
                {/* Render Level 1 Verified First */}
                {pendingManagerApproval.map((loan) => (
                  <LoanRow 
                    key={loan.id} 
                    loan={loan} 
                    onView={() => setSelectedLoan(loan)}
                    formatCurrency={formatCurrency}
                    isActionable={true}
                  />
                ))}
                {/* Render Others Below with Opacity */}
                {otherLoans.map((loan) => (
                  <LoanRow 
                    key={loan.id} 
                    loan={loan} 
                    onView={() => setSelectedLoan(loan)}
                    formatCurrency={formatCurrency}
                    isActionable={false}
                  />
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">No loans found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manager Review Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-700/50 bg-[#0F172A]/80 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase size={18} className="text-[#F59E0B]"/> Executive Loan Review
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">App ID: {selectedLoan.id}</p>
              </div>
              <button onClick={() => setSelectedLoan(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedLoan.customerName}</h3>
                  <p className="text-slate-400 flex items-center gap-1 mt-1">
                    <span className="bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                      {selectedLoan.type}
                    </span>
                    <span className="text-sm"> • Applied {new Date(selectedLoan.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Requested Amount</p>
                  <p className="text-3xl font-bold text-emerald-400">{formatCurrency(selectedLoan.amount)}</p>
                  <p className="text-sm text-slate-300 mt-1">Tenure: {selectedLoan.tenure} Months</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0F172A]/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${selectedLoan.cibil > 750 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                    {selectedLoan.cibil || 750}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">CIBIL Score</p>
                    <p className="text-sm text-slate-200 mt-0.5">{selectedLoan.cibil > 750 ? 'Excellent' : 'Fair'} Standing</p>
                  </div>
                </div>
                
                <div className="bg-[#0F172A]/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${selectedLoan.riskScore > 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {selectedLoan.riskScore || 85}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">AI Risk Score</p>
                    <p className="text-sm text-slate-200 mt-0.5">{selectedLoan.riskScore > 80 ? 'Low Risk' : 'High Risk'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 mb-6 text-sm text-slate-300">
                <div className="flex items-center gap-2 mb-2 font-bold text-white">
                  <CheckCircle size={16} className="text-emerald-400"/> Level 1 Verification Passed
                </div>
                <p>Employee remarks: All KYC documents, income proofs, and property evaluations have been manually verified and found authentic. Forwarding to Manager for final disbursement approval.</p>
              </div>

              {selectedLoan.status === 'level_1_verified' ? (
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleStatusUpdate(selectedLoan.id, 'rejected')}
                    disabled={actionLoading === selectedLoan.id}
                    className="flex-1 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Reject Application
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedLoan.id, 'approved')}
                    disabled={actionLoading === selectedLoan.id}
                    className="flex-[2] px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {actionLoading === selectedLoan.id ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    Authorize Final Approval
                  </button>
                </div>
              ) : (
                <div className="text-center p-4 bg-[#0F172A]/50 border border-slate-700 rounded-xl">
                  <p className="text-slate-400">This loan is currently <strong className={`capitalize ${selectedLoan.status === 'approved' ? 'text-emerald-400' : selectedLoan.status === 'rejected' ? 'text-red-400' : 'text-[#F59E0B]'}`}>{selectedLoan.status.replace(/_/g, ' ')}</strong>.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper component for table rows
const LoanRow = ({ loan, onView, formatCurrency, isActionable }) => {
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Approved</span>;
      case 'rejected': return <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Rejected</span>;
      case 'level_1_verified': return <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">Needs Approval</span>;
      default: return <span className="bg-slate-700 text-slate-300 border border-slate-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Pending L1</span>;
    }
  };

  return (
    <tr className={`hover:bg-[#0F172A]/40 transition-colors ${!isActionable && loan.status !== 'level_1_verified' ? 'opacity-60' : ''}`}>
      <td className="p-4">
        <span className="font-mono text-slate-300 font-medium">{loan.id.substring(0, 8)}</span>
        <p className="text-[10px] text-slate-500 mt-1">{new Date(loan.createdAt).toLocaleDateString()}</p>
      </td>
      <td className="p-4">
        <p className="font-bold text-white">{loan.customerName}</p>
        <button onClick={onView} className="text-[11px] text-[#F59E0B] hover:text-yellow-400 mt-0.5 flex items-center gap-1">
          <FileText size={10} /> View KYC
        </button>
      </td>
      <td className="p-4">
        <span className="text-slate-200 font-medium text-xs bg-[#0F172A] px-2 py-1 rounded border border-slate-700">
          {loan.type}
        </span>
        <p className="text-[11px] text-slate-400 mt-1.5">{loan.tenure} Months Tenure</p>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className={loan.riskScore > 80 ? 'text-emerald-400' : 'text-red-400'}/>
          <span className={`font-bold ${loan.riskScore > 80 ? 'text-emerald-400' : 'text-red-400'}`}>{loan.riskScore || 85}</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">Risk Score</p>
      </td>
      <td className="p-4">
        {getStatusBadge(loan.status)}
      </td>
      <td className="p-4 text-right">
        <button 
          onClick={onView}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isActionable ? 'bg-[#F59E0B] text-white hover:bg-yellow-500 shadow-lg shadow-[#F59E0B]/20' : 'bg-[#0F172A] text-slate-300 border border-slate-600 hover:bg-slate-700'}`}
        >
          {isActionable ? 'Review & Approve' : 'View Profile'}
        </button>
      </td>
    </tr>
  );
};

export default ManagerLoans;
