import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import ProductsSection from '../components/home/ProductsSection';
import AIFeaturesSection from '../components/home/AIFeaturesSection';
import SecuritySection from '../components/home/SecuritySection';
import DigitalBankingSection from '../components/home/DigitalBankingSection';
import CeoMessageSection from '../components/home/CeoMessageSection';
import AppDownloadSection from '../components/home/AppDownloadSection';

const LandingPage = () => {
  return (
    <div className="bg-bg-primary min-h-screen text-white overflow-hidden selection:bg-primary-gold selection:text-bg-primary">
      <HeroSection />
      <StatsSection />
      <ProductsSection />
      <AIFeaturesSection />
      <SecuritySection />
      <DigitalBankingSection />
      <CeoMessageSection />
      <AppDownloadSection />
    </div>
  );
};

export default LandingPage;
