import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  id: { type: String, index: true, unique: true, sparse: true },
  customerId: String,
  name: String,
  mobile: String,
  category: String,
  requirement: String,
  budget: Number,
  location: String,
  timeline: String,
  source: String,
  score: String,
  status: String,
  assignedTo: String,
  businessIds: [String],
  notes: [String],
  followUpAt: String
}, { timestamps: true, strict: false });

export default mongoose.model('Lead', leadSchema);
