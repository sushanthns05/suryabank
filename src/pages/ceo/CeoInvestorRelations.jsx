import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, Activity, DollarSign, PieChart, ShieldAlert, Globe, FileText, Download, 
  CheckCircle2, Briefcase, Users, FileSignature, Send, BrainCircuit,
  ChevronDown, ChevronUp, BookOpen, BarChart4, Clock, Building2, Anchor, X
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// --- MOCK DATA ---

const TABS = [
  { id: 'intelligence', label: 'Financial Intelligence' },
  { id: 'performance', label: 'Financial Performance' },
  { id: 'governance', label: 'Governance & Risk' },
  { id: 'global', label: 'Global Presence' },
  { id: 'communication', label: 'Communication Hub' },
  { id: 'ai', label: 'AI Investor Assistant' }
];

const SCORECARD = [
  { label: 'Market Cap', value: '$185.4B', trend: '+12.4%', up: true, icon: Building2 },
  { label: 'Share Price', value: '$142.50', trend: '+2.1%', up: true, icon: TrendingUp },
  { label: 'YTD Revenue', value: '$45.2B', trend: '+8.7%', up: true, icon: DollarSign },
  { label: 'Net Profit', value: '$12.8B', trend: '+5.4%', up: true, icon: Activity },
  { label: 'Earnings Per Share', value: '$8.45', trend: '+4.2%', up: true, icon: PieChart },
  { label: 'Return on Equity (ROE)', value: '14.2%', trend: '-0.5%', up: false, icon: BarChart4 },
  { label: 'Return on Assets (ROA)', value: '1.8%', trend: '+0.1%', up: true, icon: Anchor },
  { label: 'Dividend Yield', value: '4.5%', trend: '+0.2%', up: true, icon: Briefcase },
  { label: 'Capital Adequacy Ratio', value: '15.8%', trend: 'Stable', up: true, icon: ShieldAlert },
  { label: 'Liquidity Coverage', value: '135%', trend: '+5%', up: true, icon: Clock },
  { label: 'Credit Rating', value: 'AA+', trend: 'S&P', up: true, icon: CheckCircle2 },
  { label: 'ESG Rating', value: 'AAA', trend: 'MSCI', up: true, icon: Globe },
];

const MARKET_PERFORMANCE = [
  { month: 'Jan', price: 120, volume: 45 },
  { month: 'Feb', price: 122, volume: 52 },
  { month: 'Mar', price: 118, volume: 61 },
  { month: 'Apr', price: 125, volume: 48 },
  { month: 'May', price: 130, volume: 55 },
  { month: 'Jun', price: 135, volume: 70 },
  { month: 'Jul', price: 132, volume: 65 },
  { month: 'Aug', price: 138, volume: 58 },
  { month: 'Sep', price: 140, volume: 62 },
  { month: 'Oct', price: 142.5, volume: 75 },
];

const FINANCIAL_STATEMENTS = [
  {
    category: 'Income Statement (Q3 2026)',
    items: [
      { label: 'Net Interest Income', value: '$15.4B', growth: '+5%' },
      { label: 'Non-Interest Income', value: '$8.2B', growth: '+12%' },
      { label: 'Total Revenue', value: '$23.6B', growth: '+8%' },
      { label: 'Operating Expenses', value: '$10.2B', growth: '-2%' },
      { label: 'Net Income', value: '$6.8B', growth: '+14%' }
    ]
  },
  {
    category: 'Balance Sheet Highlights',
    items: [
      { label: 'Total Assets', value: '$2.4T', growth: '+6%' },
      { label: 'Total Loans', value: '$1.1T', growth: '+4%' },
      { label: 'Total Deposits', value: '$1.8T', growth: '+7%' },
      { label: 'Shareholders Equity', value: '$210B', growth: '+5%' }
    ]
  }
];

const DIVIDEND_HISTORY = [
  { year: '2026 (Est)', yield: '4.5%', payout: '$5.20', ratio: '61%' },
  { year: '2025', yield: '4.2%', payout: '$4.80', ratio: '58%' },
  { year: '2024', yield: '3.8%', payout: '$4.20', ratio: '55%' },
  { year: '2023', yield: '3.5%', payout: '$3.80', ratio: '52%' }
];

const SHAREHOLDERS = [
  { type: 'Institutional', percentage: 65, color: 'bg-ceo-gold' },
  { type: 'Retail', percentage: 20, color: 'bg-emerald-500' },
  { type: 'Insiders/Board', percentage: 10, color: 'bg-blue-500' },
  { type: 'State/Sovereign', percentage: 5, color: 'bg-purple-500' }
];

