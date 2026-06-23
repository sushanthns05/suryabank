import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ShieldCheck, KeyRound, MonitorSmartphone, AlertCircle, RefreshCw, Keyboard, MoveLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { loginUser } from '../services/api';
import './NetbankingLogin.css';

const NetbankingLogin = () => {
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!customerId || !password) {
      setError('Please enter Customer ID and Password.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In this demo, if they provide a valid looking email format we use it, otherwise fake a successful login 
      // since our real backend uses email. For netbanking realism, we let them use any ID in the demo.
      let loginEmail = customerId.includes('@') ? customerId : `${customerId}@surya.com`;
      
      const data = await loginUser({
        email: loginEmail,
        password: password
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role || 'customer');
      localStorage.setItem('isAuthenticated', 'true');
      
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVirtualKey = (key) => {
    if (key === 'BACKSPACE') {
      setPassword(prev => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setPassword('');
    } else {
      setPassword(prev => prev + key);
    }
  };

  const virtualKeyboardRows = [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
  ];

  return (
    <div className="netbanking-page fade-in">
      <div className="netbanking-bg-decor"></div>
      
      <div className="netbanking-container">
        {/* Left Information Panel */}
        <div className="netbanking-info-panel">
          <div>
            <div className="netbanking-logo-wrap">
              <ShieldCheck size={36} className="netbanking-logo-icon" />
              <span className="netbanking-logo-text">SuryaNet</span>
            </div>
            
            <div className="netbanking-info-content">
              <h2>Secure Digital<br/>Banking Portal</h2>
              <p>Experience enterprise-grade security with 256-bit encryption. Your financial data is protected by the industry's most advanced security protocols.</p>
            </div>
            
            <div className="security-badges">
              <div className="security-badge">
                <Lock className="icon" size={24} />
                <div>
                  <h4>256-Bit SSL Encryption</h4>
                  <p>Highest standard of data protection.</p>
                </div>
              </div>
              <div className="security-badge">
                <KeyRound className="icon" size={24} />
                <div>
                  <h4>Anti-Phishing Protection</h4>
                  <p>Always verify the site URL before logging in.</p>
                </div>
              </div>
              <div className="security-badge">
                <MonitorSmartphone className="icon" size={24} />
                <div>
                  <h4>Device Verification</h4>
                  <p>Unrecognized devices require extra OTP auth.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2rem' }}>
            &copy; {new Date().getFullYear()} Surya Bank Ltd. All rights reserved.
          </div>
        </div>
        
        {/* Right Form Panel */}
        <div className="netbanking-form-panel">
          <button 
            onClick={() => window.location.href='/services'}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '2rem' }}
          >
            <MoveLeft size={16} /> Back to Home
          </button>
          
          <h3>NetBanking Login</h3>
          <p>Please enter your credentials to securely access your account.</p>
          
          <form onSubmit={handleLogin}>
            <div className="nb-form-group">
              <label>Customer ID / Username</label>
              <div className="nb-input-wrapper">
                <User size={20} className="nb-input-icon" />
                <input 
                  type="text" 
                  placeholder="Enter Customer ID" 
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>
            
            <div className="nb-form-group" style={{ position: 'relative' }}>
              <label>Password / IPIN</label>
              <div className="nb-input-wrapper">
                <Lock size={20} className="nb-input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  className="nb-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Virtual Keyboard Toggle */}
              <button 
                type="button" 
                className="virtual-keyboard-toggle"
                onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
              >
                <Keyboard size={16} />
                {showVirtualKeyboard ? "Hide Virtual Keyboard" : "Use Virtual Keyboard"}
              </button>
              
              {/* Virtual Keyboard Modal */}
              {showVirtualKeyboard && (
                <div className="virtual-keyboard-modal">
                  {virtualKeyboardRows.map((row, i) => (
                    <div key={i} className="vk-row">
                      {row.map(key => (
                        <div key={key} className="vk-key" onClick={() => handleVirtualKey(key)}>
                          {key}
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="vk-row">
                    <div className="vk-key special" onClick={() => handleVirtualKey('CLEAR')}>Clear</div>
                    <div className="vk-key special" onClick={() => handleVirtualKey('BACKSPACE')}>Backspace</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="nb-form-options">
              <label className="nb-remember">
                <input type="checkbox" /> Remember Customer ID
              </label>
              <a href="#" className="nb-forgot">Forgot IPIN?</a>
            </div>
            
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '8px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}
            
            <Button variant="primary" type="submit" size="lg" style={{ width: '100%', fontSize: '1.1rem', padding: '14px' }} disabled={isLoading}>
              {isLoading ? <RefreshCw className="spin" size={20} /> : "Secure Login"}
            </Button>
          </form>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
            Don't have a NetBanking account? <a href="/auth" style={{ color: 'var(--primary-gold)', textDecoration: 'none', fontWeight: '500' }}>Register Now</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetbankingLogin;
