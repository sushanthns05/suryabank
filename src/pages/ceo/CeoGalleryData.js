export const galleryAnalytics = {
  totalAssets: 14520,
  totalEvents: 342,
  countriesVisited: 48,
  awardsReceived: 85,
  meetingsLogged: 1240,
  mediaCoverage: "4.5K+"
};

export const damEvents = [
  {
    id: "EVT-2026-WEF",
    title: "World Economic Forum 2026",
    year: 2026,
    month: "January",
    category: "International Visits",
    location: { name: "Davos, Switzerland", lat: 46.8027, lng: 9.8360, x: 490, y: 100 }, // Mock coordinates
    description: "Annual meeting participating in global economic panels discussing AI in banking and sustainable finance.",
    coverImage: "/sns.jpg",
    visibility: "Public",
    tags: ["WEF", "Economy", "Keynote", "Panel"],
    attachedFiles: [
      { name: "Keynote_Transcript_WEF2026.pdf", type: "PDF", size: "2.4MB" }
    ],
    media: [
      {
        id: "IMG-WEF-001",
        url: "/sns.jpg",
        title: "Main Stage Keynote",
        description: "Chairman addressing the WEF assembly on the future of Post-Quantum Cryptography in global finance.",
        photographer: "Official WEF Press",
        date: "2026-01-16 14:30:00",
        resolution: "6000x4000",
        tags: ["Keynote", "Solo", "Stage"],
        aiSummary: "A man speaking at a podium with a blue background.",
        privateNotes: "Excellent lighting. Use this for the Q1 Shareholder report cover.",
        visibility: "Public"
      },
      {
        id: "IMG-WEF-002",
        url: "/sns.jpg",
        title: "Bilateral Meeting with Finance Minister",
        description: "Private discussions regarding European market expansion and digital asset regulations.",
        photographer: "Surya Internal Media",
        date: "2026-01-17 09:15:00",
        resolution: "4500x3000",
        tags: ["Meeting", "Bilateral", "European Union"],
        aiSummary: "Two people sitting in armchairs discussing documents.",
        privateNotes: "Keep restricted until regulatory approval is officially announced.",
        visibility: "CEO Only"
      }
    ]
  },
  {
    id: "EVT-2025-Q4",
    title: "Q4 Earnings Call & Press Briefing",
    year: 2025,
    month: "December",
    category: "Leadership",
    location: { name: "New York, USA", lat: 40.7128, lng: -74.0060, x: 200, y: 110 },
    description: "End of year financial results presentation to institutional investors and media.",
    coverImage: "/sns.jpg",
    visibility: "Investor",
    tags: ["Earnings", "Press", "Financials", "Q4"],
    attachedFiles: [
      { name: "Q4_Earnings_Deck.pptx", type: "Presentation", size: "15.8MB" },
      { name: "Press_Release_Final.pdf", type: "PDF", size: "1.1MB" }
    ],
    media: [
      {
        id: "IMG-Q4-001",
        url: "/sns.jpg",
        title: "Press Briefing Opening",
        description: "Opening statements regarding the record-breaking $4.8B annual revenue.",
        photographer: "Surya Internal Media",
        date: "2025-12-10 10:00:00",
        resolution: "5000x3333",
        tags: ["Press Conference", "Financials"],
        aiSummary: "Executive standing before a backdrop with financial charts.",
        privateNotes: "",
        visibility: "Public"
      }
    ]
  },
  {
    id: "EVT-2025-ESG",
    title: "Global Sustainability Summit",
    year: 2025,
    month: "September",
    category: "CSR",
    location: { name: "Singapore", lat: 1.3521, lng: 103.8198, x: 710, y: 220 },
    description: "Announcing the $5 Billion Green Bond framework and 2030 Carbon Neutrality roadmap.",
    coverImage: "/sns.jpg",
    visibility: "Public",
    tags: ["ESG", "Sustainability", "Green Bond", "Singapore"],
    attachedFiles: [],
    media: [
      {
        id: "IMG-ESG-001",
        url: "/sns.jpg",
        title: "Green Bond Signing",
        description: "Official signing ceremony for the first tranche of sustainable infrastructure funding.",
        photographer: "Surya Internal Media",
        date: "2025-09-14 11:45:00",
        resolution: "6000x4000",
        tags: ["Signing", "Ceremony", "ESG"],
        aiSummary: "Executives signing documents at a table with green plants.",
        privateNotes: "Send high-res copy to PR team for sustainability page.",
        visibility: "Public"
      }
    ]
  }
];
