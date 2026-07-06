import React from 'react';
import StrategyDashboard from '../../components/ceo/vision/StrategyDashboard';
import StrategicRoadmap from '../../components/ceo/vision/StrategicRoadmap';
import VisionProgressTracker from '../../components/ceo/vision/VisionProgressTracker';
import GlobalExpansionMap from '../../components/ceo/vision/GlobalExpansionMap';
import StrategicAnalytics from '../../components/ceo/vision/StrategicAnalytics';
import InitiativesGrid from '../../components/ceo/vision/InitiativesGrid';
import SuccessStories from '../../components/ceo/vision/SuccessStories';
import RiskAndOpportunities from '../../components/ceo/vision/RiskAndOpportunities';
import InvestorView from '../../components/ceo/vision/InvestorView';
import DownloadCenter from '../../components/ceo/vision/DownloadCenter';
import AiStrategyAssistant from '../../components/ceo/vision/AiStrategyAssistant';
import { Target } from 'lucide-react';
import { generatePdfLetter } from './CeoMockData';

const CeoVision = () => {
  const handleDownloadMasterPlan = () => {
    const title = "Surya Bank - Master Strategic Plan";
    const content = "The Strategic Operating Blueprint of Surya Bank.\n\n" +
      "This document serves as the master plan for the next decade of institutional leadership, detailing:\n" +
      "• 100% Cloud-Native Digital Banking Transition\n" +
      "• $5B Commitment to Green Infrastructure and Sustainable Finance\n" +
      "• Implementation of Post-Quantum Cryptography\n" +
      "• Expansion into 5 New Markets including Germany and Japan\n\n" +
      "This is a verified executive document.";
    
    generatePdfLetter(title, content, "ceo@suryabank.com");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      
      {/* Premium Header */}
      <div className="relative pt-8 pb-12 border-b border-slate-800 text-center max-w-4xl mx-auto space-y-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ceo-gold/50 to-transparent" />
        
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-ceo-gold px-4 py-1.5 rounded-full border border-ceo-gold/30 bg-ceo-gold/10 inline-block">
          Strategic Vision & Transformation Hub
        </span>
        
        <h1 className="text-4xl md:text-5xl font-serif text-white font-bold leading-tight">
          The Operating Blueprint of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-ceo-gold to-yellow-600">Surya Bank</span>
        </h1>
        
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Explore the strategic execution, financial forecasting, and global expansion milestones defining the next decade of institutional leadership.
        </p>

        <div className="flex justify-center gap-3 pt-4">
          <button 
            onClick={handleDownloadMasterPlan}
            className="flex items-center gap-2 px-4 py-2 bg-ceo-gold hover:bg-yellow-500 text-slate-900 rounded-lg text-xs font-bold transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          >
            <Target size={14} /> View Master Plan
          </button>
        </div>
      </div>

      {/* Main KPI Dashboard */}
      <StrategyDashboard />

      {/* Executive Analytics & Progress */}
      <StrategicAnalytics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <StrategicRoadmap />
        </div>
        <div className="lg:col-span-1">
          <VisionProgressTracker />
        </div>
      </div>

      {/* Global Expansion Map */}
      <GlobalExpansionMap />

      {/* Strategic Initiatives Portfolio */}
      <InitiativesGrid />

      {/* Risk and Opportunities Matrix */}
      <RiskAndOpportunities />

      {/* Success Stories & Investor View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <SuccessStories />
        <InvestorView />
      </div>

      {/* Download Center */}
      <DownloadCenter />

      {/* AI Assistant */}
      <AiStrategyAssistant />

    </div>
  );
};

export default CeoVision;
