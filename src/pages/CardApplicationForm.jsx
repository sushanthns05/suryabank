import React, { useState } from 'react';
import { FormLayout, FormCard, FormInput, FormCheckbox, FormButton, FileUploadZone } from '../components/forms/FormSystem';
import PrintableCardForm from '../components/forms/PrintableCardForm';
import { CreditCard, MapPin, Shield, FileSignature } from 'lucide-react';

const CardApplicationForm = () => {
  const [formData, setFormData] = useState({
    cardType: 'Debit Card',
    network: 'Visa',
    nameOnCard: '',
    accountNumber: '',
    mobile: '',
    email: '',
    deliveryAddress: '',
    city: '',
    state: '',
    pincode: '',
    pan: '',
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
    let fields = ['nameOnCard', 'accountNumber', 'mobile', 'deliveryAddress', 'pan', 'agreedToTerms', 'signatureFile'];
    let filled = fields.filter(f => formData[f]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const printForm = () => window.print();

  return (
    <FormLayout 
      title="ATM / Debit / Credit Card Application" 
      subtitle="Apply for a new physical card for your account."
      referenceNo={`CRD-${Math.floor(Math.random() * 90000) + 10000}`}
      progress={calculateProgress()}
      onPrint={printForm}
      hideHeaderOnPrint={true}
    >
      <div className="print:hidden">
        <form>
          <FormCard step={1} title="Card Selection" icon={CreditCard}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#111827] mb-4">Select Card Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormCheckbox label="Debit Card" checked={formData.cardType === 'Debit Card'} onChange={() => updateForm('cardType', 'Debit Card')} />
                <FormCheckbox label="Credit Card" checked={formData.cardType === 'Credit Card'} onChange={() => updateForm('cardType', 'Credit Card')} />
                <FormCheckbox label="Business Card" checked={formData.cardType === 'Business Card'} onChange={() => updateForm('cardType', 'Business Card')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-4">Select Network</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormCheckbox label="Visa" checked={formData.network === 'Visa'} onChange={() => updateForm('network', 'Visa')} />
                <FormCheckbox label="Mastercard" checked={formData.network === 'Mastercard'} onChange={() => updateForm('network', 'Mastercard')} />
                <FormCheckbox label="RuPay" checked={formData.network === 'RuPay'} onChange={() => updateForm('network', 'RuPay')} />
              </div>
            </div>
          </FormCard>

          <FormCard step={2} title="Delivery Details" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Name to appear on Card" value={formData.nameOnCard} onChange={e => updateForm('nameOnCard', e.target.value)} required />
              <FormInput label="Linked Account Number" value={formData.accountNumber} onChange={e => updateForm('accountNumber', e.target.value)} required />
              <FormInput label="Mobile Number" value={formData.mobile} onChange={e => updateForm('mobile', e.target.value)} required />
              <FormInput label="Email Address" type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} required />
              <div className="md:col-span-2">
                <FormInput label="Delivery Address" value={formData.deliveryAddress} onChange={e => updateForm('deliveryAddress', e.target.value)} required />
              </div>
              <FormInput label="City" value={formData.city} onChange={e => updateForm('city', e.target.value)} required />
              <FormInput label="State" value={formData.state} onChange={e => updateForm('state', e.target.value)} required />
              <FormInput label="PIN Code" value={formData.pincode} onChange={e => updateForm('pincode', e.target.value)} required />
            </div>
          </FormCard>

          <FormCard step={3} title="KYC Verification" icon={Shield}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="PAN Number" value={formData.pan} onChange={e => updateForm('pan', e.target.value)} required />
            </div>
          </FormCard>

          <FormCard step={4} title="Declarations & Signature" icon={FileSignature}>
            <div className="space-y-4 mb-8">
              <FormCheckbox 
                label="I have read and understood the Terms and Conditions governing the issuance of the Card." 
                checked={formData.agreedToTerms} 
                onChange={() => updateForm('agreedToTerms', !formData.agreedToTerms)} 
              />
              <FormCheckbox 
                label="I authorize Surya Bank to deduct the applicable issuance and annual fees from my account." 
                checked={formData.agreedToTerms} 
                onChange={() => updateForm('agreedToTerms', !formData.agreedToTerms)} 
              />
            </div>
            
            <FileUploadZone 
              label="Applicant's Signature" 
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
        <PrintableCardForm data={formData} />
      </div>
    </FormLayout>
  );
};

export default CardApplicationForm;
