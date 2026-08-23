import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import Notification from '../models/Notification.js';
const router = express.Router();

// 1. Tüm Ürünleri Getir (GET /api/products)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ürünler getirilemedi' });
  }
});

// 2. Yeni Ürün Ekle (POST /api/products) 👈 İŞTE BURASI EKSİK YA DA YANLIŞ ROUTE İSMİYLE TANIMLIYDI
router.post('/', protect, admin, async (req, res) => {
  try {
    const { ad, sanatci, fiyat, kategori, stok, resim, aciklama } = req.body;

    const product = new Product({
      ad,
      sanatci,
      fiyat,
      kategori: kategori || 'Rock',
      stok: stok || 10,
      resim: resim || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500',
      aciklama: aciklama || 'Vintage Orijinal Baskı Plak'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Ürün eklenirken bir hata oluştu', error: error.message });
  }
});

// 3. Ürün Sil (DELETE /api/products/:id)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Ürün silindi' });
    } else {
      res.status(404).json({ message: 'Ürün bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ürün silinemedi' });
  }
});



// POST /api/products/:id/reviews
router.post('/:id/reviews', async (req, res) => {
  try {
    const { kullaniciAdi, puan, yorum } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Plak bulunamadı' });
    }

    const yeniYorum = {
      kullaniciAdi: kullaniciAdi || 'Anonim Koleksiyoner',
      puan: Number(puan) || 5,
      yorum,
      tarih: new Date()
    };

    product.reviews.unshift(yeniYorum); // En yeni yorumu en başa ekler
    await product.save();

    res.status(201).json({ message: 'Yorum kaydedildi', reviews: product.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Yorum kaydedilirken hata oluştu', error: error.message });
  }
});

router.patch('/:id/stock', async (req, res) => {
  console.log(`[GELEN ISTEK] PATCH /products/${req.params.id}/stock -> Body:`, req.body);
  try {
    const { id } = req.params;
    const { stok, stock, adet } = req.body;
    const yeniStok = Number(stok ?? stock ?? adet ?? 0);

    const plak = await Product.findById(id);
    if (!plak) return res.status(404).json({ message: 'Ürün bulunamadı.' });

    console.log(`[STOK LOG] Plak: ${plak.ad} | Yeni Stok: ${yeniStok} | Bekleyen Abone Sayısı: ${plak.stokHaberVerListesi?.length || 0}`);

    // Şartı esnettik: Yeni stok 0'dan büyükse ve abone varsa bildirimi gönder
    if (yeniStok > 0 && plak.stokHaberVerListesi && plak.stokHaberVerListesi.length > 0) {
      const bildirimler = plak.stokHaberVerListesi.map(kullaniciId => ({
        userId: new mongoose.Types.ObjectId(kullaniciId),
        baslik: '🔔 Beklediğin Plak Yeniden Stokta!',
        mesaj: `"${plak.ad}" adlı plak yeniden stoklarımıza girdi. Tükenmeden hemen kap! 💿`,
        tur: 'stok',
        plakId: plak._id,
        okundu: false
      }));

      await Notification.insertMany(bildirimler);
      console.log(`🎉 [BİLDİRİM GÖNDERİLDİ] ${bildirimler.length} kullanıcıya bildirim MongoDB'ye kaydedildi!`);

      plak.stokHaberVerListesi = [];
    }

    plak.stok = yeniStok;
    await plak.save();

    res.json({ message: 'Stok güncellendi! 📦', product: plak });
  } catch (err) {
    console.error('Stok güncelleme hatası:', err);
    res.status(500).json({ message: 'Stok güncellenemedi.' });
  }
});

// 4. FORM İLE DÜZENLEME (Admin PUT)
router.put('/:id', async (req, res) => {
  console.log(`[GELEN ISTEK] PUT /products/${req.params.id} -> Body:`, req.body);
  try {
    const plak = await Product.findById(req.params.id);
    if (!plak) return res.status(404).json({ message: 'Ürün bulunamadı.' });

    const gelenStok = req.body.stok ?? req.body.stock ?? req.body.adet;
    const yeniStok = gelenStok !== undefined ? Number(gelenStok) : Number(plak.stok || 0);

    if (yeniStok > 0 && plak.stokHaberVerListesi && plak.stokHaberVerListesi.length > 0) {
      const bildirimler = plak.stokHaberVerListesi.map(kullaniciId => ({
        userId: new mongoose.Types.ObjectId(kullaniciId),
        baslik: '🔔 Beklediğin Plak Yeniden Stokta!',
        mesaj: `"${plak.ad}" adlı plak yeniden stoklarımıza girdi. Tükenmeden hemen kap! 💿`,
        tur: 'stok',
        plakId: plak._id,
        okundu: false
      }));

      await Notification.insertMany(bildirimler);
      console.log(`🎉 [BİLDİRİM GÖNDERİLDİ] ${bildirimler.length} kullanıcıya bildirim MongoDB'ye kaydedildi!`);

      plak.stokHaberVerListesi = [];
    }

    // _id ve id alanlarını temizle (MongoDB çökmesini engelleyen kritik adım)
    const guncelVeri = { ...req.body };
    delete guncelVeri._id;
    delete guncelVeri.id;

    // Kalan alanları güvenle aktar
    Object.assign(plak, guncelVeri);
    
    if (gelenStok !== undefined) plak.stok = yeniStok;
    if (guncelVeri.fiyat !== undefined) plak.fiyat = Number(guncelVeri.fiyat);
    if (guncelVeri.indirimOrani !== undefined) plak.indirimOrani = Number(guncelVeri.indirimOrani);

    await plak.save();
    console.log(`✅ [GÜNCELLENDİ] "${plak.ad}" başarıyla kaydedildi.`);
    res.json({ message: 'Ürün güncellendi.', product: plak });
  } catch (err) {
    console.error('Ürün güncelleme hatası:', err);
    res.status(500).json({ message: 'Güncellenemedi: ' + err.message });
  }
});

export default router;