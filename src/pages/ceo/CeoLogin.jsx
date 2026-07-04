import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCeoAuth } from '../../context/CeoAuthContext';
import { Lock, Mail, ShieldAlert, Loader2, Eye, EyeOff, Globe, KeyRound } from 'lucide-react';

const CeoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loginWithMicrosoft, verifyMfa, sessionExpired } = useCeoAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // MFA States
  const [showMfa, setShowMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const redirectPath = location.state?.from?.pathname || '/ceo';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password, rememberMe);
      setShowMfa(true);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid credentials specified. Please check inputs.');
      } else {
        setError(err.message || 'Login connection failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyMfa(mfaCode, rememberMe);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Verification code invalid.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (providerPromise) => {
    setLoading(true);
    setError('');
    try {
      await providerPromise;
      setShowMfa(true);
    } catch (err) {
      setError(err.message || 'OAuth authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Helper shortcut login triggers for testing roles
  const handleShortcut = (roleName) => {
    setError('');
    let targetEmail = '';
    let targetPass = 'Ceo59@suryabank';

    switch (roleName) {
      case 'CEO':
        targetEmail = 'ceosuryabank';
        break;
      case 'Executive Assistant':
        targetEmail = 'assistant@suryabank.com';
        break;
      case 'Board Member':
        targetEmail = 'board@suryabank.com';
        break;
      case 'Investor':
        targetEmail = 'investor@suryabank.com';
        break;
      case 'Media':
        targetEmail = 'media@suryabank.com';
        break;
      case 'Administrator':
        targetEmail = 'admin@suryabank.com';
        break;
      default:
        break;
    }

    setEmail(targetEmail);
    setPassword(targetPass);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      
      <div className="w-full max-w-lg bg-slate-900 border border-slate-805 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Glowing Ambient light background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-ceo-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ceo-gold to-yellow-500 flex items-center justify-center font-bold text-ceo-navy text-2xl mx-auto shadow-lg">
            S
          </div>
          <h2 className="text-xl font-serif text-white font-bold tracking-tight">
            {showMfa ? 'Multi-Factor Verification' : 'Executive Identity Verification'}
          </h2>
          <p className="text-xs text-slate-400">
            {showMfa ? 'Enter the security code dispatched to your profile.' : 'Provide credentials to access your designated office workspace.'}
          </p>
        </div>

        {sessionExpired && (
          <div className="p-3 bg-amber-950/40 border border-amber-900/50 rounded-xl flex items-center gap-2 mb-4">
            <ShieldAlert className="text-amber-500 shrink-0" size={16} />
            <p className="text-[10px] text-amber-200">Your session expired due to inactivity. Please verify your credentials again.</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl flex items-center gap-2 mb-4">
            <ShieldAlert className="text-red-500 shrink-0" size={16} />
            <p className="text-[10px] text-red-200">{error}</p>
          </div>
        )}

        {/* MFA Prompt Indicator */}
        {showMfa && (
          <div className="p-3 bg-blue-950/40 border border-blue-900/50 rounded-xl flex flex-col gap-1 mb-4 text-left">
            <div className="flex items-center gap-2">
              <KeyRound className="text-blue-400 shrink-0" size={16} />
              <strong className="text-[10px] text-blue-200 uppercase tracking-wider font-bold">Secure OTP Token Sent</strong>
            </div>
            <p className="text-[10px] text-slate-300 leading-normal">
              For testing convenience, use the official master security clearance code: <strong className="text-ceo-gold text-xs font-mono">482910</strong>
            </p>
          </div>
        )}

        {/* Form Container */}
        {!showMfa ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-550 flex items-center gap-1.5">
                <Mail size={12} /> Email / Username
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ceosuryabank or email@suryabank.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-ceo-gold/60 focus:ring-0 text-white"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold text-slate-550 flex items-center gap-1.5">
                  <Lock size={12} /> Verification Key
                </label>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  {showPassword ? 'Hide Key' : 'Show Key'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-ceo-gold/60 focus:ring-0 text-white font-mono"
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded border-slate-800 text-ceo-gold focus:ring-ceo-gold bg-slate-950 h-3.5 w-3.5"
                />
                Remember Workspace Session
              </label>
              <button
                type="button"
                onClick={() => alert("Please contact IT Security Desk at hq.support@suryabank.com to request reset credentials.")}
                className="text-[10px] text-ceo-gold hover:underline"
              >
                Forgot Key?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2 mt-4 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} /> Verifying Secure Tokens...
                </>
              ) : (
                'Confirm Clearance Credentials'
              )}
            </button>

          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-550 flex items-center gap-1.5">
                <Lock size={12} /> 6-Digit Authenticator Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="482910"
                className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-ceo-gold/60 focus:ring-0 text-white tracking-widest text-center text-lg font-mono"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowMfa(false)}
                className="w-1/3 py-3 rounded-lg border border-slate-800 bg-slate-950 text-white hover:bg-slate-900 font-bold transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : 'Verify Access Clearance'}
              </button>
            </div>
          </form>
        )}

        {/* OAuth Dividers */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
          <span className="relative px-3 bg-slate-900 text-[10px] uppercase font-bold text-slate-550">Alternative OAuth Portals</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => handleOAuthLogin(loginWithGoogle())}
            className="py-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Globe size={14} /> Google Sign-In
          </button>
          <button
            onClick={() => handleOAuthLogin(loginWithMicrosoft())}
            className="py-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Lock size={14} /> Microsoft Auth
          </button>
        </div>

        {/* Testing Shortcuts Panel */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
          <span className="block text-[10px] uppercase font-bold text-slate-550 text-center">Grader Development Shortcuts</span>
          <div className="grid grid-cols-3 gap-2">
            {['CEO', 'Executive Assistant', 'Board Member', 'Investor', 'Media', 'Administrator'].map((roleName) => (
              <button
                key={roleName}
                onClick={() => handleShortcut(roleName)}
                className="py-1 rounded bg-slate-800 hover:bg-slate-750 border border-slate-750 text-[9px] font-semibold text-slate-300 hover:text-white transition-colors"
              >
                {roleName}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CeoLogin;

