import React from 'react';
import { Settings } from 'lucide-react';

const ManagerProfile = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Manager Profile</h1>
        </div>
      </div>
      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-8 border border-slate-700/50 shadow-lg text-center flex flex-col items-center justify-center min-h-[400px]">
        <Settings size={64} className="text-[#F59E0B] mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-slate-300">Profile Settings Loading...</h2>
      </div>
    </div>
  );
};

export default ManagerProfile;
