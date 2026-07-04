import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Users, ShieldAlert, Award, X, Sparkles } from 'lucide-react';

const strategyPillars = [
  {
    id: "retail",
    title: "Retail Banking",
    icon: Users,
    description: "Empowering mobile depositors with AI financial advisors, competitive savings tools, and card facilities.",
    objectives: [
      "Launch smart automated budget calculators for retail mobile wallets.",
      "Achieve average check underwriting times below 10 seconds.",
      "Maintain active Net Promoter Score (NPS) above 82."
    ],
    metrics: [
      { label: "Active Retail Users", value: "22.4M" },
      { label: "NPS Score", value: "85" },
      { label: "Mobile Share of Tx", value: "94%" }
    ],
    chartData: [
      { year: "2021", assets: 10 },
      { year: "2022", assets: 13.5 },
      { year: "2023", assets: 18 },
      { year: "2024", assets: 22.4 }
    ],
    growthLabel: "Active Accounts (Millions)"
  },
  {
    id: "corporate",
    title: "Corporate Banking",
    icon: Target,
    description: "Enterprise treasury pipelines, liquidity pooling solutions, and international B2B settlement rails.",
    objectives: [
      "Streamline corporate B2B remittance times using private ledgers.",
      "Connect European commercial divisions directly to Southeast Asian corridors.",
      "Provide real-time automated treasury management services."
    ],
    metrics: [
      { label: "Corporate Clients", value: "18,500+" },
      { label: "SME Support", value: "42,000" },
      { label: "Annual Volume", value: "$18.5B" }
    ],
    chartData: [
      { year: "2021", assets: 8 },
      { year: "2022", assets: 11.2 },
      { year: "2023", assets: 15 },
      { year: "2024", assets: 18.5 }
    ],
    growthLabel: "Annual Transaction Volume ($B)"
  },
  {
    id: "sme",
    title: "SME Banking",
    icon: Sparkles,
    description: "Capital access, overdraft facilities, and invoice financing to support community merchant growth.",
    objectives: [
      "Deploy custom low-interest invoice financing for digital merchants.",
      "Engage over 50,000 rural small business operators by 2027.",
      "Provide automated VAT/tax savings compartments in business accounts."
    ],
    metrics: [
      { label: "SME Loan Books", value: "$4.2B" },
      { label: "Active SMEs", value: "48k" },
      { label: "Approval Rates", value: "91%" }
    ],
    chartData: [
      { year: "2021", assets: 1.8 },
      { year: "2022", assets: 2.5 },
      { year: "2023", assets: 3.4 },
      { year: "2024", assets: 4.2 }
    ],
    growthLabel: "SME Loan Portfolio Value ($B)"
  },
  {
    id: "wealth",
    title: "Wealth Management",
    icon: Award,
    description: "Premium advisory services, index builders, and personalized ESG investment scorecards.",
    objectives: [
      "Expand total Assets Under Management (AUM) to $50 Billion by 2027.",
      "Incorporate personalized carbon/ESG tracking on HNW portfolios.",
      "Extend private capital and syndicate investment gates to client tiers."
    ],
    metrics: [
      { label: "AUM Volume", value: "$42.0B" },
      { label: "HNW Clients", value: "6,200" },
      { label: "ESG Portfolio Share", value: "72%" }
    ],
    chartData: [
      { year: "2021", assets: 25 },
      { year: "2022", assets: 31.2 },
      { year: "2023", assets: 36.8 },
      { year: "2024", assets: 42.0 }
    ],
    growthLabel: "Assets Under Management ($B)"
  },
  {
    id: "investment",
    title: "Investment Banking",
    icon: TrendingUp,
    description: "Equity underwriting, mergers & acquisitions guidance, and global debt syndications.",
    objectives: [
      "Underwrite over $3B in clean technology corporate listings.",
      "Develop predictive AI algorithms for market volatility hedges.",
      "Optimize sell-side execution fees using unified trading routers."
    ],
    metrics: [
      { label: "Completed Deals", value: "142 Deals" },
      { label: "Underwritten Bonds", value: "$3.5B" },
      { label: "M&A Advisory Volume", value: "$8.4B" }
    ],
    chartData: [
      { year: "2021", assets: 2.1 },
      { year: "2022", assets: 4.5 },
      { year: "2023", assets: 6.8 },
      { year: "2024", assets: 8.4 }
    ],
    growthLabel: "M&A Advisory Portfolio ($B)"
  },
  {
    id: "international",
    title: "International Banking",
    icon: Users,
    description: "Cross-border trade finance, offshore accounts, and global currency clearance engines.",
    objectives: [
      "Open three major currency desks (Singapore, London, Frankfurt).",
      "Ensure compliance compliance with global Basel anti-laundering systems.",
      "Provide real-time global capital pooling options."
    ],
    metrics: [
      { label: "Active Hubs", value: "5 Hubs" },
      { label: "Settlement Corridors", value: "12 Channels" },
      { label: "Clearing Capacity", value: "24/7" }
    ],
    chartData: [
      { year: "2021", assets: 1.2 },
      { year: "2022", assets: 2.1 },
      { year: "2023", assets: 2.9 },
      { year: "2024", assets: 3.8 }
    ],
    growthLabel: "International Clearing Assets ($B)"
  },
  {
    id: "digital",
    title: "Digital Banking Infrastructure",
    icon: Target,
    description: "Core cloud banking engines, microservices architectures, and instant API ledgers.",
    objectives: [
      "Achieve 99.999% uptime for core ledger clusters on distributed servers.",
      "Decouple customer database layers into secure container clusters.",
      "Reduce server transaction latencies to sub-5 milliseconds."
    ],
    metrics: [
      { label: "System Uptime", value: "99.999%" },
      { label: "API Requests/Min", value: "250k" },
      { label: "Core Latency", value: "4.2ms" }
    ],
    chartData: [
      { year: "2021", assets: 50 },
      { year: "2022", assets: 120 },
      { year: "2023", assets: 190 },
      { year: "2024", assets: 250 }
    ],
    growthLabel: "API Traffic (K Requests / min)"
  },
  {
    id: "ai_services",
    title: "AI Services & Underwriting",
    icon: Sparkles,
    description: "Algorithmic decision models, real-time risk assessment, and chat support automation.",
    objectives: [
      "Migrate all retail overdraft evaluations to real-time risk predictors.",
      "Resolve 75% of customer support queries via intelligent conversational tools.",
      "Detect and auto-freeze suspicious account transactions within 200ms."
    ],
    metrics: [
      { label: "Underwriting Speed", value: "2.8 min" },
      { label: "AI Resolution Rate", value: "78%" },
      { label: "Fraud Savings (2024)", value: "$14M" }
    ],
    chartData: [
      { year: "2021", assets: 2 },
      { year: "2022", assets: 5 },
      { year: "2023", assets: 9 },
      { year: "2024", assets: 14 }
    ],
    growthLabel: "Fraud Prevention Savings ($M)"
  },
  {
    id: "green_finance",
    title: "Green Finance",
    icon: TrendingUp,
    description: "Sustaining ecological health via targeted clean-energy capital allocations and green bonds.",
    objectives: [
      "Commit $5 Billion to sustainable solar, wind, and smart grid developments.",
      "Audit carbon profiles of all institutional corporate loan portfolios.",
      "Offer interest rate rebates to companies achieving verified climate goals."
    ],
    metrics: [
      { label: "Green Capital Committed", value: "$5.2B" },
      { label: "Carbon Neutrality Target", value: "2030" },
      { label: "Green Projects Funded", value: "128" }
    ],
    chartData: [
      { year: "2021", assets: 1.5 },
      { year: "2022", assets: 2.8 },
      { year: "2023", assets: 4.1 },
      { year: "2024", assets: 5.2 }
    ],
    growthLabel: "Green Finance Capital Allocated ($B)"
  }
];

