<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" />
  <br/>
  <h1> VinVin</h1>
  <h3> VinVin Vintage Vinyls E-ticaret Websitesi</h3>
  <p>Modern e-ticaret dinamiklerini retro müzik kültürü ve Neo-Brutalist tasarım diliyle birleştiren uçtan uca Full-Stack Web Platformu.</p>
</div>

---

## 📖 İçindekiler
1. [Proje Vizyonu ve Mimari Özeti](#-proje-vizyonu-ve-mimari-özeti)
2. [Sistem Özellikleri ve İş Mantığı (Business Logic)](#-sistem-özellikleri-ve-iş-mantığı)
   - [Kullanıcı Arayüzü & Keşif Modülü](#1-kullanıcı-arayüzü--keşif-modülü)
   - [Ürün Detay & Etkileşim Yönetimi](#2-ürün-detay--etkileşim-yönetimi)
   - [Sepet, Kupon ve Ödeme Akışı](#3-sepet-kupon-ve-ödeme-akışı)
   - [Plak Takas & Satış Ekosistemi (Trade-In)](#4--plak-takas--satış-ekosistemi-trade-in)
   - [Kullanıcı ve Hesap Yönetimi](#5-kullanıcı-ve-hesap-yönetimi)
   - [Admin Yönetim ve Kontrol Paneli](#6--admin-yönetim-ve-kontrol-paneli)
3. [Teknoloji Yığını ve Altyapı (Tech Stack)](#-teknoloji-yığını-ve-altyapı-tech-stack)
4. [Veritabanı Tasarımı (Schema Relationships)](#-veritabanı-tasarımı-ve-modeller)
5. [Güvenlik ve Performans Optimizasyonları](#-güvenlik-ve-performans-optimizasyonları)
6. [Dizin Yapısı (Directory Structure)](#-dizin-yapısı-directory-structure)
7. [Yerel Geliştirme Ortamı Kurulumu](#-yerel-geliştirme-ortamı-kurulumu-local-setup)
8. [Geliştirici](#-geliştirici)

---

## 🎯 Proje Vizyonu ve Mimari Özeti

**VinVin**, geleneksel B2C (Business-to-Consumer) e-ticaret sitelerinin tek yönlü yapısını kırarak, kullanıcıların platforma entegre olabildiği **çift taraflı bir pazar yeri (Two-Way Marketplace)** olarak dizayn edilmiştir. 

Sistem, kullanıcıların sadece plak satın almasını değil, sahip oldukları nadir/ikinci el plakları dükkana satabilmesini veya takaslayabilmesini sağlar. Projenin frontend mimarisi SPA (Single Page Application) prensipleriyle React üzerinde inşa edilmiş olup, backend tarafında RESTful prensiplerine sadık kalınarak Node.js & Express.js tabanlı, yüksek performanslı bir API katmanı oluşturulmuştur.

---

## ⚙️ Sistem Özellikleri ve İş Mantığı

### 1. Kullanıcı Arayüzü & Keşif Modülü
- **Neo-Brutalist Tasarım Sistemi:** Kullanıcı deneyimini (UX) retro bir hissiyatla sunmak için endüstriyel tasarım standartları uygulandı. Keskin kenarlıklar (3px-4px solid black border), sert kutu gölgeleri (`box-shadow: 4px 4px 0px`), kutu kalabalığından arındırılmış akıcı layout ve yüksek kontrastlı renk paleti kullanıldı.
- **Kategori Bazlı Dinamik Filtreleme:** Ürünler müzik türlerine göre (Rock, Jazz, Pop, Metal, Klasik vb.) sınıflandırıldı. İstemci tarafında sayfa yenilenmeden çalışan, O(N) karmaşıklığında hızlı filtreleme algoritması entegre edildi. Tıklanan kategori anında render edilirken, "Tümü" seçeneği arşivin tamamını eksiksiz listeler.
- **Canlı Arama Motoru:** Plak adı ve sanatçı bazında anlık çalışan (Real-time) arama desteği.
- **Vitrin & Arşiv Geçiş Mimarisi:** Vitrindeki öne çıkan plaklardan tek tıkla tam arşive geçiş sağlandı ve pürüzsüz sayfa kaydırma (`smooth scroll`) davranışları eklendi.

### 2. Ürün Detay & Etkileşim Yönetimi
- **Kondisyon Derecelendirme (Grading System):** İkinci el piyasası standartlarına uygun olarak plakların kondisyon durumları (*Jelatininde, Kusursuz, Çok İyi, İyi, Çalınabilir*) şeffaf bir şekilde veri setine dahil edildi.
- **İlişkisel Önerme Algoritması (Benzer Plaklar):** Detay sayfasında, kullanıcının incelediği ürünle aynı kategoride bulunan diğer plaklar; albüm kapakları, sanatçı ve fiyat bilgileriyle yatay kaydırılabilir (horizontal scroll) interaktif bir yapıda listelenir.
- **Stok & Fiyat Senkronizasyonu:** Gerçek zamanlı stok kontrolü yapılarak, backend üzerinden tükenen ürünler için sepet kısıtlaması getirildi.

### 3. Sepet, Kupon ve Ödeme Akışı
- **State Persistence (Kalıcı Sepet):** Sepet verileri React State ve Tarayıcı `localStorage` arasında senkronize edilerek sayfa yenilemelerinde veri kaybı önlendi. Miktar (Qty) artırma/azaltma ve ürün çıkarma işlemleri mutasyonsuz (immutable) state güncellemeleriyle yapıldı.
- **Dinamik Kupon ve Fiyatlandırma Motoru:** Admin tarafından veritabanında oluşturulan kuponların (Yüzdelik oran `%` veya Sabit tutar `₺`) sepette anlık doğrulanmasını sağlayan API servisi yazıldı. İndirim tutarı ve kargo ücreti, genel toplama dinamik olarak yansıtılır.
- **Sipariş Tamamlama (Checkout):** Kullanıcının sistemde kayıtlı çoklu adresleri arasından seçim yapabilmesi veya anında yeni adres oluşturarak siparişi tamamlaması sağlandı.

### 4. Plak Takas & Satış Ekosistemi (Trade-In) *[Core Feature]*
Sistemin en can alıcı noktası olan Trade-In modülü, kullanıcının dükkanla doğrudan ticaret yapmasına olanak tanır.
- **Güvenli Teklif Oluşturma:** Kullanıcı; plağın adı, sanatçısı, kondisyonu, görsel URL'si, ek açıklaması (baskı yılı, kusurlar) ve talep ettiği nakit tutar ile teklif formu oluşturur. "Nakit Satış" veya "Plak Takası" işlem tipleri mevcuttur.
- **Yetkilendirme Kontrolü:** Form, JWT tabanlı kimlik doğrulama duvarı (Auth Guard) arkasındadır. Giriş yapmamış kullanıcılar yakalanarak login'e yönlendirilir.

### 5. Kullanıcı ve Hesap Yönetimi
- **Kapsamlı Profil Paneli:** Kullanıcıya ait Sipariş Geçmişi, Adres Yönetimi, Hesap Ayarları, Bildirimler, Takas, Görüş ve Öneriler, Bize Ulaşın sekmeleri tek bir merkezde toplandı.
- **Canlı Teklif Takibi (Trade-In Dashboard):** Kullanıcının ilettiği tekliflerin State Machine tabanlı durum takibi (*⏳ İnceleniyor, ✓ Onaylandı, ✕ Reddedildi*), adminin belirlediği karşı teklif tutarı (TL) ve özel notu anlık olarak bu panelde render edilir.
- **Bildirim (Notification) Sistemi:** Admin, bir teklife veya siparişe yanıt verdiğinde; tetiklenen backend servisi kullanıcının sağ üst köşesindeki bildirim çanına (Notification Bell) okunmamış bir uyarı düşürür.


### 6. ⚙️ Admin Yönetim ve Kontrol Paneli
Tam yetkili kullanıcılar (Role: Admin) için geliştirilen arkaplan yönetim sistemi:
- **Ürün Yönetimi (CRUD):** Yeni plak ekleme, detay güncelleme ve silme operasyonları. (Ad, sanatçı, stok, fiyat, görsel linki, tür ve kondisyon parametreleri ile).
- **Teklif Masası (Trade-In Desk):** Gelen satış/takas taleplerini bir havuzda toplama. Talebi inceleme, plak kondisyonuna göre karşı fiyat (TL) teklifi belirleme, not ekleme ve Onay/Ret kararı verme işlemleri. Karar verildiği an kullanıcıya sistem bildirimi gönderilir.
- **Kupon ve İndirim Yönetimi:** Belirli kampanya dönemleri için aktiflik süresi ve limiti olan kupon kodları (Promo Codes) tanımlama.
- **Sipariş İzleme:** Sisteme düşen tüm kullanıcı siparişlerini aşamalarına göre görüntüleme ve yönetme.
- **Bildirim/Duyuru Gönderme:** Tüm kullanıcılara genel duyuru etiketi ile bildirim yollama.
- **Görüş&Öneri İnceleme:** Sisteme düşen kullanıcı görüş, istek ve önerilerini görüntüleyebilme.

---

## 🛠️ Teknoloji Yığını ve Altyapı (Tech Stack)

### Frontend (Client-Side)
- **Kütüphane:** React.js (Component-Based Mimaride)
- **State Yönetimi:** React Hooks (`useState`, `useEffect`, `useContext`) ve Context API
- **Routing:** React Router DOM (v6)
- **Stilizasyon:** Custom CSS (Neo-Brutalism Design System), inline stiller ve class yapıları
- **HTTP İstemci:** Axios (Interceptor destekli base API yapılandırması)
- **İkonografi:** Lucide React

### Backend (Server-Side)
- **Çalışma Zamanı:** Node.js
- **Web Framework:** Express.js (RESTful API Design)
- **Kimlik Doğrulama:** JWT (JSON Web Tokens) `Bearer Strategy`
- **Şifreleme:** `bcryptjs` (Tek yönlü Password Hashing)
- **Middleware:** `cors`, `express.json()`, custom Auth/Admin validatorleri

### Veritabanı (Veri Katmanı)
- **DBMS:** MongoDB (NoSQL)
- **ODM:** Mongoose (Şema tabanlı veri modelleme, validasyon ve ilişkilendirme)

---

## 🗄️ Veritabanı Tasarımı ve Modeller (Schema Relationships)

Sistem birbiriyle ilişkili 6 temel koleksiyon üzerinden asenkron olarak çalışır:
1. `User`: Kullanıcı kimlik bilgileri, adresleri ve rolü (User/Admin).
2. `Product`: Plaklara ait katalog verileri, stok, kondisyon ve kategori bilgileri.
3. `Order`: Sepet içeriği, uygulanan kupon, toplam tutar, kargo bedeli ve teslimat adresi eşleşmeleri. *(User ile 1:N ilişki)*
4. `TradeOffer`: Kullanıcıdan gelen takas/satış teklifleri, istenen tutar, admin karşı teklifi ve işlem durumu (State). *(User ile 1:N ilişki)*
5. `Coupon`: İndirim kodları, kullanım limitleri ve geçerlilik tarihleri.
6. `Notification`: Kullanıcı aksiyonlarına (sipariş onay, teklif yanıtı) bağlı oluşturulan anlık bildirim kayıtları.

---

## 🔒 Güvenlik ve Performans Optimizasyonları
- **Authentication Guard:** API uç noktalarında (özellikle teklif oluşturma, sipariş verme ve admin route'larında) JWT Token doğrulaması yapılmadan veri dönülmez (401 Unauthorized / 403 Forbidden).
- **Mobile-First & Cross-Device Uyumluluğu:** Dokunmatik ekranlarda buton ve kart etkileşimlerinin (hover/active state) optimize edilmesi, yatay kaydırma (horizontal scroll) alanlarının mobil cihazlarda akıcı kaydırma (touch-friendly) deneyimi sunması.
  - **Şifre Güvenliği:** Veritabanında hiçbir şifre plain-text tutulmaz, `bcrypt` ile tuzlanarak (salt & hash) saklanır.
- **Optimized Re-rendering:** React tarafında gereksiz render'ları önlemek için form state'lerinde kontrollü bileşen (controlled components) mantığı ve güvenli optional chaining (`?.`) veri çekme yöntemleri kullanılmıştır.
- **Graceful Error Handling:** İsteklerin 404 veya 500 dönmesi durumunda uygulamanın çökmesi (crash) engellenmiş, Try-Catch bloklarıyla kullanıcı dostu UI mesajlarına dönüştürülmüştür.

---

## 📂 Dizin Yapısı (Directory Structure)

```text
vinvin/
├── backend/
│   ├── config/             # MongoDB veritabanı bağlantı konfigürasyonu
│   ├── controllers/        # Route logic ve Business Logic ayrımı
│   ├── models/             # Mongoose DB Şemaları (Product, TradeOffer, User...)
│   ├── routes/             # Express API uç noktaları (/api/trade, /api/users, vb.)
│   ├── middleware/         # Token çözümleme ve Admin yetki kontrol mekanizmaları
│   └── server.js           # Uygulama giriş noktası ve middleware enjeksiyonları
│
└── frontend/
    ├── src/
    │   ├── components/           # Reusable UI (Navbar, Footer, PlakCard, Notification, BrutalButton)
    │   ├── pages/                # Sayfa Görünümleri (Vitrin, Account, Admin, Campaign...)
    │   ├── services/             # Axios API instance yapılandırması
    │   ├── App.css ve index.css  # Global Neo-brutalist tema ayarları
    │   └── App.jsx               # Global State, Context Provider'lar ve Routing şeması


```
## Proje Geliştirme Ortamı Kurulumu (Local Setup)
Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla uygulayın.

1. Repoyu Klonlayın
Bash
git clone [https://github.com/kullaniciadi/vinvin-vintage-vinyls.git](https://github.com/kullaniciadi/vinvin-vintage-vinyls.git)
cd vinvin
2. Backend Konfigürasyonu
Bash
cd backend
npm install
backend kök dizininde bir .env dosyası oluşturun ve aşağıdaki environment (ortam) değişkenlerini tanımlayın:

Kod snippet'i
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vinvin
JWT_SECRET=super_secret_jwt_key_2026
Sunucuyu geliştirme modunda başlatın:

Bash
npm run dev

3. Frontend Konfigürasyonu
Yeni bir terminal sekmesi açarak frontend dizinine geçin:

Bash
cd frontend
npm install
npm run dev
Uygulama başarıyla derlendiğinde tarayıcınızda http://localhost:5173 veya http://localhost:3000 adresine giderek platformu deneyimleyebilirsiniz.

---
## 👩‍💻 Geliştirici
F. Nilay Süzer, Bilişim sistemleri mühendisliği öğrencisi | Full-Stack Web Developer

Müzik tutkusu ve temiz kod yazma disipliniyle tasarlandı ve geliştirildi.

Bağlantı kurmak isterseniz:

🔗 LinkedIn: https://www.linkedin.com/in/nilay-suzer-b32387308/

💻 GitHub: @NilaySuzer

Proje, açık kaynaklı geliştirme pratikleri gözetilerek yazılmıştır. Kod incelemelerine (Code Review) ve yapıcı geri bildirimlere her zaman açıktır.
