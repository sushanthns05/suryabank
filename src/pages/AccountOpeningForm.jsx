import React, { useState } from 'react';
import { FormLayout, FormCard, FormInput, FormCheckbox, FormSelect, FileUploadZone, FormButton } from '../components/forms/FormSystem';
import PrintableOfflineForm from '../components/forms/PrintableOfflineForm';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Building2, User, MapPin, Shield, Briefcase, Users, CreditCard, FileSignature, CheckCircle } from 'lucide-react';

const ACCOUNT_TYPES = [
  { id: 'savings', label: 'Savings Account', description: 'Everyday banking with competitive interest rates and zero maintenance fees.', icon: Building2 },
  { id: 'current', label: 'Current Account', description: 'For businesses and professionals with unlimited transactions.', icon: Briefcase },
  { id: 'salary', label: 'Salary Account', description: 'Exclusive benefits for salaried employees with zero balance requirements.', icon: User },
  { id: 'minor', label: 'Minor Account', description: 'Secure savings for your children with parental controls.', icon: Shield },
  { id: 'nri', label: 'NRI Account', description: 'Manage your finances in India globally with ease and security.', icon: MapPin },
];

const AccountOpeningForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    accountType: '',
    fullName: '',
    fatherName: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    nationality: 'Indian',
    pan: '',
    aadhaar: '',
    occupation: '',
    annualIncome: '',
    mobile: '',
    altPhone: '',
    email: '',
    permanentAddress: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    nomineeName: '',
    nomineeRelation: '',
    nomineeDob: '',
    nomineeAddress: '',
    services: { debitCard: true, smsAlerts: true, internetBanking: true },
    agreedToTerms: false,
    signatureFile: null
  });

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const updateService = (key) => setFormData(prev => ({ ...prev, services: { ...prev.services, [key]: !prev.services[key] } }));

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      updateForm('signatureFile', e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'account_applications'), {
        ...formData,
        status: 'Pending Verification',
        submittedAt: new Date().toISOString()
      });
      setTimeout(() => {
        setIsSuccess(true);
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error("Error submitting form", error);
      setIsSubmitting(false);
    }
  };

  const calculateProgress = () => {
    let fields = ['accountType', 'fullName', 'mobile', 'email', 'pan', 'aadhaar', 'nomineeName', 'agreedToTerms'];
    let filled = fields.filter(f => formData[f]).length;
    return Math.round((filled / fields.length) * 100);
  };

  if (isSuccess) {
    return (
      <FormLayout title="Application Submitted" subtitle="Your request has been securely transmitted.">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={48} strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-bold text-[#111827] mb-4">Application Successful!</h2>
          <p className="text-[#6B7280] text-lg max-w-lg mb-8">
            Your account opening application has been securely submitted. Our team will review your KYC documents within 24 hours.
          </p>
          <FormButton onClick={() => window.location.reload()} variant="primary">
            Return to Dashboard
          </FormButton>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout 
      title="Account Opening Application" 
      subtitle="Complete your digital KYC and open your account instantly."
      referenceNo={`REF-${Math.floor(Math.random() * 90000) + 10000}`}
      progress={calculateProgress()}
      onPrint={() => window.print()}
      hideHeaderOnPrint={true}
    >
      <div className="print:hidden">
        <form onSubmit={handleSubmit}>
          <FormCard step={1} title="Select Account Type" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACCOUNT_TYPES.map(type => (
                <FormCheckbox 
                  key={type.id}
                  label={type.label}
                  description={type.description}
                  icon={type.icon}
                  checked={formData.accountType === type.id}
                  onChange={() => updateForm('accountType', type.id)}
                />
              ))}
            </div>
          </FormCard>

          <FormCard step={2} title="Personal Details" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormInput label="Full Name as per Identity Proof" value={formData.fullName} onChange={e => updateForm('fullName', e.target.value)} required />
              </div>
              <FormInput label="Father / Mother / Spouse Name" value={formData.fatherName} onChange={e => updateForm('fatherName', e.target.value)} required />
              <FormInput label="Date of Birth" type="date" value={formData.dob} onChange={e => updateForm('dob', e.target.value)} required />
              <FormSelect label="Gender" value={formData.gender} onChange={e => updateForm('gender', e.target.value)} options={['Male', 'Female', 'Other']} required />
              <FormSelect label="Marital Status" value={formData.maritalStatus} onChange={e => updateForm('maritalStatus', e.target.value)} options={['Single', 'Married', 'Divorced', 'Widowed']} required />
              <FormInput label="Nationality" value={formData.nationality} onChange={e => updateForm('nationality', e.target.value)} required />
            </div>
          </FormCard>

          <FormCard step={3} title="Identity & KYC" icon={Shield}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormInput label="PAN Number" value={formData.pan} onChange={e => updateForm('pan', e.target.value)} required />
              <FormInput label="Aadhaar Number" value={formData.aadhaar} onChange={e => updateForm('aadhaar', e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadZone label="Upload Aadhaar Card (Front & Back)" />
              <FileUploadZone label="Upload PAN Card" />
              <FileUploadZone label="Recent Passport Size Photo" />
              <FileUploadZone label="Digital Signature" />
            </div>
          </FormCard>

          <FormCard step={4} title="Contact Information" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Mobile Number" value={formData.mobile} onChange={e => updateForm('mobile', e.target.value)} required />
              <FormInput label="Email Address" type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} required />
              <div className="md:col-span-2">
                <FormInput label="Permanent Address" value={formData.permanentAddress} onChange={e => updateForm('permanentAddress', e.target.value)} required />
              </div>
              <FormInput label="City" value={formData.city} onChange={e => updateForm('city', e.target.value)} required />
              <FormInput label="State" value={formData.state} onChange={e => updateForm('state', e.target.value)} required />
              <FormInput label="PIN Code" value={formData.pincode} onChange={e => updateForm('pincode', e.target.value)} required />
              <FormInput label="Country" value={formData.country} onChange={e => updateForm('country', e.target.value)} required />
            </div>
          </FormCard>

          <FormCard step={5} title="Employment & Income" icon={Briefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect label="Occupation Type" value={formData.occupation} onChange={e => updateForm('occupation', e.target.value)} options={['Salaried', 'Self Employed', 'Business', 'Student', 'Retired', 'Homemaker']} required />
              <FormSelect label="Annual Income (₹)" value={formData.annualIncome} onChange={e => updateForm('annualIncome', e.target.value)} options={['Below 1 Lakh', '1 - 5 Lakhs', '5 - 10 Lakhs', '10 - 25 Lakhs', 'Above 25 Lakhs']} required />
            </div>
          </FormCard>

          <FormCard step={6} title="Nomination" icon={Users}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Nominee Name" value={formData.nomineeName} onChange={e => updateForm('nomineeName', e.target.value)} required />
              <FormInput label="Relationship with Applicant" value={formData.nomineeRelation} onChange={e => updateForm('nomineeRelation', e.target.value)} required />
              <FormInput label="Nominee Date of Birth" type="date" value={formData.nomineeDob} onChange={e => updateForm('nomineeDob', e.target.value)} required />
              <div className="md:col-span-2">
                <FormInput label="Nominee Address" value={formData.nomineeAddress} onChange={e => updateForm('nomineeAddress', e.target.value)} required />
              </div>
            </div>
          </FormCard>

          <FormCard step={7} title="Banking Services" icon={CreditCard}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormCheckbox label="Debit Card" description="Get a complimentary Platinum Visa Debit Card." checked={formData.services.debitCard} onChange={() => updateService('debitCard')} />
              <FormCheckbox label="SMS Alerts" description="Receive instant transaction notifications." checked={formData.services.smsAlerts} onChange={() => updateService('smsAlerts')} />
              <FormCheckbox label="Internet Banking" description="24/7 access to your account online." checked={formData.services.internetBanking} onChange={() => updateService('internetBanking')} />
            </div>
          </FormCard>

          <FormCard step={8} title="Declarations & Signature" icon={FileSignature}>
            <div className="space-y-4 mb-8">
              <FormCheckbox 
                label="I hereby declare that the details furnished above are true and correct to the best of my knowledge." 
                checked={formData.agreedToTerms} 
                onChange={() => updateForm('agreedToTerms', !formData.agreedToTerms)} 
              />
              <FormCheckbox 
                label="I agree to abide by the terms and conditions of Surya Bank." 
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

          <div className="flex justify-end gap-4 mt-8 print:hidden">
            <FormButton type="submit" disabled={!formData.agreedToTerms || isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? 'Processing...' : 'Submit Application'}
            </FormButton>
          </div>
        </form>
      </div>

      <div className="hidden print:block w-full">
        <PrintableOfflineForm data={formData} />
      </div>
    </FormLayout>
  );
};

export default AccountOpeningForm;
