import '../config/env.js';
import nodemailer from 'nodemailer';

/**
 * Email Service for sending OTP verification emails.
 * Uses Gmail App Password authentication when EMAIL_PROVIDER=gmail and OTP_MODE=email.
 * Uses console logging only when OTP_MODE=demo.
 */

let transporter = null;
let emailConfigured = false;
let emailInitializationError = null;

const provider = () => String(process.env.EMAIL_PROVIDER || 'mock').trim().toLowerCase();
const otpMode = () => String(process.env.OTP_MODE || 'demo').trim().toLowerCase();
const hasEmailUser = () => Boolean(process.env.EMAIL_USER && process.env.EMAIL_USER.trim());
const hasEmailPassword = () => Boolean(process.env.EMAIL_APP_PASSWORD && process.env.EMAIL_APP_PASSWORD.trim());

function buildMissingConfigMessage() {
  const missing = [];
  if (!hasEmailUser()) missing.push('EMAIL_USER');
  if (!hasEmailPassword()) missing.push('EMAIL_APP_PASSWORD');
  return `Missing SMTP configuration: ${missing.join(', ')}`;
}

function assertEmailConfiguration() {
  if (otpMode() === 'demo') {
    return { mode: 'demo' };
  }

  if (provider() !== 'gmail' && provider() !== 'brevo') {
    throw new Error(
      `Unsupported EMAIL_PROVIDER="${process.env.EMAIL_PROVIDER}". Supported providers: gmail, brevo`
    );
  }

  if (!hasEmailUser() || !hasEmailPassword()) {
    throw new Error(buildMissingConfigMessage());
  }

  return { mode: 'email' };
}

export async function initializeEmailService() {
  emailConfigured = false;
  emailInitializationError = null;

  console.log('✓ EMAIL_USER ' + (hasEmailUser() ? `found (${process.env.EMAIL_USER})` : 'missing'));
  console.log('✓ EMAIL_APP_PASSWORD ' + (hasEmailPassword() ? 'found' : 'missing'));
  console.log(`✓ EMAIL_PROVIDER = ${process.env.EMAIL_PROVIDER || 'not set'}`);
  console.log(`✓ OTP_MODE = ${process.env.OTP_MODE || 'not set'}`);

  const config = assertEmailConfiguration();

  if (config.mode === 'demo') {
    console.log('📧 Email service running in DEMO mode because OTP_MODE=demo');
    console.log('   OTP emails will be logged to console.');
    return { configured: false, mode: 'demo' };
  }

  console.log(`✓ selected email provider = ${provider()}`);

  if (provider() === 'brevo') {
    console.log('✓ creating Brevo SMTP transporter');

    transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 2525,
      secure: false,
      requireTLS: true,
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  } else {
    console.log('✓ creating Gmail SMTP transporter');

    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  }

  console.log('✓ transporter created');

  try {
    console.log('Testing SMTP connection...');
    console.log({
      host: 'smtp-relay.brevo.com',
      port: 2525,
      user: process.env.EMAIL_USER
    });

    await transporter.verify();
    emailConfigured = true;
    console.log('✓ transporter verified');
    console.log(`✓ ${provider()} SMTP authenticated`);
    console.log('✓ OTP email service ready');
    console.log('SMTP configured successfully');
    return { configured: true, mode: 'email' };
  } catch (error) {
    emailConfigured = false;
    emailInitializationError = error;

    console.error(`✗ ${provider()} SMTP authentication failed`);
    console.error('SMTP configuration error:', {
      name: error.name,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      message: error.message
    });

    return {
      configured: false,
      mode: 'email',
      error: error.message
    };
  }
}

/**
 * Generate a professional OTP email template
 */
function getEmailTemplate(name, otp, expiresInMinutes = 5) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px; }
    .body-content { padding: 40px 30px; color: #1F2937; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
    .otp-container { background: #F0FDF4; border: 2px solid #22C55E; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp-code { font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #16A34A; font-family: 'Courier New', monospace; }
    .otp-label { font-size: 14px; color: #6B7280; margin-top: 8px; }
    .info-text { font-size: 14px; color: #6B7280; line-height: 1.6; }
    .warning { background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #92400E; }
    .footer { padding: 24px 30px; text-align: center; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF; }
    .footer a { color: #22C55E; text-decoration: none; }
    @media only screen and (max-width: 480px) {
      .container { border-radius: 0; }
      .header { padding: 30px 20px; }
      .body-content { padding: 30px 20px; }
      .otp-code { font-size: 32px; letter-spacing: 8px; }
    }
  </style>
</head>
<body style="margin:0; padding:20px; background-color:#f4f4f4;">
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
      <p>Verify your account to get started</p>
    </div>
    <div class="body-content">
      <div class="greeting">Hello ${name},</div>
      <p class="info-text">Thank you for signing up! Use the following One-Time Password (OTP) to verify your email address and complete your registration.</p>
      <div class="otp-container">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-label" style="margin-top:12px;">Valid for ${expiresInMinutes} minutes</div>
      </div>
      <p class="info-text">Please enter this code on the verification page to activate your account. For security reasons, this code will expire after ${expiresInMinutes} minutes.</p>
      <div class="warning">If you did not request this verification, please ignore this email. No changes have been made to your account.</div>
      <p class="info-text">Best regards,<br><strong>Vyora Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Vyora. All rights reserved.</p>
      <p style="margin-top:8px;">This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send OTP email to the user
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - 6-digit OTP code
 * @param {number} expiresInMinutes - OTP expiry duration
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendOTPEmail(to, name, otp, expiresInMinutes = 5) {
  try {
    if (otpMode() === 'demo') {
      console.log('═══════════════════════════════════════════════');
      console.log('📧 [DEMO MODE] OTP Email');
      console.log(`   To: ${to}`);
      console.log(`   Name: ${name}`);
      console.log(`   OTP: ${otp}`);
      console.log(`   Expires: ${expiresInMinutes} minutes`);
      console.log('═══════════════════════════════════════════════');
      return { success: true, messageId: 'demo-mode' };
    }

    if (!emailConfigured || !transporter) {
      const reason = emailInitializationError?.message || 'SMTP transporter is not configured or verified.';
      console.error('❌ OTP email service is not ready:', reason);
      return { success: false, error: reason };
    }

    const mailOptions = {
      from: `"Vyora Team" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Verify your email - Vyora OTP',
      html: getEmailTemplate(name, otp, expiresInMinutes)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${to}:`, {
      name: error.name,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      message: error.message
    });
    return { success: false, error: error.message };
  }
}

/**
 * Generate a secure 6-digit OTP
 * @returns {string} 6-digit numeric OTP
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getEmailServiceStatus() {
  return {
    configured: emailConfigured,
    provider: provider(),
    otpMode: otpMode(),
    hasEmailUser: hasEmailUser(),
    hasEmailAppPassword: hasEmailPassword(),
    initializationError: emailInitializationError?.message || null
  };
}

export { emailConfigured };
