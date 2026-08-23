import express from 'express';
import Campaign from '../models/Campaign.js';

const router = express.Router();

// 1. Vitrin & Banner İçin Kampanyalar
router.get('/', async (req, res) => {
  try {
    // Sadece aktif olanları getir (otomatik bozma sorgusu kaldırıldı)
    const campaigns = await Campaign.find({
      $or: [{ aktif: true }, { isAktif: true }]
    }).sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    console.error('Kampanya getirme hatası:', error);
    res.status(500).json({ message: 'Kampanyalar getirilemedi' });
  }
});

// 2. Admin İçin Tüm Kampanyalar
router.get('/admin', async (req, res) => {
  try {
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error('Admin kampanya listesi hatası:', error);
    res.status(500).json({ message: 'Kampanya listesi alınamadı' });
  }
});

// 3. Yeni Kampanya Ekleme
router.post('/', async (req, res) => {
  try {
    const { 
      baslik, 
      detay, 
      renk, 
      kod, 
      kategori, 
      hedefKategori, 
      sonTarih, 
      bitisTarihi, 
      indirimYuzdesi 
    } = req.body;

    const yeniKampanya = new Campaign({
      baslik: baslik || 'Özel İndirim',
      detay: detay || 'Tüm plaklarda geçerli!',
      renk: renk || '#ff9e00',
      kod: (kod || 'INDIRIM').toUpperCase().trim(),
      hedefKategori: hedefKategori || kategori || 'Tümü',
      bitisTarihi: bitisTarihi || sonTarih || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      indirimYuzdesi: Number(indirimYuzdesi) || 10,
      aktif: true,
      isAktif: true
    });

    const kaydedilen = await yeniKampanya.save();
    console.log(`✅ [KAMPANYA EKLENDİ] ${kaydedilen.kod}`);
    res.status(201).json(kaydedilen);
  } catch (error) {
    console.error('Kampanya ekleme hatası:', error);
    res.status(500).json({ message: 'Kampanya oluşturulamadı: ' + error.message });
  }
});

// 4. Kuponu Aktif/Pasif Yap (Toggle)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Kampanya bulunamadı' });
    }

    const suAnki = (campaign.aktif !== undefined) ? campaign.aktif : !!campaign.isAktif;
    const yeni = !suAnki;

    const guncel = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: { aktif: yeni, isAktif: yeni } },
      { returnDocument: 'after' }
    );

    console.log(`🔄 [TOGGLE] ${guncel.kod} -> ${yeni ? 'AKTİF' : 'PASİF'}`);
    res.json(guncel);
  } catch (error) {
    console.error('Toggle hatası:', error);
    res.status(500).json({ message: 'Durum değiştirilemedi' });
  }
});

// 5. Kupon Doğrulama (Sepet)
// routes/campaignRoutes.js
router.post('/validate-coupon', async (req, res) => {
  try {
    const { kod, cartItems } = req.body;
    if (!kod) return res.status(400).json({ message: 'Kupon kodu giriniz.' });

    // 1. Veritabanından büyük/küçük harf duyarsız bul
    const campaign = await Campaign.findOne({
      kod: { $regex: new RegExp(`^${kod.trim()}$`, 'i') }
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Böyle bir kupon kodu bulunamadı! ❌' });
    }

    // 2. Aktiflik Kontrolü (Admin pasif yaptıysa anında reddeder)
    const aktifMi = (campaign.aktif !== undefined) ? campaign.aktif : campaign.isAktif;
    if (!aktifMi) {
      return res.status(400).json({ message: 'Bu kupon şu anda pasif/geçersiz durumda! ⏳' });
    }

    // 3. Kategori Kontrolü
    const hedef = (campaign.hedefKategori || campaign.kategori || 'Tümü').trim().toLowerCase();
    const urunler = cartItems || [];

    let gecerliUrunler = [];
    if (hedef === 'tümü' || hedef === 'tum' || hedef === 'all' || !hedef) {
      gecerliUrunler = urunler;
    } else {
      gecerliUrunler = urunler.filter(item => {
        const itemKategori = (item.kategori || '').trim().toLowerCase();
        return itemKategori === hedef || itemKategori.includes(hedef);
      });
    }

    if (gecerliUrunler.length === 0) {
      return res.status(400).json({
        message: `Bu kupon yalnızca "${campaign.hedefKategori || campaign.kategori}" kategorisindeki ürünler için geçerlidir! ⚠️`
      });
    }

    // 4. İndirim Tutarı Hesabı
    const yuzde = Number(campaign.indirimYuzdesi || 10);
    const kapsayanToplam = gecerliUrunler.reduce((top, item) => {
      const fiyat = Number(item.fiyat || 0);
      const adet = Number(item.adet || 1);
      return top + (fiyat * adet);
    }, 0);

    const indirimTutari = Number(((kapsayanToplam * yuzde) / 100).toFixed(2));

    res.json({
      success: true,
      kod: campaign.kod,
      indirimYuzdesi: yuzde,
      hedefKategori: campaign.hedefKategori || campaign.kategori,
      indirimTutari: indirimTutari,
      message: `"${campaign.kod}" kodu uygulandı! %${yuzde} indirim kazandınız. 🎉`
    });

  } catch (error) {
    console.error('Kupon kontrol hatası:', error);
    res.status(500).json({ message: 'Kupon kontrol edilirken hata oluştu.' });
  }
});
export default router;