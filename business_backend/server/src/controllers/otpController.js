import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import EmailVerification from '../models/EmailVerification.js';
import User from '../models/User.js';
import { sendOTPEmail, generateOTP } from '../services/emailService.js';
import { db } from '../seed/data.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 30;
const MAX_OTP_ATTEMPTS = 5;

/**
 * Helper to check if MongoDB is connected
 * Uses mongoose.connection.readyState (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)
 */
function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * Execute a MongoDB operation with a timeout.
 * Throws immediately if Mongo is not connected, or if the operation takes > 5 seconds.
 * @param {Function} operation - Async function to execute
 * @param {number} timeoutMs - Timeout in milliseconds (default 5000ms)
 */
async function withMongoTimeout(operation, timeoutMs = 5000) {
  if (!isMongoConnected()) {
    throw new Error('MongoDB is not connected');
  }
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('MongoDB operation timed out')), timeoutMs);
  });
  
  return await Promise.race([operation(), timeoutPromise]);
}

/**
 * Helper to save OTP record (MongoDB or in-memory fallback)
 */
async function saveOTPRecord(email, name, phone, role, otp) {
  const record = {
    email: email.toLowerCase().trim(),
    otp,
    name: name.trim(),
    phone: phone || '',
    role: role || 'user',
    passwordHash: '',
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    attemptCount: 0,
    maxAttempts: MAX_OTP_ATTEMPTS,
    isVerified: false,
    resendCooldown: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (isMongoConnected()) {
    // Delete any existing pending verification for this email
    await withMongoTimeout(() => 
      EmailVerification.deleteMany({ email: email.toLowerCase().trim(), isVerified: false })
    );
    return await withMongoTimeout(() => EmailVerification.create(record));
  }

  // In-memory fallback
  if (!db.emailVerifications) db.emailVerifications = [];
  db.emailVerifications = db.emailVerifications.filter(v => v.email !== email.toLowerCase().trim());
  record.id = nanoid();
  db.emailVerifications.push(record);
  return record;
}

/**
 * Helper to find OTP record
 */
async function findOTPRecord(email) {
  const emailLower = email.toLowerCase().trim();
  if (isMongoConnected()) {
    return await withMongoTimeout(() => 
      EmailVerification.findOne({ email: emailLower, isVerified: false })
    );
  }
  if (!db.emailVerifications) return null;
  return db.emailVerifications.find(v => v.email === emailLower && !v.isVerified) || null;
}

/**
 * Helper to update OTP record
 */
async function updateOTPRecord(email, updates) {
  const emailLower = email.toLowerCase().trim();
  if (isMongoConnected()) {
    return await withMongoTimeout(() =>
      EmailVerification.findOneAndUpdate(
        { email: emailLower, isVerified: false },
        { $set: updates },
        { new: true }
      )
    );
  }
  const record = db.emailVerifications?.find(v => v.email === emailLower && !v.isVerified);
  if (record) Object.assign(record, updates);
  return record;
}

/**
 * Helper to delete OTP record
 */
async function deleteOTPRecord(email) {
  const emailLower = email.toLowerCase().trim();
  if (isMongoConnected()) {
    return await withMongoTimeout(() =>
      EmailVerification.deleteOne({ email: emailLower })
    );
  }
  if (db.emailVerifications) {
    db.emailVerifications = db.emailVerifications.filter(v => v.email !== emailLower);
  }
}

/**
 * Helper to find existing user by email
 */
async function findUserByEmail(email) {
  const emailLower = email.toLowerCase().trim();
  if (isMongoConnected()) {
    return await withMongoTimeout(() => User.findOne({ email: emailLower }));
  }
  return db.users.find(u => u.email === emailLower);
}

/**
 * 1. SEND OTP - Initiate signup with OTP email
 * POST /api/auth/send-otp
 */
export async function sendOTP(req, res) {
  try {
    const { name, email, phone, role = 'user' } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'A valid email address is required' });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if email already registered
    const existingUser = await findUserByEmail(emailLower);
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists. Please login.' });
    }

    const otp = generateOTP();
    if (process.env.OTP_MODE === 'demo') {
      console.log(`Generated OTP for ${emailLower}: ${otp}`);
    } else {
      console.log(`Generated OTP for ${emailLower}; sending via ${process.env.EMAIL_PROVIDER || 'configured email provider'}`);
    }

    await saveOTPRecord(emailLower, name, phone, role, otp);

    const emailResult = await sendOTPEmail(emailLower, name.trim(), otp, OTP_EXPIRY_MINUTES);

    if (!emailResult.success && process.env.OTP_MODE !== 'demo') {
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please check your email address or try again later.',
        devMode: process.env.OTP_MODE === 'demo'
      });
    }

    return res.json({
      message: 'OTP sent successfully to your email',
      email: emailLower,
      expiresIn: OTP_EXPIRY_MINUTES * 60,
      devMode: process.env.OTP_MODE === 'demo',
      ...(process.env.OTP_MODE === 'demo' && { devOTP: otp })
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
}

/**
 * 2. VERIFY OTP - Confirm OTP and create user account
 * POST /api/auth/verify-otp
 */
export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const emailLower = email.toLowerCase().trim();
    const record = await findOTPRecord(emailLower);

    if (!record) {
      return res.status(404).json({ 
        message: 'No pending verification found. Please request a new OTP.' 
      });
    }

    if (new Date() > new Date(record.expiresAt)) {
      await deleteOTPRecord(emailLower);
      return res.status(410).json({ 
        message: 'OTP has expired. Please request a new OTP.' 
      });
    }

    const newAttemptCount = (record.attemptCount || 0) + 1;
    await updateOTPRecord(emailLower, { attemptCount: newAttemptCount });

    if (newAttemptCount > (record.maxAttempts || MAX_OTP_ATTEMPTS)) {
      await deleteOTPRecord(emailLower);
      return res.status(429).json({ 
        message: `Maximum ${MAX_OTP_ATTEMPTS} OTP attempts exceeded. Please sign up again.` 
      });
    }

    if (record.otp !== otp) {
      const remainingAttempts = (record.maxAttempts || MAX_OTP_ATTEMPTS) - newAttemptCount;
      return res.status(400).json({ 
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
        remainingAttempts
      });
    }

    // OTP verified - create the actual user account
    const newUser = {
      id: nanoid(),
      name: record.name,
      email: emailLower,
      phone: record.phone || '',
      role: record.role || 'user',
      verified: true,
      blocked: false,
      vendorStatus: record.role === 'business_owner' ? 'pending_approval' : 'approved',
      favorites: [],
      referralCode: `${record.name.slice(0, 5).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`,
      activity: ['Signed up via email verification'],
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      await withMongoTimeout(() => User.create(newUser));
    }
    db.users.push(newUser);

    if (record.role === 'business_owner') {
      const pendingBusiness = {
        id: nanoid(),
        ownerId: newUser.id,
        name: `${record.name}'s Business`,
        ownerName: record.name,
        category: '',
        subCategory: '',
        type: 'Service',
        city: '',
        state: '',
        address: '',
        approved: false,
        kycStatus: 'pending',
        verifiedBadge: false,
        credits: 0,
        plan: 'Free',
        profileCompletion: 10,
        gstin: '',
        createdAt: new Date().toISOString()
      };
      db.businesses.push(pendingBusiness);
      db.notifications.push({
        id: nanoid(),
        audience: 'admin',
        title: 'New Vendor Registration',
        body: `${record.name} registered as a vendor and needs approval`,
        channel: 'dashboard',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    await updateOTPRecord(emailLower, { isVerified: true });
    await deleteOTPRecord(emailLower);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: record.role === 'business_owner' 
        ? 'Account verified! Your vendor account is pending admin approval.' 
        : 'Account verified successfully!',
      user: newUser,
      token
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
}

/**
 * 3. RESEND OTP - Generate and send new OTP
 * POST /api/auth/resend-otp
 */
export async function resendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailLower = email.toLowerCase().trim();
    const record = await findOTPRecord(emailLower);

    if (!record) {
      return res.status(404).json({ 
        message: 'No pending verification found. Please sign up again.' 
      });
    }

    if (record.resendCooldown && new Date() < new Date(record.resendCooldown)) {
      const remainingSeconds = Math.ceil((new Date(record.resendCooldown) - new Date()) / 1000);
      return res.status(429).json({ 
        message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
        remainingSeconds
      });
    }

    const newOTP = generateOTP();
    if (process.env.OTP_MODE === 'demo') {
      console.log(`Resending OTP for ${emailLower}: ${newOTP}`);
    } else {
      console.log(`Generated replacement OTP for ${emailLower}; sending via ${process.env.EMAIL_PROVIDER || 'configured email provider'}`);
    }

    await updateOTPRecord(emailLower, {
      otp: newOTP,
      attemptCount: 0,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      resendCooldown: new Date(Date.now() + OTP_RESEND_COOLDOWN_SECONDS * 1000)
    });

    const emailResult = await sendOTPEmail(emailLower, record.name, newOTP, OTP_EXPIRY_MINUTES);

    if (!emailResult.success && process.env.OTP_MODE !== 'demo') {
      return res.status(500).json({ 
        message: 'Failed to resend verification email. Please try again later.' 
      });
    }

    return res.json({
      message: 'New OTP sent successfully',
      expiresIn: OTP_EXPIRY_MINUTES * 60,
      devMode: process.env.OTP_MODE === 'demo',
      ...(process.env.OTP_MODE === 'demo' && { devOTP: newOTP })
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ message: 'Failed to resend OTP. Please try again.' });
  }
}

/**
 * 4. CANCEL - Cancel pending registration
 * POST /api/auth/cancel-verification
 */
export async function cancelVerification(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailLower = email.toLowerCase().trim();
    const record = await findOTPRecord(emailLower);

    if (!record) {
      return res.status(404).json({ message: 'No pending verification found.' });
    }

    await deleteOTPRecord(emailLower);

    return res.json({ message: 'Registration cancelled successfully.' });
  } catch (error) {
    console.error('Cancel verification error:', error);
    return res.status(500).json({ message: 'Failed to cancel registration.' });
  }
}

