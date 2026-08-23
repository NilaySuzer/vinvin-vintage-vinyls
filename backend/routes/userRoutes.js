import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. GET /api/users/profile (Kullanıcı profili ve favorileri getirme)
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = req.query.userId;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar');
        userId = decoded.id || decoded._id;
      } catch (e) {
        // Token geçersizse query parametresini dene
      }
    }

    if (!userId) {
      return res.status(400).json({ message: 'Kullanıcı kimliği bulunamadı.' });
    }

    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.json({
      _id: user._id,
      name: user.name || user.adSoyad || user.ad,
      adSoyad: user.adSoyad || user.name,
      email: user.email || user.eposta,
      role: user.role || (user.isAdmin ? 'admin' : 'user'),
      isAdmin: user.isAdmin || user.role === 'admin',
      favorites: user.favorites || [],
      adresler: user.adresler || []

    });
  } catch (err) {
    console.error('Profil getirme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası: Profil yüklenemedi.' });
  }
});

// 2. PUT /api/users/profile (Profil, E-posta ve Şifre Güncelleme)
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

    // İsim Güncelle
    if (name && name.trim()) {
      user.name = name.trim();
      user.adSoyad = name.trim();
    }

    // E-Posta Güncelle
    if (email && email.trim() && email.toLowerCase().trim() !== (user.email || user.eposta)) {
      const targetEmail = email.toLowerCase().trim();
      const emailVarMi = await User.findOne({
        $or: [{ email: targetEmail }, { eposta: targetEmail }],
        _id: { $ne: user._id }
      });
      if (emailVarMi) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda!' });
      }
      user.email = targetEmail;
      user.eposta = targetEmail;
    }

    // Şifre Güncelle
    if (password && password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password.trim(), salt);
      user.sifre = hashedPassword;
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: 'Bilgiler başarıyla güncellendi.',
      user: {
        _id: user._id,
        name: user.name || user.adSoyad,
        adSoyad: user.adSoyad || user.name,
        email: user.email || user.eposta,
        role: user.role || (user.isAdmin ? 'admin' : 'user'),
        isAdmin: user.isAdmin || user.role === 'admin'
      }
    });
  } catch (err) {
    console.error('Profil güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası: Bilgiler güncellenemedi.' });
  }
});

// 3. PUT /api/users/favorites (Favorileri Kaydetme / Senkronize Etme)
router.put('/favorites', async (req, res) => {
  try {
    const { userId, favorites, plakId } = req.body;
    let targetUserId = userId;

    const authHeader = req.headers.authorization;
    if (!targetUserId && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar');
        targetUserId = decoded.id || decoded._id;
      } catch (e) {}
    }

    if (!targetUserId) {
      return res.status(400).json({ message: 'Kullanıcı kimliği bulunamadı.' });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    if (favorites && Array.isArray(favorites)) {
      user.favorites = favorites.map(f => f._id || f.id || f);
    } else if (plakId) {
      const index = user.favorites.indexOf(plakId);
      if (index > -1) {
        user.favorites.splice(index, 1);
      } else {
        user.favorites.push(plakId);
      }
    }

    await user.save();
    res.json({ message: 'Favoriler güncellendi.', favorites: user.favorites });
  } catch (err) {
    console.error('Favori güncelleme hatası:', err);
    res.status(500).json({ message: 'Favoriler güncellenemedi.' });
  }
});

// 4. Adres Ekleme ve Silme
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