const RISKS = [
  { risk: 'Credit Risk', level: 'Moderate', desc: 'Commercial real estate portfolio exposure mitigated by stringent LTV limits.' },
  { risk: 'Liquidity Risk', level: 'Low', desc: 'LCR remains well above regulatory requirements at 135%.' },
  { risk: 'Cybersecurity Risk', level: 'High Focus', desc: 'Continuous investment in AI-driven threat detection and zero-trust architecture.' },
  { risk: 'Climate Risk', level: 'Monitored', desc: 'Transitioning lending portfolios to align with 2035 Net Zero commitments.' }
];

const DOWNLOAD_DOCS = [
  { title: 'Surya Bank Annual Report FY2025', type: 'PDF Report', size: '18.4 MB' },
  { title: 'Q3 FY2026 Earnings Presentation', type: 'Investor Deck', size: '12.1 MB' },
  { title: 'Corporate Governance Statement', type: 'Policy PDF', size: '4.2 MB' },
  { title: 'Basel III Capital Disclosures', type: 'Regulatory Data', size: '2.8 MB' },
  { title: 'Global ESG Fact Sheet', type: 'Summary Data', size: '1.5 MB' }
];

// --- COMPONENT ---

const CeoInvestorRelations = () => {
  const [activeTab, setActiveTab] = useState('intelligence');
  const [expandedStatement, setExpandedStatement] = useState(0);
  const [aiChat, setAiChat] = useState([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const handleAiSubmit = (text) => {
    if (!text.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', text }]);
    setAiQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      let response = "I am analyzing the latest SEC filings and internal financial telemetry. ";
      const lower = text.toLowerCase();
      if (lower.includes('revenue')) response = "Q3 Revenue grew by 8.7% YoY, primarily driven by our robust investment banking division and higher net interest margins.";
      else if (lower.includes('dividend')) response = "We have consistently increased our dividend payout for 12 consecutive quarters. The current yield stands at a strong 4.5%.";
      else if (lower.includes('risk')) response = "Our primary risk focus is cybersecurity and commercial real estate credit exposure. Both are tightly controlled within our Basel III frameworks.";
      else if (lower.includes('forecast')) response = "Based on our predictive models, Q4 EPS is expected to beat consensus estimates by $0.15 due to strong digital adoption and reduced operational costs.";
      else response += "Our executive decision support systems indicate strong momentum across all core banking sectors. How else may I assist you with investor communications?";
      
      setAiChat(prev => [...prev, { role: 'ai', text: response }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const handleDownload = (doc) => {
    try {
      const pdf = new jsPDF();
      pdf.setFillColor(15, 23, 42); 
      pdf.rect(0, 0, 210, 297, 'F');
      
      pdf.setTextColor(212, 175, 55); 
      pdf.setFontSize(24);
      pdf.text('Surya Bank Enterprise', 20, 30);
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text(doc.title, 20, 50);
      
      pdf.setFontSize(11);
      pdf.setTextColor(148, 163, 184); 
      pdf.text('Document Classification: INVESTOR RELATIONS - PUBLIC DISCLOSURE', 20, 70);
      pdf.text(`Document Type: ${doc.type}`, 20, 80);
      pdf.text(`Generated: ${new Date().toLocaleDateString()} | System: Executive Investor Portal`, 20, 90);
      
      pdf.setTextColor(226, 232, 240); 
      pdf.setFontSize(14);
      pdf.text('Executive Summary', 20, 115);
      
      pdf.setFontSize(11);
      pdf.setTextColor(148, 163, 184); 
      
      const content = "This document serves as an official investor relations record of Surya Bank's financial performance. " +
        "It outlines audited financial metrics, strategic growth vectors, and shareholder value propositions " +
        "associated with the specified fiscal period. The contents herein are certified by the Chief Financial Officer " +
        "and comply with all SEC and international regulatory transparency standards.\n\n" +
        "Surya Bank has demonstrated resilient market outperformance, securing sequential revenue growth while maintaining " +
        "superior capital adequacy ratios. Our commitment to generating long-term shareholder value is evidenced by our " +
        "robust dividend yield and disciplined capital allocation strategies.\n\n" +
        "We continue to innovate within our core banking segments, aggressively scaling our digital infrastructure to " +
        "capture emerging market shares while optimizing our operational efficiency ratio.\n\n" +
        "For exhaustive financial schedules, complete proxy statements, or to arrange an analyst briefing, please " +
        "contact the Global Head of Investor Relations or access the EDGAR database.";
        
      const splitText = pdf.splitTextToSize(content, 170);
      pdf.text(splitText, 20, 125);
      
      pdf.setTextColor(212, 175, 55); 
      pdf.setFontSize(10);
      pdf.text('Authorized by: Office of the Chief Financial Officer', 20, 270);
      pdf.text('Surya Bank Global Headquarters - Investor Relations Division', 20, 280);

      pdf.save(`${doc.title.replace(/\\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Failed to generate PDF. Please ensure jsPDF is available.');
    }
  };

  const handleAGMNotice = () => {
    try {
      const pdf = new jsPDF();
      let y = 50;

      const addHeaderFooter = (doc) => {
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          
          // Header
          doc.setTextColor(15, 23, 42); 
          doc.setFontSize(22);
          doc.setFont('helvetica', 'bold');
          doc.text('SURYA BANK ENTERPRISE', 20, 25);
          
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105); 
          doc.setFont('helvetica', 'normal');
          doc.text('OFFICE OF THE FOUNDER, CHAIRMAN & CEO', 20, 32);
          doc.text('Surya Bank Limited | Global Headquarters', 20, 36);
          
          doc.text(`Doc Ref: SB-AGM-2025-001 | Date: ${new Date().toLocaleDateString()}`, 190, 25, { align: 'right' });
          doc.setTextColor(185, 28, 28); // Red for classification
          doc.setFont('helvetica', 'bold');
          doc.text('Classification: CONFIDENTIAL - SHAREHOLDER EYES ONLY', 190, 30, { align: 'right' });
          
          doc.setDrawColor(212, 175, 55);
          doc.setLineWidth(1);
          doc.line(20, 40, 190, 40);

          // Footer
          doc.line(20, 280, 190, 280);
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          doc.setFont('helvetica', 'normal');
          doc.text('Surya Bank Limited | www.suryabank.com | investor.relations@suryabank.com', 20, 285);
          doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: 'right' });
          doc.text(`Generated Timestamp: ${new Date().toISOString()}`, 20, 290);
          doc.text('Verification Digital ID: 0x8F9A2B4C...9E1F', 190, 290, { align: 'right' });
        }
      };

      const checkPage = (heightRequired) => {
        if (y + heightRequired > 270) {
          pdf.addPage();
          y = 50;
        }
      };

      const addTitle = (title) => {
        checkPage(20);
        pdf.setFontSize(16);
        pdf.setTextColor(15, 23, 42);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, 20, y);
        y += 10;
      };

      const addText = (text, size = 10, color = [30, 41, 59]) => {
        pdf.setFontSize(size);
        pdf.setTextColor(color[0], color[1], color[2]);
        pdf.setFont('helvetica', 'normal');
        const splitText = pdf.splitTextToSize(text, 170);
        checkPage(splitText.length * (size/2 + 2));
        pdf.text(splitText, 20, y);
        y += splitText.length * 5 + 5;
      };
      
      const addList = (items) => {
        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);
        pdf.setFont('helvetica', 'normal');
        items.forEach(item => {
           checkPage(8);
           pdf.text(`• ${item}`, 25, y);
           y += 6;
        });
        y += 4;
      };

      // DOCUMENT TITLE
      pdf.setFontSize(24);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ANNUAL GENERAL MEETING NOTICE', 105, y, { align: 'center' });
      y += 10;
      pdf.setFontSize(16);
      pdf.setTextColor(212, 175, 55);
      pdf.text('Annual General Meeting of Shareholders', 105, y, { align: 'center' });
      y += 8;
      pdf.setFontSize(12);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Fiscal Year 2025–2026', 105, y, { align: 'center' });
      y += 20;

      addTitle('1. OPENING STATEMENT');
      addText('Notice is hereby given that the Annual General Meeting (AGM) of the Shareholders of Surya Bank Limited will be convened. This meeting is strictly governed by the Surya Bank Articles of Association, the International Corporate Governance Code (ICGC), and the Federal Securities Regulatory Authority mandates (Regulation S-X and Regulation S-K). Only verified shareholders, duly registered on the Record Date, hold the statutory right to attend, deliberate, and vote on the resolutions presented herein. The Board of Directors explicitly mandates strict adherence to the proxy and compliance provisions documented in Section 11 of this notice.');
      
      addTitle('2. MEETING DETAILS');
      addList([
        'Meeting Date: November 15, 2026',
        'Meeting Time: 10:00 AM (GMT)',
        'Venue: Surya Bank Global Headquarters, Executive Auditorium & Secure Virtual Portal',
        'Virtual Meeting Link: https://agm.suryabank.com/live (Requires 2FA & Cert Authentication)',
        'Registration Opening Time: 08:30 AM (GMT)',
        'Registration Closing Time: 09:45 AM (GMT) - Strictly Enforced',
        'Dress Code: Business Formal required for physical attendance',
        'Required Identification: Government-issued Passport/ID & Certified Shareholder Registration Document',
        'Languages Supported: English (Primary), Spanish, Mandarin (Live Translation provided via earpiece)',
      ]);

      addTitle('3. MEETING AGENDA');
      addList([
        '09:00 - Opening Remarks, Verification of Quorum, and Code of Conduct Acknowledgment',
        '09:15 - Chairman\'s Address: A Year of Regulatory Resilience and Capital Fortitude',
        '09:45 - CEO Business Review: Macroeconomic Navigation & Financial Outperformance',
        '10:30 - Independent Auditor\'s Report (PwC Global Financial Services Group)',
        '11:00 - Corporate Governance & Systemic Risk Management Review',
        '11:30 - ESG & Sustainability Report: Progress Toward 2035 Net Zero Obligations',
        '12:00 - Innovation & Technology Update: Enterprise Quantum-Safe Cryptography Rollout',
        '13:00 - Dividend Declaration & Distribution Approval',
        '13:30 - Election/Re-election of Independent Directors (Pursuant to Section 14A)',
        '14:00 - Ratification of External Auditors & Compensation Packages',
        '14:30 - Shareholder Q&A Session (Pre-submitted and Live Queries)',
        '15:30 - Official Voting Session & Real-time Cryptographic Tallying',
        '16:00 - Strategic Vision Presentation & Chairman\'s Closing Address'
      ]);

      addTitle('4. BOARD RESOLUTIONS');
      addText('Shareholders are required to review, deliberate, and exercise their voting rights on the following binding corporate resolutions:');
      addList([
        'Resolution 1 (Ordinary): Approval of the Audited Consolidated Financial Statements and Director\'s Report for FY2025-2026.',
        'Resolution 2 (Ordinary): Authorization of a final dividend distribution of $5.20 per common share, payable on December 1, 2026.',
        'Resolution 3 (Ordinary): Re-election of Dr. Sarah Chen and Mr. James Harrison as Independent Non-Executive Directors.',
        'Resolution 4 (Ordinary): Re-appointment of PricewaterhouseCoopers (PwC) as Statutory Auditors and authorization for the Board to fix their remuneration.',
        'Resolution 5 (Special): Approval of the $120M Capital Expenditure Allocation for APAC Strategic Expansion & M&A Activity.',
        'Resolution 6 (Special): Approval of the $45M Technology Infrastructure Investment prioritizing Zero-Trust Architecture and Quantum Cryptography.',
        'Resolution 7 (Special): Adoption of the amended Corporate Governance framework incorporating strict anti-money laundering (AML) and KYC enhanced due diligence protocols.',
        'Resolution 8 (Ordinary): Ratification of the Board\'s proposed executive compensation framework aligning with long-term ESG milestones.'
      ]);

      addTitle('5. VOTING INFORMATION & STATUTORY RIGHTS');
      addText('Pursuant to Section 14(a) of the Securities Exchange Act, all shareholders registered as of the Record Date possess the right to vote. Each common share corresponds to one vote (Class A and Class B tiered rules apply for institutional blocs). Votes may be cast electronically via the encrypted Surya Bank Shareholder Portal, utilizing AES-256 secure protocols, or physically via cryptographic ballot terminals at the venue. Proxy forms must be lodged with the Corporate Secretary no later than 48 hours prior to the commencement of the AGM. Late proxy submissions will be rendered null and void without exception.');

      addTitle('6. SHAREHOLDER INFORMATION');
      addList([
        'Institutional Investors: 65% Ownership (Class A Voting Rights - Block Voting Enabled)',
        'Retail Investors: 20% Ownership (Class B Voting Rights)',
        'Board Members & Executive Committee: 10% Ownership (Restricted Trading Period Active)',
        'State/Sovereign Wealth Entities: 5% Ownership',
        'Record Date for Dividend Eligibility and Voting Rights: October 30, 2026'
      ]);

      addTitle('7. FINANCIAL HIGHLIGHTS (FY2025-2026)');
      addList([
        'Total Consolidated Revenue: $45.2 Billion (+8.7% YoY Growth)',
        'Net Profit Available to Shareholders: $12.8 Billion (+5.4% YoY Growth)',
        'Total Assets Under Management (AUM): $2.4 Trillion',
        'Total Deposits: $1.8 Trillion (Driven by robust retail acquisition)',
        'Capital Adequacy Ratio (Basel III Compliant): 15.8% (Exceeds regulatory minimums by 4.3%)',
        'Liquidity Coverage Ratio (LCR): 135% (Exhibiting extreme high-quality liquid asset reserves)',
        'Return on Equity (ROE): 14.2%',
        'Earnings Per Share (EPS): $8.45'
      ]);

      addTitle('8. ESG & SUSTAINABILITY DISCLOSURES');
      addText('Surya Bank remains resolutely committed to its 2035 Net Zero operational framework in compliance with the Task Force on Climate-related Financial Disclosures (TCFD). FY2025 witnessed the issuance of $15B in Green and Blue Bonds, oversubscribed by 300%. We have achieved a 22% reduction in Scope 2 carbon emissions. Furthermore, $500M was deployed to global financial inclusion trusts, advancing UN Sustainable Development Goals (SDGs) 1, 4, and 8. The Board of Directors has also achieved a 45% gender parity, exceeding the industry median.');

      addTitle('9. REGULATORY COMPLIANCE & RISK MANAGEMENT');
      addText('Enterprise risk management frameworks have operated flawlessly. Our proprietary AI-driven credit matrices have successfully constrained non-performing loan (NPL) ratios to a historic low of 1.1%, despite severe macroeconomic headwinds. Liquidity stress tests mandated by the Federal Reserve and the ECB were passed with the highest categorization of "Robust". In response to escalating global cyber threats, cybersecurity infrastructure was comprehensively upgraded to a sovereign-grade zero-trust architecture, successfully neutralizing 100% of detected state-sponsored intrusion attempts.');

      addTitle('10. STRATEGIC HIGHLIGHTS');
      addText('The rollout of the "Surya Next-Gen" Digital Banking ecosystem acquired 2.4M new active retail users and increased cross-product penetration by 18%. Our AI Banking Assistants now autonomously resolve 65% of level-1 customer inquiries globally, radically driving down the operational efficiency ratio. The Board\'s future roadmap heavily features immediate strategic expansion into the APAC commercial banking sector and the aggressive deployment of distributed ledger technology (DLT) settlement nodes for instantaneous cross-border liquidity transfers.');

      addTitle('11. MANDATORY SHAREHOLDER INSTRUCTIONS');
      addText('1. VIRTUAL ATTENDANCE: Shareholders electing to attend virtually must log in to the Shareholder Portal using their 16-digit alphanumeric Shareholder ID and biometric Two-Factor Authentication (2FA). The portal will open exactly 90 minutes prior to the meeting.\n2. PHYSICAL ATTENDANCE: Physical attendees must pre-register by November 10th to undergo mandatory executive security screening. Unregistered attendees will be denied entry to the Global Headquarters.\n3. Q&A PROTOCOL: To ensure orderly proceedings, questions for the Board must be submitted electronically via the portal up to 24 hours prior to the meeting. Live questions will be heavily moderated and limited to 2 minutes per shareholder.\n4. DECORUM: All participants are bound by the Surya Bank Shareholder Code of Conduct. Any breach of decorum will result in immediate expulsion from the meeting (physical or virtual).');

      addTitle('12. IMPORTANT DATES & DEADLINES');
      addList([
        'Notice Issued & Disseminated: November 1, 2026',
        'Record Date (Voting & Dividends): October 30, 2026',
        'Proxy Submission Legal Deadline: November 13, 2026 (10:00 AM GMT - No Extensions)',
        'Physical Registration Deadline: November 10, 2026 (17:00 GMT)',
        'Annual General Meeting Date: November 15, 2026',
        'Dividend Payment Execution Date: December 1, 2026'
      ]);

      addTitle('13. OFFICIAL ATTACHMENTS & ANNEXURES');
      addText('The following documents are appended to this notice and are available for secure download on the Shareholder Portal:');
      addList([
        'Annexure A: Full Annual Report FY2025 (340 pages)',
        'Annexure B: Audited Consolidated Financial Statements and Notes',
        'Annexure C: Corporate Governance, Remuneration, and Auditor Report',
        'Annexure D: ESG Sustainability & TCFD Disclosure Report',
        'Annexure E: Official Cryptographic Proxy Voting Form (Form SB-PRX-002)'
      ]);

      addTitle('14. COMPREHENSIVE LEGAL DISCLAIMER');
      addText('This document, including all annexures and associated presentations, does not constitute an offer to sell or a solicitation of an offer to buy any securities in any jurisdiction. Certain statements contained herein are "forward-looking statements" within the meaning of the Private Securities Litigation Reform Act of 1995 and equivalent international statutes. Such statements involve inherent risks, uncertainties, and assumptions. Actual corporate results may differ materially from those projected due to myriad factors including, but not limited to, macroeconomic volatility, regulatory shifts, and systemic market risks. By accessing this document, the recipient explicitly agrees to maintain strict confidentiality of all proprietary operational data and acknowledges that unauthorized distribution constitutes a breach of securities law subject to severe civil and criminal penalties.', 8, [100, 116, 139]);

      checkPage(50);
      y += 20;
      pdf.setDrawColor(15, 23, 42);
      pdf.line(20, y, 70, y);
      pdf.line(140, y, 190, y);
      y += 5;
      pdf.setFontSize(10);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sushanth NS', 45, y, { align: 'center' });
      pdf.text('Elena Rodriguez', 165, y, { align: 'center' });
      y += 5;
      pdf.setTextColor(71, 85, 105);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Founder, Chairman & CEO', 45, y, { align: 'center' });
      pdf.text('Corporate Secretary', 165, y, { align: 'center' });

      y += 25;
      pdf.setTextColor(212, 175, 55);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bolditalic');
      pdf.text('[OFFICIAL CORPORATE SEAL AFFIXED DIGITALLY - VERIFIED]', 105, y, { align: 'center' });

      addHeaderFooter(pdf);

      const blobUrl = pdf.output('bloburl');
      window.open(blobUrl, '_blank');
      pdf.save('Surya_Bank_AGM_Notice_2026_OFFICIAL.pdf');

    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Failed to generate AGM Notice PDF. Please ensure jsPDF is available.');
    }
  };

  // RENDERERS
  const renderIntelligence = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SCORECARD.map((kpi, i) => (
          <div key={i} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 hover:border-[#D4AF37]/50 transition-colors group">
            <div className="flex justify-between items-center mb-3">
              <kpi.icon className="text-[#D4AF37] opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${kpi.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-lg flex items-center gap-2"><Activity className="text-[#D4AF37]" /> Market Performance Center</h3>
            <div className="flex gap-2">
              {['1M', '6M', '1Y', '5Y'].map(tf => (
                <button key={tf} className={`px-3 py-1 rounded-lg text-xs font-bold ${tf === '1Y' ? 'bg-[#D4AF37] text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{tf}</button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MARKET_PERFORMANCE}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" domain={['dataMin - 10', 'dataMax + 10']} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff'}} itemStyle={{color: '#D4AF37', fontWeight: 'bold'}} />
                <Area type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col">
          <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-6"><BrainCircuit className="text-[#D4AF37]" /> Executive Decision Support</h3>
          <div className="space-y-4 flex-1">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <h4 className="text-emerald-400 font-bold text-sm mb-1">Growth Outlook</h4>
              <p className="text-xs text-slate-300">Revenue momentum accelerating in APAC commercial banking sector. Recommend increasing capital allocation by 15%.</p>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <h4 className="text-amber-400 font-bold text-sm mb-1">Capital Position</h4>
              <p className="text-xs text-slate-300">Excess liquidity currently at $40B. Optimal conditions for initiating proposed $5B share buyback program.</p>
            </div>
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <h4 className="text-rose-400 font-bold text-sm mb-1">Emerging Risks</h4>
              <p className="text-xs text-slate-300">Interest rate volatility in EMEA impacting corporate lending yields. Hedging strategies actively deployed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Financial Statements */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-white font-bold text-xl mb-6">Financial Performance Center</h3>
          <div className="space-y-4">
            {FINANCIAL_STATEMENTS.map((stat, i) => (
              <div key={i} className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-950/50">
                <button 
                  onClick={() => setExpandedStatement(expandedStatement === i ? null : i)}
                  className="w-full flex justify-between items-center p-4 text-white hover:bg-slate-800 transition-colors"
                >
                  <span className="font-bold">{stat.category}</span>
                  {expandedStatement === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedStatement === i && (
                  <div className="p-4 pt-0">
                    <table className="w-full text-sm">
                      <tbody>
                        {stat.items.map((item, j) => (
                          <tr key={j} className="border-b border-slate-800 last:border-0">
                            <td className="py-3 text-slate-300">{item.label}</td>
                            <td className="py-3 text-right font-bold text-white">{item.value}</td>
                            <td className={`py-3 text-right font-bold ${item.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{item.growth}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dividend Center */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-white font-bold text-xl mb-6">Dividend Center</h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Current Yield</div>
              <div className="text-2xl font-bold text-[#D4AF37]">4.50%</div>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Payout Ratio</div>
              <div className="text-2xl font-bold text-white">61.0%</div>
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="pb-3 font-semibold">Fiscal Year</th>
                <th className="pb-3 font-semibold">Total Payout</th>
                <th className="pb-3 font-semibold text-right">Yield</th>
              </tr>
            </thead>
            <tbody>
              {DIVIDEND_HISTORY.map((div, i) => (
                <tr key={i} className="border-b border-slate-800/50 last:border-0">
                  <td className="py-4 text-white font-bold">{div.year}</td>
                  <td className="py-4 text-slate-300">{div.payout}</td>
                  <td className="py-4 text-emerald-400 font-bold text-right">{div.yield}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Shareholder Center */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2"><Users className="text-[#D4AF37]" /> Shareholder Center</h3>
        <p className="text-sm text-slate-400 mb-8">Ownership distribution and voting rights framework.</p>
        
        <div className="space-y-6">
          {SHAREHOLDERS.map((sh, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white font-bold">{sh.type}</span>
                <span className="text-[#D4AF37] font-bold">{sh.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${sh.color} rounded-full`} style={{ width: `${sh.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 border border-slate-700 bg-slate-800/50 rounded-xl">
          <h4 className="text-white font-bold text-sm mb-2">Next Annual General Meeting (AGM)</h4>
          <p className="text-xs text-slate-400 mb-4">Proxy voting materials will be distributed to registered shareholders 45 days prior to the assembly.</p>
          <button onClick={handleAGMNotice} className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors">View AGM Notice</button>
        </div>
      </div>

      {/* Risk Center */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2"><ShieldAlert className="text-[#D4AF37]" /> Risk & Opportunity Center</h3>
        <p className="text-sm text-slate-400 mb-6">Executive risk monitoring and strategic mitigation matrices.</p>
        
        <div className="space-y-4">
          {RISKS.map((risk, i) => (
            <div key={i} className="p-4 border border-slate-700 bg-slate-950/50 rounded-xl hover:border-slate-500 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-bold text-sm">{risk.risk}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${risk.level.includes('High') ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'}`}>
                  {risk.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{risk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGlobal = () => (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 relative overflow-hidden min-h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
        <Globe size={64} className="text-[#D4AF37] mx-auto opacity-50" />
        <h2 className="text-3xl font-serif font-bold text-white">Global Market Presence</h2>
        <p className="text-slate-400 text-sm">Interactive geographic visualizations of Surya Bank's $2.4T AUM spanning 42 countries, mapping regional branches, operational hubs, and cross-border growth corridors.</p>
        <div className="grid grid-cols-3 gap-4 pt-8">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="text-2xl font-bold text-[#D4AF37]">42</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Countries</div>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="text-2xl font-bold text-white">2.4T</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">AUM ($USD)</div>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="text-2xl font-bold text-white">12,500+</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Branches</div>
          </div>
        </div>
        <div className="pt-4">
          <button 
            onClick={() => setShowMapModal(true)}
            className="px-6 py-3 bg-[#D4AF37] hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors"
          >
            Launch Interactive Map
          </button>
        </div>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Chairman's Comm */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        <h3 className="text-white font-bold text-xl mb-6">Chairman's Communication</h3>
        
        <div className="space-y-6">
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
            <h4 className="text-white font-bold mb-2">Annual Letter to Shareholders (FY2025)</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">"Our resilient operating model and strategic investments in deep-tech innovation have positioned Surya Bank to deliver unprecedented shareholder value in a complex macroeconomic environment."</p>
            <div className="flex items-center gap-4 border-t border-slate-800 pt-4">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-[#D4AF37]"><FileSignature size={20} /></div>
              <div>
                <div className="text-sm font-bold text-white">Sushanth NS</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Founder, Chairman & CEO</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-slate-800 hover:bg-[#D4AF37] hover:text-slate-900 text-white font-bold text-sm rounded-xl transition-colors">Read Full Letter</button>
            <button className="flex-1 py-3 bg-slate-800 hover:bg-[#D4AF37] hover:text-slate-900 text-white font-bold text-sm rounded-xl transition-colors">Watch Video Address</button>
          </div>
        </div>
      </div>

      {/* Download Center */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
        <h3 className="text-white font-bold text-xl mb-6">Investor Download Center</h3>
        <p className="text-sm text-slate-400 mb-6">Securely generate and download official corporate disclosures, SEC filings, and quarterly presentations.</p>
        
        <div className="space-y-3">
          {DOWNLOAD_DOCS.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-[#D4AF37]/50 transition-colors group">
              <div className="flex items-center gap-4">
                <FileText className="text-[#D4AF37] opacity-70 group-hover:opacity-100" size={24} />
                <div>
                  <h4 className="text-sm text-white font-bold">{doc.title}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">{doc.type} • {doc.size}</p>
                </div>
              </div>
              <button onClick={() => handleDownload(doc)} className="p-2 bg-slate-800 hover:bg-[#D4AF37] text-slate-300 hover:text-slate-900 rounded-lg transition-colors">
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAiAssistant = () => (
    <div className="h-[600px] flex flex-col bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Financial Intelligence AI</h3>
          <p className="text-xs text-slate-400">Ask me to summarize earnings, explain statements, or forecast trends.</p>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900/40">
        {aiChat.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <BookOpen size={48} className="text-slate-700" />
            <h4 className="text-slate-300 font-bold">How can I assist your investor analysis?</h4>
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => handleAiSubmit("Summarize the Q3 revenue growth")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-full transition-colors border border-slate-700">Summarize Q3 revenue growth</button>
              <button onClick={() => handleAiSubmit("What is our dividend history?")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-full transition-colors border border-slate-700">Dividend history</button>
              <button onClick={() => handleAiSubmit("Explain our credit risk mitigation")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-full transition-colors border border-slate-700">Explain credit risk</button>
            </div>
          </div>
        )}
        
        {aiChat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#D4AF37] text-slate-900 font-medium rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form onSubmit={(e) => { e.preventDefault(); handleAiSubmit(aiQuery); }} className="relative flex items-center">
          <input 
            type="text" 
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Query earnings reports, risk models, or market forecasts..." 
            className="w-full bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
          <button type="submit" disabled={!aiQuery.trim()} className="absolute right-3 p-2 bg-[#D4AF37] text-slate-900 rounded-lg disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-500 transition-colors">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-[#D4AF37]/30 rounded-2xl mb-4">
          <Briefcase className="text-[#D4AF37]" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">Executive Investor Relations</h1>
        <p className="text-slate-400 text-lg">Comprehensive financial intelligence, shareholder communications, and market performance analytics for Surya Bank enterprise stakeholders.</p>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-2 flex flex-wrap lg:flex-nowrap gap-2 sticky top-4 z-40 shadow-2xl">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-[#D4AF37] text-slate-900 shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        {activeTab === 'intelligence' && renderIntelligence()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'governance' && renderGovernance()}
        {activeTab === 'global' && renderGlobal()}
        {activeTab === 'communication' && renderCommunication()}
        {activeTab === 'ai' && renderAiAssistant()}
      </div>

      {/* Interactive Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Globe className="text-[#D4AF37]" size={28} />
                <h2 className="text-2xl font-serif font-bold text-white">Global Asset Distribution Map</h2>
              </div>
              <button 
                onClick={() => setShowMapModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 bg-[#0f172a] relative overflow-hidden flex items-center justify-center">
              <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }} style={{ width: "100%", height: "100%" }}>
                <ZoomableGroup center={[0, 20]} zoom={1} minZoom={1} maxZoom={8}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#1e293b"
                          stroke="#334155"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#475569", outline: "none" },
                            pressed: { fill: "#D4AF37", outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>
                  
                  {/* Surya Bank Hub Markers */}
                  <Marker coordinates={[-74.006, 40.7128]}>
                    <circle r={4} fill="#D4AF37" className="animate-pulse" />
                    <text textAnchor="middle" y={-10} style={{ fontFamily: "system-ui", fill: "#D4AF37", fontSize: "8px", fontWeight: "bold" }}>New York (HQ)</text>
                  </Marker>
                  <Marker coordinates={[-0.1276, 51.5074]}>
                    <circle r={3} fill="#10b981" />
                    <text textAnchor="middle" y={-8} style={{ fontFamily: "system-ui", fill: "#94a3b8", fontSize: "6px" }}>London</text>
                  </Marker>
                  <Marker coordinates={[103.8198, 1.3521]}>
                    <circle r={3} fill="#10b981" />
                    <text textAnchor="middle" y={-8} style={{ fontFamily: "system-ui", fill: "#94a3b8", fontSize: "6px" }}>Singapore</text>
                  </Marker>
                  <Marker coordinates={[114.1694, 22.3193]}>
                    <circle r={3} fill="#10b981" />
                    <text textAnchor="middle" y={-8} style={{ fontFamily: "system-ui", fill: "#94a3b8", fontSize: "6px" }}>Hong Kong</text>
                  </Marker>
                  <Marker coordinates={[139.6917, 35.6895]}>
                    <circle r={2.5} fill="#3b82f6" />
                    <text textAnchor="middle" y={-6} style={{ fontFamily: "system-ui", fill: "#64748b", fontSize: "5px" }}>Tokyo</text>
                  </Marker>
                  <Marker coordinates={[55.2708, 25.2048]}>
                    <circle r={2.5} fill="#3b82f6" />
                    <text textAnchor="middle" y={-6} style={{ fontFamily: "system-ui", fill: "#64748b", fontSize: "5px" }}>Dubai</text>
                  </Marker>
                  <Marker coordinates={[8.5417, 47.3769]}>
                    <circle r={2.5} fill="#3b82f6" />
                    <text textAnchor="middle" y={-6} style={{ fontFamily: "system-ui", fill: "#64748b", fontSize: "5px" }}>Zurich</text>
                  </Marker>
                  <Marker coordinates={[151.2093, -33.8688]}>
                    <circle r={2.5} fill="#3b82f6" />
                    <text textAnchor="middle" y={-6} style={{ fontFamily: "system-ui", fill: "#64748b", fontSize: "5px" }}>Sydney</text>
                  </Marker>
                  <Marker coordinates={[-46.6333, -23.5505]}>
                    <circle r={2.5} fill="#3b82f6" />
                    <text textAnchor="middle" y={-6} style={{ fontFamily: "system-ui", fill: "#64748b", fontSize: "5px" }}>Sao Paulo</text>
                  </Marker>
                </ZoomableGroup>
              </ComposableMap>
              
              <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 pointer-events-none shadow-xl">
                <h4 className="text-white text-sm font-bold mb-3">Asset Distribution Legend</h4>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
                  <span className="text-slate-300 text-xs">Global Headquarters</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-slate-300 text-xs">Tier 1 Trading Hubs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <span className="text-slate-300 text-xs">Regional Operation Centers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CeoInvestorRelations;
