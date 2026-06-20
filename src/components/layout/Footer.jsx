import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
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
            <li><Link to="/services">Business Loans</Link></li>
            <li><Link to="/services">Credit Cards</Link></li>
            <li><Link to="/services">Investments</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/security">Security</Link></li>
            <li><Link to="/legal">Terms & Privacy</Link></li>
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
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Surya Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
