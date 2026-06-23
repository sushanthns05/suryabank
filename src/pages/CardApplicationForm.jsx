import React from 'react';
import { Download, Printer, FileText } from 'lucide-react';
import './AccountOpeningForm.css'; // Reusing the same CSS for consistent print styling

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

const CardApplicationForm = () => {
  const printForm = () => {
    window.print();
  };

  return (
    <div className="account-form-page fade-in">
      <div className="aof-toolbar">
        <div>
          <p className="aof-kicker">Surya Bank Forms</p>
          <h1>ATM / Debit / Credit Card Application</h1>
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

      <main className="aof-sheet" aria-label="Surya Bank card application form">
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
            <h2>Card Application Form</h2>
          </div>
          <div className="aof-photo-box">Paste recent photograph</div>
        </header>

        <div className="aof-branch-row">
          <Field label="Branch name" />
          <Field label="Application date" small />
          <Field label="Customer ID / CIF" small />
          <Field label="Account number (12 Digits)" />
        </div>

        <Section number="1" title="Card Type Requested">
          <div className="aof-check-grid">
            <Check label="ATM / Debit Card" />
            <Check label="Credit Card" />
            <Check label="Forex Card" />
            <Check label="Replacement Card (Lost/Stolen)" />
            <Check label="Renewal" />
            <Check label="Add-on Card" />
          </div>
        </Section>

        <Section number="2" title="Applicant Details">
          <div className="aof-grid">
            <Field label="Full name as per bank records" wide />
            <Field label="Name to be printed on Card (Max 20 chars)" wide />
            <Field label="Date of birth" small />
            <Field label="Gender" small />
            <Field label="PAN number" small />
            <Field label="Mobile number" small />
            <Field label="Email address" wide />
          </div>
        </Section>

        <Section number="3" title="Delivery Address">
          <div className="aof-grid">
            <Field label="Address Line 1" wide />
            <Field label="Address Line 2" wide />
            <Field label="City" small />
            <Field label="State" small />
            <Field label="PIN code" small />
            <Field label="Country" small />
          </div>
        </Section>

        <Section number="4" title="Add-on Card Applicant (Optional)">
          <div className="aof-grid">
            <Field label="Name of Add-on Applicant" wide />
            <Field label="Name to be printed on Card" />
            <Field label="Relationship with Primary Applicant" small />
            <Field label="Date of birth" small />
            <Field label="PAN number" small />
          </div>
        </Section>

        <Section number="5" title="Declaration">
          <p className="aof-declaration">
            I/We confirm that the information provided in this application is true and complete. I/We agree to abide by the
            terms and conditions governing the issuance and usage of the Surya Bank Card as may be amended from time to time.
            I/We authorize Surya Bank to verify my/our details and deduct the applicable issuance/annual fees from my/our account.
          </p>
          <div className="aof-signature-row">
            <div>
              <span>Primary Applicant Signature</span>
            </div>
            <div>
              <span>Add-on Applicant Signature (If applicable)</span>
            </div>
            <div>
              <span>Date</span>
            </div>
          </div>
        </Section>

        <Section number="6" title="Branch Checklist (For Bank Use Only)">
          <div className="aof-check-grid documents">
            <Check label="Signature verified" />
            <Check label="Account status active" />
            <Check label="KYC compliance checked" />
            <Check label="Charges recovered" />
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
          <span>Surya Bank card application form. Please complete in BLOCK LETTERS using black or blue ink.</span>
        </footer>
      </main>
    </div>
  );
};

export default CardApplicationForm;
