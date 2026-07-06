export const contactAnalytics = {
  unreadMessages: 14,
  pendingRequests: 8,
  investorQueries: 12,
  govCommunications: 3,
  boardInvitations: 2,
  mediaRequests: 5,
  vipAppointments: 4,
  avgResponseTime: "1.2 Hrs"
};

export const staffDirectory = [
  { role: "Chief of Staff", name: "Eleanor Vance", email: "e.vance@suryabank.com", phone: "+91 22 555-0143" },
  { role: "Executive Assistant", name: "David Chen", email: "d.chen@suryabank.com", phone: "+91 22 555-0144" },
  { role: "Board Secretary", name: "Sarah Jenkins", email: "s.jenkins@suryabank.com", phone: "+91 22 555-0145" },
  { role: "Head of Investor Relations", name: "Marcus Thorne", email: "m.thorne@suryabank.com", phone: "+91 22 555-0146" },
  { role: "Media Relations Officer", name: "Priya Sharma", email: "p.sharma@suryabank.com", phone: "+91 22 555-0147" }
];

export const mockInbox = [
  {
    id: "MSG-2026-882",
    senderName: "Arthur Pendelton",
    senderOrg: "Global Finance Regulatory Board",
    type: "Government Communication",
    priority: "Critical",
    department: "Compliance",
    date: "2026-07-06T08:30:00Z",
    subject: "Urgent Review: EU Framework Integration",
    message: "We require an immediate response regarding Surya Bank's alignment with the Q3 European banking directives.",
    status: "Pending Review",
    sla: "2 Hrs",
    attachments: 1
  },
  {
    id: "MSG-2026-883",
    senderName: "Isabella Rossi",
    senderOrg: "Vanguard Asset Management",
    type: "Investor Inquiry",
    priority: "High",
    department: "Investor Relations",
    date: "2026-07-05T14:15:00Z",
    subject: "Q3 Earnings Clarification Request",
    message: "Requesting a brief 15-minute call with the Chairman to clarify the capital expenditure projected for the APAC region.",
    status: "Assigned",
    sla: "24 Hrs",
    attachments: 0
  },
  {
    id: "MSG-2026-884",
    senderName: "Anonymous Whistleblower",
    senderOrg: "Internal",
    type: "Emergency Report",
    priority: "Critical",
    department: "CEO Office",
    date: "2026-07-05T19:45:00Z",
    subject: "Compliance Violation in Retail Branch #42",
    message: "CONFIDENTIAL: Suspected misallocation of corporate funds observed. Please review the attached ledger disparities.",
    status: "Under Investigation",
    sla: "Immediate",
    attachments: 2
  }
];

export const availableAppointments = [
  { date: "2026-07-10", slots: ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"] },
  { date: "2026-07-12", slots: ["09:00 AM", "03:30 PM"] },
  { date: "2026-07-15", slots: ["11:00 AM", "01:00 PM", "05:00 PM"] }
];
