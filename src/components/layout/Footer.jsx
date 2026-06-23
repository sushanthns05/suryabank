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
    <footer className="footer bg-gradient-blue text-white">
      <div className="container footer-content">
        <div className="footer-col brand-col">
          <Link to="/" className="footer-brand">
            <Sun className="brand-icon" size={32} />
            <span className="brand-text">Surya<span className="brand-accent">Bank</span></span>
          </Link>
          <p className="footer-tagline">Banking with Trust, Powered by Innovation.</p>
          <div className="social-links">
            <a href="#" className="social-icon"><span>FB</span></a>
            <a href="#" className="social-icon"><span>TW</span></a>
            <a href="#" className="social-icon"><span>IG</span></a>
            <a href="#" className="social-icon"><span>IN</span></a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Services</h3>
          <ul>
            <li><Link to="/services">Savings Accounts</Link></li>
            <li><Link to="/recurring-deposit">Recurring Deposits (RD)</Link></li>
            <li><Link to="/services">Business Loans</Link></li>
            <li><Link to="/services">Credit Cards</Link></li>
            <li><Link to="/services">Investments</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><a href="#" onClick={(e) => openModal(e, 'Careers', 'Join the Surya Bank team! We are currently looking for innovative minds to shape the future of digital banking. Send your resume to careers@suryabank.com')}>Careers</a></li>
            <li><a href="#" onClick={(e) => openModal(e, 'Security', 'High end security with regular security updates.')}>Security</a></li>
            <li><a href="#" onClick={(e) => openModal(e, 'Terms & Privacy', 'Verified by government official terms.')}>Terms & Privacy</a></li>
          </ul>
        </div>

        <div className="footer-col contact-col">
          <h3>Contact Us</h3>
          <ul>
            <li><Phone size={16} /> 1-800-SURYA-BNK</li>
            <li><Mail size={16} /> support@suryabank.com</li>
            <li><MapPin size={16} /> 123 Financial District, Tech City</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>&copy; {new Date().getFullYear()} Surya Bank. All rights reserved.</p>
          <span className="text-xs text-slate-400">Version: {version}</span>
        </div>
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
