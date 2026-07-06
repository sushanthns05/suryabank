import React from 'react';
import { FileText, Download, QrCode, PlayCircle, ExternalLink } from 'lucide-react';
import { extendedAwardsList, generatePdfLetter } from '../../../pages/ceo/CeoMockData';

const MediaAndCertificates = ({ onAwardClick }) => {
  const handleDownloadCertificate = (award) => {
    const title = `Official Certificate - ${award.title}`;
    const content = `Awarded to: CEO Sushanth NS\nOrganization: ${award.organization}\nDate: ${award.date}\n\nCitation:\n"${award.officialCitation}"\n\nThis document is a certified digital record of achievement.\n\nVerification Hash: ${award.verificationHash}\nCertificate Number: ${award.certificateNumber}`;
    generatePdfLetter(title, content, "ceo@suryabank.com");
  };
  // Only take a few awards with images for media
  const mediaAwards = extendedAwardsList.filter(a => a.imageUrl).slice(0, 3);
  const certAwards = extendedAwardsList.filter(a => a.verificationStatus).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Media Center */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif text-white font-bold flex items-center gap-2">
              <PlayCircle className="text-ceo-gold" /> Media Center
            </h3>
            <button className="text-xs text-ceo-gold font-bold uppercase tracking-wider hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {mediaAwards.map(award => (
              <div 
                key={award.id}
                onClick={() => onAwardClick && onAwardClick(award)}
                className="group flex gap-4 p-3 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-ceo-gold/40 cursor-pointer transition-all"
              >
                <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 relative">
                  <img src={award.imageUrl} alt={award.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {award.videoUrl && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <PlayCircle className="text-white opacity-80" size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ceo-gold">{award.date}</span>
                  <h4 className="text-sm font-bold text-white leading-tight mt-1 mb-1 truncate">{award.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{award.pressRelease}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Center */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif text-white font-bold flex items-center gap-2">
              <FileText className="text-ceo-gold" /> Certificate Vault
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certAwards.map(award => (
              <div 
                key={`cert-${award.id}`}
                className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 hover:border-ceo-gold/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <FileText className="text-slate-400" size={20} />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDownloadCertificate(award)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-ceo-gold transition-colors"
                      title="Download Certificate"
                    >
                      <Download size={14} />
                    </button>
                    <button 
                      onClick={() => onAwardClick && onAwardClick(award)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-ceo-gold transition-colors"
                      title="View Details"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
                
                <h4 className="text-xs font-bold text-white mb-1 truncate">{award.certificateNumber}</h4>
                <p className="text-[10px] text-slate-400 uppercase truncate mb-4">{award.organization}</p>
                
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">{award.verificationStatus}</span>
                  </div>
                  <QrCode size={14} className="text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MediaAndCertificates;
