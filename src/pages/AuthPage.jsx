import React, { useState } from 'react';
import { Fingerprint, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, RefreshCw, Phone, MapPin, CreditCard, Info, IdCard } from 'lucide-react';
import { sendOTPVerificationEmail, sendWelcomeEmail } from '../utils/emailService';
import { registerUser, loginUser } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './AuthPage.css';

const STEPS = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  VERIFY_OTP: 'VERIFY_OTP',
  SETUP_BIOMETRICS: 'SETUP_BIOMETRICS',
  SUCCESS: 'SUCCESS',
};

const ACCOUNT_TYPES = [
  {
    id: 'savings',
    name: 'Savings Account',
    details: 'Designed for individuals to park excess funds safely while earning modest interest. Best For: Everyday savings, emergency funds, and personal short-term goals. Key Features: Earns a moderate interest rate, typically capped with limits on monthly withdrawals. Variants exist for specific demographics (e.g., Women, Senior Citizens, Minors).'
  },
  {
    id: 'current',
    name: 'Current Account (Checking Account)',
    details: 'Primarily utilized by business owners, traders, and corporations requiring frequent and high-volume transactions. Best For: Managing daily business cash flows and routine transactions. Key Features: Allows unlimited daily transactions, deposits, and withdrawals. Generally bears zero interest and requires a higher minimum balance. Often provides an overdraft facility.'
  },
  {
    id: 'salary',
    name: 'Salary Account',
    details: 'A zero-balance account opened by employers in tie-up with specific banks to directly credit employee salaries. Best For: Salaried professionals. Key Features: Zero minimum balance requirement, standard debit/net banking facilities, and may include additional banking benefits like special loan rates.'
  },
  {
    id: 'fixed_deposit',
    name: 'Fixed Deposit (FD) Account',
    details: 'A low-risk investment option where a lump sum is locked in for a predetermined tenure to earn a guaranteed, higher interest rate. Best For: Growing surplus funds over a fixed period (from 7 days up to 10 years). Key Features: Offers higher returns than a standard savings account; early withdrawals often incur penalty rates.'
  },
  {
    id: 'recurring_deposit',
    name: 'Recurring Deposit (RD) Account',
    details: 'Allows individuals to invest a fixed, smaller amount regularly (usually monthly) to steadily build savings. Best For: Disciplined, systematic investments. Key Features: Earns a fixed interest rate on regular monthly contributions over a set tenure.'
  },
  {
    id: 'nri',
    name: 'NRI Accounts',
    details: 'Specialized accounts meant for Non-Resident Indians to manage their earnings in India or abroad. Key Features: Key variants include NRE (Non-Resident External - fully repatriable, tax-free interest), NRO (Non-Resident Ordinary - for managing local Indian income), and FCNR (Foreign Currency Non-Resident).'
  },
  {
    id: 'demat',
    name: 'Demat Account',
    details: 'A digital account used to securely hold and trade financial securities (like stocks, bonds, and mutual funds) in electronic form rather than physical certificates.'
  }
];

