import React from 'react';
import { Smartphone, Brain, Sparkles, Heart, Users, Globe, Leaf, Shield, Zap } from 'lucide-react';

const visionPillars = [
  { 
    title: "Digital Banking", 
    desc: "Achieving friction-free global mobile account access, custom digital wallets, and zero-fee borders.", 
    detail: "Transitioning 100% of retail transactions to instant cloud-native structures, bypassing legacy ACH delays.",
    icon: Smartphone,
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400"
  },
  { 
    title: "AI Banking Integration", 
    desc: "Deploying automated cash-flow predictive models, smart savings prompts, and algorithmic credit checks.", 
    detail: "Leveraging large-language intelligence models to process micro-underwriting in less than 3 minutes.",
    icon: Brain,
    color: "from-purple-500/20 to-pink-500/20 text-purple-400"
  },
  { 
    title: "Customer Experience", 
    desc: "Delivering empathetic, personalized interfaces that anticipate consumer needs and resolve tickets.", 
    detail: "Providing 24/7 localized human-AI hybrid support channels, maintaining a Net Promoter Score above 82.",
    icon: Heart,
    color: "from-rose-500/20 to-red-500/20 text-rose-400"
  },
  { 
    title: "Financial Inclusion", 
    desc: "Opening access channels for unbanked micro-enterprises in emerging trade networks.", 
    detail: "Providing alternative credit evaluation formulas to fund 150,000+ small merchants in low-bandwidth regions.",
    icon: Users,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400"
  },
  { 
    title: "Global Expansion", 
    desc: "Connecting local treasury lines directly with international centers in New York, London, and Singapore.", 
    detail: "Facilitating multi-currency corporate settlement corridors compliant with local regulatory policies.",
    icon: Globe,
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400"
  },
  { 
    title: "Sustainable Finance", 
    desc: "Directing deposits exclusively to clean energy projects and green infrastructure syndications.", 
    detail: "Diverting capital away from fossil fuels, backed by our audited $5B green bond allocation frame.",
    icon: Leaf,
    color: "from-green-500/20 to-emerald-500/20 text-green-400"
  },
  { 
    title: "Cybersecurity Shield", 
    desc: "Integrating lattice post-quantum cryptography to secure core transaction databases.", 
    detail: "Employing continuous AI threat auditing and zero-trust verification structures across all wallets.",
    icon: Shield,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400"
  },
  { 
    title: "System Innovation", 
    desc: "Building open banking APIs so developers can deploy fintech apps directly on Surya Bank rails.", 
    detail: "Providing fully compliant GraphQL developer endpoints to accelerate third-party wealth tool builds.",
    icon: Zap,
    color: "from-orange-500/20 to-yellow-500/20 text-orange-400"
  }
];

const CeoVision = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Strategic Directives</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">Visionary Pillars</h1>
        <p className="text-xs text-slate-400">Explore the 8 core operational dimensions driving Surya Bank's technological expansion and environmental leadership.</p>
      </div>

      {/* Grid of Vision Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visionPillars.map((pillar, idx) => {
          const IconComponent = pillar.icon;
          return (
            <div 
              key={idx} 
              className="group relative rounded-3xl bg-slate-900 border border-slate-805 p-6 hover:border-ceo-gold/40 transition-all duration-300 flex flex-col justify-between hover:bg-slate-900/80 shadow-lg hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Icon wrapper with gradient glow */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center`}>
                  <IconComponent size={24} />
                </div>
                
                <h3 className="text-base font-semibold text-white group-hover:text-ceo-gold transition-colors">
                  {pillar.title}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              {/* Expandable-like hover drawer info */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors leading-relaxed">
                {pillar.detail}
              </div>
            </div>
          );
        })}
      </section>

      {/* Visual Quote Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <span className="text-2xl font-serif text-white block">"We build for accessibility, innovate for efficiency, and secure for resilience."</span>
        <span className="text-xs text-ceo-gold uppercase tracking-wider block font-semibold">- Sushanth NS, Stanford CS Symposium</span>
      </section>

    </div>
  );
};

export default CeoVision;
