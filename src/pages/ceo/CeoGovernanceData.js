// Governance Mock Data for Surya Bank Executive Command Center

export const governanceKPIs = {
  boardMembers: 12,
  independentDirectors: 9,
  executiveDirectors: 3,
  committees: 7,
  corporatePolicies: 142,
  governanceScore: 94.5,
  complianceScore: 98.2,
  meetingsThisYear: 24,
  committeeMeetings: 56,
  pendingActions: 12,
  resolutionsPassed: 45,
  openIssues: 3,
  auditCompletion: 100,
  esgScore: 92.4,
  riskOversight: 96.8,
  techGovernance: 97.5,
};

export const kpiTrends = [
  { name: 'Q1', governance: 91, compliance: 95, risk: 90, esg: 88 },
  { name: 'Q2', governance: 92, compliance: 96, risk: 92, esg: 89 },
  { name: 'Q3', governance: 93, compliance: 97, risk: 94, esg: 91 },
  { name: 'Q4', governance: 94.5, compliance: 98.2, risk: 96.8, esg: 92.4 },
];

export const executiveProfiles = {
  "Sushanth NS": {
    name: "Sushanth NS",
    title: "Founder, Chairman & CEO",
    bio: "Sushanth NS is the visionary founder of Surya Bank. Under his leadership, the institution transitioned into an AI-first, quantum-secure global banking powerhouse.",
    qualifications: ["MBA, Wharton", "MS Computer Science, Stanford"],
    experience: "25+ Years",
    committees: ["Executive (Chair)", "Technology"],
    initiatives: ["Quantum Ledger Migration", "$5B ESG Bond"],
    location: "Global HQ, New York",
    image: "/sns.jpg"
  },
  "Eleanor Vance": {
    name: "Eleanor Vance",
    title: "Lead Independent Director",
    bio: "Former Central Bank Governor with deep expertise in macroeconomic policy and sovereign risk. She ensures the board maintains absolute independence from management.",
    qualifications: ["Ph.D. Economics, LSE"],
    experience: "35 Years",
    committees: ["Audit (Chair)", "Governance"],
    initiatives: ["Basel IV Capital Compliance", "Independent Audit Overhaul"],
    location: "London Hub",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  },
  "Dr. Aris Vance": {
    name: "Dr. Aris Vance",
    title: "Chief Risk Officer / Board Director",
    bio: "Pioneered algorithmic risk detection models. Responsible for the bank's global stress testing and counterparty risk limits.",
    qualifications: ["Ph.D. Quantitative Finance, MIT"],
    experience: "22 Years",
    committees: ["Risk (Chair)", "Compliance"],
    initiatives: ["AI Default Prediction Engine"],
    location: "Frankfurt Hub",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
  },
  "Meera Nair": {
    name: "Meera Nair",
    title: "Global Head of ESG / Director",
    bio: "Leads the sustainable finance transition. Engineered the zero-carbon loan portfolio mandate for corporate clients.",
    qualifications: ["MSc Environmental Economics, Oxford"],
    experience: "18 Years",
    committees: ["ESG (Chair)", "Nomination"],
    initiatives: ["Carbon-Neutral Operations 2030"],
    location: "Singapore Hub",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"
  }
};

export const orgHierarchy = {
  id: "board",
  name: "Board of Directors",
  title: "Highest Governing Body",
  children: [
    {
      id: "ceo",
      name: "Sushanth NS",
      title: "Chairman & CEO",
      children: [
        {
          id: "risk",
          name: "Dr. Aris Vance",
          title: "Chief Risk Officer",
          children: [
            { id: "credit", name: "Credit Risk", title: "VP Credit" },
            { id: "market", name: "Market Risk", title: "VP Trading" }
          ]
        },
        {
          id: "esg",
          name: "Meera Nair",
          title: "Global Head of ESG",
          children: [
            { id: "green", name: "Green Finance", title: "Director" },
            { id: "csr", name: "Corporate Social Responsibility", title: "Director" }
          ]
        },
        {
          id: "tech",
          name: "James Rutherford",
          title: "Chief Technology Officer",
          children: [
            { id: "sec", name: "Cybersecurity", title: "CISO" },
            { id: "ai", name: "AI Integration", title: "Head of AI" }
          ]
        }
      ]
    }
  ]
};

