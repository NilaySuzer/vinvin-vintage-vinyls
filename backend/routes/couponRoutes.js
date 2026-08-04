import express from 'express';
import Coupon from '../models/Coupon.js';

const router = express.Router();

router.post('/validate', async (req, res) => {
  const { kod } = req.body;
  if (!kod) return res.status(400).json({ message: '❌ Lütfen bir kupon kodu girin' });

  const coupon = await Coupon.findOne({ kod: kod.trim().toUpperCase(), aktif: true });

  if (coupon) {
    res.json({ oran: coupon.oran, mesaj: coupon.mesaj });
  } else {
    res.status(404).json({ message: '❌ Geçersiz Kupon Kodu' });
  }
});

export default router;