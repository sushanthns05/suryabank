import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Users, Building2 } from 'lucide-react';
import Card from '../components/ui/Card';
import './AboutUs.css';

const kengeriTeam = [
  {
    roleGroup: "Branch Leadership",
    description: "Guiding the branch towards excellence and ensuring seamless operations.",
    members: [
      { name: "Yashwanth S B", role: "Manager and Head of Bank" },
      { name: "Girish Yadav J", role: "System Manager" }
    ]
  },
  {
    roleGroup: "Relationship Managers",
    description: "Act as the primary point of contact for high-net-worth or enterprise clients, identifying specific financial needs and suggesting tailored banking products.",
    members: [
      { name: "Suresh S", role: "Senior Relationship Manager" },
      { name: "Daranth S", role: "Relationship Manager" },
      { name: "Krishna J", role: "Relationship Manager" },
      { name: "Kushal N", role: "Relationship Manager" },
      { name: "Likith Gowda", role: "Relationship Manager" }
    ]
  },
  {
    roleGroup: "Personal Bankers",
    description: "Assist customers in opening/closing accounts, explain product features, and help with basic investment needs.",
    members: [
      { name: "Manjunath R", role: "Senior Personal Banker" },
      { name: "Kumar G", role: "Personal Banker" },
      { name: "Ramesh R", role: "Personal Banker" },
      { name: "Satish H", role: "Personal Banker" },
      { name: "Manish Shetty", role: "Personal Banker" }
    ]
  },
  {
    roleGroup: "Loan Officers",
    description: "Evaluate and process loan applications, check credit histories, interview applicants, and explain terms.",
    members: [
      { name: "Hemanth Patil", role: "Senior Loan Officer" },
      { name: "Manjunath S R", role: "Loan Officer" },
      { name: "Krishna Kumar", role: "Loan Officer" },
      { name: "T Nagappa", role: "Loan Officer" },
      { name: "Jagan Nath", role: "Loan Officer" }
    ]
  },
  {
    roleGroup: "Bank Clerks / Tellers",
    description: "Handle day-to-day banking activities such as cash deposits, withdrawals, fund transfers, and cheque processing.",
    members: [
      { name: "Srinath J", role: "Senior Bank Clerk / Teller" },
      { name: "Jagdish R", role: "Bank Clerk / Teller" },
      { name: "Ramnath Kumar", role: "Bank Clerk / Teller" },
      { name: "Kushal R", role: "Bank Clerk / Teller" },
      { name: "Gagan S", role: "Bank Clerk / Teller" }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const AboutUs = () => {
  return (
    <div className="bg-bg-primary min-h-screen pt-32 pb-24 text-white overflow-hidden selection:bg-primary-gold selection:text-bg-primary relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-aurora opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-primary-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container relative z-10 text-center mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-heading font-bold mb-6"
        >
          Our Legacy. <br/><span className="text-gradient">Your Trust.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto"
        >
          Over 200 years of empowering generations with financial stability, innovation, and unwavering security.
        </motion.p>
      </div>
      
      <div className="container relative z-10 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-12 lg:p-16 rounded-[3rem] bg-bg-secondary/50 border border-white/5 shadow-2xl glass relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/10 rounded-full blur-[80px]"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold mb-8 text-white flex items-center gap-4">
                <Building2 className="text-primary-gold" size={40} /> About Surya Bank
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                <p>
                  <strong className="text-white">Surya Bank (SB)</strong>, a Fortune 500 company, is an Indian Multinational, Public Sector Banking and Financial services statutory body headquartered in Bengaluru. The rich heritage and legacy of over 200 years, accredits SB as the most trusted Bank by Indians through generations.
                </p>
                <p>
                  We are the largest banking and financial services organization in India. We serve over 50 crore customers through our vast network with an undeterred focus on innovation and customer centricity, which stems from the core values of the Bank: <strong className="text-primary-gold">Service, Transparency, Ethics, Politeness, and Sustainability.</strong>
                </p>
                <p>
                  Growing with times, SB continues to redefine banking in India, as it aims to offer responsible and sustainable Banking solutions globally.
                </p>
              </div>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { label: 'Asset Base', value: '61+ Tn', icon: ShieldCheck },
                { label: 'Customers', value: '50+ Cr', icon: Users },
                { label: 'Branches', value: '23.2k+', icon: Building2 },
                { label: 'Global Offices', value: '241', icon: Globe },
              ].map((stat, idx) => (
                <motion.div key={idx} variants={itemVariants} className="p-8 rounded-3xl bg-bg-primary/50 border border-white/5 hover:border-primary-gold/30 transition-all hover:-translate-y-2 group">
                  <stat.icon className="text-slate-500 group-hover:text-primary-gold mb-4 transition-colors" size={32} />
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-gradient transition-colors">{stat.value}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white"
          >
            Kengeri Satellite Town <span className="text-gradient">Branch</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Meet our dedicated team of professionals ready to serve you with world-class financial expertise.
          </motion.p>
        </div>
        
        <div className="space-y-24">
          
          {/* Executive Leadership (CEO & Founder) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center mb-16"
          >
            <div className="mb-10 text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-heading font-bold text-white mb-4">Executive Leadership</h3>
              <p className="text-lg text-slate-400">The visionary leading Surya Bank into the future of digital finance.</p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-[#0d284f]/80 to-[#071A35]/90 border border-primary-gold/30 hover:border-primary-gold/60 transition-all flex flex-col items-center text-center glass shadow-2xl relative overflow-hidden w-full max-w-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/10 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-blue/10 rounded-full blur-[60px]"></div>
              
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-bg-primary border-4 border-primary-gold flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.3)] relative z-10">
                <span className="text-5xl md:text-6xl font-heading font-bold text-gradient">S</span>
              </div>
              <h4 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 relative z-10">Sushanth N S</h4>
              <p className="text-lg md:text-xl font-bold text-primary-gold bg-primary-gold/10 px-8 py-2 rounded-full relative z-10 tracking-wide uppercase">CEO, Chairman and Founder</p>
            </motion.div>
          </motion.div>

          {/* Rest of the Branch Team */}
          {kengeriTeam.map((group, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-10 text-center max-w-3xl mx-auto">
                <h3 className="text-3xl font-heading font-bold text-white mb-4">{group.roleGroup}</h3>
                <p className="text-lg text-slate-400">{group.description}</p>
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center"
              >
                {group.members.map((member, mIndex) => (
                  <motion.div 
                    key={mIndex} 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-8 rounded-[2rem] bg-bg-secondary/30 border border-white/5 hover:border-primary-gold/20 hover:bg-bg-secondary/80 transition-all flex flex-col items-center text-center glass shadow-soft"
                  >
                    <div className="w-20 h-20 rounded-full bg-bg-primary border border-white/10 flex items-center justify-center mb-6 text-2xl font-heading font-bold text-primary-gold">
                      {member.name.charAt(0)}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{member.name}</h4>
                    <p className="text-sm font-medium text-primary-gold bg-primary-gold/10 px-4 py-1.5 rounded-full">{member.role}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
