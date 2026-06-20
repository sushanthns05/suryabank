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
      <p class="otp-code" style="color: #1e3a8a; font-size: 36px; letter-spacing: 2px; margin: 10px 0;">$${amount.toFixed(2)}</p>
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