/**
 * 5. STATUS - Check OTP verification status
 * GET /api/auth/otp-status?email=xxx
 */
export async function checkOTPStatus(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailLower = email.toLowerCase().trim();
    const record = await findOTPRecord(emailLower);

    if (!record) {
      const existingUser = await findUserByEmail(emailLower);
      if (existingUser) {
        return res.json({ 
          status: 'verified',
          message: 'This email is already registered and verified.'
        });
      }
      return res.json({ 
        status: 'not_found',
        message: 'No pending verification found.'
      });
    }

    const isExpired = new Date() > new Date(record.expiresAt);
    const remainingAttempts = (record.maxAttempts || MAX_OTP_ATTEMPTS) - (record.attemptCount || 0);

    let cooldownRemaining = 0;
    if (record.resendCooldown && new Date() < new Date(record.resendCooldown)) {
      cooldownRemaining = Math.ceil((new Date(record.resendCooldown) - new Date()) / 1000);
    }

    return res.json({
      status: isExpired ? 'expired' : 'pending',
      email: emailLower,
      name: record.name,
      role: record.role,
      remainingAttempts,
      isExpired,
      expiresAt: record.expiresAt,
      cooldownRemaining,
      message: isExpired 
        ? 'OTP has expired. Please request a new one.' 
        : 'Verification is pending. Please check your email for the OTP.'
    });
  } catch (error) {
    console.error('Check OTP status error:', error);
    return res.status(500).json({ message: 'Failed to check OTP status.' });
  }
}
