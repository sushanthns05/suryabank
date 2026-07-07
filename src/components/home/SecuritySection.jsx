import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Fingerprint, Eye, Server, RefreshCw } from 'lucide-react';

const SecuritySection = () => {
  const features = [
    { title: "Quantum-Safe Encryption", desc: "Data protected by next-generation cryptographic algorithms.", icon: Lock },
    { title: "Zero Trust Architecture", desc: "Strict identity verification for every person and device.", icon: ShieldCheck },
    { title: "Biometric Auth", desc: "Multi-modal biometrics including facial and voice recognition.", icon: Fingerprint },
    { title: "24/7 Security Operations", desc: "Global SOC monitoring for threats in real-time.", icon: Eye },
    { title: "Distributed Ledgers", desc: "Immutable transaction records distributed globally.", icon: Server },
    { title: "Continuous Audits", desc: "Automated penetration testing and vulnerability scanning.", icon: RefreshCw },
  ];

  return (
    <section className="py-24 bg-bg-primary relative overflow-hidden z-10">
      <div className="container">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6"
          >
            <ShieldCheck size={40} className="text-emerald-400" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
          >
            Fortress-Level <span className="text-emerald-400">Security.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Your assets are protected by military-grade security infrastructure. We employ advanced AI and zero-trust principles to ensure absolute peace of mind.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-bg-secondary/50 border border-white/5 hover:border-emerald-500/30 transition-colors"
            >
              <feat.icon size={28} className="text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-emerald-900/40 to-bg-secondary border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Security Status: <span className="text-emerald-400 flex-inline items-center gap-2"><span className="inline-block w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span> Optimal</span></h3>
            <p className="text-slate-400 text-sm">All systems are fully operational and encrypted.</p>
          </div>
          <button className="px-6 py-3 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-colors whitespace-nowrap">
            View Security Whitepaper
          </button>
        </motion.div>
        
      </div>
    </section>
  );
};

export default SecuritySection;
