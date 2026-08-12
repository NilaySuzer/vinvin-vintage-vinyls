import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

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

export default router;