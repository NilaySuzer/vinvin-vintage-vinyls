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
  kondisyon: { type: String, default: 'Pırıl Pırıl (NM / 9/10)' },
  devir: { type: String, default: '33 RPM (12" LP)' },
  baskiYili: { type: String, default: 'Orijinal Retro Baskı' },
  stok: { type: Number, required: true, default: 5 },
  resim: { type: String, default: '' },
  reviews: [reviewSchema],
  stokHaberVerListesi: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
  }],
  // models/Product.js şemasına eklenecek:
indirimOrani: { 
  type: Number, 
  default: 0 // Yüzde olarak: 0 ise indirim yok, 20 ise %20 indirim
}
}, { timestamps: true });

export default mongoose.model('Product', productSchema);