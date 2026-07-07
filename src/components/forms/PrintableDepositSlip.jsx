import React from 'react';

const denominations = ['2000', '500', '200', '100', '50', '20', '10', 'Coins'];

const PrintableDepositSlip = () => {
  return (
    <div className="w-full bg-white text-black text-[10px] leading-tight font-sans">
      <style>{`
        @page { size: A4 landscape; margin: 10mm; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .slip-container { display: flex; width: 100%; border: 1px solid #000; height: 100%; }
        .customer-copy { width: 35%; border-right: 2px dashed #000; padding: 10px; }
        .bank-copy { width: 65%; padding: 10px; }
        .field-row { display: flex; align-items: flex-end; border-bottom: 1px solid #000; padding: 4px 0; margin-bottom: 4px; height: 24px; }
        .field-label { font-weight: bold; padding-right: 4px; white-space: nowrap; }
        .field-value { flex-grow: 1; font-weight: bold; font-family: monospace; font-size: 12px; }
        .denom-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .denom-table th, .denom-table td { border: 1px solid #000; padding: 2px 4px; text-align: center; }
        .denom-table th { background: #eee; font-weight: bold; }
        .box-grid { display: flex; gap: 2px; }
        .box { width: 14px; height: 14px; border: 1px solid #000; text-align: center; line-height: 12px; font-family: monospace; font-size: 12px; font-weight: bold; }
      `}</style>

      <div className="slip-container">
        {/* Customer Copy */}
        <div className="customer-copy">
          <div className="text-center font-bold text-sm mb-1">Surya Bank</div>
          <div className="text-center font-bold mb-4">CASH DEPOSIT SLIP (Customer Copy)</div>
          
          <div className="field-row">
            <span className="field-label">Branch:</span>
            <span className="field-value"></span>
          </div>
          <div className="field-row">
            <span className="field-label">Date:</span>
            <span className="field-value"></span>
          </div>
          <div className="field-row mt-4">
            <span className="field-label">Account No:</span>
            <span className="field-value tracking-wider"></span>
          </div>
          <div className="field-row">
            <span className="field-label">Name:</span>
            <span className="field-value uppercase"></span>
          </div>
          <div className="field-row">
            <span className="field-label">Amount ₹:</span>
            <span className="field-value"></span>
          </div>
          <div className="field-row h-12">
            <span className="field-label">Amount in words:</span>
            <span className="field-value font-normal text-xs leading-4"></span>
          </div>

          <div className="mt-12 flex justify-between px-2">
            <div className="text-center">
              <div className="border-b border-black w-24 mb-1 h-8"></div>
              <div>Cashier Sign & Seal</div>
            </div>
          </div>
        </div>

        {/* Bank Copy */}
        <div className="bank-copy">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border-2 border-black flex items-center justify-center font-bold text-lg">S</div>
              <h1 className="font-serif font-bold text-2xl tracking-wide">Surya Bank</h1>
            </div>
            <div className="text-right">
              <h2 className="font-bold text-lg">CASH DEPOSIT SLIP</h2>
              <p className="font-bold">(Bank Copy)</p>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Bank Copy - Left Form */}
            <div className="w-3/5 pr-4">
              <div className="flex gap-4 mb-2">
                <div className="field-row flex-1">
                  <span className="field-label">Branch:</span>
                  <span className="field-value"></span>
                </div>
                <div className="flex items-end mb-1">
                  <span className="font-bold mr-2">Date:</span>
                  <span className="font-bold font-monospace text-sm"></span>
                </div>
              </div>

              <div className="mt-4 mb-1 font-bold">Account Number:</div>
              <div className="flex gap-1 mb-4">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="box"></div>
                ))}
              </div>

              <div className="field-row">
                <span className="field-label">Name:</span>
                <span className="field-value uppercase"></span>
              </div>
              <div className="field-row">
                <span className="field-label">Mobile:</span>
                <span className="field-value"></span>
              </div>
              <div className="field-row">
                <span className="field-label">PAN No:</span>
                <span className="field-value tracking-wider"></span>
              </div>
              <div className="text-xs text-gray-600 mb-4">*PAN is mandatory for cash deposits of ₹50,000 and above.</div>

              <div className="field-row">
                <span className="field-label">Total Amount ₹:</span>
                <span className="field-value"></span>
              </div>
              <div className="field-row h-12">
                <span className="field-label">Amount in words:</span>
                <span className="field-value font-normal text-xs leading-4"></span>
              </div>

              <div className="mt-8 flex justify-between">
                <div className="text-center w-32">
                  <div className="border border-black h-16 mb-1 flex items-end justify-center pb-1"><span className="text-gray-400">Signature</span></div>
                  <div>Signature of Depositor</div>
                </div>
                <div className="text-center w-32">
                  <div className="border border-black h-16 mb-1 flex items-end justify-center pb-1"></div>
                  <div>Cashier / SWO</div>
                </div>
              </div>
            </div>

            {/* Bank Copy - Right Denominations */}
            <div className="w-2/5 border-l border-black pl-4">
              <div className="font-bold text-center mb-2 bg-gray-200 border border-black p-1">Cash Denominations</div>
              <table className="denom-table">
                <thead>
                  <tr>
                    <th>Denomination</th>
                    <th>Pieces</th>
                    <th>₹ Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {denominations.map(denom => (
                    <tr key={denom}>
                      <td className="text-left font-bold">{denom === 'Coins' ? 'Coins' : `₹ ${denom} x`}</td>
                      <td className="h-6"></td>
                      <td className="text-right"></td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2" className="text-right font-bold py-2">TOTAL ₹</td>
                    <td className="text-right font-bold text-sm py-2"></td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 text-[9px] text-justify text-gray-600">
                Declaration: I hereby declare that the cash deposited by me is out of my legitimate earnings/savings and I bear full responsibility for the same. I understand the bank's policy on forged notes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableDepositSlip;
