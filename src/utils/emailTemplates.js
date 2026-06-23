export const baseTemplate = (content, title) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f7f6;
      color: #333333;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #ffffff;
      padding: 30px 20px;
      text-align: center;
      border-bottom: 3px solid #f59e0b;
    }
    .header img {
      max-width: 180px;
      height: auto;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #0f172a;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 20px;
    }
    .otp-box {
      background-color: #f8fafc;
      border: 2px dashed #f59e0b;
      border-radius: 8px;
      padding: 25px;
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      font-size: 42px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 8px;
      margin: 0;
    }
    .details-box {
      background-color: #f1f5f9;
      border-left: 4px solid #3b82f6;
      padding: 15px 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }
    .details-box p {
      margin: 5px 0;
      font-size: 14px;
      color: #334155;
    }
    .footer {
      background-color: #0f172a;
      padding: 30px;
      text-align: center;
      color: #94a3b8;
    }
    .footer p {
      margin: 5px 0;
      font-size: 13px;
    }
    .footer a {
      color: #f59e0b;
      text-decoration: none;
    }
    .highlight {
      color: #f59e0b;
      font-weight: 600;
    }
    .btn {
      display: inline-block;
      padding: 14px 28px;
      background-color: #f59e0b;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 15px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://suryabank.web.app/logo.png" alt="Surya Bank Logo" />
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Surya Bank</strong> | Modern Digital Banking</p>
      <p>123 Financial District, New York, NY 10004</p>
      <p>Need help? Contact us at <a href="mailto:support@suryabank.com">support@suryabank.com</a> or call 1-800-SURYA-BNK</p>
      <div style="margin-top: 20px; border-top: 1px solid #334155; padding-top: 20px;">
        <p>&copy; ${new Date().getFullYear()} Surya Bank. All rights reserved.</p>
        <p>This is an automated message. Please do not reply directly to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const getOTPVerificationTemplate = (name, otpCode) => {
  const content = `
    <h2>Security Verification</h2>
    <p>Dear <span class="highlight">${name}</span>,</p>
    <p>Thank you for choosing Surya Bank. To ensure the security of your account and verify your identity, please use the following One-Time Password (OTP):</p>
    
    <div class="otp-box">
      <p style="margin-top: 0; margin-bottom: 15px; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: 600;">Your Verification Code</p>
      <p class="otp-code">${otpCode}</p>
    </div>
    
    <div class="details-box">
      <p><strong>Security Notice:</strong></p>
      <p>• This code will expire in 10 minutes.</p>
      <p>• <strong>Never share this code with anyone.</strong></p>
      <p>• Surya Bank employees will never ask for your OTP over the phone or via email.</p>
    </div>
    
    <p>If you did not request this verification code, please ignore this email or contact our fraud department immediately.</p>
    <p>Best regards,<br><strong>The Surya Bank Security Team</strong></p>
  `;
  return baseTemplate(content, 'Your Surya Bank Verification Code');
};

export const getWelcomeTemplate = (name, accountNumber, ifscCode) => {
  const content = `
    <h2>Welcome Aboard!</h2>
    <p>Dear <span class="highlight">${name}</span>,</p>
    <p>Welcome to <strong>Surya Bank</strong>! Your account has been successfully created and is now active. We are absolutely thrilled to have you join our digital banking family.</p>
    
    <div class="otp-box">
      <p style="margin-top: 0; margin-bottom: 10px; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: 600;">Your Account Details</p>
      <p style="font-size: 20px; margin: 5px 0; color: #475569;">Account Number: <strong style="color: #0f172a; font-family: monospace;">${accountNumber}</strong></p>
      <p style="font-size: 20px; margin: 5px 0; color: #475569;">IFSC Code: <strong style="color: #0f172a; font-family: monospace;">${ifscCode}</strong></p>
    </div>

    <p>At Surya Bank, we are committed to providing you with a premium, AI-powered financial experience tailored to your unique needs.</p>
    
    <div class="details-box">
      <p><strong>Your Account Benefits:</strong></p>
      <p>✓ Bank-grade, multi-layer security</p>
      <p>✓ AI-driven financial insights</p>
      <p>✓ Zero hidden fees on standard transactions</p>
      <p>✓ 24/7 dedicated customer support</p>
    </div>

    <p>Ready to get started? Access your dashboard now to set up your profile and explore your new account features.</p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="https://suryabank.com/dashboard" class="btn">Access Your Dashboard</a>
    </div>
    
    <p>Warm regards,<br><strong>The Surya Bank Team</strong></p>
  `;
  return baseTemplate(content, 'Welcome to Surya Bank!');
};

export const getTransactionAlertTemplate = (name, amount, recipientName) => {
  const content = `
    <h2>Transaction Alert</h2>
    <p>Dear <span class="highlight">${name}</span>,</p>
    <p>This is an automated alert to confirm that a recent transaction has been successfully processed from your Surya Bank account.</p>
    
    <div class="otp-box" style="border-color: #3b82f6; background-color: #eff6ff;">
      <p style="margin: 0; color: #3b82f6; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Amount Transferred</p>
      <p class="otp-code" style="color: #1e3a8a; font-size: 36px; letter-spacing: 2px; margin: 10px 0;">₹${amount.toFixed(2)}</p>
      <p style="margin-top: 10px; color: #475569; font-size: 18px;">To: <strong>${recipientName}</strong></p>
    </div>
    
    <div class="details-box" style="border-left-color: #ef4444; background-color: #fef2f2;">
      <p style="color: #b91c1c;"><strong>Action Required?</strong></p>
      <p style="color: #991b1b;">If you authorized this transaction, no further action is needed. If you <strong>did not</strong> authorize this payment, please contact our fraud department immediately to secure your account.</p>
    </div>
    
    <p>Thank you for banking with us,<br><strong>Surya Bank Alerts</strong></p>
  `;
  return baseTemplate(content, 'Surya Bank Transaction Alert');
};

export const getConsultationTemplate = (name, topic, date, status) => {
  const content = `
    <h2>Consultation Request Received</h2>
    <p>Dear <span class="highlight">${name}</span>,</p>
    <p>Thank you for reaching out to Surya Bank. We have successfully received your request for a consultation.</p>
    
    <div class="otp-box" style="border-color: #f59e0b; background-color: #fffbeb;">
      <p style="margin: 0; color: #f59e0b; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Request Details</p>
      <p style="font-size: 18px; margin: 15px 0 5px 0; color: #475569;">Topic: <strong style="color: #0f172a;">${topic}</strong></p>
      <p style="font-size: 18px; margin: 5px 0; color: #475569;">Preferred Date: <strong style="color: #0f172a;">${date}</strong></p>
      <p style="font-size: 18px; margin: 5px 0; color: #475569;">Status: <strong style="color: #f59e0b; text-transform: uppercase;">${status}</strong></p>
    </div>
    
    <div class="details-box" style="border-left-color: #3b82f6; background-color: #eff6ff;">
      <p style="color: #1d4ed8;"><strong>What happens next?</strong></p>
      <p style="color: #1e3a8a;">One of our certified financial advisors will review your request and contact you shortly to confirm the appointment time and details.</p>
    </div>
    
    <p>We look forward to assisting you in achieving your financial goals.</p>
    <p>Warm regards,<br><strong>The Surya Bank Advisory Team</strong></p>
  `;
  return baseTemplate(content, 'Consultation Request Received');
};

export const getConsultationUpdateTemplate = (name, status) => {
  const content = `
    <h2>Consultation Status Update</h2>
    <p>Dear <span class="highlight">${name}</span>,</p>
    <p>There has been an update regarding your consultation request with Surya Bank.</p>
    
    <div class="otp-box" style="border-color: #22c55e; background-color: #f0fdf4;">
      <p style="margin: 0; color: #16a34a; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">New Status</p>
      <p class="otp-code" style="color: #15803d; font-size: 32px; letter-spacing: 2px; margin: 10px 0; text-transform: uppercase;">${status}</p>
    </div>
    
    <p>Your consultation request has been verified and processed by our team. An advisor will be assigned to your case and will be in touch with you at the scheduled time.</p>
    
    <p>If you have any questions or need to reschedule, please contact our support team.</p>
    <p>Warm regards,<br><strong>The Surya Bank Advisory Team</strong></p>
  `;
  return baseTemplate(content, 'Consultation Status Update: ' + status);
};

export const getBranchTransactionTemplate = (name, type, amount, balance, description, branchName) => {
  const isCredit = type === 'credit';
  const color = isCredit ? '#16a34a' : '#dc2626';
  const bgColor = isCredit ? '#f0fdf4' : '#fef2f2';
  const action = isCredit ? 'Credited' : 'Debited';
  
  const content = `
    <h2>Transaction Successful</h2>
    <p>Dear <span class="highlight">${name}</span>,</p>
    <p>This email is to confirm a recent ${type} transaction on your Surya Bank account.</p>
    
    <div class="otp-box" style="border-color: ${color}; background-color: ${bgColor};">
      <p style="margin: 0; color: ${color}; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Amount ${action}</p>
      <p class="otp-code" style="color: ${color}; font-size: 36px; letter-spacing: 2px; margin: 10px 0;">${isCredit ? '+' : '-'}₹${parseFloat(amount).toFixed(2)}</p>
    </div>
    
    <div class="details-box" style="border-left-color: #3b82f6; background-color: #eff6ff;">
      <p style="color: #1e3a8a;"><strong>Transaction Details:</strong></p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Branch:</strong> ${branchName}</p>
      <p><strong>Available Balance:</strong> ₹${parseFloat(balance).toFixed(2)}</p>
    </div>
    
    <p>Thank you for banking with Surya Bank.</p>
  `;
  return baseTemplate(content, 'Surya Bank Transaction Alert');
};

export const getCardApprovalTemplate = (name, cardType, cardNumber) => {
  const content = `
    <h2>Card Application Approved!</h2>
    <p>Dear <span class="highlight">${name}</span>,</p>
    <p>Congratulations! Your application for a Surya Bank <strong>${cardType}</strong> has been approved by our branch officers.</p>
    
    <div class="otp-box" style="border-color: #f59e0b; background-color: #fffbeb;">
      <p style="margin: 0; color: #f59e0b; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Your New Card Number</p>
      <p class="otp-code" style="color: #0f172a; font-size: 32px; letter-spacing: 4px; margin: 15px 0;">${cardNumber}</p>
    </div>
    
    <div class="details-box" style="border-left-color: #3b82f6; background-color: #eff6ff;">
      <p style="color: #1e3a8a;"><strong>Next Steps:</strong></p>
      <p>• Your physical card will be dispatched to your registered address within 5-7 business days.</p>
      <p>• You can start using this digital card number immediately for online transactions.</p>
      <p>• Please login to your Surya Bank dashboard to set your PIN.</p>
    </div>
    
    <p>Thank you for choosing Surya Bank.</p>
  `;
  return baseTemplate(content, 'Surya Bank Card Approved');
};

export const getProfileUpdateTemplate = (name, changesList) => {
  const content = `
    <h2>Security Alert: Profile Update Scheduled</h2>
    <p>Dear <span class="highlight">${name}</span>,</p>
    <p>This is an automated notification to inform you that a request to update critical information on your Surya Bank profile has been initiated by an authorized bank officer.</p>
    
    <div class="details-box" style="border-left-color: #f59e0b; background-color: #fffbeb;">
      <p style="color: #b45309;"><strong>Scheduled Changes:</strong></p>
      <ul style="color: #451a03; margin-top: 5px; padding-left: 20px;">
        ${changesList.map(change => `<li><strong>${change.field}:</strong> ${change.oldValue || 'N/A'} ➔ ${change.newValue}</li>`).join('')}
      </ul>
    </div>
    
    <div class="otp-box" style="border-color: #3b82f6; background-color: #eff6ff;">
      <p style="margin: 0; color: #1e3a8a; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Security Delay Active</p>
      <p style="color: #1e40af; font-size: 16px; margin: 10px 0;">For your security, these changes are subject to a mandatory <strong>24-hour verification period</strong> before they are finalized.</p>
    </div>
    
    <p>If you requested these changes at a branch, no further action is required.</p>
    <p style="color: #dc2626; font-weight: bold;">If you did NOT authorize these changes, please contact our fraud department immediately.</p>
    
    <p>Thank you for banking with Surya Bank.</p>
  `;
  return baseTemplate(content, 'Surya Bank Security Alert: Profile Update Scheduled');
};
