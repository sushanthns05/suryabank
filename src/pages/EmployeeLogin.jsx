import React, { useState } from 'react';
import { Lock, User, AlertCircle, Building2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Hardcoded bypass for employee login based on user requirements
    if (formData.userId.trim() === '05092006' && formData.password.trim() === 'Sushsuryaemp@789') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'employee');
      window.location.href = '/employee';
    } else {
      setError('Invalid User ID or Password. Access Denied.');
    }
  };

  return (
    <div className="auth-page fade-in" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '20px'
    }}>
      <Card style={{ maxWidth: '400px', width: '100%', padding: '40px 30px' }} className="glass">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Building2 size={48} style={{ color: 'var(--primary-gold)', margin: '0 auto 15px' }} />
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0' }}>Staff Portal</h2>
          <p style={{ color: '#94a3b8', margin: 0 }}>Secure Employee Access</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#e2e8f0' }}>User ID</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input 
                type="text" 
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                required 
                placeholder="Enter User ID"
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '1rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#e2e8f0' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required 
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '1rem' }}
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <Button variant="primary" type="submit" size="lg" style={{ marginTop: '10px' }}>
            Login to Dashboard
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EmployeeLogin;
