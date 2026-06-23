import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManagerLogin = () => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check credentials (specifically the one provided for KSTown Manager)
    if (formData.userId.trim() === 'kstownmanager' && formData.password.trim() === 'manager@kstown') {
      localStorage.setItem('managerAuthenticated', 'true');
      localStorage.setItem('managerRole', 'Branch Manager');
      localStorage.setItem('managerBranch', 'Kengeri Satellite Town');
      window.location.href = '/manager';
    } else {
      setError('Invalid Manager ID or Password. Access Denied.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden font-body">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#F59E0B] opacity-[0.05] blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500 opacity-[0.05] blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl p-8 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-yellow-600 flex items-center justify-center mb-4 shadow-lg shadow-[#F59E0B]/20">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Manager Portal</h1>
            <p className="text-slate-400 text-sm mt-2 text-center">Secure access for Surya Bank Branch Managers & Executives.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center animate-pulse">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Manager ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder="Enter your Manager ID"
                  className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your secure password"
                  className="w-full pl-10 pr-12 py-3 bg-[#0F172A] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-4 bg-gradient-to-r from-[#F59E0B] to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-[#F59E0B]/25 transition-all active:scale-[0.98]"
            >
              Secure Login
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-xs text-slate-500">
              <Lock size={10} className="inline mr-1" />
              End-to-end encrypted connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
