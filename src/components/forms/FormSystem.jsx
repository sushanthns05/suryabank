import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Check, ChevronDown, CheckCircle, Clock } from 'lucide-react';

// Form Page Shell
export const FormLayout = ({ title, subtitle, referenceNo, progress, children, onPrint, onSave, onHelp, hideHeaderOnPrint = false }) => (
  <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#111827] print:bg-white print:p-0 pb-20">
    
    {/* Top Nav (Screen only) */}
    <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50 print:hidden shadow-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#07111F] flex items-center justify-center font-bold text-[#D4AF37]">S</div>
          <span className="font-serif font-semibold text-lg tracking-wide text-[#07111F]">Surya Bank</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-[#6B7280]">
          <button onClick={onHelp} className="hover:text-[#2563EB] transition-colors">Help</button>
          <button onClick={onSave} className="hover:text-[#2563EB] transition-colors">Save Draft</button>
          <button onClick={onPrint} className="flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] text-[#111827] rounded-full hover:bg-[#E5E7EB] transition-colors">
            Print / PDF
          </button>
        </div>
      </div>
    </nav>

    {/* Form Header */}
    <header className={`max-w-5xl mx-auto px-6 py-12 ${hideHeaderOnPrint ? 'print:hidden' : 'print:py-4'}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111827] mb-2">{title}</h1>
          <p className="text-[#6B7280] text-lg">{subtitle}</p>
        </div>
        
        {/* Meta info (Ref, Time) */}
        <div className="flex flex-col items-start md:items-end gap-2 print:hidden">
          {referenceNo && (
            <div className="bg-white border border-[#E5E7EB] px-4 py-2 rounded-xl text-sm font-medium shadow-sm flex items-center gap-2">
              <span className="text-[#6B7280]">Ref:</span>
              <span className="text-[#111827] tracking-wider">{referenceNo}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-[#10B981] font-medium bg-[#10B981]/10 px-4 py-2 rounded-xl">
            <Clock size={16} />
            <span>Est. 5 mins</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mt-8 print:hidden">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-[#111827]">Application Progress</span>
            <span className="text-[#2563EB]">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      )}
    </header>

    {/* Main Content */}
    <main className="max-w-5xl mx-auto px-6 print:px-0">
      {children}
    </main>
  </div>
);

// Form Card Container
export const FormCard = ({ step, title, icon: Icon, children }) => (
  <section className="bg-white rounded-[18px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-[#E5E7EB] mb-8 overflow-hidden print:border-b print:border-black print:rounded-none print:shadow-none print:mb-6">
    <div className="px-8 py-6 border-b border-[#E5E7EB] flex items-center gap-4 bg-[#F8FAFC]/50 print:bg-white print:border-black print:p-2">
      {step && (
        <div className="w-8 h-8 rounded-full bg-[#E5E7EB] text-[#111827] flex items-center justify-center font-bold text-sm print:border print:border-black print:bg-white">
          {step}
        </div>
      )}
      {Icon && <Icon className="text-[#2563EB] print:hidden" size={24} />}
      <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
    </div>
    <div className="p-8 print:p-2">
      {children}
    </div>
  </section>
);

// Large Input Field
export const FormInput = ({ label, type = "text", value, onChange, placeholder, required = false, icon: Icon }) => (
  <div className="w-full relative group print:mb-4">
    <label className="block text-sm font-semibold text-[#111827] mb-2 print:text-black">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#2563EB] transition-colors print:hidden">
          <Icon size={20} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full h-14 bg-white border border-[#E5E7EB] rounded-2xl px-4 ${Icon ? 'pl-12' : ''} text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-300 print:border-b print:border-black print:rounded-none print:bg-transparent print:h-auto print:py-1`}
      />
    </div>
  </div>
);

// Interactive Checkbox Card
export const FormCheckbox = ({ label, description, checked, onChange, icon: Icon }) => (
  <div 
    onClick={onChange} 
    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 print:border-none print:p-0 print:mb-2 ${
      checked 
        ? 'bg-[#2563EB]/5 border-[#2563EB] shadow-[0_0_0_1px_#2563EB]' 
        : 'bg-white border-[#E5E7EB] hover:border-[#9CA3AF]'
    }`}
  >
    <div className={`mt-1 w-6 h-6 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors print:w-4 print:h-4 ${
      checked ? 'bg-[#2563EB] border-[#2563EB] text-white print:border-black print:text-black print:bg-white' : 'border-[#9CA3AF] bg-white print:border-black'
    }`}>
      {checked && <Check size={14} strokeWidth={3} className="print:block" />}
    </div>
    <div>
      <div className="font-semibold text-[#111827] flex items-center gap-2 print:text-black">
        {Icon && <Icon size={18} className="text-[#6B7280] print:hidden" />}
        {label}
      </div>
      {description && <p className="text-sm text-[#6B7280] mt-1 print:text-black">{description}</p>}
    </div>
  </div>
);

// Select Dropdown
export const FormSelect = ({ label, value, onChange, options, required = false }) => (
  <div className="w-full relative group print:mb-4">
    <label className="block text-sm font-semibold text-[#111827] mb-2 print:text-black">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full h-14 bg-white border border-[#E5E7EB] rounded-2xl px-4 appearance-none text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-300 print:border-b print:border-black print:rounded-none print:bg-transparent print:h-auto print:py-1"
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none print:hidden" size={20} />
    </div>
  </div>
);

// File Upload Zone
export const FileUploadZone = ({ label, description, accept = "image/*,application/pdf,.doc,.docx", onChange, file }) => (
  <div className="w-full print:mb-4">
    <label className="block text-sm font-semibold text-[#111827] mb-2 print:text-black">{label}</label>
    <label className="border-2 border-dashed border-[#CBD5E1] rounded-[18px] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors p-8 flex flex-col items-center justify-center text-center cursor-pointer group print:border-solid print:border-black print:p-4 print:bg-white relative">
      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer print:hidden" accept={accept} onChange={onChange} />
      {file ? (
        <>
          <Check size={32} className="text-green-500 mb-4 print:hidden" />
          <span className="font-semibold text-green-700 print:text-black">File Selected: {file.name}</span>
          <span className="text-sm text-[#6B7280] mt-1 print:hidden">Click to change file</span>
        </>
      ) : (
        <>
          <UploadCloud className="text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors mb-4 print:hidden" size={32} />
          <span className="font-semibold text-[#111827] print:text-black">Click to upload or drag & drop</span>
          <span className="text-sm text-[#6B7280] mt-1 print:hidden">{description || 'SVG, PNG, JPG or PDF (max. 5MB)'}</span>
        </>
      )}
    </label>
  </div>
);

// Large Action Button
export const FormButton = ({ children, onClick, type = "button", variant = "primary", className = "", disabled = false }) => {
  const baseStyle = "h-14 px-8 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed print:hidden";
  const variants = {
    primary: "bg-gradient-to-r from-[#D4AF37] to-[#FBBF24] text-[#07111F] hover:shadow-[0_8px_20px_-6px_rgba(212,175,55,0.5)] hover:-translate-y-0.5",
    secondary: "bg-[#111827] text-white hover:bg-[#1F2937] hover:shadow-lg",
    outline: "bg-white border-2 border-[#E5E7EB] text-[#111827] hover:border-[#9CA3AF]",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
