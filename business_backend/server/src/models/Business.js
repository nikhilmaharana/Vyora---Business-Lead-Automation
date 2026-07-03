import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  id: { type: String, index: true, unique: true, sparse: true },
  ownerId: String,
  name: String,
  ownerName: String,
  category: String,
  subCategory: String,
  type: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  serviceAreas: [String],
  budgetMin: Number,
  budgetMax: Number,
  rating: Number,
  responseTimeMins: Number,
  conversionRate: Number,
  revenue: Number,
  profileCompletion: Number,
  approved: Boolean,
  kycStatus: String,
  verifiedBadge: Boolean,
  credits: Number,
  plan: String,
  socials: Object,
  seo: Object,
  website: Object
}, { timestamps: true, strict: false });

export default mongoose.model('Business', businessSchema);
