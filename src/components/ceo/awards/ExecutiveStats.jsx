import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Globe, MapPin, Sparkles, Building2, Cpu, ShieldCheck, UserCheck } from 'lucide-react';

const STATS = [
  { label: 'Total Awards', value: 85, icon: Trophy, color: 'text-ceo-gold' },
  { label: 'International', value: 42, icon: Globe, color: 'text-blue-400' },
  { label: 'Countries', value: 18, icon: MapPin, color: 'text-emerald-400' },
  { label: 'Innovation', value: 24, icon: Sparkles, color: 'text-purple-400' },
  { label: 'Banking', value: 31, icon: Building2, color: 'text-slate-300' },
  { label: 'Technology', value: 19, icon: Cpu, color: 'text-cyan-400' },
  { label: 'ESG', value: 15, icon: ShieldCheck, color: 'text-green-400' },
  { label: 'Leadership', value: 28, icon: UserCheck, color: 'text-amber-500' }
];

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    let observer;
    let startTimestamp = null;
    let animationFrame;
    let isVisible = false;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * value));
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
  }, [value, duration]);

  return <span ref={nodeRef}>{count}</span>;
};

const ExecutiveStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {STATS.map((stat, i) => (
        <div 
          key={i} 
          className="relative group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md overflow-hidden hover:border-ceo-gold/40 transition-all shadow-xl"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
          
          <div className="flex items-center justify-between mb-4">
            <stat.icon className={`w-6 h-6 ${stat.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
          </div>
          
          <h3 className="text-3xl font-bold text-white font-serif mb-1">
            <AnimatedCounter value={stat.value} />+
          </h3>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ExecutiveStats;
