import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Trophy, ShieldCheck, Star } from 'lucide-react';

const CeoMessageSection = () => {
  return (
    <section className="py-24 bg-bg-primary relative overflow-hidden z-10">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* CEO Message */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-10 rounded-3xl bg-bg-secondary border border-white/5 shadow-2xl"
          >
            <Quote size={60} className="text-white/5 absolute top-8 left-8" />
            <div className="relative z-10">
              <h2 className="text-3xl font-heading font-bold text-white mb-8">
                "We are not just building a bank; we are architecting the financial infrastructure of tomorrow."
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                At Surya Bank, our mission is to empower global citizens and enterprises with frictionless, secure, and intelligent capital management. Innovation is our DNA, and trust is our currency.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-primary-gold overflow-hidden">
                  <img src="/logo.png" alt="CEO" className="w-full h-full object-cover opacity-50" />
                </div>
                <div>
                  <h4 className="text-white font-bold font-heading">Dr. Aryan Surya</h4>
                  <p className="text-sm text-primary-gold">Founder & CEO, Surya Bank Group</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Awards & Recognition */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-heading font-bold text-white mb-4">
                Global <span className="text-gradient">Excellence.</span>
              </h2>
              <p className="text-slate-400">Recognized by industry leaders for our commitment to security, innovation, and customer experience.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl glass border border-white/5">
                <div className="w-12 h-12 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold shrink-0">
                  <Trophy size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Best Digital Bank 2025</h4>
                  <p className="text-xs text-slate-400">Global Finance Magazine</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl glass border border-white/5">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Excellence in Cybersecurity</h4>
                  <p className="text-xs text-slate-400">Enterprise Security Awards</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl glass border border-white/5">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Star size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">#1 UX/UI in Banking</h4>
                  <p className="text-xs text-slate-400">Fintech Design Awards</p>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default CeoMessageSection;
