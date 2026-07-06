import React from 'react';
import { successStoriesData } from '../../../pages/ceo/CeoMockData';
import { Award, Zap } from 'lucide-react';

const SuccessStories = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-8">
        <Award className="text-ceo-gold" />
        <h2 className="text-2xl font-serif text-white font-bold">Transformation Success Stories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {successStoriesData.map((story, i) => (
          <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-emerald-400" size={16} />
              <h3 className="text-lg font-bold text-white">{story.title}</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Business Outcome</p>
                <p className="text-sm text-slate-300">{story.outcome}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Customer/Market Impact</p>
                <p className="text-sm text-slate-300">{story.impact}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Lessons Learned</p>
                <p className="text-sm text-slate-400 italic">"{story.lessons}"</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-[9px] font-bold uppercase tracking-wider text-ceo-gold bg-ceo-gold/10 px-3 py-1 rounded-full">
                Pillar: {story.pillar}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
