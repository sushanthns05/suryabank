import React, { useState } from 'react';
import { Lock, Key, Eye, EyeOff, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (formData.userId.trim() === '05092006' && formData.password.trim() === 'Sushsuryaemp@789') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'employee');
      window.location.href = '/employee';
    } else {
      setError('Invalid User ID or Password. Access Denied.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#050b14', // Deep dark blue
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)'
    }}>
      {/* Background SVG Effects */}
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="leftGlow" cx="35%" cy="50%" r="35%">
            <stop offset="0%" stopColor="#ff3b00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff3b00" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rightGlow" cx="65%" cy="50%" r="35%">
            <stop offset="0%" stopColor="#0066ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0066ff" stopOpacity="0" />
          </radialGradient>
          <path id="textPath" d="M 500, 160 A 340,340 0 1,1 499.9,160" />
          <path id="innerCircle" d="M 500, 220 A 280,280 0 1,1 499.9,220" />
        </defs>

        {/* Glow Rects */}
        <rect width="100%" height="100%" fill="url(#leftGlow)" style={{ mixBlendMode: 'screen' }} />
        <rect width="100%" height="100%" fill="url(#rightGlow)" style={{ mixBlendMode: 'screen' }} />

        {/* Concentric Circles */}
        <circle cx="500" cy="500" r="280" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <circle cx="500" cy="500" r="300" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="500" cy="500" r="320" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        
        {/* Radiating ticks inside */}
        {Array.from({ length: 72 }).map((_, i) => (
          <line 
            key={`tick-in-${i}`} 
            x1="500" y1="220" x2="500" y2="230" 
            stroke="rgba(255,255,255,0.2)" strokeWidth="2"
            transform={`rotate(${i * 5} 500 500)`} 
          />
        ))}

        {/* Radiating ticks outside */}
        {Array.from({ length: 48 }).map((_, i) => (
          <line 
            key={`tick-out-${i}`} 
            x1="500" y1="80" x2="500" y2="120" 
            stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
            transform={`rotate(${i * 7.5} 500 500)`} 
          />
        ))}

        {/* Circular Text */}
        <text fill="#ffffff" fontSize="22" fontWeight="600" letterSpacing="6" style={{ opacity: 0.9 }}>
          <textPath href="#textPath" startOffset="0%" textAnchor="start">
            POLITENESS • SUSTAINABILITY • SERVICE • TRANSPARENCY • ETHICS • POLITENESS • SUSTAINABILITY • SERVICE • TRANSPARENCY • ETHICS • 
          </textPath>
        </text>
      </svg>

      {/* Main Login Card Wrapper */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px' }}>
        
        {/* The White Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '380px',
          padding: '40px 30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          {/* Logo / Header */}
          <div style={{ marginBottom: '10px' }}>
            <img src="/logo.png" alt="Surya Bank" style={{ height: '40px', margin: '0 auto 10px' }} />
            <h2 style={{ color: '#0ea5e9', fontSize: '1.2rem', fontWeight: '700', margin: '0 0 5px 0' }}>Staff Portal</h2>
            <p style={{ color: '#0f172a', fontSize: '0.95rem', margin: 0, fontWeight: '500' }}>Enter your login details</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '30px' }}>
            
            {/* User ID Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ color: '#64748b', position: 'absolute', left: '5px' }} />
              <input 
                type="text" 
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                required 
                placeholder="User ID"
                style={{ 
                  width: '100%', 
                  padding: '10px 10px 10px 35px', 
                  border: 'none', 
                  borderBottom: '1px solid #cbd5e1', 
                  background: 'transparent', 
                  color: '#0f172a', 
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderBottom = '2px solid #2e1065'}
                onBlur={(e) => e.target.style.borderBottom = '1px solid #cbd5e1'}
              />
            </div>

            {/* Password Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Key size={18} style={{ color: '#64748b', position: 'absolute', left: '5px' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required 
                placeholder="Password"
                style={{ 
                  width: '100%', 
                  padding: '10px 35px 10px 35px', 
                  border: 'none', 
                  borderBottom: '1px solid #cbd5e1', 
                  background: 'transparent', 
                  color: '#0f172a', 
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderBottom = '2px solid #2e1065'}
                onBlur={(e) => e.target.style.borderBottom = '1px solid #cbd5e1'}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', 
                  position: 'absolute', right: '5px', color: '#64748b', padding: 0, display: 'flex' 
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'left', marginTop: '-15px' }}>
                {error}
              </div>
            )}

            {/* Login Button */}
            <button 
              type="submit" 
              style={{ 
                backgroundColor: '#2e1065', // Dark purple
                color: 'white', 
                border: 'none', 
                borderRadius: '999px', // Pill shape
                padding: '12px 0', 
                fontSize: '1rem', 
                fontWeight: '600', 
                cursor: 'pointer',
                marginTop: '10px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4c1d95'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2e1065'}
            >
              Login
            </button>
          </form>

          {/* Forgot Password */}
          <div style={{ marginTop: '20px' }}>
            <a href="#" style={{ color: '#2563eb', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '500' }}>
              Forgot Password ?
            </a>
          </div>

          <div style={{ marginTop: '25px', fontSize: '0.75rem', color: '#64748b' }}>
            Copyright ©2026 Team SuryaBank
          </div>
        </div>

        {/* Powered By Text Outside Card */}
        <div style={{ marginTop: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textAlign: 'center' }}>
          Powered by SuryaTech<br />
          APM ID: APP06419
        </div>
      </div>

      {/* Refresh Icon Bottom Right */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1 }}>
        <button onClick={() => window.location.reload()} style={{ 
          backgroundColor: '#ffffff', border: 'none', borderRadius: '8px', 
          width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', color: '#2563eb'
        }}>
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Footer Text */}
      <div style={{ 
        position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', 
        color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', padding: '0 20px', zIndex: 1 
      }}>
        This system is for the use of authorized users for authorized purposes only. Individuals using this computer system without authority, or in excess of their authority, are subject to having all their activities on this system monitored and recorded by system personnel.
      </div>

    </div>
  );
};

export default EmployeeLogin;
