import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, CreditCard, RefreshCw, Eye, Lock, Unlock, X, ShieldAlert, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { getCustomers, updateCustomerStatus, registerUser, updateCustomer, deleteCustomer } from '../../services/api';

const ManagerCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedCustomer, setSelectedCustomer] = useState(null); // For View Profile Modal
  
  // Modals state for CRUD
  const [showCrudModal, setShowCrudModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({ 
    fullName: '', email: '', mobileNumber: '', password: '', 
    accountType: 'savings', balance: 0, dateOfBirth: '', gender: '', 
    governmentId: '', maritalStatus: '', address: '' 
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleToggleBlock = async (customerId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await updateCustomerStatus(customerId, newStatus);
      if (res.success) {
        setCustomers(customers.map(c => c.id === customerId ? { ...c, isBlocked: newStatus } : c));
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer({ ...selectedCustomer, isBlocked: newStatus });
        }
      } else {
        alert('Failed to update customer status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred.');
    }
  };

  const handleOpenCrudModal = (mode, customer = null) => {
    setModalMode(mode);
    if (mode === 'edit' && customer) {
      setCurrentCustomer(customer);
      setFormData({
        fullName: customer.fullName || '',
        email: customer.email || '',
        mobileNumber: customer.mobileNumber || '',
        password: customer.password || '', // Usually shouldn't show this, but for demo admin purposes
        accountType: customer.accountType || 'savings',
        balance: customer.balance || 0,
        dateOfBirth: customer.dateOfBirth || '',
        gender: customer.gender || '',
        governmentId: customer.governmentId || '',
        maritalStatus: customer.maritalStatus || '',
        address: customer.address || ''
      });
    } else {
      setCurrentCustomer(null);
      setFormData({ 
        fullName: '', email: '', mobileNumber: '', password: '', 
        accountType: 'savings', balance: 0, dateOfBirth: '', gender: '', 
        governmentId: '', maritalStatus: '', address: '' 
      });
    }
    setShowCrudModal(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (modalMode === 'add') {
        const res = await registerUser({ ...formData, role: 'customer' });
        if (res.success) {
          fetchCustomers();
          setShowCrudModal(false);
        } else {
          alert("Failed to add customer: " + (res.message || "Unknown error"));
        }
      } else {
        // Edit mode
        const res = await updateCustomer(currentCustomer.id, formData);
        if (res.success) {
          setCustomers(customers.map(c => c.id === currentCustomer.id ? { ...c, ...formData } : c));
          setShowCrudModal(false);
        } else {
          alert("Failed to update customer: " + (res.message || "Unknown error"));
        }
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    const res = await deleteCustomer(deleteCandidate.id);
    if (res.success) {
      setCustomers(customers.filter(c => c.id !== deleteCandidate.id));
      setDeleteCandidate(null);
    } else {
      alert("Failed to delete customer.");
    }
    setIsDeleting(false);
  };

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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Global Customer Database</h1>
          <p className="text-slate-400 text-sm mt-1">Advanced customer monitoring, KYC verification, and account control.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchCustomers}
            className="px-4 py-2 bg-[#1E293B] border border-slate-600 text-slate-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Sync Data
          </button>
          <button 
            onClick={() => handleOpenCrudModal('add')}
            className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#F59E0B]/20 transition-all active:scale-95"
          >
            <Plus size={16} /> Add Customer
          </button>
        </div>
      </div>

      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, account no, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Total Records:</span>
            <span className="text-sm font-bold text-white">{customers.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A]/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/50">
                <th className="p-4 font-medium whitespace-nowrap">Customer Details</th>
                <th className="p-4 font-medium whitespace-nowrap">Contact Info</th>
                <th className="p-4 font-medium whitespace-nowrap">Account Info</th>
                <th className="p-4 font-medium whitespace-nowrap">Status</th>
                <th className="p-4 font-medium text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <RefreshCw size={24} className="animate-spin text-[#F59E0B] mx-auto mb-3" />
                    <p className="text-slate-400">Loading customer database...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <User size={32} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-300 text-lg font-medium">No customers found</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b border-slate-700/30 hover:bg-[#0F172A]/40 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-[#F59E0B] flex items-center justify-center shrink-0 shadow-inner">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-[#F59E0B] transition-colors flex items-center gap-2">
                            {customer.fullName || 'Unknown Customer'}
                            {customer.isBlocked && (
                              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wider">FROZEN</span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">{customer.accountType || 'Savings'} A/C</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center text-slate-300 text-xs">
                          <Mail size={14} className="mr-1.5 text-slate-500 shrink-0" /> 
                          <span className="truncate max-w-[180px]">{customer.email}</span>
                        </div>
                        <div className="flex items-center text-slate-300 text-xs">
                          <Phone size={14} className="mr-1.5 text-slate-500 shrink-0" /> 
                          {customer.mobileNumber || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center text-slate-200 text-xs font-mono font-medium tracking-wide">
                          <CreditCard size={14} className="mr-1.5 text-slate-500 shrink-0" /> 
                          {customer.accountNumber || 'Pending'}
                        </div>
                        <span className="text-xs text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20 inline-block w-fit font-mono">
                          IFSC: {customer.ifscCode || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                       <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${customer.isBlocked ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {customer.isBlocked ? 'Frozen' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => handleToggleBlock(customer.id, customer.isBlocked)}
                          className={`p-2 rounded-lg transition-colors ${customer.isBlocked ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-orange-400 hover:bg-orange-500/10'}`}
                          title={customer.isBlocked ? "Unfreeze Account" : "Freeze Account"}
                        >
                          {customer.isBlocked ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>
                        <button 
                          onClick={() => handleOpenCrudModal('edit', customer)}
                          className="p-2 text-slate-400 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="View Full Profile"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => setDeleteCandidate(customer)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-[#0F172A]/80">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Customer Profile
                  {selectedCustomer.isBlocked && (
                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2 py-0.5 rounded font-bold tracking-wider ml-2">FROZEN ACCOUNT</span>
                  )}
                </h2>
                <p className="text-sm text-slate-400 mt-1">Detailed KYC information and account status</p>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8">
              {/* Profile Header */}
              <div className="flex items-center gap-5 bg-[#0F172A]/50 p-6 rounded-xl border border-slate-700/50">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F59E0B] to-yellow-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                  <User size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedCustomer.fullName}</h3>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span className="text-sm text-slate-400"><strong className="text-slate-300">DOB:</strong> {selectedCustomer.dateOfBirth || 'N/A'}</span>
                    <span className="text-sm text-slate-400"><strong className="text-slate-300">Gender:</strong> {selectedCustomer.gender || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Overview */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                    <CreditCard size={18} className="text-[#F59E0B]" /> Financial Overview
                  </h4>
                  <div className="bg-[#0F172A]/30 p-4 rounded-xl border border-slate-700/30 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Account Type</span><span className="font-medium text-slate-200 capitalize">{selectedCustomer.accountType} Account</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Account Number</span><span className="font-mono font-medium text-slate-200">{selectedCustomer.accountNumber || 'Pending'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">IFSC Code</span><span className="font-mono font-medium text-slate-200">{selectedCustomer.ifscCode || 'Pending'}</span></div>
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-700/50">
                      <span className="text-slate-400 font-medium">Current Balance</span>
                      <span className="font-bold text-xl text-emerald-400">₹{(selectedCustomer.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Contact & KYC Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-[#F59E0B]" /> Contact & KYC
                  </h4>
                  <div className="bg-[#0F172A]/30 p-4 rounded-xl border border-slate-700/30 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="font-medium text-slate-200">{selectedCustomer.email}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Mobile</span><span className="font-medium text-slate-200">{selectedCustomer.mobileNumber}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Govt ID (PAN/Aadhar)</span><span className="font-medium text-slate-200">{selectedCustomer.governmentId || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Marital Status</span><span className="font-medium text-slate-200 capitalize">{selectedCustomer.maritalStatus || 'N/A'}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700/50 bg-[#0F172A]/80 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 bg-transparent border border-slate-600 text-slate-300 font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showCrudModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-[#0F172A]/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {modalMode === 'add' ? <Plus size={18} className="text-[#F59E0B]"/> : <Edit2 size={18} className="text-[#F59E0B]"/>}
                {modalMode === 'add' ? 'Add New Customer' : 'Edit Customer Profile'}
              </h2>
              <button 
                onClick={() => setShowCrudModal(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="crudForm" onSubmit={handleSaveCustomer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                    <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Mobile Number</label>
                    <input type="text" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] focus:outline-none" required />
                  </div>
                  {modalMode === 'add' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Temporary Password</label>
                      <input type="text" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] focus:outline-none" required />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Account Type</label>
                    <select value={formData.accountType} onChange={(e) => setFormData({...formData, accountType: e.target.value})} className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] focus:outline-none">
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                      <option value="salary">Salary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Initial Balance (₹)</label>
                    <input type="number" value={formData.balance} onChange={(e) => setFormData({...formData, balance: Number(e.target.value)})} className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Date of Birth</label>
                    <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Gender</label>
                    <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] focus:outline-none">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Government ID (Aadhar/PAN)</label>
                    <input type="text" value={formData.governmentId} onChange={(e) => setFormData({...formData, governmentId: e.target.value})} className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                  <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="2" className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] focus:outline-none"></textarea>
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-slate-700/50 bg-[#0F172A]/50 flex gap-3">
              <button type="button" onClick={() => setShowCrudModal(false)} className="flex-1 px-4 py-2.5 bg-transparent border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button type="submit" form="crudForm" disabled={isSaving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#F59E0B] to-yellow-600 text-white font-bold rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2">
                {isSaving && <RefreshCw size={16} className="animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertTriangle size={32} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Permanently Delete Customer?</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to permanently remove <strong className="text-slate-200">{deleteCandidate.fullName}</strong> and their account data? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteCandidate(null)}
                  className="flex-1 px-4 py-2.5 bg-transparent border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-800 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isDeleting && <RefreshCw size={16} className="animate-spin" />}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerCustomers;
