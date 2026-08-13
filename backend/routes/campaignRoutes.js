import express from 'express';
import Campaign from '../models/Campaign.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Aktif Kampanyaları Getir (Herkese Açık - Frontend Banner İçin)
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isAktif: true });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Kampanyalar getirilemedi' });
  }
});

// 2. Tüm Kampanyaları Getir (Sadece Admin İçin)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const campaigns = await Campaign.find({});
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Kampanya listesi alınamadı' });
  }
});

// 3. Yeni Kampanya Ekle (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { baslik, detay, renk, kod, kategori } = req.body;
    const campaign = new Campaign({ baslik, detay, renk, kod, kategori });
    const createdCampaign = await campaign.save();
    res.status(201).json(createdCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Kampanya oluşturulamadı' });
  }
});

// 4. Kuponu Aktif/Pasif Yap (Admin - Toggle Durumu)
router.patch('/:id/toggle', protect, admin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (campaign) {
      campaign.isAktif = !campaign.isAktif; // Aktifse pasif, pasifse aktif yapar
      const updatedCampaign = await campaign.save();
      res.json(updatedCampaign);
    } else {
      res.status(404).json({ message: 'Kampanya bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Kampanya durumu değiştirilemedi' });
  }
});

// 5. Kampanya Sil (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (campaign) {
      await campaign.deleteOne();
      res.json({ message: 'Kampanya silindi' });
    } else {
      res.status(404).json({ message: 'Kampanya bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Kampanya silinemedi' });
  }
});

export default router;