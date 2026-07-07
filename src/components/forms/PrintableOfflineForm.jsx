import React from 'react';

const PrintableOfflineForm = ({ data }) => {
  return (
    <div className="w-full bg-white text-black text-[11px] leading-tight font-sans">
      <style>{`
        @page { size: A4; margin: 10mm; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break { page-break-before: always; }
        }
        .box-grid { display: flex; flex-wrap: wrap; gap: 2px; }
        .box { width: 14px; height: 14px; border: 1px solid #000; text-align: center; text-transform: uppercase; font-weight: bold; line-height: 12px; }
        .field-row { display: flex; align-items: center; border-bottom: 1px solid #000; padding: 2px 0; }
        .field-label { width: 160px; font-weight: bold; }
        .field-value { flex-grow: 1; padding-left: 8px; font-weight: bold; text-transform: uppercase; }
        .section-title { background: #000; color: #fff; font-weight: bold; padding: 2px 6px; margin: 6px 0 4px 0; text-transform: uppercase; font-size: 11px; }
        .checkbox-box { width: 10px; height: 10px; border: 1px solid #000; display: inline-flex; align-items: center; justify-content: center; margin-right: 4px; }
        .checked::after { content: '✓'; font-weight: bold; font-size: 9px; }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-start mb-2 border-b-2 border-black pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded border-2 border-black flex items-center justify-center font-bold text-lg">S</div>
            <h1 className="font-serif font-bold text-2xl tracking-wide">Surya Bank</h1>
          </div>
          <h2 className="font-bold text-lg">ACCOUNT OPENING FORM FOR INDIVIDUALS</h2>
          <p>Please fill the form in BLOCK LETTERS and tick (✓) where applicable.</p>
        </div>
        <div className="text-right flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">Date:</span>
            <div className="flex gap-1">
              {[...Array(8)].map((_, i) => <div key={i} className="box"></div>)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Branch Code:</span>
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => <div key={i} className="box"></div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-grow">
          <div className="section-title">1. Type of Account</div>
          <div className="flex gap-6 mb-4">
            {['Savings', 'Current', 'Salary', 'Minor', 'NRI'].map(type => (
              <label key={type} className="flex items-center">
                <div className={`checkbox-box ${data.accountType === type.toLowerCase() ? 'checked' : ''}`}></div>
                {type}
              </label>
            ))}
          </div>

          <div className="section-title">2. Personal Details</div>
          <div className="field-row">
            <div className="field-label">Full Name</div>
            <div className="field-value">{data.fullName}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Father / Spouse Name</div>
            <div className="field-value">{data.fatherName}</div>
          </div>
          <div className="flex border-bottom">
            <div className="field-row flex-1 border-r border-black pr-4">
              <div className="field-label w-auto mr-4">Date of Birth</div>
              <div className="field-value">{data.dob}</div>
            </div>
            <div className="field-row flex-1 pl-4">
              <div className="field-label w-auto mr-4">Gender</div>
              <div className="field-value">{data.gender}</div>
            </div>
          </div>
          <div className="flex border-bottom">
            <div className="field-row flex-1 border-r border-black pr-4">
              <div className="field-label w-auto mr-4">Marital Status</div>
              <div className="field-value">{data.maritalStatus}</div>
            </div>
            <div className="field-row flex-1 pl-4">
              <div className="field-label w-auto mr-4">Nationality</div>
              <div className="field-value">{data.nationality}</div>
            </div>
          </div>
          <div className="field-row">
            <div className="field-label">PAN Number</div>
            <div className="field-value tracking-[4px]">{data.pan}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Aadhaar Number</div>
            <div className="field-value tracking-[4px]">{data.aadhaar}</div>
          </div>
        </div>

        {/* Photo Box */}
        <div className="w-28 flex-shrink-0 flex flex-col items-center">
          <div className="w-28 h-32 border-2 border-black flex items-center justify-center text-center p-2 mb-1">
            <span className="text-gray-500 font-medium text-[9px]">Please paste recent passport size photograph here</span>
          </div>
          <div className="text-[8px] text-center font-bold">Signature / Thumb Impression across photograph</div>
        </div>
      </div>

      <div className="section-title">3. Contact & Address Details</div>
      <div className="flex border-bottom">
        <div className="field-row flex-1 border-r border-black pr-4">
          <div className="field-label w-32">Mobile Number</div>
          <div className="field-value">{data.mobile}</div>
        </div>
        <div className="field-row flex-1 pl-4">
          <div className="field-label w-32">Email ID</div>
          <div className="field-value lowercase" style={{ textTransform: 'lowercase' }}>{data.email}</div>
        </div>
      </div>
      <div className="field-row">
        <div className="field-label">Permanent Address</div>
        <div className="field-value">{data.permanentAddress}</div>
      </div>
      <div className="flex border-bottom">
        <div className="field-row flex-1 border-r border-black pr-4">
          <div className="field-label w-auto mr-4">City</div>
          <div className="field-value">{data.city}</div>
        </div>
        <div className="field-row flex-1 pl-4">
          <div className="field-label w-auto mr-4">State & PIN</div>
          <div className="field-value">{data.state} - {data.pincode}</div>
        </div>
      </div>

      <div className="section-title">4. Income & Occupation</div>
      <div className="flex border-bottom">
        <div className="field-row flex-1 border-r border-black pr-4">
          <div className="field-label w-auto mr-4">Occupation</div>
          <div className="field-value">{data.occupation}</div>
        </div>
        <div className="field-row flex-1 pl-4">
          <div className="field-label w-auto mr-4">Annual Income</div>
          <div className="field-value">{data.annualIncome}</div>
        </div>
      </div>

      <div className="section-title">5. Services Required</div>
      <div className="flex gap-8 mb-2 border-b border-black pb-2">
        <label className="flex items-center"><div className={`checkbox-box ${data.services?.debitCard ? 'checked' : ''}`}></div> Debit Card</label>
        <label className="flex items-center"><div className={`checkbox-box ${data.services?.smsAlerts ? 'checked' : ''}`}></div> SMS Alerts</label>
        <label className="flex items-center"><div className={`checkbox-box ${data.services?.internetBanking ? 'checked' : ''}`}></div> Internet Banking</label>
        <label className="flex items-center"><div className="checkbox-box"></div> Cheque Book</label>
      </div>

      <div className="section-title">6. Nomination (Form DA1)</div>
      <div className="mb-2 text-justify">
        I/We nominate the following person to whom in the event of my/our/minor's death the amount of deposit in the above account may be returned by Surya Bank.
      </div>
      <div className="field-row">
        <div className="field-label">Nominee Name</div>
        <div className="field-value">{data.nomineeName}</div>
      </div>
      <div className="flex border-bottom">
        <div className="field-row flex-1 border-r border-black pr-4">
          <div className="field-label w-auto mr-4">Relationship</div>
          <div className="field-value">{data.nomineeRelation}</div>
        </div>
        <div className="field-row flex-1 pl-4">
          <div className="field-label w-auto mr-4">Nominee DOB</div>
          <div className="field-value">{data.nomineeDob}</div>
        </div>
      </div>
      <div className="field-row">
        <div className="field-label">Nominee Address</div>
        <div className="field-value">{data.nomineeAddress}</div>
      </div>

      <div className="section-title">7. Declarations & Signatures</div>
      <div className="text-justify mb-2 leading-tight text-[10px]">
        I/We hereby declare that the particulars given above are true, correct and complete to the best of my/our knowledge and belief. I/We have read, understood and agree to the Terms and Conditions governing the Account Opening and operations. I/We authorize Surya Bank to verify my/our Aadhaar, PAN and other details via KYC authorities. I/We understand that the Bank may at its absolute discretion, discontinue any of the services completely or partially without any notice to me/us.
      </div>
      <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-2">
        <div>
          <div className="font-bold mb-4">Date: __ / __ / 20__</div>
          <div className="font-bold">Place: __________________</div>
        </div>
        <div className="text-center w-56">
          <div className="w-full h-16 border border-black mb-1 flex items-center justify-center">
            <span className="text-gray-400 text-[10px]">Primary Signature inside box</span>
          </div>
          <div className="font-bold text-[10px]">Signature / Thumb Impression of Applicant</div>
        </div>
      </div>

      {/* For Office Use Only */}
      <div className="section-title !bg-gray-300 !text-black border border-black">FOR OFFICE USE ONLY</div>
      <div className="border border-black p-4 grid grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <label className="flex items-center mb-2"><div className="checkbox-box"></div> KYC Documents Verified with Originals</label>
            <label className="flex items-center mb-2"><div className="checkbox-box"></div> Applicant signed in my presence</label>
            <label className="flex items-center"><div className="checkbox-box"></div> In-Person Verification (IPV) done</label>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold">Customer ID created:</span>
            <div className="flex-grow border-b border-black"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Account Number:</span>
            <div className="flex-grow border-b border-black"></div>
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <div className="flex gap-4">
            <div className="flex-1 text-center">
              <div className="border-b border-black h-12 mb-2"></div>
              <div>Maker (Name & Sign)</div>
              <div>Emp ID:</div>
            </div>
            <div className="flex-1 text-center">
              <div className="border-b border-black h-12 mb-2"></div>
              <div>Checker (Name & Sign)</div>
              <div>Emp ID:</div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2: Rules and Regulations */}
      <div className="page-break"></div>
      
      <div className="pt-4">
        <h2 className="text-lg font-bold text-center mb-4 uppercase border-b-2 border-black pb-2">Rules and Regulations / Terms and Conditions</h2>
        
        <div className="space-y-4 text-[10px] leading-relaxed text-justify columns-2 gap-8">
          <div>
            <h3 className="font-bold mb-1">1. Minimum Balance Requirement</h3>
            <p>Customers are required to maintain a Minimum Average Quarterly Balance (AQB) as prescribed by the Bank from time to time. Failure to maintain the AQB will attract penal charges as per the prevailing tariff schedule. The Bank reserves the right to close accounts with zero balance extending beyond 6 months.</p>
          </div>
          
          <div>
            <h3 className="font-bold mb-1">2. Transaction Limits & Charges</h3>
            <p>Free cash withdrawal limits and ATM transaction limits apply as per the account variant chosen. Transactions beyond the stipulated limits will be subject to nominal convenience fees. Cross-currency markups and international ATM fees will be levied strictly per regulatory guidelines.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">3. KYC Compliance & Updates</h3>
            <p>Under the Prevention of Money Laundering Act (PMLA), customers must periodically update their Know Your Customer (KYC) documents. The Bank may freeze or suspend accounts if updated KYC documents are not submitted within the requested timeframe.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">4. Debit Card Usage & Security</h3>
            <p>The Debit Card remains the property of Surya Bank and must be surrendered upon request. The customer is solely responsible for maintaining the secrecy of their PIN. The Bank is not liable for unauthorized transactions resulting from compromised credentials.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">5. Cheque Book Issuance</h3>
            <p>Cheque books will be issued subject to satisfactory operation of the account. The Bank reserves the right to refuse the issuance of a cheque book if frequent cheque bounces or irregularities are observed. Stop-payment requests must be accompanied by written instructions.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">6. Digital & Internet Banking</h3>
            <p>Access to Internet Banking and Mobile Banking is granted subject to acceptance of separate digital banking terms. Customers must not share OTPs, Passwords, or Secure PINs with anyone, including Bank staff. The Bank will never ask for these details via phone or email.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">7. Account Closure & Dormancy</h3>
            <p>Accounts with no customer-induced transactions for 12 months will be classified as 'Inactive', and after 24 months as 'Dormant'. Activation of a dormant account requires fresh KYC documentation. Account closure requests must be submitted in writing with the surrender of the Debit Card and unused cheques.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">8. Dispute Resolution & Jurisdiction</h3>
            <p>Any disputes arising from the operation of the account shall be subject to the exclusive jurisdiction of the competent courts in the city of the account-holding branch. Customers may approach the Banking Ombudsman for unresolved grievances as per RBI guidelines.</p>
          </div>
        </div>
        
        <div className="mt-12 border border-black p-4 text-center font-bold uppercase">
          I have read and understood all the rules and regulations governing the account and agree to abide by them.
        </div>
        
        <div className="mt-16 flex justify-between px-8">
          <div className="text-center">
            <div className="w-48 border-t border-black pt-2 font-bold">Signature of Primary Applicant</div>
          </div>
          <div className="text-center">
            <div className="w-48 border-t border-black pt-2 font-bold">Signature of Joint Applicant</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PrintableOfflineForm;
