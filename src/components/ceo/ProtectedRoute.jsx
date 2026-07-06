import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useCeoAuth } from '../../context/CeoAuthContext';
import { ShieldAlert, KeyRound, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useCeoAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-ceo-navy flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="animate-spin text-ceo-gold" size={48} />
        <span className="text-xs uppercase tracking-widest font-mono text-ceo-gold">Validating Security Tokens...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page
    return <Navigate to="/ceo/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Access Denied interface
    return (
      <div className="max-w-md mx-auto py-16 animate-in fade-in duration-300">
        <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif text-white font-bold">Access Denied</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your security clearance level (<strong className="text-red-400">{role}</strong>) is insufficient to access this administrative terminal. 
            </p>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 text-left text-[11px] text-slate-500 leading-relaxed space-y-1">
            <span className="block font-bold text-slate-400">Security Clearance Rule:</span>
            <span>Only users with the following roles are permitted: {allowedRoles.join(', ')}. Please contact the Chairman's Office.</span>
          </div>
          <Navigate to="/ceo" replace={false} className="hidden" />
          <button
            onClick={() => window.history.back()}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound size={14} /> Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
