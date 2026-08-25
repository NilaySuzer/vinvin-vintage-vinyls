import mongoose from 'mongoose';
import express from 'express';
import TradeOffer from '../models/TradeOffer.js';
import Notification from '../models/Notification.js'; // Mevcut bildirim modelin

const router = express.Router();

// 1. Yeni Teklif Gönder (Kullanıcı)
router.post('/create', async (req, res) => {
  try {
    const { userId, userName, userEmail, plakAdi, sanatci, kondisyon, teklifTuru, talepEdilenFiyat, aciklama, fotografUrl } = req.body;

    if (!userId || !plakAdi || !sanatci || !kondisyon) {
      return res.status(400).json({ success: false, message: 'Lütfen zorunlu alanları doldurun.' });
    }

    const newOffer = new TradeOffer({
      userId,
      userName,
      userEmail,
      plakAdi,
      sanatci,
      kondisyon,
      teklifTuru,
      talepEdilenFiyat,
      aciklama,
      fotografUrl
    });

    await newOffer.save();
    res.status(201).json({ success: true, message: 'Teklifiniz başarıyla iletildi!', data: newOffer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Kullanıcının Kendi Tekliflerini Getir
router.get('/my-offers/:userId', async (req, res) => {
  try {
    const offers = await TradeOffer.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Tüm Teklifleri Getir (Admin)
router.get('/all', async (req, res) => {
  try {
    const offers = await TradeOffer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Admin Teklifi Yanıtla (Onayla / Reddet / Fiyat Ver) & Bildirim Gönder
router.put('/respond/:id', async (req, res) => {
  try {
    const { durum, adminTeklifFiyati, adminNotu } = req.body;
    const offer = await TradeOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Teklif bulunamadı.' });
    }

    offer.durum = durum;
    offer.adminTeklifFiyati = adminTeklifFiyati !== undefined ? adminTeklifFiyati : offer.adminTeklifFiyati;
    offer.adminNotu = adminNotu || '';
    await offer.save();

    // 🔔 Kullanıcıya Bildirim Oluştur
    let bildirimMesaj = '';
    if (durum === 'onaylandi') {
      bildirimMesaj = `Tebrikler! "${offer.plakAdi}" plağınız için ${adminTeklifFiyati ? adminTeklifFiyati + ' TL teklif verildi' : 'teklifiniz onaylandı'}. ${adminNotu ? 'Not: ' + adminNotu : ''}`;
    } else if (durum === 'reddedildi') {
      bildirimMesaj = `"${offer.plakAdi}" plağınız için iletilen teklif maalesef onaylanmadı. ${adminNotu ? 'Sebep: ' + adminNotu : ''}`;
    }

    if (Notification && bildirimMesaj) {
      await Notification.create({
        userId: offer.userId,
        baslik: `🔄 Plak Teklifi Yanıtlandı (${durum.toUpperCase()})`,
        mesaj: bildirimMesaj,
        okundu: false
      });
    }

    res.json({ success: true, message: 'Teklif güncellendi ve kullanıcıya bildirim gönderildi.', data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;