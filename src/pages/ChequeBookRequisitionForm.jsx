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

const ChequeBookRequisitionForm = () => {
  const printForm = () => {
    window.print();
  };

  return (
    <div className="account-form-page fade-in">
      <div className="aof-toolbar">
        <div>
          <p className="aof-kicker">Surya Bank Forms</p>
          <h1>Cheque Book Requisition Form</h1>
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

      <main className="aof-sheet" aria-label="Surya Bank cheque book requisition form">
        <header className="aof-header">
          <div className="aof-brand">
            <img src="/logo.png" alt="Surya Bank" />
            <div>
              <strong>Surya Bank</strong>
              <span>Trusted Digital Banking</span>
            </div>
          </div>
          <div className="aof-title">
            <p>For branch submission</p>
            <h2>Cheque Book Requisition Form</h2>
          </div>
          <div className="aof-photo-box">Branch stamp / request number</div>
        </header>

        <div className="aof-branch-row">
          <Field label="Branch name" />
          <Field label="Request date" small />
          <Field label="Customer ID / CIF" />
          <Field label="Request reference number" />
        </div>

        <Section number="1" title="Account Details">
          <div className="aof-grid">
            <Field label="Account number" />
            <Field label="Account holder name" />
            <Field label="Account type" small />
            <Field label="Mobile number" small />
            <Field label="Email address" />
            <Field label="Communication address as per bank records" wide />
          </div>
        </Section>

        <Section number="2" title="Cheque Book Request">
          <div className="aof-check-grid">
            <Check label="10 leaves" />
            <Check label="25 leaves" />
            <Check label="50 leaves" />
            <Check label="100 leaves" />
            <Check label="Personalized cheque book" />
            <Check label="Non-personalized cheque book" />
          </div>
          <div className="aof-grid">
            <Field label="Number of cheque books required" small />
            <Field label="Name to be printed on cheque book" />
            <Field label="Reason for request" />
            <Field label="Existing cheque book last cheque number, if any" />
          </div>
        </Section>

        <Section number="3" title="Delivery / Collection Preference">
          <div className="aof-check-grid compact">
            <Check label="Collect from branch" />
            <Check label="Send to registered address" />
            <Check label="Send to updated address after verification" />
          </div>
          <div className="aof-grid">
            <Field label="Delivery address, if different from bank records" wide />
            <Field label="Preferred collection date" small />
            <Field label="Authorized collector name, if applicable" />
            <Field label="Authorized collector mobile number" small />
          </div>
        </Section>

        <Section number="4" title="Customer Declaration">
          <p className="aof-declaration">
            I request Surya Bank to issue a cheque book for the account mentioned above. I confirm that the
            information provided in this requisition is correct and agree to follow the bank's cheque book usage,
            safety, charges, and account terms. I understand that the cheque book will be issued only after
            successful verification by the branch manager or authorized officer.
          </p>
          <div className="aof-signature-row">
            <div>
              <span>Account holder signature</span>
            </div>
            <div>
              <span>Joint account holder signature, if required</span>
            </div>
            <div>
              <span>Date</span>
            </div>
          </div>
        </Section>

        <Section number="5" title="Manager Verification / Bank Use Only">
          <div className="aof-check-grid documents">
            <Check label="Customer signature verified" />
            <Check label="Account status active" />
            <Check label="KYC compliance checked" />
            <Check label="Charges recovered, if applicable" />
            <Check label="Cheque book issued" />
            <Check label="Cheque book handed over / dispatched" />
          </div>
          <div className="aof-grid">
            <Field label="Verified by manager / authorized officer" />
            <Field label="Employee ID" small />
            <Field label="Verification date" small />
            <Field label="Cheque book serial number / leaf range" />
            <Field label="Dispatch / handover date" small />
            <Field label="Receiver name and ID proof, if collected by representative" />
            <Field label="Remarks" wide />
          </div>
          <div className="aof-signature-row branch">
            <div>
              <span>Manager / authorized officer signature</span>
            </div>
            <div>
              <span>Customer / receiver acknowledgment</span>
            </div>
            <div>
              <span>Branch seal</span>
            </div>
          </div>
        </Section>

        <footer className="aof-footer">
          <FileText size={16} />
          <span>Surya Bank cheque book requisition form. Please complete in BLOCK LETTERS and submit at your branch for verification.</span>
        </footer>
      </main>
    </div>
  );
};

export default ChequeBookRequisitionForm;
