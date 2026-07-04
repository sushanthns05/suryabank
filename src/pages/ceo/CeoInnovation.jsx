import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Database, Key, LayoutGrid, BrainCircuit, Activity, Network } from 'lucide-react';

const innovationAreas = [
  { id: 'ai', title: 'AI Banking Integration', icon: BrainCircuit, tech: 'PyTorch, Spark MLlib, CUDA', desc: 'Predictive customer deposit trends and personalized investment advisors.', metric: 'Accuracy: 99.4%', detail: 'Decentralized transformer models run client-side on mobile devices to predict liquidity buffers without leaking sensitive balances to central servers.' },
  { id: 'fraud', title: 'Real-time Fraud Detection', icon: ShieldCheck, tech: 'Kafka, Flink, Python ML', desc: 'Continuous stream monitoring of transaction nodes for anomaly flags.', metric: 'Uptime: 99.99%', detail: 'Processes millions of transaction parameters, comparing them to historical behavioral profiles. Freezes anomalous behavior in under 200 milliseconds.' },
  { id: 'blockchain', title: 'Blockchain Settlement Corridors', icon: Network, tech: 'Solidity, Rust, Hyperledger', desc: 'Private ledger networks for secure, instant cross-border B2B clearings.', metric: 'Settlement: <10s', detail: 'Eliminates international intermediary banks and transaction escrow delays by completing value clearings on-ledger with smart contracts.' },
  { id: 'cloud', title: 'Distributed Cloud Infrastructure', icon: Database, tech: 'Kubernetes, AWS, Docker', desc: 'Secure, automated container architectures hosting microservices.', metric: 'Latency: <4.2ms', detail: 'Balances global API demand across geographically segregated database nodes, providing automatic failovers and zero single points of failure.' },
  { id: 'apis', title: 'Open Banking GraphQL APIs', icon: LayoutGrid, tech: 'GraphQL, Node.js, API Gateways', desc: 'Unified API gates allowing safe fintech integrations.', metric: 'Requests: 250k/min', detail: 'Ensures external developers can build wallets, cash tracking apps, and investment dashboards on Surya Bank rails under strict client permissions.' },
  { id: 'identity', title: 'Digital ID Cryptography', icon: Key, tech: 'WebAuthn, Passkeys, FIDO2', desc: 'Friction-free biometric logins using device secure enclaves.', metric: 'Fail Rate: <0.01%', detail: 'Eliminates standard text passwords in favor of device-stored private credentials, removing threat surfaces for phishing attacks.' },
  { id: 'quantum', title: 'Quantum-Safe Protection', icon: Cpu, tech: 'Lattice Cryptography, PQC', desc: 'Securing databases with quantum-resistant key exchange algorithms.', metric: 'PQC Migrated: 85%', detail: 'Applying National Institute of Standards (NIST) selected algorithms to protect account records ahead of quantum computing evolution.' },
  { id: 'risk', title: 'Intelligent Risk Analytics', icon: Activity, tech: 'TensorFlow, Spark, Python', desc: 'Automated asset risk scoring and capital ratio buffers calculations.', metric: 'Loss Rates: <0.2%', detail: 'Simulates stress market conditions in real time to calculate capital adequacy ratios and protect bank liquidity margins.' }
];

