import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const initialProducts = [
  { ad: "Carry on Wayward Son", sanatci: "Kansas", fiyat: 450, kategori: "Rock", stok: 5 },
  { ad: "Bohemian Rhapsody", sanatci: "Queen", fiyat: 600, kategori: "Rock", stok: 3 },
  { ad: "Take Five", sanatci: "Dave Brubeck", fiyat: 550, kategori: "Jazz", stok: 8 },
  { ad: "So What", sanatci: "Miles Davis", fiyat: 700, kategori: "Jazz", stok: 2 }
];

const initialCoupons = [
  { kod: 'VINTAGE10', oran: 0.10, mesaj: '🎉 %10 İndirim Kuponu Uygulandı!' },
  { kod: 'VINVIN20', oran: 0.20, mesaj: '🔥 %20 Özel VinVin Kuponu Uygulandı!' }
];

await Product.deleteMany();
await Coupon.deleteMany();

await Product.insertMany(initialProducts);
await Coupon.insertMany(initialCoupons);

console.log("✅ Örnek veri ve kuponlar başarıyla veritabanına yüklendi!");
process.exit();