const AuthPage = () => {
  const [step, setStep] = useState(STEPS.LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdAccountDetails, setCreatedAccountDetails] = useState(null);
  
  // Form Data
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

  // OTP State
  const [sentOtp, setSentOtp] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);

  // Fingerprint State
  const [isFingerprintOpen, setIsFingerprintOpen] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] = useState('idle');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const getErrorMessage = (err) => {
    return err.message || 'An error occurred. Please try again later.';
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (step === STEPS.REGISTER) {
      if (!formData.email || !formData.password || !formData.fullName || !formData.mobileNumber || !formData.presentAddress || !formData.permanentAddress || !formData.governmentId || !formData.accountType) {
        setError("Please fill in all required fields.");
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        setError("Please fill in all required fields.");
        return;
      }
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (step === STEPS.REGISTER) {
        if (!formData.fullName) {
          setError("Please enter your full name.");
          setIsLoading(false);
          return;
        }

        // Determine role based on email for testing
        let assignedRole = 'customer';
        if (formData.email.includes('+admin@')) {
          assignedRole = 'admin';
        } else if (formData.email.includes('+emp@')) {
          assignedRole = 'employee';
        }

        // 1. Send data to custom PostgreSQL backend via API service
        const data = await registerUser({
          ...formData,
          role: assignedRole,
          balance: 1000.00 // Initial signup bonus
        });

        const user = data.user;
        localStorage.setItem('token', data.token);

        // 2. Send Welcome Email with Account Details
        await sendWelcomeEmail(formData.email, formData.fullName, user.account_number, user.ifsc_code);

        // Move directly to Biometrics Setup
        setStep(STEPS.SETUP_BIOMETRICS);
        
      } else {
        // Login Flow
        const data = await loginUser({
          email: formData.email,
          password: formData.password
        });
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role || 'customer');
        localStorage.setItem('isAuthenticated', 'true');
        
        setStep(STEPS.SUCCESS);
      }

    } catch (err) {
      console.error('Authentication Error:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otpInput.join('');
    
    if (enteredOtp !== sentOtp) {
      setError('Invalid OTP code. Please try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Determine role based on email for testing
      let assignedRole = 'customer';
      if (formData.email.includes('+admin@')) {
        assignedRole = 'admin';
      } else if (formData.email.includes('+emp@')) {
        assignedRole = 'employee';
      }

      // Send data to custom PostgreSQL backend
      const data = await registerUser({
        ...formData,
        role: assignedRole,
        balance: 1000.00 // Initial signup bonus
      });

      const user = data.user;
      localStorage.setItem('token', data.token);

      // 3. Send Welcome Email
      const accNo = user?.account_number || 'Pending';
      const ifsc = user?.ifsc_code || 'SURY0001234';
      await sendWelcomeEmail(formData.email, formData.fullName, accNo, ifsc);
      
      setCreatedAccountDetails({ accountNumber: accNo, ifscCode: ifsc });

      setStep(STEPS.SETUP_BIOMETRICS);
    } catch (err) {
      console.error('Registration Error:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const startFingerprintScan = () => {
    setIsFingerprintOpen(true);
    setFingerprintStatus('scanning');
    
    setTimeout(() => {
      setFingerprintStatus('success');
      localStorage.setItem('isAuthenticated', 'true');
      setTimeout(() => {
        setIsFingerprintOpen(false);
        setStep(STEPS.SUCCESS);
      }, 1500);
    }, 2500);
  };

  const handleEnableBiometrics = () => {
    localStorage.setItem('fingerprintEnabled', 'true');
    setStep(STEPS.SUCCESS);
  };

  const handleSkipBiometrics = () => {
    setStep(STEPS.SUCCESS);
  };

  const renderBiometricSetup = () => (
    <div className="auth-success fade-in" style={{ textAlign: 'center' }}>
      <Fingerprint size={64} style={{ color: 'var(--primary-gold)', margin: '0 auto 16px auto' }} />
      <h2>Setup Quick Login</h2>
      <p style={{ color: '#64748b', margin: '8px 0 24px 0', lineHeight: '1.6' }}>Enable fingerprint authentication on this device for faster, secure access to your account.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Button variant="primary" className="w-full" onClick={handleEnableBiometrics}>
          Enable Fingerprint
        </Button>
        <Button variant="outline" className="w-full" onClick={handleSkipBiometrics}>
          Skip for Now
        </Button>
      </div>
    </div>
  );

  const renderSuccess = () => {
    // If they are in the SUCCESS step but NOT authenticated in localStorage, it means they just registered.
    const isLoginSuccess = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole') || 'customer';
    
    let dashboardPath = '/dashboard';
    if (userRole === 'admin') dashboardPath = '/admin';
    if (userRole === 'employee') dashboardPath = '/employee';

    return (
      <div className="auth-success fade-in" style={{ textAlign: 'center' }}>
        <CheckCircle size={64} style={{ color: 'var(--secondary-green)', margin: '0 auto 16px auto' }} />
        <h2>Success!</h2>
        <p style={{ color: '#64748b', margin: '8px 0', lineHeight: '1.6' }}>
          {isLoginSuccess ? 'You are securely logged into Surya Bank.' : 'Your account has been successfully created and verified!'}
        </p>

        {!isLoginSuccess && createdAccountDetails && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', margin: '24px 0', textAlign: 'left' }}>
            <h4 style={{ color: '#0f172a', margin: '0 0 15px 0', fontSize: '1.1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Your Account Details</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Account Number:</span>
              <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px' }}>{createdAccountDetails.accountNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>IFSC Code:</span>
              <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px' }}>{createdAccountDetails.ifscCode}</strong>
            </div>
          </div>
        )}

        <Button variant="primary" className="w-full" style={{ marginTop: '24px' }} onClick={() => window.location.href = isLoginSuccess ? dashboardPath : '/auth'}>
          {isLoginSuccess ? 'Go to Dashboard' : 'Back to Login'}
        </Button>
      </div>
    );
  };

  const renderOtpVerification = () => (
    <form className="auth-form fade-in" onSubmit={handleVerifyOtp}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Mail size={48} style={{ color: 'var(--primary-gold)', margin: '0 auto 16px auto' }} />
        <h3 style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>Verify Your Email</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
          We've sent a 6-digit code to <strong>{formData.email}</strong>.<br />
          Please enter it below to verify your account.
        </p>
      </div>

      <div className="otp-container">
        {otpInput.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            className="otp-input"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
          />
        ))}
      </div>

      {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}

      <Button variant="primary" type="submit" className="w-full" style={{ marginTop: '24px' }} size="lg" disabled={isLoading || otpInput.join('').length < 6}>
        {isLoading ? <RefreshCw className="spin" size={20} /> : 'Verify & Create Account'}
      </Button>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Didn't receive the code?{' '}
          <button 
            type="button" 
            className="resend-link"
            onClick={async () => {
              setIsLoading(true);
              const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
              setSentOtp(newOtp);
              try {
                await sendOTPVerificationEmail(formData.email, newOtp, formData.fullName);
                setError('');
                alert('A new OTP has been sent to your email.');
              } catch (e) {
                setError('Failed to resend OTP. Please try again.');
              }
              setIsLoading(false);
            }}
            disabled={isLoading}
          >
            Resend OTP
          </button>
        </p>
      </div>
    </form>
  );

  const renderMainForm = () => (
    <form className="auth-form fade-in" onSubmit={handleAuthSubmit}>
      {step === STEPS.REGISTER ? (
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                name="fullName"
                placeholder="John Doe" 
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Government ID (Aadhaar/PAN)</label>
            <div className="input-wrapper">
              <IdCard className="input-icon" size={20} />
              <input 
                type="text" 
                name="governmentId"
                placeholder="Aadhaar or PAN Number" 
                value={formData.governmentId}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <div className="input-wrapper">
              <Phone className="input-icon" size={20} />
              <input 
                type="tel" 
                name="mobileNumber"
                placeholder="+91 98765 43210" 
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Present Address</label>
            <div className="input-wrapper" style={{ alignItems: 'flex-start' }}>
              <MapPin className="input-icon" size={20} style={{ top: '12px' }} />
              <textarea 
                name="presentAddress"
                placeholder="Street, City, Zip" 
                value={formData.presentAddress}
                onChange={handleInputChange}
                required
                rows="2"
                style={{ width: '100%', padding: '12px 16px 12px 45px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Permanent Address</label>
            <div className="input-wrapper" style={{ alignItems: 'flex-start' }}>
              <MapPin className="input-icon" size={20} style={{ top: '12px' }} />
              <textarea 
                name="permanentAddress"
                placeholder="Same as present address" 
                value={formData.permanentAddress}
                onChange={handleInputChange}
                required
                rows="2"
                style={{ width: '100%', padding: '12px 16px 12px 45px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Type of Account</label>
            <div className="input-wrapper">
              <CreditCard className="input-icon" size={20} />
              <select 
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '12px 16px 12px 45px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'inherit', background: '#f8fafc', appearance: 'none' }}
              >
                {ACCOUNT_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Secure password" 
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group full-width">
            <div style={{ padding: '12px', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '0.85rem', color: '#0369a1', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Info size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ margin: 0, lineHeight: '1.4' }}>
                {ACCOUNT_TYPES.find(t => t.id === formData.accountType)?.details}
              </p>
            </div>
          </div>

        </div>
      ) : (
        <>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
        </>
      )}

      {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}

      <Button variant="primary" type="submit" className="w-full" style={{ marginTop: '16px' }} size="lg" disabled={isLoading}>
        {isLoading ? <RefreshCw className="spin" size={20} /> : (step === STEPS.LOGIN ? 'Login Securely' : 'Create Account')}
      </Button>
      
      {step === STEPS.LOGIN && localStorage.getItem('fingerprintEnabled') === 'true' && (
        <div className="biometric-login">
          <p>Or quick login with</p>
          <button 
            type="button" 
            className="biometric-btn shadow-hover"
            onClick={startFingerprintScan}
            disabled={isLoading}
          >
            <Fingerprint size={32} />
          </button>
        </div>
      )}
    </form>
  );

  return (
    <div className="auth-page fade-in">
      <div className="auth-page-split">
        
        <div className="auth-image-panel fade-in">
          <div className="auth-image-overlay"></div>
          <div className="auth-image-content">
            <h1>Surya Bank</h1>
            <p>
              Experience the future of digital banking. Secure, fast, and personalized for your financial growth.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
               <div className="feature-pill"><CheckCircle size={16} style={{ color: 'var(--primary-gold)' }} /> 100% Secure Banking</div>
               <div className="feature-pill"><CheckCircle size={16} style={{ color: 'var(--primary-gold)' }} /> Global Access 24/7</div>
               <div className="feature-pill"><CheckCircle size={16} style={{ color: 'var(--primary-gold)' }} /> AI-Powered Insights</div>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="container auth-container">
            <Card className="auth-card relative">
          
          {step !== STEPS.SUCCESS && step !== STEPS.VERIFY_OTP && (
            <div className="auth-header">
              <h2>{step === STEPS.REGISTER ? 'Create Account' : 'Welcome Back'}</h2>
              <p>
                {step === STEPS.REGISTER ? 'Join the future of digital banking' : 'Securely login to your Surya Bank account'}
              </p>
            </div>
          )}

          {step === STEPS.SETUP_BIOMETRICS && renderBiometricSetup()}
          {step === STEPS.SUCCESS && renderSuccess()}
          {step === STEPS.VERIFY_OTP && renderOtpVerification()}
          {(step === STEPS.LOGIN || step === STEPS.REGISTER) && renderMainForm()}

          {(step === STEPS.LOGIN || step === STEPS.REGISTER) && (
            <div className="auth-footer">
              <p>
                {step === STEPS.LOGIN ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  className="toggle-auth-mode" 
                  onClick={() => {
                    setStep(step === STEPS.LOGIN ? STEPS.REGISTER : STEPS.LOGIN);
                    setError('');
                  }}
                >
                  {step === STEPS.LOGIN ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          )}

            </Card>
          </div>
        </div>
      </div>

      {isFingerprintOpen && (
        <div className="fingerprint-modal-overlay fade-in">
          <div className="fingerprint-modal">
            <h3>Biometric Authentication</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Please scan your fingerprint</p>
            
            <div className={`fingerprint-scanner ${fingerprintStatus}`}>
              <Fingerprint size={80} className="fingerprint-icon" />
              {fingerprintStatus === 'scanning' && <div className="scan-line"></div>}
            </div>
            
            <p className={`status-text ${fingerprintStatus}`}>
              {fingerprintStatus === 'idle' && 'Waiting for input...'}
              {fingerprintStatus === 'scanning' && 'Scanning...'}
              {fingerprintStatus === 'success' && 'Verified Successfully!'}
            </p>

            {fingerprintStatus !== 'success' && (
              <Button variant="outline" style={{ marginTop: '24px' }} onClick={() => setIsFingerprintOpen(false)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
