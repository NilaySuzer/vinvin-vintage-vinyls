import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  kullanici: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  siparisKalemleri: [
    {
      ad: { type: String, required: true },
      fiyat: { type: Number, required: true },
      adet: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
    }
  ],
  teslimatBilgileri: {
    adSoyad: { type: String, required: true },
    telefon: { type: String, required: true },
    adres: { type: String, required: true }
  },
  odemeYontemi: { type: String, required: true },
  toplamTutar: { type: Number, required: true },
  indirimTutari: { type: Number, default: 0 },
  odenecekTutar: { type: Number, required: true },
  isPaid: { type: Boolean, default: true },
  paidAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);