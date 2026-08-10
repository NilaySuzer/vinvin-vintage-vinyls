import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js'; // Yetki kontrolü

const router = express.Router();

// 1. Giriş Yapan Kullanıcının Kendi Siparişlerini Getir
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ kullanici: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Siparişler çekilemedi' });
  }
});

// 2. Sipariş İptal Etme
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    if (order.kullanici.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    order.durum = 'İptal Edildi'; // Sipariş durumunu güncelliyoruz
    await order.save();
    res.json({ message: 'Sipariş iptal edildi', order });
  } catch (error) {
    res.status(500).json({ message: 'Sipariş iptal edilirken hata oluştu' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { siparisKalemleri, teslimatBilgileri, odemeYontemi, toplamTutar, indirimTutari, odenecekTutar } = req.body;

    if (!siparisKalemleri || siparisKalemleri.length === 0) {
      return res.status(400).json({ message: 'Sepet boş!' });
    }

    const order = new Order({
      siparisKalemleri,
      teslimatBilgileri,
      odemeYontemi,
      toplamTutar,
      indirimTutari,
      odenecekTutar
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Sipariş oluşturulamadı', error: error.message });
  }
});

export default router;