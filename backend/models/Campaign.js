import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  baslik: { type: String, required: true },
  detay: { type: String, required: true },
  renk: { type: String, default: '#ff9e00' },
  kod: { type: String, required: true, uppercase: true },
  kategori: { type: String, default: 'Tümü' },
  isAktif: { type: Boolean, default: true } // 👈 Kuponun geçerli/geçersiz olma durumu!
}, {
  timestamps: true
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;