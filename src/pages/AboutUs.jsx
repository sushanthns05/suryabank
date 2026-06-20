import React from 'react';
import Card from '../components/ui/Card';
import './AboutUs.css';

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
        <Card glass className="about-card">
          <h2>About Surya Bank</h2>
          
          <div className="about-text-content">
            <p>
              <strong>Surya Bank (SB)</strong>, a Fortune 500 company, is an Indian Multinational, Public Sector Banking and Financial services statutory body headquartered in Mumbai. The rich heritage and legacy of over 200 years, accredits SB as the most trusted Bank by Indians through generations.
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
    </div>
  );
};

export default AboutUs;
