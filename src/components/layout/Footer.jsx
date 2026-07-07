import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [version, setVersion] = useState('v1.0.0');
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', content: '' });

  const openModal = (e, title, content) => {
    e.preventDefault();
    setModalInfo({ isOpen: true, title, content });
  };

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const backendUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:5000' 
          : 'https://suryabank.onrender.com';
        const res = await fetch(`${backendUrl}/api/updates/status`);
        const data = await res.json();
        if (data.success && data.latestUpdate) {
          setVersion(data.latestUpdate.version);
        }
      } catch (err) {
        // Silent fail, keep default version
      }
    };
    fetchVersion();
  }, []);
  return (
    <footer className="bg-bg-secondary text-slate-300 py-16 border-t border-white/5 relative z-10 print:hidden">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Surya Bank Logo" className="h-8 w-auto object-contain brightness-0 invert" />
            <span className="font-heading text-2xl font-bold text-white tracking-tight">Surya<span className="text-primary-gold">Bank</span></span>
          </Link>
          <p className="text-sm text-slate-400 max-w-xs">Banking with Trust, Powered by Innovation. Experience the future of global enterprise banking.</p>
          <div className="flex gap-4 pt-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-gold hover:text-bg-primary transition-all text-sm font-bold">FB</a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-gold hover:text-bg-primary transition-all text-sm font-bold">X</a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-gold hover:text-bg-primary transition-all text-sm font-bold">IG</a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-gold hover:text-bg-primary transition-all text-sm font-bold">IN</a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-heading font-bold text-lg mb-6">Services</h3>
          <ul className="space-y-3">
            <li><Link to="/services" className="text-sm hover:text-primary-gold transition-colors">Savings Accounts</Link></li>
            <li><Link to="/recurring-deposit" className="text-sm hover:text-primary-gold transition-colors">Recurring Deposits (RD)</Link></li>
            <li><Link to="/services" className="text-sm hover:text-primary-gold transition-colors">Business Loans</Link></li>
            <li><Link to="/services" className="text-sm hover:text-primary-gold transition-colors">Credit Cards</Link></li>
            <li><Link to="/services" className="text-sm hover:text-primary-gold transition-colors">Wealth Management</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-heading font-bold text-lg mb-6">Company</h3>
          <ul className="space-y-3">
            <li><Link to="/about" className="text-sm hover:text-primary-gold transition-colors">About Us</Link></li>
            <li><a href="#" onClick={(e) => openModal(e, 'Careers', 'Join the Surya Bank team!')} className="text-sm hover:text-primary-gold transition-colors">Careers</a></li>
            <li><a href="#" onClick={(e) => openModal(e, 'Security', 'High end security')} className="text-sm hover:text-primary-gold transition-colors">Security</a></li>
            <li><a href="#" onClick={(e) => openModal(e, 'Terms', 'Terms')} className="text-sm hover:text-primary-gold transition-colors">Terms & Privacy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-heading font-bold text-lg mb-6">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm">
              <Phone size={18} className="text-primary-gold shrink-0 mt-0.5" /> 
              <span>1-800-SURYA-BNK<br/><span className="text-xs text-slate-500">24/7 Priority Support</span></span>
            </li>
            <li className="flex items-center gap-3 text-sm"><Mail size={18} className="text-primary-gold shrink-0" /> support@suryabank.com</li>
            <li className="flex items-start gap-3 text-sm"><MapPin size={18} className="text-primary-gold shrink-0 mt-0.5" /> 123 Financial District, Tech City, Global Hub</li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} Surya Bank. All rights reserved.</p>
        <span className="text-xs text-slate-600 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10">Version: {version}</span>
      </div>

      {/* Info Modal */}
      {modalInfo.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{modalInfo.title}</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-left">
                {modalInfo.content}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button 
                onClick={() => setModalInfo({ isOpen: false, title: '', content: '' })}
                className="px-6 py-2.5 bg-surya-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
