import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// 1. Yeni Görüş / Öneri Gönderme (Kullanıcı)
router.post('/', async (req, res) => {
  try {
    const { adSoyad, mesaj, userId } = req.body;
    if (!adSoyad || !mesaj) {
      return res.status(400).json({ message: 'Lütfen ad soyad ve mesajınızı girin.' });
    }
    const newFeedback = new Feedback({
      adSoyad,
      mesaj,
      user: userId || null
    });
    await newFeedback.save();
    res.status(201).json({ message: 'Görüş ve öneriniz için teşekkür ederiz! 💌', data: newFeedback });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası, mesaj gönderilemedi.' });
  }
});

// 2. Tüm Görüş / Önerileri Getirme (Admin için)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Görüşler yüklenemedi.' });
  }
});

// 3. Görüş / Öneri Silme (Admin için)
router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Geri bildirim silindi.' });
  } catch (err) {
    res.status(500).json({ message: 'Silme işlemi başarısız.' });
  }
});

export default router;