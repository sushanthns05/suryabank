import React from 'react';
import { FormLayout, FormCard, FormButton } from '../components/forms/FormSystem';
import PrintableDepositSlip from '../components/forms/PrintableDepositSlip';
import { Banknote, Printer } from 'lucide-react';

const DepositPayInSlip = () => {
  const printForm = () => window.print();

  return (
    <FormLayout 
      title="Cash Deposit Pay-In Slip" 
      subtitle="Print a blank cash deposit slip for offline submission at the branch."
      referenceNo={`DEP-${Math.floor(Math.random() * 90000) + 10000}`}
      progress={100}
      onPrint={printForm}
      hideHeaderOnPrint={true}
    >
      <div className="print:hidden">
        <FormCard step={1} title="Offline Deposit Slip" icon={Banknote}>
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-6">
              <Printer size={48} className="text-[#2563EB]" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-4">Print Blank Deposit Slip</h3>
            <p className="text-[#6B7280] max-w-lg mx-auto mb-8">
              Cash deposits require a physical pay-in slip. Click the button below to generate and print a standardized blank deposit slip. You can fill it out by hand and submit it along with your cash at any Surya Bank branch.
            </p>
            <FormButton type="button" onClick={printForm} className="mx-auto">
              Print Blank Deposit Slip
            </FormButton>
          </div>
        </FormCard>
      </div>

      <div className="hidden print:block w-full">
        <PrintableDepositSlip />
      </div>
    </FormLayout>
  );
};

export default DepositPayInSlip;
