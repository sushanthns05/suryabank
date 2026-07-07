import React from 'react';

const PrintableCardForm = ({ data }) => {
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
          <h2 className="font-bold text-lg">APPLICATION FOR DEBIT / CREDIT CARD</h2>
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

      <div className="section-title">1. Card Requirements</div>
      <div className="flex gap-12 mb-2">
        <div className="flex-1">
          <div className="font-bold mb-1">Card Type</div>
          <div className="flex gap-6 border border-black p-2">
            {['Debit Card', 'Credit Card', 'Business Card'].map(type => (
              <label key={type} className="flex items-center">
                <div className={`checkbox-box ${data.cardType === type ? 'checked' : ''}`}></div> {type}
              </label>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-bold mb-1">Preferred Network</div>
          <div className="flex gap-6 border border-black p-2">
            {['Visa', 'Mastercard', 'RuPay'].map(type => (
              <label key={type} className="flex items-center">
                <div className={`checkbox-box ${data.network === type ? 'checked' : ''}`}></div> {type}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="section-title">2. Account & Personal Details</div>
      <div className="field-row">
        <div className="field-label">Linked Account Number</div>
        <div className="field-value tracking-[2px]">{data.accountNumber}</div>
      </div>
      <div className="field-row">
        <div className="field-label">Name to appear on Card</div>
        <div className="field-value">{data.nameOnCard}</div>
      </div>
      <div className="field-row">
        <div className="field-label">PAN Number</div>
        <div className="field-value tracking-[4px]">{data.pan}</div>
      </div>
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

      <div className="section-title">3. Delivery Address (Must match Bank records)</div>
      <div className="field-row">
        <div className="field-label">Full Address</div>
        <div className="field-value">{data.deliveryAddress}</div>
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

      <div className="section-title">4. Declarations & Signatures</div>
      <div className="text-justify mb-2 leading-tight text-[10px]">
        I/We request Surya Bank to issue a Debit/Credit Card to me/us and link it to the account mentioned above. I/We accept full responsibility for all transactions processed by the use of the Card. I/We authorize the Bank to debit my/our account with fees/charges related to the issuance and usage of the card as per the prevailing tariff. I/We agree to abide by the terms and conditions governing the card services.
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
          <div className="font-bold text-[10px]">Signature of Cardholder</div>
        </div>
      </div>

      {/* For Office Use Only */}
      <div className="section-title !bg-gray-300 !text-black border border-black mt-8">FOR OFFICE USE ONLY</div>
      <div className="border border-black p-4 grid grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <label className="flex items-center mb-2"><div className="checkbox-box"></div> Signature verified with Bank records</label>
            <label className="flex items-center mb-2"><div className="checkbox-box"></div> Account status is ACTIVE</label>
            <label className="flex items-center"><div className="checkbox-box"></div> Application entered in system</label>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold">Request ID:</span>
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

export default PrintableCardForm;
