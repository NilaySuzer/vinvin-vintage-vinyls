import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  baslik: { type: String, required: true }, // Örn: "Evim", "İş Yeri"
  sehir: { type: String, required: true },
  ilce: { type: String, required: true },
  acikAdres: { type: String, required: true }
});

const notificationSchema = new mongoose.Schema({
  baslik: { type: String, required: true },
  mesaj: { type: String, required: true },
  tarih: { type: Date, default: Date.now },
  okundu: { type: Boolean, default: false }
});
const userSchema = new mongoose.Schema({
  adSoyad: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sifre: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  adresler: [addressSchema], // 👈 Çoklu Adresler
  bildirimler: [notificationSchema] // 👈 Bildirimler
}, { timestamps: true });

// Şifreyi kaydetmeden önce hash'leme
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Şifre doğrulama metodu
userSchema.methods.sifreEslestir = async function (girilenSifre) {
  return await bcrypt.compare(girilenSifre, this.sifre);
};

export default mongoose.model('User', userSchema);