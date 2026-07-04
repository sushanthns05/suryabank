import React from 'react';
import { Building2, Users, Briefcase, Crown } from 'lucide-react';

const DesktopPortalSelector = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
          Surya Bank
        </h1>
        <p className="text-xl text-gray-300">Select Portal to Continue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {/* Customer Portal */}
        <button
          onClick={() => onSelect('customer')}
          className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl hover:bg-gray-700/50 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-100 text-center">Customer Portal</h2>
          <p className="text-gray-400 text-center text-sm">
            Access retail banking, accounts, loans, and other customer services.
          </p>
        </button>

        {/* Employee Portal */}
        <button
          onClick={() => onSelect('employee')}
          className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl hover:bg-gray-700/50 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Briefcase size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-100 text-center">Employee Portal</h2>
          <p className="text-gray-400 text-center text-sm">
            Staff dashboard for account opening, loan processing, and customer management.
          </p>
        </button>

        {/* Manager Portal */}
        <button
          onClick={() => onSelect('manager')}
          className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl hover:bg-gray-700/50 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Building2 size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-100 text-center">Manager Portal</h2>
          <p className="text-gray-400 text-center text-sm">
            Branch administration, employee oversight, audits, and performance reports.
          </p>
        </button>

        {/* CEO Portal */}
        <button
          onClick={() => onSelect('ceo')}
          className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl hover:bg-gray-700/50 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Crown size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-100 text-center">CEO Portal</h2>
          <p className="text-gray-400 text-center text-sm">
            Executive website and office for Sushanth NS, CEO, Chairman & Founder.
          </p>
        </button>
      </div>

      <div className="mt-16 text-gray-500 text-sm">
        Surya Bank Desktop Application &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default DesktopPortalSelector;
