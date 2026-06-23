import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, CreditCard, RefreshCw, Eye, Lock, Unlock, X, Edit2, Save } from 'lucide-react';
import { getCustomers, updateCustomerStatus, scheduleUserUpdate } from '../../services/api';
import { sendProfileUpdateEmail } from '../../utils/emailService';

const EmployeeSearchCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

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

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setEditFormData({
      fullName: customer.fullName || '',
      dateOfBirth: customer.dateOfBirth || '',
      gender: customer.gender || '',
      email: customer.email || '',
      mobileNumber: customer.mobileNumber || '',
      governmentId: customer.governmentId || '',
      maritalStatus: customer.maritalStatus || '',
      address: customer.address || '',
      presentAddress: customer.presentAddress || '',
      permanentAddress: customer.permanentAddress || ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const instantChanges = {};
      const pendingChanges = {};
      const changesList = [];
      const criticalFields = ['fullName', 'governmentId', 'mobileNumber', 'email'];
      
      Object.keys(editFormData).forEach(key => {
        if (editFormData[key] !== editingCustomer[key]) {
          if (criticalFields.includes(key)) {
            pendingChanges[key] = editFormData[key];
            changesList.push({ field: key, oldValue: editingCustomer[key], newValue: editFormData[key] });
          } else {
            instantChanges[key] = editFormData[key];
          }
        }
      });
      
      const res = await scheduleUserUpdate(editingCustomer.id, instantChanges, pendingChanges);
      if (res.success) {
        if (changesList.length > 0) {
          await sendProfileUpdateEmail(editingCustomer.email, editingCustomer.fullName, changesList);
          alert('Critical changes have been scheduled and the customer has been notified via email.');
        } else {
          alert('Profile updated successfully.');
        }
        setEditingCustomer(null);
        fetchCustomers();
      } else {
        alert('Failed to update profile: ' + res.message);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleBlock = async (customerId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updateCustomerStatus(customerId, newStatus);
      // Update local state without re-fetching
      setCustomers(customers.map(c => c.id === customerId ? { ...c, isBlocked: newStatus } : c));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update customer status.');
    }
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
                          <p className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            {customer.fullName || 'Unknown Customer'}
                            {customer.isBlocked && (
                              <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wider">BLOCKED</span>
                            )}
                          </p>
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
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => handleToggleBlock(customer.id, customer.isBlocked)}
                          className={`p-2 rounded-lg transition-colors ${customer.isBlocked ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'}`}
                          title={customer.isBlocked ? "Unblock Account" : "Block Account"}
                        >
                          {customer.isBlocked ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>
                        <button 
                          onClick={() => handleEditClick(customer)}
                          className="p-2 text-slate-400 hover:text-surya-primary dark:hover:text-surya-secondary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-2 text-slate-400 hover:text-surya-primary dark:hover:text-surya-secondary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
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

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  Customer Profile
                  {selectedCustomer.isBlocked && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">BLOCKED</span>
                  )}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed information and account status</p>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedCustomer.fullName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex gap-4">
                    <span><strong className="text-slate-700 dark:text-slate-300">DOB:</strong> {selectedCustomer.dateOfBirth || 'N/A'}</span>
                    <span><strong className="text-slate-700 dark:text-slate-300">Gender:</strong> {selectedCustomer.gender || 'N/A'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Account Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Account Type</span><span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{selectedCustomer.accountType} Account</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Account Number</span><span className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedCustomer.accountNumber || 'Pending'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">IFSC Code</span><span className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedCustomer.ifscCode || 'Pending'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Current Balance</span><span className="font-bold text-surya-success">₹{(selectedCustomer.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Account Status</span><span className={`font-medium ${selectedCustomer.isBlocked ? 'text-red-500' : 'text-surya-success'}`}>{selectedCustomer.isBlocked ? 'Blocked' : 'Active'}</span></div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Contact & ID Info</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Email</span><span className="font-medium text-slate-800 dark:text-slate-200">{selectedCustomer.email}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Mobile Number</span><span className="font-medium text-slate-800 dark:text-slate-200">{selectedCustomer.mobileNumber}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Govt ID (Aadhar/PAN)</span><span className="font-medium text-slate-800 dark:text-slate-200">{selectedCustomer.governmentId || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Marital Status</span><span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{selectedCustomer.maritalStatus || 'N/A'}</span></div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Residential Address</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  {selectedCustomer.address || 'No address provided'}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close Profile
              </button>
              <button 
                onClick={() => {
                  handleToggleBlock(selectedCustomer.id, selectedCustomer.isBlocked);
                  setSelectedCustomer({...selectedCustomer, isBlocked: !selectedCustomer.isBlocked});
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedCustomer.isBlocked ? 'bg-surya-success text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
              >
                {selectedCustomer.isBlocked ? <Unlock size={16} /> : <Lock size={16} />}
                {selectedCustomer.isBlocked ? 'Unblock Account' : 'Block Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  Edit Customer Profile
                </h2>
                <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">Note: Changes to Name, Govt ID, Mobile, or Email are delayed by 24h.</p>
              </div>
              <button 
                onClick={() => setEditingCustomer(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={editFormData.fullName} onChange={handleEditChange} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input type="email" name="email" value={editFormData.email} onChange={handleEditChange} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
                  <input type="text" name="mobileNumber" value={editFormData.mobileNumber} onChange={handleEditChange} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Government ID *</label>
                  <input type="text" name="governmentId" value={editFormData.governmentId} onChange={handleEditChange} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={editFormData.dateOfBirth} onChange={handleEditChange} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select name="gender" value={editFormData.gender} onChange={handleEditChange} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Marital Status</label>
                  <select name="maritalStatus" value={editFormData.maritalStatus} onChange={handleEditChange} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white">
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Number (Read-only)</label>
                  <input type="text" value={editingCustomer.accountNumber} disabled className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Present Address</label>
                <textarea name="presentAddress" value={editFormData.presentAddress} onChange={handleEditChange} rows="2" className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Permanent Address</label>
                <textarea name="permanentAddress" value={editFormData.permanentAddress} onChange={handleEditChange} rows="2" className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white"></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button 
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-surya-primary text-white hover:bg-blue-600 disabled:opacity-50"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSearchCustomer;
