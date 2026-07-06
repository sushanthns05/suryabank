// Mock Data for Sushanth NS - CEO, Chairman & Founder of Surya Bank
import { jsPDF } from 'jspdf';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const biography = {
  name: "Sushanth NS",
  title: "CEO, Chairman & Founder",
  organization: "Surya Bank",
  quote: "Building a secure, innovative, and inclusive future for global banking.",
  shortBio: "Sushanth NS is the visionary founder, CEO, and Chairman of Surya Bank. Under his leadership, Surya Bank has evolved from a pioneering local fintech platform into one of the world's most innovative, sustainable, and trusted global banking institutions, serving over 25 million customers across 15 countries.",
  longBio: "Sushanth NS founded Surya Bank with the fundamental belief that financial services should be transparent, boundaryless, and accessible to everyone. He holds an MBA in Finance from the Wharton School and a Master's in Computer Science from Stanford University. Over his 25-year career in global finance and banking technology, he has championing the integration of artificial intelligence, green finance, and advanced cryptographic security in retail and corporate financial sectors. A recipient of multiple global banking awards, Sushanth also serves as a strategic advisor to international sustainable development boards.",
  education: [
    { degree: "Master of Business Administration (MBA) in Finance", school: "The Wharton School, University of Pennsylvania", year: "2003" },
    { degree: "M.S. in Computer Science (Specialization in Distributed Systems)", school: "Stanford University", year: "2001" },
    { degree: "B.Tech in Computer Science & Engineering", school: "Indian Institute of Technology (IIT)", year: "1999" }
  ],
  stats: [
    { label: "Years of Banking Leadership", value: "25+" },
    { label: "Active Global Markets", value: "15" },
    { label: "Active Customers Served", value: "25M+" },
    { label: "Assets Under Management", value: "$42B" },
    { label: "ESG Investment Committed", value: "$5B" }
  ]
};

export const careerTimeline = [
  { year: "2024", title: "Global Expansion & Quantum Security", description: "Launched Surya Bank's European digital operations and initiated quantum-resistant security integration across all institutional ledgers.", category: "Expansion" },
  { year: "2022", title: "AI-First Banking Paradigm", description: "Spearheaded the complete integration of AI models for automated underwriting, customer support, and multi-tier fraud detection.", category: "Innovation" },
  { year: "2020", title: "Green Finance Commitment", description: "Launched the $5 Billion Sustainable Green Bond program and committed to a carbon-neutral loan portfolio by 2030.", category: "ESG" },
  { year: "2018", title: "Surya Bank IPO", description: "Led Surya Bank's historic public offering, listing on major global exchanges with a record-setting subscription rate.", category: "Corporate" },
  { year: "2015", title: "Foundation of Surya Bank", description: "Founded Surya Bank as a digital-first challenger banking platform to address financial inclusion and modern corporate cash management.", category: "Founding" },
  { year: "2010", title: "Managing Director of Global Tech", description: "Served as Managing Director of Technology & Infrastructure at a leading global investment firm in New York.", category: "Career" },
  { year: "2004", title: "Head of Derivatives Trading Systems", description: "Led the development of real-time low-latency trade routing networks for major trading houses.", category: "Career" }
];

export const leadershipPrinciples = [
  { title: "Empathetic Innovation", desc: "Technology must solve real human challenges. We build systems that are accessible, intuitive, and genuinely helpful to every customer group.", iconName: "Heart" },
  { title: "Uncompromising Integrity", desc: "Financial institutions run on trust. We protect customer data, maintain total transparency in reporting, and uphold the highest compliance standards.", iconName: "ShieldCheck" },
  { title: "Sustainable Stewardship", desc: "Capital is a tool for positive change. Every investment and loan we extend must align with a healthier, cleaner, and more equitable planet.", iconName: "Leaf" },
  { title: "Relentless Security", desc: "The threat landscape never rests. We employ quantum-ready cryptographic standards, AI monitoring, and zero-trust designs.", iconName: "Lock" }
];

export const strategicPillars = [
  {
    id: "retail",
    title: "Retail Banking Excellence",
    description: "Delivering mobile-first deposit, card, and lending facilities to millions worldwide, customized with AI financial advisers.",
    objectives: [
      "Grow global active checking and savings customer base by 15% annually.",
      "Achieve an industry-leading Net Promoter Score (NPS) above 82.",
      "Expand AI-assisted automated financial wellness advisors to all mobile accounts."
    ],
    stats: [
      { label: "Active Retail Users", value: "22.4M" },
      { label: "NPS Score", value: "85" },
      { label: "Mobile Share of Tx", value: "94%" }
    ],
    chartData: [
      { name: "2021", value: 12.5 },
      { name: "2022", value: 15.8 },
      { name: "2023", value: 19.2 },
      { name: "2024", value: 22.4 }
    ]
  },
  {
    id: "corporate",
    title: "Corporate & SME Solutions",
    description: "Providing secure transaction APIs, liquidity optimization, trade finance, and short-term capital options for enterprises.",
    objectives: [
      "Streamline cross-border B2B settlement times to sub-10 seconds via blockchain API ledgers.",
      "Extend capital loans to over 50,000 SMEs in developing regions.",
      "Offer real-time automated treasury management services."
    ],
    stats: [
      { label: "Corporate Clients", value: "18,500+" },
      { label: "SMEs Funded", value: "42,000" },
      { label: "Annual B2B Volume", value: "$18.5B" }
    ],
    chartData: [
      { name: "2021", value: 8.2 },
      { name: "2022", value: 11.4 },
      { name: "2023", value: 14.9 },
      { name: "2024", value: 18.5 }
    ]
  },
  {
    id: "wealth",
    title: "Wealth & Asset Management",
    description: "Offering premium advisory services, private equity access, and algorithmic index builders for high-net-worth clients.",
    objectives: [
      "Expand assets under management (AUM) to $50 Billion by 2027.",
      "Incorporate personalized ESG scorecards for every private portfolio.",
      "Introduce digital-twin investment simulators."
    ],
    stats: [
      { label: "AUM Volume", value: "$42.0B" },
      { label: "HNW Clients", value: "6,200" },
      { label: "ESG Portfolios Share", value: "72%" }
    ],
    chartData: [
      { name: "2021", value: 24.0 },
      { name: "2022", value: 29.5 },
      { name: "2023", value: 36.1 },
      { name: "2024", value: 42.0 }
    ]
  },
  {
    id: "international",
    title: "Global Investment & Markets",
    description: "Facilitating international trade capital, syndicate underwriting, and global currency hedging engines.",
    objectives: [
      "Add 3 major strategic currency hubs (Singapore, London, Frankfurt).",
      "Develop AI risk engines to predict sovereign debt fluctuations.",
      "Underwrite over $3B in clean infrastructure bonds."
    ],
    stats: [
      { label: "Global Hubs", value: "5 Hubs" },
      { label: "Bond Underwritings", value: "$3.2B" },
      { label: "Trade Desks", value: "24/7" }
    ],
    chartData: [
      { name: "2021", value: 1.1 },
      { name: "2022", value: 1.8 },
      { name: "2023", value: 2.5 },
      { name: "2024", value: 3.2 }
    ]
  }
];

