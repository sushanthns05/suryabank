import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Calendar, Briefcase, Heart, ShieldCheck, Leaf, Lock, Loader2 } from 'lucide-react';
import { biography, careerTimeline, leadershipPrinciples } from './CeoMockData';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// Map icon strings to Lucide components
const iconMap = {
  Heart: Heart,
  ShieldCheck: ShieldCheck,
  Leaf: Leaf,
  Lock: Lock
};

const CeoAbout = () => {
  const [dbProfile, setDbProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'ceo_profile_data', 'main_profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDbProfile(docSnap.data());
        }
      } catch (err) {
        console.error("Failed to load CEO biography from DB:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const activeProfile = {
    name: dbProfile?.name || biography.name,
    title: biography.title,
    bio: dbProfile?.biography || biography.longBio,
    education: dbProfile?.education ? [
      { degree: dbProfile.education, school: "Verified Credential", year: "2026" }
    ] : biography.education
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-ceo-gold" size={24} />
        <span className="text-xs">Accessing Security Clearance Profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      
      {/* Bio Header Profile Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-ceo-gold/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Left: Text Bio */}
        <div className="lg:col-span-8 space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Executive Leadership</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-white font-bold leading-tight mb-2">
              {activeProfile.name}
            </h1>
            <p className="text-sm font-semibold text-ceo-gold/80">{activeProfile.title}</p>
          </div>
          
          {/* Biography Section - Enhanced */}
          <div className="relative mt-8 p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-ceo-gold/20">
            <span className="absolute top-2 left-4 text-5xl text-ceo-gold/20 font-serif">"</span>
            <p className="text-sm text-slate-200 leading-relaxed font-medium relative z-10 pl-2">
              {activeProfile.bio}
            </p>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-ceo-gold/5 rounded-full blur-2xl" />
          </div>

          {/* Education list */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <BookOpen size={16} className="text-ceo-gold" /> Academic Foundations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeProfile.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-905 flex flex-col justify-between hover:border-ceo-gold/30 transition-colors">
                  <span className="block font-semibold text-white text-xs leading-normal">{edu.degree}</span>
                  <span className="block text-[10px] text-slate-400 mt-2">{edu.school}</span>
                  <span className="block text-[10px] text-ceo-gold font-bold mt-1">{edu.year ? `Class of ${edu.year}` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Portrait Side Art */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative border border-slate-700 p-2 bg-slate-950 rounded-2xl w-full max-w-xs shadow-2xl">
            <div className="aspect-square bg-gradient-to-tr from-slate-900 via-slate-800 to-ceo-navy rounded-xl flex flex-col items-center justify-center text-center p-6 border border-slate-800">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-ceo-gold/30 mb-4 relative flex items-center justify-center bg-slate-900">
                <img 
                  src="/sns.jpg" 
                  alt={activeProfile.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = document.getElementById('about-profile-placeholder');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div id="about-profile-placeholder" className="hidden w-full h-full items-center justify-center text-3xl font-serif text-ceo-gold">
                  SNS
                </div>
              </div>
              <h3 className="font-serif text-base text-white font-semibold">{activeProfile.name}</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Bengaluru Group HQ</p>
              <div className="mt-6 flex gap-2">
                <span className="text-[9px] bg-slate-850 border border-slate-750 text-slate-300 px-2 py-0.5 rounded">Wharton Alumnus</span>
                <span className="text-[9px] bg-slate-850 border border-slate-750 text-slate-300 px-2 py-0.5 rounded">Stanford Alumnus</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Leadership Principles */}
      <section className="space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h2 className="text-2xl font-serif text-white font-bold">Executive Leadership Principles</h2>
          <p className="text-xs text-slate-400">Core directives guiding our product roadmap, climate actions, and database architectures.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {leadershipPrinciples.map((principle, idx) => {
            const IconComponent = iconMap[principle.iconName] || Heart;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-ceo-gold/30 transition-all shadow-lg hover:-translate-y-1 duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-slate-400 group-hover:text-ceo-gold group-hover:bg-ceo-gold/10 transition-colors mb-4">
                  <IconComponent size={24} />
                </div>
                <h3 className="font-semibold text-sm text-white mb-2">{principle.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{principle.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline of Achievements */}
      <section className="space-y-8">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h2 className="text-2xl font-serif text-white font-bold">Chronology of Achievements</h2>
          <p className="text-xs text-slate-400">Key career accomplishments and the expansion timeline of the Surya Bank ecosystem.</p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l border-slate-800 max-w-3xl mx-auto pl-6 sm:pl-8 space-y-12 py-4">
          {careerTimeline.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-ceo-gold transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 group-hover:bg-ceo-gold transition-all" />
              </div>

              {/* Card Container */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850/80 hover:border-slate-700 transition-all shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-lg font-bold text-ceo-gold">{item.year}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default CeoAbout;
