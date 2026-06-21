import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PiggyBank, ArrowRight, CheckCircle, ShieldCheck, 
  TrendingUp, Clock, FileText, Globe, GraduationCap,
  Percent, HandCoins, AlertTriangle, Calculator
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './RecurringDeposit.css';

const RecurringDeposit = () => {
  // Calculator State
  const [deposit, setDeposit] = useState(5000);
  const [tenure, setTenure] = useState(12);
  const [interestRate, setInterestRate] = useState(6.5);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  
  // Results State
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [interestEarned, setInterestEarned] = useState(0);

  // FAQ State
  const [activeFaq, setActiveFaq] = useState(null);

  // Calculate Returns
  useEffect(() => {
    // Basic RD compound interest formula (quarterly compounding assumed for standard banks)
    // Formula: M = R * [(1+i)^n - 1] / [1-(1+i)^(-1/3)] (Simplified approximation for web calc)
    // Actually, a simpler standard RD maturity formula: 
    // Maturity = P * n + P * n * (n+1) / (2 * 12) * (r / 100)
    
    const rate = isSeniorCitizen ? interestRate + 0.5 : interestRate;
    const P = parseFloat(deposit);
    const n = parseInt(tenure);
    const r = parseFloat(rate);

    const totalPrincipal = P * n;
    // Standard RD interest approximation
    const totalInterest = P * n * (n + 1) / 24 * (r / 100);
    const totalMaturity = totalPrincipal + totalInterest;

    setTotalInvested(totalPrincipal);
    setInterestEarned(totalInterest);
    setMaturityAmount(totalMaturity);
  }, [deposit, tenure, interestRate, isSeniorCitizen]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const schemeOptions = [
    {
      title: "Regular RD",
      icon: <PiggyBank size={32} className="text-surya-primary" />,
      desc: "Ideal for salaried employees, students, and professionals to build a steady savings habit."
    },
    {
      title: "Senior Citizen RD",
      icon: <ShieldCheck size={32} className="text-amber-500" />,
      desc: "Higher interest benefits for customers aged 60 years and above for a secure retirement."
    },
    {
      title: "NRI Recurring Deposit",
      icon: <Globe size={32} className="text-blue-500" />,
      desc: "Special RD accounts for NRI customers with flexible, tax-efficient repatriation options."
    },
    {
      title: "Goal-Based RD",
      icon: <GraduationCap size={32} className="text-purple-500" />,
      desc: "Designed specifically to save for education, marriage, travel, or a home purchase."
    }
  ];

  const faqs = [
    { q: "What is the minimum RD amount?", a: "The minimum deposit amount is just ₹100 per month, with no upper limit." },
    { q: "Can I close my RD before maturity?", a: "Yes, you can close your RD after the initial 6-month lock-in period, subject to premature withdrawal penalties." },
    { q: "Can I take a loan against my RD?", a: "Absolutely! Customers can avail an overdraft or loan up to 90% of their accumulated RD balance at lower interest rates." },
    { q: "Is nomination available?", a: "Yes, nomination facility is available and highly recommended for all RD accounts." },
    { q: "Can NRIs open RD accounts?", a: "Yes, Non-Resident Indians can open NRE or NRO Recurring Deposit accounts." }
  ];

  return (
    <div className="rd-page fade-in">
      {/* Hero Section */}
      <section className="rd-hero">
        <div className="container">
          <div className="rd-hero-content">
            <span className="rd-badge">Surya Bank Deposits</span>
            <h1 className="rd-hero-title">Build Your Future with Surya Bank Recurring Deposits</h1>
            <p className="rd-hero-subtitle">
              Save a fixed amount every month and achieve your financial goals with attractive interest rates and flexible tenures.
            </p>
            <div className="rd-hero-actions">
              <Button variant="primary" size="lg" className="mr-4">Open RD Account</Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById('rd-calculator').scrollIntoView({ behavior: 'smooth' })}>
                Calculate Returns
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="rd-about container py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">About Surya Bank RD</h2>
          <p className="section-desc">
            Surya Bank Recurring Deposits help customers develop disciplined savings habits by investing a fixed amount every month. The scheme offers attractive interest rates, flexible tenures, and absolutely guaranteed returns, completely shielded from market volatility.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="rd-features-grid">
          <Card className="rd-feature-card glass hover-lift">
            <div className="icon-wrapper bg-blue-100 dark:bg-blue-900/30">
              <HandCoins className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3>Deposit Limits</h3>
            <ul className="feature-list">
              <li><strong>Minimum:</strong> ₹100 per month</li>
              <li><strong>Maximum:</strong> No upper limit</li>
              <li><strong>Mode:</strong> Auto-debit available</li>
            </ul>
          </Card>
          
          <Card className="rd-feature-card glass hover-lift">
            <div className="icon-wrapper bg-amber-100 dark:bg-amber-900/30">
              <Clock className="text-amber-600 dark:text-amber-400" />
            </div>
            <h3>Deposit Tenure</h3>
            <ul className="feature-list">
              <li><strong>Minimum:</strong> 6 months</li>
              <li><strong>Maximum:</strong> 120 months</li>
              <li><strong>Lock-in:</strong> 6 months</li>
            </ul>
          </Card>

          <Card className="rd-feature-card glass hover-lift">
            <div className="icon-wrapper bg-green-100 dark:bg-green-900/30">
              <Percent className="text-green-600 dark:text-green-400" />
            </div>
            <h3>Interest Rates</h3>
            <ul className="feature-list">
              <li><strong>General:</strong> 6.00% – 7.50% p.a.</li>
              <li><strong>Senior Citizens:</strong> +0.50% extra</li>
              <li><strong>Compounding:</strong> Quarterly</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="rd-calculator" className="rd-calculator-section py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container">
          <h2 className="section-title text-center mb-10">RD Returns Calculator</h2>
          
          <div className="calculator-container glass-card">
            <div className="calc-controls">
              <div className="calc-group">
                <label>Monthly Deposit Amount (₹)</label>
                <div className="range-display">₹ {deposit.toLocaleString()}</div>
                <input 
                  type="range" 
                  min="500" max="100000" step="500" 
                  value={deposit} 
                  onChange={(e) => setDeposit(e.target.value)} 
                  className="calc-slider"
                />
              </div>

              <div className="calc-group">
                <label>Tenure (Months)</label>
                <div className="range-display">{tenure} Months</div>
                <input 
                  type="range" 
                  min="6" max="120" step="1" 
                  value={tenure} 
                  onChange={(e) => setTenure(e.target.value)} 
                  className="calc-slider"
                />
              </div>

              <div className="calc-group checkbox-group">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isSeniorCitizen} 
                    onChange={() => setIsSeniorCitizen(!isSeniorCitizen)}
                    className="mr-3 w-5 h-5 accent-surya-primary"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">I am a Senior Citizen (60+ years)</span>
                </label>
                <p className="text-xs text-surya-primary mt-1 ml-8">+0.50% additional interest rate applied</p>
              </div>
            </div>

            <div className="calc-results bg-gradient-blue text-white">
              <div className="result-icon-wrapper">
                <Calculator size={40} />
              </div>
              <h3 className="result-title">Estimated Returns</h3>
              
              <div className="result-data">
                <div className="data-row">
                  <span>Total Invested</span>
                  <strong>₹ {totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                </div>
                <div className="data-row">
                  <span>Interest Earned</span>
                  <strong>₹ {interestEarned.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                </div>
                <div className="data-row highlight">
                  <span>Maturity Amount</span>
                  <strong>₹ {maturityAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                </div>
              </div>
              <p className="calc-disclaimer">*The calculated amount is an approximate estimate and may vary slightly based on exact deposit dates and quarterly compounding cycles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scheme Options */}
      <section className="rd-schemes py-16 container">
        <h2 className="section-title text-center mb-12">Choose Your Perfect RD Plan</h2>
        <div className="schemes-grid">
          {schemeOptions.map((scheme, index) => (
            <Card key={index} className="scheme-card glass hover-scale">
              <div className="scheme-icon">{scheme.icon}</div>
              <h3 className="scheme-title">{scheme.title}</h3>
              <p className="scheme-desc">{scheme.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Guidelines & Benefits & Docs */}
      <section className="rd-info-section py-16 bg-white dark:bg-surya-surfaceDark">
        <div className="container">
          <div className="info-grid">
            {/* Benefits */}
            <div className="info-block">
              <h3 className="flex items-center text-xl font-bold mb-6 text-slate-800 dark:text-white">
                <TrendingUp className="mr-3 text-surya-primary" /> Key Benefits
              </h3>
              <ul className="custom-list">
                <li><CheckCircle size={18} /> Guaranteed returns & safe investment.</li>
                <li><CheckCircle size={18} /> Flexible monthly deposits & tenures.</li>
                <li><CheckCircle size={18} /> Attractive interest rates with auto-debit facility.</li>
                <li><CheckCircle size={18} /> Loan facility against deposits (up to 90%).</li>
                <li><CheckCircle size={18} /> Easy online account management.</li>
              </ul>
            </div>

            {/* Guidelines */}
            <div className="info-block">
              <h3 className="flex items-center text-xl font-bold mb-6 text-slate-800 dark:text-white">
                <AlertTriangle className="mr-3 text-amber-500" /> Important Guidelines
              </h3>
              <ul className="custom-list">
                <li><ArrowRight size={18} /> <strong>Lock-in Period:</strong> Minimum 6 months.</li>
                <li><ArrowRight size={18} /> <strong>Premature Closure:</strong> Allowed after lock-in; interest penalty applies.</li>
                <li><ArrowRight size={18} /> <strong>Missed Installments:</strong> Small penalty charges for delays.</li>
                <li><ArrowRight size={18} /> <strong>Nomination:</strong> Available for all RD accounts.</li>
                <li><ArrowRight size={18} /> <strong>Joint Accounts:</strong> Permitted with flexible operations.</li>
              </ul>
            </div>

            {/* Documents */}
            <div className="info-block md:col-span-2 lg:col-span-1">
              <h3 className="flex items-center text-xl font-bold mb-6 text-slate-800 dark:text-white">
                <FileText className="mr-3 text-green-500" /> Required Documents
              </h3>
              <div className="docs-split">
                <div className="doc-category mb-4">
                  <h4 className="font-semibold text-surya-primary mb-2">Resident Customers:</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Aadhaar Card, PAN Card, Passport-size photo, Address proof.</p>
                </div>
                <div className="doc-category">
                  <h4 className="font-semibold text-surya-primary mb-2">NRI Customers:</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Passport, Visa copy, Overseas address proof, PAN card (if applicable).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="rd-faq py-16 container max-w-4xl">
        <h2 className="section-title text-center mb-10">Frequently Asked Questions</h2>
        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <h4>{faq.q}</h4>
                <span className="faq-toggle">{activeFaq === index ? '-' : '+'}</span>
              </div>
              {activeFaq === index && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="rd-cta-section py-16">
        <div className="container">
          <Card className="cta-card text-center bg-gradient-to-r from-blue-900 to-surya-primary text-white border-none p-10">
            <h2 className="text-3xl font-bold mb-4 text-white">Start Saving Today with Surya Bank RD</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Secure your financial future with guaranteed returns. Open your Recurring Deposit account online in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" style={{ background: 'var(--primary-gold)', color: '#0f172a' }}>Open RD Account</Button>
              <Button variant="outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }} onClick={() => document.getElementById('rd-calculator').scrollIntoView({ behavior: 'smooth' })}>Calculate Returns</Button>
              <Button variant="outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }} onClick={() => window.location.href='/services'}>Contact Support</Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default RecurringDeposit;
