import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Edit2, Save, Trash2, ShieldCheck, Award, CheckCircle } from 'lucide-react';

const DEFAULT_PROFILE = {
  fullName: 'Sushanth N S',
  role: 'Manager and Head of Bank',
  branch: 'Kengeri Satellite Town',
  mobile: '8310034078',
  email: 'sushanthns5926@gmail.com',
  employeeId: 'EMP-SURY-001',
  joinDate: '2020-04-15'
};

const ManagerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  // Load from local storage if exists
  useEffect(() => {
    const saved = localStorage.getItem('managerProfileData');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse profile data");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('managerProfileData', JSON.stringify(profile));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleDeleteData = () => {
    if (window.confirm('Are you sure you want to clear your profile data?')) {
      const clearedProfile = {
        fullName: '',
        role: '',
        branch: '',
        mobile: '',
        email: '',
        employeeId: '',
        joinDate: ''
      };
      setProfile(clearedProfile);
      localStorage.setItem('managerProfileData', JSON.stringify(clearedProfile));
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Restore default profile data (Sushanth N S)?')) {
      setProfile(DEFAULT_PROFILE);
      localStorage.setItem('managerProfileData', JSON.stringify(DEFAULT_PROFILE));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Manager Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your administrative credentials and details.</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
            >
              <Save size={16} /> Save Changes
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#F59E0B]/20 hover:scale-105 transition-transform"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-b border-slate-700"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#F59E0B] to-yellow-600 p-1 shadow-lg mb-4 mt-4">
                <div className="w-full h-full bg-[#0F172A] rounded-xl flex items-center justify-center">
                  <User size={40} className="text-[#F59E0B]" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">{profile.fullName || 'No Name'}</h2>
              <p className="text-[#F59E0B] font-medium text-sm mb-4">{profile.role || 'No Role'} at {profile.branch}</p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-6">
                <ShieldCheck size={14} /> System Administrator
              </div>
            </div>

            <div className="space-y-4 text-left border-t border-slate-700/50 pt-6">
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center shrink-0 border border-slate-700">
                  <Mail size={14} className="text-slate-400" />
                </div>
                <span className="truncate">{profile.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center shrink-0 border border-slate-700">
                  <Phone size={14} className="text-slate-400" />
                </div>
                <span>{profile.mobile || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center shrink-0 border border-slate-700">
                  <MapPin size={14} className="text-slate-400" />
                </div>
                <span>{profile.branch || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
            <h3 className="text-red-400 font-bold flex items-center gap-2 mb-2"><Trash2 size={16} /> Danger Zone</h3>
            <p className="text-xs text-slate-400 mb-4">Permanently clear or reset your profile data from the local storage.</p>
            <div className="flex gap-2">
              <button onClick={handleDeleteData} className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-xs font-bold transition-colors">
                Clear Data
              </button>
              <button onClick={handleResetToDefault} className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-lg text-xs font-bold transition-colors">
                Restore Default
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden h-full">
            <div className="p-6 border-b border-slate-700/50 bg-[#0F172A]/50 flex items-center gap-3">
              <Briefcase size={20} className="text-[#F59E0B]" />
              <h2 className="text-lg font-bold text-white">Professional Details</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={profile.fullName} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-[#0F172A] border rounded-xl text-white transition-colors ${isEditing ? 'border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]' : 'border-slate-700 opacity-70 cursor-not-allowed'}`}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={profile.email} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-[#0F172A] border rounded-xl text-white transition-colors ${isEditing ? 'border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]' : 'border-slate-700 opacity-70 cursor-not-allowed'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
                  <input 
                    type="text" 
                    name="mobile"
                    value={profile.mobile} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-[#0F172A] border rounded-xl text-white transition-colors ${isEditing ? 'border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]' : 'border-slate-700 opacity-70 cursor-not-allowed'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Role Title</label>
                  <input 
                    type="text" 
                    name="role"
                    value={profile.role} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-[#0F172A] border rounded-xl text-white transition-colors ${isEditing ? 'border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]' : 'border-slate-700 opacity-70 cursor-not-allowed'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Branch</label>
                  <input 
                    type="text" 
                    name="branch"
                    value={profile.branch} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-[#0F172A] border rounded-xl text-white transition-colors ${isEditing ? 'border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]' : 'border-slate-700 opacity-70 cursor-not-allowed'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Employee ID</label>
                  <input 
                    type="text" 
                    name="employeeId"
                    value={profile.employeeId} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-[#0F172A] border rounded-xl text-white transition-colors ${isEditing ? 'border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]' : 'border-slate-700 opacity-70 cursor-not-allowed'}`}
                  />
                </div>
              </div>

              {/* Achievements / Status (Read Only) */}
              <div className="mt-8 pt-8 border-t border-slate-700/50">
                <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2"><Award size={16} className="text-[#F59E0B]"/> Official Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Clearance Level</p>
                      <p className="text-emerald-400 font-bold mt-0.5">Tier 1 (Executive)</p>
                    </div>
                    <ShieldCheck size={24} className="text-emerald-500/20" />
                  </div>
                  <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Account Status</p>
                      <p className="text-blue-400 font-bold mt-0.5">Active & Verified</p>
                    </div>
                    <CheckCircle size={24} className="text-blue-500/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ManagerProfile;
