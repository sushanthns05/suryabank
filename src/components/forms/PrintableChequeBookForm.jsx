import React from 'react';

const PrintableChequeBookForm = ({ data }) => {
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
          <h2 className="font-bold text-lg">CHEQUE BOOK REQUISITION FORM</h2>
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

      <div className="section-title">1. Customer & Account Details</div>
      <div className="field-row">
        <div className="field-label">Customer Name</div>
        <div className="field-value">{data.customerName}</div>
      </div>
      <div className="field-row">
        <div className="field-label">Account Number</div>
        <div className="field-value tracking-[2px]">{data.accountNumber}</div>
      </div>
      <div className="field-row">
        <div className="field-label">Reason for Request</div>
        <div className="field-value">{data.reason || 'NOT SPECIFIED'}</div>
      </div>

      <div className="section-title">2. Requisition Details</div>
      <div className="flex gap-12 mb-2">
        <div className="flex-1">
          <div className="font-bold mb-1">Number of Leaves</div>
          <div className="flex gap-6 border border-black p-2">
            {['10', '25', '50', '100'].map(leaves => (
              <label key={leaves} className="flex items-center">
                <div className={`checkbox-box ${data.numberOfLeaves === leaves ? 'checked' : ''}`}></div> {leaves}
              </label>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-bold mb-1">Delivery Method</div>
          <div className="flex flex-col gap-2 border border-black p-2">
            {['Courier to Registered Address', 'Collect at Branch'].map(method => (
              <label key={method} className="flex items-center">
                <div className={`checkbox-box ${data.deliveryMethod === method ? 'checked' : ''}`}></div> {method}
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {data.deliveryMethod === 'Collect at Branch' && (
        <div className="field-row">
          <div className="field-label">Collection Branch</div>
          <div className="field-value">{data.branch}</div>
        </div>
      )}

      <div className="section-title">3. Authorization & Declarations</div>
      <div className="text-justify mb-4 leading-tight text-[10px]">
        I/We hereby request Surya Bank to issue a Cheque Book for the above-mentioned account as per the details provided. I/We authorize the Bank to deduct the applicable charges for the issuance of the Cheque Book from my/our account as per the Bank's current Schedule of Charges. I/We agree to keep the Cheque Book in safe custody at all times and take full responsibility for any unauthorized usage arising out of negligence on my/our part.
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
          <div className="font-bold text-[10px]">Signature of Account Holder</div>
          <div className="text-[9px] text-gray-500 mt-1">Signature must match bank records</div>
        </div>
      </div>

      {/* For Office Use Only */}
      <div className="section-title !bg-gray-300 !text-black border border-black mt-8">FOR OFFICE USE ONLY</div>
      <div className="border border-black p-4 grid grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <label className="flex items-center mb-2"><div className="checkbox-box"></div> Account active & eligible for Cheque Book</label>
            <label className="flex items-center mb-2"><div className="checkbox-box"></div> Customer Signature verified with CBS</label>
            <label className="flex items-center"><div className="checkbox-box"></div> Request punched in CBS</label>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold">Request Ref No:</span>
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
    </div>
  );
};

export default PrintableChequeBookForm;
