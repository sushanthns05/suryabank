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
