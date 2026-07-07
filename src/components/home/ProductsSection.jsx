import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Briefcase, Building, Landmark, PieChart, ShieldPlus, TrendingUp, CreditCard } from 'lucide-react';

const ProductsSection = () => {
  const products = [
    { title: 'Savings Account', icon: Wallet, desc: 'High-yield premium savings with instant digital access.', color: 'from-blue-500 to-cyan-400', link: '/open-account' },
    { title: 'Corporate Banking', icon: Building, desc: 'Enterprise-grade treasury and liquidity management.', color: 'from-emerald-500 to-teal-400', link: '/services' },
    { title: 'Wealth Management', icon: PieChart, desc: 'Personalized portfolio strategies by AI and experts.', color: 'from-primary-gold to-yellow-400', link: '/services' },
    { title: 'Premium Credit', icon: CreditCard, desc: 'Exclusive rewards, global lounge access, zero forex markup.', color: 'from-purple-500 to-pink-400', link: '/services' },
    { title: 'NRI Services', icon: Landmark, desc: 'Seamless cross-border banking for global citizens.', color: 'from-indigo-500 to-blue-400', link: '/services' },
    { title: 'Business Loans', icon: Briefcase, desc: 'Fast capital deployment for growing enterprises.', color: 'from-orange-500 to-red-400', link: '/services' },
    { title: 'Insurance', icon: ShieldPlus, desc: 'Comprehensive protection for life, health, and assets.', color: 'from-cyan-500 to-blue-400', link: '/services' },
    { title: 'Investments', icon: TrendingUp, desc: 'Direct market access, mutual funds, and government bonds.', color: 'from-green-500 to-emerald-400', link: '/services' },
  ];

  return (
    <section className="py-24 bg-bg-primary relative z-10">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
          >
            World-Class <span className="text-gradient">Products</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Tailored financial solutions designed to elevate your wealth and secure your future.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((prod, idx) => (
            <Link to={prod.link} key={idx} className="block">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -10 }}
                className="h-full p-8 rounded-2xl glass border border-white/5 shadow-soft hover:shadow-2xl transition-all group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${prod.color} rounded-full filter blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                
                <div className="w-14 h-14 rounded-xl bg-bg-secondary border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <prod.icon size={24} className="text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-gold transition-colors">{prod.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{prod.desc}</p>
                
                <div className="mt-6 flex items-center text-sm font-bold text-primary-gold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  Explore <TrendingUp size={16} className="ml-2" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
