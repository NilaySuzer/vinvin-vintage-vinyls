import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  isim: { type: String, required: true },
  yıldız: { type: Number, required: true, min: 1, max: 5 },
  metin: { type: String, required: true },
  tarih: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  ad: { type: String, required: true },
  sanatci: { type: String, required: true },
  fiyat: { type: Number, required: true },
  kategori: { type: String, required: true, enum: ['Rock', 'Jazz', 'Pop'] },
  stok: { type: Number, required: true, default: 1 },
  kondisyon: { type: String, default: 'Pırıl Pırıl (NM / 9/10)' },
  devir: { type: String, default: '33 RPM (12" LP)' },
  baskiYili: { type: String, default: 'Orijinal Retro Baskı' },
  stok: { type: Number, required: true, default: 5 },
  yorumlar: [commentSchema]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);