export const innovationCenter = {
  description: "Surya Bank operates at the forefront of digital finance. Through our dedicated research laboratories, we build and deploy production-grade software solutions in security, intelligence, and distributed networks.",
  initiatives: [
    { title: "AI-Driven Risk Analytics Engine", desc: "Automated real-time underwriting systems analyzing millions of data points to provide loan responses in under 3 minutes with a 99.4% default protection rate.", tech: "TensorFlow, Python, Spark MLlib", status: "Production Active" },
    { title: "Zero-Trust Blockchain Ledgers", desc: "Institutional private ledger networks for instant international B2B settlement, eliminating intermediary fees and delays.", tech: "Hyperledger Fabric, Solidity, Rust", status: "Beta Pilot" },
    { title: "Quantum-Resistant Identity Protection", desc: "Upgrading all core databases and user authentications to quantum-safe lattice-based cryptography standards ahead of industry timelines.", tech: "Post-Quantum Cryptography (PQC), WebAuthn", status: "R&D Integration" },
    { title: "Omnichannel Open Banking APIs", desc: "Compliant, ultra-secure REST and Webhook APIs enabling fintech startups and developers to build custom money tools on our core rails.", tech: "Node.js, GraphQL, Kubernetes", status: "Production Active" }
  ]
};

export const esgData = {
  overview: "Our commitments under Sushanth NS extend beyond profit. We integrate Environmental conservation, Social empowerment, and transparent Governance standards into every operations cell.",
  environmental: [
    { label: "Carbon Neutrality Target", value: "2030" },
    { label: "Green Finance Capital Allocated", value: "$5.2B" },
    { label: "Paperless Operations Achieved", value: "98.7%" }
  ],
  social: [
    { label: "Rural Micro-finance Loans", value: "150,000+" },
    { label: "Financial Literacy Graduates", value: "450k" },
    { label: "CSR Investments (2024)", value: "$24M" }
  ],
  governance: [
    { label: "Board Independence Ratio", value: "85%" },
    { label: "Women in Leadership Roles", value: "42%" },
    { label: "Audit Committee Compliance", value: "100%" }
  ],
  charts: {
    carbonReduction: [
      { year: "2020", co2: 120 },
      { year: "2021", co2: 95 },
      { year: "2022", co2: 70 },
      { year: "2023", co2: 45 },
      { year: "2024", co2: 18 }
    ],
    diversityProgress: [
      { year: "2020", ratio: 24 },
      { year: "2021", ratio: 30 },
      { year: "2022", ratio: 35 },
      { year: "2023", ratio: 39 },
      { year: "2024", ratio: 42 }
    ]
  }
};

export const boardMembers = [
  { name: "Sushanth NS", role: "Founder, CEO & Chairman", committee: "Executive / Technology (Chair)" },
  { name: "Eleanor Vance", role: "Lead Independent Director", committee: "Audit (Chair) / Governance" },
  { name: "Dr. Aris Vance", role: "Independent Director (Risk)", committee: "Risk (Chair) / Compliance" },
  { name: "Meera Nair", role: "Non-Executive Director (ESG)", committee: "ESG & Sustainability (Chair)" },
  { name: "James Rutherford", role: "Independent Director (FinTech)", committee: "Technology / Risk" }
];

export const financialHighlights = {
  description: "Surya Bank continues to demonstrate strong capital efficiency, robust liquidity reserves, and high revenue expansion across all lines of business.",
  summary: [
    { label: "FY2024 Total Revenue", value: "$4.8B" },
    { label: "FY2024 Net Profit Margin", value: "31.2%" },
    { label: "CET1 Capital Ratio", value: "16.4%" },
    { label: "Liquidity Coverage Ratio", value: "185%" }
  ],
  dividendHistory: [
    { year: "2024", dividend: "$2.80", exDate: "Nov 12, 2024" },
    { year: "2023", dividend: "$2.40", exDate: "Nov 10, 2023" },
    { year: "2022", dividend: "$2.10", exDate: "Nov 14, 2022" },
    { year: "2021", dividend: "$1.85", exDate: "Nov 15, 2021" }
  ],
  chartData: [
    { year: "2021", revenue: 2.8, profit: 0.8 },
    { year: "2022", revenue: 3.4, profit: 1.1 },
    { year: "2023", revenue: 4.1, profit: 1.3 },
    { year: "2024", revenue: 4.8, profit: 1.5 }
  ]
};

