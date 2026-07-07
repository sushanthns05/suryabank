import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const Counter = ({ from, to, duration = 2, suffix = '' }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  
  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [count, to, duration]);

  return <motion.span>{rounded}</motion.span>;
};

const StatsSection = () => {
  const stats = [
    { label: "Assets Managed", prefix: "₹", value: 15, suffix: " Trillion+", desc: "Global asset portfolio" },
    { label: "Customers", value: 25, suffix: " Million+", desc: "Trusting our services globally" },
    { label: "Branches", value: 350, suffix: "+", desc: "Across 120+ countries" },
    { label: "System Uptime", value: 99.999, suffix: "%", desc: "Enterprise reliability", isFloat: true }
  ];

  return (
    <section className="py-24 bg-bg-secondary relative border-y border-white/5 z-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-8 rounded-2xl glass border border-white/5 hover:border-primary-gold/30 transition-colors group"
            >
              <div className="text-primary-gold mb-2 font-heading font-bold text-4xl lg:text-5xl flex items-baseline">
                {stat.prefix}
                {stat.isFloat ? (
                  <span>99.999</span> // For simplicity on float animation
                ) : (
                  <Counter from={0} to={stat.value} />
                )}
                <span className="text-2xl">{stat.suffix}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{stat.label}</h3>
              <p className="text-slate-400 text-sm">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
