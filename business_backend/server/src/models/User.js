import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, index: true, unique: true, sparse: true },
  name: String,
  email: { type: String, index: true },
  phone: { type: String, index: true },
  passwordHash: String,
  role: { type: String, enum: ['guest', 'user', 'business_owner', 'manager', 'sales_staff', 'marketing_staff', 'admin', 'moderator', 'super_admin', 'technical_admin', 'finance_admin'], default: 'user' },
  verified: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  favorites: [String],
  activity: [String]
}, { timestamps: true, strict: false });

export default mongoose.model('User', userSchema);
