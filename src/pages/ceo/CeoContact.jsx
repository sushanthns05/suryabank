import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const CeoContact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Full name is required.";
    
    if (!email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please specify a valid email format.";
    }

    if (!subject.trim()) tempErrors.subject = "Subject line is required.";
    if (!message.trim()) tempErrors.message = "Message content cannot be blank.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Save feedback directly to Firestore collections 'ceo_feedback'
      await addDoc(collection(db, 'ceo_feedback'), {
        name,
        email,
        subject,
        message,
        date: new Date().toISOString(),
        status: 'pending'
      });

      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setErrors({});
    } catch (err) {
      console.error("Firestore submission failed:", err);
      alert("Feedback saving failed. Please check network connections.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Correspondence</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">Contact Office</h1>
        <p className="text-xs text-slate-400">Direct inquiries, feedback submissions, and scheduled appointments coordination to the Office of the CEO.</p>
      </div>

      {/* Main Grid: Form & Info */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xl font-serif text-white font-bold">Office Information</h2>
          
          {/* Info blocks */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-805 flex items-start gap-4 shadow-md">
              <div className="p-2 rounded-xl bg-ceo-gold/10 text-ceo-gold shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white">HQ Location</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Level 42, Surya Financial Center, Outer Ring Road, Bengaluru, KA, 560103.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-805 flex items-start gap-4 shadow-md">
              <div className="p-2 rounded-xl bg-ceo-gold/10 text-ceo-gold shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white">Direct Line</h4>
                <p className="text-xs text-slate-400 mt-1">
                  +91 (22) 555-0142
                </p>
                <span className="block text-[10px] text-slate-500 mt-0.5">Mon - Fri, 9:00 AM - 5:00 PM IST</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-805 flex items-start gap-4 shadow-md">
              <div className="p-2 rounded-xl bg-ceo-gold/10 text-ceo-gold shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white">Electronic Mail</h4>
                <p className="text-xs text-slate-400 mt-1">
                  <a href="mailto:ceo.office@suryabank.com" className="hover:text-ceo-gold underline">ceo.office@suryabank.com</a>
                </p>
              </div>
            </div>
          </div>

          {/* Interactive coordinates map placeholder */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-855 text-center space-y-3">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Surya Tower Coordination</span>
            <div className="aspect-[4/3] w-full bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
              {/* Radar Sweeper Visual Art */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="w-24 h-24 rounded-full border border-ceo-gold/20 flex items-center justify-center animate-pulse">
                <div className="w-12 h-12 rounded-full bg-ceo-gold/10 flex items-center justify-center text-ceo-gold">
                  <MapPin size={16} />
                </div>
              </div>
              <span className="absolute bottom-2 text-[9px] text-slate-400">HQ Coordinate: Lat 19.076, Lon 72.877</span>
            </div>
          </div>

        </div>

        {/* Validated Feedback Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-805 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl font-serif text-white font-bold mb-4">Direct Message</h2>
          
          {submitSuccess ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="mx-auto text-emerald-400" size={48} />
              <h3 className="text-lg font-semibold text-white">Correspondence Submitted</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you. Your message has been cryptographically logged and stored in the Surya Bank administrative databases. Our team will contact you shortly.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="px-5 py-2.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-ceo-gold/60 focus:ring-0 text-white"
                  />
                  {errors.name && <span className="text-[10px] text-rose-400 block mt-0.5">{errors.name}</span>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-ceo-gold/60 focus:ring-0 text-white"
                  />
                  {errors.email && <span className="text-[10px] text-rose-400 block mt-0.5">{errors.email}</span>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Strategic Partnership Proposal"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-ceo-gold/60 focus:ring-0 text-white"
                />
                {errors.subject && <span className="text-[10px] text-rose-400 block mt-0.5">{errors.subject}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">Message Body</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline the parameters of your inquiry here..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-ceo-gold/60 focus:ring-0 text-white resize-none"
                />
                {errors.message && <span className="text-[10px] text-rose-400 block mt-0.5">{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2 mt-2 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} /> Submitting Security Logging...
                  </>
                ) : (
                  <>
                    <Send size={14} /> Send Authorized Message
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </section>

    </div>
  );
};

export default CeoContact;
