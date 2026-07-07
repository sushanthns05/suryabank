import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, CreditCard, Landmark, LineChart, ArrowRight } from 'lucide-react';

const DigitalBankingSection = () => {
  const [activeTab, setActiveTab] = useState('banking');

  const tabs = [
    { id: 'banking', label: 'Digital Banking', icon: Smartphone },
    { id: 'cards', label: 'Premium Cards', icon: CreditCard },
    { id: 'loans', label: 'Smart Loans', icon: Landmark },
    { id: 'invest', label: 'Investments', icon: LineChart },
  ];

  const content = {
    banking: {
      title: "Your Bank, In Your Pocket.",
      desc: "Experience seamless money management with our award-winning mobile app. Instant UPI, international transfers, and one-tap card controls.",
      features: ["Zero-fee UPI Transfers", "Video KYC in 3 mins", "Real-time Alerts"],
      color: "from-blue-500 to-cyan-400"
    },
    cards: {
      title: "Metal. Exclusive. Yours.",
      desc: "The Surya Black Card offers unlimited lounge access, 5% cashback globally, and dedicated concierge services. Crafted from aerospace-grade titanium.",
      features: ["Zero Forex Markup", "Unlimited Lounge Access", "Golf Privileges"],
      color: "from-purple-500 to-pink-400"
    },
    loans: {
      title: "Capital When You Need It.",
      desc: "Instant pre-approved loans with dynamic interest rates based on your financial health score. No paperwork, just capital.",
      features: ["Disbursal in 10 mins", "Flexible EMI Options", "No Prepayment Penalty"],
      color: "from-emerald-500 to-teal-400"
    },
    invest: {
      title: "Grow Wealth Automatically.",
      desc: "Set rules to auto-invest spare change, or let our AI robo-advisor build a globally diversified portfolio tailored to your risk profile.",
      features: ["Zero Commission Stocks", "AI Portfolio Rebalancing", "Fractional Shares"],
      color: "from-primary-gold to-yellow-500"
    }
  };

  return (
    <section className="py-24 bg-bg-secondary relative z-10">
      <div className="container">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              The entire bank, <br/><span className="text-gradient">reimagined.</span>
            </h2>
          </div>
          
          <div className="flex bg-bg-primary p-1.5 rounded-full border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? 'text-primary-gold' : ''} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-bg-primary rounded-3xl border border-white/5 p-8 md:p-12 min-h-[400px] relative overflow-hidden flex items-center">
          <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br ${content[activeTab].color} rounded-full filter blur-[150px] opacity-10 pointer-events-none transition-all duration-1000`}></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full relative z-10"
            >
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-white">{content[activeTab].title}</h3>
                <p className="text-lg text-slate-400 leading-relaxed max-w-lg">{content[activeTab].desc}</p>
                
                <ul className="space-y-3 pt-4">
                  {content[activeTab].features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-white font-medium">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${content[activeTab].color} flex items-center justify-center p-1.5`}>
                        <div className="w-full h-full bg-bg-primary rounded-full"></div>
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                
                <div className="pt-6">
                  <button className="flex items-center gap-2 text-white font-bold hover:text-primary-gold transition-colors group">
                    Learn more <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              <div className="h-64 lg:h-[400px] rounded-2xl glass border border-white/10 flex items-center justify-center bg-bg-secondary/50 relative overflow-hidden">
                {/* Placeholder for actual 3D asset or mockup */}
                <span className="font-mono text-slate-500 uppercase tracking-widest">{activeTab} visualization</span>
                
                {activeTab === 'cards' && (
                  <motion.div 
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute w-64 h-40 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 border border-slate-500 shadow-2xl flex items-center justify-center"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <span className="text-primary-gold font-heading font-bold text-xl opacity-50">SURYA BLACK</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default DigitalBankingSection;
