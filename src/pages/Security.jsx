import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, AlertTriangle, Eye, CheckCircle } from 'lucide-react';

const Security = () => {
  return (
    <div className="bg-bg-primary min-h-screen pt-32 pb-24 text-white overflow-hidden selection:bg-primary-gold selection:text-bg-primary relative">
      <div className="absolute top-0 left-0 w-full h-full bg-aurora opacity-30 pointer-events-none"></div>
      
      <div className="container relative z-10 text-center mb-16">
        <ShieldCheck className="text-primary-gold mx-auto mb-6" size={80} />
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-heading font-bold mb-6"
        >
          Your Security is Our <br/><span className="text-gradient">Highest Priority</span>
        </motion.h1>
      </div>

      <div className="container relative z-10 max-w-4xl mx-auto space-y-12 text-slate-300 leading-relaxed text-lg">
        <section>
          <p>At Surya Bank, protecting our customers' financial information is our highest priority. We employ advanced security technologies, continuous monitoring, and industry best practices to ensure safe, secure, and reliable banking services.</p>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Multi-Layer Security</h2>
          <p className="mb-4">Our security framework includes multiple layers of protection to safeguard your accounts and transactions.</p>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-3 flex items-center gap-2"><Lock size={20}/> Account Protection</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Multi-Factor Authentication (MFA)</li>
                <li>Strong Password Policies</li>
                <li>Biometric Authentication</li>
                <li>Device Recognition</li>
                <li>Session Management</li>
                <li>Automatic Logout</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-3 flex items-center gap-2"><ShieldCheck size={20}/> Data Security</h3>
              <p className="mb-2">Customer information is protected using industry-standard encryption during transmission and storage. Security measures include:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>End-to-End Encryption</li>
                <li>Secure HTTPS Communication</li>
                <li>Encrypted Data Storage</li>
                <li>Secure Backup Systems</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-3 flex items-center gap-2"><Eye size={20}/> Fraud Protection</h3>
              <p className="mb-2">Our intelligent monitoring systems help detect and prevent suspicious activities. Features include:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Real-Time Fraud Monitoring</li>
                <li>Unusual Login Detection</li>
                <li>Transaction Risk Analysis</li>
                <li>Suspicious Activity Alerts</li>
                <li>Account Protection Controls</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-gold mb-3 flex items-center gap-2"><CheckCircle size={20}/> Secure Transactions</h3>
              <p className="mb-2">Every transaction undergoes multiple security checks before processing. Supported protections:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>OTP Verification</li>
                <li>Secure Payment Authentication</li>
                <li>Transaction Notifications</li>
                <li>Daily Transaction Monitoring</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-heading font-bold text-white mb-6 flex items-center gap-3">
            <AlertTriangle className="text-yellow-500" size={32}/> Customer Safety Tips
          </h2>
          <p className="mb-4">To keep your account secure:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Never share your passwords or OTPs.</li>
            <li>Always use strong, unique passwords.</li>
            <li>Enable Multi-Factor Authentication.</li>
            <li>Log out after completing your banking session.</li>
            <li>Keep your devices updated.</li>
            <li>Avoid using public Wi-Fi for banking transactions.</li>
            <li>Report suspicious activity immediately.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Privacy Protection</h2>
          <p>We collect only the information necessary to provide banking services and protect customer privacy through secure handling and controlled access to personal information.</p>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Security Monitoring</h2>
          <p className="mb-2">Our systems operate 24/7 to monitor:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Login Attempts</li>
            <li>Account Activity</li>
            <li>Transaction Behavior</li>
            <li>Fraud Indicators</li>
            <li>Security Threats</li>
            <li>System Health</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Report Security Concerns</h2>
          <p>If you notice suspicious activity or believe your account has been compromised, contact Surya Bank Customer Support immediately for assistance.</p>
        </section>
      </div>
    </div>
  );
};

export default Security;
