import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, Calendar, ArrowUpRight, Award, TrendingUp } from 'lucide-react';

const chartData = [
  { name: '2021', aum: 180, dividend: 1.1 },
  { name: '2022', aum: 220, dividend: 1.25 },
  { name: '2023', aum: 290, dividend: 1.5 },
  { name: '2024', aum: 360, dividend: 1.85 },
  { name: '2025', aum: 410, dividend: 2.1 },
  { name: '2026', aum: 450, dividend: 2.35 }
];

const InvestorDashboard = () => {

  const downloads = [
    { title: "2025 Annual Financial Report", size: "14.2 MB", type: "PDF" },
    { title: "Q1 2026 Earnings Slide Desk", size: "4.8 MB", type: "PDF" },
    { title: "Surya Bank Green Bond Framework", size: "2.1 MB", type: "PDF" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold">Investor Relations Dashboard</span>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-1">Investor Portal</h1>
        <p className="text-xs text-slate-400">Track dividend payouts, download audited financial disclosures, and view asset metrics.</p>
      </div>

      {/* Tickers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-805 p-4 rounded-2xl shadow-md">
          <span className="text-[9px] uppercase font-bold text-slate-500">Stock Symbol</span>
          <strong className="block text-base font-serif text-white">SURYABANK (NSE)</strong>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
            ₹342.10 (+2.4%) <ArrowUpRight size={12} />
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-805 p-4 rounded-2xl shadow-md">
          <span className="text-[9px] uppercase font-bold text-slate-500">Dividend Yield</span>
          <strong className="block text-base font-serif text-white">3.15%</strong>
          <span className="text-[9px] text-slate-450 mt-1 block">Payout Ratio: 42%</span>
        </div>
        <div className="bg-slate-900 border border-slate-805 p-4 rounded-2xl shadow-md">
          <span className="text-[9px] uppercase font-bold text-slate-550">ESG Rating</span>
          <strong className="block text-base font-serif text-emerald-400 font-bold">AAA</strong>
          <span className="text-[9px] text-slate-450 mt-1 block">MSCI Leadership index</span>
        </div>
        <div className="bg-slate-900 border border-slate-805 p-4 rounded-2xl shadow-md">
          <span className="text-[9px] uppercase font-bold text-slate-550">Authorized Share Capital</span>
          <strong className="block text-base font-serif text-white">₹5,000 Crores</strong>
          <span className="text-[9px] text-slate-450 mt-1 block">Paid-up: ₹2,400 Cr</span>
        </div>
      </div>

      {/* Chart & Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Assets Growth Chart */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-805 p-4 sm:p-6 rounded-3xl shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={14} className="text-ceo-gold" /> Assets Under Management (AUM) Growth ($ Billions)
          </h3>
          <div className="h-64 sm:h-80 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                <Area type="monotone" dataKey="aum" stroke="#D4AF37" fillOpacity={1} fill="url(#colorAum)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Downloads & Calendar */}
        <div className="lg:col-span-4 space-y-6 text-xs text-left">
          
          {/* File Downloads */}
          <div className="bg-slate-900 border border-slate-805 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <FileText size={14} className="text-ceo-gold" /> Shareholder Reports
            </h3>
            
            <div className="space-y-3">
              {downloads.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center gap-4">
                  <div>
                    <strong className="block text-white truncate max-w-[160px]">{item.title}</strong>
                    <span className="block text-[9px] text-slate-500 mt-0.5">{item.size} | {item.type}</span>
                  </div>
                  <button 
                    onClick={() => alert(`Downloading: ${item.title}`)}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-ceo-gold border border-slate-800"
                  >
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ notice */}
          <div className="p-4 bg-slate-900 border border-slate-805 rounded-2xl flex items-start gap-2.5">
            <Award className="text-ceo-gold shrink-0 mt-0.5" size={16} />
            <div>
              <strong className="block text-white text-[10px] uppercase font-bold">Dividend payout notification</strong>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                The Board proposed final dividend of ₹2.35 per share for financial year 2025-26. Payout date: August 14, 2026.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default InvestorDashboard;
