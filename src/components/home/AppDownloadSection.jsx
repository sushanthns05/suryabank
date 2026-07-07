import React from 'react';
import { motion } from 'framer-motion';
import { Download, Globe, Leaf, Newspaper, ArrowRight } from 'lucide-react';

const AppDownloadSection = () => {
  return (
    <section className="py-24 bg-bg-secondary relative z-10 border-t border-white/5">
      <div className="container">
        
        {/* Top Split: News & CSR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          {/* Latest News */}
          <div className="p-8 rounded-3xl bg-bg-primary border border-white/5 shadow-soft">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                <Newspaper className="text-primary-gold" /> Press Room
              </h3>
              <button className="text-sm font-bold text-primary-gold hover:text-white transition-colors">View All</button>
            </div>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <p className="text-xs text-primary-gold mb-1 font-mono">JUL 06, 2026</p>
                <h4 className="text-white font-medium group-hover:text-primary-gold transition-colors">Surya Bank launches Quantum-Safe transaction network in Asia</h4>
              </div>
              <div className="w-full h-px bg-white/10"></div>
              <div className="group cursor-pointer">
                <p className="text-xs text-primary-gold mb-1 font-mono">JUL 02, 2026</p>
                <h4 className="text-white font-medium group-hover:text-primary-gold transition-colors">Q2 2026 Earnings: Record growth in digital wealth management</h4>
              </div>
            </div>
          </div>
          
          {/* CSR */}
          <div className="p-8 rounded-3xl bg-bg-primary border border-white/5 shadow-soft">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                <Leaf className="text-emerald-400" /> Impact (CSR)
              </h3>
              <button className="text-sm font-bold text-emerald-400 hover:text-white transition-colors">Report</button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-heading font-bold text-emerald-400">100%</div>
                <div className="text-sm text-slate-300">Renewable energy powering all global data centers.</div>
              </div>
              <div className="w-full h-px bg-white/10"></div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-heading font-bold text-emerald-400">2M+</div>
                <div className="text-sm text-slate-300">Underprivileged students funded via education grants.</div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Split: App Download Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] bg-gradient-to-br from-primary-blue to-bg-primary border border-white/10 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-blue/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-12 md:p-20 relative z-10 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
                Banking, <br/>anywhere.
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-md">
                Download the award-winning Surya Bank mobile app. Experience quantum-safe security and seamless financial control at your fingertips.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 rounded-full bg-white text-bg-primary font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                  App Store
                </button>
                <button className="px-8 py-4 rounded-full glass border border-white/20 text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                  Google Play
                </button>
              </div>
            </div>
            
            <div className="relative h-64 lg:h-full flex items-center justify-center lg:justify-end">
              {/* Phone Mockup Placeholder */}
              <div className="w-64 h-[500px] rounded-[3rem] border-8 border-slate-800 bg-bg-secondary absolute lg:right-10 shadow-2xl overflow-hidden flex flex-col items-center justify-center -bottom-32 lg:-bottom-20">
                <div className="absolute top-0 w-1/2 h-6 bg-slate-800 rounded-b-2xl"></div>
                <Globe size={64} className="text-primary-gold/20 mb-4" />
                <span className="font-heading font-bold text-white text-xl">Surya<span className="text-primary-gold">Bank</span></span>
              </div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default AppDownloadSection;
