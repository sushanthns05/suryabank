import React, { useState } from 'react';
import { FileText, Download, Eye, X, BookOpen } from 'lucide-react';
import { publicationsLibrary, generatePdfLetter } from './CeoMockData';
import { useCeoAuth } from '../../context/CeoAuthContext';

const publicationFullTexts = {
  p1: `Surya Bank Shareholder Letter - FY2025 Annual Review
  
  In the fiscal year of 2025, Surya Bank achieved an annual revenue of $4.8 Billion. We have expanded our mobile retail services to accommodate over 25 million accounts and consolidated our position in European clearing corridors.
  
  Technological advancements have driven high capital efficiency. The implementation of automated AI risk evaluation pipelines has successfully reduced credit losses below 0.2%, while preserving 100% uptime profiles on database clusters.
  
  Sustainable commitment structures are at the core of our business layout. Our green bond allocation framework underwrote $3.2 Billion in sustainable infrastructure, making Surya Bank a global leader in green commercial financing.`,
  
  p2: `Quantum Security Migration Path for Enterprise Financial Ledgers
  
  This whitepaper details lattice-based cryptographic integration models within transactional ledgers.
  
  Introduction: Standard public key infrastructure (including RSA and ECC) is vulnerable to polynomial-time quantum attacks.
  
  Migration Protocols: We implement a three-phase transition including dual hybrid key encapsulation mechanisms (KEM) to safeguard accounts before decryption attacks emerge. Core mobile wallet handshakes are updated to lattice authentication models.`,
  
  p3: `Empirical Analysis of Mobile Micro-Underwriting Performance
  
  Abstract: This research details loan default performance metrics across 150,000 active SME loans in emerging markets.
  
  By utilizing alternative cash-flow parameters instead of traditional asset collateral scorecards, we successfully extended credit lines to rural business owners, reporting default rates under 0.32% over a 12-month period.`,
  
  p4: `Surya Bank Corporate ESG Framework & Reporting Guidelines
  
  Corporate report detail: Scope 1, 2, and 3 emission measurements.
  
  Our carbon mitigation roadmap targets complete neutrality by 2030. We audit gender parity stats across management structures quarterly, showing 42% women representation on VP desks. Green investments guidelines prohibit funding coal power projects.`
};

const CeoPublications = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [viewingPub, setViewingPub] = useState(null);
  const { user } = useCeoAuth();

  const categories = ['All', 'Annual Letters', 'Whitepapers', 'Research', 'Corporate Reports'];

  const filteredPubs = publicationsLibrary.filter(pub => 
    activeTab === 'All' || pub.category === activeTab
  );

  const handleDownload = (pub) => {
    const text = publicationFullTexts[pub.docUrl] || "Official Publication from the Office of the CEO";
    generatePdfLetter(pub.title, text, user?.email);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Research Library</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">Publications</h1>
        <p className="text-xs text-slate-400">Browse official corporate filings, academic research on digital finance, and technical cybersecurity whitepapers.</p>
      </div>

      {/* Filter Tabs */}
      <section className="flex gap-2 overflow-x-auto pb-2 justify-center">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              activeTab === cat
                ? 'bg-ceo-gold border-ceo-gold text-ceo-navy'
                : 'bg-slate-905 bg-slate-900 border-slate-805 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Publications Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {filteredPubs.map((pub) => (
          <div 
            key={pub.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-805 hover:border-ceo-gold/40 transition-all shadow-lg flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <span className="text-ceo-gold bg-ceo-gold/10 px-2 py-0.5 rounded border border-ceo-gold/20">
                  {pub.category}
                </span>
                <span>July 2026</span>
              </div>

              <h3 className="font-serif text-sm font-semibold text-white group-hover:text-ceo-gold transition-colors">
                {pub.title}
              </h3>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                {pub.description}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-800/80 mt-6 flex justify-between items-center">
              <span className="text-[9px] text-slate-500 font-mono">Format: PDF / Dynamic View</span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingPub(pub)}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-900 hover:border-slate-700 flex items-center gap-1.5 text-[10px] font-semibold transition-colors"
                >
                  <Eye size={12} /> View Online
                </button>
                <button
                  onClick={() => handleDownload(pub)}
                  className="p-2 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy flex items-center gap-1.5 text-[10px] font-bold transition-colors"
                >
                  <Download size={12} /> Download PDF
                </button>
              </div>
            </div>

          </div>
        ))}
      </section>

      {/* Online Document Reader Modal */}
      {viewingPub && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setViewingPub(null)} />
          
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-white max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingPub(null)}
              className="absolute top-6 right-6 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="space-y-4">
              <div className="space-y-1 pr-10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-ceo-gold">{viewingPub.category}</span>
                <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <BookOpen size={20} className="text-ceo-gold shrink-0" /> {viewingPub.title}
                </h3>
              </div>
              
              <div className="p-6 bg-slate-950 border border-slate-855 rounded-2xl text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {publicationFullTexts[viewingPub.docUrl] || "Loading document data..."}
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                <span>Regulatory Verification Ref: SURYA-PUB-0{viewingPub.id}</span>
                <button 
                  onClick={() => handleDownload(viewingPub)}
                  className="text-ceo-gold font-bold hover:underline"
                >
                  Download Signed Copy (PDF)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CeoPublications;