const CeoInnovation = () => {
  const [activeArea, setActiveArea] = useState(innovationAreas[0]);
  const [pulseNodes, setPulseNodes] = useState(false);

  // Auto-pulse network nodes for simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseNodes(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Research & Development</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">Innovation Center</h1>
        <p className="text-xs text-slate-400">Explore technical frameworks, infrastructure APIs, and quantum-resistant security shields deployed across Surya Bank.</p>
      </div>

      {/* Main Panel: Interactive Network Visualizer & Details Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Panel: SVG Network Visualization */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-805 rounded-3xl p-6 flex flex-col justify-between items-center shadow-xl relative min-h-[350px]">
          <div className="absolute top-4 left-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Live Network Simulator</span>
          </div>

          {/* Interactive Node Graph Map */}
          <svg viewBox="0 0 400 300" className="w-full h-auto max-w-[320px] my-auto">
            {/* Center Core */}
            <circle cx="200" cy="150" r="15" fill="rgba(212,175,55,0.15)" className="animate-pulse" />
            <circle cx="200" cy="150" r="8" fill="#D4AF37" stroke="#FFF" strokeWidth="2" />
            
            {/* Node branches */}
            {[
              { x: 100, y: 80, id: 'ai' },
              { x: 300, y: 80, id: 'fraud' },
              { x: 90, y: 200, id: 'blockchain' },
              { x: 310, y: 200, id: 'cloud' },
              { x: 200, y: 50, id: 'apis' },
              { x: 200, y: 250, id: 'identity' }
            ].map((node, index) => (
              <g 
                key={index} 
                className="cursor-pointer group"
                onClick={() => {
                  const matched = innovationAreas.find(a => a.id === node.id);
                  if (matched) setActiveArea(matched);
                }}
              >
                {/* Connecting Line to core */}
                <line 
                  x1="200" y1="150" 
                  x2={node.x} y2={node.y} 
                  stroke={activeArea.id === node.id ? '#D4AF37' : '#1e293b'} 
                  strokeWidth="1.5" 
                  strokeDasharray={pulseNodes ? "4,4" : "0,0"}
                  className="transition-colors duration-300"
                />
                
                {/* Outer halo */}
                <circle 
                  cx={node.x} cy={node.y} 
                  r={activeArea.id === node.id ? 12 : 8} 
                  fill={activeArea.id === node.id ? 'rgba(212,175,55,0.2)' : 'rgba(30,41,59,0.3)'}
                  className="transition-all duration-300"
                />
                
                {/* Node Core */}
                <circle 
                  cx={node.x} cy={node.y} 
                  r="4" 
                  fill={activeArea.id === node.id ? '#D4AF37' : '#334155'}
                  stroke="#FFF"
                  strokeWidth="1"
                />
              </g>
            ))}
          </svg>

          <div className="w-full text-center">
            <span className="text-[10px] text-slate-500">Click network nodes to inspect system frameworks.</span>
          </div>
        </div>

        {/* Right Panel: Selected Area Details */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-805 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-ceo-gold/10 border border-ceo-gold/20 text-ceo-gold text-[10px] uppercase font-bold tracking-wider">
                  Framework Details
                </span>
                <h3 className="text-xl font-serif text-white font-semibold flex items-center gap-2">
                  {React.createElement(activeArea.icon, { size: 20, className: "text-ceo-gold" })}
                  {activeArea.title}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-850">
                {activeArea.metric}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {activeArea.desc}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850/80 space-y-3">
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Operation Mechanics</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeArea.detail}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-8 flex flex-wrap justify-between items-center gap-4">
            <div className="text-xs">
              <span className="text-slate-500">Tech Stack: </span>
              <strong className="text-gray-300 font-mono">{activeArea.tech}</strong>
            </div>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-750 text-white text-xs font-semibold rounded-lg transition-colors">
              Request Technical Integration
            </button>
          </div>

        </div>

      </section>

      {/* Grid selector of all areas */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {innovationAreas.map((area) => {
          const IconComponent = area.icon;
          return (
            <button
              key={area.id}
              onClick={() => setActiveArea(area)}
              className={`p-4 rounded-xl text-left border transition-all flex items-center gap-3 ${
                activeArea.id === area.id 
                  ? 'bg-slate-800 border-ceo-gold/60 text-white' 
                  : 'bg-slate-900 border-slate-805 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <IconComponent size={18} className={activeArea.id === area.id ? 'text-ceo-gold' : 'text-slate-505'} />
              <span className="text-xs font-semibold truncate">{area.title}</span>
            </button>
          );
        })}
      </section>

    </div>
  );
};

export default CeoInnovation;
