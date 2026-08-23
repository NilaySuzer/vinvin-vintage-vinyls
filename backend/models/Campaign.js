import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  baslik: { type: String, required: true },
  detay: { type: String, required: true },
  renk: { type: String, default: '#ff9e00' },
  kod: { type: String, required: true, uppercase: true, trim: true, unique: true },
  indirimYuzdesi: { type: Number, required: true, min: 1, max: 100 },
  hedefKategori: { type: String, default: 'Tümü' }, // 'Tümü', 'Rock', 'Pop', 'Jazz' vb.
  bitisTarihi: { type: Date, required: true },
  aktif: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;