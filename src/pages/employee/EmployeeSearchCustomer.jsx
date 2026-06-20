import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, CreditCard, RefreshCw, Eye } from 'lucide-react';
import { getCustomers } from '../../services/api';

const EmployeeSearchCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      (c.fullName && c.fullName.toLowerCase().includes(term)) ||
      (c.accountNumber && c.accountNumber.includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.mobileNumber && c.mobileNumber.includes(term))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customer Database</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Search and manage all registered bank customers.</p>
        </div>
        <button 
          onClick={fetchCustomers}
          className="px-4 py-2 bg-white dark:bg-surya-surfaceDark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, account no, email, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 outline-none focus:border-surya-primary dark:focus:border-surya-secondary focus:ring-2 focus:ring-surya-primary/20 transition-all text-sm shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium whitespace-nowrap">Customer Details</th>
                <th className="p-4 font-medium whitespace-nowrap">Contact Info</th>
                <th className="p-4 font-medium whitespace-nowrap">Account Info</th>
                <th className="p-4 font-medium whitespace-nowrap">Current Balance</th>
                <th className="p-4 font-medium text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <RefreshCw size={24} className="animate-spin text-surya-primary mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">Loading customer database...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <User size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No customers found</p>
                    <p className="text-slate-400 text-sm mt-1">Try adjusting your search terms or refresh the list.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{customer.fullName || 'Unknown Customer'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-0.5">{customer.accountType || 'Savings'} A/C</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center text-slate-600 dark:text-slate-300 text-xs">
                          <Mail size={14} className="mr-1.5 text-slate-400 shrink-0" /> 
                          <span className="truncate max-w-[180px]">{customer.email}</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300 text-xs">
                          <Phone size={14} className="mr-1.5 text-slate-400 shrink-0" /> 
                          {customer.mobileNumber || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center text-slate-800 dark:text-slate-200 text-xs font-mono font-medium tracking-wide">
                          <CreditCard size={14} className="mr-1.5 text-slate-400 shrink-0" /> 
                          {customer.accountNumber || 'Pending'}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 inline-block w-fit font-mono">
                          IFSC: {customer.ifscCode || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-surya-success text-base">₹{(customer.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        className="p-2 text-slate-400 hover:text-surya-primary dark:hover:text-surya-secondary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
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

export default EmployeeSearchCustomer;
