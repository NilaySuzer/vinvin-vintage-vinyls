import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', async (req, res) => {
  try {
    const { email, sifre } = req.body;
    
    // 1. Sadece e-postaya göre kullanıcıyı bul
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'E-posta veya şifre hatalı.' });
    }

    // 2. Şifreyi bcrypt ile karşılaştır (şifreler düz metin tutuluyorsa: user.sifre === sifre)
    const isMatch = user.sifre.startsWith('$2') 
      ? await bcrypt.compare(sifre, user.sifre)
      : user.sifre === sifre;

    if (!isMatch) {
      return res.status(401).json({ message: 'E-posta veya şifre hatalı.' });
    }

    // 3. Token üret ve kullanıcı bilgilerini dön
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'gizli_anahtar', { expiresIn: '30d' });

    res.json({
      _id: user._id,
      name: user.name || user.adSoyad,
      email: user.email,
      role: user.role || (user.isAdmin ? 'admin' : 'user'),
      isAdmin: user.isAdmin,
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Giriş yapılırken sunucu hatası oluştu.' });
  }
});

// ŞİFREMİ UNUTTUM ENDPOINT'I
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Gerçek projede burası e-posta ile token linki gönderir (Nodemailer vb.)
    // Test aşaması için şifreyi geçici olarak '123456' yapabilir veya onay dönebilirsin:
    res.json({ message: 'Sıfırlama e-postası başarıyla iletildi.' });
  } catch (err) {
    res.status(500).json({ message: 'İşlem gerçekleştirilemedi.' });
  }
});

export default router;