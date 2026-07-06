import React from 'react';
import { Download, FileText, Presentation, FilePieChart, BookOpen } from 'lucide-react';
import { generatePdfLetter } from '../../../pages/ceo/CeoMockData';

const StrategyDownloads = () => {

  const handleDownload = (type) => {
    let title = "Executive Strategy Report";
    let content = "Surya Bank Strategic Operating Blueprint.\n\nThis is a highly confidential document intended for the Board of Directors. It contains forward-looking statements regarding expansion into new markets, capital expenditure on green bonds ($5B), and internal tech restructuring.";
    
    if (type === 'investor') {
      title = "Investor Strategy Deck";
      content = "Surya Bank Investor Outlook.\n\nProjecting 15% CAGR based on Retail scaling and Corporate Treasury pipelines. NPA expected to stay below 1.1%.";
    }

    generatePdfLetter(title, content, "ceo@suryabank.com");
  };

  const docs = [
    { name: 'Q3 Board Report', type: 'board', desc: 'Full execution summary for board members.', icon: BookOpen },
    { name: 'Investor Strategy Deck', type: 'investor', desc: 'Slide summaries for Q3 earnings.', icon: Presentation },
    { name: 'ESG Transformation PDF', type: 'esg', desc: 'Details on the $5B green bond allocation.', icon: FilePieChart },
    { name: 'Executive Master Plan', type: 'master', desc: 'The comprehensive 2030 vision blueprint.', icon: FileText }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-8">
        <Download className="text-ceo-gold" />
        <h2 className="text-2xl font-serif text-white font-bold">Executive Download Center</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {docs.map((doc, i) => (
          <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-ceo-gold/30 transition-all group">
            <div>
              <doc.icon className="text-slate-500 mb-3 group-hover:text-ceo-gold transition-colors" size={24} />
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

export default StrategyDownloads;
