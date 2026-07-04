import React from 'react';
import Card from '../components/ui/Card';
import './AboutUs.css';

const kengeriTeam = [
  {
    roleGroup: "Branch Leadership",
    description: "Guiding the branch towards excellence and ensuring seamless operations.",
    members: [
      { name: "Sushanth N S", role: "Manager and Head of Bank" },
      { name: "Girish Yadav J", role: "System Manager" }
    ]
  },
  {
    roleGroup: "Relationship Managers",
    description: "Act as the primary point of contact for high-net-worth or enterprise clients, identifying specific financial needs and suggesting tailored banking products.",
    members: [
      { name: "Suresh S", role: "Senior Relationship Manager" },
      { name: "Daranth S", role: "Relationship Manager" },
      { name: "Krishna J", role: "Relationship Manager" },
      { name: "Kushal N", role: "Relationship Manager" },
      { name: "Likith Gowda", role: "Relationship Manager" }
    ]
  },
  {
    roleGroup: "Personal Bankers / Banking Associates",
    description: "Assist customers in opening/closing accounts, explain product features (like loans and credit cards), and help with basic investment needs.",
    members: [
      { name: "Manjunath R", role: "Senior Personal Banker" },
      { name: "Kumar G", role: "Personal Banker" },
      { name: "Ramesh R", role: "Personal Banker" },
      { name: "Satish H", role: "Personal Banker" },
      { name: "Manish Shetty", role: "Personal Banker" }
    ]
  },
  {
    roleGroup: "Loan Officers",
    description: "Evaluate and process loan applications, check credit histories, interview applicants, and explain terms for mortgages, auto, or personal loans.",
    members: [
      { name: "Hemanth Patil", role: "Senior Loan Officer" },
      { name: "Manjunath S R", role: "Loan Officer" },
      { name: "Krishna Kumar", role: "Loan Officer" },
      { name: "T Nagappa", role: "Loan Officer" },
      { name: "Jagan Nath", role: "Loan Officer" }
    ]
  },
  {
    roleGroup: "Bank Clerks / Tellers",
    description: "Handle day-to-day banking activities such as cash deposits, withdrawals, fund transfers, and cheque processing.",
    members: [
      { name: "Srinath J", role: "Senior Bank Clerk / Teller" },
      { name: "Jagdish R", role: "Bank Clerk / Teller" },
      { name: "Ramnath Kumar", role: "Bank Clerk / Teller" },
      { name: "Kushal R", role: "Bank Clerk / Teller" },
      { name: "Gagan S", role: "Bank Clerk / Teller" }
    ]
  }
];

const AboutUs = () => {
  return (
    <div className="about-page fade-in">
      <div className="about-hero">
        <div className="container text-center">
          <h1 className="about-title">Our Legacy. Your Trust.</h1>
          <p className="about-subtitle">Over 200 years of empowering generations.</p>
        </div>
      </div>
      
      <div className="container about-content">
        <Card className="about-card shadow-hover">
          <h2>About Surya Bank</h2>
          
          <div className="about-text-content">
            <p>
              <strong>Surya Bank (SB)</strong>, a Fortune 500 company, is an Indian Multinational, Public Sector Banking and Financial services statutory body headquartered in Bengaluru. The rich heritage and legacy of over 200 years, accredits SB as the most trusted Bank by Indians through generations.
            </p>

            <div className="stats-grid">
              <div className="stat-box">
                <h3>Rs. 61+ Trillion</h3>
                <p>Asset Base</p>
              </div>
              <div className="stat-box">
                <h3>50+ Crore</h3>
                <p>Customers</p>
              </div>
              <div className="stat-box">
                <h3>23,270+</h3>
                <p>Branches</p>
              </div>
              <div className="stat-box">
                <h3>63,580+</h3>
                <p>ATMs / ADWMs</p>
              </div>
            </div>

            <p>
              We are the largest banking and financial services organization in India. We serve over 50 crore customers through our vast network of over 23,270 branches, 63,580 ATMs/ADWMs, and 82,900 BC outlets, with an undeterred focus on innovation and customer centricity, which stems from the core values of the Bank: <strong>Service, Transparency, Ethics, Politeness, and Sustainability.</strong>
            </p>

            <p>
              The Bank has successfully diversified businesses through its various subsidiaries i.e. <strong>SBIGeneral Insurance, SB Life Insurance, SB Mutual Fund, SB Card,</strong> etc. It has spread its presence globally and operates across time zones through 241 offices in 29 foreign countries.
            </p>

            <p>
              Growing with times, SB continues to redefine banking in India, as it aims to offer responsible and sustainable Banking solutions.
            </p>

            <div className="last-updated">
              <p><em>Last Updated on Monday, 15th June 2026</em></p>
            </div>
          </div>
        </Card>
      </div>
      <div className="container team-section">
        <div className="text-center">
          <h2 className="section-title">Kengeri Satellite Town Branch</h2>
          <p className="section-subtitle">Meet our dedicated team of professionals ready to serve you.</p>
        </div>
        
        <div className="team-grid">
          {kengeriTeam.map((group, index) => (
            <div key={index} className="team-category">
              <h3>{group.roleGroup}</h3>
              <p className="category-desc">{group.description}</p>
              <div className="team-members">
                {group.members.map((member, mIndex) => (
                  <Card key={mIndex} className="team-member-card">
                    <h4>{member.name}</h4>
                    <p className="role">{member.role}</p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
