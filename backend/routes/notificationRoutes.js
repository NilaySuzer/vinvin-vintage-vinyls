import express from 'express';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import Product from '../models/Product.js';

const router = express.Router();

// Bildirimleri Getir (Kullanıcıya Özel + Genel Duyurular)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    let filter = { userId: null };

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const uId = new mongoose.Types.ObjectId(userId);
      filter = {
        $or: [
          { userId: uId },
          { userId: userId },
          { userId: null }
        ]
      };
    }

    const bildirimler = await Notification.find(filter).sort({ createdAt: -1 }).limit(40);

    const formatli = bildirimler.map(b => {
      const isRead = b.userId 
        ? b.okundu 
        : (userId ? (b.okuyanKullanicilar || []).some(id => id.toString() === userId.toString()) : false);

      return {
        _id: b._id,
        baslik: b.baslik,
        mesaj: b.mesaj,
        tur: b.tur,
        plakId: b.plakId,
        okundu: Boolean(isRead),
        createdAt: b.createdAt
      };
    });

    res.json(formatli);
  } catch (err) {
    console.error('Bildirim çekme hatası:', err);
    res.status(500).json({ message: 'Bildirimler yüklenemedi.' });
  }
});

// 2. Bildirimi Okundu Olarak İşaretle
router.put('/:id/read', async (req, res) => {
  try {
    const { userId } = req.body;
    const bildirim = await Notification.findById(req.params.id);

    if (!bildirim) {
      return res.status(404).json({ message: 'Bildirim bulunamadı.' });
    }

    if (bildirim.userId) {
      bildirim.okundu = true;
    } else if (userId && !bildirim.okuyanKullanicilar.includes(userId)) {
      bildirim.okuyanKullanicilar.push(userId);
    }

    await bildirim.save();
    res.json({ message: 'Okundu işaretlendi.' });
  } catch (err) {
    res.status(500).json({ message: 'İşlem başarısız.' });
  }
});

// 3. Stok Gelince Haber Ver Listesine Kayıt Ol
router.post('/subscribe-stock', async (req, res) => {
  try {
    const { userId, plakId } = req.body;

    if (!userId || !plakId) {
      return res.status(400).json({ message: 'Kullanıcı ve Plak ID zorunludur.' });
    }

    // ID geçerlilik kontrolü
    if (!mongoose.Types.ObjectId.isValid(plakId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Geçersiz ID formatı.' });
    }

    const plak = await Product.findById(plakId);
    if (!plak) {
      return res.status(404).json({ message: 'Plak bulunamadı.' });
    }

    // Liste yoksa başlat
    if (!plak.stokHaberVerListesi) {
      plak.stokHaberVerListesi = [];
    }

    // Kullanıcı zaten ekli mi kontrol et
    const zatenEkli = plak.stokHaberVerListesi.some(id => id.toString() === userId.toString());

    if (!zatenEkli) {
      plak.stokHaberVerListesi.push(userId);
      await plak.save();
    }

    console.log(`[STOK TAKİP] "${plak.ad}" için kullanıcı kaydedildi. Toplam bekleyen: ${plak.stokHaberVerListesi.length}`);

    res.json({ message: 'Stoğa girdiğinde size haber vereceğiz! 🔔' });
  } catch (err) {
    console.error('Stok abonelik hatası:', err);
    res.status(500).json({ message: 'İşlem gerçekleştirilemedi: ' + err.message });
  }
});

// 4. Admin: Tüm Kullanıcılara Genel Bildirim Gönder
router.post('/send-global', async (req, res) => {
  try {
    const { baslik, mesaj, tur } = req.body;
    if (!baslik || !mesaj) {
      return res.status(400).json({ message: 'Başlık ve mesaj zorunludur.' });
    }

    const yeniBildirim = new Notification({
      userId: null, // Genel bildirim
      baslik,
      mesaj,
      tur: tur || 'genel'
    });

    await yeniBildirim.save();
    res.json({ message: 'Genel bildirim tüm kullanıcılara iletildi! 📢', bildirim: yeniBildirim });
  } catch (err) {
    res.status(500).json({ message: 'Bildirim gönderilemedi.' });
  }
});

export default router;