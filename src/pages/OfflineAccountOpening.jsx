import React from 'react';
import { Download, FileText, MapPin, CheckCircle, FileSignature, ArrowRight } from 'lucide-react';

const OfflineAccountOpening = () => {
  const isEmployeeSite = window.location.hostname.includes('employee-suryabank') || window.location.pathname.includes('/employee');

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">Offline Account Opening Form</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {isEmployeeSite 
            ? "Download and print forms for walk-in customers to fill out and submit at the branch."
            : "Prefer applying in person? Download our account opening form, fill it out at home, and bring it to your nearest Surya Bank branch."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Step 1 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center relative hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-surya-primary dark:text-surya-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Download size={32} />
          </div>
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold">1</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Download & Print</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Download the official Surya Bank Account Opening Form and print it on A4 paper.</p>
        </div>

        {/* Step 2 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center relative hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-surya-primary dark:text-surya-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <FileSignature size={32} />
          </div>
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold">2</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Fill the Details</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Complete the form in BLOCK LETTERS using a black or blue pen. Ensure all mandatory fields are filled.</p>
        </div>

        {/* Step 3 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center relative hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-surya-primary dark:text-surya-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={32} />
          </div>
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold">3</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Submit at Branch</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Visit your nearest Surya Bank branch with the completed form, recent photographs, and original KYC documents.</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="text-surya-primary dark:text-surya-secondary" />
              Savings & Current Account Form
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle size={18} className="text-surya-success mt-0.5 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 text-sm">Includes KYC Declaration</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={18} className="text-surya-success mt-0.5 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 text-sm">Nomination Facilities (Form DA1)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={18} className="text-surya-success mt-0.5 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 text-sm">Debit Card & Internet Banking Request</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={18} className="text-surya-success mt-0.5 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 text-sm">Joint Account Options</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 lg:mt-0 flex flex-col items-center lg:items-end w-full lg:w-auto">
            <a 
              href="/account-opening-form" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-surya-primary hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 text-center whitespace-normal"
            >
              <Download size={20} className="shrink-0" />
              <span>Open Form for Download</span>
              <ArrowRight size={20} className="shrink-0" />
            </a>
            <p className="text-center lg:text-right text-xs text-slate-500 dark:text-slate-400 mt-3 max-w-xs">
              Opens in a new tab. You can save as PDF or print directly.
            </p>
          </div>
        </div>
      </div>
      
      {/* Required Documents Section */}
      <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Required KYC Documents (Bring Originals to Branch)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Identity Proof (Any One)</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm list-disc pl-5">
              <li>Aadhaar Card</li>
              <li>Permanent Account Number (PAN) Card</li>
              <li>Passport</li>
              <li>Voter ID Card</li>
              <li>Driving License</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Address Proof (Any One)</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm list-disc pl-5">
              <li>Aadhaar Card (if address is updated)</li>
              <li>Passport</li>
              <li>Voter ID Card</li>
              <li>Latest Utility Bill (Electricity, Water, Post-paid Mobile)</li>
              <li>Property or Municipal Tax Receipt</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-xl border border-orange-200 dark:border-orange-800/30 text-sm">
          <strong>Note:</strong> PAN Card is mandatory for opening an account. Also, please carry 2 recent passport-size color photographs.
        </div>
      </div>

    </div>
  );
};

export default OfflineAccountOpening;