const CeoStrategy = () => {
  const [selectedPillar, setSelectedPillar] = useState(null);

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Operational Excellence</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">Banking Strategy</h1>
        <p className="text-xs text-slate-400">Review strategic targets, asset growth logs, and operational parameters across the 9 primary banking sectors.</p>
      </div>

      {/* Grid of Strategy Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {strategyPillars.map((pillar) => {
          const IconComponent = pillar.icon;
          return (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar)}
              className="text-left p-6 rounded-2xl bg-slate-900 border border-slate-805 hover:border-ceo-gold/40 transition-all shadow-md hover:-translate-y-1 duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-400 group-hover:text-ceo-gold group-hover:bg-ceo-gold/10 transition-colors">
                  <IconComponent size={20} />
                </div>
                <h3 className="font-semibold text-sm text-white group-hover:text-ceo-gold transition-colors">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
              </div>
              <span className="block text-[11px] font-bold text-ceo-gold mt-6 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                Open Strategy Sheet →
              </span>
            </button>
          );
        })}
      </section>

      {/* Detail Modal Overlay */}
      {selectedPillar && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm" 
            onClick={() => setSelectedPillar(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 text-white">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPillar(null)}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 mb-6 pr-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold">Strategic Pillar Briefing</span>
              <h2 className="text-2xl font-serif font-bold">{selectedPillar.title}</h2>
              <p className="text-xs text-slate-350">{selectedPillar.description}</p>
            </div>

            {/* Modal Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Objectives & Stats */}
              <div className="space-y-6">
                
                {/* Objectives */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Key Strategy Objectives</h3>
                  <ul className="space-y-2">
                    {selectedPillar.objectives.map((obj, idx) => (
                      <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-ceo-gold mt-1.5 shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats Grid */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Operational Performance</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedPillar.metrics.map((m, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-center">
                        <span className="block text-sm font-bold text-white tracking-tight">{m.value}</span>
                        <span className="block text-[8px] text-slate-500 uppercase font-semibold mt-1 leading-normal">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Recharts Chart */}
              <div className="space-y-4 bg-slate-950 border border-slate-855 rounded-2xl p-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">{selectedPillar.growthLabel}</span>
                  <span className="text-ceo-gold font-bold">Growth Trend</span>
                </div>
                
                <div className="h-48 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={selectedPillar.chartData}
                      margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                    >
                      <XAxis dataKey="year" stroke="#475569" strokeWidth={0.5} tickLine={false} />
                      <YAxis stroke="#475569" strokeWidth={0.5} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                        labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                        itemStyle={{ color: '#d4af37' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="assets" 
                        stroke="#D4AF37" 
                        strokeWidth={2}
                        fill="rgba(212, 175, 55, 0.1)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <p className="text-[10px] text-slate-500 text-center">Data points audited and verified in Q4 FY2025.</p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CeoStrategy;