export const mediaArticles = [
  {
    id: "1",
    title: "Surya Bank Founder Sushanth NS Named Global Banker of the Year",
    type: "Press Release",
    date: "June 15, 2026",
    snippet: "The World Finance Forum has named Sushanth NS as the Global Banker of the Year for his pioneering integration of green finance and distributed security frameworks.",
    content: "Sushanth NS, Founder, Chairman and CEO of Surya Bank, has been recognized as the 'Global Banker of the Year' at the World Finance Forum held in London. The award highlights the bank's achievements in sustainable finance, including the $5B green bond framework, and its industry-leading adoption of AI risk engines. In his acceptance speech, Mr. Sushanth dedicated the award to Surya Bank's 25 million customer community, calling for more collective climate action across commercial bank systems.",
    readTime: "4 min",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: "2",
    title: "Keynote Address: The Future of Quantum-Resistant Digital Banking Ledgers",
    type: "Speech",
    date: "April 22, 2026",
    snippet: "Read the full transcript of Sushanth NS's keynote address at the International Cybersecurity Symposium in Zurich.",
    content: "At the International Cybersecurity Symposium, Sushanth NS addressed the upcoming threats posed by quantum computing to standard public-key cryptography. He outlined Surya Bank's three-phase migration to post-quantum cryptography (PQC) standards. 'Financial entities that wait for quantum supremacy to emerge before securing their ledgers will fail their depositors. We are building the shield today,' he stated. The bank's research papers on lattice-based authentication algorithms were also made open-source.",
    readTime: "8 min",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "3",
    title: "Inclusive Finance: Bridging the Capital Gap in Developing Markets",
    type: "Interview",
    date: "February 04, 2026",
    snippet: "An in-depth conversation with Sushanth NS on how Surya Bank is empowering over 150,000 rural small business owners.",
    content: "In a detailed interview with Banking Tomorrow, Sushanth NS discussed Surya Bank's financial inclusion model. By deploying light-client banking solutions on low-bandwidth mobile devices and combining them with AI-driven cash flow analysis, the bank has successfully underwritten loans for 150,000 rural SMEs who lacked conventional credit scores. Mr. Sushanth stressed that local entrepreneurship is the fastest driver of GDP expansion and capital sustainability in emerging economies.",
    readTime: "6 min"
  }
];

export const awardsList = [
  { year: "2026", title: "Global Banker of the Year", organization: "World Finance Forum", description: "Awarded to Sushanth NS for exemplary leadership and commitment to ESG financing." },
  { year: "2025", title: "FinTech Pioneer of the Year", organization: "Global Banking Tech Awards", description: "Recognizing Surya Bank's deployment of zero-trust settlement pipelines and AI underwriting." },
  { year: "2024", title: "Environmental Stewardship Excellence", organization: "Global ESG Council", description: "For the launching and execution of the $5B Green Infrastructure Bond program." },
  { year: "2023", title: "Outstanding Security Innovation", organization: "Cybersecurity In Banking League", description: "For pioneering early-stage lattice-based cryptographic integration on mobile wallets." }
];

export const upcomingEvents = [
  { id: "e1", title: "Q3 FY2026 Earnings Webcast", date: "August 12, 2026", time: "14:00 GMT", location: "Live Streaming (Investor Portal)", category: "Investor Relations", registrationRequired: true },
  { id: "e2", title: "Annual Board of Directors Meeting", date: "September 05, 2026", time: "09:00 IST", location: "Surya Bank HQ, Boardroom A / Secure Video Link", category: "Board Meeting", registrationRequired: false },
  { id: "e3", title: "Surya Bank Global Tech Summit 2026", date: "October 20, 2026", time: "10:00 EST", location: "Convention Center, New York / Hybrid", category: "Product Launch", registrationRequired: true },
  { id: "e4", title: "Rural Literacy Outreach Program Launch", date: "November 14, 2026", time: "11:00 IST", location: "Community Hubs (Multiple)", category: "CSR Program", registrationRequired: true }
];

export const publicationsLibrary = [
  { id: "p1", title: "Annual Shareholder Letter (FY2025)", category: "Annual Letters", description: "CEO Sushanth NS reviews the record earnings, environmental progress, and digital upgrades of the past fiscal year.", docUrl: "p1" },
  { id: "p2", title: "Quantum Security Migration Path for Enterprise Financial Ledgers", category: "Whitepapers", description: "A technical research paper detailing lattice-based cryptographic strategies in transactional architectures.", docUrl: "p2" },
  { id: "p3", title: "Empirical Analysis of Mobile Micro-Underwriting Performance", category: "Research", description: "An academic study examining default rates and inclusion metrics across 150,000 active SME loans.", docUrl: "p3" },
  { id: "p4", title: "Surya Bank Corporate ESG Framework & Reporting Guidelines", category: "Corporate Reports", description: "Detailed carbon footprint calculations, corporate gender balance indexes, and community impact indicators.", docUrl: "p4" }
];

