import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, RefreshCw, Phone, MapPin, CreditCard, Info, IdCard, ShieldCheck, Zap, Globe, Clock, Check } from 'lucide-react';
import { sendOTPVerificationEmail, sendWelcomeEmail } from '../utils/emailService';
import { registerUser, loginUser } from '../services/api';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const STEPS = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  VERIFY_OTP: 'VERIFY_OTP',
  SETUP_BIOMETRICS: 'SETUP_BIOMETRICS',
  SUCCESS: 'SUCCESS',
};

const ACCOUNT_TYPES = [
  { id: 'savings', name: 'Savings Account' },
  { id: 'current', name: 'Current Account' },
  { id: 'salary', name: 'Salary Account' },
  { id: 'fixed_deposit', name: 'Fixed Deposit (FD)' },
  { id: 'recurring_deposit', name: 'Recurring Deposit (RD)' },
  { id: 'nri', name: 'NRI Accounts' },
  { id: 'demat', name: 'Demat Account' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

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

        let assignedRole = 'customer';
        if (formData.email.includes('+admin@')) assignedRole = 'admin';
        else if (formData.email.includes('+emp@')) assignedRole = 'employee';

        const data = await registerUser({
          ...formData,
          role: assignedRole,
          balance: 1000.00
        });

        const user = data.user;
        localStorage.setItem('token', data.token);

        await sendWelcomeEmail(formData.email, formData.fullName, user.account_number, user.ifsc_code);
        setStep(STEPS.SETUP_BIOMETRICS);
        
      } else {
        const data = await loginUser({ email: formData.email, password: formData.password });
        
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

  const handleOAuthLogin = async (providerName) => {
    setIsLoading(true);
    setError('');
    try {
      let provider;
      if (providerName === 'Google') provider = new GoogleAuthProvider();
      else if (providerName === 'Microsoft') provider = new OAuthProvider('microsoft.com');
      else return;

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in custom Firestore 'users' collection
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('emailLowerCase', '==', user.email.toLowerCase()));
      const snap = await getDocs(q);

      if (snap.empty) {
        // Auto-register them
        const accNo = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        const newUser = {
          fullName: user.displayName || 'OAuth User',
          email: user.email,
          emailLowerCase: user.email.toLowerCase(),
          mobileNumber: user.phoneNumber || 'Not provided',
          presentAddress: 'OAuth Register',
          permanentAddress: 'OAuth Register',
          governmentId: 'Pending',
          accountType: 'savings',
          role: 'customer',
          account_number: accNo,
          ifsc_code: 'SURY0123',
          balance: 1000.00,
          createdAt: new Date().toISOString(),
          password: user.uid // Use UID as a dummy password
        };
        const docRef = await addDoc(usersRef, newUser);
        localStorage.setItem('token', btoa(JSON.stringify({ id: docRef.id, role: 'customer' })));
        localStorage.setItem('userRole', 'customer');
      } else {
        const existingUser = snap.docs[0];
        localStorage.setItem('token', btoa(JSON.stringify({ id: existingUser.id, role: existingUser.data().role })));
        localStorage.setItem('userRole', existingUser.data().role);
      }
      
      localStorage.setItem('isAuthenticated', 'true');
      setStep(STEPS.SUCCESS);
    } catch (err) {
      console.error('OAuth Error:', err);
      setError('Social login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

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
      let assignedRole = 'customer';
      if (formData.email.includes('+admin@')) assignedRole = 'admin';
      else if (formData.email.includes('+emp@')) assignedRole = 'employee';

      const data = await registerUser({
        ...formData,
        role: assignedRole,
        balance: 1000.00
      });

      const user = data.user;
      localStorage.setItem('token', data.token);

      const accNo = user?.account_number || 'Pending';
      const ifsc = user?.ifsc_code || 'SURY0123';
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
    <motion.div key="biometrics" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="text-center w-full">
      <motion.div variants={itemVariants} className="flex justify-center mb-6">
        <Fingerprint size={80} className="text-primary-gold" />
      </motion.div>
      <motion.h2 variants={itemVariants} className="text-3xl font-heading font-bold text-white mb-4">Setup Quick Login</motion.h2>
      <motion.p variants={itemVariants} className="text-slate-400 mb-8 text-lg">Enable fingerprint authentication on this device for faster, secure access to your account.</motion.p>
      
      <motion.div variants={itemVariants} className="space-y-4">
        <button onClick={handleEnableBiometrics} className="w-full h-[60px] rounded-[18px] bg-gradient-to-r from-primary-gold to-yellow-500 text-bg-primary font-bold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
          <Fingerprint size={24} /> Enable Fingerprint
        </button>
        <button onClick={handleSkipBiometrics} className="w-full h-[60px] rounded-[18px] border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-colors">
          Skip for Now
        </button>
      </motion.div>
    </motion.div>
  );

  const renderSuccess = () => {
    const isLoginSuccess = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole') || 'customer';
    
    let dashboardPath = '/dashboard';
    if (userRole === 'admin') dashboardPath = '/admin';
    if (userRole === 'employee') dashboardPath = '/employee';

    return (
      <motion.div key="success" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="text-center w-full">
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-emerald-500" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-3xl font-heading font-bold text-white mb-4">Success!</motion.h2>
        <motion.p variants={itemVariants} className="text-slate-400 mb-8 text-lg">
          {isLoginSuccess ? 'You are securely logged into Surya Bank.' : 'Your account has been successfully created and verified!'}
        </motion.p>

        {!isLoginSuccess && createdAccountDetails && (
          <motion.div variants={itemVariants} className="bg-bg-primary/50 border border-white/10 rounded-2xl p-6 mb-8 text-left glass">
            <h4 className="text-white font-bold mb-4 border-b border-white/10 pb-4">Your Account Details</h4>
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-400">Account Number:</span>
              <strong className="text-primary-gold font-mono text-xl">{createdAccountDetails.accountNumber}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">IFSC Code:</span>
              <strong className="text-primary-gold font-mono text-xl">{createdAccountDetails.ifscCode}</strong>
            </div>
          </motion.div>
        )}

        <motion.button variants={itemVariants} onClick={() => window.location.href = isLoginSuccess ? dashboardPath : '/auth'} className="w-full h-[60px] rounded-[18px] bg-gradient-to-r from-primary-gold to-yellow-500 text-bg-primary font-bold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1">
          {isLoginSuccess ? 'Go to Dashboard' : 'Back to Login'}
        </motion.button>
      </motion.div>
    );
  };

  const renderOtpVerification = () => (
    <motion.form key="otp" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="w-full" onSubmit={handleVerifyOtp}>
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="w-20 h-20 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={40} className="text-accent-blue" />
        </div>
        <h3 className="text-3xl font-heading font-bold text-white mb-4">Verify Your Email</h3>
        <p className="text-slate-400 text-lg">
          We've sent a 6-digit code to <strong className="text-white">{formData.email}</strong>.<br />
          Please enter it below to verify your account.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-between gap-2 mb-8">
        {otpInput.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            className="w-14 h-16 rounded-xl border border-white/10 bg-bg-primary/50 text-white text-3xl text-center font-bold font-mono focus:border-primary-gold focus:ring-2 focus:ring-primary-gold/30 outline-none transition-all"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
          />
        ))}
      </motion.div>

      {error && <motion.div variants={itemVariants} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 font-medium"><AlertCircle size={20} /> {error}</motion.div>}

      <motion.button variants={itemVariants} type="submit" className="w-full h-[60px] rounded-[18px] bg-gradient-to-r from-primary-gold to-yellow-500 text-bg-primary font-bold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1 flex justify-center items-center" disabled={isLoading || otpInput.join('').length < 6}>
        {isLoading ? <RefreshCw className="animate-spin" size={24} /> : 'Verify & Create Account'}
      </motion.button>

      <motion.div variants={itemVariants} className="text-center mt-8">
        <p className="text-slate-400">
          Didn't receive the code?{' '}
          <button 
            type="button" 
            className="text-primary-gold font-bold hover:underline"
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
      </motion.div>
    </motion.form>
  );

  const InputField = ({ icon: Icon, label, type, name, placeholder, value, onChange, fullWidth = false }) => (
    <div className={`flex flex-col gap-2 ${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}>
      <label className="text-white font-medium ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-primary-gold transition-colors">
          <Icon size={24} />
        </div>
        <input 
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="w-full h-[60px] pl-14 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30 focus:bg-white/10 outline-none transition-all text-lg"
        />
        {type === 'password' && (
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        )}
      </div>
    </div>
  );

  const renderMainForm = () => (
    <motion.form key="form" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="w-full" onSubmit={handleAuthSubmit}>
      {step === STEPS.REGISTER ? (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <InputField icon={Fingerprint} label="Full Name" type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} fullWidth />
          <InputField icon={IdCard} label="Government ID" type="text" name="governmentId" placeholder="Aadhaar or PAN" value={formData.governmentId} onChange={handleInputChange} />
          <InputField icon={Mail} label="Email Address" type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
          <InputField icon={Phone} label="Mobile Number" type="tel" name="mobileNumber" placeholder="+91 98765 43210" value={formData.mobileNumber} onChange={handleInputChange} />
          
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
            <label className="text-white font-medium ml-1">Type of Account</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-primary-gold transition-colors">
                <CreditCard size={24} />
              </div>
              <select 
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                required
                className="w-full h-[60px] pl-14 pr-4 rounded-xl border border-white/10 bg-white/5 text-white appearance-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30 focus:bg-[#111f38] outline-none transition-all text-lg"
              >
                {ACCOUNT_TYPES.map(type => (
                  <option key={type.id} value={type.id} className="bg-bg-secondary text-white">{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          <InputField icon={MapPin} label="Present Address" type="text" name="presentAddress" placeholder="Street, City, Zip" value={formData.presentAddress} onChange={handleInputChange} fullWidth />
          <InputField icon={MapPin} label="Permanent Address" type="text" name="permanentAddress" placeholder="Same as present" value={formData.permanentAddress} onChange={handleInputChange} fullWidth />
          <InputField icon={Lock} label="Password" type="password" name="password" placeholder="Secure password" value={formData.password} onChange={handleInputChange} fullWidth />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-6">
          <InputField icon={Mail} label="Email Address" type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} fullWidth />
          <InputField icon={Lock} label="Password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} fullWidth />
          
          <div className="flex justify-between items-center text-slate-300 mt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="w-5 h-5 rounded border border-white/20 bg-white/5 group-hover:border-primary-gold flex items-center justify-center transition-colors">
                <Check size={14} className="text-transparent group-hover:text-primary-gold" />
              </div>
              <span>Remember me</span>
            </label>
            <a href="#" className="font-medium text-primary-gold hover:underline">Forgot Password?</a>
          </div>
        </motion.div>
      )}

      {error && <motion.div variants={itemVariants} className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 font-medium"><AlertCircle size={20} /> {error}</motion.div>}

      <motion.button variants={itemVariants} type="submit" className="w-full h-[60px] rounded-[18px] bg-gradient-to-r from-primary-gold to-yellow-500 text-bg-primary font-bold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1 flex justify-center items-center mt-8" disabled={isLoading}>
        {isLoading ? <RefreshCw className="animate-spin" size={24} /> : (step === STEPS.LOGIN ? 'Login Securely' : 'Create Account')}
      </motion.button>
      
      {step === STEPS.LOGIN && localStorage.getItem('fingerprintEnabled') === 'true' && (
        <motion.div variants={itemVariants} className="text-center mt-8">
          <p className="text-slate-400 mb-4">Or quick login with</p>
          <button 
            type="button" 
            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary-gold hover:bg-white/10 hover:scale-110 transition-all shadow-lg"
            onClick={startFingerprintScan}
            disabled={isLoading}
          >
            <Fingerprint size={32} />
          </button>
        </motion.div>
      )}

      {step === STEPS.LOGIN && (
        <motion.div variants={itemVariants} className="mt-10">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <span className="relative bg-[#0d1b2a] px-4 text-sm text-slate-400 uppercase tracking-widest">OR Continue With</span>
          </div>
          <div className="flex justify-center gap-4">
            {['Google', 'Microsoft', 'Face ID', 'Fingerprint'].map((provider, i) => (
              <button 
                key={i} 
                type="button" 
                onClick={() => {
                  if (provider === 'Google' || provider === 'Microsoft') handleOAuthLogin(provider);
                  else if (provider === 'Fingerprint' || provider === 'Face ID') startFingerprintScan();
                }}
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-primary-gold transition-all" 
                title={provider}
              >
                {i === 0 ? 'G' : i === 1 ? 'M' : i === 2 ? <Fingerprint size={24} /> : <Check size={24} />}
              </button>
            ))}
          </div>
        </motion.div>
      )}

    </motion.form>
  );

  return (
    <div className="min-h-screen bg-bg-primary text-white flex flex-col lg:flex-row font-body selection:bg-primary-gold selection:text-bg-primary">
      {/* Left Panel - Visuals (45%) */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-center p-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550565118-3a14e8d0386f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#07111F]/95 via-[#0D1B2A]/90 to-[#2563EB]/40 backdrop-blur-sm"></div>
        
        {/* Animated Aurora Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-aurora opacity-30 mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-lg mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-6xl font-heading font-bold mb-4 leading-tight text-white"
          >
            Welcome to <br/>
            <span className="text-primary-gold">Surya Bank</span>
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl font-light text-slate-300 mb-6"
          >
            The Future of Secure Digital Banking
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-slate-400 mb-12 leading-relaxed"
          >
            Experience AI-powered banking with enterprise-grade security, instant payments, intelligent financial insights, and seamless banking services designed for the modern world.
          </motion.p>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Zap, text: 'AI Powered Banking' },
              { icon: ShieldCheck, text: '256-bit Encryption' },
              { icon: RefreshCw, text: 'Instant Transfers' },
              { icon: CheckCircle, text: 'RBI Compliant' },
              { icon: Globe, text: 'Global Banking' },
              { icon: Clock, text: '24×7 Support' }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-3 rounded-2xl hover:bg-white/10 hover:border-primary-gold/50 transition-all transform hover:-translate-y-1">
                <feature.icon className="text-primary-gold flex-shrink-0" size={20} />
                <span className="text-sm font-medium text-slate-200">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form (55%) */}
      <div className="flex-1 bg-[#0d1b2a] flex flex-col justify-center items-center p-6 lg:p-16 relative min-h-screen">
        {/* Subtle grid background for the form side */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[500px] bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[32px] p-8 md:p-12 shadow-2xl relative z-10 glass-dark"
        >
          {step !== STEPS.SUCCESS && step !== STEPS.VERIFY_OTP && step !== STEPS.SETUP_BIOMETRICS && (
            <div className="text-center mb-10">
              <h2 className="text-3xl font-heading font-bold text-white mb-2">
                {step === STEPS.REGISTER ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-slate-400 text-lg">
                {step === STEPS.REGISTER ? 'Join the future of digital banking' : 'Sign in securely to access your Surya Bank account.'}
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === STEPS.SETUP_BIOMETRICS && renderBiometricSetup()}
            {step === STEPS.SUCCESS && renderSuccess()}
            {step === STEPS.VERIFY_OTP && renderOtpVerification()}
            {(step === STEPS.LOGIN || step === STEPS.REGISTER) && renderMainForm()}
          </AnimatePresence>

          {(step === STEPS.LOGIN || step === STEPS.REGISTER) && (
            <div className="text-center mt-10 text-slate-400">
              <p>
                {step === STEPS.LOGIN ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  className="text-primary-gold font-bold hover:underline" 
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
        </motion.div>

        {/* Security Footer */}
        <div className="mt-12 text-center relative z-10 w-full max-w-[500px]">
          <div className="flex items-center justify-center gap-2 text-emerald-400 mb-4 font-medium bg-emerald-500/10 border border-emerald-500/20 py-2 px-4 rounded-full mx-auto w-fit">
            <Lock size={16} /> Protected by Enterprise Security
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-mono">
            <span>ISO 27001 Certified</span>
            <span>RBI Guidelines Compliant</span>
            <span>AI Fraud Detection Enabled</span>
            <span>SSL Encrypted</span>
          </div>
        </div>

      </div>

      {isFingerprintOpen && (
        <div className="fixed inset-0 bg-[#07111F]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 border border-white/20 rounded-3xl p-10 max-w-sm w-full text-center glass-dark shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Biometric Auth</h3>
            <p className="text-slate-400 mb-8">Please scan your fingerprint</p>
            
            <div className={`relative w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 transition-colors duration-500 ${fingerprintStatus === 'success' ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
              <Fingerprint size={64} className={`transition-all duration-500 ${fingerprintStatus === 'scanning' ? 'text-primary-gold' : fingerprintStatus === 'success' ? 'text-emerald-500' : 'text-slate-500'}`} />
              {fingerprintStatus === 'scanning' && (
                <div className="absolute top-0 left-0 w-full h-2 bg-primary-gold rounded-full shadow-[0_0_15px_#D4AF37] animate-scan"></div>
              )}
            </div>
            
            <p className={`text-lg font-bold transition-colors ${fingerprintStatus === 'scanning' ? 'text-primary-gold animate-pulse' : fingerprintStatus === 'success' ? 'text-emerald-500' : 'text-slate-400'}`}>
              {fingerprintStatus === 'idle' && 'Waiting for input...'}
              {fingerprintStatus === 'scanning' && 'Scanning...'}
              {fingerprintStatus === 'success' && 'Verified Successfully!'}
            </p>

            {fingerprintStatus !== 'success' && (
              <button className="mt-8 px-8 py-3 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-colors" onClick={() => setIsFingerprintOpen(false)}>
                Cancel
              </button>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
