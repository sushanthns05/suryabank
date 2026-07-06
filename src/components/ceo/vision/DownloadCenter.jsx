import React from 'react';
import { Download, FileText } from 'lucide-react';
import { generatePdfLetter } from '../../../pages/ceo/CeoMockData';

const DownloadCenter = () => {

  const handleDownload = (type) => {
    let title = "Strategic Vision Document";
    let content = "Surya Bank Strategic Vision Outline.\n\nThis document details the transformation roadmap, including expansion plans, AI integration strategies, and our $5B commitment to sustainable finance.";
    
    if (type === 'investor') {
      title = "Investor Presentation Summary";
      content = "Surya Bank Investor Outlook 2026-2030.\n\nFocusing on high margin digital acquisition, retaining customers through AI-driven personalization, and projecting a 15% CAGR in revenue.";
    }

    generatePdfLetter(title, content, "ceo@suryabank.com");
  };

  const docs = [
    { name: 'Full Vision Document', type: 'vision', desc: 'Complete 40-page strategy blueprint.' },
    { name: 'Investor Presentation', type: 'investor', desc: 'Slide deck summary for Q3 earnings.' },
    { name: 'ESG Whitepaper', type: 'vision', desc: 'Details on the $5B green bond allocation.' },
    { name: 'Cybersecurity Architecture', type: 'vision', desc: 'Post-Quantum cryptography transition plan.' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-8">
        <Download className="text-ceo-gold" />
        <h2 className="text-2xl font-serif text-white font-bold">Document & Download Center</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {docs.map((doc, i) => (
          <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-ceo-gold/30 transition-all group">
            <div>
              <FileText className="text-slate-500 mb-3 group-hover:text-ceo-gold transition-colors" size={24} />
              <h3 className="text-sm font-bold text-white mb-1">{doc.name}</h3>
              <p className="text-[10px] text-slate-400 mb-4">{doc.desc}</p>
            </div>
            <button 
              onClick={() => handleDownload(doc.type)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold transition-colors border border-slate-700 hover:border-ceo-gold/50"
            >
              <Download size={14} /> Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadCenter;