export const galleryItems = [
  { id: "g1", imageUrl: "/sns.jpg", category: "Leadership", caption: "Sushanth NS presenting at the World Finance Forum in London", date: "June 2026" },
  { id: "g2", imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", category: "Conferences", caption: "Keynote presentation at the Zurich Cybersecurity Symposium", date: "April 2026" },
  { id: "g3", imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800", category: "Awards", caption: "Receiving the FinTech Pioneer Award on behalf of Surya Bank team", date: "November 2025" },
  { id: "g4", imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800", category: "Banking Events", caption: "Official ribbon-cutting ceremony for the Singapore Global Hub Office", date: "September 2025" },
  { id: "g5", imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", category: "CSR", caption: "Reviewing community finance operations with local program leaders", date: "July 2025" },
  { id: "g6", imageUrl: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800", category: "International Visits", caption: "Strategic banking collaboration meeting with European Central delegates", date: "May 2025" }
];

export const investorFAQs = [
  { question: "Where is Surya Bank traded publicly?", answer: "Surya Bank is listed on NYSE and NSE. Check the Investor Relations page for real-time ticket symbols and trading performance documents." },
  { question: "What is Surya Bank's current dividend distribution policy?", answer: "We aim to maintain a dividend payout ratio of 35-40% of net net income. Dividend announcements are usually made in late October with payments in mid-November." },
  { question: "How does the bank manage climate-related risks?", answer: "Our ESG committee reviews loan portfolios weekly. We do not extend credit to coal-fired energy or fossil extraction projects, and we actively discount green loan interest rates to support clean transitions." }
];

// Helper to convert HTML content or simple text to a printable PDF format
export const generatePdfLetter = (letterTitle, letterContent, userEmail) => {
  const doc = new jsPDF();
  
  const drawBackground = () => {
    // Draw light watermark security pattern
    doc.setTextColor(240, 240, 240);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("SURYA BANK • SECURE OFFICIAL RELEASE", 30, 120, { angle: 315 });
    doc.text("SURYA BANK • SECURE OFFICIAL RELEASE", 30, 190, { angle: 315 });
  };

  const drawHeader = () => {
    // Header banner background
    doc.setFillColor(7, 26, 53); // CEO Navy
    doc.rect(0, 0, 210, 35, 'F');
    
    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("SURYA BANK", 20, 22);
    
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text("Office of the CEO, Chairman & Founder", 130, 22);
  };

  const drawFooter = () => {
    // Cryptographic audit footnote footer
    doc.setTextColor(140, 140, 140);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`AUDIT ID: SB-DL-${Math.random().toString(36).substr(2, 9).toUpperCase()} | CLEARANCE LEVEL: LEVEL 5 - CEO OFFICE`, 20, 280);
    doc.text(`VERIFICATION HASH: SHA256-${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`, 20, 285);
    doc.text(`ISSUED SECURELY TO: ${userEmail || 'guest@suryabank.com'} | SYSTEM TIME: ${new Date().toISOString()}`, 20, 290);
  };

  drawBackground();
  drawHeader();

  // Title
  doc.setTextColor(7, 26, 53);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text(letterTitle, 20, 50);
  
  // Date & Document reference
  doc.setFontSize(9);
  doc.setFont("Helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: July 2026 | Document Ref: SH-LTR-2026-${Math.floor(1000 + Math.random() * 9000)}`, 20, 58);
  
  // Divider line
  doc.setDrawColor(212, 175, 55); // Gold
  doc.setLineWidth(0.75);
  doc.line(20, 62, 190, 62);
  
  // Letter Content with formal paragraph settings
  doc.setTextColor(40, 40, 40);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  
  const splitText = doc.splitTextToSize(letterContent, 170);
  let yPos = 72;

  for (let i = 0; i < splitText.length; i++) {
    if (yPos > 260) {
      drawFooter();
      doc.addPage();
      drawBackground();
      drawHeader();
      yPos = 50;
      doc.setTextColor(40, 40, 40);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
    }
    doc.text(splitText[i], 20, yPos);
    yPos += 6;
  }
  
  // Ensure room for signature
  if (yPos > 210) {
    drawFooter();
    doc.addPage();
    drawBackground();
    drawHeader();
    yPos = 50;
  }
  
  yPos += 15;

  // Signature layout area
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 80, yPos);
  
  // Signee name and title
  doc.setTextColor(7, 26, 53);
  doc.setFont("Helvetica", "bold");
  doc.text("Sushanth NS", 20, yPos + 6);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.text("CEO & Chairman, Surya Bank Group", 20, yPos + 11);
  
  // Dynamic secure seal
  doc.setDrawColor(212, 175, 55);
  doc.rect(140, yPos - 5, 50, 22, 'S');
  doc.setTextColor(212, 175, 55);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.text("SURYA BANK", 152, yPos);
  doc.text("OFFICIAL SEAL", 150, yPos + 5);
  doc.setFont("Helvetica", "normal");
  doc.text("VERIFIED SIGNATURE", 145, yPos + 10);
  doc.text(`ID: ${Math.random().toString(36).substr(2, 6).toUpperCase()}`, 154, yPos + 14);

  drawFooter();

  // Save PDF locally
  doc.save(`${letterTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.pdf`);

  // Write dynamic audit log to Firebase
  try {
    addDoc(collection(db, 'ceo_download_logs'), {
      documentId: `${letterTitle.substring(0, 30)}...`,
      userEmail: userEmail || 'guest@suryabank.com',
      timestamp: new Date().toISOString(),
      action: 'Exported Shareholder Message as Signed PDF',
      ip: '127.0.0.1'
    });
  } catch (err) {
    console.error("Failed to write to download audit logs:", err);
  }
};

// --- NEW DATA FOR EXECUTIVE HONORS PORTAL ---

export const extendedAwardsList = [
  { 
    id: "aw1",
    year: "2026", 
    title: "Global Banker of the Year", 
    organization: "World Finance Forum", 
    category: "Leadership",
    country: "United Kingdom",
    location: "London, UK",
    presenter: "Sir Evelyn de Rothschild",
    date: "June 15, 2026",
    description: "Awarded to Sushanth NS for exemplary leadership and commitment to ESG financing on a global scale.",
    officialCitation: "For redefining modern banking with a core focus on sustainability, equitable wealth distribution, and unyielding cryptographic security.",
    achievementSummary: "Spearheaded the integration of $5B green infrastructure bonds while maintaining industry-leading profitability.",
    verificationStatus: "Verified via Blockchain",
    verificationHash: "0x8F9A2C...4B21",
    certificateNumber: "WFF-2026-GB-01",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    imageUrl: "/sns.jpg",
    pressRelease: "Surya Bank CEO named Global Banker of the Year..."
  },
  { 
    id: "aw2",
    year: "2025", 
    title: "FinTech Pioneer of the Year", 
    organization: "Global Banking Tech Awards", 
    category: "Technology",
    country: "Singapore",
    location: "Marina Bay Sands, Singapore",
    presenter: "MAS Managing Director",
    date: "November 10, 2025",
    description: "Recognizing Surya Bank's deployment of zero-trust settlement pipelines and AI underwriting.",
    officialCitation: "For pushing the boundaries of AI integration in retail banking, reducing loan decision latency to sub-3 minutes.",
    achievementSummary: "Built the fastest AI underwriting engine in APAC.",
    verificationStatus: "Verified via Digital Signature",
    verificationHash: "0x3A1B9C...7D42",
    certificateNumber: "GBT-2025-FP-44",
    videoUrl: null,
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    pressRelease: "Surya Bank recognized for AI supremacy..."
  },
  { 
    id: "aw3",
    year: "2024", 
    title: "Environmental Stewardship Excellence", 
    organization: "Global ESG Council", 
    category: "ESG",
    country: "Switzerland",
    location: "Geneva, Switzerland",
    presenter: "UN Environment Programme Director",
    date: "April 22, 2024",
    description: "For the launching and execution of the $5B Green Infrastructure Bond program.",
    officialCitation: "For demonstrating that massive capital mobilization for climate action is highly compatible with shareholder returns.",
    achievementSummary: "Raised and deployed $5 Billion towards renewable energy projects worldwide.",
    verificationStatus: "Verified by UN",
    verificationHash: "0x7E4D2A...9F11",
    certificateNumber: "ESG-2024-ES-08",
    videoUrl: null,
    imageUrl: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&q=80&w=800",
    pressRelease: "Surya Bank wins top ESG honors..."
  },
  { 
    id: "aw4",
    year: "2023", 
    title: "Outstanding Security Innovation", 
    organization: "Cybersecurity In Banking League", 
    category: "Innovation",
    country: "United States",
    location: "San Francisco, USA",
    presenter: "Director of CISA",
    date: "October 14, 2023",
    description: "For pioneering early-stage lattice-based cryptographic integration on mobile wallets.",
    officialCitation: "For fortifying consumer finance against quantum threats before the industry standard mandated it.",
    achievementSummary: "Deployed post-quantum cryptography to 25 million mobile wallets.",
    verificationStatus: "Cryptographically Verified",
    verificationHash: "0x1C2D3E...4F5G",
    certificateNumber: "CBL-2023-OSI-99",
    videoUrl: null,
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    pressRelease: "Surya Bank sets new security standard..."
  },
  { 
    id: "aw5",
    year: "2021", 
    title: "CEO of the Decade (Asia-Pacific)", 
    organization: "Asian Finance Weekly", 
    category: "Leadership",
    country: "Hong Kong",
    location: "Hong Kong",
    presenter: "Financial Secretary of HK",
    date: "December 05, 2021",
    description: "Honoring ten years of unprecedented growth and steadfast leadership.",
    officialCitation: "For transforming a regional banking platform into a global financial powerhouse.",
    achievementSummary: "Grew Surya Bank AUM by 400% over the decade.",
    verificationStatus: "Verified",
    verificationHash: "0x9A8B7C...6D5E",
    certificateNumber: "AFW-2021-CEO-01",
    videoUrl: null,
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=800",
    pressRelease: "Sushanth NS named CEO of the Decade..."
  }
];

export const awardsAnalytics = {
  awardsByYear: [
    { year: "2015", count: 1 },
    { year: "2018", count: 3 },
    { year: "2021", count: 5 },
    { year: "2023", count: 8 },
    { year: "2024", count: 12 },
    { year: "2025", count: 15 },
    { year: "2026", count: 18 }
  ],
  awardsByCategory: [
    { name: "Leadership", value: 35 },
    { name: "Technology", value: 25 },
    { name: "ESG", value: 20 },
    { name: "Innovation", value: 15 },
    { name: "Other", value: 5 }
  ],
  globalDistribution: [
    { region: "North America", count: 14 },
    { region: "Europe", count: 18 },
    { region: "Asia-Pacific", count: 22 },
    { region: "Middle East", count: 6 },
    { region: "South America", count: 2 }
  ]
};

export const leadershipImpactData = {
  innovation: "Surya Bank allocates 15% of annual net income purely to exploratory fintech R&D. Our quantum-resilient ledgers and AI underwriting engines were built in-house, securing 12 global patents.",
  esg: "Under Sushanth NS's mandate, Surya Bank has committed $5B to green infrastructure and maintains a zero-tolerance policy for fossil fuel expansion financing.",
  governance: "Maintained a 100% compliance record across 15 regulatory jurisdictions with an entirely independent audit committee."
};

// --- NEW DATA FOR STRATEGIC VISION & TRANSFORMATION HUB ---

export const strategicKPIs = {
  visionProgress: 78,
  initiatives: 24,
  digitalAdoption: 94,
  aiTransformationIndex: 88,
  customerSatisfaction: 85,
  financialInclusion: 92,
  esgProgress: 81,
  innovationProjects: 12,
  countriesServed: 15,
  activePrograms: 36,
  strategicInvestments: "$2.4B",
  transformationScore: "A+"
};

export const transformationAnalytics = {
  investmentAllocation: [
    { name: "AI & Automation", value: 35 },
    { name: "Cybersecurity", value: 25 },
    { name: "Green Tech", value: 20 },
    { name: "Open Banking", value: 15 },
    { name: "Legacy Migrations", value: 5 }
  ],
  progressByPillar: [
    { pillar: "Digital Banking", progress: 95 },
    { pillar: "AI Integration", progress: 88 },
    { pillar: "Customer Exp", progress: 85 },
    { pillar: "Inclusion", progress: 92 },
    { pillar: "Expansion", progress: 75 },
    { pillar: "Sustainability", progress: 81 },
    { pillar: "Cybersecurity", progress: 90 },
    { pillar: "System Innovation", progress: 70 }
  ],
  innovationIndex: [
    { year: "2021", score: 45 },
    { year: "2022", score: 60 },
    { year: "2023", score: 72 },
    { year: "2024", score: 85 },
    { year: "2025", score: 92 },
    { year: "2026", score: 98 }
  ],
  budgetVsActual: [
    { category: "R&D", budget: 100, actual: 95 },
    { category: "Security", budget: 150, actual: 160 },
    { float: "Marketing", budget: 80, actual: 75 },
    { category: "Infrastructure", budget: 200, actual: 190 }
  ]
};

export const extendedVisionPillars = [
  { 
    id: "v1",
    title: "Digital Banking", 
    desc: "Achieving friction-free global mobile account access, custom digital wallets, and zero-fee borders.", 
    detail: "Transitioning 100% of retail transactions to instant cloud-native structures, bypassing legacy ACH delays.",
    icon: "Smartphone",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400",
    progress: 95,
    phase: "Optimization",
    completion: "Q4 2026",
    health: "On Track",
    owner: "Eleanor Vance (CTO)",
    priority: "High",
    budget: "$450M",
    objectives: ["100% Cloud Native", "Zero-Fee Borders", "Sub-second Settlement"],
    kpis: ["99.999% Uptime", "50M Mobile MAUs", "Zero API Latency"],
    risks: ["Legacy system migration delays", "Cloud provider outages"],
    mitigation: "Multi-cloud active-active redundancy and phased microservice rollout.",
    opportunities: ["Embedded finance in non-banking apps"]
  },
  { 
    id: "v2",
    title: "AI Banking Integration", 
    desc: "Deploying automated cash-flow predictive models, smart savings prompts, and algorithmic credit checks.", 
    detail: "Leveraging large-language intelligence models to process micro-underwriting in less than 3 minutes.",
    icon: "Brain",
    color: "from-purple-500/20 to-pink-500/20 text-purple-400",
    progress: 88,
    phase: "Scaling",
    completion: "Q2 2027",
    health: "On Track",
    owner: "Dr. Aris Vance (Chief Data Officer)",
    priority: "Critical",
    budget: "$600M",
    objectives: ["Auto-underwriting", "Predictive Cashflow", "AI Wealth Advisors"],
    kpis: ["3 Min Loan Decision", "85% AI Resolution", "Zero Hallucination Tolerance"],
    risks: ["Algorithmic bias", "Data privacy breaches"],
    mitigation: "Continuous model auditing by independent ethics committee and federated learning.",
    opportunities: ["Hyper-personalized wealth management"]
  },
  { 
    id: "v3",
    title: "Customer Experience", 
    desc: "Delivering empathetic, personalized interfaces that anticipate consumer needs and resolve tickets.", 
    detail: "Providing 24/7 localized human-AI hybrid support channels, maintaining a Net Promoter Score above 82.",
    icon: "Heart",
    color: "from-rose-500/20 to-red-500/20 text-rose-400",
    progress: 85,
    phase: "Execution",
    completion: "Ongoing",
    health: "At Risk (Minor)",
    owner: "Sarah Jenkins (CXO)",
    priority: "High",
    budget: "$250M",
    objectives: ["Proactive Support", "Omnichannel Parity", "Empathetic Design"],
    kpis: ["NPS > 82", "First Contact Resolution 90%", "App Rating > 4.8"],
    risks: ["Over-reliance on AI frustrating users"],
    mitigation: "Instant human-handoff protocol if sentiment drops below threshold.",
    opportunities: ["Voice-activated banking"]
  },
  { 
    id: "v4",
    title: "Financial Inclusion", 
    desc: "Opening access channels for unbanked micro-enterprises in emerging trade networks.", 
    detail: "Providing alternative credit evaluation formulas to fund 150,000+ small merchants in low-bandwidth regions.",
    icon: "Users",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
    progress: 92,
    phase: "Scaling",
    completion: "Q4 2026",
    health: "On Track",
    owner: "Meera Nair (Head of ESG)",
    priority: "Medium",
    budget: "$150M",
    objectives: ["Fund 150k SMEs", "Low-bandwidth Apps", "Alt-Credit Scoring"],
    kpis: ["150k Micro-loans Issued", "Default Rate < 2%", "Rural Adoption Rate"],
    risks: ["Macro-economic instability in emerging markets"],
    mitigation: "Diversified geographic portfolio and micro-insurance bundling.",
    opportunities: ["Capturing loyalty of high-growth developing market merchants"]
  },
  {
    id: "v5",
    title: "Global Expansion",
    desc: "Connecting local treasury lines directly with international centers in New York, London, and Singapore.",
    detail: "Facilitating multi-currency corporate settlement corridors compliant with local regulatory policies.",
    icon: "Globe",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400",
    progress: 75,
    phase: "Planning",
    completion: "Q4 2028",
    health: "On Track",
    owner: "James Rutherford (Head of Markets)",
    priority: "Medium",
    budget: "$800M",
    objectives: ["Establish 3 Hubs", "24/7 Trade Desks", "Cross-border compliance"],
    kpis: ["$50B Cross-border Volume", "Zero Regulatory Fines", "Launch in 5 new EU countries"],
    risks: ["Regulatory pushback in new jurisdictions"],
    mitigation: "Early engagement with local regulators and joint ventures.",
    opportunities: ["Capturing underserved SME cross-border trade flows"]
  },
  {
    id: "v6",
    title: "Sustainable Finance",
    desc: "Directing deposits exclusively to clean energy projects and green infrastructure syndications.",
    detail: "Diverting capital away from fossil fuels, backed by our audited $5B green bond allocation frame.",
    icon: "Leaf",
    color: "from-green-500/20 to-emerald-500/20 text-green-400",
    progress: 81,
    phase: "Execution",
    completion: "2030 (Net Zero target)",
    health: "On Track",
    owner: "Meera Nair (Head of ESG)",
    priority: "High",
    budget: "$5B (Capital Allocation)",
    objectives: ["$5B Green Bonds", "Zero Fossil Fuel Funding", "Carbon Neutral Ops"],
    kpis: ["100% Clean Portfolio", "Scope 1,2,3 Emissions", "Green Bond Yield"],
    risks: ["Greenwashing accusations if auditing fails"],
    mitigation: "Third-party rigorous carbon auditing and public ledger transparency.",
    opportunities: ["Premium pricing for certified green loans"]
  },
  {
    id: "v7",
    title: "Cybersecurity Shield",
    desc: "Integrating lattice post-quantum cryptography to secure core transaction databases.",
    detail: "Employing continuous AI threat auditing and zero-trust verification structures across all wallets.",
    icon: "Shield",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400",
    progress: 90,
    phase: "Optimization",
    completion: "Q1 2027",
    health: "On Track",
    owner: "Michael Chang (CISO)",
    priority: "Critical",
    budget: "$350M",
    objectives: ["PQC Migration", "Zero-Trust Network", "AI Threat Hunting"],
    kpis: ["0 Data Breaches", "100% PQC Coverage", "Mean Time To Respond (MTTR) < 5m"],
    risks: ["Performance overhead of PQC algorithms"],
    mitigation: "Hardware acceleration and optimized lattice libraries.",
    opportunities: ["Licensing security tech to other financial institutions"]
  },
  {
    id: "v8",
    title: "System Innovation",
    desc: "Building open banking APIs so developers can deploy fintech apps directly on Surya Bank rails.",
    detail: "Providing fully compliant GraphQL developer endpoints to accelerate third-party wealth tool builds.",
    icon: "Zap",
    color: "from-orange-500/20 to-yellow-500/20 text-orange-400",
    progress: 70,
    phase: "Execution",
    completion: "Q3 2027",
    health: "Delayed",
    owner: "Eleanor Vance (CTO)",
    priority: "Medium",
    budget: "$120M",
    objectives: ["GraphQL API Launch", "Developer Portal", "99.99% Sandbox Uptime"],
    kpis: ["500+ Active 3rd Party Devs", "10M API calls/day", "$50M API Revenue"],
    risks: ["Third-party data misuse"],
    mitigation: "Strict API token scoping, rate limiting, and continuous auditing.",
    opportunities: ["Creating a 'Plaid-like' ecosystem on Surya Bank rails"]
  }
];

export const globalExpansionData = {
  currentOperations: ["US", "UK", "Switzerland", "Singapore", "Hong Kong", "India", "UAE", "Australia"],
  futureExpansions: ["Germany", "France", "Japan", "Brazil", "South Africa"],
  nodes: [
    { country: 'US', x: 20, y: 35, status: 'active', metric: '4.2M Users' },
    { country: 'Brazil', x: 28, y: 70, status: 'planned', metric: 'Market Entry Q3' },
    { country: 'UK', x: 45, y: 30, status: 'active', metric: '1.8M Users' },
    { country: 'Germany', x: 48, y: 32, status: 'planned', metric: 'License Pending' },
    { country: 'UAE', x: 60, y: 45, status: 'active', metric: 'Corporate Hub' },
    { country: 'India', x: 70, y: 48, status: 'active', metric: '12M Users' },
    { country: 'Singapore', x: 78, y: 60, status: 'active', metric: 'APAC HQ' },
    { country: 'Japan', x: 85, y: 38, status: 'planned', metric: 'Partner Search' },
    { country: 'Australia', x: 88, y: 75, status: 'active', metric: '800k Users' }
  ]
};

export const successStoriesData = [
  {
    title: "Project Quantum Leap",
    outcome: "Migrated 25M wallets to Post-Quantum Cryptography with zero downtime.",
    impact: "Secured $42B AUM against future quantum decryption attacks.",
    pillar: "Cybersecurity Shield",
    lessons: "Hardware acceleration is critical for lattice cryptography overhead."
  },
  {
    title: "Project Green Earth",
    outcome: "Fully deployed the $5B green bond allocation ahead of schedule.",
    impact: "Funded 12 major solar/wind projects; reduced carbon footprint by 40%.",
    pillar: "Sustainable Finance",
    lessons: "Rigorous third-party auditing is essential for investor trust."
  }
];

export const investorViewData = {
  valueCreation: "Surya Bank's strategy focuses on high margin digital acquisition, retaining customers through AI-driven personalization, and securing massive corporate liquidity flows via blockchain APIs.",
  capitalAllocation: "60% Growth Initiatives, 20% Dividend Returns, 20% Security & Resilience.",
  innovationPipeline: "Q3 2026: AI Wealth Advisors. Q1 2027: Predictive Sovereign Debt Models. Q4 2027: fully decentralized settlement rails.",
  futureOutlook: "Projecting a 15% CAGR in revenue and 18% CAGR in net profits through 2030, driven by emerging market adoption and premium corporate APIs."
};

// --- NEW DATA FOR EXECUTIVE STRATEGY & TRANSFORMATION COMMAND CENTER ---

export const strategyExecKPIs = {
  overallProgress: 82,
  activeInitiatives: 45,
  businessUnits: 9,
  countriesServed: 18,
  strategicInvestments: "$8.5B",
  aiIndex: 94,
  digitalAdoption: 96,
  esgProgress: 88,
  customerGrowth: "+12.4%",
  innovationScore: 92,
  revenueGrowth: "+18.2%",
  marketShare: "14%"
};

export const extendedStrategyPillars = [
  {
    id: "retail",
    title: "Retail Banking",
    icon: "Users",
    description: "Empowering mobile depositors with AI financial advisors, competitive savings tools, and card facilities.",
    mission: "To become the primary financial relationship for 100M+ global consumers through frictionless, intelligent mobile banking.",
    objectives: [
      "Launch smart automated budget calculators for retail mobile wallets.",
      "Achieve average check underwriting times below 10 seconds.",
      "Maintain active Net Promoter Score (NPS) above 82."
    ],
    metrics: [
      { label: "Active Retail Users", value: "22.4M" },
      { label: "NPS Score", value: "85" },
      { label: "Mobile Share of Tx", value: "94%" }
    ],
    chartData: [
      { year: "2021", assets: 10 },
      { year: "2022", assets: 13.5 },
      { year: "2023", assets: 18 },
      { year: "2024", assets: 22.4 }
    ],
    growthLabel: "Active Accounts (Millions)",
    timeline: "Q1 2025 - Q4 2027",
    budget: "$1.2B",
    roi: "22% IRR projected by 2028",
    sponsor: "Sarah Jenkins (CXO)",
    department: "Consumer Banking",
    projectManager: "David Chen",
    supportingTeams: ["Mobile Dev", "AI Analytics", "Retail Risk"],
    status: "Scaling",
    progress: 85,
    dependencies: ["Core Ledger Migration", "AI Chatbot v2.0"],
    risks: ["Aggressive neo-bank customer acquisition", "Data privacy legislation changes"],
    mitigation: "Lock-in via high-yield savings tied to direct deposit, proactive GDPR compliance auditing."
  },
  {
    id: "corporate",
    title: "Corporate Banking",
    icon: "Target",
    description: "Enterprise treasury pipelines, liquidity pooling solutions, and international B2B settlement rails.",
    mission: "Provide real-time, cross-border treasury dominance for multinational Fortune 1000 enterprises.",
    objectives: [
      "Streamline corporate B2B remittance times using private ledgers.",
      "Connect European commercial divisions directly to Southeast Asian corridors.",
      "Provide real-time automated treasury management services."
    ],
    metrics: [
      { label: "Corporate Clients", value: "18,500+" },
      { label: "SME Support", value: "42,000" },
      { label: "Annual Volume", value: "$18.5B" }
    ],
    chartData: [
      { year: "2021", assets: 8 },
      { year: "2022", assets: 11.2 },
      { year: "2023", assets: 15 },
      { year: "2024", assets: 18.5 }
    ],
    growthLabel: "Annual Transaction Volume ($B)",
    timeline: "Q3 2024 - Q4 2026",
    budget: "$2.5B",
    roi: "18% IRR, $500M fee revenue",
    sponsor: "James Rutherford (Head of Markets)",
    department: "Corporate Treasury",
    projectManager: "Elena Rostova",
    supportingTeams: ["Blockchain Dev", "FX Trading", "Corporate Compliance"],
    status: "Execution",
    progress: 72,
    dependencies: ["Regulatory approval in EU/SG", "Quantum-safe encryption layer"],
    risks: ["Geopolitical sanctions interrupting settlement corridors"],
    mitigation: "Dynamic routing algorithms and isolated jurisdictional ledgers."
  },
  {
    id: "digital",
    title: "Digital Infrastructure",
    icon: "Zap",
    description: "Core cloud banking engines, microservices architectures, and instant API ledgers.",
    mission: "Build a zero-latency, infinitely scalable, and quantum-resistant core banking substrate.",
    objectives: [
      "Achieve 99.999% uptime for core ledger clusters on distributed servers.",
      "Decouple customer database layers into secure container clusters.",
      "Reduce server transaction latencies to sub-5 milliseconds."
    ],
    metrics: [
      { label: "System Uptime", value: "99.999%" },
      { label: "API Requests/Min", value: "250k" },
      { label: "Core Latency", value: "4.2ms" }
    ],
    chartData: [
      { year: "2021", assets: 50 },
      { year: "2022", assets: 120 },
      { year: "2023", assets: 190 },
      { year: "2024", assets: 250 }
    ],
    growthLabel: "API Traffic (K Requests / min)",
    timeline: "Q1 2023 - Q4 2026",
    budget: "$3.0B",
    roi: "$1.2B annual opex reduction",
    sponsor: "Eleanor Vance (CTO)",
    department: "Engineering",
    projectManager: "Dr. Marcus Thorne",
    supportingTeams: ["Cloud Ops", "Platform Engineering", "Site Reliability"],
    status: "Optimization",
    progress: 92,
    dependencies: ["AWS/GCP Enterprise Agreements", "Hardware Cryptography Modules"],
    risks: ["Cloud provider catastrophic failure", "Migration data loss"],
    mitigation: "Multi-cloud active-active architecture, zero-downtime shadow database mirroring."
  },
  {
    id: "green_finance",
    title: "Green Finance",
    icon: "Leaf",
    description: "Sustaining ecological health via targeted clean-energy capital allocations and green bonds.",
    mission: "Lead the global transition to Net Zero by aggressively reallocating capital to sustainable infrastructure.",
    objectives: [
      "Commit $5 Billion to sustainable solar, wind, and smart grid developments.",
      "Audit carbon profiles of all institutional corporate loan portfolios.",
      "Offer interest rate rebates to companies achieving verified climate goals."
    ],
    metrics: [
      { label: "Green Capital", value: "$5.2B" },
      { label: "Net Zero Target", value: "2030" },
      { label: "Projects Funded", value: "128" }
    ],
    chartData: [
      { year: "2021", assets: 1.5 },
      { year: "2022", assets: 2.8 },
      { year: "2023", assets: 4.1 },
      { year: "2024", assets: 5.2 }
    ],
    growthLabel: "Green Finance Capital Allocated ($B)",
    timeline: "2025 - 2030",
    budget: "$5.0B Allocation",
    roi: "Brand equity, regulatory benefits, 8% Yield",
    sponsor: "Meera Nair (Head of ESG)",
    department: "Sustainability & Investment",
    projectManager: "Julian Bates",
    supportingTeams: ["ESG Auditing", "Risk Management", "Corporate Lending"],
    status: "Execution",
    progress: 81,
    dependencies: ["Global carbon pricing frameworks", "Third-party ESG auditors"],
    risks: ["Greenwashing reputational damage", "Underperformance of green tech"],
    mitigation: "Strict adherence to SBTi (Science Based Targets initiative) and diversified tech funding."
  }
];

export const macroEconomicData = {
  indicators: [
    { name: "Global Inflation Rate", value: "3.2%", trend: "down" },
    { name: "Fed Funds Target", value: "4.50%", trend: "stable" },
    { name: "ECB Rate", value: "3.75%", trend: "down" },
    { name: "US GDP Growth (Est)", value: "2.1%", trend: "up" },
    { name: "USD/EUR", value: "0.92", trend: "stable" },
    { name: "S&P 500 Bank Index", value: "+14%", trend: "up" }
  ],
  competitorComparison: [
    { bank: "Surya Bank", digitalAdoption: 94, roe: 15.2, costIncomeRatio: 42, npa: 1.1 },
    { bank: "JPMorgan Chase", digitalAdoption: 82, roe: 14.8, costIncomeRatio: 54, npa: 1.4 },
    { bank: "Goldman Sachs", digitalAdoption: 78, roe: 11.5, costIncomeRatio: 65, npa: 1.2 },
    { bank: "DBS Bank", digitalAdoption: 89, roe: 16.2, costIncomeRatio: 41, npa: 1.0 }
  ]
};

export const strategyRoadmapNodes = {
  vision: "Global Financial Dominance & Tech Innovation",
  objectives: [
    { name: "100M+ Retail Users", status: "Active", progress: 75 },
    { name: "Zero-Latency Settlements", status: "Active", progress: 92 },
    { name: "Net Zero by 2030", status: "Active", progress: 45 }
  ],
  pillars: [
    { name: "Digital Substrate", objective: "Zero-Latency Settlements", budget: "$3B" },
    { name: "AI Underwriting", objective: "100M+ Retail Users", budget: "$1.2B" },
    { name: "Green Bond Issuance", objective: "Net Zero by 2030", budget: "$5B" }
  ],
  projects: [
    { name: "Post-Quantum Auth", pillar: "Digital Substrate", eta: "Q2 2026", status: "On Track" },
    { name: "GraphQL APIs", pillar: "Digital Substrate", eta: "Q4 2026", status: "Delayed" },
    { name: "Predictive Cashflow Models", pillar: "AI Underwriting", eta: "Q1 2027", status: "On Track" },
    { name: "Solar Syndicate Alpha", pillar: "Green Bond Issuance", eta: "Q3 2026", status: "Completed" }
  ]
};

export const execAnalytics = {
  budgetVsActual: [
    { category: "Retail", budget: 1200, actual: 1150 },
    { category: "Corporate", budget: 2500, actual: 2600 },
    { category: "Digital Infrastructure", budget: 3000, actual: 2900 },
    { category: "ESG", budget: 500, actual: 480 },
    { category: "Wealth", budget: 800, actual: 750 }
  ],
  revenueContribution: [
    { name: "Retail", value: 35 },
    { name: "Corporate", value: 40 },
    { name: "Wealth", value: 15 },
    { name: "Investment", value: 10 }
  ]
};

