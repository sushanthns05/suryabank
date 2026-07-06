import React from 'react';
import StrategyKPIs from '../../components/ceo/strategy/StrategyKPIs';
import StrategyAnalytics from '../../components/ceo/strategy/StrategyAnalytics';
import StrategyRoadmap from '../../components/ceo/strategy/StrategyRoadmap';
import StrategyExecutionGrid from '../../components/ceo/strategy/StrategyExecutionGrid';
import StrategyExpansionMap from '../../components/ceo/strategy/StrategyExpansionMap';
import MarketIntelligence from '../../components/ceo/strategy/MarketIntelligence';
import StrategyDownloads from '../../components/ceo/strategy/StrategyDownloads';
import AiStrategyAdvisor from '../../components/ceo/strategy/AiStrategyAdvisor';
import { ShieldCheck } from 'lucide-react';

const CeoStrategy = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      
      {/* Premium Header */}
      <div className="relative pt-8 pb-12 border-b border-slate-800 text-center max-w-4xl mx-auto space-y-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ceo-gold/50 to-transparent" />
        
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-ceo-gold px-4 py-1.5 rounded-full border border-ceo-gold/30 bg-ceo-gold/10 inline-block">
          Executive Strategy & Transformation Command Center
        </span>
        
        <h1 className="text-4xl md:text-5xl font-serif text-white font-bold leading-tight">
          Global Strategy & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-ceo-gold to-yellow-600">Execution Hub</span>
        </h1>
        
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto mb-4">
          Real-time visibility into the operational execution, budget allocation, and global market positioning of Surya Bank's strategic priorities.
        </p>
        
        <div className="flex justify-center items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mx-auto w-fit">
          <ShieldCheck size={14} /> Encrypted Executive View
        </div>
      </div>

      {/* 1. KPIs */}
      <StrategyKPIs />

      {/* 2. Interactive Strategy Roadmap */}
      <StrategyRoadmap />

      {/* 3. Strategy Execution Grid (Cards -> Deep dive modals) */}
      <StrategyExecutionGrid />

      {/* 4. Analytics */}
      <StrategyAnalytics />

      {/* 5. Market Intelligence */}
      <MarketIntelligence />

      {/* 6. Global Expansion Map */}
      <StrategyExpansionMap />

      {/* 7. Download Center */}
      <StrategyDownloads />

      {/* 8. AI Strategy Advisor */}
      <AiStrategyAdvisor />

    </div>
  );
};

export default CeoStrategy;
