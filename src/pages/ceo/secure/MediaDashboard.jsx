import React from 'react';
import { Download, Camera, Image, FileText, Calendar, Radio } from 'lucide-react';

const MediaDashboard = () => {

  const brandKits = [
    { title: "Chairman Sushanth NS Portrait", type: "High-Res JPG", size: "18.4 MB", icon: Camera },
    { title: "Surya Bank Official Logo Pack", type: "Vector EPS/PNG", size: "6.2 MB", icon: Image },
    { title: "2026 Executive Brand Guidelines", type: "PDF Booklet", size: "11.1 MB", icon: FileText }
  ];

  const pressReleases = [
    { date: "July 02, 2026", title: "Surya Bank Announces Quantum Cryptography Cryptography Implementation", snippet: "Surya Bank has successfully migrated its commercial banking channels to post-quantum cryptographical encryptions." },
    { date: "June 25, 2026", title: "Green Banking Dividend Exceeds Targets", snippet: "Carbon tracking ledgers report a 42% offset in emission goals, yielding positive sustainability dividends." }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold">Media Relations Portal</span>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-1">Media Portal</h1>
        <p className="text-xs text-slate-400">Download authenticated press media files, official statements, and schedule media inquiries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Brand assets downloads */}
        <div className="lg:col-span-6 space-y-4 text-xs text-left">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Image size={16} className="text-ceo-gold" /> Official Brand Assets
          </h3>
          
          <div className="space-y-3">
            {brandKits.map((kit, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-805 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-950 rounded-xl text-ceo-gold border border-slate-850 shrink-0">
                    <kit.icon size={18} />
                  </div>
                  <div>
                    <strong className="block text-white text-xs">{kit.title}</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{kit.type} | {kit.size}</span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Downloading media asset: ${kit.title}`)}
                  className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-ceo-gold border border-slate-800 shrink-0"
                >
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Press Releases index & inquiries */}
        <div className="lg:col-span-6 space-y-6 text-xs text-left">
          
          <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Radio size={14} className="text-ceo-gold" /> Press Releases Wire
            </h3>

            <div className="space-y-4">
              {pressReleases.map((release, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="block text-[9px] font-bold text-slate-500">{release.date}</span>
                  <strong className="block text-white hover:text-ceo-gold cursor-pointer transition-colors">{release.title}</strong>
                  <p className="text-[10px] text-slate-405 leading-relaxed">{release.snippet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Book Interview slot */}
          <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Calendar size={14} className="text-ceo-gold" /> Request Media Interview
            </h3>
            <p className="text-slate-400 leading-relaxed text-[10px]">
              If you require a custom interview statement or a recorded speech segment from Chairman Sushanth NS, please contact the Media Desk at: <a href="mailto:media.relations@suryabank.com" className="text-ceo-gold hover:underline">media.relations@suryabank.com</a>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default MediaDashboard;
