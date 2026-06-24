import React from 'react';
import { Download, FileText, Printer } from 'lucide-react';
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

const InternetBankingPermissionForm = () => {
  const printForm = () => {
    window.print();
  };

  return (
    <div className="account-form-page fade-in">
      <div className="aof-toolbar">
        <div>
          <p className="aof-kicker">Surya Bank Forms</p>
          <h1>Internet Banking Permission Form</h1>
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

      <main className="aof-sheet" aria-label="Surya Bank internet banking permission form">
        <header className="aof-header">
          <div className="aof-brand">
            <img src="/logo.png" alt="Surya Bank" />
            <div>
              <strong>Surya Bank</strong>
              <span>Trusted Digital Banking</span>
            </div>
          </div>
          <div className="aof-title">
            <p>For offline branch submission</p>
            <h2>Internet / Mobile Banking Permission Form</h2>
          </div>
          <div className="aof-photo-box">Branch stamp / application number</div>
        </header>

        <div className="aof-branch-row">
          <Field label="Branch name" />
          <Field label="Application date" small />
          <Field label="Customer ID / CIF" />
          <Field label="Account number" />
        </div>

        <Section number="1" title="Customer / Applicant Details">
          <div className="aof-grid">
            <Field label="Full name as per bank records" wide />
            <Field label="Father / Mother / Spouse name" />
            <Field label="Date of birth" small />
            <Field label="PAN / Aadhaar last 4 digits" small />
            <Field label="Registered mobile number" small />
            <Field label="Email address" />
            <Field label="Communication address as per bank records" wide />
          </div>
        </Section>

        <Section number="2" title="Internet Banking Permission Requested">
          <div className="aof-check-grid">
            <Check label="New internet banking access" />
            <Check label="Mobile banking access" />
            <Check label="Reactivate blocked access" />
            <Check label="Reset login password" />
            <Check label="Reset transaction password / MPIN" />
            <Check label="Change registered mobile / email after verification" />
          </div>
          <div className="aof-grid">
            <Field label="Preferred user ID, if allowed" />
            <Field label="Account type" small />
            <Field label="Existing user ID, if any" />
            <Field label="Reason for request" wide />
          </div>
        </Section>

        <Section number="3" title="Facilities and Transaction Limits">
          <div className="aof-check-grid">
            <Check label="View only access" />
            <Check label="Fund transfer within own accounts" />
            <Check label="Third-party fund transfer" />
            <Check label="NEFT / RTGS / IMPS" />
            <Check label="Bill payment and recharge" />
            <Check label="Statement download and cheque services" />
          </div>
          <div className="aof-grid">
            <Field label="Daily fund transfer limit requested" />
            <Field label="Per transaction limit requested" />
            <Field label="Accounts to be enabled for internet banking" wide />
          </div>
        </Section>

        <Section number="4" title="Customer Declaration">
          <p className="aof-declaration">
            I request Surya Bank to enable internet banking and/or mobile banking for the account mentioned above.
            I confirm that the information provided by me is correct and that I will keep my user ID, passwords, OTP,
            MPIN, device credentials, and transaction credentials confidential. I understand that the facility will be
            activated only after verification and approval by the branch manager or authorized officer.
          </p>
          <p className="aof-declaration">
            I agree to use the digital banking facility only for lawful banking transactions and accept the bank's
            applicable digital banking terms, service rules, charges, transaction limits, and security requirements.
          </p>
          <div className="aof-signature-row">
            <div>
              <span>Customer signature / thumb impression</span>
            </div>
            <div>
              <span>Joint holder signature, if required</span>
            </div>
            <div>
              <span>Date</span>
            </div>
          </div>
        </Section>

        <Section number="5" title="Documents to be Submitted">
          <div className="aof-check-grid documents">
            <Check label="Original photo ID carried for verification" />
            <Check label="Self-attested ID proof copy attached" />
            <Check label="PAN / Aadhaar copy attached, if required" />
            <Check label="Passbook / statement copy attached" />
            <Check label="Registered mobile number verified" />
            <Check label="Customer signature verified" />
            <Check label="Joint mandate / authorization attached, if applicable" />
            <Check label="Board resolution / mandate attached for business accounts" />
          </div>
        </Section>

        <Section number="6" title="Manager Approval / Bank Use Only">
          <div className="aof-check-grid documents">
            <Check label="KYC status checked" />
            <Check label="Account status active" />
            <Check label="Risk category reviewed" />
            <Check label="Mobile and email verified" />
            <Check label="Internet banking approved" />
            <Check label="Internet banking rejected" />
            <Check label="Credentials issued / dispatched" />
            <Check label="Customer informed" />
          </div>
          <div className="aof-grid">
            <Field label="Approved / rejected by manager or authorized officer" />
            <Field label="Employee ID" small />
            <Field label="Approval date" small />
            <Field label="Internet banking reference number" />
            <Field label="Approved daily transfer limit" />
            <Field label="Remarks" wide />
          </div>
          <div className="aof-signature-row branch">
            <div>
              <span>Manager / authorized officer signature</span>
            </div>
            <div>
              <span>Operations / maker-checker verification</span>
            </div>
            <div>
              <span>Branch seal</span>
            </div>
          </div>
        </Section>

        <footer className="aof-footer">
          <FileText size={16} />
          <span>Surya Bank internet banking permission form. Fill in BLOCK LETTERS and submit offline at your branch.</span>
        </footer>
      </main>
    </div>
  );
};

export default InternetBankingPermissionForm;
