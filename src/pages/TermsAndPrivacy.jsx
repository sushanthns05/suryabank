import React from 'react';
import { motion } from 'framer-motion';

const TermsAndPrivacy = () => {
  return (
    <div className="bg-bg-primary min-h-screen pt-32 pb-24 text-white overflow-hidden selection:bg-primary-gold selection:text-bg-primary relative">
      <div className="absolute top-0 left-0 w-full h-full bg-aurora opacity-30 pointer-events-none"></div>
      
      <div className="container relative z-10 text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-heading font-bold mb-6"
        >
          Terms & <span className="text-gradient">Privacy</span>
        </motion.h1>
      </div>

      <div className="container relative z-10 max-w-4xl mx-auto space-y-16 text-slate-300 leading-relaxed text-lg">
        
        {/* Terms of Use */}
        <div className="space-y-8">
          <h2 className="text-4xl font-heading font-bold text-white border-b border-white/10 pb-4">Terms of Use</h2>
          
          <section>
            <p>Welcome to Surya Bank. By accessing or using our website, mobile applications, or digital banking services, you agree to comply with these Terms of Use.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Acceptable Use</h3>
            <p className="mb-2">Users agree to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Provide accurate information.</li>
              <li>Maintain the confidentiality of login credentials.</li>
              <li>Use banking services only for lawful purposes.</li>
              <li>Follow all applicable banking regulations.</li>
            </ul>
            <p className="mb-2">Users must not:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Attempt unauthorized access.</li>
              <li>Misuse or interfere with banking systems.</li>
              <li>Upload malicious software.</li>
              <li>Engage in fraudulent activities.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Account Responsibility</h3>
            <p className="mb-2">Customers are responsible for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Protecting account credentials.</li>
              <li>Updating personal information.</li>
              <li>Reviewing account activity regularly.</li>
              <li>Reporting unauthorized transactions promptly.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Service Availability</h3>
            <p>While Surya Bank strives to provide uninterrupted services, temporary interruptions may occur due to maintenance, upgrades, or circumstances beyond our control.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Intellectual Property</h3>
            <p>All content, trademarks, logos, graphics, software, and digital assets available on Surya Bank platforms remain the intellectual property of Surya Bank and may not be copied or reproduced without permission.</p>
          </section>
        </div>

        {/* Privacy Policy */}
        <div className="space-y-8">
          <h2 className="text-4xl font-heading font-bold text-white border-b border-white/10 pb-4">Privacy Policy</h2>
          
          <section>
            <p>Surya Bank values your privacy and is committed to protecting your personal information.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Information We Collect</h3>
            <p className="mb-2">We may collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name</li>
              <li>Contact Information</li>
              <li>Identity Documents</li>
              <li>Banking Information</li>
              <li>Device Information</li>
              <li>Transaction History</li>
              <li>Login Activity</li>
              <li>Customer Support Communications</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">How We Use Your Information</h3>
            <p className="mb-2">We use customer information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Open and manage accounts.</li>
              <li>Process transactions.</li>
              <li>Verify identity.</li>
              <li>Prevent fraud.</li>
              <li>Improve customer experience.</li>
              <li>Meet legal and regulatory obligations.</li>
              <li>Provide customer support.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Information Sharing</h3>
            <p className="mb-2">Surya Bank does not sell customer personal information. Information may be shared only when:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Required by law or regulatory authorities.</li>
              <li>Necessary to process banking services through authorized service providers.</li>
              <li>Required to investigate fraud or protect customer accounts.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Data Security</h3>
            <p>We implement appropriate technical and organizational measures to safeguard customer information against unauthorized access, disclosure, alteration, or destruction.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Cookies</h3>
            <p className="mb-2">Our website may use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Improve website functionality.</li>
              <li>Remember user preferences.</li>
              <li>Analyze website performance.</li>
              <li>Enhance user experience.</li>
            </ul>
            <p>Users may manage cookie preferences through their browser settings.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Customer Rights</h3>
            <p className="mb-2">Customers may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access their personal information.</li>
              <li>Request corrections to inaccurate information.</li>
              <li>Update account details.</li>
              <li>Request deletion where legally applicable.</li>
              <li>Contact customer support regarding privacy concerns.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Policy Updates</h3>
            <p>Surya Bank may update these Terms and Privacy Policy periodically to reflect legal, regulatory, or operational changes. The latest version will always be available on our official website, and continued use of our services constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-primary-gold mb-4">Contact Us</h3>
            <p>For questions regarding our Terms of Use, Privacy Policy, or Security practices, please contact Surya Bank Customer Support through our official communication channels.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
