import React from 'react';
import { Download, Printer, FileText } from 'lucide-react';
import './AccountOpeningForm.css';

const Field = ({ label, wide = false, small = false }) => (
  <div className={`aof-field ${wide ? 'wide' : ''} ${small ? 'small' : ''}`}>
    <span>{label}</span>
  </div>
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

const denominations = ['2000', '500', '200', '100', '50', '20', '10', 'Coins'];

const DepositPayInSlip = () => {
  const printForm = () => {
    window.print();
  };

  return (
    <div className="account-form-page fade-in">
      <div className="aof-toolbar">
        <div>
          <p className="aof-kicker">Surya Bank Forms</p>
          <h1>Cash Deposit Pay-In Slip</h1>
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

      <main className="aof-sheet" aria-label="Surya Bank cash deposit pay-in slip">
        <header className="aof-header">
          <div className="aof-brand">
            <img src="/logo.png" alt="Surya Bank" />
            <div>
              <strong>Surya Bank</strong>
              <span>Trusted Digital Banking</span>
            </div>
          </div>
          <div className="aof-title">
            <p>For cash deposit at branch</p>
            <h2>Deposit Pay-In Slip</h2>
          </div>
          <div className="aof-photo-box">Branch stamp / scroll number</div>
        </header>

        <div className="aof-branch-row">
          <Field label="Branch name" />
          <Field label="Date" small />
          <Field label="Transaction / scroll number" />
          <Field label="Time" small />
        </div>

        <Section number="1" title="Account Details">
          <div className="aof-grid">
            <Field label="Account number" />
            <Field label="Account holder name" />
            <Field label="Account type" small />
            <Field label="Mobile number" small />
            <Field label="Amount in figures" />
            <Field label="Amount in words" wide />
          </div>
        </Section>

        <Section number="2" title="Depositor Details">
          <div className="aof-grid">
            <Field label="Depositor name" />
            <Field label="Depositor mobile number" small />
            <Field label="PAN / ID number, if required" />
            <Field label="Relationship with account holder" small />
            <Field label="Depositor address" wide />
          </div>
        </Section>

        <Section number="3" title="Cash Denomination Details">
          <table className="aof-table denomination-table">
            <thead>
              <tr>
                <th>Denomination</th>
                <th>No. of notes / coins</th>
                <th>Amount</th>
                <th>Denomination</th>
                <th>No. of notes / coins</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {denominations.slice(0, 4).map((denomination, index) => (
                <tr key={denomination}>
                  <td>Rs. {denomination}</td>
                  <td></td>
                  <td></td>
                  <td>{denominations[index + 4] === 'Coins' ? 'Coins' : `Rs. ${denominations[index + 4]}`}</td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
              <tr>
                <td colSpan="2">Total cash amount</td>
                <td></td>
                <td colSpan="2">Total number of notes / coins</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section number="4" title="Customer Declaration">
          <p className="aof-declaration">
            I confirm that the account number, account holder name, deposit amount, and cash denomination details
            written above are correct. I am submitting this slip with the cash amount to Surya Bank branch for
            deposit into the account mentioned above.
          </p>
          <div className="aof-signature-row">
            <div>
              <span>Depositor signature</span>
            </div>
            <div>
              <span>Account holder signature, if required</span>
            </div>
            <div>
              <span>Date</span>
            </div>
          </div>
        </Section>

        <Section number="5" title="Branch Acknowledgment / Bank Use Only">
          <div className="aof-grid">
            <Field label="Cash received by" />
            <Field label="Employee ID" small />
            <Field label="Verified by cashier / officer" />
            <Field label="Posting date" small />
            <Field label="Transaction ID" />
            <Field label="Amount credited" />
            <Field label="Remarks" wide />
          </div>
          <div className="aof-signature-row branch">
            <div>
              <span>Cashier signature</span>
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
          <span>Surya Bank deposit pay-in slip. Please complete in BLOCK LETTERS and submit this slip with cash at the branch counter.</span>
        </footer>
      </main>
    </div>
  );
};

export default DepositPayInSlip;
