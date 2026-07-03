import { Router } from 'express';
import { 
  sendOTP, 
  verifyOTP, 
  resendOTP, 
  cancelVerification, 
  checkOTPStatus 
} from '../controllers/otpController.js';

const router = Router();

// Send OTP to email during signup
router.post('/send-otp', sendOTP);

// Verify OTP and create account
router.post('/verify-otp', verifyOTP);

// Resend OTP with cooldown
router.post('/resend-otp', resendOTP);

// Cancel pending registration
router.post('/cancel-verification', cancelVerification);

// Check OTP status
router.get('/otp-status', checkOTPStatus);

export default router;