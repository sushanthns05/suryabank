import React from 'react';
import { Award, Landmark, Sparkles, Heart, HelpCircle, Trophy } from 'lucide-react';
import { awardsList } from './CeoMockData';

// Map colors/icons to categories for visuals
const awardsMeta = [
  { id: '1', icon: Trophy, color: 'from-amber-500/20 to-yellow-500/20 text-amber-400' },
  { id: '2', icon: Sparkles, color: 'from-purple-500/20 to-pink-500/20 text-purple-400' },
  { id: '3', icon: Landmark, color: 'from-emerald-500/20 to-green-500/20 text-emerald-400' },
  { id: '4', icon: Heart, color: 'from-blue-500/20 to-cyan-500/20 text-blue-400' }
];

const CeoAwards = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Executive Honors</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">Awards & Accolades</h1>
        <p className="text-xs text-slate-400">Review international financial decorations, digital technology leadership milestones, and ESG community awards.</p>
      </div>

      {/* Grid of awards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {awardsList.map((award, index) => {
          const meta = awardsMeta[index] || awardsMeta[0];
          const IconComponent = meta.icon;

          return (
            <div 
              key={index}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-805 hover:border-ceo-gold/40 transition-all shadow-lg flex items-start gap-6 group"
            >
              {/* Left icon wrapper */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${meta.color} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform`}>
                <IconComponent size={28} />
              </div>

              {/* Right text contents */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-ceo-gold">{award.year}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{award.organization}</span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-white group-hover:text-ceo-gold transition-colors">
                  {award.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {award.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Trophies Case details banner */}
      <section className="bg-slate-950 border border-slate-805 rounded-3xl p-8 text-center space-y-4 max-w-3xl mx-auto shadow-xl">
        <Award className="mx-auto text-ceo-gold" size={32} />
        <h3 className="font-serif text-lg text-white font-semibold">Regulatory Certifications Case</h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
          Surya Bank maintains institutional certifications in ISO/IEC 27001 (Security Management), Basel Capital Adequacy Framework Tier-1 Compliancy, and Carbon Trust Portfolio Audits.
        </p>
      </section>

    </div>
  );
};

export default CeoAwards;
