import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { Search, X, Disc, Star, ShoppingCart, ShoppingBag, Heart, CheckCircle, ShieldCheck, Truck, CreditCard, User, LogOut, Filter, ArrowUpDown } from 'lucide-react';
import API from './services/api';
import ProfilePage from './pages/ProfilePage';

// --- ÜRÜN DETAY SAYFASI ---
const ProductDetail = ({ plaklar, sepeteEkle, isLoggedIn, favorites, toggleFavorite }) => {
  const { id } = useParams();
  // MongoDB _id veya normal id kontrolü
  const plak = plaklar.find(p => (p._id || p.id) === id || (p.id && p.id === parseInt(id)));

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

  if (!plak) return <div style={{ padding: '100px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>Ürün bulunamadı veya yükleniyor... 💿</div>;

  const plakId = plak._id || plak.id;
  const isFav = favorites.some(fav => (fav._id || fav.id) === plakId);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px', border: '5px solid #1a1a1a', boxShadow: '15px 15px 0px #ff9e00', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', aspectRatio: '1/1', position: 'relative' }}>
            <Disc size={120} color="#1a1a1a" strokeWidth={2.5} />
            <button 
              onClick={() => toggleFavorite(plak)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', border: '3px solid #1a1a1a', borderRadius: '50%', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Heart size={24} fill={isFav ? "#ff4d4d" : "none"} color={isFav ? "#ff4d4d" : "#1a1a1a"} />
            </button>
        </div>
        
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ fontSize: '3rem', margin: 0, lineHeight: 1.1 }}>{plak.ad}</h2>
          <p style={{ fontSize: '1.5rem', color: '#666', margin: '5px 0 15px 0', fontWeight: 'bold' }}>{plak.sanatci}</p>
          
          <div style={{ padding: '15px 25px', backgroundColor: '#e2f0cb', border: '3px solid #1a1a1a', display: 'inline-block', fontWeight: 'black', fontSize: '1.8rem', boxShadow: '4px 4px 0px #1a1a1a' }}>
            {plak.fiyat} TL
          </div>

          <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ backgroundColor: (plak.stok ?? 5) > 0 ? '#d4edda' : '#f8d7da', color: (plak.stok ?? 5) > 0 ? '#155724' : '#721c24', padding: '5px 10px', border: '2px solid #1a1a1a', fontWeight: 'bold', fontSize: '0.85rem' }}>
              {(plak.stok ?? 5) > 0 ? `STOKTA VAR (${plak.stok ?? 5} Adet)` : 'STOK TÜKENDİ'}
            </span>
            <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '5px 10px', border: '2px solid #1a1a1a', fontWeight: 'bold', fontSize: '0.85rem' }}>
              ORİJİNAL BASKI
            </span>
          </div>

          <div style={{ margin: '25px 0', padding: '20px', border: '3px solid #1a1a1a', backgroundColor: 'white', boxShadow: '5px 5px 0px #1a1a1a' }}>
            <h3 style={{ margin: '0 0 10px 0', textTransform: 'uppercase', borderBottom: '2px dashed #1a1a1a', paddingBottom: '5px' }}>PLAK ÖZELLİKLERİ</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', fontSize: '0.95rem', fontWeight: 'bold' }}>
              <li>Kategori: <span style={{ backgroundColor: '#ff9e00', padding: '2px 6px' }}>{plak.kategori}</span></li>
              <li>Kondisyon: <span style={{ color: '#2b9348' }}>Pırıl Pırıl (NM / 9/10)</span></li>
              <li>Devir: 33 RPM (12" LP)</li>
              <li>Baskı Yılı: Orijinal Retro Baskı</li>
              <li>Kargo: Aynı Gün Korunaklı Kutuda Kargo 📦</li>
            </ul>
          </div>

          <button onClick={() => sepeteEkle(plak)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '20px', backgroundColor: '#1a1a1a', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '5px 5px 0px #ff9e00' }}>
            <ShoppingCart size={22} color="white" /> SEPETE EKLE +
          </button>
        </div>
      </div>
      
      {/* BENZER ÜRÜNLER */}
      <div style={{ marginTop: '60px', borderTop: '4px solid #1a1a1a', paddingTop: '30px' }}>
         <h3 style={{ textTransform: 'uppercase' }}>AYNI KATEGORİDEN DİĞER PLAKLAR</h3>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 0' }}>
            {plaklar.filter(p => p.kategori === plak.kategori && (p._id || p.id) !== plakId).map(p => {
              const pId = p._id || p.id;
              return (
                <Link key={pId} to={`/product/${pId}`} style={{ textDecoration: 'none', color: 'inherit', minWidth: '200px', border: '3px solid #1a1a1a', padding: '15px', backgroundColor: 'white', boxShadow: '5px 5px 0px #1a1a1a' }}>
                  <div style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '10px' }}><Disc size={60} color="#1a1a1a" strokeWidth={2.5} /></div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{p.ad}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{p.sanatci}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '8px', color: '#1a1a1a' }}>{p.fiyat} TL</div>
                </Link>
              );
            })}
          </div>
      </div>

      {/* YORUMLAR */}
      <div style={{ marginTop: '60px', borderTop: '4px solid #1a1a1a', paddingTop: '30px' }}>
        <h3 style={{ textTransform: 'uppercase' }}>Kullanıcı Değerlendirmeleri 💬</h3>
        <div style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: '#f9f9f9', marginBottom: '30px', boxShadow: '5px 5px 0px #1a1a1a' }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <input value={yeniIsim} onChange={(e) => setYeniIsim(e.target.value)} placeholder="Adınız Soyadınız" style={{ flex: 2, padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />
                <select value={yeniYıldız} onChange={(e) => setYeniYıldız(parseInt(e.target.value))} style={{ flex: 1, padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', backgroundColor: 'white', cursor: 'pointer' }}>
                  <option value="5">★ 5 / 5 - Mükemmel</option>
                  <option value="4">★ 4 / 5 - Çok İyi</option>
                  <option value="3">★ 3 / 5 - Ortalama</option>
                  <option value="2">★ 2 / 5 - Zayıf</option>
                  <option value="1">★ 1 / 5 - Çok Kötü</option>
                </select>
              </div>
              <textarea value={yeniYorum} onChange={(e) => setYeniYorum(e.target.value)} placeholder="Yorumunuzu buraya yazın..." style={{ padding: '10px', border: '2px solid #1a1a1a', minHeight: '80px', fontFamily: 'inherit' }} />
              <button onClick={yorumGonder} style={{ backgroundColor: '#ff9e00', border: '2px solid #1a1a1a', padding: '12px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>YORUMU GÖNDER</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>🔒 Yorum yapabilmek ve puan verebilmek için giriş yapmalısınız.</p>
              <Link to="/login"><button style={{ backgroundColor: '#ff9e00', border: '2px solid #1a1a1a', padding: '8px 15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>GİRİŞ YAP</button></Link>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: '15px' }}>
          {yorumlar.map((y, i) => (
            <div key={i} style={{ border: '3px solid #1a1a1a', padding: '15px', backgroundColor: 'white', boxShadow: '4px 4px 0px #1a1a1a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>👤 {y.isim}</span>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  {[...Array(y.yıldız)].map((_, index) => (
                    <Star key={index} size={18} fill="#ff9e00" color="#ff9e00" />
                  ))}
                </div>
              </div>
              <p style={{ margin: 0 }}>{y.metin}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- CHECKOUT SAYFASI ---
const CheckoutPage = ({ total, sepetiBosalt, cart, indirimTutari, odenecekTutar }) => {
  const navigate = useNavigate();
  const [odemeYontemi, setOdemeYontemi] = useState('kart');
  const [siparisTamamlandi, setSiparisTamamlandi] = useState(false);
  const [siparisNo, setSiparisNo] = useState('');
  const [formData, setFormData] = useState({ adSoyad: '', telefon: '', adres: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/orders', {
        siparisKalemleri: (cart || []).map(item => ({
          ad: item.ad,
          fiyat: item.fiyat,
          adet: item.adet || 1,
          product: item._id || item.id
        })),
        teslimatBilgileri: formData,
        odemeYontemi,
        toplamTutar: total,
        indirimTutari: indirimTutari || 0,
        odenecekTutar: odenecekTutar || total
      });

      setSiparisNo(data._id);
      setSiparisTamamlandi(true);
      sepetiBosalt();
    } catch (error) {
      console.error("Sipariş hatası:", error);
      alert("❌ Sipariş oluşturulurken bir hata meydana geldi!");
    }
  };

  if (siparisTamamlandi) {
    return (
      <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '40px', boxShadow: '12px 12px 0px #e2f0cb', maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
        <CheckCircle size={80} color="#2b9348" style={{ marginBottom: '20px' }} />
        <h2 style={{ textTransform: 'uppercase', margin: '0 0 10px 0' }}>SİPARİŞİNİZ ALINDI!</h2>
        <p style={{ fontWeight: 'bold', color: '#555' }}>Sipariş numaranız: <strong>#{siparisNo || `VV-${Math.floor(100000 + Math.random() * 900000)}`}</strong></p>
        <p style={{ margin: '20px 0', fontSize: '0.95rem' }}>Plaklarınız özenle paketlenip korunaklı kutusunda en kısa sürede kargoya verilecektir. 📦</p>
        <button onClick={() => navigate('/')} style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '15px 30px', fontWeight: 'black', cursor: 'pointer', width: '100%' }}>
          ALIŞVERİŞE DEVAM ET 💿
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '30px', boxShadow: '10px 10px 0px #1a1a1a', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textTransform: 'uppercase', borderBottom: '3px solid #ff9e00', paddingBottom: '10px', marginTop: 0 }}>Ödeme ve Teslimat Bilgileri</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>AD SOYAD</label>
            <input required type="text" name="adSoyad" value={formData.adSoyad} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', marginTop: '5px', boxSizing: 'border-box' }} placeholder="Ahmet Yılmaz" />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>TELEFON</label>
            <input required type="tel" name="telefon" value={formData.telefon} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', marginTop: '5px', boxSizing: 'border-box' }} placeholder="0555 111 22 33" />
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>TESLİMAT ADRESİ</label>
          <textarea required rows={3} name="adres" value={formData.adres} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', marginTop: '5px', boxSizing: 'border-box', fontFamily: 'inherit' }} placeholder="Mahalle, Sokak, No, İlçe / İl" />
        </div>

        <div style={{ borderTop: '2px dashed #1a1a1a', paddingTop: '15px', marginTop: '10px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>ÖDEME YÖNTEMİ</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setOdemeYontemi('kart')} style={{ flex: 1, padding: '10px', border: '2px solid #1a1a1a', backgroundColor: odemeYontemi === 'kart' ? '#ff9e00' : 'white', fontWeight: 'bold', cursor: 'pointer' }}>Kredi Kartı</button>
            <button type="button" onClick={() => setOdemeYontemi('havale')} style={{ flex: 1, padding: '10px', border: '2px solid #1a1a1a', backgroundColor: odemeYontemi === 'havale' ? '#ff9e00' : 'white', fontWeight: 'bold', cursor: 'pointer' }}>Havale / EFT</button>
          </div>
        </div>

        {odemeYontemi === 'kart' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f9f9f9', padding: '15px', border: '2px solid #1a1a1a' }}>
            <input required type="text" placeholder="Kart Üzerindeki İsim" style={{ padding: '8px', border: '2px solid #1a1a1a' }} />
            <input required type="text" placeholder="Kart Numarası (16 Hane)" maxLength={16} style={{ padding: '8px', border: '2px solid #1a1a1a' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input required type="text" placeholder="A/Y (08/28)" style={{ padding: '8px', border: '2px solid #1a1a1a' }} />
              <input required type="password" placeholder="CVV" maxLength={3} style={{ padding: '8px', border: '2px solid #1a1a1a' }} />
            </div>
          </div>
        )}

        <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#e2f0cb', border: '2px dashed #1a1a1a', textAlign: 'center' }}>
          <h3 style={{ margin: 0 }}>TOPLAM ÖDENECEK: {Number(total).toFixed(2)} TL</h3>
        </div>

        <button type="submit" style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '15px', fontWeight: 'black', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '4px 4px 0px #1a1a1a' }}>
          ÖDEMEYİ TAMAMLA VE SİPARİŞ VER 💳
        </button>
        <Link to="/cart" style={{ marginTop: '5px', textAlign: 'center', color: '#1a1a1a', display: 'block', fontWeight: 'bold' }}>← Sepete Geri Dön</Link>
      </form>
    </div>
  );
};

// --- ANA İÇERİK BİLEŞENİ ---
const AppContent = ({ 
  cart, setActiveCategory, activeCategory, isSidebarOpen, setIsSidebarOpen, isNavOpen, setIsNavOpen,
  kampanyalar, currentSlide, setSelectedKampanya, selectedPlak, setSelectedPlak, filtrelenmisPlaklar,
  sepeteEkle, sepetiBosalt, adetGuncelle, urunCikar, toplamTutar, selectedKampanya, plaklar, bildirim, kuponKodu, kuponMesaji, kuponKullan, uygulananIndirim, indirimTutari, odenecekTutar, DEFAULT_KUPONLAR,
  aramaMetni, setAramaMetni, sirallama, setSirallama, favorites, toggleFavorite, isLoggedIn, setIsLoggedIn, handleLogout,
}) => {
  const location = useLocation();
  const guvenliToplam = Number(toplamTutar) || 0;
  const guvenliIndirim = Number(indirimTutari) || 0;
  const guvenliOdenecek = Number(odenecekTutar) || guvenliToplam;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* NAVBAR */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px', border: '4px solid #1a1a1a', backgroundColor: '#ff9e00', 
        boxShadow: '8px 8px 0px #1a1a1a', marginBottom: '30px', position: 'relative' 
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#1a1a1a' }}>
          <h1 style={{ margin: 0, fontSize: window.innerWidth < 768 ? '1.2rem' : '2rem', letterSpacing: '-1px' }}>VINtage VINyls</h1> 
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/" onClick={() => setIsNavOpen(false)} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>VİTRİN</Link>
          <Link to="/campaigns" onClick={() => setIsNavOpen(false)} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>KAMPANYALAR</Link>
          <Link to="/about" onClick={() => setIsNavOpen(false)} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>HAKKIMIZDA</Link>
          <Link to="/favorites" onClick={() => setIsNavOpen(false)} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>❤️ ({favorites.length})</Link>

          {isLoggedIn ? (
    <>
      {/* Oturum Açıkken Görünecek Kısım */}
      <Link to="/profile" style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold', backgroundColor: 'white', border: '2px solid #1a1a1a', padding: '5px 10px', boxShadow: '2px 2px 0px #1a1a1a' }}>
        👤 HESABIM
      </Link>
      
      {/* Eğer Giriş Yapan Kullanıcı Admin İse Admin Paneli Butonu Çıkar */}
      {JSON.parse(localStorage.getItem('user'))?.role === 'admin' && (
        <Link to="/admin" style={{ textDecoration: 'none', color: 'white', backgroundColor: '#1a1a1a', border: '2px solid #1a1a1a', padding: '5px 10px', fontWeight: 'bold' }}>
          🔑 ADMIN PANELİ
        </Link>
      )}

      <button onClick={handleLogout} style={{ border: '2px solid #1a1a1a', padding: '5px 10px', backgroundColor: '#ff4d4d', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
        ÇIKIŞ
      </button>
    </>
  ) : (
    <>
      {/* Oturum Kapalıyken Görünecek Kısım */}
      <Link to="/login" style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>GİRİŞ YAP</Link>
      <Link to="/register" style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold' }}>KAYIT OL</Link>
    </>
  )}

          <Link to="/cart" style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold', border: '2px solid #1a1a1a', padding: '5px 12px', backgroundColor: 'white', boxShadow: '3px 3px 0px #1a1a1a' }}>
            🛒 SEPET ({(cart || []).reduce((acc, curr) => acc + (curr.adet || 1), 0)})
          </Link>
        </div>
      </nav>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        {/* SIDEBAR */}
        {!location.pathname.startsWith('/product') && !["/login", "/register", "/checkout", "/campaigns", "/about", "/favorites"].includes(location.pathname) && (
          <div style={{ flexBasis: '250px' }}>
            <Sidebar 
              onSelectCategory={(cat) => { setActiveCategory(cat); setIsSidebarOpen(false); }} 
              activeCategory={activeCategory} 
            />
          </div>
        )}

        <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Routes>
            <Route path="/" element={
              <div>
                {/* BANNER */}
                <div onClick={() => setSelectedKampanya(kampanyalar[currentSlide])} style={{ backgroundColor: kampanyalar[currentSlide].renk, padding: '15px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', marginBottom: '25px', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontWeight: 'black', fontSize: '1.2rem' }}>⚡ {kampanyalar[currentSlide].baslik} ⚡</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{kampanyalar[currentSlide].detay} - Detaylar için tıkla!</div>
                </div>

                {/* ARAMA BAR */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 2, minWidth: '200px', display: 'flex', alignItems: 'center', border: '3px solid #1a1a1a', backgroundColor: 'white', padding: '0 10px', boxShadow: '4px 4px 0px #1a1a1a' }}>
                    <Search size={20} color="#1a1a1a" />
                    <input 
                      type="text" 
                      placeholder="Plak veya sanatçı ara..." 
                      value={aramaMetni} 
                      onChange={(e) => setAramaMetni(e.target.value)}
                      style={{ width: '100%', border: 'none', padding: '10px', outline: 'none', fontWeight: 'bold' }}
                    />
                    {aramaMetni && <X size={18} style={{ cursor: 'pointer' }} onClick={() => setAramaMetni('')} />}
                  </div>

                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', alignItems: 'center', border: '3px solid #1a1a1a', backgroundColor: 'white', padding: '0 10px', boxShadow: '4px 4px 0px #1a1a1a' }}>
                    <ArrowUpDown size={18} color="#1a1a1a" />
                    <select 
                      value={sirallama} 
                      onChange={(e) => setSirallama(e.target.value)}
                      style={{ width: '100%', border: 'none', padding: '10px', outline: 'none', fontWeight: 'bold', backgroundColor: 'transparent', cursor: 'pointer' }}
                    >
                      <option value="varsayilan">Sıralama: Önerilen</option>
                      <option value="fiyat-artan">Fiyat: Düşükten Yükseğe</option>
                      <option value="fiyat-azalan">Fiyat: Yüksekten Düşüğe</option>
                      <option value="a-z">İsim: A - Z</option>
                    </select>
                  </div>
                </div>

                {/* PLAK LİSTESİ */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                  {filtrelenmisPlaklar.map(plak => {
                    const pId = plak._id || plak.id;
                    const isFav = favorites.some(f => (f._id || f.id) === pId);

                    return (
                      <div key={pId} style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '15px', boxShadow: '6px 6px 0px #1a1a1a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        <button 
                          onClick={() => toggleFavorite(plak)}
                          style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: '2px solid #1a1a1a', borderRadius: '50%', padding: '6px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Heart size={18} fill={isFav ? "#ff4d4d" : "none"} color={isFav ? "#ff4d4d" : "#1a1a1a"} />
                        </button>

                        <Link to={`/product/${pId}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                          <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#eee', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', border: '2px solid #1a1a1a' }}>
                            <Disc size={70} color="#1a1a1a" strokeWidth={2.5} />
                          </div>
                          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{plak.ad}</h3>
                          <p style={{ color: '#666', margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{plak.sanatci}</p>
                        </Link>

                        <div style={{ marginTop: 'auto', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'black', fontSize: '1.2rem' }}>{plak.fiyat} TL</span>
                          <button onClick={() => sepeteEkle(plak)} style={{ backgroundColor: '#ff9e00', border: '2px solid #1a1a1a', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
                            EKLE +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            } />

            <Route path="/product/:id" element={<ProductDetail plaklar={plaklar} sepeteEkle={sepeteEkle} isLoggedIn={isLoggedIn} favorites={favorites} toggleFavorite={toggleFavorite} />} />

            <Route path="/profile" element={<ProfilePage handleLogout={handleLogout} />} />
            
            {/* FAVORİLER */}
            <Route path="/favorites" element={
              <div style={{ padding: '20px', border: '4px solid #1a1a1a', backgroundColor: 'white', boxShadow: '10px 10px 0px #1a1a1a' }}>
                <h2 style={{ borderBottom: '3px solid #1a1a1a', paddingBottom: '10px', textTransform: 'uppercase' }}>FAVORİ PLAKLARIM ({favorites.length})</h2>
                {favorites.length === 0 ? (
                  <p style={{ fontWeight: 'bold', padding: '20px 0' }}>Henüz favorilere bir plak eklemediniz. ❤️</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {favorites.map(plak => {
                      const pId = plak._id || plak.id;
                      return (
                        <div key={pId} style={{ border: '3px solid #1a1a1a', padding: '15px', backgroundColor: 'white', boxShadow: '4px 4px 0px #1a1a1a' }}>
                          <div style={{ textAlign: 'center', marginBottom: '10px' }}><Disc size={60} color="#1a1a1a" /></div>
                          <h4 style={{ margin: 0 }}>{plak.ad}</h4>
                          <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#666' }}>{plak.sanatci}</p>
                          <div style={{ fontWeight: 'bold', margin: '10px 0' }}>{plak.fiyat} TL</div>
                          <button onClick={() => sepeteEkle(plak)} style={{ width: '100%', backgroundColor: '#ff9e00', border: '2px solid #1a1a1a', padding: '8px', fontWeight: 'bold', cursor: 'pointer' }}>SEPETE EKLE</button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <Link to="/" style={{ display: 'inline-block', marginTop: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>← Alışverişe Dön</Link>
              </div>
            } />

            {/* SEPET */}
            <Route path="/cart" element={
              <div style={{ padding: '20px', border: '4px solid #1a1a1a', backgroundColor: 'white', boxShadow: '10px 10px 0px #1a1a1a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #1a1a1a', paddingBottom: '10px' }}>
                  <h2>SEPETİNİZ ({(cart || []).length})</h2>
                  {(cart || []).length > 0 && (
                    <button onClick={sepetiBosalt} style={{ backgroundColor: '#ff4d4d', border: '2px solid #1a1a1a', color: 'white', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' }}>
                      BOŞALT 🗑️
                    </button>
                  )}
                </div>

                {(!cart || cart.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Disc size={80} color="#1a1a1a" strokeWidth={2.5} />
                    <p style={{ fontWeight: 'bold', margin: '20px 0' }}>Sepetiniz şu an bomboş...</p>
                    <Link to="/">
                      <button style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '15px 30px', fontWeight: 'bold', cursor: 'pointer' }}>
                        ALIŞVERİŞE BAŞLA
                      </button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {cart.map((item, index) => {
                      const itemId = item._id || item.id;
                      return (
                        <div key={itemId || index} style={{ borderBottom: '2px solid #1a1a1a', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 'bold' }}>{item.ad}</span>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{item.fiyat} TL x {item.adet || 1}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button onClick={() => adetGuncelle(itemId, -1)} style={{ width: '30px', height: '30px', border: '2px solid #1a1a1a', cursor: 'pointer', backgroundColor: '#e2f0cb', fontWeight: 'bold' }}>-</button>
                            <span style={{ fontWeight: 'bold' }}>{item.adet || 1}</span>
                            <button onClick={() => adetGuncelle(itemId, 1)} style={{ width: '30px', height: '30px', border: '2px solid #1a1a1a', cursor: 'pointer', backgroundColor: '#ff9e00', fontWeight: 'bold' }}>+</button>
                          </div>
                          <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
                            {(item.fiyat * (item.adet || 1)).toFixed(2)} TL
                            <button onClick={() => urunCikar(index)} style={{ marginLeft: '15px', color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                          </div>
                        </div>
                      );
                    })}

                    <div style={{ margin: '20px 0', padding: '15px', border: '3px solid #1a1a1a', backgroundColor: '#f9f9f9' }}>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>İNDİRİM KUPONU</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          id="kuponInputAlani"
                          type="text" 
                          placeholder="Örn: VINTAGE10" 
                          style={{ flex: 1, padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', textTransform: 'uppercase', outline: 'none' }}
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const girilenMetin = document.getElementById('kuponInputAlani')?.value;
                            kuponKullan(girilenMetin);
                          }}
                          style={{ padding: '10px 20px', backgroundColor: '#1a1a1a', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                        >
                          UYGULA
                        </button>
                      </div>
                      {kuponMesaji && (
                        <p style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '0.9rem', color: kuponMesaji.includes('❌') ? '#cc0000' : '#008000' }}>
                          {kuponMesaji}
                        </p>
                      )}
                    </div>

                    <div style={{ marginTop: '20px', borderTop: '3px solid #1a1a1a', paddingTop: '15px' }}>
                      <p style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', fontWeight: 'bold' }}>
                        <span>Ara Toplam:</span>
                        <span>{guvenliToplam.toFixed(2)} TL</span>
                      </p>
                      {uygulananIndirim > 0 && (
                        <p style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0', color: 'green', fontWeight: 'bold' }}>
                          <span>İndirim:</span>
                          <span>-{guvenliIndirim.toFixed(2)} TL</span>
                        </p>
                      )}
                      <h3 style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', borderTop: '2px solid #1a1a1a', paddingTop: '10px', marginTop: '10px' }}>
                        <span>ÖDENECEK TUTAR:</span>
                        <span>{guvenliOdenecek.toFixed(2)} TL</span>
                      </h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
                      <Link to="/" style={{ color: '#1a1a1a', fontWeight: 'bold', textDecoration: 'none' }}>← ALIŞVERİŞE DÖN</Link>
                      <Link to="/checkout">
                        <button style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '12px 25px', fontWeight: 'bold', cursor: 'pointer' }}>
                          ÖDEMEYE GEÇ →
                        </button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            } />

            <Route path="/checkout" element={<CheckoutPage total={odenecekTutar} sepetiBosalt={sepetiBosalt} cart={cart} indirimTutari={indirimTutari} odenecekTutar={odenecekTutar} />} />
            
            <Route path="/campaigns" element={
              <div style={{ padding: '20px', border: '4px solid #1a1a1a', backgroundColor: 'white', boxShadow: '10px 10px 0px #1a1a1a' }}>
                <h2 style={{ borderBottom: '4px solid #1a1a1a', paddingBottom: '10px', textTransform: 'uppercase' }}>Kampanya Arşivi ⚡</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                  {kampanyalar.map(kamp => (
                    <div key={kamp.id} style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: kamp.renk, boxShadow: '5px 5px 0px #1a1a1a' }}>
                      <h3 style={{ margin: '0 0 10px 0' }}>{kamp.baslik}</h3>
                      <p style={{ fontWeight: 'bold' }}>{kamp.detay}</p>
                      <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.7)', display: 'inline-block', padding: '4px 8px', border: '1px solid #1a1a1a' }}>GEÇERLİLİK: {kamp.tarih}</div>
                    </div>
                  ))}
                </div>
                <Link to="/" style={{ display: 'block', marginTop: '30px', fontWeight: 'bold', color: '#1a1a1a' }}>← ANA SAYFAYA DÖN</Link>
              </div>
            } />

            {/* LOGIN ROUTE */}
            <Route path="/login" element={
              <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '40px', boxShadow: '12px 12px 0px #ff9e00', maxWidth: '400px', margin: '40px auto' }}>
                <h2 style={{ textTransform: 'uppercase', marginBottom: '30px', borderBottom: '4px solid #1a1a1a', paddingBottom: '10px' }}>Giriş Yap</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  const sifre = e.target.sifre.value;

                  try {
                    const { data } = await API.post('/auth/login', { 
                      email, 
                      sifre, 
                      password: sifre 
                    });
                    
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data));
                    
                    setIsLoggedIn(true);
                    alert(`Hoş geldin, ${data.adSoyad || 'Kullanıcı'}! 💿`);
                    window.location.href = "/";
                  } catch (error) {
                    alert(error.response?.data?.message || "Giriş hatası! Lütfen bilgilerinizi kontrol edin.");
                  }
                }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <label style={{ fontWeight: 'bold' }}>E-POSTA</label>
                  <input required name="email" type="email" placeholder="ornek@mail.com" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  
                  <label style={{ fontWeight: 'bold' }}>ŞİFRE</label>
                  <input required name="sifre" type="password" placeholder="******" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  
                  <button type="submit" style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>DÜKKANA GİRİŞ YAP</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>Hesabın yok mu? <Link to="/register" style={{ color: '#ff9e00', fontWeight: 'bold' }}>Kayıt Ol</Link></p>
              </div>
            } />

            <Route path="/about" element={
              <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '40px', boxShadow: '12px 12px 0px #e2f0cb' }}>
                <h2 style={{ fontSize: '2.5rem', borderBottom: '5px solid #1a1a1a', paddingBottom: '15px', marginBottom: '30px' }}>BİZ KİMİZ? 💿</h2>
                <div style={{ lineHeight: '1.8', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <p><span style={{ backgroundColor: '#ff9e00', padding: '0 5px' }}>VinVin Vintage Vinyls</span>, dijital dünyadan uzaklaşıp analogun sıcaklığına sığınanlar için kuruldu.</p>
                  <p style={{ marginTop: '20px' }}>Kocaeli Üniversitesi çatısı altında bir tutku projesi olarak başlayan bu dükkan, sadece plak satmakla kalmıyor; aynı zamanda bir kültürü yaşatmayı hedefliyor.</p>
                </div>
                <Link to="/" style={{ display: 'inline-block', marginTop: '40px', textDecoration: 'none' }}><button style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '15px 30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>PLAKLARA GERİ DÖN</button></Link>
              </div>
            } />

            {/* REGISTER ROUTE */}
            <Route path="/register" element={
              <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '40px', boxShadow: '12px 12px 0px #ff9e00', maxWidth: '400px', margin: '40px auto' }}>
                <h2 style={{ textTransform: 'uppercase', marginBottom: '30px', borderBottom: '4px solid #1a1a1a', paddingBottom: '10px' }}>Kayıt Ol</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const adSoyad = e.target.adSoyad.value;
                  const email = e.target.email.value;
                  const sifre = e.target.sifre.value;

                  try {
                    const { data } = await API.post('/auth/register', { 
                      adSoyad, 
                      name: adSoyad, 
                      email, 
                      sifre, 
                      password: sifre 
                    });
                    
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data));

                    setIsLoggedIn(true);
                    alert(`Hesabın başarıyla oluşturuldu, ${data.adSoyad || adSoyad}! 🎉`);
                    window.location.href = "/";
                  } catch (error) {
                    alert(error.response?.data?.message || "Kayıt olunurken bir hata oluştu!");
                  }
                }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <label style={{ fontWeight: 'bold' }}>AD SOYAD</label>
                  <input required name="adSoyad" type="text" placeholder="Ahmet Yılmaz" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  
                  <label style={{ fontWeight: 'bold' }}>E-POSTA</label>
                  <input required name="email" type="email" placeholder="ornek@mail.com" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  
                  <label style={{ fontWeight: 'bold' }}>ŞİFRE</label>
                  <input required name="sifre" type="password" placeholder="******" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  
                  <button type="submit" style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '15px', fontWeight: 'bold', border: '3px solid #1a1a1a', cursor: 'pointer', marginTop: '10px' }}>ÜYELİĞİ TAMAMLA</button>
                </form>
              </div>
            } />
          </Routes>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ marginTop: '60px', padding: '40px 20px', borderTop: '5px solid #1a1a1a', backgroundColor: '#1a1a1a', color: 'white', textAlign: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginBottom: '30px' }}>
          <div><h4 style={{ color: '#ff9e00' }}>VINtage VINyls</h4><p style={{ fontSize: '0.8rem' }}>Mühendislik projesi olarak tasarlanan retro plak dükkanı.</p></div>
          <div><h4 style={{ color: '#ff9e00' }}>İLETİŞİM</h4><p style={{ fontSize: '0.8rem' }}>Kocaeli Üniversitesi</p><p style={{ fontSize: '0.8rem' }}>info@vintagevinyls.com</p></div>
          <div><h4 style={{ color: '#ff9e00' }}>SOSYAL MEDYA</h4><p style={{ fontSize: '0.8rem' }}>Instagram | Twitter | Spotify</p></div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: '20px', fontSize: '0.7rem' }}>© 2026 Vintage Vinyls - Tüm Hakları Plakların İçinde Saklıdır.</div>
      </footer>

      {bildirim && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#ff9e00', color: '#1a1a1a', padding: '15px 25px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', fontWeight: 'bold', fontSize: '1.1rem', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingBag size={24} />
          <span>{bildirim}</span>
        </div>
      )}
    </div>
  );
}

// --- ANA APP BİLEŞENİ ---
function App() {
  const [plaklar, setPlaklar] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Hepsi");
  const [selectedPlak, setSelectedPlak] = useState(null);
  const [selectedKampanya, setSelectedKampanya] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [bildirim, setBildirim] = useState(null);
  
  const [aramaMetni, setAramaMetni] = useState('');
  const [sirallama, setSirallama] = useState('varsayilan');
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = "/";
  };
  
  const [uygulananIndirim, setUygulananIndirim] = useState(0);
  const [kuponMesaji, setKuponMesaji] = useState('');

  const toggleFavorite = (plak) => {
    const plakId = plak._id || plak.id;
    setFavorites(prev => {
      const varMi = prev.some(f => (f._id || f.id) === plakId);
      if (varMi) return prev.filter(f => (f._id || f.id) !== plakId);
      return [...prev, plak];
    });
  };

  const toplamTutar = (cart || []).reduce((acc, item) => {
    const gelenFiyat = item.fiyat || item.price || 0;
    const fiyat = parseFloat(gelenFiyat) || 0;
    const adet = parseInt(item.adet || 1) || 1;
    return acc + (fiyat * adet);
  }, 0);

  const indirimTutari = toplamTutar * (uygulananIndirim || 0);
  const odenecekTutar = uygulananIndirim > 0 ? Math.max(0, toplamTutar - indirimTutari) : toplamTutar;

  const kuponKullan = async (kod) => {
    if (!kod) {
      setKuponMesaji('❌ Lütfen bir kupon kodu girin');
      return;
    }
    try {
      const { data } = await API.post('/coupons/validate', { kod });
      setUygulananIndirim(data.oran);
      setKuponMesaji(data.mesaj);
    } catch (error) {
      setUygulananIndirim(0);
      setKuponMesaji(error.response?.data?.message || '❌ Geçersiz Kupon Kodu');
    }
  };

  const kampanyalar = [
    { id: 1, baslik: "Yaz Sonu İndirimi", detay: "Tüm Rock plaklarında %20 indirim!", renk: "#ff9e00", tarih: "15 Mart" },
    { id: 2, baslik: "Ücretsiz Kargo", detay: "500 TL ve üzeri kargo bedava!", renk: "#e2f0cb", tarih: "20 Mart" }
  ];

  const sepeteEkle = (plak) => {
    const plakId = plak._id || plak.id;
    const urunVarMi = cart.find(item => (item._id || item.id) === plakId);
    if (urunVarMi) {
      setCart(cart.map(item => (item._id || item.id) === plakId ? { ...item, adet: (item.adet || 1) + 1 } : item));
    } else {
      setCart([...cart, { ...plak, adet: 1 }]);
    }
    setBildirim(`${plak.ad} sepete eklendi! 📦`);
    setTimeout(() => setBildirim(null), 3000);
  };

  const adetGuncelle = (id, miktar) => {
    setCart(cart.map(item => {
      if ((item._id || item.id) === id) {
        const yeniAdet = (item.adet || 1) + miktar;
        return yeniAdet > 0 ? { ...item, adet: yeniAdet } : item;
      }
      return item;
    }));
  };

  const urunCikar = (index) => setCart(cart.filter((_, i) => i !== index));
  const sepetiBosalt = () => setCart([]);

  // BACKEND'DEN ÜRÜN ÇEKME
  useEffect(() => {
    const urunleriGetir = async () => {
      try {
        const { data } = await API.get('/products');
        setPlaklar(data);
      } catch (error) {
        console.error("Ürünler çekilirken hata oluştu:", error);
      }
    };

    urunleriGetir();
  }, []);

  // FRONTEND FİLTRELEME
  let filtrelenmisPlaklar = activeCategory === "Hepsi" ? plaklar : plaklar.filter(p => p.kategori === activeCategory);
  
  if (aramaMetni) {
    filtrelenmisPlaklar = filtrelenmisPlaklar.filter(p => 
      p.ad.toLowerCase().includes(aramaMetni.toLowerCase()) || 
      p.sanatci.toLowerCase().includes(aramaMetni.toLowerCase())
    );
  }

  if (sirallama === 'fiyat-artan') {
    filtrelenmisPlaklar = [...filtrelenmisPlaklar].sort((a, b) => a.fiyat - b.fiyat);
  } else if (sirallama === 'fiyat-azalan') {
    filtrelenmisPlaklar = [...filtrelenmisPlaklar].sort((a, b) => b.fiyat - a.fiyat);
  } else if (sirallama === 'a-z') {
    filtrelenmisPlaklar = [...filtrelenmisPlaklar].sort((a, b) => a.ad.localeCompare(b.ad));
  }

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
        bildirim={bildirim}
        kuponMesaji={kuponMesaji} kuponKullan={kuponKullan} uygulananIndirim={uygulananIndirim}
        indirimTutari={indirimTutari} odenecekTutar={odenecekTutar}
        aramaMetni={aramaMetni} setAramaMetni={setAramaMetni}
        sirallama={sirallama} setSirallama={setSirallama}
        favorites={favorites} toggleFavorite={toggleFavorite}
        isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
        handleLogout={handleLogout}
      />
    </Router>
  )
}

export default App;