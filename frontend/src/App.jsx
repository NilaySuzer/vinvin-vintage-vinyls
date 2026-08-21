import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { LucideHandMetal, Music2Icon, LucideCreditCard, User2Icon, KeyIcon, Bell, ChevronLeft, ChevronRight, Search, X, Disc, Star, ShoppingCart, ShoppingBag, Heart, CheckCircle, ShieldCheck, Truck, CreditCard, User, LogOut, Filter, ArrowUpDown, ChessQueenIcon, Tv2Icon, RadioIcon, LucideTv2, Music4Icon } from 'lucide-react';
import API from './services/api';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import CampaignsPage from './pages/CampaignsPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import SpotlightPlayer from './components/SpotlightPlayer';
import ProductReviews from './pages/ProductDetailPage.jsx';


// --- ÜRÜN DETAY SAYFASI ---
const ProductDetail = ({ plaklar, sepeteEkle, isLoggedIn, favorites, toggleFavorite, setPlaklar, secilenPlak, currentUser }) => {
  const { id } = useParams();
  // MongoDB _id veya normal id kontrolü
  const plak = plaklar.find(p => (p._id || p.id) === id || (p.id && p.id === parseInt(id)));

  
  

  if (!plak) return <div style={{ padding: '100px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>Ürün bulunamadı veya yükleniyor... 💿</div>;

  const plakId = plak._id || plak.id;
  const isFav = favorites.some(fav => (fav._id || fav.id) === plakId);
  const stokVarMi = (plak.stok ?? 10) > 0;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
        <div style={{
          flex: '1', width: '100%', 
    maxWidth: '480px',  border: '5px solid #1a1a1a', boxShadow: '15px 15px 0px #ff9e00', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', aspectRatio: '1/1', position: 'relative'
        }}>
    
          <img 
            src={plak.resim || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=600'} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
              alt={plak.ad} 
              referrerPolicy="no-referrer"
            onError={(e) => {
      if (!e.target.dataset.fallback) {
        e.target.dataset.fallback = "true";
        e.target.src = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500';
      }
    }}
            
          />
        
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
          
          <div style={{ padding: '15px 25px', backgroundColor: '#e2f0cb', border: '3px solid #1a1a1a', display: 'inline-block', fontWeight: 'bold', fontSize: '1.8rem', boxShadow: '4px 4px 0px #1a1a1a' }}>
            {plak.fiyat} TL
          </div>

          <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ backgroundColor: (plak.stok ?? 5) > 0 ? '#0dae32' : '#c4101f', color: (plak.stok ?? 5) > 0 ? '#eff8f1' : '#eacbce', padding: '10px 15px', border: '2px solid #1a1a1a', fontWeight: 'bold', fontSize: '1.1rem' }}>
              {(plak.stok ?? 5) > 0 ? `STOKTA VAR (${plak.stok ?? 5} Adet)` : 'STOK TÜKENDİ'}
            </span>
            <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '10px 15px', border: '2px solid #1a1a1a', fontWeight: 'bold', fontSize: '1.1rem' }}>
              ORİJİNAL BASKI
            </span>
          </div>

          <div style={{ margin: '25px 0', padding: '20px', border: '3px solid #1a1a1a', backgroundColor: 'white', boxShadow: '5px 5px 0px #1a1a1a' }}>
            <h3 style={{ margin: '0 0 10px 0', textTransform: 'uppercase', borderBottom: '2px dashed #1a1a1a', paddingBottom: '5px' }}>PLAK ÖZELLİKLERİ</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', fontSize: '0.95rem', fontWeight: 'bold' }}>
              <li>Kategori: <span style={{ backgroundColor: '#ff9e00', padding: '2px 6px' }}>{plak.kategori}</span></li>
              <li>Kondisyon: <span style={{ color: '#2b9348' }}>Sıfır Ürün (NM / 9/10)</span></li>
              <li>Devir: 33 RPM (12" LP)</li>
              <li>Baskı Yılı: Orijinal Baskı</li>
              <li>Kargo: Sipariş sonrası 1 ila 3 iş günü 📦</li>
            </ul>
          </div>

          {/* 2. Buton Değişimi */}
      {stokVarMi ? (
        <button 
          onClick={() => sepeteEkle(plak)} 
          className="brutal-btn" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '20px', backgroundColor: '#1a1a1a', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '5px 5px 0px #ff9e00' }}>
            <ShoppingCart size={22} color="white" /> SEPETE EKLE +
        </button>
      ) : (
        <button 
          onClick={() => alert(`"${plak.ad}" yeniden stoklara girdiğinde e-posta bildirimi alacaksınız! 🔔`)} 
          className="brutal-btn" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '20px', backgroundColor: 'rgb(51, 135, 51)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '5px 5px 0px #000000' }}>
        
          GELİNCE HABER VER <Bell size={22} color="yellow" /> 


        </button>
      )}

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
<ProductReviews 
  plakId={plak?._id || plak?.id}
  reviews={plak?.reviews || []}
  isLoggedIn={isLoggedIn}
  currentUser={currentUser}
  onReviewAdded={(guncelYorumlar) => {
    // Plak listesindeki ilgili plağın yorumlarını anlık olarak günceller
    if (setPlaklar) {
      setPlaklar(prevPlaklar =>
        prevPlaklar.map(p =>
          (p._id === (plak?._id || plak?.id) || p.id === (plak?._id || plak?.id))
            ? { ...p, reviews: guncelYorumlar }
            : p
        )
      );
    }
  }}
/>

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

const [kayitliAdresler, setKayitliAdresler] = useState([]);
const [secilenAdresId, setSecilenAdresId] = useState(null);

useEffect(() => {
  const fetchAdresler = async () => {
    try {
      const { data } = await API.get('/users/profile');
      if (data && data.adresler) {
        setKayitliAdresler(data.adresler);
      }
    } catch (err) {
      console.error('Kayıtlı adresler alınamadı:', err);
    }
  };

  // Kullanıcı oturumu açıksa adresleri çek
  const token = localStorage.getItem('token') || (JSON.parse(localStorage.getItem('user') || '{}')).token;
  if (token) {
    fetchAdresler();
  }
}, []);

