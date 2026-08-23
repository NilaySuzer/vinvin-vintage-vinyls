import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  kullaniciAdi: { type: String, required: true },
  puan: { type: Number, required: true, min: 1, max: 5 },
  yorum: { type: String, required: true },
  tarih: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  ad: { type: String, required: true },
  sanatci: { type: String, required: true },
  fiyat: { type: Number, required: true },
  kategori: { type: String, required: true, enum: ['Rock', 'Jazz', 'Pop', 'Metal', 'Klasik'] },
  stok: { type: Number, required: true, default: 1 },
  devir: { type: String, default: '33 RPM (12" LP)' },
  stok: { type: Number, required: true, default: 5 },
  resim: { type: String, default: '' },
  reviews: [reviewSchema],
  stokHaberVerListesi: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
  }],
baskiYili: { type: String, default: 'Orijinal İlk Baskı' },
  kondisyon: { 
    type: String, 
    default: 'Jelatininde'
  },
  indirimOrani: { type: Number, default: 0 }, // % indirim oranı (0 - 100)
  stokHaberVerListesi: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);