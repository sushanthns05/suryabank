import React, { useEffect, useState } from 'react';
import { UserPlus, Mail, Lock, RefreshCw, CheckCircle, CalendarDays, Check, Phone, MapPin, CreditCard, Info, IdCard } from 'lucide-react';

const ACCOUNT_TYPES = [
  {
    id: 'savings',
    name: 'Savings Account',
    details: 'Designed for individuals to park excess funds safely while earning modest interest. Best For: Everyday savings, emergency funds, and personal short-term goals.'
  },
  {
    id: 'current',
    name: 'Current Account (Checking)',
    details: 'Primarily utilized by business owners, traders, and corporations requiring frequent and high-volume transactions.'
  },
  {
    id: 'salary',
    name: 'Salary Account',
    details: 'A zero-balance account opened by employers in tie-up with specific banks to directly credit employee salaries.'
  },
  {
    id: 'fixed_deposit',
    name: 'Fixed Deposit (FD)',
    details: 'A low-risk investment option where a lump sum is locked in for a predetermined tenure to earn a guaranteed, higher interest rate.'
  },
  {
    id: 'recurring_deposit',
    name: 'Recurring Deposit (RD)',
    details: 'Allows individuals to invest a fixed, smaller amount regularly (usually monthly) to steadily build savings.'
  },
  {
    id: 'nri',
    name: 'NRI Accounts',
    details: 'Specialized accounts meant for Non-Resident Indians to manage their earnings in India or abroad.'
  },
  {
    id: 'demat',
    name: 'Demat Account',
    details: 'A digital account used to securely hold and trade financial securities in electronic form rather than physical certificates.'
  }
];

const EmployeeDashboard = () => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '',
    mobileNumber: '',
    presentAddress: '',
    permanentAddress: '',
    governmentId: '',
    accountType: 'savings'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [consultations, setConsultations] = useState([]);
  const [loadingConsultations, setLoadingConsultations] = useState(true);

  const fetchConsultations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/consultations');
      const data = await response.json();
      if (data.success) {
        setConsultations(data.data);
      }
    } catch (err) {
      console.error("Error fetching consultations:", err);
    } finally {
      setLoadingConsultations(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'employee') {
      window.location.href = '/employee-login';
      return;
    }
    fetchConsultations();
  }, []);

  const handleVerifyConsultation = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/consultations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' })
      });
      const data = await response.json();
      if (data.success) {
        setConsultations(consultations.map(c => c.id === id ? { ...c, status: 'verified' } : c));
      }
    } catch (err) {
      console.error("Error verifying consultation:", err);
      alert("Failed to verify consultation.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.mobileNumber || !formData.presentAddress || !formData.permanentAddress || !formData.governmentId || !formData.accountType) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'customer',
          balance: 1000.00
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create customer account.');
      }

      setMessage(`Customer account for ${formData.fullName} successfully created! Verification email sent.`);
      setFormData({ 
        fullName: '', email: '', password: '', mobileNumber: '',
        presentAddress: '', permanentAddress: '', governmentId: '', accountType: 'savings'
      });

    } catch (err) {
      console.error('Error creating customer:', err);
      setError(err.message || 'Failed to create customer account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customer Operations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage offline branch operations and consultations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Create Customer Card */}
        <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-surya-primary dark:text-surya-secondary rounded-lg">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Create Offline Customer</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Register a new branch walk-in customer.</p>
            </div>
          </div>

          <form onSubmit={handleCreateCustomer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Customer Name" 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary dark:focus:ring-surya-secondary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Government ID (Aadhaar/PAN)</label>
                <div className="relative">
                  <IdCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    name="governmentId"
                    placeholder="ID Number" 
                    value={formData.governmentId}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="customer@example.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="tel" 
                    name="mobileNumber"
                    placeholder="+91 98765 43210" 
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Present Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                  <textarea 
                    name="presentAddress"
                    placeholder="Street, City, Zip" 
                    value={formData.presentAddress}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors resize-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Permanent Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                  <textarea 
                    name="permanentAddress"
                    placeholder="Same as present address" 
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type of Account</label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors appearance-none"
                  >
                    {ACCOUNT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Temporary Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    name="password"
                    placeholder="Secure temp password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex gap-3 text-sm text-slate-600 dark:text-slate-400">
              <Info size={18} className="shrink-0 text-surya-primary dark:text-surya-secondary mt-0.5" />
              <p>{ACCOUNT_TYPES.find(t => t.id === formData.accountType)?.details}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}
            
            {message && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg border border-green-100 dark:border-green-900/30 flex items-center gap-2">
                <CheckCircle size={18} /> {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-2.5 bg-surya-primary text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={20} /> : 'Create Customer Account'}
            </button>
          </form>
        </div>

        {/* Consultation Queue Card */}
        <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <CalendarDays size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Consultation Requests</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Verify customer consultation bookings.</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {loadingConsultations ? (
              <div className="flex justify-center items-center h-32 text-slate-400">
                <RefreshCw className="animate-spin" size={24} />
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-10">
                <CalendarDays size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No consultation requests found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.map(consult => (
                  <div key={consult.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-slate-200 dark:hover:border-slate-700">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {consult.name} 
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({consult.email})</span>
                      </h4>
                      <div className="mt-1 flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                        <p><span className="font-medium text-slate-400">Topic:</span> {consult.topic}</p>
                        <p><span className="font-medium text-slate-400">Date:</span> <span className="text-surya-primary dark:text-surya-secondary font-medium">{consult.date}</span></p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {consult.status === 'pending' ? (
                        <button 
                          onClick={() => handleVerifyConsultation(consult.id)} 
                          className="px-4 py-2 bg-surya-success text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center shadow-sm w-full sm:w-auto justify-center"
                        >
                          <Check size={16} className="mr-1.5" /> Verify
                        </button>
                      ) : (
                        <span className="flex items-center gap-1.5 text-surya-success font-bold text-sm bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-900/30">
                          <CheckCircle size={16} /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;
