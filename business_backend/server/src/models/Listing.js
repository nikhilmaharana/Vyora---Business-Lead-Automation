import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  id: { type: String, index: true, unique: true },
  businessId: String,
  title: String,
  category: String,
  subCategory: String,
  description: String,
  image: String,
  price: Number,
  priceLabel: String,
  tags: [String],
  packages: [Object],
  status: String
}, { timestamps: true, strict: false });

export default mongoose.model('Listing', listingSchema);
