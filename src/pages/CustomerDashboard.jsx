import React, { useState, useEffect } from 'react';
import { Send, RefreshCw, CheckCircle, AlertCircle, Wallet, PiggyBank, ArrowUpRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { sendTransactionAlertEmail } from '../utils/emailService';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [transferData, setTransferData] = useState({ email: '', amount: '', recipientName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      window.location.href = '/auth';
    }
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

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Send the transaction alert email via EmailJS
      await sendTransactionAlertEmail(transferData.email, amount, transferData.recipientName);
      
      setStatus({ type: 'success', message: `Successfully transferred $${amount.toFixed(2)} to ${transferData.recipientName}. A confirmation email has been sent.` });
      setTransferData({ email: '', amount: '', recipientName: '' }); // Reset form
    } catch (error) {
      setStatus({ type: 'error', message: 'Transfer successful locally, but failed to send EmailJS confirmation email. Please check your credentials.' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-page fade-in">
      <div className="container dashboard-container">
        
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h2>Dashboard</h2>
            <p>Welcome to your account. Manage your funds below.</p>
          </div>

          <div className="dashboard-grid" style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            {/* Account Summaries */}
            <div className="account-summaries" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <Card className="account-card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', border: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '4px' }}>Savings Account</p>
                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'monospace', letterSpacing: '1px' }}>SUR-8923-4412</h3>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px' }}>
                    <Wallet size={24} style={{ color: 'var(--primary-gold)' }} />
                  </div>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '4px' }}>Available Balance</p>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>$12,450.00</h2>
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
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>$500.00</p>
                  </div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Interest Rate</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>7.50% p.a.</p>
                  </div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Total Accumulated</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>$3,000.00</p>
                  </div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Maturity Date</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Dec 15, 2027</p>
                  </div>
                </div>
                
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Estimated Maturity Amount</p>
                    <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-blue)' }}>$6,245.50</p>
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
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--primary-blue)' }}>Amount ($)</label>
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
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