// Adrese tıklandığında formu dolduran fonksiyon
const handleAdresSec = (adr) => {
  setSecilenAdresId(adr._id);
  const tamFormatliAdres = `${adr.acikAdres} - ${adr.ilce} / ${adr.sehir}`;
  setFormData(prev => ({
    ...prev,
    adres: tamFormatliAdres
  }));
};

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
          ALIŞVERİŞE DEVAM ET <ShoppingCart size={22} color="black" /> 
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '30px', boxShadow: '10px 10px 0px #1a1a1a', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textTransform: 'uppercase', borderBottom: '3px solid #ff9e00', paddingBottom: '10px', marginTop: 0 }}>Ödeme ve Teslimat Bilgileri</h2>
<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
  
  {/* KAYITLI ADRESLER KUTUSU (Varsa gösterilir) */}
  {kayitliAdresler.length > 0 && (
    <div style={{ backgroundColor: '#fff', border: '3px solid #1a1a1a', padding: '15px', boxShadow: '4px 4px 0px #1a1a1a' }}>
      <label style={{ fontWeight: 'black', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        📍 KAYITLI ADRESLERİMDEN SEÇ
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {kayitliAdresler.map(adr => {
          const isSelected = secilenAdresId === adr._id;
          return (
            <div
              key={adr._id}
              onClick={() => handleAdresSec(adr)}
              style={{
                border: '2px solid #1a1a1a',
                padding: '10px',
                backgroundColor: isSelected ? '#ff9e00' : '#f9f9f9',
                cursor: 'pointer',
                boxShadow: isSelected ? '3px 3px 0px #1a1a1a' : 'none',
                transition: 'all 0.1s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'black', fontSize: '0.85rem', textTransform: 'uppercase' }}>{adr.baslik}</span>
                {isSelected && <span style={{ fontSize: '0.75rem', fontWeight: 'black' }}>✓ SEÇİLDİ</span>}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '4px', color: isSelected ? '#1a1a1a' : '#555' }}>
                {adr.ilce} / {adr.sehir}
              </div>
              <div style={{ fontSize: '0.75rem', color: isSelected ? '#1a1a1a' : '#777', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {adr.acikAdres}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}

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

  <button type="submit" style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '15px', fontWeight: 'black', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '4px 4px 0px #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
    ÖDEMEYİ TAMAMLA VE SİPARİŞ VER <LucideCreditCard size={22} color="#1a1a1a" /> 
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

  const { pathname } = useLocation(); // 👈 Mevcut sayfa yolunu alır

  // Her sayfa değiştiğinde (URL değiştiğinde) otomatik en üste kaydır:
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  const [tumPlaklariGoster, setTumPlaklariGoster] = useState(false);
   const { id } = useParams();
  const plak = plaklar.find(p => (p._id || p.id) === id || (p.id && p.id === parseInt(id)));
  

const handleReviewAdded = (guncelYorumlar) => {
  // Eğer detay sayfası seçili bir plağı gösteriyorsa (örneğin secilenPlak veya product):
  if (secilenPlak) {
    setSecilenPlak(prev => ({
      ...prev,
      reviews: guncelYorumlar
    }));
  }

  // Ana plaklar state'indeki ilgili plağın yorumlarını da günceller:
  setPlaklar(prevPlaklar =>
    prevPlaklar.map(p =>
      (p._id === secilenPlak?._id || p.id === secilenPlak?.id)
        ? { ...p, reviews: guncelYorumlar }
        : p
    )
  );
};


  /* --- SLIDER VE OTOMATİK KAYMA MANTIĞI --- */
 
// 1. Yeni Gelenler Slider
const sliderRef = useRef(null);
const slideLeft = () => sliderRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  const slideRight = () => sliderRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  
  useEffect(() => {
  const interval = setInterval(() => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }
  }, 3000);
  return () => clearInterval(interval);
}, []);

// 2. Editörün Seçtikleri Slider
const editorSliderRef = useRef(null);
const slideEditorLeft = () => editorSliderRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
const slideEditorRight = () => editorSliderRef.current?.scrollBy({ left: 320, behavior: 'smooth' });

  useEffect(() => {
  const interval = setInterval(() => {
    if (editorSliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = editorSliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        editorSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        editorSliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }
  }, 3500);
  return () => clearInterval(interval);
}, []);
  
// 3. Fırsat Plakları Slider
const firsatSliderRef = useRef(null);
const slideFirsatLeft = () => firsatSliderRef.current?.scrollBy({ left: -330, behavior: 'smooth' });
const slideFirsatRight = () => firsatSliderRef.current?.scrollBy({ left: 330, behavior: 'smooth' });

  useEffect(() => {
  const interval = setInterval(() => {
    if (firsatSliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = firsatSliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        firsatSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        firsatSliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }
  }, 4000);
  return () => clearInterval(interval);
}, []);
  
// 4. Metal Efsaneleri Slider
const metalSliderRef = useRef(null);
const slideMetalLeft = () => metalSliderRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
const slideMetalRight = () => metalSliderRef.current?.scrollBy({ left: 320, behavior: 'smooth' });

  useEffect(() => {
  const interval = setInterval(() => {
    if (metalSliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = metalSliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        metalSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        metalSliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }
  }, 4500);
  return () => clearInterval(interval);
}, []);
  
// 5. Türkçe Pop Kraliçeleri Slider
const popSliderRef = useRef(null);
const slidePopLeft = () => popSliderRef.current?.scrollBy({ left: -310, behavior: 'smooth' });
const slidePopRight = () => popSliderRef.current?.scrollBy({ left: 310, behavior: 'smooth' });

  useEffect(() => {
  const interval = setInterval(() => {
    if (popSliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = popSliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        popSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        popSliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }
  }, 5000);
  return () => clearInterval(interval);
}, []);
  
  const [showNotifications, setShowNotifications] = useState(false);
const [bildirimler, setBildirimler] = useState([
  { id: 1, baslik: '🔥 %20 İndirim Başladı!', mesaj: 'Seçili Rock plaklarında indirim fırsatı!', tarih: '1 saat önce' },
  { id: 2, baslik: '📦 Stok Güncellemesi', mesaj: 'Tükenen plaklar yeniden stoklarda!', tarih: 'Dün' }
]);
  // Arama çubuğunda hepsi görünsün ama vitrinde sadece stoğu > 0 olanlar görünsün:
const vitrinPlaklari = (filtrelenmisPlaklar || []).filter(plak => (plak.stok ?? 10) > 0);
  const guvenliToplam = Number(toplamTutar) || 0;
  const guvenliIndirim = Number(indirimTutari) || 0;
  const guvenliOdenecek = Number(odenecekTutar) || guvenliToplam;
  

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }});

  return (
    <div style={{ width: '92%', margin: '0 auto', padding: '20px' }}>
      {/* NAVBAR */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px', border: '4px solid #1a1a1a', backgroundColor: '#ffd166', 
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
        <Link to="/account" style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold', backgroundColor: 'white', border: '2px solid #1a1a1a', padding: '5px 10px', boxShadow: '2px 2px 0px #1a1a1a' }}>
        <User2Icon size={22} color="gray" /> HESABIM
        </Link>
        
       {/* Giriş yapılmış ve rolü 'admin' ise göster */}
       {/* Giriş yapılmış ve admin ise göster */}
{isLoggedIn && (() => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && (user.isAdmin === true || user.role === 'admin');
  } catch (e) {
    return false;
  }
})() && (
  <Link 
    to="/admin" 
    style={{ 
      textDecoration: 'none', 
      color: 'white', 
      backgroundColor: '#1a1a1a', 
      border: '2px solid #1a1a1a', 
      padding: '5px 10px', 
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    }}
  >
    <KeyIcon size={22} color="yellow" /> ADMIN
  </Link>
)}

        <button onClick={handleLogout} style={{ border: '2px solid #1a1a1a', padding: '6px 12px', backgroundColor: '#1a1a1a', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <LogOut size={16} /> ÇIKIŞ
        </button>
      </>
    ) : (
      <>
        <Link to="/login" style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold', border: '2px solid #1a1a1a', padding: '5px 10px', backgroundColor: 'white' }}>
          Giriş
        </Link>
        <Link to="/register" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', border: '2px solid #1a1a1a', padding: '5px 10px', backgroundColor: '#1a1a1a' }}>
          Kayıt
        </Link>
      </>
    )}
{/* 📂 KATEGORİLER DROPDOWN (YENİLENMİŞ RETRO BRUTALIST TASARIM) */}
<div style={{ position: 'relative', display: 'inline-block', }}>
  <button 
    onClick={() => setIsNavOpen(!isNavOpen)} 
    style={{ 
      backgroundColor: isNavOpen ? '#ff9e00' : 'white', 
      color: '#1a1a1a', 
      border: '3px solid #1a1a1a', 
      padding: '6px 14px', 
      fontWeight: 'bold', 
      cursor: 'pointer', 
      fontSize: '0.9rem', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      boxShadow: '3px 3px 0px #1a1a1a',
      transition: 'all 0.1s ease',
      textTransform: 'uppercase',
      fontFamily: 'inherit'
    }}
  >
    <span>Kategoriler</span>
    <span style={{ 
      fontSize: '0.75rem', 
      transform: isNavOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
      transition: 'transform 0.2s' 
    }}>
      ▼
    </span>
  </button>

  {/* Açılır Kutu */}
  {isNavOpen && (
    <div style={{ 
      position: 'absolute', 
      top: 'calc(100% + 8px)', 
      left: 0, 
      backgroundColor: 'white', 
      border: '3px solid #1a1a1a', 
      boxShadow: '6px 6px 0px #1a1a1a', 
      zIndex: 999, 
      display: 'flex', 
      flexDirection: 'column', 
      minWidth: '180px',
      padding: '6px'
    }}>
      {['Tümü', 'Rock', 'Jazz', 'Pop', 'Klasik', 'Metal'].map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setActiveCategory(cat);
            setIsNavOpen(false);
          }}
          style={{
            textAlign: 'left', 
            padding: '10px 12px', 
            border: activeCategory === cat ? '2px solid #1a1a1a' : '2px solid transparent', 
            backgroundColor: activeCategory === cat ? '#ff9e00' : 'transparent',
            fontWeight: 'bold', 
            cursor: 'pointer', 
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            marginBottom: '4px',
            boxShadow: activeCategory === cat ? '2px 2px 0px #1a1a1a' : 'none'
          }}
        >
          {cat === 'Tümü' ? '📀 TÜM PLAKLAR' : ` ${cat}`}
        </button>
      ))}
    </div>
  )}
