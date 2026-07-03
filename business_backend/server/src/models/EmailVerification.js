import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true,
    index: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  phone: { 
    type: String, 
    default: '' 
  },
  role: { 
    type: String, 
    enum: ['user', 'business_owner'], 
    default: 'user' 
  },
  passwordHash: { 
    type: String, 
    default: '' 
  },
  expiresAt: { 
    type: Date, 
    required: true 
  },
  attemptCount: { 
    type: Number, 
    default: 0 
  },
  maxAttempts: { 
    type: Number, 
    default: 5 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  resendCooldown: { 
    type: Date, 
    default: null 
  }
}, { 
  timestamps: true 
});

// TTL index to auto-delete expired records after 6 minutes (buffer after 5 min expiry)
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

// Pre-save hook to hash OTP for storage (basic hash, not password-level)
emailVerificationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  }
  next();
});

const EmailVerification = mongoose.model('EmailVerification', emailVerificationSchema);

export default EmailVerification;