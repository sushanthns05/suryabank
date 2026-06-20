import React from 'react';
import { ShieldCheck, TrendingUp, Smartphone, ChevronRight, Headset, Globe, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './LandingPage.css';

const LandingPage = () => {
  const scrollToFeatures = () => {
    document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page fade-in">
      {/* Hero Section */}
      <section className="hero bg-gradient-blue">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Banking with <span className="text-gradient">Trust</span>,<br />
              Powered by <span className="text-gradient">Innovation</span>.
            </h1>
            <p className="hero-subtitle">
              Experience the future of digital banking. Secure, fast, and personalized financial services for everyone.
            </p>
            <div className="hero-actions">
              <Button variant="primary" size="lg" onClick={() => window.location.href = '/auth'}>Open an Account <ChevronRight size={20} className="ml-2" /></Button>
              <Button variant="glass" size="lg" onClick={scrollToFeatures}>Explore Features</Button>
            </div>
          </div>
          <div className="hero-image">
            {/* Mockup of mobile app or credit card using CSS */}
            <div className="mockup-card glass">
              <div className="mockup-chip"></div>
              <div className="mockup-logo">SuryaBank</div>
              <div className="mockup-number">**** **** **** 1234</div>
              <div className="mockup-name">PREMIUM MEMBER</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="features container section-padding">
        <div className="section-header text-center">
          <h2 className="section-title">Why Choose Surya Bank?</h2>
          <p className="section-subtitle">We combine modern technology with robust security to give you the best banking experience.</p>
        </div>
        
        <div className="features-grid">
          <Card hover className="feature-card">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={32} className="feature-icon" />
            </div>
            <h3>Bank Grade Security</h3>
            <p>End-to-end encryption, multi-factor authentication, and AI-powered fraud detection keep your money safe.</p>
          </Card>

          <Card hover className="feature-card">
            <div className="feature-icon-wrapper">
              <TrendingUp size={32} className="feature-icon" />
            </div>
            <h3>Smart Analytics</h3>
            <p>Get AI-powered insights into your spending, set financial goals, and receive personalized wealth recommendations.</p>
          </Card>

          <Card hover className="feature-card">
            <div className="feature-icon-wrapper">
              <Smartphone size={32} className="feature-icon" />
            </div>
            <h3>Seamless Mobile Banking</h3>
            <p>Manage your accounts, transfer funds via UPI, and pay bills instantly from our award-winning mobile app.</p>
          </Card>

          <Card hover className="feature-card">
            <div className="feature-icon-wrapper">
              <Headset size={32} className="feature-icon" />
            </div>
            <h3>24/7 AI Support</h3>
            <p>Get instant answers to your banking queries anytime, anywhere with our intelligent chatbot and dedicated support team.</p>
          </Card>

          <Card hover className="feature-card">
            <div className="feature-icon-wrapper">
              <Globe size={32} className="feature-icon" />
            </div>
            <h3>Global Transactions</h3>
            <p>Send money internationally with zero hidden fees and real-time exchange rates, settling within minutes.</p>
          </Card>

          <Card hover className="feature-card">
            <div className="feature-icon-wrapper">
              <Zap size={32} className="feature-icon" />
            </div>
            <h3>Instant Approvals</h3>
            <p>Enjoy pre-approved personal loans and credit cards with instant disbursement directly to your account.</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section bg-gradient-blue text-center">
        <div className="container">
          <h2>Ready to upgrade your banking experience?</h2>
          <p>Join thousands of satisfied customers today and take control of your financial future.</p>
          <Button variant="primary" size="lg" className="mt-4" onClick={() => window.location.href = '/auth'}>Get Started Now</Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
