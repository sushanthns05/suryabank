import React, { useState, useEffect } from 'react';
import { Send, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
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

          <div style={{ marginTop: '30px', maxWidth: '500px' }}>
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
  );
};

export default CustomerDashboard;
