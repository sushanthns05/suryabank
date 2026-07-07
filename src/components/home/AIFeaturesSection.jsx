import React from 'react';
import { motion } from 'framer-motion';
import { Bot, ShieldAlert, LineChart, Mic, Sparkles } from 'lucide-react';

const AIFeaturesSection = () => {
  return (
    <section className="py-24 bg-bg-secondary relative overflow-hidden z-10 border-y border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto aspect-[1/2] rounded-[3rem] border-[8px] border-slate-800 bg-bg-primary shadow-2xl overflow-hidden p-6 flex flex-col">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-slate-800 rounded-b-xl z-20"></div>
              
              <div className="flex items-center justify-between mb-8 mt-4">
                <h3 className="font-heading font-bold text-lg text-white">Surya AI</h3>
                <Sparkles className="text-primary-gold animate-pulse" size={20} />
              </div>
              
              <div className="flex-1 space-y-4 flex flex-col justify-end pb-4">
                {/* Chat Bubbles */}
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-800 text-slate-300 p-4 rounded-2xl rounded-tl-sm text-sm w-5/6">
                  Good morning! I noticed an unusual transaction of ₹45,000 at "TechStore" yesterday. Was this you?
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-accent-blue text-white p-4 rounded-2xl rounded-tr-sm text-sm w-4/6 self-end">
                  No, I didn't make that purchase.
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="bg-slate-800 text-slate-300 p-4 rounded-2xl rounded-tl-sm text-sm w-5/6">
                  I've frozen your card to prevent further charges and initiated a fraud claim. Your funds are secure. A new virtual card is available immediately.
                </motion.div>
              </div>
              
              <div className="h-12 bg-slate-800/50 rounded-full border border-white/10 flex items-center px-4 justify-between">
                <span className="text-slate-500 text-sm">Ask Surya AI...</span>
                <Mic size={18} className="text-slate-400" />
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 -right-10 glass p-4 rounded-xl flex items-center gap-3 border border-white/10 shadow-soft"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center"><ShieldAlert size={20} /></div>
              <div>
                <div className="text-xs text-slate-400">Threat Neutralized</div>
                <div className="text-sm font-bold text-white">0ms Response</div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Text */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-bold tracking-wide mb-4 border border-accent-blue/30">
                <Bot size={16} /> Banking Intelligence
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                Meet your new <br/><span className="text-gradient">Financial Brain.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Surya AI doesn't just answer questions; it anticipates your needs. From quantum-speed fraud detection to personalized wealth prediction, experience a bank that actively works to grow and protect your money.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-bg-primary/50 border border-white/5">
                <ShieldAlert className="text-primary-gold mb-4" size={24} />
                <h4 className="text-white font-bold mb-2">Predictive Fraud Defense</h4>
                <p className="text-slate-400 text-sm">Analyzes millions of data points per second to stop fraud before it happens.</p>
              </div>
              <div className="p-5 rounded-2xl bg-bg-primary/50 border border-white/5">
                <LineChart className="text-accent-blue mb-4" size={24} />
                <h4 className="text-white font-bold mb-2">Smart Budgeting</h4>
                <p className="text-slate-400 text-sm">Automatically categorizes spending and predicts end-of-month balances.</p>
              </div>
              <div className="p-5 rounded-2xl bg-bg-primary/50 border border-white/5">
                <Sparkles className="text-emerald-400 mb-4" size={24} />
                <h4 className="text-white font-bold mb-2">Investment Insights</h4>
                <p className="text-slate-400 text-sm">Real-time market analysis tailored specifically to your portfolio goals.</p>
              </div>
              <div className="p-5 rounded-2xl bg-bg-primary/50 border border-white/5">
                <Mic className="text-purple-400 mb-4" size={24} />
                <h4 className="text-white font-bold mb-2">Voice Banking</h4>
                <p className="text-slate-400 text-sm">Execute complex transfers and trades using secure biometric voice recognition.</p>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default AIFeaturesSection;
