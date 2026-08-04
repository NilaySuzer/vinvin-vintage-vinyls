import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  adSoyad: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sifre: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// Şifreyi kaydetmeden önce hash'leme
userSchema.pre('save', async function (next) {
  if (!this.isModified('sifre')) return next();
  const salt = await bcrypt.genSalt(10);
  this.sifre = await bcrypt.hash(this.sifre, salt);
});

// Şifre doğrulama metodu
userSchema.methods.sifreEslestir = async function (girilenSifre) {
  return await bcrypt.compare(girilenSifre, this.sifre);
};

export default mongoose.model('User', userSchema);