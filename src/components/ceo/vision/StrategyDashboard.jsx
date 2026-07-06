import React, { useState, useEffect, useRef } from 'react';
import { strategicKPIs } from '../../../pages/ceo/CeoMockData';
import { TrendingUp, BarChart2, Shield, Target, Users, Zap, Globe, Cpu } from 'lucide-react';

const AnimatedCounter = ({ value, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  // Remove non-numeric characters for the animation
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const isString = typeof value === 'string';
  const prefix = isString && value.startsWith('$') ? '$' : '';
  const realSuffix = isString && value.endsWith('B') ? 'B' : (isString && value.endsWith('+') ? '+' : suffix);

  useEffect(() => {
    if (isNaN(numericValue)) return;
    
    let observer;
    let startTimestamp = null;
    let animationFrame;
    let isVisible = false;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      const currentVal = easeProgress * numericValue;
      // Keep decimal if the original value has it
      setCount(numericValue % 1 !== 0 ? currentVal.toFixed(1) : Math.floor(currentVal));
      
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    if (nodeRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isVisible) {
            isVisible = true;
            animationFrame = window.requestAnimationFrame(step);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(nodeRef.current);
    }

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (observer && nodeRef.current) observer.unobserve(nodeRef.current);
    };
  }, [numericValue, duration]);

  if (isNaN(numericValue)) return <span>{value}</span>;

  return <span ref={nodeRef}>{prefix}{count}{realSuffix}</span>;
};

const KPI_CONFIG = [
  { key: 'visionProgress', label: 'Overall Progress', icon: Target, color: 'text-ceo-gold', suffix: '%' },
  { key: 'initiatives', label: 'Strategic Initiatives', icon: Zap, color: 'text-emerald-400' },
  { key: 'digitalAdoption', label: 'Digital Adoption', icon: Cpu, color: 'text-blue-400', suffix: '%' },
  { key: 'aiTransformationIndex', label: 'AI Index', icon: TrendingUp, color: 'text-purple-400' },
  { key: 'customerSatisfaction', label: 'NPS Score', icon: Users, color: 'text-rose-400' },
  { key: 'esgProgress', label: 'ESG Progress', icon: Shield, color: 'text-green-400', suffix: '%' },
  { key: 'countriesServed', label: 'Global Markets', icon: Globe, color: 'text-cyan-400' },
  { key: 'strategicInvestments', label: 'Capex Allocation', icon: BarChart2, color: 'text-amber-500' }
];

const StrategyDashboard = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {KPI_CONFIG.map((kpi, i) => (
        <div 
          key={i} 
          className="relative group p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md overflow-hidden hover:border-ceo-gold/40 transition-all shadow-xl cursor-pointer"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
          
          <div className="flex items-center justify-between mb-4">
            <kpi.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${kpi.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-1 truncate">
            <AnimatedCounter value={strategicKPIs[kpi.key]} suffix={kpi.suffix} />
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold truncate">
            {kpi.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StrategyDashboard;
