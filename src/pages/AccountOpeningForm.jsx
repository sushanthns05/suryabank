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

const AccountOpeningForm = () => {
  const printForm = () => {
    window.print();
  };

  return (
    <div className="account-form-page fade-in">
      <div className="aof-toolbar">
        <div>
          <p className="aof-kicker">Surya Bank Forms</p>
          <h1>Account Opening Application</h1>
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

      <main className="aof-sheet" aria-label="Surya Bank account opening form">
        <header className="aof-header">
          <div className="aof-brand">
            <img src="/logo.png" alt="Surya Bank" />
            <div>
              <strong>Surya Bank</strong>
              <span>Trusted Digital Banking</span>
            </div>
          </div>
          <div className="aof-title">
            <p>For branch use only</p>
            <h2>Savings / Current Account Opening Form</h2>
          </div>
          <div className="aof-photo-box">Paste recent photograph</div>
        </header>

        <div className="aof-branch-row">
          <Field label="Branch name" />
          <Field label="Application date" small />
          <Field label="Customer ID / CIF" small />
          <Field label="Account number" />
        </div>

        <Section number="1" title="Account Type and Services">
          <div className="aof-check-grid">
            <Check label="Savings Account" />
            <Check label="Current Account" />
            <Check label="Salary Account" />
            <Check label="Minor Account" />
            <Check label="Senior Citizen" />
            <Check label="Joint Account" />
          </div>
          <div className="aof-check-grid compact">
            <Check label="Debit Card" />
            <Check label="Cheque Book" />
            <Check label="Internet Banking" />
            <Check label="Mobile Banking" />
            <Check label="Email Statements" />
            <Check label="SMS Alerts" />
          </div>
        </Section>

        <Section number="2" title="Applicant Details">
          <div className="aof-grid">
            <Field label="Full name as per identity proof" wide />
            <Field label="Father / Mother / Spouse name" wide />
            <Field label="Date of birth" small />
            <Field label="Gender" small />
            <Field label="Marital status" small />
            <Field label="Nationality" small />
            <Field label="PAN number" small />
            <Field label="Aadhaar / VID number" />
            <Field label="Occupation" small />
            <Field label="Annual income" small />
          </div>
        </Section>

        <Section number="3" title="Contact and Address">
          <div className="aof-grid">
            <Field label="Mobile number" small />
            <Field label="Alternate phone" small />
            <Field label="Email address" />
            <Field label="Permanent address" wide />
            <Field label="City" small />
            <Field label="State" small />
            <Field label="PIN code" small />
            <Field label="Country" small />
            <Field label="Communication address, if different" wide />
          </div>
        </Section>

        <Section number="4" title="Joint Applicant / Guardian Details">
          <div className="aof-grid">
            <Field label="Name of joint applicant / guardian" wide />
            <Field label="Relationship with primary applicant" />
            <Field label="Date of birth" small />
            <Field label="PAN / identity number" />
            <Field label="Mobile number" small />
            <Field label="Email address" />
          </div>
        </Section>

        <Section number="5" title="KYC Documents Submitted">
          <div className="aof-check-grid documents">
            <Check label="PAN Card" />
            <Check label="Aadhaar Card" />
            <Check label="Passport" />
            <Check label="Voter ID" />
            <Check label="Driving Licence" />
            <Check label="NREGA Job Card" />
            <Check label="Utility Bill" />
            <Check label="Bank Statement" />
          </div>
          <div className="aof-grid">
            <Field label="Identity proof document number" />
            <Field label="Address proof document number" />
          </div>
        </Section>

        <Section number="6" title="Nomination Details">
          <div className="aof-check-grid compact">
            <Check label="I wish to nominate" />
            <Check label="I do not wish to nominate" />
          </div>
          <div className="aof-grid">
            <Field label="Nominee name" />
            <Field label="Relationship" small />
            <Field label="Nominee date of birth" small />
            <Field label="Nominee address" wide />
            <Field label="Guardian name, if nominee is minor" wide />
          </div>
        </Section>

        <Section number="7" title="Declaration">
          <p className="aof-declaration">
            I confirm that the information provided in this application is true and complete. I agree to follow
            Surya Bank's account rules, KYC requirements, digital banking terms, fees, charges, and applicable
            regulatory guidelines. I authorize Surya Bank to verify my details and contact me for account services.
          </p>
          <div className="aof-signature-row">
            <div>
              <span>Applicant signature</span>
            </div>
            <div>
              <span>Joint applicant / guardian signature</span>
            </div>
            <div>
              <span>Date</span>
            </div>
          </div>
        </Section>

        <Section number="8" title="Branch Checklist">
          <div className="aof-check-grid documents">
            <Check label="Photograph attached" />
            <Check label="Original documents verified" />
            <Check label="KYC completed" />
            <Check label="Risk category assigned" />
            <Check label="Initial deposit received" />
            <Check label="Welcome kit issued" />
          </div>
          <div className="aof-signature-row branch">
            <div>
              <span>Employee name and ID</span>
            </div>
            <div>
              <span>Authorized officer signature</span>
            </div>
            <div>
              <span>Branch seal</span>
            </div>
          </div>
        </Section>

        <footer className="aof-footer">
          <FileText size={16} />
          <span>Surya Bank account opening form. Please complete in BLOCK LETTERS using black or blue ink.</span>
        </footer>
      </main>
    </div>
  );
};

export default AccountOpeningForm;
