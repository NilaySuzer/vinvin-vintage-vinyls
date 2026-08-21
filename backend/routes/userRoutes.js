import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


// Profil Bilgilerini ve Şifreyi Güncelleme
// 1. Kullanıcı Profilini Getir
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      adresler: user.adresler || [],
      bildirimler: user.bildirimler || []
    });
  } else {
    res.status(404).json({ message: 'Kullanıcı bulunamadı' });
  }
});

// 2. Profil ve Şifre Güncelle
// KULLANICI PROFİL VE ŞİFRE GÜNCELLEME
router.put('/profile', async (req, res) => {
  try {
    const { userId, name, email, password } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Kullanıcı ID bulunamadı.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // 1. İsim Güncelle
    if (name) {
      user.name = name;
      if (user.adSoyad !== undefined) user.adSoyad = name;
    }

    // 2. E-Posta Güncelle
    if (email && email.toLowerCase() !== user.email) {
      const emailVarMi = await User.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: user._id } 
      });
      if (emailVarMi) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda!' });
      }
      user.email = email.toLowerCase();
    }

    // 3. Şifre Güncelle (Eğer yeni şifre girilmişse)
    if (password && password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      user.sifre = await bcrypt.hash(password.trim(), salt);
    }

    await user.save();

    res.json({
      message: 'Bilgiler başarıyla güncellendi.',
      user: {
        _id: user._id,
        name: user.name || user.adSoyad,
        email: user.email,
        role: user.role || (user.isAdmin ? 'admin' : 'user'),
        isAdmin: user.isAdmin || user.role === 'admin'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası: Güncellenemedi.' });
  }
});

// 3. Yeni Adres Ekle
router.post('/address', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { baslik, sehir, ilce, acikAdres } = req.body;
    user.adresler.push({ baslik, sehir, ilce, acikAdres });
    await user.save();
    res.json(user.adresler);
  } else {
    res.status(404).json({ message: 'Kullanıcı bulunamadı' });
  }
});

// 4. Adres Sil
router.delete('/address/:addressId', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.adresler = user.adresler.filter(a => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json(user.adresler);
  } else {
    res.status(404).json({ message: 'Kullanıcı bulunamadı' });
  }
});

export default router;