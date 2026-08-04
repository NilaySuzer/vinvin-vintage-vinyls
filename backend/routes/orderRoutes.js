import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

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