import React from 'react';
import { UserCheck } from 'lucide-react';

const ManagerEmployees = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Employee Directory</h1>
          <p className="text-slate-400 text-sm mt-1">Manage staff across all branches.</p>
        </div>
      </div>
      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-8 border border-slate-700/50 shadow-lg text-center flex flex-col items-center justify-center min-h-[400px]">
        <UserCheck size={64} className="text-[#F59E0B] mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-slate-300">Staff Records Loading...</h2>
      </div>
    </div>
  );
};

export default ManagerEmployees;
