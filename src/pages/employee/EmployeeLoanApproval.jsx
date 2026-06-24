import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, XCircle, RefreshCw, AlertCircle, FileText, IndianRupee } from 'lucide-react';
import { getLoans, updateLoanStatus } from '../../services/api';
import { sendLoanLevel1Email, sendLoanFinalEmail } from '../../utils/emailService';

const EmployeeLoanApproval = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLoans();
      if (data.success) {
        // Employee only sees pending loans
        setLoans(data.data.filter(loan => loan.status === 'pending' || loan.status === 'level_1_verified' || loan.status === 'rejected'));
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
          if (status === 'level_1_verified') {
            sendLoanLevel1Email(targetLoan.email, targetLoan.customerName, targetLoan.type).catch(err => console.error("EmailJS Error:", err));
          } else if (status === 'rejected') {
            sendLoanFinalEmail(targetLoan.email, targetLoan.customerName, targetLoan.type, 'rejected').catch(err => console.error("EmailJS Error:", err));
          }
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Loan Approvals</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review and manage pending loan applications.</p>
        </div>
        <button 
          onClick={fetchLoans}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-slate-700 dark:text-slate-300"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 text-slate-400">
            <RefreshCw className="animate-spin mb-4 text-surya-primary dark:text-surya-secondary" size={32} />
            <p>Loading loan applications...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-64 text-red-500">
            <AlertCircle size={32} className="mb-4" />
            <p>{error}</p>
          </div>
        ) : loans.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-slate-400">
            <Briefcase size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
            <p>No pending loan applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 font-medium">Application ID</th>
                  <th className="p-4 font-medium">Customer Details</th>
                  <th className="p-4 font-medium">Loan Details</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                {loans.map((loan) => (
                  <tr key={loan.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${loan.status !== 'pending' ? 'opacity-60 bg-slate-50 dark:bg-slate-800/30' : ''}`}>
                    <td className="p-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{loan.id.substring(0, 8)}</span>
                      <p className="text-xs text-slate-500 mt-1">{new Date(loan.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800 dark:text-white">{loan.customerName}</p>
                      <button className="text-xs text-surya-primary dark:text-surya-secondary hover:underline mt-1 flex items-center gap-1">
                        <FileText size={12} /> View Profile
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                        {loan.type}
                      </span>
                      <p className="text-xs text-slate-500 mt-1.5">{loan.tenure} Months Tenure</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800 dark:text-white flex items-center">
                        <IndianRupee size={14} className="mr-0.5 text-slate-400" />
                        {formatCurrency(loan.amount).replace('₹', '')}
                      </p>
                    </td>
                    <td className="p-4">
                      {loan.status === 'pending' ? (
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(loan.id, 'level_1_verified')}
                            disabled={actionLoading === loan.id}
                            className="w-full px-3 py-1.5 text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
                            title="Verify Documents & Forward"
                          >
                            {actionLoading === loan.id ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                            Verify & Forward
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(loan.id, 'rejected')}
                            disabled={actionLoading === loan.id}
                            className="w-full px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${loan.status === 'level_1_verified' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            {loan.status === 'level_1_verified' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {loan.status === 'level_1_verified' ? 'Sent to Manager' : 'Rejected'}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeLoanApproval;
