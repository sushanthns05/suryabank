import React from 'react';
import { Download, Printer, FileText } from 'lucide-react';
import './AccountOpeningForm.css';

const Field = ({ label, wide = false, small = false }) => (
  <div className={`aof-field ${wide ? 'wide' : ''} ${small ? 'small' : ''}`}>
    <span>{label}</span>
  </div>
);

const Check = ({ label }) => (
  <label className="aof-check">
    <span className="aof-box" aria-hidden="true"></span>
    <span>{label}</span>
  </label>
);

const Section = ({ number, title, children }) => (
  <section className="aof-section">
    <div className="aof-section-title">
      <span>{number}</span>
      <h2>{title}</h2>
    </div>
    {children}
  </section>
);

const AadhaarSeedingForm = () => {
  const printForm = () => {
    window.print();
  };

  return (
    <div className="account-form-page fade-in">
      <div className="aof-toolbar">
        <div>
          <p className="aof-kicker">Surya Bank Forms</p>
          <h1>Aadhaar Seeding Consent Letter</h1>
        </div>
        <div className="aof-actions">
          <button type="button" onClick={printForm} className="aof-action-btn">
            <Printer size={18} />
            Print
          </button>
          <button type="button" onClick={printForm} className="aof-action-btn primary">
            <Download size={18} />
            Save as PDF
          </button>
        </div>
      </div>

      <main className="aof-sheet" aria-label="Surya Bank Aadhaar seeding consent form">
        <header className="aof-header">
          <div className="aof-brand">
            <img src="/logo.png" alt="Surya Bank" />
            <div>
              <strong>Surya Bank</strong>
              <span>Trusted Digital Banking</span>
            </div>
          </div>
          <div className="aof-title">
            <p>Customer consent letter</p>
            <h2>Aadhaar Seeding / Linking Form</h2>
          </div>
          <div className="aof-photo-box">Paste recent photograph</div>
        </header>

        <div className="aof-branch-row">
          <Field label="Branch name" />
          <Field label="Application date" small />
          <Field label="Customer ID / CIF" small />
          <Field label="Account number" />
        </div>

        <Section number="1" title="Customer Details">
          <div className="aof-grid">
            <Field label="Full name as per bank records" wide />
            <Field label="Father / Mother / Spouse name" wide />
            <Field label="Date of birth" small />
            <Field label="Mobile number" small />
            <Field label="Email address" />
            <Field label="Address as per bank records" wide />
          </div>
        </Section>

        <Section number="2" title="Aadhaar Details">
          <div className="aof-grid">
            <Field label="Aadhaar number / VID" />
            <Field label="Name as printed on Aadhaar" />
            <Field label="Last 4 digits of Aadhaar" small />
            <Field label="Aadhaar linked mobile number" />
          </div>
          <div className="aof-check-grid compact">
            <Check label="Savings Account" />
            <Check label="Current Account" />
            <Check label="Joint Account" />
          </div>
        </Section>

        <Section number="3" title="Consent and Declaration">
          <p className="aof-declaration">
            I request and authorize Surya Bank to seed/link my Aadhaar number with my bank account mentioned
            above after branch verification. I confirm that the Aadhaar details provided by me are correct, and
            I understand that the linking will be completed only after the branch manager or authorized officer
            verifies my original Aadhaar card and submitted photocopies.
          </p>
          <p className="aof-declaration">
            I give my voluntary consent to Surya Bank to use my Aadhaar details for account seeding, identity
            verification, and banking services as permitted under applicable rules and bank policy.
          </p>
          <div className="aof-signature-row">
            <div>
              <span>Customer signature / thumb impression</span>
            </div>
            <div>
              <span>Place</span>
            </div>
            <div>
              <span>Date</span>
            </div>
          </div>
        </Section>

        <Section number="4" title="Documents to be Submitted">
          <div className="aof-check-grid documents">
            <Check label="Original Aadhaar card carried for verification" />
            <Check label="Two xerox copies of Aadhaar card attached" />
            <Check label="Account passbook / statement copy attached" />
            <Check label="Customer signature verified" />
          </div>
          <p className="aof-declaration">
            Note: Customer must carry the original Aadhaar card along with 2 xerox copies of the Aadhaar card
            while submitting this form at the branch.
          </p>
        </Section>

        <Section number="5" title="Branch Manager Verification">
          <div className="aof-check-grid documents">
            <Check label="Original Aadhaar verified" />
            <Check label="Photocopies received" />
            <Check label="Customer identity confirmed" />
            <Check label="Aadhaar linked after verification" />
          </div>
          <div className="aof-grid">
            <Field label="Verified by manager / authorized officer" />
            <Field label="Employee ID" small />
            <Field label="Verification date" small />
            <Field label="Aadhaar seeding reference number" />
          </div>
          <div className="aof-signature-row branch">
            <div>
              <span>Manager / authorized officer signature</span>
            </div>
            <div>
              <span>Branch seal</span>
            </div>
            <div>
              <span>Remarks</span>
            </div>
          </div>
        </Section>

        <footer className="aof-footer">
          <FileText size={16} />
          <span>Surya Bank Aadhaar seeding form. Please complete in BLOCK LETTERS using black or blue ink.</span>
        </footer>
      </main>
    </div>
  );
};

export default AadhaarSeedingForm;
