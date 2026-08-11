import express from 'express';
import Order from '../models/Order.js';
import jwt from 'jsonwebtoken'; // 👈 1. EKSİK: JWT token çözmek için bu şart!
import { protect, admin } from '../middleware/authMiddleware.js'; // 👈 2. EKSİK: Auth middleware yollarının tam olduğundan emin ol

const router = express.Router();

// 1. Yeni Sipariş Oluştur
router.post('/', async (req, res) => {
  try {
    const { siparisKalemleri, teslimatBilgileri, odemeYontemi, toplamTutar, indirimTutari, odenecekTutar } = req.body;

    // Eğer istekte Authorization Header (Token) varsa kullanıcıyı bağla
    let kullaniciId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        kullaniciId = decoded.id;
      } catch (e) {
        // Anonim sipariş geçişi
      }
    }

    const newOrder = new Order({
      kullanici: kullaniciId,
      siparisKalemleri,
      teslimatBilgileri,
      odemeYontemi,
      toplamTutar,
      indirimTutari,
      odenecekTutar,
      durum: 'Hazırlanıyor'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Sipariş oluşturulamadı', error: error.message });
  }
});

// 2. Kullanıcının Kendi Siparişleri
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ kullanici: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Siparişler çekilemedi' });
  }
});

// 3. Sipariş İptal Etme
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    if (order.kullanici.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Yetkisiz işlem' });
    }

    order.durum = 'İptal Edildi';
    await order.save();
    res.json({ message: 'Sipariş iptal edildi', order });
  } catch (error) {
    res.status(500).json({ message: 'İptal hatası' });
  }
});

// 4. ADMIN: Tüm Siparişleri Getirme
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('kullanici', 'adSoyad email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Tüm siparişler çekilemedi' });
  }
});

// 5. ADMIN: Sipariş Durumu Güncelleme (Kargoya Verildi vs.)
router.put('/admin/:id/status', protect, admin, async (req, res) => {
  try {
    const { durum } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });

    order.durum = durum;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Durum güncellenemedi' });
  }
});

export default router;