import emailjs from '@emailjs/browser';
import { getOTPVerificationTemplate, getWelcomeTemplate, getTransactionAlertTemplate, getConsultationTemplate, getConsultationUpdateTemplate, getBranchTransactionTemplate, getCardApprovalTemplate, getProfileUpdateTemplate, getConsultationApprovalTemplate } from './emailTemplates';

const EMAILJS_PUBLIC_KEY = 'Udo2BF2lwjLpzDA2o';
const EMAILJS_SERVICE_ID = 'service_ucp4e7s';
const EMAILJS_TEMPLATE_ID = 'template_a5x20u8';

/**
 * Initialize EmailJS with the public key.
 * This should be called once when the app starts, or right before sending.
 */
export const initEmailJS = () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);
};

/**
 * Send an email using EmailJS.
 * 
 * @param {Object} templateParams - The dynamic variables to inject into the template.
 * @returns {Promise} A promise that resolves when the email is sent successfully.
 */
const sendEmail = async (templateParams) => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw error;
  }
};

/**
 * Send an OTP verification email.
 * @param {string} email - The recipient's email address.
 * @param {string} otpCode - The 6-digit OTP code.
 * @param {string} name - The recipient's name (optional).
 */
export const sendOTPVerificationEmail = (email, otpCode, name = 'User') => {
  return sendEmail({
    to_email: email,
    to_name: name,
    otp_code: otpCode,
    subject: 'Your Surya Bank Verification Code',
    message: getOTPVerificationTemplate(name, otpCode)
  });
};

/**
 * Send a welcome email when an account is successfully created.
 * @param {string} email - The recipient's email address.
 * @param {string} name - The recipient's name.
 * @param {string} accountNumber - The generated account number.
 * @param {string} ifscCode - The generated IFSC code.
 */
export const sendWelcomeEmail = (email, name = 'Valued Customer', accountNumber, ifscCode) => {
  return sendEmail({
    to_email: email,
    to_name: name,
    subject: 'Welcome to Surya Bank!',
    message: getWelcomeTemplate(name, accountNumber, ifscCode)
  });
};

/**
 * Send a transaction alert email.
 * @param {string} email - The recipient's email address.
 * @param {number} amount - The transaction amount.
 * @param {string} recipientName - The person who received the money.
 */
export const sendTransactionAlertEmail = (email, amount, recipientName) => {
  return sendEmail({
    to_email: email,
    to_name: 'Customer',
    transaction_amount: `₹${amount.toFixed(2)}`,
    subject: 'Surya Bank Transaction Alert',
    message: getTransactionAlertTemplate('Customer', amount, recipientName)
  });
};

/**
 * Send an email when a consultation is booked.
 */
export const sendConsultationEmail = (email, name, topic, date, status) => {
  return sendEmail({
    to_email: email,
    to_name: name,
    subject: 'Surya Bank Consultation Request Received',
    message: getConsultationTemplate(name, topic, date, status)
  });
};

/**
 * Send an email when a consultation status is updated.
 */
export const sendConsultationUpdateEmail = (email, name, status) => {
  return sendEmail({
    to_email: email,
    to_name: name,
    subject: `Consultation Status Update: ${status}`,
    message: getConsultationUpdateTemplate(name, status)
  });
};

/**
 * Send an email when a branch transaction (credit/debit) is processed.
 */
export const sendBranchTransactionEmail = (email, name, type, amount, balance, description, branchName = 'Surya Bank - Main Branch') => {
  return sendEmail({
    to_email: email,
    to_name: name,
    subject: `Surya Bank: Account ${type === 'credit' ? 'Credited' : 'Debited'}`,
    message: getBranchTransactionTemplate(name, type, amount, balance, description, branchName)
  });
};

/**
 * Send an email when a card application is approved.
 */
export const sendCardApprovalEmail = (email, name, cardType, cardNumber) => {
  return sendEmail({
    to_email: email,
    to_name: name,
    subject: `Surya Bank: Your ${cardType} is Approved!`,
    message: getCardApprovalTemplate(name, cardType, cardNumber)
  });
};

/**
 * Send an email when a profile update is scheduled.
 */
export const sendProfileUpdateEmail = (email, name, updatedFields) => {
  return sendEmail({
    to_email: email,
    to_name: name,
    subject: 'Surya Bank Security Alert: Profile Update Scheduled',
    message: getProfileUpdateTemplate(name, updatedFields)
  });
};

/**
 * Send an email with assigned appointment details when a consultation is approved.
 */
export const sendConsultationApprovalEmail = (email, name, topic, assignedEmployee, appointmentDate, appointmentTime) => {
  return sendEmail({
    to_email: email,
    to_name: name,
    subject: 'Consultation Scheduled - Surya Bank',
    message: getConsultationApprovalTemplate(name, topic, assignedEmployee, appointmentDate, appointmentTime)
  });
};