</div>
          {/* NAVBAR İÇİNDE BİLDİRİM ZİLİ */}
{user && (
  <div style={{ position: 'relative' }}>
    <button 
      onClick={() => setShowNotifications(!showNotifications)}
      className="brutal-btn"
      style={{ backgroundColor: showNotifications ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}
    >
      <Bell size={20} color="#1a1a1a" />
      {bildirimler.length > 0 && (
        <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ff4d4d', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', fontWeight: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1a1a1a' }}>
          {bildirimler.length}
        </span>
      )}
    </button>

    {/* BİLDİRİMLER AÇILIR KUTUSU */}
    {showNotifications && (
      <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, backgroundColor: 'white', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', width: '280px', zIndex: 1000, padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1a1a1a', paddingBottom: '8px', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'black', fontSize: '0.9rem' }}>🔔 BİLDİRİMLER</span>
          <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>{bildirimler.length} Yeni</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
          {bildirimler.map(b => (
            <div key={b.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
              <div style={{ fontWeight: 'black', fontSize: '0.85rem', color: '#ff9e00' }}>{b.baslik}</div>
              <p style={{ margin: '3px 0', fontSize: '0.8rem', color: '#333', fontWeight: 'bold' }}>{b.mesaj}</p>
              <span style={{ fontSize: '0.7rem', color: '#888' }}>{b.tarih}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}
          <Link to="/cart" style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold', border: '2px solid #1a1a1a', padding: '5px 12px', backgroundColor: 'white', boxShadow: '3px 3px 0px #1a1a1a' }}>
             <ShoppingBag size={20} color="black" /> SEPET ({(cart || []).reduce((acc, curr) => acc + (curr.adet || 1), 0)})
          </Link>
        </div>
      </nav>

        <div style={{ 
  display: 'flex', 
  gap: '20px', 
  alignItems: 'flex-start', 
  width: '100%', 
  boxSizing: 'border-box' 
}}>
  

  {/* 📍 2. SAĞ İÇERİK ALANI (Banner + Slider + Arama + Grid) */}
  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <Routes>
      <Route path="/" element={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '100%' }}>
          
         {/* ⚡ DİNAMİK VE TIKLANABİLİR REKLAM / KAMPANYA BANNERI */}
                {(() => {
                  const renkPaleti = [ '#c7f9cc', '#ffadad','#a0c4ff',  '#bdb2ff'];

        const aktifKampanyalar = (kampanyalar || [])
          .filter(k => k.isAktif !== false)
          .slice()
          .reverse();

        if (aktifKampanyalar.length === 0) return null;

        const mevcutIndex = currentSlide % aktifKampanyalar.length;
        const mevcutSlayt = aktifKampanyalar[currentSlide % aktifKampanyalar.length];

        const bannerRengi = renkPaleti[mevcutIndex % renkPaleti.length];
        return (
          <div 
            onClick={() => setSelectedKampanya(mevcutSlayt)} 
            className="brutal-btn"
            style={{ 
              backgroundColor: bannerRengi, 
              color: '#1a1a1a', 
              border: '4px solid #1a1a1a', 
              padding: '25px', 
              boxShadow: '8px 8px 0px #1a1a1a', 
              marginBottom: '30px', 
              cursor: 'pointer', 
              textAlign: 'center',
              transition: 'background-color 0.5s ease, transform 0.1s ease'
            }}
          >
            <span style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '4px 12px', fontWeight: 'black', fontSize: '0.8rem', border: '1px solid white' }}>
              HAFTANIN FIRSATI ⚡ (Tıkla & İncele)
            </span>
            <h2 style={{ fontSize: '2rem', margin: '10px 0 5px 0', textTransform: 'uppercase', fontWeight: 'black' }}>
              {mevcutSlayt?.baslik}
            </h2>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>
              {mevcutSlayt?.detay} — Kampanya detayları ve indirim kodu için tıkla! 💿
            </p>
          </div>
        );
      })()}
                
{/* BRUTALIST SONSUZ KAYAN MARQUEE ŞERİDİ */}
<div 
  className="brutal-marquee-container"
  style={{
    backgroundColor: '#92cef7', // İster neon yeşil (#06d6a0), ister fosforlu sarı (#ffd166)
    borderTop: '1px solid #1a1a1a',
    borderBottom: '1px solid #1a1a1a',
    overflow: 'hidden',
    padding: '12px 0',
    margin: '5px -55px',
    boxShadow: '0 4px 0px #1a1a1a',
    userSelect: 'none',
    width: '100vw',
    border: '4px solid #1a1a1a', // 👈 Sadece üst-alt değil, 4 bir tarafına kalın çerçeve
    boxShadow: '6px 6px 0px #1a1a1a', // 👈 Diğer kartlarla aynı brutalist gölge
    boxSizing: 'border-box',
    maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
    WebkitMaskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
   

    
  }}
>
  <div className="brutal-marquee-track">
    {/* Metni yan yana iki kez yazıyoruz ki döngü kusursuz ve kesintisiz aksın */}
    <span style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', color: '#1a1a1a', whiteSpace: 'nowrap', paddingRight: '20px' }}>
      🔥 HIZLI KARGO &nbsp;•&nbsp; ⚡ %100 ORİJİNAL BASKILAR &nbsp;•&nbsp; 📻 HER SİPARİŞTE VİNİL TEMİZLEME BEZİ HEDİYE &nbsp;•&nbsp; 💿 ANALOG SESİN SAF GÜCÜ &nbsp;•&nbsp; 📦 AHŞAP KORUMALI KIRILMAZ PAKETLEME &nbsp;•&nbsp;
    </span>
    <span style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', color: '#1a1a1a', whiteSpace: 'nowrap', paddingRight: '20px' }}>
      🔥HIZLI KARGO &nbsp;•&nbsp; ⚡ %100 ORİJİNAL BASKILAR &nbsp;•&nbsp; 📻 HER SİPARİŞTE VİNİL TEMİZLEME BEZİ HEDİYE &nbsp;•&nbsp; 💿 ANALOG SESİN SAF GÜCÜ &nbsp;•&nbsp; 📦 AHŞAP KORUMALI KIRILMAZ PAKETLEME &nbsp;•&nbsp;
    </span>
  </div>
</div>


{/* 🔍 3. ARAMA VE SIRALAMA BAR */}
          {/* ARAMA BAR (CANLI SONUÇ DROPDOWN'LI) */}
<div style={{ flex: 2, minWidth: '220px', position: 'relative' }}>
  <div style={{ display: 'flex', alignItems: 'center', border: '3px solid #1a1a1a', backgroundColor: 'white', padding: '0 10px', boxShadow: '4px 4px 0px #1a1a1a' }}>
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

  {/* 🎯 CANLI ARAMA DROPDOWN SONUÇLARI */}
  {aramaMetni.trim() !== '' && (
    <div style={{ 
      position: 'absolute', top: '100%', left: 0, right: 0, 
      backgroundColor: 'white', border: '3px solid #1a1a1a', 
      boxShadow: '6px 6px 0px #1a1a1a', zIndex: 100, 
      maxHeight: '300px', overflowY: 'auto', marginTop: '5px' 
    }}>
      {filtrelenmisPlaklar.length > 0 ? (
        filtrelenmisPlaklar.map((plak) => {
          const pId = plak._id || plak.id;
          return (
            <Link 
              key={`search-${pId}`}
              to={`/product/${pId}`}
              onClick={() => setAramaMetni('')} // Tıklayınca aramayı temizler ve detay sayfasına gider
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', 
                padding: '10px', borderBottom: '2px solid #1a1a1a', 
                textDecoration: 'none', color: '#1a1a1a', backgroundColor: 'white' 
              }}
            >
              <img 
                src={plak.resim || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=100'} 
                alt={plak.ad} 
                style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid #1a1a1a' }} 
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'black', fontSize: '0.95rem' }}>{plak.ad}</div>
                <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>{plak.sanatci}</div>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#ff9e00', textShadow: '1px 1px 0px #1a1a1a' }}>
                {plak.fiyat} TL
              </div>
            </Link>
          );
        })
      ) : (
        <div style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#888' }}>
          Aradığınız plak bulunamadı 😔
        </div>
      )}
    </div>
  )}

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

                {tumPlaklariGoster && (
                  <div style={{ margin: '10px 0' }}>
                    <button
                      onClick={() => {
                        setTumPlaklariGoster(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        backgroundColor: '#ff6b6b',
                        border: '3px solid #1a1a1a',
                        padding: '8px 16px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        boxShadow: '3px 3px 0px #1a1a1a'
                      }}
                    >
                      ← VİTRİNE DÖN
                    </button>
                  </div>
                )}

         {!tumPlaklariGoster && (
  <>
                
          {/* 🔥 YENİ GELEN PLAKLAR SLIDER */}
          <div className="brutal-card" style={{ backgroundColor: '#e0a6bf', border: '4px solid #1a1a1a', padding: '20px', boxShadow: '6px 6px 0px #1a1a1a', width: '100%', boxSizing: 'border-box', }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', textTransform: 'uppercase' }}><Music2Icon size={30} color="white"/> YENİ GELEN PLAKLAR</h3>
                <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: '#666', fontSize: '0.85rem' }}>Koleksiyona taze eklenenler</p>
              </div>

              {/* YÖN OKLARI */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={slideLeft} style={{ border: '3px solid #1a1a1a', backgroundColor: 'white', padding: '6px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
                  <ChevronLeft size={20} color="#1a1a1a" />
                </button>
                <button onClick={slideRight} style={{ border: '2px solid #1a1a1a', backgroundColor: '#ff9e00', padding: '6px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
                  <ChevronRight size={20} color="#1a1a1a" />
                </button>
              </div>
            </div>

            {/* SLIDER İÇERİĞİ */}
            <div 
              ref={sliderRef}
              style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '10px', scrollbarWidth: 'none' }}
            >
              {/* filtrelenmisPlaklar yerine direkt ham 'plaklar' dizisini ters çevirip ilk 6'ini alıyoruz */}
{(plaklar || []).slice().reverse().slice(0, 15).map(plak => {
  const pId = plak._id || plak.id;
  const isFav = favorites.some(f => (f._id || f.id) === pId);

  return (
    <div key={`slide-${pId}`} style={{ minWidth: '240px', maxWidth: '240px', backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '12px', boxShadow: '4px 4px 0px #1a1a1a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <button 
        onClick={() => toggleFavorite(plak)}
        style={{ position: 'absolute', top: '18px', right: '18px', background: 'white', border: '2px solid #1a1a1a', borderRadius: '50%', padding: '5px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Heart size={16} fill={isFav ? "#ff4d4d" : "none"} color={isFav ? "#ff4d4d" : "#1a1a1a"} />
      </button>

      <Link to={`/product/${pId}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
        <div
          className="brutal-img-container"
          style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', borderBottom: '3px solid #1a1a1a', backgroundColor: '#f0f0f0', marginBottom: '10px' }}>
          <img 
            src={plak.resim || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=600'} 
            alt={plak.ad} 
            referrerPolicy="no-referrer"
            onError={(e) => {
      if (!e.target.dataset.fallback) {
        e.target.dataset.fallback = "true";
        e.target.src = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500';
      }
    }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        {/* TÜKENDİ ROZETİ */}
      {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: '2px solid #1a1a1a',
            padding: '4px 12px',
            fontWeight: '900',
            fontSize: '1.1rem',
            boxShadow: '2px 2px 0px #1a1a1a'
          }}
        >
          TÜKENDİ
        </span>
      )}
        </div>
        <h4 style={{ margin: '0 0 3px 0', fontSize: '1.1rem', textTransform: 'uppercase', lineHeight: '1.2' }}>{plak.ad}</h4>
        <p style={{ color: '#666', margin: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>{plak.sanatci}</p>
      </Link>

      {/* 3. DİNAMİK BUTON (STOK VARSA SEPETE EKLE / BİTTİYSE GELİNCE HABER VER) */}
      <div style={{  marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
      <span style={{ fontWeight: 'black', fontSize: '1.1rem' }}>{plak.fiyat} TL</span>
  {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        alert(`"${plak.ad}" stoğa girdiğinde size haber vereceğiz! 🔔`);
      }}
      className="brutal-btn"
      style={{
      backgroundColor: '#306a04', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem'
      }}
    >
      <Bell size={22} color="yellow" />
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        sepeteEkle(plak);
        e.stopPropagation();
        handleAddToCart(plak);
      }}
      className="brutal-btn"
      style={{
         backgroundColor: '#e0a6bf', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem'
      }}
    >
      <ShoppingCart size={22} color="black" /> +
    </button>
  )}
</div>

    </div>
  );
})}
                  </div>
                </div>


<SpotlightPlayer 
  plak={plaklar.find(p => p.ad === 'Fearless') || plaklar[0]} 
  sepeteEkle={sepeteEkle} 
/>


                
{/* SLIDER: EDİTÖRÜN ÖZEL SEÇTİKLERİ */}
{(() => {
  // Manuel olarak öne çıkarmak istediğin plakların tam adları:
  const secilenPlaklar = ['Reputation', '21', 'The Best Of Sade', 'A Night At The Opera', 'Use Your Illusion 2', 'Bad (25. Yıl)'];
  const editorListesi = (plaklar || []).filter(p => secilenPlaklar.includes(p.ad));

  return (
    <div className="brutal-card" style={{ backgroundColor: '#ffd166', border: '4px solid #1a1a1a', padding: '20px', boxShadow: '6px 6px 0px #1a1a1a', width: '100%', boxSizing: 'border-box', marginTop: '0px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music2Icon size={30} color="#1a1a1a"/> EDİTÖRÜN SEÇTİKLERİ <Star size={22} color="blue" /> 
          </h3>
          <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: '#333', fontSize: '0.85rem' }}>Özel olarak seçilmiş plaklar</p>
        </div>

        {/* YÖN OKLARI */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={slideEditorLeft} style={{ border: '3px solid #1a1a1a', backgroundColor: 'white', padding: '6px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
            <ChevronLeft size={20} color="#1a1a1a" />
          </button>
          <button onClick={slideEditorRight} style={{ border: '3px solid #1a1a1a', backgroundColor: '#1a1a1a', padding: '6px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
            <ChevronRight size={20} color="white" />
          </button>
        </div>
      </div>

      {/* SLIDER İÇERİĞİ */}
      <div 
        ref={editorSliderRef}
        style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '10px', scrollbarWidth: 'none' }}
      >
        {editorListesi.map(plak => {
          const pId = plak._id || plak.id;
          const isFav = favorites.some(f => (f._id || f.id) === pId);

          return (
            <div key={`editor-${pId}`} style={{ minWidth: '240px', maxWidth: '240px', backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '12px', boxShadow: '4px 4px 0px #1a1a1a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <button 
                onClick={() => toggleFavorite(plak)}
                style={{ position: 'absolute', top: '18px', right: '18px', background: 'white', border: '2px solid #1a1a1a', borderRadius: '50%', padding: '5px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Heart size={16} fill={isFav ? "#ff4d4d" : "none"} color={isFav ? "#ff4d4d" : "#1a1a1a"} />
              </button>

              <Link to={`/product/${pId}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <div
                  className="brutal-img-container"
                  style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', borderBottom: '3px solid #1a1a1a', backgroundColor: '#f0f0f0', marginBottom: '10px' }}>
                  <img 
                    src={plak.resim} 
                    alt={plak.ad} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.dataset.fallback = "true";
                        e.target.src = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500';
                      }
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                {/* TÜKENDİ ROZETİ */}
      {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: '2px solid #1a1a1a',
            padding: '4px 12px',
            fontWeight: '900',
            fontSize: '1.1rem',
            boxShadow: '2px 2px 0px #1a1a1a'
          }}
        >
          TÜKENDİ
        </span>
      )}
                </div>
                <h4 style={{ margin: '0 0 3px 0', fontSize: '1.1rem', textTransform: 'uppercase', lineHeight: '1.2' }}>{plak.ad}</h4>
                <p style={{ color: '#666', margin: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>{plak.sanatci}</p>
              </Link>

                {/* 3. DİNAMİK BUTON (STOK VARSA SEPETE EKLE / BİTTİYSE GELİNCE HABER VER) */}
      <div style={{  marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
      <span style={{ fontWeight: 'black', fontSize: '1.1rem' }}>{plak.fiyat} TL</span>
  {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        alert(`"${plak.ad}" stoğa girdiğinde size haber vereceğiz! 🔔`);
      }}
      className="brutal-btn"
      style={{
      backgroundColor: '#306a04', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem'
      }}
    >
      <Bell size={22} color="yellow" />
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        sepeteEkle(plak);
        e.stopPropagation();
        handleAddToCart(plak);
      }}
      className="brutal-btn"
      style={{
         backgroundColor: '#ffd166', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem'
      }}
    >
      <ShoppingCart size={22} color="black" /> +
    </button>
  )}
</div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
})()}

{/* 4. YÖNTEM SLIDER: FIRSAT & BÜTÇE DOSTU PLAKLAR */}
{(() => {
  const firsatPlaklari = (plaklar || [])
    .filter(p => Number(p.fiyat) <= 1000) // 👈 400 TL ve altındaki ürünleri yakalar
    .sort((a, b) => Number(a.fiyat) - Number(b.fiyat)); // Ucuzdan pahalıya sıralar

  return (
    <div className="brutal-card" style={{ backgroundColor: '#06d6a0', border: '4px solid #1a1a1a', padding: '20px', boxShadow: '6px 6px 0px #1a1a1a', width: '100%', boxSizing: 'border-box', marginTop: '1px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music2Icon size={30} color="yellow"/> 1000 TL VE ALTI FIRSATLAR 🏷️
          </h3>
          <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: '#1a1a1a', fontSize: '0.85rem' }}>Öğrenci ve koleksiyoner dostu uygun fiyatlar</p>
        </div>

        {/* YÖN OKLARI */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={slideFirsatLeft} style={{ border: '3px solid #1a1a1a', backgroundColor: 'white', padding: '6px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
            <ChevronLeft size={20} color="#1a1a1a" />
          </button>
          <button onClick={slideFirsatRight} style={{ border: '3px solid #1a1a1a', backgroundColor: '#1a1a1a', padding: '6px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
            <ChevronRight size={20} color="white" />
          </button>
        </div>
      </div>

      {/* SLIDER İÇERİĞİ */}
      <div 
        ref={firsatSliderRef}
        style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '10px', scrollbarWidth: 'none' }}
      >
        {firsatPlaklari.map(plak => {
          const pId = plak._id || plak.id;
          const isFav = favorites.some(f => (f._id || f.id) === pId);

          return (
            <div key={`firsat-${pId}`} style={{ minWidth: '240px', maxWidth: '240px', backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '12px', boxShadow: '4px 4px 0px #1a1a1a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <button 
                onClick={() => toggleFavorite(plak)}
                style={{ position: 'absolute', top: '18px', right: '18px', background: 'white', border: '2px solid #1a1a1a', borderRadius: '50%', padding: '5px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Heart size={16} fill={isFav ? "#ff4d4d" : "none"} color={isFav ? "#ff4d4d" : "#1a1a1a"} />
              </button>

              <Link to={`/product/${pId}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <div
                  className="brutal-img-container"
                  style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', borderBottom: '3px solid #1a1a1a', backgroundColor: '#f0f0f0', marginBottom: '10px' }}>
                  <img 
                    src={plak.resim} 
                    alt={plak.ad} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.dataset.fallback = "true";
                        e.target.src = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500';
                      }
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                 {/* TÜKENDİ ROZETİ */}
      {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: '2px solid #1a1a1a',
            padding: '4px 12px',
            fontWeight: '900',
            fontSize: '1.1rem',
            boxShadow: '2px 2px 0px #1a1a1a'
          }}
        >
          TÜKENDİ
        </span>
      )}

                </div>
                <h4 style={{ margin: '0 0 3px 0', fontSize: '1.1rem', textTransform: 'uppercase', lineHeight: '1.2' }}>{plak.ad}</h4>
                <p style={{ color: '#666', margin: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>{plak.sanatci}</p>
              </Link>
            {/* 3. DİNAMİK BUTON (STOK VARSA SEPETE EKLE / BİTTİYSE GELİNCE HABER VER) */}
      <div style={{  marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
      <span style={{ fontWeight: 'black', fontSize: '1.1rem' }}>{plak.fiyat} TL</span>
  {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        alert(`"${plak.ad}" stoğa girdiğinde size haber vereceğiz! 🔔`);
      }}
      className="brutal-btn"
      style={{
      backgroundColor: '#306a04', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem'
      }}
    >
      <Bell size={22} color="yellow" />
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        sepeteEkle(plak);
        e.stopPropagation();
        handleAddToCart(plak);
      }}
      className="brutal-btn"
      style={{
         backgroundColor: '#06d6a0', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem'
      }}
    >
      <ShoppingCart size={22} color="black" /> +
    </button>
  )}
</div>
            </div>
          );
        })}
      </div>
    </div>
  );
})()}
                
{/* SLIDER: METAL EFSANELERİ */}
{(() => {
  // Manuel olarak öne çıkarmak istediğin plakların tam adları:
  const secilenPlaklar = ['Rust In Peace', 'Master of Puppets', 'Meteora', 'Ride The Lightning', 'Metallica', 'Hybrid Theory', 'Load'];
  const editorListesi = (plaklar || []).filter(p => secilenPlaklar.includes(p.ad));

  return (
    <div className="brutal-card" style={{ backgroundColor: 'black', border: '4px solid #1a1a1a', padding: '20px', boxShadow: '6px 6px 0px #1a1a1a', width: '100%', boxSizing: 'border-box', marginTop: '0px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <div>
          <h3 style={{ color: 'white', margin: 0, fontSize: '1.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music2Icon size={30} color="white"/> METAL EFSANELERİ <LucideHandMetal size={22} color="white" /> 
          </h3>
          <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: 'white', fontSize: '0.85rem' }}>Özel olarak seçilmiş plaklar</p>
        </div>

        {/* YÖN OKLARI */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={slideMetalLeft} style={{ border: '3px solid #1a1a1a', backgroundColor: 'white', padding: '6px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
            <ChevronLeft size={20} color="#1a1a1a" />
          </button>
          <button onClick={slideMetalRight} style={{ border: '3px solid #1a1a1a', backgroundColor: '#1a1a1a', padding: '6px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
            <ChevronRight size={20} color="white" />
          </button>
        </div>
      </div>

      {/* SLIDER İÇERİĞİ */}
      <div 
        ref={metalSliderRef}
        style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '10px', scrollbarWidth: 'none' }}
      >
        {editorListesi.map(plak => {
          const pId = plak._id || plak.id;
          const isFav = favorites.some(f => (f._id || f.id) === pId);

          return (
            <div key={`editor-${pId}`} style={{ minWidth: '240px', maxWidth: '240px', backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '12px', boxShadow: '4px 4px 0px #1a1a1a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <button 
                onClick={() => toggleFavorite(plak)}
                style={{ position: 'absolute', top: '18px', right: '18px', background: 'white', border: '2px solid #1a1a1a', borderRadius: '50%', padding: '5px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Heart size={16} fill={isFav ? "#ff4d4d" : "none"} color={isFav ? "#ff4d4d" : "#1a1a1a"} />
              </button>

              <Link to={`/product/${pId}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <div
                  className="brutal-img-container"
                  style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', borderBottom: '3px solid #1a1a1a', backgroundColor: '#f0f0f0', marginBottom: '10px' }}>
                  <img 
                    src={plak.resim} 
                    alt={plak.ad} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.dataset.fallback = "true";
                        e.target.src = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500';
                      }
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                 {/* TÜKENDİ ROZETİ */}
      {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: '2px solid #1a1a1a',
            padding: '4px 12px',
            fontWeight: '900',
            fontSize: '1.1rem',
            boxShadow: '2px 2px 0px #1a1a1a'
          }}
        >
          TÜKENDİ
        </span>
      )}

                </div>
                <h4 style={{ margin: '0 0 3px 0', fontSize: '1.1rem', textTransform: 'uppercase', lineHeight: '1.2' }}>{plak.ad}</h4>
                <p style={{ color: '#666', margin: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>{plak.sanatci}</p>
              </Link>
              {/* 3. DİNAMİK BUTON (STOK VARSA SEPETE EKLE / BİTTİYSE GELİNCE HABER VER) */}
      <div style={{  marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
      <span style={{ fontWeight: 'black', fontSize: '1.1rem' }}>{plak.fiyat} TL</span>
  {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        alert(`"${plak.ad}" stoğa girdiğinde size haber vereceğiz! 🔔`);
      }}
      className="brutal-btn"
      style={{
      backgroundColor: '#306a04', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem'
      }}
    >
      <Bell size={22} color="yellow" />
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        sepeteEkle(plak);
        e.stopPropagation();
        handleAddToCart(plak);
      }}
      className="brutal-btn"
      style={{
         backgroundColor: 'black', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem', color:"white"
      }}
    >
      <ShoppingCart size={22} color="white" /> +
    </button>
  )}
</div>
            </div>
          );
        })}
      </div>
    </div>
  );
})()}


{/* SLIDER: TÜRKÇE POP KRALİÇELERİ */}
{(() => {
  // Manuel olarak öne çıkarmak istediğin plakların tam adları:
  const secilenPlaklar = [ 'Gülümse','Beni Durdursan Mı?','Selam Söyle', 'Handeye Neler Oluyor?', 'Of Of', 'Öptüm', 'Nilüfer LP'];
  const editorListesi = (plaklar || []).filter(p => secilenPlaklar.includes(p.ad));

  return (
    <div className="brutal-card" style={{ backgroundColor: '#7e1818', border: '4px solid #1a1a1a', padding: '20px', boxShadow: '6px 6px 0px #1a1a1a', width: '100%', boxSizing: 'border-box', marginTop: '0px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', color:'white'}}>
            <Music2Icon size={30} color="yellow"/> TÜRKÇE POP KRALİÇELERİ <ChessQueenIcon size={22} color="yellow" /> 
          </h3>
          <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: '#fff1f1', fontSize: '0.85rem' }}>Özel olarak seçilmiş plaklar</p>
        </div>

        {/* YÖN OKLARI */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={slidePopLeft} style={{ border: '3px solid #1a1a1a', backgroundColor: 'white', padding: '6px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
            <ChevronLeft size={20} color="#1a1a1a" />
          </button>
          <button onClick={slidePopRight} style={{ border: '3px solid #1a1a1a', backgroundColor: '#1a1a1a', padding: '6px 10px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' }}>
            <ChevronRight size={20} color="white" />
          </button>
        </div>
      </div>

      {/* SLIDER İÇERİĞİ */}
      <div 
        ref={popSliderRef}
        style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '10px', scrollbarWidth: 'none' }}
      >
        {editorListesi.map(plak => {
          const pId = plak._id || plak.id;
          const isFav = favorites.some(f => (f._id || f.id) === pId);

          return (
            <div key={`editor-${pId}`} style={{ minWidth: '240px', maxWidth: '240px', backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '12px', boxShadow: '4px 4px 0px #1a1a1a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <button 
                onClick={() => toggleFavorite(plak)}
                style={{ position: 'absolute', top: '18px', right: '18px', background: 'white', border: '2px solid #1a1a1a', borderRadius: '50%', padding: '5px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Heart size={16} fill={isFav ? "#ff4d4d" : "none"} color={isFav ? "#ff4d4d" : "#1a1a1a"} />
              </button>

              <Link to={`/product/${pId}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <div
                  className="brutal-img-container"
                  style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', borderBottom: '3px solid #1a1a1a', backgroundColor: '#f0f0f0', marginBottom: '10px' }}>
                  <img 
                    src={plak.resim} 
                    alt={plak.ad} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.dataset.fallback = "true";
                        e.target.src = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500';
                      }
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {/* TÜKENDİ ROZETİ */}
      {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: '2px solid #1a1a1a',
            padding: '4px 12px',
            fontWeight: '900',
            fontSize: '1.1rem',
            boxShadow: '2px 2px 0px #1a1a1a'
          }}
        >
          TÜKENDİ
        </span>
      )}
                </div>
                <h4 style={{ margin: '0 0 3px 0', fontSize: '1.1rem', textTransform: 'uppercase', lineHeight: '1.2' }}>{plak.ad}</h4>
                <p style={{ color: '#666', margin: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>{plak.sanatci}</p>
              </Link>
            {/* 3. DİNAMİK BUTON (STOK VARSA SEPETE EKLE / BİTTİYSE GELİNCE HABER VER) */}
      <div style={{  marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
      <span style={{ fontWeight: 'black', fontSize: '1.1rem' }}>{plak.fiyat} TL</span>
  {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        alert(`"${plak.ad}" stoğa girdiğinde size haber vereceğiz! 🔔`);
      }}
      className="brutal-btn"
      style={{
      backgroundColor: '#306a04', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem'
      }}
    >
      <Bell size={22} color="yellow" />
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        sepeteEkle(plak);
        e.stopPropagation();
        handleAddToCart(plak);
      }}
      className="brutal-btn"
      style={{
         backgroundColor: '#7e1818', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem'
      }}
    >
      <ShoppingCart size={22} color="black" /> +
    </button>
  )}
</div>
            </div>
          );
        })}
      </div>
    </div>
  );
                    })()}

{!tumPlaklariGoster && (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
    <button
      onClick={() => {
        setTumPlaklariGoster(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      style={{
        backgroundColor: '#ffd166',
        color: '#1a1a1a',
        border: '4px solid #1a1a1a',
        padding: '16px 32px',
        fontSize: '1.2rem',
        fontWeight: '900',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '6px 6px 0px #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <span><Music4Icon size={22} color="black" /></span>
                          
      <span>TÜM PLAKLARI VE ARŞİVİ GÖR</span>
      <span>→</span>
    </button>
  </div>
)}

                    </>
)} 

          {/* SADECE tumPlaklariGoster TRUE OLDUĞUNDA GÖZÜKÜR */}
                {tumPlaklariGoster && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px', marginTop: '20px' }}>
                    {filtrelenmisPlaklar.map(plak => {
                      const pId = plak._id || plak.id;
                      const isFav = favorites.some(f => (f._id || f.id) === pId);

                      return (
                        <div key={pId} className="brutal-card" style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '15px', boxShadow: '6px 6px 0px #1a1a1a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                          <button
                            onClick={() => toggleFavorite(plak)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: '2px solid #1a1a1a', borderRadius: '50%', padding: '6px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Heart size={18} fill={isFav ? "#ff4d4d" : "none"} color={isFav ? "#ff4d4d" : "#1a1a1a"} />
                          </button>

                          <Link to={`/product/${pId}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                            {/* BÜYÜTÜLMÜŞ GÖRSEL ALANI (280px) */}
                            <div
                              className="brutal-img-container"
                              style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden', borderBottom: '3px solid #1a1a1a', backgroundColor: '#f0f0f0', marginBottom: '10px' }}>
                              <img
                                src={plak.resim || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=600'}
                                alt={plak.ad}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  if (!e.target.dataset.fallback) {
                                    e.target.dataset.fallback = "true";
                                    e.target.src = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500';
                                  }
                                }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                             {/* TÜKENDİ ROZETİ */}
      {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: '2px solid #1a1a1a',
            padding: '4px 12px',
            fontWeight: '900',
            fontSize: '1.1rem',
            boxShadow: '2px 2px 0px #1a1a1a'
          }}
        >
          TÜKENDİ
        </span>
      )}
                            </div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', textTransform: 'uppercase' }}>{plak.ad}</h3>
                            <p style={{ color: '#666', margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{plak.sanatci}</p>
                          </Link>
                         {/* 3. DİNAMİK BUTON (STOK VARSA SEPETE EKLE / BİTTİYSE GELİNCE HABER VER) */}
      <div style={{  marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
      <span style={{ fontWeight: 'black', fontSize: '1.1rem' }}>{plak.fiyat} TL</span>
  {Number(plak?.stok ?? plak?.stock ?? plak?.adet ?? 0) <= 0 ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        alert(`"${plak.ad}" stoğa girdiğinde size haber vereceğiz! 🔔`);
      }}
      className="brutal-btn"
      style={{
      backgroundColor: '#06d6a0', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '0.85rem'
      }}
    >
      <Bell size={22} color="yellow" />
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        sepeteEkle(plak);
        e.stopPropagation();
        handleAddToCart(plak);
      }}
      className="brutal-btn"
      style={{
        backgroundColor: '#ff9e00', border: '2px solid #1a1a1a', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a' 
      }}
    >
    SEPETE EKLE
    </button>
  )}
</div>
                         
                        </div>
                      );
                    })}
                  </div>
                )}</div>
  
  } />  
                              

            <Route path="/product/:id" element={<ProductDetail  plaklar={plaklar} sepeteEkle={sepeteEkle} isLoggedIn={isLoggedIn} favorites={favorites} toggleFavorite={toggleFavorite} />} />
            <Route path="/admin" element={<AdminPage />} />
            
 <Route 
  path="/account" 
  element={<AccountPage user={user} setUser={setUser} />} 
/>
            <Route 
  path="/profile" 
  element={<Navigate to="/account" replace />} 
/>

            <Route 
  path="/campaigns" 
  element={
    <CampaignsPage 
      kampanyalar={kampanyalar} 
      setSelectedKampanya={setSelectedKampanya} 
    />
  } 
/>
            
             {/* FAVORİLER */}
<Route
  path="/favorites"
  element={
    <div style={{ padding: '20px', border: '4px solid #1a1a1a', backgroundColor: 'white', boxShadow: '10px 10px 0px #1a1a1a' }}>
      <h2 style={{ borderBottom: '3px solid #1a1a1a', paddingBottom: '10px', textTransform: 'uppercase' }}>
        FAVORİ PLAKLARIM ({favorites.length})
      </h2>
      
      {favorites.length === 0 ? (
        <p style={{ fontWeight: 'bold', padding: '20px 0' }}>Henüz favorilere bir plak eklemediniz. ❤️</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {favorites.filter(Boolean).map((plak) => {
  const pId = plak._id || plak.id;

  // 1. Ana ürün listesinden bu plağın GÜNCEL/CANLI verisini bul
  const guncelPlak = (typeof plaklar !== 'undefined' ? plaklar : []).find(p => 
    (p?._id && pId && p._id.toString() === pId.toString()) ||
    (p?.id && pId && p.id.toString() === pId.toString()) ||
    (p?.ad && plak?.ad && p.ad.trim().toLowerCase() === plak.ad.trim().toLowerCase())
  ) || plak;

  // 2. Canlı stoğu kontrol et
  const stokMiktari = Number(guncelPlak?.stok ?? guncelPlak?.stock ?? guncelPlak?.adet ?? 0);
  const stokBittiMi = stokMiktari <= 0;

  return (
    <div 
      key={pId || Math.random()} 
      style={{ border: '3px solid #1a1a1a', padding: '12px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #1a1a1a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
  
      {/* Plak Detay Linki */}
      <Link to={`/product/${pId}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div
          className="brutal-img-container"
          style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', borderBottom: '3px solid #1a1a1a', backgroundColor: '#f0f0f0', marginBottom: '10px' }}
        > {/* FAVORİLERDEN ÇIKAR BUTONU (Sağ Üst Köşe) */}
                <button
                  type="button"
                  title="Favorilerden Kaldır"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(guncelPlak);
                  }}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    zIndex: 10,
                    color: 'black',
                    backgroundColor: '#ff4f4f',
                    border: '2px solid #1a1a1a',
                    fontWeight: 'black',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
          <img 
            src={guncelPlak.resim || plak.resim} 
            alt={guncelPlak.ad || plak.ad} 
            referrerPolicy="no-referrer"
            onError={(e) => {
              if (!e.target.dataset.fallback) {
                e.target.dataset.fallback = "true";
                e.target.src = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500';
              }
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          {stokBittiMi && (
            <span style={{ position: 'absolute', top: '8px', left: '5px', backgroundColor: '#ff4d4d', color: 'white', border: '2px solid #1a1a1a', padding: '4px 12px', fontWeight: '900', fontSize: '1.0rem' }}>
              TÜKENDİ
            </span>
          )}
        </div>
        <h4 style={{ margin: '0 0 3px 0', fontSize: '1.05rem', textTransform: 'uppercase', lineHeight: '1.2' }}>{guncelPlak.ad || plak.ad}</h4>
        <p style={{ color: '#666', margin: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>{guncelPlak.sanatci || plak.sanatci}</p>
        <div style={{ fontWeight: 'black', margin: '8px 0', fontSize: '1.1rem' }}>{guncelPlak.fiyat || plak.fiyat} TL</div>
      </Link>

      {/* Dinamik Buton */}
      <div style={{ marginTop: '8px' }}>
        {stokBittiMi ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              alert(`"${guncelPlak.ad || plak.ad}" stoğa girdiğinde size haber vereceğiz! 🔔`);
            }}
            className="brutal-btn"
            style={{
              width: '100%',
              backgroundColor: '#008500',
              color: 'white',
              border: '2px solid #1a1a1a',
              padding: '8px 10px',
              fontWeight: '900',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #1a1a1a',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Bell size={16} color="yellow"/> GELİNCE HABER VER
          </button>
        ) : (
            <button
            type="button"
            onClick={(e) => {
                sepeteEkle(guncelPlak)
              e.stopPropagation();
              if (typeof handleAddToCart === 'function') handleAddToCart(guncelPlak);
            }}
            className="brutal-btn"
            style={{
              width: '100%',
              backgroundColor: '#ff9e00',
              color: '#1a1a1a',
              border: '2px solid #1a1a1a',
              padding: '8px 10px',
              fontWeight: '900',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #1a1a1a',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShoppingCart size={16} color="#1a1a1a"/> SEPETE EKLE
          </button>
        )}
      </div>

    </div>
  );
})}
        </div>
      )}

      <Link to="/" style={{ display: 'inline-block', marginTop: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>
        ← Alışverişe Dön
      </Link>
    </div>
  }
/>

            
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
              <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '40px', boxShadow: '12px 12px 0px #ff9e00', width: '60%', margin: '40px auto' }}>
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

  // İsmi data veya data.user içindeki tüm olası alanlardan yakala
  const kullaniciAdi = 
    data.name || 
    data.adSoyad || 
    data.ad || 
    data.user?.name || 
    data.user?.adSoyad || 
    data.user?.ad || 
    'Kullanıcı';

  alert(`Hoş geldin, ${kullaniciAdi}! 💿`);
  window.location.href = "/";
} catch (error) {
  alert(error.response?.data?.message || "Giriş hatası! Lütfen bilgilerinizi kontrol edin.");
}

                }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <label style={{ fontWeight: 'bold' }}>E-POSTA</label>
                  <input required name="email" type="email" placeholder="ornek@mail.com" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  
                  <label style={{ fontWeight: 'bold' }}>ŞİFRE</label>
                  <input required name="sifre" type="password" placeholder="******" style={{ padding: '12px', border: '3px solid #1a1a1a', outline: 'none' }} />
                  {/* Şifre Inputunun Altına: */}
<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
  <button
    type="button"
    onClick={() => {
      const email = prompt("Şifre sıfırlama bağlantısı için kayıtlı e-posta adresinizi girin:");
      if (email) {
        // Backend'e şifre sıfırlama isteği gönder
        API.post('/users/forgot-password', { email })
          .then(() => alert("Şifre sıfırlama talimatları e-posta adresinize gönderildi! 📬"))
          .catch(() => alert("Bu e-posta adresine ait bir hesap bulunamadı."));
      }
    }}
    style={{
      background: 'none',
      border: 'none',
      color: '#1a1a1a',
      fontWeight: 'bold',
      fontSize: '0.8rem',
      textDecoration: 'underline',
      cursor: 'pointer',
      padding: '0'
    }}
  >
    Şifremi Unuttum?
  </button>
</div>
                  
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
              <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '40px', boxShadow: '12px 12px 0px #ff9e00', width: '60%', margin: '40px auto' }}>
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
      
{/* 🎁 KAMPANYA DETAY MODAL (YÖNLENDİRME BUTONLU) */}
{selectedKampanya && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
  }}>
    <div style={{
      backgroundColor: selectedKampanya.renk || '#ff9e00',
      border: '4px solid #1a1a1a',
      boxShadow: '12px 12px 0px #1a1a1a',
      padding: '30px',
      maxWidth: '480px',
      width: '100%',
      position: 'relative'
    }}>
      {/* SAĞ ÜST KAPAT X BUTONU */}
      <button 
        onClick={() => setSelectedKampanya(null)}
        style={{
          position: 'absolute', top: '15px', right: '15px',
          backgroundColor: '#1a1a1a', color: 'white', border: '2px solid white',
          fontWeight: 'black', padding: '5px 10px', cursor: 'pointer'
        }}
      >
        ✕
      </button>

      <span style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '4px 10px', fontWeight: 'black', fontSize: '0.8rem', border: '1px solid white' }}>
        KAMPANYA DETAYI ⚡
      </span>

      <h2 style={{ fontSize: '2rem', margin: '15px 0 10px 0', textTransform: 'uppercase', lineHeight: '1.1' }}>
        {selectedKampanya.baslik}
      </h2>

      <p style={{ fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '20px', color: '#1a1a1a' }}>
        {selectedKampanya.detay}
      </p>

      {/* İNDİRİM KODU ALANI */}
      {selectedKampanya.kod && (
        <div style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '12px', textAlign: 'center', boxShadow: '4px 4px 0px #1a1a1a', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', color: '#666' }}>İNDİRİM KODUNUZ:</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 'black', letterSpacing: '2px', color: '#1a1a1a' }}>{selectedKampanya.kod}</span>
        </div>
      )}

      {/* 🚀 AKILLI YÖNLEDİRME BUTONLARI */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {selectedKampanya.kategori && (
          <button 
            onClick={() => {
              setActiveCategory(selectedKampanya.kategori); // Kategori filtresini aktifleştirir
              setSelectedKampanya(null); // Modalı kapatır
            }}
            className="brutal-btn"
            style={{
              width: '100%', backgroundColor: '#1a1a1a', color: 'white',
              border: '3px solid #1a1a1a', padding: '14px', fontWeight: 'black',
              cursor: 'pointer', fontSize: '1rem', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <span> {selectedKampanya.kategori.toUpperCase()} PLAKLARINI İNCELE</span>
            <span>→</span>
          </button>
        )}

        <button 
          onClick={() => setSelectedKampanya(null)}
          style={{
            width: '100%', backgroundColor: 'transparent', color: '#1a1a1a',
            border: '2px solid #1a1a1a', padding: '8px', fontWeight: 'bold',
            cursor: 'pointer', fontSize: '0.85rem'
          }}
        >
          Kapat
        </button>
      </div>

    </div>
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
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [aramaMetni, setAramaMetni] = useState('');
  const [sirallama, setSirallama] = useState('varsayilan');
  const [favorites, setFavorites] = useState(() => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const storageKey = user ? `user_favorites_${user._id || user.id}` : 'guest_favorites';
  const kayitli = localStorage.getItem(storageKey);
  return kayitli ? JSON.parse(kayitli) : [];
});

// 2. Kullanıcı Giriş Yaptığında veya Sayfa Yüklendiğinde DB'den Çek
useEffect(() => {
  const syncFavorites = async () => {
    const rawUser = localStorage.getItem('user');
    const currentUser = rawUser ? JSON.parse(rawUser) : null;
    const token = localStorage.getItem('token') || currentUser?.token;

    if (token && currentUser) {
      try {
        // Backend'den kullanıcının GERÇEK favorilerini al
        const { data } = await API.get('/users/profile');
        if (data && data.favorites) {
          const userFavs = data.favorites;
          setFavorites(userFavs);
          localStorage.setItem(`user_favorites_${currentUser._id || currentUser.id}`, JSON.stringify(userFavs));
        }
      } catch (err) {
        console.error("Favoriler yüklenemedi:", err);
      }
    } else {
      // Misafir modundaysa sadece misafirin yerel verisini yükle
      const guestFavs = JSON.parse(localStorage.getItem('guest_favorites') || '[]');
      setFavorites(guestFavs);
    }
  };

  syncFavorites();
}, [isLoggedIn]); // 
 
  const [kampanyalar, setKampanyalar] = useState([]); // 👈 Sabit dizi silindi, boş başlatıldı

  const handleLogout = () => {
  alert('Başarıyla çıkış yapıldı.');
  window.location.href = "/";
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setIsLoggedIn(false);
  setUser(null);
  const guestFavs = JSON.parse(localStorage.getItem('guest_favorites') || '[]');
  setFavorites(guestFavs);
};
  
  const [uygulananIndirim, setUygulananIndirim] = useState(0);
  const [kuponMesaji, setKuponMesaji] = useState('');

 const toggleFavorite = async (plak) => {
  const plakId = plak._id || plak.id;
  const token = localStorage.getItem('token') || (JSON.parse(localStorage.getItem('user') || '{}')).token;
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  // Güncel state hesabı
  let yeniFavoriler = [];
  setFavorites(prev => {
    const varMi = prev.some(f => (f._id || f.id) === plakId);
    yeniFavoriler = varMi 
      ? prev.filter(f => (f._id || f.id) !== plakId) 
      : [...prev, plak];

    // Oturum açıksa kullanıcının storage'ına, kapalıysa misafir storage'ına yaz
    if (currentUser) {
      localStorage.setItem(`user_favorites_${currentUser._id || currentUser.id}`, JSON.stringify(yeniFavoriler));
    } else {
      localStorage.setItem('guest_favorites', JSON.stringify(yeniFavoriler));
    }

    return yeniFavoriler;
  });

  // Kullanıcı giriş yapmışsa SADECE kendi hesabının veritabanına kaydet
  if (token) {
    try {
      await API.put('/users/favorites', { 
        plakId: plakId 
      });
    } catch (err) {
      console.error("Favori veritabanına kaydedilemedi:", err);
    }
  }
};
  // 2. Kullanıcı giriş yapmışsa veritabanına da kaydet
    


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

  /* BANNER SLIDE DÖNGÜSÜ (4 saniyede bir kampanya değişir) */
useEffect(() => {
  if (!kampanyalar || kampanyalar.length === 0) return;

  const timer = setInterval(() => {
    // Slaytı bir sonraki kampanyaya kaydırır
    setCurrentSlide((prev) => (prev + 1) % kampanyalar.length);
  }, 3000);

  return () => clearInterval(timer);
}, [kampanyalar]);
  
  // Kampanyaları Backend'den Çekme Fonksiyonu
const fetchKampanyalar = async () => {
  try {
    const { data } = await API.get('/campaigns'); // backend/routes/campaignRoutes.js'e istek atar
    setKampanyalar(data);
  } catch (error) {
    console.error("Kampanyalar yüklenemedi:", error);
  }
};

// Sayfa ilk açıldığında çalıştır
useEffect(() => {
  fetchKampanyalar();
}, []);
  

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