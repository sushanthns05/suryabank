import React, { useState, useEffect } from 'react';
import { Send, RefreshCw, CheckCircle, AlertCircle, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, Bell, History, CreditCard, X, Banknote } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { sendTransactionAlertEmail } from '../utils/emailService';
import { collection, onSnapshot, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { processTransaction, getTransactions, createCardApplication, createLoan } from '../services/api';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [transferData, setTransferData] = useState({ email: '', amount: '', recipientName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isBranchOpen, setIsBranchOpen] = useState(true);
  
  // Card Application States
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardFormData, setCardFormData] = useState({
    cardType: 'Debit Card',
    nameOnCard: '',
    deliveryAddress: ''
  });
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);
  const [cardStatus, setCardStatus] = useState({ type: '', message: '' });

  // Loan Application States
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanFormData, setLoanFormData] = useState({
    type: 'Personal Loan',
    amount: '',
    tenure: ''
  });
  const [isSubmittingLoan, setIsSubmittingLoan] = useState(false);
  const [loanStatus, setLoanStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token));
          const userId = payload.id;
          
          const docRef = doc(db, 'users', userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() };
            
            if (data.isBlocked) {
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('token');
              localStorage.removeItem('userRole');
              window.location.href = '/auth';
              return;
            }

            setUserAccount(data);
            
            // Fetch Passbook transactions
            if (data.account_number) {
              const txRes = await getTransactions(data.account_number);
              if (txRes.success) setTransactions(txRes.data);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();

    // Fetch latest announcement
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLatestAnnouncement(snapshot.docs[0].data());
      }
    });

    // Fetch branch status
    const branchStatusRef = doc(db, 'settings', 'branch_status');
    const unsubscribeBranch = onSnapshot(branchStatusRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsBranchOpen(docSnap.data().isOpen);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeBranch();
    };
  }, []);

  const handleInputChange = (e) => {
    setTransferData({ ...transferData, [e.target.name]: e.target.value });
    setStatus({ type: '', message: '' });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const amount = parseFloat(transferData.amount);
    
    if (!transferData.email || !transferData.recipientName || isNaN(amount) || amount <= 0) {
      setStatus({ type: 'error', message: 'Please fill in all fields with valid data.' });
      return;
    }

    if (!userAccount) {
      setStatus({ type: 'error', message: 'User account not loaded.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // 1. Process transaction in Firestore
      const txRes = await processTransaction(
        userAccount.id,
        userAccount.account_number,
        amount,
        'debit',
        `Transfer to ${transferData.recipientName}`
      );

      if (!txRes.success) {
        throw new Error(txRes.message);
      }

      // 2. Send the transaction alert email via EmailJS
      await sendTransactionAlertEmail(transferData.email, amount, transferData.recipientName);
      
      // 3. Update local state to reflect new balance and passbook
      setUserAccount(prev => ({ ...prev, balance: parseFloat(prev.balance || 0) - amount }));
      const newTxRes = await getTransactions(userAccount.account_number);
      if (newTxRes.success) setTransactions(newTxRes.data);

      setStatus({ type: 'success', message: `Successfully transferred ₹${amount.toFixed(2)} to ${transferData.recipientName}. A confirmation email has been sent.` });
      setTransferData({ email: '', amount: '', recipientName: '' }); // Reset form
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Transfer failed.' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardInputChange = (e) => {
    setCardFormData({ ...cardFormData, [e.target.name]: e.target.value });
    setCardStatus({ type: '', message: '' });
  };

  const handleApplyCard = async (e) => {
    e.preventDefault();
    if (!cardFormData.nameOnCard || !cardFormData.deliveryAddress) {
      setCardStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setIsSubmittingCard(true);
    setCardStatus({ type: '', message: '' });

    try {
      const appData = {
        userId: userAccount.id,
        accountNumber: userAccount.account_number,
        customerName: userAccount.fullName || userAccount.email,
        email: userAccount.email,
        ...cardFormData
      };
      
      const res = await createCardApplication(appData);
      if (res.success) {
        setCardStatus({ type: 'success', message: 'Card application submitted successfully! It is pending branch approval.' });
        setTimeout(() => {
          setIsCardModalOpen(false);
          setCardStatus({ type: '', message: '' });
          setCardFormData({ cardType: 'Debit Card', nameOnCard: '', deliveryAddress: '' });
        }, 3000);
      } else {
        setCardStatus({ type: 'error', message: res.message || 'Failed to submit application.' });
      }
    } catch (err) {
      setCardStatus({ type: 'error', message: err.message || 'An error occurred.' });
    } finally {
      setIsSubmittingCard(false);
    }
  };

  const openCardModal = () => {
    setCardFormData({
      cardType: 'Debit Card',
      nameOnCard: userAccount?.fullName || '',
      deliveryAddress: userAccount?.presentAddress || userAccount?.permanentAddress || ''
    });
    setCardStatus({ type: '', message: '' });
    setIsCardModalOpen(true);
  };

  const handleLoanInputChange = (e) => {
    setLoanFormData({ ...loanFormData, [e.target.name]: e.target.value });
    setLoanStatus({ type: '', message: '' });
  };

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    if (!loanFormData.amount || !loanFormData.tenure) {
      setLoanStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setIsSubmittingLoan(true);
    setLoanStatus({ type: '', message: '' });

    try {
      // Mock values for riskScore and CIBIL as required by the manager dashboard
      const riskScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
      const cibil = Math.floor(Math.random() * (850 - 650 + 1)) + 650;

      const appData = {
        userId: userAccount.id,
        accountNumber: userAccount.account_number,
        customerName: userAccount.fullName || userAccount.email,
        email: userAccount.email,
        type: loanFormData.type,
        amount: parseFloat(loanFormData.amount),
        tenure: parseInt(loanFormData.tenure),
        riskScore,
        cibil
      };
      
      const res = await createLoan(appData);
      if (res.success) {
        setLoanStatus({ type: 'success', message: 'Loan application submitted successfully! Pending verification.' });
        setTimeout(() => {
          setIsLoanModalOpen(false);
          setLoanStatus({ type: '', message: '' });
          setLoanFormData({ type: 'Personal Loan', amount: '', tenure: '' });
        }, 3000);
      } else {
        setLoanStatus({ type: 'error', message: res.message || 'Failed to submit application.' });
      }
    } catch (err) {
      setLoanStatus({ type: 'error', message: err.message || 'An error occurred.' });
    } finally {
      setIsSubmittingLoan(false);
    }
  };

  const openLoanModal = () => {
    setLoanFormData({
      type: 'Personal Loan',
      amount: '',
      tenure: ''
    });
    setLoanStatus({ type: '', message: '' });
    setIsLoanModalOpen(true);
  };

  return (
    <div className="dashboard-page fade-in">
      <div className="container dashboard-container">
        
        <div className="dashboard-main">
          <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2>Dashboard</h2>
              <p>Welcome to your account. Manage your funds below.</p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '8px 16px', borderRadius: '50px',
              backgroundColor: isBranchOpen ? '#dcfce7' : '#fee2e2',
              color: isBranchOpen ? '#166534' : '#991b1b',
              border: `1px solid ${isBranchOpen ? '#bbf7d0' : '#fecaca'}`,
              fontWeight: 'bold', fontSize: '0.9rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: isBranchOpen ? '#22c55e' : '#ef4444'
              }}></span>
              Offline Branch: {isBranchOpen ? 'OPEN' : 'CLOSED'}
            </div>
          </div>

          {latestAnnouncement && (
            <div className="mb-6 mt-4 p-4 rounded-xl flex items-start bg-indigo-50 border border-indigo-200 shadow-sm fade-in">
              <div className="bg-indigo-100 p-2 rounded-full mr-4 text-indigo-600">
                <Bell size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-indigo-900 font-bold flex items-center">
                  System Announcement: {latestAnnouncement.title}
                  <span className="ml-2 px-2 py-0.5 bg-indigo-200 text-indigo-800 rounded-full text-xs font-semibold">
                    {latestAnnouncement.type}
                  </span>
                </h4>
                <p className="text-indigo-700 text-sm mt-1">{latestAnnouncement.description}</p>
                <p className="text-indigo-400 text-xs mt-2">{new Date(latestAnnouncement.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="dashboard-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            {/* Account Summaries */}
            <div className="account-summaries" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <Card className="account-card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', border: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '4px' }}>{userAccount ? userAccount.accountType.toUpperCase() : 'Savings'} Account</p>
                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'monospace', letterSpacing: '1px' }}>{userAccount ? userAccount.account_number : 'Loading...'}</h3>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px' }}>
                    <Wallet size={24} style={{ color: 'var(--primary-gold)' }} />
                  </div>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '4px' }}>Available Balance</p>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>₹{userAccount ? parseFloat(userAccount.balance || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}</h2>
                </div>
              </Card>

              <Card className="account-card glass hover-lift" style={{ borderLeft: '4px solid var(--primary-gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Recurring Deposit (RD)</p>
                      <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>ACTIVE</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontFamily: 'monospace' }}>RD-7731-9002</h3>
                  </div>
                  <div style={{ background: 'var(--bg-main)', padding: '8px', borderRadius: '12px' }}>
                    <PiggyBank size={24} style={{ color: 'var(--primary-blue)' }} />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#f8fafc', padding: '15px', borderRadius: '12px', marginTop: '10px' }}>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Monthly Installment</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>₹500.00</p>
                  </div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Interest Rate</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>7.50% p.a.</p>
                  </div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Total Accumulated</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>₹3,000.00</p>
                  </div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Maturity Date</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Dec 15, 2027</p>
                  </div>
                </div>
                
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Estimated Maturity Amount</p>
                    <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-blue)' }}>₹6,245.50</p>
                  </div>
                  <Button variant="outline" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Details <ArrowUpRight size={16} />
                  </Button>
                </div>
              </Card>

            </div>

            {/* Quick Transfer */}
            <div className="quick-transfer-section">
              <Card>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)' }}>
                <Send size={20} style={{ color: 'var(--primary-gold)' }} /> Quick Transfer
              </h3>
              
              <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--primary-blue)' }}>Your Email (for receipt)</label>
                  <input 
                    type="email" 
                    name="email"
                    value={transferData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--primary-blue)' }}>Recipient Name</label>
                  <input 
                    type="text" 
                    name="recipientName"
                    value={transferData.recipientName}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--primary-blue)' }}>Amount (₹)</label>
                  <input 
                    type="number" 
                    name="amount"
                    value={transferData.amount}
                    onChange={handleInputChange}
                    placeholder="50.00"
                    min="1"
                    step="0.01"
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem' }}
                    required
                  />
                </div>

                {status.message && (
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    backgroundColor: status.type === 'success' ? '#dcfce7' : '#fef2f2',
                    color: status.type === 'success' ? '#166534' : '#ef4444',
                    fontSize: '0.9rem'
                  }}>
                    {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {status.message}
                  </div>
                )}

                <Button variant="primary" type="submit" disabled={isLoading} style={{ marginTop: '10px' }} size="lg">
                  {isLoading ? <RefreshCw className="spin" size={20} /> : 'Send Money'}
                </Button>
              </form>
              </Card>
            </div>
            
            {/* Card Services */}
            <div className="card-services-section">
              <Card>
                <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)' }}>
                  <CreditCard size={20} style={{ color: 'var(--primary-gold)' }} /> Card Services
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Apply for a new ATM/Debit or Credit card to easily manage your funds anywhere.
                </p>
                <Button variant="outline" onClick={openCardModal} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} /> Apply for New Card
                </Button>
              </Card>
            </div>

            {/* Loan Services */}
            <div className="loan-services-section">
              <Card>
                <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)' }}>
                  <Banknote size={20} style={{ color: 'var(--primary-gold)' }} /> Loan Services
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Apply for a Personal, Home, or Car loan with quick approval and low interest rates.
                </p>
                <Button variant="outline" onClick={openLoanModal} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <Banknote size={18} /> Apply for Loan
                </Button>
              </Card>
            </div>
          </div>

          {/* Passbook Section */}
          <div className="mt-8 mb-8 fade-in">
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)' }}>
                  <History size={20} style={{ color: 'var(--primary-gold)' }} /> Electronic Passbook
                </h3>
              </div>

              {transactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <History size={48} style={{ margin: '0 auto', marginBottom: '10px', opacity: 0.5 }} />
                  <p>No transactions found for this account.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {transactions.map(tx => (
                    <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          padding: '10px', 
                          borderRadius: '50%', 
                          background: tx.type === 'credit' ? '#dcfce7' : '#fee2e2',
                          color: tx.type === 'credit' ? '#166534' : '#991b1b'
                        }}>
                          {tx.type === 'credit' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem' }}>{tx.description}</p>
                          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>{new Date(tx.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: tx.type === 'credit' ? '#166534' : '#0f172a' }}>
                        {tx.type === 'credit' ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>

      {isCardModalOpen && (
        <div className="modal-overlay fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-content glass" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '16px', maxWidth: '500px', width: '100%', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button 
              onClick={() => setIsCardModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <h3 style={{ marginBottom: '5px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={24} style={{ color: 'var(--primary-gold)' }} /> Apply for Card
            </h3>
            <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '0.95rem' }}>Fill in the details for your new card application.</p>
            
            <form onSubmit={handleApplyCard} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--primary-blue)' }}>Linked Account</label>
                <input 
                  type="text" 
                  value={userAccount?.account_number || ''}
                  disabled
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#e2e8f0', color: '#64748b', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--primary-blue)' }}>Card Type</label>
                <select 
                  name="cardType" 
                  value={cardFormData.cardType}
                  onChange={handleCardInputChange}
                  required
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }}
                >
                  <option value="Debit Card">ATM/Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Forex Card">Forex Card</option>
                </select>
              </div>
              
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--primary-blue)' }}>Name on Card</label>
                <input 
                  type="text" 
                  name="nameOnCard"
                  value={cardFormData.nameOnCard}
                  onChange={handleCardInputChange}
                  required 
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', textTransform: 'uppercase' }}
                  placeholder="NAME ON CARD"
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left', marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--primary-blue)' }}>Delivery Address</label>
                <textarea 
                  name="deliveryAddress"
                  value={cardFormData.deliveryAddress}
                  onChange={handleCardInputChange}
                  required 
                  rows="3"
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', resize: 'none' }}
                  placeholder="Full Delivery Address"
                />
              </div>

              {cardStatus.message && (
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  backgroundColor: cardStatus.type === 'success' ? '#dcfce7' : '#fef2f2',
                  color: cardStatus.type === 'success' ? '#166534' : '#ef4444',
                  fontSize: '0.9rem'
                }}>
                  {cardStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {cardStatus.message}
                </div>
              )}

              <Button variant="primary" type="submit" className="w-full" disabled={isSubmittingCard}>
                {isSubmittingCard ? <RefreshCw className="spin" size={20} /> : 'Submit Application'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {isLoanModalOpen && (
        <div className="modal-overlay fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-content glass" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '16px', maxWidth: '500px', width: '100%', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button 
              onClick={() => setIsLoanModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <h3 style={{ marginBottom: '5px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Banknote size={24} style={{ color: 'var(--primary-gold)' }} /> Apply for Loan
            </h3>
            <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '0.95rem' }}>Fill in the details to request a new loan.</p>
            
            <form onSubmit={handleApplyLoan} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--primary-blue)' }}>Linked Account</label>
                <input 
                  type="text" 
                  value={userAccount?.account_number || ''}
                  disabled
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#e2e8f0', color: '#64748b', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--primary-blue)' }}>Loan Type</label>
                <select 
                  name="type" 
                  value={loanFormData.type}
                  onChange={handleLoanInputChange}
                  required
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }}
                >
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Car Loan">Car Loan</option>
                  <option value="Education Loan">Education Loan</option>
                  <option value="Business Loan">Business Loan</option>
                </select>
              </div>
              
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--primary-blue)' }}>Amount Requested (₹)</label>
                <input 
                  type="number" 
                  name="amount"
                  value={loanFormData.amount}
                  onChange={handleLoanInputChange}
                  required 
                  min="1000"
                  step="500"
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  placeholder="e.g. 50000"
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left', marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--primary-blue)' }}>Tenure (Months)</label>
                <input 
                  type="number" 
                  name="tenure"
                  value={loanFormData.tenure}
                  onChange={handleLoanInputChange}
                  required 
                  min="6"
                  max="360"
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  placeholder="e.g. 24"
                />
              </div>

              {loanStatus.message && (
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  backgroundColor: loanStatus.type === 'success' ? '#dcfce7' : '#fef2f2',
                  color: loanStatus.type === 'success' ? '#166534' : '#ef4444',
                  fontSize: '0.9rem'
                }}>
                  {loanStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {loanStatus.message}
                </div>
              )}

              <Button variant="primary" type="submit" className="w-full" disabled={isSubmittingLoan}>
                {isSubmittingLoan ? <RefreshCw className="spin" size={20} /> : 'Submit Application'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
