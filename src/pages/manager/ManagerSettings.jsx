import React, { useState, useEffect } from 'react';
import { 
  Settings, Building2, Shield, Bell, Save, MapPin, Phone, Mail, 
  Moon, Lock, Key, AlertTriangle, CheckCircle2, Server, Clock
} from 'lucide-react';

const DEFAULT_SETTINGS = {
  branchName: 'Kengeri Satellite Town',
  branchCode: 'SURY-KST-001',
  ifscCode: 'SURY0001045',
  address: 'No 45, Outer Ring Road, Kengeri Satellite Town, Bangalore',
  phone: '+91 80 2848 1234',
  email: 'kst.branch@suryabank.com',
  workingHours: '09:00 AM - 04:00 PM',
  
  security2FA: true,
  passwordRotation: true,
  sessionTimeout: '15',
  biometricLogin: false,
  
  notifyEmail: true,
  notifySMS: true,
  notifyLoans: true,
  notifyHighValue: true,
  notifyServer: false
};

const ManagerSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error'

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('managerSystemSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    
    // Simulate API delay
    setTimeout(() => {
      localStorage.setItem('managerSystemSettings', JSON.stringify(settings));
      setIsSaving(false);
      setSaveStatus('success');
      
      // Clear status message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const Toggle = ({ label, name, checked, description }) => (
    <div className="flex items-start justify-between p-4 bg-[#0F172A]/50 rounded-xl border border-slate-700/50 hover:bg-[#0F172A] transition-colors">
      <div className="pr-4">
        <p className="font-bold text-slate-200 text-sm">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
        <input 
          type="checkbox" 
          name={name}
          checked={checked}
          onChange={handleChange}
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B]"></div>
      </label>
    </div>
  );

  const InputField = ({ label, icon: Icon, name, type = "text", ...props }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
        <input 
          type={type}
          name={name}
          value={settings[name]}
          onChange={handleChange}
          className={`w-full py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] text-sm ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
          {...props}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">System Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure branch operations and global security protocols.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-gradient-to-r from-[#F59E0B] to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#F59E0B]/20 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save size={16} />
          )}
          {isSaving ? 'Saving...' : 'Save Configurations'}
        </button>
      </div>

      {saveStatus === 'success' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} />
          <p className="font-bold text-sm">System configurations successfully saved and deployed.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Form Zones */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Branch Operations */}
          <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-700/50 bg-[#0F172A]/80 flex items-center gap-3">
              <Building2 size={20} className="text-[#F59E0B]" />
              <h2 className="text-lg font-bold text-white">Branch Operational Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Branch Name" name="branchName" icon={Building2} />
              <InputField label="Branch Code" name="branchCode" icon={Server} />
              <InputField label="IFSC Code" name="ifscCode" icon={Server} />
              <InputField label="Working Hours" name="workingHours" icon={Clock} />
              <div className="md:col-span-2">
                <InputField label="Official Address" name="address" icon={MapPin} />
              </div>
              <InputField label="Branch Phone" name="phone" icon={Phone} />
              <InputField label="Support Email" name="email" icon={Mail} />
            </div>
          </div>

          {/* Security Protocols */}
          <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-700/50 bg-[#0F172A]/80 flex items-center gap-3">
              <Shield size={20} className="text-[#F59E0B]" />
              <h2 className="text-lg font-bold text-white">Security & Authentication</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Toggle 
                label="Enforce 2FA" 
                name="security2FA" 
                checked={settings.security2FA} 
                description="Require two-factor authentication for all employee logins."
              />
              <Toggle 
                label="Biometric Login" 
                name="biometricLogin" 
                checked={settings.biometricLogin} 
                description="Allow fingerprint login on supported POS devices."
              />
              <Toggle 
                label="90-Day Password Rotation" 
                name="passwordRotation" 
                checked={settings.passwordRotation} 
                description="Force employees to update passwords every 90 days."
              />
              <div className="p-4 bg-[#0F172A]/50 rounded-xl border border-slate-700/50">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Idle Session Timeout (Minutes)</label>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-slate-500" />
                  <select 
                    name="sessionTimeout"
                    value={settings.sessionTimeout}
                    onChange={handleChange}
                    className="flex-1 bg-[#1E293B] border border-slate-700 rounded-lg py-1.5 px-3 text-white text-sm focus:outline-none focus:border-[#F59E0B]"
                  >
                    <option value="5">5 Minutes</option>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column - Preferences */}
        <div className="space-y-6">
          
          {/* Notification Preferences */}
          <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-700/50 bg-[#0F172A]/80 flex items-center gap-3">
              <Bell size={20} className="text-[#F59E0B]" />
              <h2 className="text-lg font-bold text-white">Alert Preferences</h2>
            </div>
            <div className="p-6 space-y-4">
              <Toggle label="Email Notifications" name="notifyEmail" checked={settings.notifyEmail} />
              <Toggle label="SMS Alerts" name="notifySMS" checked={settings.notifySMS} />
              <div className="my-4 border-t border-slate-700/50"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notify me when:</p>
              <Toggle label="New Loan Applications" name="notifyLoans" checked={settings.notifyLoans} />
              <Toggle label="High-Value Transfers" name="notifyHighValue" checked={settings.notifyHighValue} description="Transfers over ₹5,00,000" />
              <Toggle label="Server Maintenance" name="notifyServer" checked={settings.notifyServer} />
            </div>
          </div>

          {/* Theme Enforcement */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-700/50 shadow-xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-slate-800 opacity-50 pointer-events-none">
              <Moon size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-slate-400" />
                <h3 className="font-bold text-white text-lg">System Appearance</h3>
              </div>
              <p className="text-sm text-slate-400 mb-6">Visual themes are locked by enterprise administrators.</p>
              
              <div className="flex items-center justify-between p-4 bg-[#1E293B] rounded-xl border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600">
                    <Moon size={14} className="text-slate-300" />
                  </div>
                  <span className="font-bold text-slate-200">Dark Mode</span>
                </div>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-500/20">Enforced</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ManagerSettings;
