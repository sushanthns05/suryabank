import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileText, Calendar, TrendingUp, HelpCircle, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { financialHighlights, investorFAQs } from './CeoMockData';

const CeoInvestorRelations = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="space-y-12 animate-in fade-in duration-305">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Investor Relations</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">Investor Portal</h1>
        <p className="text-xs text-slate-400">Review audited balance highlights, historical dividend payouts, earnings webcasts, and share data.</p>
      </div>

      {/* Financial Performance Highlights */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {financialHighlights.summary.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-905 bg-slate-900 border border-slate-805 text-center">
            <span className="block text-2xl font-bold text-white tracking-tight">{stat.value}</span>
            <span className="block text-[9px] text-slate-500 uppercase font-semibold mt-2">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Performance Graph Panel */}
      <section className="bg-slate-950 border border-slate-855 rounded-3xl p-6 space-y-6 shadow-xl">
        <div>
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <TrendingUp className="text-ceo-gold" size={16} /> Revenue & Profit Performance
          </h3>
          <p className="text-[10px] text-slate-500">Historical performance figures over the last 4 fiscal years in Billions USD.</p>
        </div>

        <div className="h-64 text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={financialHighlights.chartData}
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
            >
              <XAxis dataKey="year" stroke="#475569" strokeWidth={0.5} tickLine={false} />
              <YAxis stroke="#475569" strokeWidth={0.5} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                labelStyle={{ fontWeight: 'bold', color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar name="Total Revenue ($B)" dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              <Bar name="Net Income ($B)" dataKey="profit" fill="#0B3D91" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Reports & Dividend Splits */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Dividend History */}
        <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="font-serif text-base text-white font-bold">Dividend Record History</h3>
          <p className="text-xs text-slate-400">Regular distributions paid on outstanding common stock shares.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="py-2">Year</th>
                  <th className="py-2">Dividend / Share</th>
                  <th className="py-2 text-right">Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {financialHighlights.dividendHistory.map((div, idx) => (
                  <tr key={idx} className="border-b border-slate-800/60 last:border-0 text-slate-350">
                    <td className="py-2.5 font-bold text-white">{div.year}</td>
                    <td className="py-2.5 text-ceo-gold font-semibold">{div.dividend}</td>
                    <td className="py-2.5 text-right text-slate-400">{div.exDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Download Center */}
        <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="font-serif text-base text-white font-bold">Document Download Center</h3>
          <p className="text-xs text-slate-400">Access full PDF summaries and strategic slideshow decks compiled by the Chairman.</p>
          
          <div className="space-y-3">
            {[
              { title: "Q3 FY2026 Earnings Presentation", size: "4.2 MB", type: "Slides Deck" },
              { title: "FY2025 Audited Balance Sheets", size: "8.5 MB", type: "PDF Audit" },
              { title: "International Clearing Compliance Guidelines", size: "2.1 MB", type: "PDF Guide" }
            ].map((doc, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-ceo-gold shrink-0" size={18} />
                  <div>
                    <span className="block text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-xs">{doc.title}</span>
                    <span className="block text-[9px] text-slate-500 uppercase font-semibold mt-0.5">{doc.type} ({doc.size})</span>
                  </div>
                </div>
                <button className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Expandable FAQs Accordion */}
      <section className="max-w-3xl mx-auto space-y-6">
        <h3 className="font-serif text-lg text-white font-bold text-center flex items-center justify-center gap-2">
          <HelpCircle className="text-ceo-gold" size={20} /> Investor Frequently Asked Questions
        </h3>
        
        <div className="space-y-3">
          {investorFAQs.map((faq, idx) => (
            <div key={idx} className="border border-slate-805 bg-slate-900 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 text-xs font-semibold text-white hover:bg-slate-850/60 transition-colors"
              >
                <span>{faq.question}</span>
                {activeFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default CeoInvestorRelations;
