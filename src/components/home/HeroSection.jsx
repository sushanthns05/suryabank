import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Activity, CreditCard } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-bg-primary">
      {/* Aurora Background */}
      <div className="absolute inset-0 bg-aurora opacity-70"></div>
      
      {/* Animated Mesh / Network Lines (SVG) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Typography & CTAs */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-gold/30 bg-primary-gold/10 text-primary-gold text-sm font-bold tracking-wide">
            <Shield size={14} /> #1 Enterprise Bank 2026
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight text-white">
            Banking Built for <br/>
            <span className="text-gradient">Tomorrow</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
            Experience intelligent banking powered by innovation, zero-trust security, and global financial expertise. Designed for millions.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <a href="/account-opening-form" className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-gold to-yellow-500 text-bg-primary font-bold text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1 flex items-center gap-2">
              Open Account <ChevronRight size={20} />
            </a>
            <a href="/auth" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-all">
              Internet Banking
            </a>
          </div>
        </motion.div>

        {/* Right Column: 3D Floating Assets */}
        <div className="relative h-[600px] hidden lg:block perspective-1000">
          <motion.div
            animate={{ y: [-10, 10, -10], rotateY: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-10 w-80 h-48 rounded-2xl glass p-6 shadow-2xl border border-white/10 backdrop-blur-3xl z-20"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex justify-between items-start mb-8">
              <CreditCard size={32} className="text-primary-gold" />
              <span className="font-mono text-white/50 text-sm">SURYA PREMIUM</span>
            </div>
            <div className="font-mono text-xl tracking-widest text-white mb-2">**** **** **** 4092</div>
            <div className="flex justify-between items-end">
              <div className="text-sm text-slate-400">ALEXANDER W.</div>
              <div className="text-sm font-mono text-white">12/29</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [15, -15, 15], x: [5, -5, 5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 left-0 w-64 rounded-2xl bg-bg-secondary/80 border border-white/10 p-5 shadow-2xl backdrop-blur-xl z-30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Activity size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Live Analytics</div>
                <div className="text-sm font-bold text-white">+14.2% Portfolio</div>
              </div>
            </div>
            <div className="h-16 w-full flex items-end gap-1">
              {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-400 rounded-t-sm"
                ></motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/5 rounded-full z-10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full z-0"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
