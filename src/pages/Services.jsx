import React, { useState } from 'react';
import { CreditCard, Shield, TrendingUp, Briefcase, HeartPulse, Landmark, Calendar, User, Mail, MessageSquare, X, CheckCircle, RefreshCw, FileText, AlertCircle } from 'lucide-react';
import { createConsultation, createCardApplication } from '../services/api';
import { sendConsultationEmail } from '../utils/emailService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Services.css';

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', date: '', topic: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Card Application State
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardFormData, setCardFormData] = useState({
    accountNumber: '',
    cardType: 'Debit Card',
    nameOnCard: '',
    deliveryAddress: ''
  });
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);
  const [cardStatus, setCardStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookConsultation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await createConsultation({
        ...formData,
      });

      await sendConsultationEmail(formData.email, formData.name, formData.topic, formData.date, 'Pending');

      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setFormData({ name: '', email: '', date: '', topic: '' });
      }, 3000);
    } catch (error) {
      console.error("Error booking consultation:", error);
      alert("Failed to book consultation. Please ensure the backend server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardInputChange = (e) => {
    setCardFormData({ ...cardFormData, [e.target.name]: e.target.value });
    setCardStatus({ type: '', message: '' });
  };

  const handleApplyCard = async (e) => {
    e.preventDefault();
    if (!cardFormData.accountNumber || !cardFormData.nameOnCard || !cardFormData.deliveryAddress) {
      setCardStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setIsSubmittingCard(true);
    setCardStatus({ type: '', message: '' });

    try {
      const appData = {
        userId: 'guest',
        accountNumber: cardFormData.accountNumber,
        customerName: cardFormData.nameOnCard,
        email: 'N/A (Guest from Services)',
        cardType: cardFormData.cardType,
        nameOnCard: cardFormData.nameOnCard,
        deliveryAddress: cardFormData.deliveryAddress
      };
      
      const res = await createCardApplication(appData);
      if (res.success) {
        setCardStatus({ type: 'success', message: 'Card application submitted successfully! It is pending branch approval.' });
        setTimeout(() => {
          setIsCardModalOpen(false);
          setCardStatus({ type: '', message: '' });
          setCardFormData({ accountNumber: '', cardType: 'Debit Card', nameOnCard: '', deliveryAddress: '' });
        }, 3000);
      } else {
        setCardStatus({ type: 'error', message: res.message || 'Failed to submit application.' });
      }
    } catch (err) {
      setCardStatus({ type: 'error', message: err.message || 'An error occurred.' });
    } finally {
      setIsSubmittingCard(false);
    }
  };

  const servicesList = [
    {
      title: "Digital Banking",
      description: "Experience seamless banking 24/7. Transfer funds instantly, pay bills, and manage your accounts from anywhere in the world using our award-winning mobile app and internet banking platform.",
      icon: <Landmark size={40} className="service-icon" />,
      linkText: "Explore Digital Banking"
    },
    {
      title: "Surya Cards (Credit & Debit)",
      description: "Unlock exclusive rewards, airport lounge access, and zero liability protection with Surya Premium Cards. Choose from a wide range of lifestyle, travel, and cashback cards tailored for you.",
      icon: <CreditCard size={40} className="service-icon" />,
      linkText: "Apply for Card",
      action: () => setIsCardModalOpen(true)
    },
    {
      title: "SB Wealth Management & Mutual Funds",
      description: "Grow your wealth with our expert advisory services. Access premium SB Mutual Funds, customized portfolio management, and secure high-yield fixed deposits.",
      icon: <TrendingUp size={40} className="service-icon" />,
      linkText: "Start Investing"
    },
    {
      title: "SB Life Insurance",
      description: "Secure your family's future with comprehensive life cover. We offer term plans, endowment plans, and child education plans designed to provide financial stability when it matters most.",
      icon: <HeartPulse size={40} className="service-icon" />,
      linkText: "View Life Plans"
    },
    {
      title: "SB General Insurance",
      description: "Protect your valuable assets. From comprehensive motor insurance to home and health insurance policies, we provide fast claims processing and complete peace of mind.",
      icon: <Shield size={40} className="service-icon" />,
      linkText: "Get a Quote"
    },
    {
      title: "Corporate & Business Banking",
      description: "Scale your enterprise with our dedicated business solutions. Access working capital loans, trade finance, merchant services, and dedicated relationship managers.",
      icon: <Briefcase size={40} className="service-icon" />,
      linkText: "Business Solutions"
    }
  ];

  return (
    <div className="services-page fade-in">
      <div className="services-hero">
        <div className="container text-center">
          <h1 className="services-title">Premium Financial Services</h1>
          <p className="services-subtitle">Tailored solutions for your personal and business banking needs, backed by 200 years of trust.</p>
        </div>
      </div>
      
      <div className="container services-content">
        <div className="services-grid">
          {servicesList.map((service, index) => (
            <Card hover key={index} className="service-card glass">
              <div className="service-icon-wrapper">
                {service.icon}
              </div>
              <h2 className="service-card-title">{service.title}</h2>
              <p className="service-card-desc">{service.description}</p>
              <div className="service-card-action">
                <Button variant="outline" className="w-full" onClick={service.action ? service.action : undefined}>{service.linkText}</Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="services-cta mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card glass className="text-center p-5 flex flex-col h-full justify-between">
            <div>
              <h2 style={{ color: 'var(--primary-gold)', marginBottom: '15px' }}>Not sure where to start?</h2>
              <p style={{ color: '#cbd5e1', marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px auto' }}>
                Speak with one of our certified financial advisors today to find the perfect banking products for your unique lifestyle and goals.
              </p>
            </div>
            <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>Book a Consultation</Button>
          </Card>
          
          <Card glass className="text-center p-5 flex flex-col h-full justify-between border border-[var(--primary-blue)] shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa', padding: '12px', borderRadius: '50%', marginBottom: '15px' }}>
                <FileText size={24} />
              </div>
              <h2 style={{ color: '#fff', marginBottom: '15px' }}>Open an Account Offline</h2>
              <p style={{ color: '#cbd5e1', marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px auto' }}>
                Prefer traditional banking? Download our account opening form, fill it at your convenience, and submit it at your nearest branch.
              </p>
            </div>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/offline-account-opening'}>Get Offline Form</Button>
          </Card>

          <Card glass className="text-center p-5 flex flex-col h-full justify-between border border-[var(--primary-gold)] shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(234, 179, 8, 0.2)', color: 'var(--primary-gold)', padding: '12px', borderRadius: '50%', marginBottom: '15px' }}>
                <CreditCard size={24} />
              </div>
              <h2 style={{ color: '#fff', marginBottom: '15px' }}>Apply for Card Offline</h2>
              <p style={{ color: '#cbd5e1', marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px auto' }}>
                Download our card application form, fill in your details, and submit it directly to your nearest branch.
              </p>
            </div>
            <Button variant="outline" size="lg" onClick={() => window.open('/card-application-form', '_blank')}>Download Card Form</Button>
          </Card>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-content glass" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '16px', maxWidth: '500px', width: '100%', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={64} color="#22c55e" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ marginBottom: '10px', color: '#fff' }}>Request Submitted!</h3>
                <p style={{ color: '#cbd5e1' }}>An advisor will review your request and contact you shortly.</p>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: '5px', fontSize: '1.5rem', color: '#fff' }}>Book a Consultation</h3>
                <p style={{ color: '#cbd5e1', marginBottom: '25px', fontSize: '0.95rem' }}>Fill out the details below and we'll connect you with a specialist.</p>
                
                <form onSubmit={handleBookConsultation} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-group" style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group" style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>Preferred Date</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                      <input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required 
                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ textAlign: 'left', marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>Topic of Interest</label>
                    <div style={{ position: 'relative' }}>
                      <MessageSquare size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                      <select 
                        name="topic" 
                        value={formData.topic}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', appearance: 'none' }}
                      >
                        <option value="" disabled>Select a topic...</option>
                        <option value="Wealth Management">Wealth Management</option>
                        <option value="Business Loans">Business Loans</option>
                        <option value="Life Insurance">Life Insurance</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <Button variant="primary" type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <RefreshCw className="spin" size={20} /> : 'Submit Request'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {isCardModalOpen && (
        <div className="modal-overlay fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-content glass" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '16px', maxWidth: '500px', width: '100%', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button 
              onClick={() => setIsCardModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <h3 style={{ marginBottom: '5px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <CreditCard size={24} style={{ color: 'var(--primary-gold)' }} /> Apply for Card
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '25px', fontSize: '0.95rem' }}>Fill in the details for your new card application.</p>
            
            <form onSubmit={handleApplyCard} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>Account Number (12 Digits)</label>
                <input 
                  type="text" 
                  name="accountNumber"
                  value={cardFormData.accountNumber}
                  onChange={handleCardInputChange}
                  required
                  placeholder="e.g. 123456789012"
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }}
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>Card Type</label>
                <select 
                  name="cardType" 
                  value={cardFormData.cardType}
                  onChange={handleCardInputChange}
                  required
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }}
                >
                  <option value="Debit Card">ATM/Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Forex Card">Forex Card</option>
                </select>
              </div>
              
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>Name on Card</label>
                <input 
                  type="text" 
                  name="nameOnCard"
                  value={cardFormData.nameOnCard}
                  onChange={handleCardInputChange}
                  required 
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', textTransform: 'uppercase' }}
                  placeholder="NAME ON CARD"
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left', marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>Delivery Address</label>
                <textarea 
                  name="deliveryAddress"
                  value={cardFormData.deliveryAddress}
                  onChange={handleCardInputChange}
                  required 
                  rows="3"
                  style={{ width: '100%', padding: '10px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', resize: 'none' }}
                  placeholder="Full Delivery Address"
                />
              </div>

              {cardStatus.message && (
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  backgroundColor: cardStatus.type === 'success' ? '#dcfce7' : '#fef2f2',
                  color: cardStatus.type === 'success' ? '#166534' : '#ef4444',
                  fontSize: '0.9rem'
                }}>
                  {cardStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {cardStatus.message}
                </div>
              )}

              <Button variant="primary" type="submit" className="w-full" disabled={isSubmittingCard}>
                {isSubmittingCard ? <RefreshCw className="spin" size={20} /> : 'Submit Application'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
