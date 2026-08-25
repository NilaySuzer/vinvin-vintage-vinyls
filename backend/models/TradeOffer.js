import mongoose from 'mongoose';

const tradeOfferSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  plakAdi: { type: String, required: true },
  sanatci: { type: String, required: true },
  kondisyon: { 
    type: String, 
    enum: ['Jelatininde', 'Kusursuz', 'Çok İyi', 'İyi', 'Çalınabilir'],
    required: true 
  },
  teklifTuru: {
    type: String,
    enum: ['satis', 'takas'],
    default: 'satis'
  },
  talepEdilenFiyat: { type: Number, default: 0 },
  aciklama: { type: String, default: '' },
  fotografUrl: { type: String, default: '' }, // Görsel URL veya base64
  durum: {
    type: String,
    enum: ['beklemede', 'onaylandi', 'reddedildi'],
    default: 'beklemede'
  },
  adminTeklifFiyati: { type: Number, default: null }, // Adminin karşı teklifi
  adminNotu: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('TradeOffer', tradeOfferSchema);