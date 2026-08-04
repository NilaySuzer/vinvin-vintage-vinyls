import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  kod: { type: String, required: true, unique: true, uppercase: true },
  oran: { type: Number, required: true }, // Örn: 0.10 (%10)
  mesaj: { type: String, required: true },
  aktif: { type: Boolean, default: true }
});

export default mongoose.model('Coupon', couponSchema);