import React, { useState } from 'react';
import ExecutiveStats from '../../components/ceo/awards/ExecutiveStats';
import InteractiveTimeline from '../../components/ceo/awards/InteractiveTimeline';
import GlobalRecognitionMap from '../../components/ceo/awards/GlobalRecognitionMap';
import DigitalTrophyGallery from '../../components/ceo/awards/DigitalTrophyGallery';
import ExecutiveAnalytics from '../../components/ceo/awards/ExecutiveAnalytics';
import LeadershipImpact from '../../components/ceo/awards/LeadershipImpact';
import MediaAndCertificates from '../../components/ceo/awards/MediaAndCertificates';
import AiAwardsAssistant from '../../components/ceo/awards/AiAwardsAssistant';
import AwardDetailModal from '../../components/ceo/awards/AwardDetailModal';
import { Download, Share2 } from 'lucide-react';
import { generatePdfLetter } from './CeoMockData';

const CeoAwards = () => {
  const [selectedAward, setSelectedAward] = useState(null);

  const handleExportSummary = () => {
    const title = "Executive Recognition & Awards Summary";
    const content = "Surya Bank, under the leadership of CEO Sushanth NS, has been recognized globally for its excellence in banking, technology innovation, and environmental stewardship.\n\n" +
      "Key Milestones:\n" +
      "• Over 85 Global Accolades across 18 countries.\n" +
      "• Named Global Banker of the Year (2026).\n" +
      "• Pioneer in AI Underwriting and Post-Quantum Cryptographic ledgers.\n" +
      "• Deployed $5B towards Green Infrastructure Initiatives.\n\n" +
      "This document serves as an official verified summary of Surya Bank's executive honors portfolio. For detailed certificates and citations, please visit the live Executive Honors Portal.";
    generatePdfLetter(title, content, "investor-relations@suryabank.com");
  };

  const handleSharePortfolio = async () => {
    const shareData = {
      title: 'Surya Bank Executive Honors',
      text: 'Explore the verified global recognition and awards of Surya Bank and CEO Sushanth NS.',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Portfolio link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing portfolio:', err);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      
      {/* Premium Header */}
      <div className="relative pt-8 pb-12 border-b border-slate-800 text-center max-w-4xl mx-auto space-y-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ceo-gold/50 to-transparent" />
        
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-ceo-gold px-4 py-1.5 rounded-full border border-ceo-gold/30 bg-ceo-gold/10 inline-block">
          Executive Honors & Global Recognition Center
        </span>
        
        <h1 className="text-4xl md:text-5xl font-serif text-white font-bold leading-tight">
          A Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-ceo-gold to-yellow-600">Global Excellence</span>
        </h1>
        
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Explore the milestones, innovations, and institutional accolades defining Sushanth NS's leadership journey. Verified digital records of worldwide impact across finance, technology, and sustainability.
        </p>

        <div className="flex justify-center gap-3 pt-4">
          <button onClick={handleExportSummary} className="flex items-center gap-2 px-4 py-2 bg-ceo-gold hover:bg-yellow-500 text-slate-900 rounded-lg text-xs font-bold transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Download size={14} /> Export Executive Summary
          </button>
          <button onClick={handleSharePortfolio} className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-ceo-gold/50 text-slate-300 rounded-lg text-xs font-bold transition-colors">
            <Share2 size={14} /> Share Portfolio
          </button>
        </div>
      </div>

      {/* Main Stats Counter */}
      <ExecutiveStats />

      {/* Primary Analytics & Global Map */}
      <div className="grid grid-cols-1 gap-12">
        <ExecutiveAnalytics />
        <GlobalRecognitionMap onAwardClick={setSelectedAward} />
      </div>

      {/* Leadership Impact Pillars */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-white font-bold">Leadership Impact</h2>
          <p className="text-xs text-slate-400 mt-1">Driving institutional change through visionary pillars.</p>
        </div>
        <LeadershipImpact />
      </div>

      {/* Interactive Timeline & 3D Trophy Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <DigitalTrophyGallery onAwardClick={setSelectedAward} />
        <InteractiveTimeline onAwardClick={setSelectedAward} />
      </div>

      {/* Media and Verified Certificates */}
      <MediaAndCertificates onAwardClick={setSelectedAward} />

      {/* Floating AI Assistant */}
      <AiAwardsAssistant />

      {/* Detail Modal */}
      {selectedAward && (
        <AwardDetailModal 
          award={selectedAward} 
          onClose={() => setSelectedAward(null)} 
        />
      )}
      
    </div>
  );
};

export default CeoAwards;
