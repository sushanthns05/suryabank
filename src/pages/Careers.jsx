import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, HeartPulse, GraduationCap, Code, Banknote, Shield } from 'lucide-react';

const Careers = () => {
  return (
    <div className="bg-bg-primary min-h-screen pt-32 pb-24 text-white overflow-hidden selection:bg-primary-gold selection:text-bg-primary relative">
      <div className="absolute top-0 left-0 w-full h-full bg-aurora opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-primary-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container relative z-10 text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-heading font-bold mb-6"
        >
          Build Your Future with <br/><span className="text-gradient">Surya Bank</span>
        </motion.h1>
      </div>

      <div className="container relative z-10 max-w-4xl mx-auto space-y-12 text-slate-300 leading-relaxed text-lg">
        <section>
          <p>At Surya Bank, we believe that our employees are the foundation of our success. We are committed to creating an innovative, inclusive, and growth-oriented workplace where talented individuals can build meaningful careers while contributing to the future of digital banking.</p>
          <p className="mt-4">Whether you're a recent graduate or an experienced professional, Surya Bank offers opportunities to grow, lead, and make a real impact in the financial industry.</p>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Why Join Surya Bank?</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-2">Innovation-Driven Workplace</h3>
              <p>Work with cutting-edge technologies including AI-powered banking, cloud computing, cybersecurity, data analytics, and digital transformation.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-2">Career Growth</h3>
              <p>We provide structured career paths, leadership development programs, internal promotions, and continuous learning opportunities.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-2">Learning & Development</h3>
              <p>Employees receive access to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Technical Training</li>
                <li>Banking Certifications</li>
                <li>Leadership Programs</li>
                <li>Professional Workshops</li>
                <li>Online Learning Platforms</li>
                <li>Mentorship Programs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-2">Inclusive Culture</h3>
              <p>We promote diversity, equality, collaboration, and respect across all departments.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Competitive Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex items-center gap-3"><HeartPulse className="text-primary-gold" size={24}/> Attractive Salary Packages</div>
             <div className="flex items-center gap-3"><Banknote className="text-primary-gold" size={24}/> Performance Bonuses</div>
             <div className="flex items-center gap-3"><Shield className="text-primary-gold" size={24}/> Health Insurance</div>
             <div className="flex items-center gap-3"><Briefcase className="text-primary-gold" size={24}/> Provident Fund</div>
             <div className="flex items-center gap-3"><GraduationCap className="text-primary-gold" size={24}/> Paid Annual Leave</div>
             <div className="flex items-center gap-3"><HeartPulse className="text-primary-gold" size={24}/> Employee Wellness Programs</div>
             <div className="flex items-center gap-3"><Code className="text-primary-gold" size={24}/> Flexible Work Options (Eligible Roles)</div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Current Opportunities</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-2">Technology</h3>
              <p>Software Engineer, Full Stack Developer, Mobile App Developer, UI/UX Designer, Cloud Engineer, DevOps Engineer, AI/ML Engineer, Data Scientist, Cybersecurity Analyst.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-2">Banking Operations</h3>
              <p>Relationship Manager, Customer Service Executive, Branch Operations Officer, Credit Officer, Loan Processing Executive, Cashier, Banking Associate.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-2">Corporate Functions</h3>
              <p>Human Resources, Finance & Accounts, Marketing, Risk Management, Compliance Officer, Legal Advisor, Internal Auditor.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Internship Program</h2>
          <p>Our internship program provides students with practical exposure to the banking industry through real-world projects, mentorship, and hands-on experience.</p>
          <p className="mt-4 font-bold text-white">Eligibility:</p>
          <ul className="list-disc pl-6 mt-2">
             <li>Undergraduate Students</li>
             <li>Postgraduate Students</li>
             <li>Final Year Students</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Recruitment Process</h2>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>Online Application</li>
            <li>Resume Screening</li>
            <li>Aptitude Assessment</li>
            <li>Technical/Functional Interview</li>
            <li>HR Interview</li>
            <li>Background Verification</li>
            <li>Offer Letter</li>
            <li>Onboarding</li>
          </ol>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Equal Opportunity Employer</h2>
          <p>Surya Bank is committed to providing equal employment opportunities to all qualified applicants regardless of gender, race, religion, disability, or background.</p>
        </section>
      </div>
    </div>
  );
};

export default Careers;
