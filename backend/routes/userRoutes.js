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
router.put('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      adresler: updatedUser.adresler,
      bildirimler: updatedUser.bildirimler
    });
  } else {
    res.status(404).json({ message: 'Kullanıcı bulunamadı' });
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