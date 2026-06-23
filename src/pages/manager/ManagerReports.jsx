import React, { useState } from 'react';
import { 
  FileText, Calendar, Filter, Download, Activity, CheckCircle, 
  XCircle, Printer, Loader2, ArrowRight
} from 'lucide-react';
import { getAllTransactions, getLoans, getCustomers } from '../../services/api';
import { generateReportPDF } from '../../utils/pdfGenerator';

const ManagerReports = () => {
  const [reportType, setReportType] = useState('transactions'); // 'transactions', 'loans', 'customers'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select a valid date range.');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    setReportData(null);
    
    try {
      let dataResponse;
      if (reportType === 'transactions') {
        dataResponse = await getAllTransactions();
      } else if (reportType === 'loans') {
        dataResponse = await getLoans();
      } else if (reportType === 'customers') {
        dataResponse = await getCustomers();
      }

      if (dataResponse && dataResponse.success) {
        // Filter by date range
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);
        
        const filtered = dataResponse.data.filter(item => {
          // Determine the correct date field based on type
          let itemDateStr = item.createdAt || item.timestamp || item.date;
          if (!itemDateStr) return false;
          
          const itemTime = new Date(itemDateStr).getTime();
          return itemTime >= start && itemTime <= end;
        });

        setReportData({
          type: reportType,
          startDate,
          endDate,
          generatedAt: new Date().toISOString(),
          totalRecords: filtered.length,
          data: filtered
        });
      } else {
        setError(dataResponse?.error || 'Failed to fetch report data.');
      }
    } catch (err) {
      setError('An error occurred while generating the report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (reportData) {
      generateReportPDF(reportData);
    }
  };

  // Helper to get nice title
  const getReportTitle = (type) => {
    switch(type) {
      case 'transactions': return 'Global Transaction Ledger';
      case 'loans': return 'Loan Disbursement Report';
      case 'customers': return 'Customer Acquisition Report';
      default: return 'Custom Report';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Hide controls when printing */}
      <div className="print:hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Reports & Analytics</h1>
            <p className="text-slate-400 text-sm mt-1">Generate official white-paper reports for branch auditing.</p>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-700/50 bg-[#0F172A]/80 flex items-center gap-3">
            <Filter size={20} className="text-[#F59E0B]" />
            <h2 className="text-lg font-bold text-white">Report Configurator</h2>
          </div>
          
          <form onSubmit={handleGenerateReport} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Data Source</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] appearance-none"
                >
                  <option value="transactions">Transaction Ledger</option>
                  <option value="loans">Loan Applications</option>
                  <option value="customers">Customer Accounts</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-[#F59E0B] to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-[#F59E0B]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
                Generate Report
              </button>
            </div>
          </form>

          {error && (
            <div className="px-6 pb-6 text-red-400 text-sm flex items-center gap-2 font-bold">
              <XCircle size={16} /> {error}
            </div>
          )}
        </div>
      </div>

      {/* Rendered Report Area */}
      {reportData && (
        <div className="bg-white print:shadow-none print:border-none shadow-2xl rounded-xl border border-slate-200 overflow-hidden text-slate-800 animate-in slide-in-from-bottom-8 duration-500">
          
          {/* Action Bar (Hidden in Print) */}
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center print:hidden">
            <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              Report successfully generated
            </p>
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-md"
            >
              <Printer size={16} /> Export to PDF
            </button>
          </div>

          {/* Official Document Wrapper (Used for Print) */}
          <div className="p-8 sm:p-12 print:p-0 min-h-[600px]">
            {/* Header / Letterhead */}
            <div className="flex justify-between items-end border-b-2 border-slate-800 pb-6 mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">SURYA BANK</h1>
                <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Kengeri Satellite Town Branch</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-slate-800">{getReportTitle(reportData.type)}</h2>
                <p className="text-xs text-slate-500 mt-1">Generated: {new Date(reportData.generatedAt).toLocaleString()}</p>
                <p className="text-xs text-slate-500">Period: {new Date(reportData.startDate).toLocaleDateString()} to {new Date(reportData.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase">Total Records</p>
                <p className="text-2xl font-black text-slate-800">{reportData.totalRecords}</p>
              </div>
              {reportData.type === 'transactions' && (
                <>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Credit Vol</p>
                    <p className="text-2xl font-black text-slate-800">
                      {formatCurrency(reportData.data.filter(t => t.type === 'credit').reduce((a,b) => a + Number(b.amount||0), 0))}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Debit Vol</p>
                    <p className="text-2xl font-black text-slate-800">
                      {formatCurrency(reportData.data.filter(t => t.type === 'debit').reduce((a,b) => a + Number(b.amount||0), 0))}
                    </p>
                  </div>
                </>
              )}
              {reportData.type === 'loans' && (
                <>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase">Approved Value</p>
                    <p className="text-2xl font-black text-slate-800">
                      {formatCurrency(reportData.data.filter(l => l.status === 'approved').reduce((a,b) => a + Number(b.amount||0), 0))}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase">Pending Review</p>
                    <p className="text-2xl font-black text-slate-800">{reportData.data.filter(l => l.status !== 'approved' && l.status !== 'rejected').length}</p>
                  </div>
                </>
              )}
            </div>

            {/* Data Table */}
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 bg-slate-100">
                  {reportData.type === 'transactions' && (
                    <>
                      <th className="p-3 font-bold text-slate-800">Date/Time</th>
                      <th className="p-3 font-bold text-slate-800">Txn ID</th>
                      <th className="p-3 font-bold text-slate-800">Account No.</th>
                      <th className="p-3 font-bold text-slate-800">Type</th>
                      <th className="p-3 font-bold text-slate-800 text-right">Amount</th>
                    </>
                  )}
                  {reportData.type === 'loans' && (
                    <>
                      <th className="p-3 font-bold text-slate-800">App Date</th>
                      <th className="p-3 font-bold text-slate-800">Applicant</th>
                      <th className="p-3 font-bold text-slate-800">Type</th>
                      <th className="p-3 font-bold text-slate-800">Status</th>
                      <th className="p-3 font-bold text-slate-800 text-right">Requested</th>
                    </>
                  )}
                  {reportData.type === 'customers' && (
                    <>
                      <th className="p-3 font-bold text-slate-800">Join Date</th>
                      <th className="p-3 font-bold text-slate-800">Name</th>
                      <th className="p-3 font-bold text-slate-800">Account No.</th>
                      <th className="p-3 font-bold text-slate-800">PAN</th>
                      <th className="p-3 font-bold text-slate-800 text-right">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportData.data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500 italic">No records found for this period.</td>
                  </tr>
                ) : (
                  reportData.data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {reportData.type === 'transactions' && (
                        <>
                          <td className="p-3 whitespace-nowrap">{new Date(row.timestamp || row.createdAt).toLocaleString()}</td>
                          <td className="p-3 font-mono text-xs">{row.id.substring(0, 8)}</td>
                          <td className="p-3 font-mono">{row.accountNumber || 'N/A'}</td>
                          <td className="p-3 capitalize">{row.type}</td>
                          <td className="p-3 text-right font-mono font-bold">{formatCurrency(row.amount)}</td>
                        </>
                      )}
                      {reportData.type === 'loans' && (
                        <>
                          <td className="p-3 whitespace-nowrap">{new Date(row.createdAt || row.date).toLocaleDateString()}</td>
                          <td className="p-3 font-bold">{row.customerName}</td>
                          <td className="p-3">{row.type}</td>
                          <td className="p-3 capitalize">{row.status.replace(/_/g, ' ')}</td>
                          <td className="p-3 text-right font-mono">{formatCurrency(row.amount)}</td>
                        </>
                      )}
                      {reportData.type === 'customers' && (
                        <>
                          <td className="p-3 whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString()}</td>
                          <td className="p-3 font-bold">{row.fullName}</td>
                          <td className="p-3 font-mono">{row.accountNumber || 'Pending'}</td>
                          <td className="p-3 font-mono">{row.panNumber || 'N/A'}</td>
                          <td className="p-3 text-right">{row.isBlocked ? 'Blocked' : 'Active'}</td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-400">
              <p>*** END OF REPORT ***</p>
              <p>Authorized Signature: ______________________</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagerReports;
