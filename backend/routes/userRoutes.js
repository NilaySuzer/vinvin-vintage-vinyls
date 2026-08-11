import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Profil Bilgilerini ve Şifreyi Güncelleme
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.adSoyad = req.body.adSoyad || user.adSoyad;
      user.name = req.body.adSoyad || user.name;
      user.email = req.body.email || user.email;

      if (req.body.yeniSifre) {
        user.sifre = req.body.yeniSifre;
        user.password = req.body.yeniSifre;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        adSoyad: updatedUser.adSoyad || updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: req.headers.authorization.split(' ')[1]
      });
    } else {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Profil güncellenemedi', error: error.message });
  }
});

export default router;