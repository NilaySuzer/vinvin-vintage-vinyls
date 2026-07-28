import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom'
import Sidebar from './components/Sidebar'

// --- ÜRÜN DETAY SAYFASI (App'in DIŞINDA olmalı) ---
const ProductDetail = ({ plaklar, sepeteEkle, isLoggedIn }) => {
  const { id } = useParams();
  const plak = plaklar.find(p => p.id === parseInt(id));

  // 1. STATE'LER (Bunlar eksik olunca sayfa patlıyordu)
  const [yorumlar, setYorumlar] = useState([
    { isim: "Ahmet Yılmaz", yıldız: 5, metin: "Harika bir baskı! Ses kalitesi çok net." },
    { isim: "Zeynep K.", yıldız: 4, metin: "Kargo hızlıydı, plak çok temiz geldi." }
  ]);
  const [yeniYorum, setYeniYorum] = useState("");
  const [yeniIsim, setYeniIsim] = useState("");
  const [yeniYıldız, setYeniYıldız] = useState(5);

  const yorumGonder = () => {
    if (yeniYorum && yeniIsim) {
      setYorumlar([{ isim: yeniIsim, yıldız: yeniYıldız, metin: yeniYorum }, ...yorumlar]);
      setYeniYorum("");
      setYeniIsim("");
      setYeniYıldız(5);
    }
  };

  if (!plak) return <div style={{ padding: '100px', textAlign: 'center' }}>Ürün bulunamadı! 💿</div>;

  return (
    <div style={{ padding: '20px' }}>
      {/* A) EN ÜST: ÜRÜN BİLGİLERİ */}
      <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px', border: '5px solid #1a1a1a', boxShadow: '15px 15px 0px #ff9e00', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', aspectRatio: '1/1' }}>
            💿
        </div>
        
       <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ fontSize: '3rem', margin: 0 }}>{plak.ad}</h2>
          <p style={{ fontSize: '1.5rem', color: '#666', margin: '5px 0 15px 0' }}>{plak.sanatci}</p>
          
          <div style={{ padding: '15px', backgroundColor: '#e2f0cb', border: '3px solid #1a1a1a', display: 'inline-block', fontWeight: 'bold', fontSize: '1.5rem' }}>
            {plak.fiyat} TL
          </div>

          {/* 🌟 YENİ EKLENEN PLAK DETAY KUTUSU (Fiyat ile Buton Arası) */}
          <div style={{ margin: '25px 0', padding: '20px', border: '3px solid #1a1a1a', backgroundColor: '#white', boxShadow: '5px 5px 0px #1a1a1a' }}>
            <h4 style={{ margin: '0 0 10px 0', textTransform: 'uppercase', borderBottom: '2px dashed #1a1a1a', paddingBottom: '5px' }}>PLAK ÖZELLİKLERİ 💿</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', fontSize: '0.95rem', fontWeight: 'bold' }}>
              <li>Kategori: <span style={{ backgroundColor: '#ff9e00', padding: '2px 6px' }}>{plak.kategori}</span></li>
              <li>Kondisyon: <span style={{ color: '#2b9348' }}>Pırıl Pırıl (NM / 9/10)</span></li>
              <li>Devir: 33 RPM (12" LP)</li>
              <li>Baskı Yılı: Orijinal Retro Baskı</li>
              <li>Kargo: Aynı Gün Korunaklı Kutuda Kargo 📦</li>
            </ul>
          </div>

          <button onClick={() => sepeteEkle(plak)} style={{ display: 'block', width: '100%', padding: '20px', backgroundColor: '#1a1a1a', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '5px 5px 0px #ff9e00' }}>
            SEPETE EKLE +
          </button>
        </div>
      </div>
      
      {/* B) ORTA: BENZER ÜRÜNLER ALANI */}
      <div style={{ marginTop: '60px', borderTop: '4px solid #1a1a1a', paddingTop: '30px' }}>
         <h3>AYNI KATEGORİDEN DİĞER PLAKLAR</h3>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 0' }}>
            {plaklar.filter(p => p.kategori === plak.kategori && p.id !== plak.id).map(p => (
              <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', minWidth: '180px', border: '3px solid #1a1a1a', padding: '15px', backgroundColor: 'white', boxShadow: '5px 5px 0px #1a1a1a' }}>
                <div style={{ textAlign: 'center', fontSize: '2rem' }}>💿</div>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{p.ad}</div>
                <div style={{ fontSize: '0.8rem' }}>{p.fiyat} TL</div>
              </Link>
            ))}
          </div>
      </div>

      {/* C) EN ALT: YORUMLAR (BENZER ÜRÜNLERDEN SONRA GELİYOR) */}
      <div style={{ marginTop: '60px', borderTop: '4px solid #1a1a1a', paddingTop: '30px' }}>
        <h3 style={{ textTransform: 'uppercase' }}>Kullanıcı Değerlendirmeleri 💬</h3>

        {/* YORUM FORMU (GİRİŞ ŞARTLI) */}
        <div style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: '#f9f9f9', marginBottom: '30px', boxShadow: '5px 5px 0px #1a1a1a' }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input value={yeniIsim} onChange={(e) => setYeniIsim(e.target.value)} placeholder="Adınız Soyadınız" style={{ flex: 2, padding: '10px', border: '2px solid #1a1a1a' }} />
                <select value={yeniYıldız} onChange={(e) => setYeniYıldız(parseInt(e.target.value))} style={{ flex: 1, padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }}>
                  <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5)</option>
                  <option value="3">⭐⭐⭐ (3/5)</option>
                  <option value="2">⭐⭐ (2/5)</option>
                  <option value="1">⭐ (1/5)</option>
                </select>
              </div>
              <textarea value={yeniYorum} onChange={(e) => setYeniYorum(e.target.value)} placeholder="Yorumunuzu buraya yazın..." style={{ padding: '10px', border: '2px solid #1a1a1a', minHeight: '80px' }} />
              <button onClick={yorumGonder} style={{ backgroundColor: '#ff9e00', border: '2px solid #1a1a1a', padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}>YORUMU GÖNDER</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>🔒 Yorum yapabilmek ve puan verebilmek için giriş yapmalısınız.</p>
              <Link to="/login"><button style={{ backgroundColor: '#ff9e00', border: '2px solid #1a1a1a', padding: '8px 15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>GİRİŞ YAP</button></Link>
            </div>
          )}
        </div>

        {/* MEVCUT YORUM KARTLARI (İSİM, YILDIZ VE METİN) */}
        <div style={{ display: 'grid', gap: '15px' }}>
          {yorumlar.map((y, i) => (
            <div key={i} style={{ border: '3px solid #1a1a1a', padding: '15px', backgroundColor: 'white', boxShadow: '4px 4px 0px #1a1a1a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>👤 {y.isim}</span>
                <span style={{ color: '#ff9e00' }}>{"⭐".repeat(y.yıldız)}</span>
              </div>
              <p style={{ margin: 0 }}>{y.metin}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- BİLEŞENLER ---
const CheckoutPage = ({ total }) => (
  <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '30px', boxShadow: '10px 10px 0px #1a1a1a', maxWidth: '500px', margin: '0 auto' }}>
    <h2 style={{ textTransform: 'uppercase', borderBottom: '3px solid #ff9e00', paddingBottom: '10px' }}>Ödeme Bilgileri</h2>
    <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
      <label>AD SOYAD</label>
      <input type="text" style={{ padding: '10px', border: '2px solid #1a1a1a' }} placeholder="Ahmet Yılmaz" />
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e2f0cb', border: '2px dashed #1a1a1a', textAlign: 'center' }}>
        <h3 style={{ margin: 0 }}>TOPLAM: {total} TL</h3>
      </div>
      <button type="button" onClick={() => alert('Siparişiniz alındı! 💿')} style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '15px', fontWeight: 'bold', cursor: 'pointer' }}>ÖDEMEYİ TAMAMLA</button>
      <Link to="/cart" style={{ marginTop: '10px', textAlign: 'center', color: '#1a1a1a', display: 'block' }}>← Sepete Geri Dön</Link>
    </form>
  </div>
)

// --- 💿 ANA İÇERİK BİLEŞENİ (Burada location çalışır) ---
const AppContent = ({ 
  cart, setActiveCategory, activeCategory, isSidebarOpen, setIsSidebarOpen, isNavOpen, setIsNavOpen,
  kampanyalar, currentSlide, setSelectedKampanya, selectedPlak, setSelectedPlak, filtrelenmisPlaklar,
  sepeteEkle, sepetiBosalt, adetGuncelle, urunCikar, toplamTutar, selectedKampanya, plaklar
}) => {
  
  const location = useLocation(); // ✅ Beyaz ekran hatasını bu satır ve bu yapı çözer.

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* NAVBAR */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px', border: '4px solid #1a1a1a', backgroundColor: '#ff9e00', 
        boxShadow: '8px 8px 0px #1a1a1a', marginBottom: '40px', position: 'relative' 
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#1a1a1a' }}>
          <h1 style={{ margin: 0, fontSize: window.innerWidth < 768 ? '1.2rem' : '2rem' }}>VINtage VINyls 💿</h1>
        </Link>

        {window.innerWidth < 768 && (
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)}
            style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isNavOpen ? 'KAPAT' : 'MENÜ [≡]'}
          </button>
        )}

        <div style={{ 
          display: (window.innerWidth >= 768 || isNavOpen) ? 'flex' : 'none',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          alignItems: 'center', justifyContent: 'center',
          position: window.innerWidth < 768 ? 'absolute' : 'static',
          top: '100%', left: 0, width: window.innerWidth < 768 ? '100%' : 'auto',
          backgroundColor: window.innerWidth < 768 ? '#ff9e00' : 'transparent',
          border: window.innerWidth < 768 ? '4px solid #1a1a1a' : 'none',
          padding: window.innerWidth < 768 ? '20px' : '0',
          gap: '20px', zIndex: 3000,
          boxShadow: window.innerWidth < 768 ? '8px 8px 0px #1a1a1a' : 'none'
        }}>
          <Link to="/" onClick={() => setIsNavOpen(false)} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>VİTRİN</Link>
          {/* Navbar içinde, logonun hemen yanına veya uygun bir yere */}
{location.pathname.includes('/product/') && (
  <div style={{ position: 'relative', display: 'inline-block' }}>
    <button 
      onMouseOver={() => setIsNavOpen(true)} 
      style={{ backgroundColor: 'white', border: '2px solid #1a1a1a', padding: '5px 15px', fontWeight: 'bold', cursor: 'pointer' }}
    >
      KATEGORİLER ▼
    </button>
    {isNavOpen && (
      <div 
        onMouseLeave={() => setIsNavOpen(false)}
        style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', border: '3px solid #1a1a1a', zIndex: 5000, minWidth: '150px', boxShadow: '5px 5px 0px #1a1a1a' }}
      >
        {["Rock", "Jazz", "Pop", "Hepsi"].map(cat => (
          <Link 
            key={cat} 
            to="/" 
            onClick={() => {setActiveCategory(cat); setIsNavOpen(false);}} 
            style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold', borderBottom: '1px solid #eee' }}
          >
            {cat}
          </Link>
        ))}
      </div>
    )}
  </div>
)}
          <Link to="/campaigns" onClick={() => setIsNavOpen(false)} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>KAMPANYALAR</Link>
          <Link to="/about" onClick={() => setIsNavOpen(false)} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>HAKKIMIZDA</Link>
          <Link to="/login" onClick={() => setIsNavOpen(false)} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>GİRİŞ YAP</Link>
          <Link to="/register" onClick={() => setIsNavOpen(false)} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>KAYIT OL</Link>
          <Link to="/cart" onClick={() => setIsNavOpen(false)} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold', border: '2px solid #1a1a1a', padding: '2px 10px', backgroundColor: 'white' }}>
            🛒 SEPET ({cart.reduce((acc, curr) => acc + (curr.adet || 1), 0)})
          </Link>
        </div>
      </nav>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '20px' }}>
        {/* SİDEBAR KONTROLÜ - Sidebar'ın geç gelme sorununu anlık location.pathname takibi çözer */}
        {!location.pathname.startsWith('/product') && !["/login", "/register", "/checkout", "/campaigns", "/about"].includes(location.pathname) && (
          <div style={{ flexBasis: '250px' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ 
                display: window.innerWidth < 768 ? 'block' : 'none',
                width: '100%', padding: '15px', backgroundColor: '#1a1a1a', color: 'white',
                border: 'none', fontWeight: 'black', cursor: 'pointer', marginBottom: '10px', textTransform: 'uppercase'
              }}
            >
              {isSidebarOpen ? 'KATEGORİLERİ KAPAT [X]' : 'KATEGORİLERİ GÖR [≡]'}
            </button>
            {(window.innerWidth >= 768 || isSidebarOpen) && (
              <Sidebar 
                onSelectCategory={(cat) => { setActiveCategory(cat); setIsSidebarOpen(false); }} 
                activeCategory={activeCategory} 
              />
            )}
          </div>
        )}

        <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Routes>
            <Route path="/" element={
              <div>
                <div onClick={() => setSelectedKampanya(kampanyalar[currentSlide])} style={{ backgroundColor: kampanyalar[currentSlide].renk, padding: '15px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', marginBottom: '30px', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>⚡ {kampanyalar[currentSlide].baslik} ⚡</div>
                  <div style={{ fontSize: '0.8rem' }}>Detaylar için tıkla!</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                  {filtrelenmisPlaklar.map(plak => (
                    <div key={plak.id} style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '20px', boxShadow: '8px 8px 0px #1a1a1a', display: 'flex', flexDirection: 'column' }}>
                     {/* 🔗 BURASI DEĞİŞTİ: Resim ve başlığı Link içine aldık */}
    <Link to={`/product/${plak.id}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
      <div 
        style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#eee', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', transition: 'transform 0.3s' }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        💿
      </div>
      <h3 style={{ margin: 0 }}>{plak.ad}</h3>
      <p style={{ color: '#666' }}>{plak.sanatci}</p>
    </Link>

    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontWeight: 'bold' }}>{plak.fiyat} TL</span>
      <button onClick={() => sepeteEkle(plak)} style={{ backgroundColor: '#ff9e00', border: '2px solid #1a1a1a', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>
        EKLE +
      </button>
    </div>
                    </div>
                  ))}
                </div>
              </div>
            } />

            {/* AppContent içindeki Routes kısmında bunu düzelt */}
<Route path="/product/:id" element={<ProductDetail plaklar={plaklar} sepeteEkle={sepeteEkle} />} />
            
            <Route path="/cart" element={
              <div style={{ padding: '20px', border: '4px solid #1a1a1a', backgroundColor: 'white', boxShadow: '10px 10px 0px #1a1a1a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #1a1a1a', paddingBottom: '10px' }}>
                  <h2>SEPETİNİZ ({cart.length})</h2>
                  {cart.length > 0 && <button onClick={sepetiBosalt} style={{ backgroundColor: '#ff4d4d', border: '2px solid #1a1a1a', color: 'white', padding: '5px 10px', cursor: 'pointer' }}>BOŞALT 🗑️</button>}
                </div>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Sepetiniz şu an bomboş... 💿</p>
                    <Link to="/"><button style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '15px 30px', fontWeight: 'bold', cursor: 'pointer' }}>ALIŞVERİŞE BAŞLA</button></Link>
                  </div>
                ) : (
                  <>
                    {cart.map((item, index) => (
                      <div key={item.id} style={{ borderBottom: '2px solid #1a1a1a', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 'bold' }}>{item.ad}</span>
                          <p style={{ margin: 0, fontSize: '0.8rem' }}>{item.fiyat} TL x {item.adet || 1}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button onClick={() => adetGuncelle(item.id, -1)} style={{ width: '30px', height: '30px', border: '2px solid #1a1a1a', cursor: 'pointer', backgroundColor: '#e2f0cb' }}>-</button>
                          <span style={{ fontWeight: 'bold' }}>{item.adet || 1}</span>
                          <button onClick={() => adetGuncelle(item.id, 1)} style={{ width: '30px', height: '30px', border: '2px solid #1a1a1a', cursor: 'pointer', backgroundColor: '#ff9e00' }}>+</button>
                        </div>
                        <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
                          {item.fiyat * (item.adet || 1)} TL
                          <button onClick={() => urunCikar(index)} style={{ marginLeft: '15px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>X</button>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '3px solid #1a1a1a', paddingTop: '20px' }}>
                      <h3>TOPLAM TUTAR: {toplamTutar} TL</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <Link to="/" style={{ color: '#1a1a1a', fontWeight: 'bold' }}>← ALIŞVERİŞE DÖN</Link>
                        <Link to="/checkout"><button style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '10px 25px', fontWeight: 'bold', cursor: 'pointer' }}>ÖDEMEYE GEÇ →</button></Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            } />
            <Route path="/checkout" element={<CheckoutPage total={toplamTutar} />} />
            <Route path="/campaigns" element={
              <div style={{ padding: '20px', border: '4px solid #1a1a1a', backgroundColor: 'white', boxShadow: '10px 10px 0px #1a1a1a' }}>
                <h2 style={{ borderBottom: '4px solid #1a1a1a', paddingBottom: '10px', textTransform: 'uppercase' }}>Kampanya Arşivi ⚡</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                  {kampanyalar.map(kamp => (
                    <div key={kamp.id} style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: kamp.renk, boxShadow: '5px 5px 0px #1a1a1a' }}>
                      <h3 style={{ margin: '0 0 10px 0' }}>{kamp.baslik}</h3>
                      <p>{kamp.detay}</p>
                      <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.5)', display: 'inline-block', padding: '2px 8px' }}>GEÇERLİLİK: {kamp.tarih}</div>
                    </div>
                  ))}
                </div>
                <Link to="/" style={{ display: 'block', marginTop: '30px', fontWeight: 'bold', color: '#1a1a1a' }}>← ANA SAYFAYA DÖN</Link>
              </div>
            } />
            <Route path="/login" element={
              <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '40px', boxShadow: '12px 12px 0px #ff9e00', maxWidth: '400px', margin: '40px auto' }}>
                <h2 style={{ textTransform: 'uppercase', marginBottom: '30px', borderBottom: '4px solid #1a1a1a', paddingBottom: '10px' }}>Giriş Yap</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <label style={{ fontWeight: 'bold' }}>E-POSTA</label>
                  <input type="email" placeholder="ornek@mail.com" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  <label style={{ fontWeight: 'bold' }}>ŞİFRE</label>
                  <input type="password" placeholder="******" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  <button type="submit" style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>DÜKKANA GİRİŞ YAP</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>Hesabın yok mu? <Link to="/register" style={{ color: '#ff9e00', fontWeight: 'bold' }}>Kayıt Ol</Link></p>
                <div style={{ marginTop: '20px', borderTop: '2px dashed #1a1a1a', paddingTop: '20px' }}>
                  <Link to="/" style={{ textDecoration: 'none' }}>
                    <button type="button" style={{ width: '100%', backgroundColor: '#ff9e00', color: '#1a1a1a', padding: '12px', fontWeight: 'black', border: '3px solid #1a1a1a', cursor: 'pointer', boxShadow: '4px 4px 0px #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px #1a1a1a'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translate(0px, 0px)'; e.currentTarget.style.boxShadow = '4px 4px 0px #1a1a1a'; }}>💿 ÜRÜNLERE GERİ DÖN</button>
                  </Link>
                </div>
              </div>
            } />
            <Route path="/about" element={
              <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '40px', boxShadow: '12px 12px 0px #e2f0cb' }}>
                <h2 style={{ fontSize: '2.5rem', borderBottom: '5px solid #1a1a1a', paddingBottom: '15px', marginBottom: '30px' }}>BİZ KİMİZ? 💿</h2>
                <div style={{ lineHeight: '1.8', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <p><span style={{ backgroundColor: '#ff9e00', padding: '0 5px' }}> VinVin Vintage Vinyls</span>, dijital dünyanın gürültüsünden kaçıp analogun sıcaklığına sığınanlar için 2026 yılında kuruldu.</p>
                  <p style={{ marginTop: '20px' }}>Kocaeli Üniversitesi Yazılım Mühendisliği çatısı altında bir tutku projesi olarak başlayan bu dükkan, sadece plak satmakla kalmıyor; aynı zamanda bir kültürü yaşatmayı hedefliyor.</p>
                  <div style={{ marginTop: '40px', padding: '20px', border: '3px dashed #1a1a1a', backgroundColor: '#f0f0f0' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1.7rem' }}>MİSYONUMUZ</h4>
                    <p>En nadir baskıları, en temiz kondisyonda koleksiyonerlerle buluşturmak ve iğnenin plağa değdiği o ilk saniyedeki büyüyü herkese hatırlatmak.</p>
                  </div>
                  <div style={{ marginTop: '40px', padding: '20px', border: '3px dashed #1a1a1a', backgroundColor: '#f0f0f0' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1.7rem' }}>VİZYONUMUZ</h4>
                    <p>Dijitalin gürültüsünde kaybolan ruhu, analogun derinliğinde yeniden buluşturmak.</p>
                  </div>
                </div>
                <Link to="/" style={{ display: 'inline-block', marginTop: '40px', textDecoration: 'none' }}><button style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '15px 30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>PLAKLARA GERİ DÖN</button></Link>
              </div>
            } />
            
            <Route path="/register" element={
              <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '40px', boxShadow: '12px 12px 0px #ff9e00', maxWidth: '400px', margin: '40px auto' }}>
                <h2 style={{ textTransform: 'uppercase', marginBottom: '30px', borderBottom: '4px solid #1a1a1a', paddingBottom: '10px' }}>Kayıt Ol</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <label style={{ fontWeight: 'bold' }}>AD SOYAD</label>
                  <input type="text" placeholder="Ahmet Yılmaz" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  <label style={{ fontWeight: 'bold' }}>E-POSTA</label>
                  <input type="email" placeholder="ornek@mail.com" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  <label style={{ fontWeight: 'bold' }}>ŞİFRE</label>
                  <input type="password" placeholder="******" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  <button type="submit" style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '15px', fontWeight: 'bold', border: '3px solid #1a1a1a', cursor: 'pointer', marginTop: '10px' }}>ÜYELİĞİ TAMAMLA</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>Zaten üye misin? <Link to="/login" style={{ color: '#ff9e00', fontWeight: 'bold' }}>Giriş Yap</Link></p>
                <div style={{ marginTop: '20px', borderTop: '2px dashed #1a1a1a', paddingTop: '20px' }}>
                  <Link to="/" style={{ textDecoration: 'none' }}><button type="button" style={{ width: '100%', backgroundColor: '#ff9e00', color: '#1a1a1a', padding: '12px', fontWeight: 'black', border: '3px solid #1a1a1a', cursor: 'pointer', boxShadow: '4px 4px 0px #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px #1a1a1a'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translate(0px, 0px)'; e.currentTarget.style.boxShadow = '4px 4px 0px #1a1a1a'; }}>💿 ÜRÜNLERE GERİ DÖN</button></Link>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>

      {/* MODALLAR */}
    

      {selectedKampanya && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: 'white', padding: '40px', border: '5px solid #1a1a1a', boxShadow: '15px 15px 0px ' + selectedKampanya.renk, maxWidth: '500px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setSelectedKampanya(null)} style={{ position: 'absolute', right: '15px', top: '15px', cursor: 'pointer', border: 'none', background: 'none', fontWeight: 'bold' }}>KAPAT [X]</button>
            <h2 style={{ fontSize: '2rem', backgroundColor: selectedKampanya.renk, padding: '10px', border: '3px solid #1a1a1a' }}>{selectedKampanya.baslik}</h2>
            <p style={{ margin: '20px 0' }}>{selectedKampanya.detay}</p>
            <Link to="/campaigns" onClick={() => setSelectedKampanya(null)}><button style={{ width: '100%', padding: '15px', backgroundColor: '#1a1a1a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'black', marginBottom: '10px' }}>TÜM KAMPANYALARI GÖR →</button></Link>
            <button onClick={() => setSelectedKampanya(null)} style={{ padding: '10px 20px', backgroundColor: '#1a1a1a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>ALIŞVERİŞE DEVAM ET</button>
          </div>
        </div>
      )}

      <footer style={{ marginTop: '60px', padding: '40px 20px', borderTop: '5px solid #1a1a1a', backgroundColor: '#1a1a1a', color: 'white', textAlign: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginBottom: '30px' }}>
          <div><h4 style={{ color: '#ff9e00' }}>VINtage VINyls</h4><p style={{ fontSize: '0.8rem' }}>Mühendislik projesi olarak tasarlanan retro plak dükkanı.</p></div>
          <div><h4 style={{ color: '#ff9e00' }}>İLETİŞİM</h4><p style={{ fontSize: '0.8rem' }}>Kocaeli Üniversitesi, Yazılım Mühendisliği</p><p style={{ fontSize: '0.8rem' }}>info@vintagevinyls.com</p></div>
          <div><h4 style={{ color: '#ff9e00' }}>SOSYAL MEDYA</h4><p style={{ fontSize: '0.8rem' }}>Instagram | Twitter | Spotify</p></div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: '20px', fontSize: '0.7rem' }}>© 2026 Vintage Vinyls - Tüm Hakları Plakların İçinde Saklıdır.</div>
      </footer>
    </div>
  );
}

// --- ⚙️ ANA APP BİLEŞENİ (Router burada başlar) ---
function App() {
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState("Hepsi")
  const [selectedPlak, setSelectedPlak] = useState(null)
  const [selectedKampanya, setSelectedKampanya] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const kampanyalar = [
    { id: 1, baslik: "Yaz Sonu İndirimi", detay: "Tüm Rock plaklarında %20 indirim!", renk: "#ff9e00", tarih: "15 Mart" },
    { id: 2, baslik: "Ücretsiz Kargo", detay: "500 TL ve üzeri kargo bedava!", renk: "#e2f0cb", tarih: "20 Mart" }
  ]

  const plaklar = [
    { id: 1, ad: "Carry on Wayward Son", sanatci: "Kansas", fiyat: 450, kategori: "Rock" },
    { id: 2, ad: "Bohemian Rhapsody", sanatci: "Queen", fiyat: 600, kategori: "Rock" },
    { id: 3, ad: "Take Five", sanatci: "Dave Brubeck", fiyat: 550, kategori: "Jazz" },
    { id: 4, ad: "So What", sanatci: "Miles Davis", fiyat: 700, kategori: "Jazz" }
  ]

  const sepeteEkle = (plak) => {
    const urunVarMi = cart.find(item => item.id === plak.id);
    if (urunVarMi) {
      setCart(cart.map(item => item.id === plak.id ? { ...item, adet: (item.adet || 1) + 1 } : item));
    } else {
      setCart([...cart, { ...plak, adet: 1 }]);
    }
  };

  const adetGuncelle = (id, miktar) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const yeniAdet = (item.adet || 1) + miktar;
        return yeniAdet > 0 ? { ...item, adet: yeniAdet } : item;
      }
      return item;
    }));
  };

  const urunCikar = (index) => setCart(cart.filter((_, i) => i !== index));
  const sepetiBosalt = () => setCart([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev === kampanyalar.length - 1 ? 0 : prev + 1)), 4000)
    return () => clearInterval(timer)
  }, [kampanyalar.length])

  const toplamTutar = cart.reduce((acc, curr) => acc + (curr.fiyat * (curr.adet || 1)), 0);
  const filtrelenmisPlaklar = activeCategory === "Hepsi" ? plaklar : plaklar.filter(p => p.kategori === activeCategory)

  return (
    <Router>
      <AppContent 
        cart={cart} activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        plaklar={plaklar}
        selectedPlak={selectedPlak} setSelectedPlak={setSelectedPlak}
        selectedKampanya={selectedKampanya} setSelectedKampanya={setSelectedKampanya}
        currentSlide={currentSlide} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
        isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} kampanyalar={kampanyalar}
        filtrelenmisPlaklar={filtrelenmisPlaklar} sepeteEkle={sepeteEkle}
        sepetiBosalt={sepetiBosalt} adetGuncelle={adetGuncelle} urunCikar={urunCikar}
        toplamTutar={toplamTutar}
      />
    </Router>
  )
}

export default App;