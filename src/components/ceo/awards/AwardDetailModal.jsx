import React from 'react';
import { X, Award, MapPin, Calendar, User, ExternalLink, Download, FileText, Share2, PlayCircle, ShieldCheck } from 'lucide-react';
import { generatePdfLetter } from '../../../pages/ceo/CeoMockData';

const AwardDetailModal = ({ award, onClose }) => {
  if (!award) return null;

  const handleDownloadCertificate = () => {
    const title = `Official Certificate - ${award.title}`;
    const content = `Awarded to: CEO Sushanth NS\nOrganization: ${award.organization}\nDate: ${award.date}\n\nCitation:\n"${award.officialCitation}"\n\nThis document is a certified digital record of achievement.\n\nVerification Hash: ${award.verificationHash}\nCertificate Number: ${award.certificateNumber}`;
    generatePdfLetter(title, content, "ceo@suryabank.com");
  };

  const handleShareRecognition = async () => {
    const shareData = {
      title: `${award.title} - Surya Bank`,
      text: `Surya Bank CEO Sushanth NS was awarded ${award.title} by ${award.organization}. Read the official citation and details.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Recognition link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing recognition:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header / Banner Image */}
        <div className="relative h-48 sm:h-64 bg-slate-950 shrink-0">
          {award.imageUrl ? (
            <img src={award.imageUrl} alt={award.title} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-ceo-navy opacity-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
          >
            <X size={20} />
          </button>
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="px-3 py-1 bg-ceo-gold/20 backdrop-blur-sm border border-ceo-gold/40 text-ceo-gold text-xs font-bold uppercase tracking-wider rounded-full mb-3 inline-block">
              {award.category} Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold leading-tight">{award.title}</h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              <section>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Official Citation</h3>
                <p className="text-lg text-white font-serif leading-relaxed italic border-l-4 border-ceo-gold pl-4 py-1">
                  "{award.officialCitation}"
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Achievement Summary</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {award.achievementSummary}
                </p>
                <p className="text-slate-400 leading-relaxed text-sm mt-4">
                  {award.description}
                </p>
              </section>

              {award.pressRelease && (
                <section className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Press Release Snippet</h3>
                  <p className="text-sm text-slate-400 font-medium">"{award.pressRelease}"</p>
                  <button className="mt-3 text-ceo-gold text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:underline">
                    Read Full Release <ExternalLink size={12} />
                  </button>
                </section>
              )}

              {award.videoUrl && (
                <section>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Acceptance Speech</h3>
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center group relative cursor-pointer">
                    <img src={award.imageUrl} alt="Video Thumbnail" className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity" />
                    <PlayCircle size={48} className="text-ceo-gold absolute z-10 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-2xl p-5 space-y-4 border border-slate-700">
                <div className="flex items-start gap-3">
                  <Award className="text-ceo-gold mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Awarding Body</p>
                    <p className="text-white text-sm font-bold">{award.organization}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-ceo-gold mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date Awarded</p>
                    <p className="text-white text-sm font-bold">{award.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-ceo-gold mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ceremony Location</p>
                    <p className="text-white text-sm font-bold">{award.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="text-ceo-gold mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Presented By</p>
                    <p className="text-white text-sm font-bold">{award.presenter}</p>
                  </div>
                </div>
              </div>

              {/* Digital Certificate Verification */}
              <div className="bg-slate-950 rounded-2xl p-5 border border-emerald-900/50 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verification Center</h3>
                
                <div className="flex items-center gap-2 mb-3 text-emerald-400">
                  <ShieldCheck size={18} />
                  <span className="text-sm font-bold">{award.verificationStatus}</span>
                </div>
                
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 uppercase">Cert No.</span>
                    <span className="text-white font-mono">{award.certificateNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 uppercase">Hash</span>
                    <span className="text-slate-400 font-mono">{award.verificationHash}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors">
                    <FileText size={14} /> Preview
                  </button>
                  <button 
                    onClick={handleDownloadCertificate}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-ceo-gold hover:bg-yellow-500 text-slate-900 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>

              {/* Share Options */}
              <button 
                onClick={handleShareRecognition}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-2xl text-sm font-bold transition-colors border border-slate-700 hover:border-ceo-gold/30"
              >
                <Share2 size={16} /> Share Recognition
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardDetailModal;