export const boardCommittees = [
  { name: "Audit Committee", chair: "Eleanor Vance", members: ["Dr. Aris Vance", "Sarah Chen"], meetingsYTD: 8, pendingActions: 2, health: "Optimal" },
  { name: "Risk Committee", chair: "Dr. Aris Vance", members: ["James Rutherford", "Eleanor Vance"], meetingsYTD: 12, pendingActions: 5, health: "Elevated Alert" },
  { name: "Technology & Cyber", chair: "Sushanth NS", members: ["James Rutherford", "Marcus Sterling"], meetingsYTD: 10, pendingActions: 1, health: "Optimal" },
  { name: "ESG & Sustainability", chair: "Meera Nair", members: ["Sarah Chen", "Sushanth NS"], meetingsYTD: 6, pendingActions: 0, health: "Optimal" },
  { name: "Nomination & Remuneration", chair: "Marcus Sterling", members: ["Eleanor Vance", "Meera Nair"], meetingsYTD: 4, pendingActions: 3, health: "Reviewing" }
];

export const upcomingMeetings = [
  { id: "M1", title: "Q3 Earnings Approval", date: "Oct 12, 2026", time: "09:00 AM EST", type: "Full Board", status: "Agenda Locked", documents: 4 },
  { id: "M2", title: "Cybersecurity Quantum Threat Assessment", date: "Oct 15, 2026", time: "11:00 AM EST", type: "Tech Committee", status: "Drafting", documents: 2 },
  { id: "M3", title: "Global Liquidity Stress Test Review", date: "Oct 18, 2026", time: "14:00 PM EST", type: "Risk Committee", status: "Agenda Locked", documents: 6 }
];

export const corporateDocuments = [
  { id: "D1", title: "Corporate Board Charter 2026", category: "Charters", version: "v4.2", lastUpdated: "Jan 10, 2026", author: "Legal" },
  { id: "D2", title: "Global Code of Business Ethics", category: "Policies", version: "v8.1", lastUpdated: "Mar 15, 2026", author: "Compliance" },
  { id: "D3", title: "Post-Quantum Cryptography Policy", category: "Technology", version: "v1.0", lastUpdated: "Jun 22, 2026", author: "CTO Office" },
  { id: "D4", title: "Zero-Carbon Portfolio Framework", category: "ESG", version: "v2.5", lastUpdated: "Feb 05, 2026", author: "ESG Committee" },
  { id: "D5", title: "Anti-Money Laundering (AML) Protocols", category: "Policies", version: "v9.3", lastUpdated: "Jul 01, 2026", author: "Risk" }
];

export const riskHeatmap = [
  { id: "R1", title: "Quantum Cryptographic Break", category: "Cybersecurity", likelihood: 2, severity: 5, owner: "James Rutherford", mitigation: "Lattice-based encryption rollout" },
  { id: "R2", title: "European Regulatory Shift (Basel IV)", category: "Compliance", likelihood: 4, severity: 3, owner: "Eleanor Vance", mitigation: "Capital buffer reinforcement" },
  { id: "R3", title: "Sovereign Debt Default (Emerging Markets)", category: "Financial", likelihood: 3, severity: 4, owner: "Dr. Aris Vance", mitigation: "Portfolio divestment" },
  { id: "R4", title: "AI Model Hallucination in Underwriting", category: "Technology", likelihood: 2, severity: 4, owner: "Sushanth NS", mitigation: "Human-in-the-loop fallback" }
];

export const successionPipeline = [
  { role: "Chief Executive Officer", current: "Sushanth NS", readyNow: ["James Rutherford"], ready1To3: ["Meera Nair"], ready3To5: ["Dr. Aris Vance"] },
  { role: "Chief Risk Officer", current: "Dr. Aris Vance", readyNow: ["Sarah Chen"], ready1To3: ["Marcus Sterling"], ready3To5: ["External Search"] },
  { role: "Chief Technology Officer", current: "James Rutherford", readyNow: ["External Search"], ready1To3: ["Head of AI"], ready3To5: ["CISO"] }
];

export const decisionMatrix = [
  { action: "M&A over $1 Billion", authority: "Full Board Resolution", escalation: "Shareholder Vote" },
  { action: "CapEx over $500M", authority: "Executive Committee", escalation: "Board Approval" },
  { action: "Algorithm Risk Limits", authority: "Risk Committee", escalation: "CRO" },
  { action: "C-Suite Hiring", authority: "Nomination Committee", escalation: "CEO" }
];
