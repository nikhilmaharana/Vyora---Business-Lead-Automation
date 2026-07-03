import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  businessId: { type: String, index: true },
  
  // Registration Step Tracking
  registrationStep: { type: Number, default: 1, min: 1, max: 5 },
  registrationComplete: { type: Boolean, default: false },
  
  // Step 1: Basic Info
  businessName: String,
  businessType: { type: String, enum: ['Individual', 'Partnership', 'Private Limited', 'LLP', 'Public Limited', 'Other'] },
  
  // Step 2: Contact & Location
  businessEmail: String,
  businessPhone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  serviceAreas: [String],
  
  // Step 3: Business Details
  category: String,
  subCategory: String,
  description: String,
  yearsInBusiness: Number,
  website: String,
  socialLinks: {
    facebook: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  
  // Step 4: Documents (KYC)
  documentType: { type: String, enum: ['Aadhaar', 'PAN', 'GST', 'Trade License', 'MSME', 'Other'] },
  documentNumber: String,
  documentFile: String,
  gstin: String,
  panNumber: String,
  
  // Step 5: Business Proof
  businessProofType: String,
  businessProofFile: String,
  additionalInfo: String,
  
  // Verification Status
  kycStatus: { type: String, enum: ['pending', 'submitted', 'under_review', 'verified', 'rejected'], default: 'pending' },
  verificationNotes: String,
  verifiedBy: String,
  verifiedAt: Date,
  
  // Profile Completion
  profileCompletion: { type: Number, default: 0 },
  
  // Metadata
  submittedAt: Date,
  completedAt: Date,
  
  // Rejection tracking for re-submission
  rejectionReason: String,
  resubmissionCount: { type: Number, default: 0 },
  lastRejectedAt: Date
}, { timestamps: true, strict: false });

export default mongoose.model('Verification', verificationSchema);