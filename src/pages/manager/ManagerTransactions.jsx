import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, RefreshCw, ArrowUpRight, ArrowDownRight, 
  Filter, IndianRupee, Activity, ShieldAlert, FileText, CheckCircle
} from 'lucide-react';
import { getAllTransactions } from '../../services/api';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const ManagerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'credit', 'debit'

  // Auto-seeding logic for testing Manager view
  const ensureMockData = async (existingTx) => {
    if (existingTx.length === 0) {
      console.log("No transactions found, seeding global ledger...");
      try {
        const txRef = collection(db, 'transactions');
        const mockData = [
          { accountId: 'mock1', accountNumber: '589210473829', type: 'credit', amount: 150000, description: 'Salary Credit - TechCorp', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
          { accountId: 'mock2', accountNumber: '948201847563', type: 'debit', amount: 5000, description: 'ATM Withdrawal - Kengeri', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
          { accountId: 'mock3', accountNumber: '283749501827', type: 'debit', amount: 250000, description: 'RTGS Transfer to HDFC', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
          { accountId: 'mock4', accountNumber: '589210473829', type: 'credit', amount: 12500, description: 'UPI Transfer from Ramesh', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
          { accountId: 'mock5', accountNumber: '102938475610', type: 'credit', amount: 5000000, description: 'Business Loan Disbursement', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
        ];
        
        for (const tx of mockData) {
          await addDoc(txRef, tx);
        }
        return true; // Seeded
      } catch (err) {
        console.error("Failed to seed transactions:", err);
      }
    }
    return false;
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      let data = await getAllTransactions();
      if (data.success) {
        let currentTx = data.data;
        const seeded = await ensureMockData(currentTx);
        if (seeded) {
          data = await getAllTransactions(); // Re-fetch
          currentTx = data.data;
        }
        setTransactions(currentTx);
      } else {
        setError(data.error || 'Failed to fetch ledger');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = (tx.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (tx.accountNumber && tx.accountNumber.includes(searchTerm)) ||
                          (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const totalVolume = transactions.reduce((acc, tx) => acc + Number(tx.amount || 0), 0);
  const totalInflow = transactions.filter(tx => tx.type === 'credit').reduce((acc, tx) => acc + Number(tx.amount || 0), 0);
  const totalOutflow = transactions.filter(tx => tx.type === 'debit').reduce((acc, tx) => acc + Number(tx.amount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Global Transaction Ledger</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time monitoring of all branch financial movements.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchTransactions}
            className="px-4 py-2 bg-[#1E293B] border border-slate-600 text-slate-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Sync Ledger
          </button>
          <button className="px-4 py-2 bg-[#0F172A] border border-[#F59E0B]/30 text-[#F59E0B] rounded-lg text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:bg-[#F59E0B]/10 transition-colors">
            <FileText size={16} /> Export Audit
          </button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Activity size={18} className="text-blue-400" /> <span className="text-sm font-bold uppercase tracking-wider">Total Volume</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{formatCurrency(totalVolume)}</h3>
          <p className="text-xs text-slate-500 mt-1">Across {transactions.length} transactions</p>
        </div>
        
        <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <ArrowDownRight size={18} className="text-emerald-400" /> <span className="text-sm font-bold uppercase tracking-wider">Money In (Credits)</span>
          </div>
          <h3 className="text-2xl font-bold text-emerald-400">{formatCurrency(totalInflow)}</h3>
          <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-500">
            <ArrowDownRight size={80} className="text-emerald-500" />
          </div>
        </div>

        <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <ArrowUpRight size={18} className="text-red-400" /> <span className="text-sm font-bold uppercase tracking-wider">Money Out (Debits)</span>
          </div>
          <h3 className="text-2xl font-bold text-red-400">{formatCurrency(totalOutflow)}</h3>
           <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-500">
            <ArrowUpRight size={80} className="text-red-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-[#0F172A] rounded-xl p-5 border border-red-500/20 shadow-lg">
          <div className="flex items-center gap-3 mb-2 text-red-400">
            <ShieldAlert size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Flagged</span>
          </div>
          <h3 className="text-2xl font-bold text-white">0</h3>
          <p className="text-xs text-slate-500 mt-1">Suspicious activities</p>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-lg flex flex-col">
        {/* Controls */}
        <div className="p-4 border-b border-slate-700/50 bg-[#0F172A]/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Txn ID, Account, or Description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all text-sm"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="bg-[#0F172A] border border-slate-700 rounded-lg flex items-center p-1">
              <button onClick={() => setTypeFilter('all')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${typeFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}>All</button>
              <button onClick={() => setTypeFilter('credit')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${typeFilter === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-emerald-400'}`}>Credits</button>
              <button onClick={() => setTypeFilter('debit')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${typeFilter === 'debit' ? 'bg-red-500/20 text-red-400' : 'text-slate-400 hover:text-red-400'}`}>Debits</button>
            </div>
            <button className="px-3 py-2 bg-[#0F172A] border border-slate-700 text-slate-300 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors">
              <Filter size={16} /> <span className="hidden sm:inline text-sm">Filter</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A]/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/50">
                <th className="p-4 font-medium whitespace-nowrap">Transaction Info</th>
                <th className="p-4 font-medium whitespace-nowrap">Account Details</th>
                <th className="p-4 font-medium whitespace-nowrap">Amount</th>
                <th className="p-4 font-medium whitespace-nowrap">Status</th>
                <th className="p-4 font-medium text-right whitespace-nowrap">Receipt</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-700/30">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <RefreshCw size={32} className="animate-spin text-[#F59E0B] mx-auto mb-4" />
                    <p className="text-slate-400">Syncing live ledger from core banking system...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-red-500">
                    <ShieldAlert size={32} className="mx-auto mb-4" />
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-400">
                    <CreditCard size={48} className="mx-auto mb-4 opacity-50 text-slate-500" />
                    <p className="text-lg">No transactions match your search.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#0F172A]/40 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {tx.type === 'credit' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{tx.description || 'Fund Transfer'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[10px] text-slate-500 bg-[#0F172A] px-1.5 py-0.5 rounded border border-slate-700">TXN: {tx.id.substring(0, 12).toUpperCase()}</span>
                            <span className="text-[10px] text-slate-500">{new Date(tx.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-300 font-mono text-sm">
                        <CreditCard size={14} className="text-slate-500" />
                        {tx.accountNumber || 'Unknown'}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className={`font-bold text-lg ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        <CheckCircle size={10} /> Settled
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-colors">
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerTransactions;
