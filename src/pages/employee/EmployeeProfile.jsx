import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Save, Key, Camera } from 'lucide-react';
import Button from '../../../src/components/ui/Button';

const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: 'Sushanth',
    lastName: 'N S',
    email: 'sushanthns05@surya-bank.com',
    phone: '+91 98765 43210',
    address: '123 Banking Street, Finance District, Bangalore, 560001',
    employeeId: 'EMP-05092006',
    department: 'Branch Operations',
    role: 'Branch Manager',
    joinDate: '2023-01-15'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Employee Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Profile Card */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-surya-primary to-blue-800"></div>
            <div className="px-6 pb-6 relative">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-surya-surfaceDark bg-slate-200 dark:bg-slate-700 mx-auto -mt-12 flex items-center justify-center relative overflow-hidden group">
                <User size={48} className="text-slate-400" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <div className="text-center mt-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{formData.firstName} {formData.lastName}</h2>
                <p className="text-sm text-surya-primary dark:text-surya-secondary font-medium mt-1">{formData.role}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 mt-3 border border-slate-200 dark:border-slate-700">
                  <Shield size={14} className="text-green-500" /> Authorized Personnel
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Mail size={16} className="text-slate-400" />
                  {formData.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Briefcase size={16} className="text-slate-400" />
                  {formData.department}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar size={16} className="text-slate-400" />
                  Joined {new Date(formData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Settings */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white dark:bg-surya-surfaceDark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'personal' ? 'border-surya-primary text-surya-primary dark:border-surya-secondary dark:text-surya-secondary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                Personal Information
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security' ? 'border-surya-primary text-surya-primary dark:border-surya-secondary dark:text-surya-secondary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                Security Settings
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'personal' && (
                <form onSubmit={handleSave} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Edit Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Office Address</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                      <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button 
                      type="submit" 
                      className="flex items-center gap-2 px-6 py-2.5 bg-surya-primary text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm"
                    >
                      <Save size={18} /> Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Change Password</h3>
                  <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Password changed securely."); }}>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                      <div className="relative">
                        <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                      <div className="relative">
                        <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                      <div className="relative">
                        <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-surya-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button 
                        type="submit" 
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors shadow-sm"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
