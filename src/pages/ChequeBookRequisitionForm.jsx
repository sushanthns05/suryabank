import React, { useState } from 'react';
import { FormLayout, FormCard, FormInput, FormSelect, FormButton, FileUploadZone } from '../components/forms/FormSystem';
import PrintableChequeBookForm from '../components/forms/PrintableChequeBookForm';
import { FileText, MapPin, Building, FileSignature } from 'lucide-react';

const ChequeBookRequisitionForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    accountNumber: '',
    numberOfLeaves: '25',
    deliveryMethod: 'Courier to Registered Address',
    branch: '',
    reason: '',
    signatureFile: null
  });

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      updateForm('signatureFile', e.target.files[0]);
    }
  };

  const calculateProgress = () => {
    let fields = ['customerName', 'accountNumber', 'numberOfLeaves', 'deliveryMethod', 'signatureFile'];
    let filled = fields.filter(f => formData[f]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const printForm = () => window.print();

  return (
    <FormLayout 
      title="Cheque Book Requisition Form" 
      subtitle="Request a new cheque book for your account."
      referenceNo={`CHQ-${Math.floor(Math.random() * 90000) + 10000}`}
      progress={calculateProgress()}
      onPrint={printForm}
      hideHeaderOnPrint={true}
    >
      <div className="print:hidden">
        <form>
          <FormCard step={1} title="Customer Details" icon={FileText}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Customer Name" value={formData.customerName} onChange={e => updateForm('customerName', e.target.value)} required />
              <FormInput label="Account Number" value={formData.accountNumber} onChange={e => updateForm('accountNumber', e.target.value)} required />
              <FormSelect label="Number of Leaves" value={formData.numberOfLeaves} onChange={e => updateForm('numberOfLeaves', e.target.value)} options={['10', '25', '50', '100']} required />
              <FormInput label="Reason for Request" value={formData.reason} onChange={e => updateForm('reason', e.target.value)} placeholder="e.g. Current book exhausted" />
            </div>
          </FormCard>

          <FormCard step={2} title="Delivery Options" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect 
                label="Delivery Method" 
                value={formData.deliveryMethod} 
                onChange={e => updateForm('deliveryMethod', e.target.value)} 
                options={['Courier to Registered Address', 'Collect at Branch']} 
                required 
              />
              {formData.deliveryMethod === 'Collect at Branch' && (
                <FormInput label="Collection Branch" value={formData.branch} onChange={e => updateForm('branch', e.target.value)} required icon={Building} />
              )}
            </div>
          </FormCard>

          <FormCard step={3} title="Signatures & Verification" icon={FileSignature}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <FileUploadZone 
                  label="Customer Signature" 
                  description="Upload a clear image of your signature (PNG, JPG)" 
                  file={formData.signatureFile}
                  onChange={handleFileChange}
                />
                <p className="text-xs text-[#6B7280] mt-2">Signature must match bank records.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">Branch Verification</label>
                <div className="border border-[#E5E7EB] rounded-[18px] p-6 bg-[#F8FAFC] text-center h-[200px] flex items-center justify-center">
                  <span className="text-[#9CA3AF]">Branch Use Only</span>
                </div>
                <p className="text-xs text-[#6B7280] mt-2">Signature verified by Maker/Checker.</p>
              </div>
            </div>
          </FormCard>

          <div className="flex justify-end gap-4 mt-8">
            <FormButton type="button" variant="outline" onClick={printForm}>Print Form for Offline Submission</FormButton>
          </div>
        </form>
      </div>

      <div className="hidden print:block w-full">
        <PrintableChequeBookForm data={formData} />
      </div>
    </FormLayout>
  );
};

export default ChequeBookRequisitionForm;
