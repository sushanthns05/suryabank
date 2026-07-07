import React, { useState } from 'react';
import { FormLayout, FormCard, FormInput, FormCheckbox, FormButton, FileUploadZone } from '../components/forms/FormSystem';
import PrintableAadhaarForm from '../components/forms/PrintableAadhaarForm';
import { User, Smartphone, FileSignature } from 'lucide-react';

const AadhaarSeedingForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    accountNumber: '',
    aadhaarNumber: '',
    mobileNumber: '',
    agreedToTerms: false,
    signatureFile: null
  });

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      updateForm('signatureFile', e.target.files[0]);
    }
  };

  const calculateProgress = () => {
    let fields = ['customerName', 'accountNumber', 'aadhaarNumber', 'mobileNumber', 'agreedToTerms', 'signatureFile'];
    let filled = fields.filter(f => formData[f]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const printForm = () => window.print();

  return (
    <FormLayout 
      title="Aadhaar Seeding Consent Form" 
      subtitle="Link your Aadhaar number to your bank account for DBT and other benefits."
      referenceNo={`AAD-${Math.floor(Math.random() * 90000) + 10000}`}
      progress={calculateProgress()}
      onPrint={printForm}
      hideHeaderOnPrint={true}
    >
      <div className="print:hidden">
        <form>
          <FormCard step={1} title="Customer Information" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Customer Name" value={formData.customerName} onChange={e => updateForm('customerName', e.target.value)} required />
              <FormInput label="Account Number" value={formData.accountNumber} onChange={e => updateForm('accountNumber', e.target.value)} required />
            </div>
          </FormCard>

          <FormCard step={2} title="Aadhaar & Verification Details" icon={Smartphone}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Aadhaar Number (UID)" value={formData.aadhaarNumber} onChange={e => updateForm('aadhaarNumber', e.target.value)} required />
              <FormInput label="Mobile Number (Registered with UIDAI)" value={formData.mobileNumber} onChange={e => updateForm('mobileNumber', e.target.value)} required />
            </div>
          </FormCard>

          <FormCard step={3} title="Consent & Declarations" icon={FileSignature}>
            <div className="space-y-4 mb-8">
              <FormCheckbox 
                label="I consent to seed my Aadhaar Number with my bank account." 
                checked={formData.agreedToTerms} 
                onChange={() => updateForm('agreedToTerms', !formData.agreedToTerms)} 
              />
              <FormCheckbox 
                label="I authorize Surya Bank to fetch my personal details from UIDAI for verification." 
                checked={formData.agreedToTerms} 
                onChange={() => updateForm('agreedToTerms', !formData.agreedToTerms)} 
              />
              <FormCheckbox 
                label="I wish to receive Direct Benefit Transfer (DBT) subsidies into this account." 
                checked={formData.agreedToTerms} 
                onChange={() => updateForm('agreedToTerms', !formData.agreedToTerms)} 
              />
            </div>
            
            <FileUploadZone 
              label="Signature / Thumb Impression" 
              description="Upload a clear image of your signature (PNG, JPG)" 
              file={formData.signatureFile}
              onChange={handleFileChange}
            />
          </FormCard>

          <div className="flex justify-end gap-4 mt-8">
            <FormButton type="button" variant="outline" onClick={printForm}>Print Form for Offline Submission</FormButton>
          </div>
        </form>
      </div>

      <div className="hidden print:block w-full">
        <PrintableAadhaarForm data={formData} />
      </div>
    </FormLayout>
  );
};

export default AadhaarSeedingForm;
