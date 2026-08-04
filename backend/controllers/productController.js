import Product from '../models/Product.js';

// Tüm ürünleri filtreleme ve sıralama ile getirme
export const getProducts = async (req, res) => {
  try {
    const { kategori, arama, sirallama } = req.query;
    let query = {};

    if (kategori && kategori !== 'Hepsi') {
      query.kategori = kategori;
    }

    if (arama) {
      query.$or = [
        { ad: { $regex: arama, $options: 'i' } },
        { sanatci: { $regex: arama, $options: 'i' } }
      ];
    }

    let sortOptions = {};
    if (sirallama === 'fiyat-artan') sortOptions.fiyat = 1;
    if (sirallama === 'fiyat-azalan') sortOptions.fiyat = -1;
    if (sirallama === 'a-z') sortOptions.ad = 1;

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Tek ürün detayı
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Geçersiz Ürün ID' });
  }
};

// Ürüne Yorum Ekleme
export const addComment = async (req, res) => {
  try {
    const { isim, yıldız, metin } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });

    const yeniYorum = { isim, yıldız: Number(yıldız), metin };
    product.yorumlar.unshift(yeniYorum);

    await product.save();
    res.status(201).json({ message: 'Yorum eklendi', yorumlar: product.yorumlar });
  } catch (error) {
    res.status(500).json({ message: 'Yorum eklenirken hata oluştu' });
  }
};