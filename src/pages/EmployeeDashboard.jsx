import React, { useEffect, useState } from 'react';
import { UserPlus, Mail, Lock, Unlock, RefreshCw, CheckCircle, CalendarDays, Check, Phone, MapPin, CreditCard, Info, IdCard, Search, Edit, BookOpen, ArrowUpRight, ArrowDownRight, IndianRupee, History, AlertCircle, Users, Activity, TrendingUp, X } from 'lucide-react';
import { getConsultations, approveConsultation, registerUser, getUserByAccount, updateUserDetails, processTransaction, getTransactions, updateCustomerStatus, getCardApplications, updateCardApplicationStatus, wipeAllCardApplications } from '../services/api';
import { sendWelcomeEmail, sendConsultationApprovalEmail, sendBranchTransactionEmail, sendCardApprovalEmail, sendCustomCustomerEmail } from '../utils/emailService';

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
    dateOfBirth: '',
    gender: 'Male',
    presentAddress: '',
    permanentAddress: '',
    governmentId: '',
    accountType: 'savings',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [consultations, setConsultations] = useState([]);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [approvingConsultation, setApprovingConsultation] = useState(null);
  const [approvalData, setApprovalData] = useState({
    assignedEmployee: localStorage.getItem('employeeName') || '',
    appointmentDate: '',
    appointmentTime: ''
  });
  const [isApproving, setIsApproving] = useState(false);

  // Card Applications
  const [cardApplications, setCardApplications] = useState([]);
  const [loadingCardApps, setLoadingCardApps] = useState(true);

  // --- Account Management State ---
  const [activeTab, setActiveTab] = useState('operations'); // 'operations' | 'management'
  const [lookupData, setLookupData] = useState({ accountNumber: '', ifscCode: '' });
  const [lookedUpUser, setLookedUpUser] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');
  
  // Edit Profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  
  // Transaction Management
  const [txData, setTxData] = useState({ type: 'credit', amount: '', description: '' });
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  const [txMessage, setTxMessage] = useState({ type: '', text: '' });

  // Passbook
  const [userTransactions, setUserTransactions] = useState([]);
  const [isLoadingPassbook, setIsLoadingPassbook] = useState(false);

  // Custom Email Modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  // --------------------------------

  const fetchConsultations = async () => {
    try {
      const data = await getConsultations();
      if (data.success) {
        setConsultations(data.data);
      }
    } catch (err) {
      console.error("Error fetching consultations:", err);
    } finally {
      setLoadingConsultations(false);
    }
  };

  const fetchCardApps = async () => {
    try {
      const data = await getCardApplications();
      if (data.success) {
        setCardApplications(data.data);
      }
    } catch (err) {
      console.error("Error fetching card applications:", err);
    } finally {
      setLoadingCardApps(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'employee') {
      window.location.href = '/employee-login';
      return;
    }
    fetchConsultations();
    fetchCardApps();
  }, []);

  const handleApproveConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!approvingConsultation) return;

    setIsApproving(true);
    try {
      const data = await approveConsultation(approvingConsultation.id, approvalData);
      if (data.success) {
        setConsultations(consultations.map(c => 
          c.id === approvingConsultation.id 
            ? { ...c, status: 'approved', ...approvalData } 
            : c
        ));
        
        // Send email
        await sendConsultationApprovalEmail(
          approvingConsultation.email, 
          approvingConsultation.name, 
          approvingConsultation.topic,
          approvalData.assignedEmployee,
          approvalData.appointmentDate,
          approvalData.appointmentTime
        );
        
        alert("Consultation approved and customer notified successfully.");
        setApprovingConsultation(null);
        setApprovalData({ assignedEmployee: localStorage.getItem('employeeName') || '', appointmentDate: '', appointmentTime: '' });
      } else {
        alert("Failed to approve consultation: " + data.message);
      }
    } catch (err) {
      console.error("Error approving consultation:", err);
      alert("Failed to approve consultation.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleUpdateCardApp = async (id, status) => {
    try {
      const app = cardApplications.find(c => c.id === id);
      let updates = {};
      let cardNumber = null;

      if (status.toLowerCase() === 'approved' && app) {
        // Generate 12 digit card number formatted with spaces
        cardNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString().replace(/(.{4})/g, '$1 ').trim();
        updates.cardNumber = cardNumber;
      }

      const data = await updateCardApplicationStatus(id, status, updates);
      if (data.success) {
        setCardApplications(cardApplications.map(c => c.id === id ? { ...c, status, ...updates } : c));
        
        if (status.toLowerCase() === 'approved' && app) {
          let emailToUse = app.email;
          if (!emailToUse || emailToUse.includes('N/A')) {
             const userRes = await getUserByAccount(app.accountNumber);
             if (userRes.success && userRes.user?.email) {
               emailToUse = userRes.user.email;
             }
          }
          if (emailToUse && !emailToUse.includes('N/A')) {
            try {
              await sendCardApprovalEmail(emailToUse, app.customerName || app.nameOnCard || 'Customer', app.cardType || 'Card', cardNumber);
              alert("Card Approved and email sent successfully to " + emailToUse);
            } catch (emailErr) {
              console.error("EmailJS Error details:", emailErr);
              alert("Card Approved, but failed to send email. Check console for details.");
            }
          } else {
            alert("Card Approved, but no valid email address could be found for this account number.");
          }
        }
      }
    } catch (err) {
      console.error("Error updating card application:", err);
      alert("Failed to update card application.");
    }
  };

  const handleClearAllCards = async () => {
    if (window.confirm("Are you sure you want to permanently delete ALL card application data? This action cannot be undone.")) {
      try {
        setLoadingCardApps(true);
        const res = await wipeAllCardApplications();
        if (res.success) {
          setCardApplications([]);
          alert("All card applications have been deleted successfully.");
        } else {
          alert("Failed to delete card applications: " + res.message);
        }
      } catch (err) {
        alert("An error occurred while deleting.");
      } finally {
        setLoadingCardApps(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError('');
    setMessage('');
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.mobileNumber || !formData.dateOfBirth || !formData.presentAddress || !formData.permanentAddress || !formData.governmentId || !formData.accountType) {
      setError("Please fill in all fields.");
      return;
    }
    if (!formData.agreeTerms) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await registerUser({
        ...formData,
        role: 'customer',
        balance: 1000.00
      });

      const user = data.user;
      const accNo = user?.account_number || 'Pending';
      const ifsc = user?.ifsc_code || 'SURY0123';
      await sendWelcomeEmail(formData.email, formData.fullName, accNo, ifsc);

      setMessage(`Customer account for ${formData.fullName} successfully created! Acc No: ${accNo} | IFSC: ${ifsc}`);
      setFormData({ 
        fullName: '', email: '', password: '', mobileNumber: '',
        dateOfBirth: '', gender: 'Male',
        presentAddress: '', permanentAddress: '', governmentId: '', accountType: 'savings', agreeTerms: false
      });

    } catch (err) {
      console.error('Error creating customer:', err);
      setError(err.message || 'Failed to create customer account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookupAccount = async (e) => {
    e.preventDefault();
    if (!lookupData.accountNumber || !lookupData.ifscCode) return;
    
    setIsLookingUp(true);
    setLookupError('');
    setLookedUpUser(null);
    setProfileMsg({ type: '', text: '' });
    setTxMessage({ type: '', text: '' });

    try {
      const res = await getUserByAccount(lookupData.accountNumber, lookupData.ifscCode);
      if (res.success) {
        setLookedUpUser(res.user);
        setEditProfileData({
          fullName: res.user.fullName || '',
          email: res.user.email || '',
          mobileNumber: res.user.mobileNumber || '',
          presentAddress: res.user.presentAddress || '',
          permanentAddress: res.user.permanentAddress || '',
        });
        fetchUserTransactions(lookupData.accountNumber);
      } else {
        setLookupError(res.message);
      }
    } catch (err) {
      setLookupError(err.message || 'Error looking up account');
    } finally {
      setIsLookingUp(false);
    }
  };

  const fetchUserTransactions = async (accNo) => {
    setIsLoadingPassbook(true);
    try {
      const res = await getTransactions(accNo);
      if (res.success) {
        setUserTransactions(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPassbook(false);
    }
  };

  const handleToggleBlock = async () => {
    if (!lookedUpUser) return;
    try {
      const newStatus = !lookedUpUser.isBlocked;
      await updateCustomerStatus(lookedUpUser.id, newStatus);
      setLookedUpUser({ ...lookedUpUser, isBlocked: newStatus });
      setProfileMsg({ type: 'success', text: `Account successfully ${newStatus ? 'blocked' : 'unblocked'}.` });
    } catch (error) {
      setProfileMsg({ type: 'error', text: 'Failed to update account status.' });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg({ type: '', text: '' });

    try {
      await updateUserDetails(lookedUpUser.id, editProfileData);
      setLookedUpUser({ ...lookedUpUser, ...editProfileData });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditingProfile(false);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleProcessTransaction = async (e) => {
    e.preventDefault();
    if (!txData.amount || parseFloat(txData.amount) <= 0) {
      setTxMessage({ type: 'error', text: 'Enter a valid amount greater than 0' });
      return;
    }

    setIsProcessingTx(true);
    setTxMessage({ type: '', text: '' });

    try {
      const res = await processTransaction(
        lookedUpUser.id, 
        lookedUpUser.account_number, 
        txData.amount, 
        txData.type, 
        txData.description || (txData.type === 'credit' ? 'Deposit at Branch' : 'Withdrawal at Branch')
      );

      if (res.success) {
        setTxMessage({ type: 'success', text: `Successfully processed ${txData.type} of ₹${parseFloat(txData.amount).toFixed(2)}` });
        setTxData({ type: 'credit', amount: '', description: '' });
        
        // Refresh balance and passbook
        const updatedUser = await getUserByAccount(lookupData.accountNumber, lookupData.ifscCode);
        if (updatedUser.success) {
          setLookedUpUser(updatedUser.user);
          // Send Email Notification
          try {
            await sendBranchTransactionEmail(
              updatedUser.user.email,
              updatedUser.user.fullName,
              txData.type,
              txData.amount,
              updatedUser.user.balance,
              txData.description || (txData.type === 'credit' ? 'Deposit at Branch' : 'Withdrawal at Branch')
            );
          } catch (emailErr) {
            console.error("Failed to send transaction email:", emailErr);
          }
        }
        fetchUserTransactions(lookupData.accountNumber);
      } else {
        setTxMessage({ type: 'error', text: res.message });
      }
    } catch (err) {
      setTxMessage({ type: 'error', text: err.message || 'Transaction failed' });
    } finally {
      setIsProcessingTx(false);
    }
  };

  const handleSendCustomEmail = async (e) => {
    e.preventDefault();
    setIsSendingEmail(true);
    try {
      const role = 'Surya Bank Branch Associate';
      await sendCustomCustomerEmail(emailData.email, emailData.name, emailData.subject, emailData.message, role);
      alert('Email sent successfully!');
      setIsEmailModalOpen(false);
      setEmailData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Failed to send email. Check console.');
      console.error(error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const openEmailModal = (name, email, defaultSubject = '') => {
    setEmailData({ name, email, subject: defaultSubject, message: '' });
    setIsEmailModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customer Operations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage offline branch operations and consultations.</p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('operations')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'operations' ? 'bg-white dark:bg-surya-surfaceDark text-surya-primary dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Branch Operations
          </button>
          <button 
            onClick={() => setActiveTab('management')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${activeTab === 'management' ? 'bg-white dark:bg-surya-surfaceDark text-surya-primary dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Search size={16} /> Account Management
          </button>
        </div>
      </div>



      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 fade-in">
        
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                <div className="relative">
                  <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="date" 
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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

            <div className="flex items-start gap-2 mt-2">
              <input 
                type="checkbox" 
                name="agreeTerms" 
                id="agreeTerms" 
                checked={formData.agreeTerms} 
                onChange={handleInputChange} 
                className="mt-1 h-4 w-4 text-surya-primary focus:ring-surya-primary border-slate-300 rounded cursor-pointer" 
              />
              <label htmlFor="agreeTerms" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                I agree to the terms and conditions before creating an account
              </label>
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
                    <div className="shrink-0 flex items-center justify-end">
                      {consult.status === 'pending' ? (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => openEmailModal(consult.name, consult.email, `Regarding your Consultation: ${consult.topic}`)} 
                            className="px-3 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center shadow-sm justify-center"
                            title="Reply via Email"
                          >
                            <Mail size={16} />
                          </button>
                          <button 
                            onClick={() => setApprovingConsultation(consult)} 
                            className="px-4 py-2 bg-surya-success text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center shadow-sm justify-center flex-1"
                          >
                            <Check size={16} className="mr-1.5" /> Approve
                          </button>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1.5 text-surya-success font-bold text-sm bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-900/30 mb-2">
                            <CheckCircle size={16} /> Approved
                          </span>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            <p><strong>Date:</strong> {consult.appointmentDate}</p>
                            <p><strong>Time:</strong> {consult.appointmentTime}</p>
                            <p><strong>Assigned:</strong> {consult.assignedEmployee}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card Applications Card */}
        <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col h-full md:col-span-2 xl:col-span-2">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <CreditCard size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Card Applications</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Review and process new ATM/Debit/Credit card requests.</p>
              </div>
            </div>
            {cardApplications.length > 0 && (
              <button 
                onClick={handleClearAllCards}
                className="px-4 py-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors"
              >
                Clear All Data
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
            {loadingCardApps ? (
              <div className="flex justify-center items-center h-32 text-slate-400">
                <RefreshCw className="animate-spin" size={24} />
              </div>
            ) : cardApplications.length === 0 ? (
              <div className="text-center py-10">
                <CreditCard size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No card applications pending.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cardApplications.map(app => (
                  <div key={app.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-slate-200 dark:hover:border-slate-700">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {app.customerName} 
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({app.accountNumber})</span>
                      </h4>
                      <div className="mt-1 flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                        <p><span className="font-medium text-slate-400">Card Type:</span> <span className="font-bold text-surya-primary dark:text-surya-secondary">{app.cardType}</span></p>
                        {app.cardNumber && <p><span className="font-medium text-slate-400">Card Number:</span> <span className="font-mono text-slate-800 dark:text-white font-bold tracking-wider">{app.cardNumber}</span></p>}
                        <p><span className="font-medium text-slate-400">Name on Card:</span> {app.nameOnCard}</p>
                        <p><span className="font-medium text-slate-400">Delivery:</span> {app.deliveryAddress}</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex gap-2">
                      {app.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleUpdateCardApp(app.id, 'approved')} 
                            className="px-3 py-1.5 bg-surya-success text-white text-xs font-medium rounded hover:bg-green-600 transition-colors shadow-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateCardApp(app.id, 'rejected')} 
                            className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors shadow-sm"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={`flex items-center gap-1.5 font-bold text-sm px-3 py-1.5 rounded-lg border ${app.status === 'approved' ? 'text-surya-success bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' : 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30'}`}>
                          {app.status === 'approved' ? <><CheckCircle size={16} /> Approved</> : <><X size={16} /> Rejected</>}
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
      )}
      {activeTab === 'management' && (
        <div className="fade-in space-y-6">
          {/* Lookup Card */}
          <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Search size={20} className="text-surya-primary" /> Lookup Account
            </h2>
            <form onSubmit={handleLookupAccount} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5 w-full">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Number (12 Digits)</label>
                <input 
                  type="text" 
                  value={lookupData.accountNumber}
                  onChange={(e) => setLookupData({...lookupData, accountNumber: e.target.value})}
                  placeholder="e.g. 123456789012" 
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                />
              </div>
              <div className="md:col-span-5 w-full">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">IFSC Code (8 Digits)</label>
                <input 
                  type="text" 
                  value={lookupData.ifscCode}
                  onChange={(e) => setLookupData({...lookupData, ifscCode: e.target.value})}
                  placeholder="e.g. SURY0123" 
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLookingUp}
                className="md:col-span-2 w-full px-6 py-2.5 bg-surya-primary text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center"
              >
                {isLookingUp ? <RefreshCw className="animate-spin" size={20} /> : 'Search'}
              </button>
            </form>
            {lookupError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle size={18} /> {lookupError}
              </div>
            )}
          </div>

          {lookedUpUser && (
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 fade-in">
              {/* Profile & Fund Management Column */}
              <div className="xl:col-span-1 space-y-6">
                
                {/* Profile Card */}
                <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <UserPlus size={20} className="text-surya-primary" /> Customer Profile
                      {lookedUpUser.isBlocked && (
                        <span className="ml-2 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wider uppercase">Blocked</span>
                      )}
                    </h2>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => openEmailModal(lookedUpUser.fullName, lookedUpUser.email)}
                        className="text-sm font-medium text-slate-500 hover:text-blue-500 flex items-center gap-1"
                      >
                        <Mail size={14} /> Email
                      </button>
                      <button 
                        onClick={handleToggleBlock}
                        className={`text-sm font-medium flex items-center gap-1 ${lookedUpUser.isBlocked ? 'text-red-500 hover:text-red-700' : 'text-slate-400 hover:text-orange-500'}`}
                      >
                        {lookedUpUser.isBlocked ? <><Lock size={14} /> Unblock</> : <><Unlock size={14} /> Block</>}
                      </button>
                      <button 
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="text-sm font-medium text-surya-primary hover:text-blue-700"
                      >
                        {isEditingProfile ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                  </div>
                  
                  {profileMsg.text && (
                    <div className={`mb-4 p-3 text-sm rounded-lg ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {profileMsg.text}
                    </div>
                  )}

                  {isEditingProfile ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                        <input type="text" value={editProfileData.fullName} onChange={e => setEditProfileData({...editProfileData, fullName: e.target.value})} className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Mobile Number</label>
                        <input type="text" value={editProfileData.mobileNumber} onChange={e => setEditProfileData({...editProfileData, mobileNumber: e.target.value})} className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Present Address</label>
                        <textarea value={editProfileData.presentAddress} onChange={e => setEditProfileData({...editProfileData, presentAddress: e.target.value})} className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors" required rows="2" />
                      </div>
                      <button type="submit" disabled={isSavingProfile} className="w-full py-2 bg-surya-primary text-white rounded font-medium text-sm">
                        {isSavingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <div><p className="text-xs text-slate-500">Full Name</p><p className="font-medium text-slate-800 dark:text-white">{lookedUpUser.fullName}</p></div>
                      <div><p className="text-xs text-slate-500">Email</p><p className="font-medium text-slate-800 dark:text-white">{lookedUpUser.email}</p></div>
                      <div><p className="text-xs text-slate-500">Mobile</p><p className="font-medium text-slate-800 dark:text-white">{lookedUpUser.mobileNumber}</p></div>
                      <div><p className="text-xs text-slate-500">Account Type</p><p className="font-medium uppercase text-slate-800 dark:text-white">{lookedUpUser.accountType}</p></div>
                    </div>
                  )}
                </div>

                {/* Fund Management Card */}
                <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                    <IndianRupee size={20} className="text-surya-primary" /> Funds
                  </h2>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg mb-4 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Current Balance</p>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white">₹{parseFloat(lookedUpUser.balance || 0).toFixed(2)}</h3>
                  </div>

                  {txMessage.text && (
                    <div className={`mb-4 p-3 text-sm rounded-lg flex items-center gap-2 ${txMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {txMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      {txMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleProcessTransaction} className="space-y-4">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      <button type="button" onClick={() => setTxData({...txData, type: 'credit'})} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${txData.type === 'credit' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}>Credit (+)</button>
                      <button type="button" onClick={() => setTxData({...txData, type: 'debit'})} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${txData.type === 'debit' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}>Debit (-)</button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Amount (₹)</label>
                      <input type="number" min="0.01" step="0.01" value={txData.amount} onChange={e => setTxData({...txData, amount: e.target.value})} className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                      <input type="text" value={txData.description} onChange={e => setTxData({...txData, description: e.target.value})} placeholder={txData.type === 'credit' ? 'Deposit at Branch' : 'Withdrawal at Branch'} className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors" />
                    </div>
                    <button type="submit" disabled={isProcessingTx} className={`w-full py-2.5 text-white rounded-lg font-medium text-sm flex justify-center items-center ${txData.type === 'credit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                      {isProcessingTx ? <RefreshCw className="animate-spin" size={18} /> : `Process ${txData.type === 'credit' ? 'Credit' : 'Debit'}`}
                    </button>
                  </form>
                </div>

              </div>

              {/* Passbook Column */}
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <BookOpen size={20} className="text-surya-primary" /> Electronic Passbook
                    </h2>
                    <button onClick={() => fetchUserTransactions(lookupData.accountNumber)} className="p-2 text-slate-400 hover:text-surya-primary rounded-lg bg-slate-50 dark:bg-slate-800">
                      <RefreshCw size={16} className={isLoadingPassbook ? 'animate-spin' : ''} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {isLoadingPassbook ? (
                      <div className="flex justify-center items-center h-40 text-slate-400">
                        <RefreshCw className="animate-spin" size={24} />
                      </div>
                    ) : userTransactions.length === 0 ? (
                      <div className="text-center py-12">
                        <History size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-3" />
                        <p className="text-slate-500">No transactions found for this account.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 pr-2">
                        {userTransactions.map(tx => (
                          <div key={tx.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {tx.type === 'credit' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{tx.description}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{new Date(tx.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800 dark:text-white'}`}>
                              {tx.type === 'credit' ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Consultation Approval Modal */}
      {approvingConsultation && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surya-surfaceDark rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CalendarDays size={20} className="text-surya-primary" /> 
                Approve Consultation
              </h3>
              <button 
                onClick={() => setApprovingConsultation(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleApproveConsultationSubmit} className="p-4 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                <p><strong>Customer:</strong> {approvingConsultation.name}</p>
                <p><strong>Topic:</strong> {approvingConsultation.topic}</p>
                <p><strong>Requested Date:</strong> {approvingConsultation.date}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned Employee</label>
                <select 
                  value={approvalData.assignedEmployee}
                  onChange={e => setApprovalData({...approvalData, assignedEmployee: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary"
                  required
                >
                  <option value="" disabled>Select an employee</option>
                  {[
                    "Sushanth N S - Manager and Head of Bank",
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Appointment Date</label>
                  <input 
                    type="date" 
                    value={approvalData.appointmentDate}
                    onChange={e => setApprovalData({...approvalData, appointmentDate: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Appointment Time</label>
                  <input 
                    type="time" 
                    value={approvalData.appointmentTime}
                    onChange={e => setApprovalData({...approvalData, appointmentTime: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setApprovingConsultation(null)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isApproving}
                  className="flex-1 py-2 bg-surya-success text-white font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isApproving ? <RefreshCw className="animate-spin" size={18} /> : <><Check size={18} /> Confirm & Notify</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surya-surfaceDark rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Mail size={20} className="text-surya-primary" /> 
                Compose Email to Customer
              </h3>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendCustomEmail} className="p-4 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                <p><strong>To:</strong> {emailData.name} &lt;{emailData.email}&gt;</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input 
                  type="text" 
                  value={emailData.subject}
                  onChange={e => setEmailData({...emailData, subject: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary"
                  required
                  placeholder="Email Subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea 
                  value={emailData.message}
                  onChange={e => setEmailData({...emailData, message: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary resize-none"
                  required
                  rows="6"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSendingEmail}
                  className="flex-1 py-2 bg-surya-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSendingEmail ? <RefreshCw className="animate-spin" size={18} /> : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
