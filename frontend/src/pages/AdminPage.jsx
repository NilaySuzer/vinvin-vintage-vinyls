import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { MessageSquareQuote, PlusCircle, Trash2, Package, Disc, ShoppingBag, Tag, Plus, Check, X, RefreshCw, User2Icon } from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'campaigns'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kampanya State'leri
  const [kampanyalar, setKampanyalar] = useState([]);
  const [yeniKampanya, setYeniKampanya] = useState({ baslik: '', detay: '', renk: '#ff9e00', kod: '', kategori: 'Tümü', sonTarih: '' , indirimYuzdesi: 10});
  const [showCampaignForm, setShowCampaignForm] = useState(false);

  // Yeni Ürün State
  const [yeniPlak, setYeniPlak] = useState({
    ad: '', sanatci: '', fiyat: '', kategori: 'Rock', stok: 10, resim: '',
  });

  const [allPlaklar, setAllPlaklar] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bildirimBaslik, setBildirimBaslik] = useState('');
  const [bildirimMesaj, setBildirimMesaj] = useState('');
  // --- VERİ ÇEKME FONKSİYONLARI ---
  // AdminPage.jsx içine eklenecek düzenleme formu:
const [duzenlenecekPlak, setDuzenlenecekPlak] = useState(null);

    const fetchFeedbacks = async () => {
      try {
        const { data } = await API.get('/feedbacks');
        setFeedbacks(data || []);
      } catch (err) {
        console.error("Görüşler yüklenemedi", err);
      }
    };

    const handleDelete = async (id) => {
      if (!window.confirm("Bu mesajı silmek istiyor musunuz?")) return;
      try {
        await API.delete(`/feedbacks/${id}`);
        setFeedbacks(feedbacks.filter(f => f._id !== id));
      } catch (err) {
        alert("Silinemedi.");
      }
    };
  

const fetchAllPlaklar = async () => {
  try {
    const { data } = await API.get('/products'); // veya senin plakları çektiğin endpoint (/plaklar)
    setAllPlaklar(data || []);
  } catch (err) {
    console.error("Plaklar çekilemedi:", err);
  }
};

  // Ürünleri ve Siparişleri Çek
  const fetchAdminData = async () => {
    try {
      const prodRes = await API.get('/products');
      setProducts(prodRes.data || []);

      const orderRes = await API.get('/orders/admin/all');
      setOrders(orderRes.data || []);
    } catch (error) {
      console.error("Admin verileri çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  // Kampanyaları Çek
  const fetchAdminKampanyalar = async () => {
    try {
      const { data } = await API.get('/campaigns/admin');
      setKampanyalar(data || []);
    } catch (err) {
      console.error("Kampanya yükleme hatası", err);
    }
  };

   // Kampanya Ekleme
const handleAddCampaign = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      baslik: yeniKampanya.baslik,
      detay: yeniKampanya.detay,
      renk: yeniKampanya.renk,
      kod: yeniKampanya.kod,
      hedefKategori: yeniKampanya.kategori,
      kategori: yeniKampanya.kategori,
      bitisTarihi: yeniKampanya.sonTarih,
      sonTarih: yeniKampanya.sonTarih,
      indirimYuzdesi: Number(yeniKampanya.indirimYuzdesi) || 10
    };

    await API.post('/campaigns', payload);
    alert('Kampanya başarıyla eklendi! 🎉');
    setShowCampaignForm(false);
    setYeniKampanya({ baslik: '', detay: '', renk: '#ff9e00', kod: '', kategori: 'Tümü', sonTarih: '', indirimYuzdesi: 10 });
    fetchAdminData();
  } catch (err) {
    console.error('Kampanya ekleme hatası:', err);
    alert(err.response?.data?.message || 'Kampanya eklenemedi.');
  }
};

// Durum Açma/Kapatma (Toggle)
// Aktif / Pasif Değiştirme (Toggle)
const handleToggleActive = async (id) => {
  try {
    const { data } = await API.patch(`/campaigns/${id}/toggle`);
    
    // Kampanyalar listesini yerel state üzerinde anında güncelle
    setKampanyalar(prev => prev.map(k => {
      if ((k._id || k.id) === id) {
        const yeniAktiflik = data.aktif !== undefined ? data.aktif : data.isAktif;
        return { ...k, aktif: yeniAktiflik, isAktif: yeniAktiflik };
      }
      return k;
    }));

    // Varsa genel çekme fonksiyonunu da tetikle
    if (typeof fetchAdminData === 'function') fetchAdminData();
    if (typeof fetchCampaigns === 'function') fetchCampaigns();
  } catch (err) {
    console.error('Durum değiştirme hatası:', err);
    alert('Kampanya durumu değiştirilemedi: ' + (err.response?.data?.message || err.message));
  }
};

  // Sayfa İlk Açıldığında Hepsini Çek
  useEffect(() => {
    fetchAdminData();
    fetchAdminKampanyalar();
    fetchAllPlaklar(); // Tüm plakları çek
    fetchFeedbacks(); // Tüm görüşleri çek
  }, []);

  // --- ÜRÜN İŞLEMLERİ ---

  // Yeni Plak Ekleme
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const gonderilecekVeri = {
        ad: yeniPlak.ad,
        sanatci: yeniPlak.sanatci,
        fiyat: Number(yeniPlak.fiyat),
        stok: Number(yeniPlak.stok || 10),
        kategori: yeniPlak.kategori || 'Rock',
        resim: yeniPlak.resim || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500',
      };

      await API.post('/products', gonderilecekVeri);
      alert("Yeni plak dükkana başarıyla eklendi! 💿");
      setYeniPlak({ ad: '', sanatci: '', fiyat: '', kategori: 'Rock', stok: 10, resim: '' });
      fetchAdminData();
    } catch (error) {
      console.error("Ekleme Hatası:", error.response?.data);
      alert(error.response?.data?.message || "Ürün eklenirken hata oluştu!");
    }
  };

  // Plak Silme
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bu plağı dükkandan silmek istediğinize emin misiniz?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => (p._id || p.id) !== id));
      alert("Plak silindi.");
    } catch (error) {
      alert("Silme hatası!");
    }
  };

  // Stok Güncelle (DÜZELTİLDİ: fetchAll yerine fetchAdminData çağrıldı)
  const handleStockUpdate = async (id, yeniStok) => {
    try {
      await API.patch(`/products/${id}/stock`, { stok: Number(yeniStok) });
      alert('Stok güncellendi! 📦');
      fetchAdminData();
    } catch (err) {
      alert('Stok güncellenemedi.');
    }
  };



  // --- SİPARİŞ İŞLEMLERİ ---

  // Sipariş Durumu Güncelleme
  const handleUpdateOrderStatus = async (orderId, durum) => {
    try {
      await API.put(`/orders/admin/${orderId}/status`, { durum });
      alert(`Sipariş durumu '${durum}' olarak güncellendi.`);
      fetchAdminData();
    } catch (error) {
      alert("Durum güncellenirken hata oluştu.");
    }
  };

  // --- KAMPANYA İŞLEMLERİ ---

  
  const handleSendGlobalNotification = async (e) => {
  e.preventDefault();
  try {
    await API.post('/notifications/send-global', {
      baslik: bildirimBaslik,
      mesaj: bildirimMesaj,
      tur: 'kampanya'
    });
    alert('📢 Duyuru tüm kullanıcılara başarıyla iletildi!');
    setBildirimBaslik('');
    setBildirimMesaj('');
  } catch (err) {
    alert('Bildirim gönderilirken hata oluştu.');
  }
};

  return (
    <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '30px', boxShadow: '12px 12px 0px #1a1a1a' }}>
      
      {/* ADMİN BAŞLIK */}
      <div style={{ borderBottom: '4px solid #1a1a1a', paddingBottom: '20px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2.2rem', textTransform: 'uppercase' }}>ADMIN YÖNETİM PANELİ</h2>
          <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#666' }}>VinVin Vintage Vinyls Mağaza Kontrol Merkezi</p>
        </div>
        <button 
          onClick={() => { fetchAdminData(); fetchAdminKampanyalar(); }} 
          className="brutal-btn" 
          style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '10px 16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={18} /> YENİLE
        </button>
      </div>

      {/* SEKMELER */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('products')} 
          className="brutal-btn"
          style={{ flex: 1, minWidth: '180px', padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'products' ? '#ff9e00' : 'white', fontWeight: 'bold', fontsize: '1.1rem',cursor: 'pointer', boxShadow: activeTab === 'products' ? '5px 5px 0px #1a1a1a' : 'none' }}
        >
          PLAK KATALOĞU & STOK ({products.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('campaigns')} 
          className="brutal-btn"
          style={{ flex: 1, minWidth: '180px', padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'campaigns' ? '#ff9e00' : 'white', fontWeight: 'bold', fontsize: '1.1rem', cursor: 'pointer', boxShadow: activeTab === 'campaigns' ? '5px 5px 0px #1a1a1a' : 'none' }}
        >
          KAMPANYALAR & KUPONLAR ({kampanyalar.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('orders')} 
          className="brutal-btn"
          style={{ flex: 1, minWidth: '180px', padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'orders' ? '#ff9e00' : 'white', fontWeight: 'bold', fontsize: '1.1rem', cursor: 'pointer', boxShadow: activeTab === 'orders' ? '5px 5px 0px #1a1a1a' : 'none' }}
        >
           MÜŞTERİ SİPARİŞLERİ ({orders.length})
        </button>
          <button
  type="button"
  onClick={() => setActiveTab('notifications')}
  className="brutal-btn"
  style={{ flex: 1, minWidth: '180px', padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'notifications' ? '#ff9e00' : 'white', fontWeight: 'bold', fontsize: '1.1rem', cursor: 'pointer', boxShadow: activeTab === 'notifications' ? '5px 5px 0px #1a1a1a' : 'none' }}
>
  BİLDİRİM GÖNDER ({notifications.length})
        </button>

        <button
  type="button"
  onClick={() => setActiveTab('feedbacks')}
  className="brutal-btn"
  style={{ flex: 1, minWidth: '180px', padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'feedbacks' ? '#ff9e00' : 'white', fontWeight: 'bold', fontsize: '1.1rem', cursor: 'pointer', boxShadow: activeTab === 'feedbacks' ? '5px 5px 0px #1a1a1a' : 'none' }}
>
  GÖRÜŞ & ÖNERİLER ({feedbacks.length})
        </button>
      </div>

      {/* SEKME 1: PLAKLARI YÖNET VE YENİ EKLE */}
      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          
          {/* YENİ ÜRÜN EKLEME FORMU */}
          <form onSubmit={handleAddProduct} style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '15px', height: 'fit-content' }}>
            <h3 style={{ margin: 0, borderBottom: '2px solid #1a1a1a', paddingBottom: '8px', textTransform: 'uppercase' }}>Yeni Plak Ekle</h3>
            
            <input required placeholder="Plak Adı" value={yeniPlak.ad} onChange={e => setYeniPlak({ ...yeniPlak, ad: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />
            <input required placeholder="Sanatçı" value={yeniPlak.sanatci} onChange={e => setYeniPlak({ ...yeniPlak, sanatci: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />
            <input required type="number" placeholder="Fiyat (TL)" value={yeniPlak.fiyat} onChange={e => setYeniPlak({ ...yeniPlak, fiyat: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />
            <input 
      required type="number"
      placeholder="Baskı Yılı" 
      value={yeniPlak.baskiYili} onChange={e => setYeniPlak({ ...yeniPlak, baskiYili: e.target.value })}
      style={{ width: '100%', padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} 
    />
    <select 
      value={yeniPlak.kondisyon || 'Near Mint (NM)'} 
      onChange={e => setYeniPlak({ ...yeniPlak, kondisyon: e.target.value })} 
      style={{ width: '100%', padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box', backgroundColor: 'white' }}
    >
      <option value="Jelatininde">Sıfır / Jelatininde</option>
      <option value="Kusursuz">Kusursuz</option>
      <option value="Çok İyi">Çok İyi</option>
      <option value="İyi">İyi</option>
      <option value="Çalınabilir">Yıpranmış / Çalınabilir</option>
    </select>
  
            <input 
    placeholder="Görsel URL Yapıştır (Örn: https://...)" 
    value={yeniPlak.resim} 
    onChange={e => setYeniPlak({ ...yeniPlak, resim: e.target.value })} 
    style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} 
  />

  {/* İstersen Bilgisayardan Direkt Resim Seçme Butonu */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>VEYA DOSYA SEÇ:</span>
    <input 
      type="file" 
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setYeniPlak({ ...yeniPlak, resim: reader.result }); // Resmi Base64 string'e çevirir, asla kırılmaz!
          };
          reader.readAsDataURL(file);
        }
      }}
      style={{ fontSize: '0.8rem', fontWeight: 'bold' }}
    />
  </div>

  {/* CANLI RESİM ÖNİZLEME KUTUSU */}
  {yeniPlak.resim && (
    <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', border: '2px dashed #1a1a1a', backgroundColor: '#fff' }}>
      <img 
        src={yeniPlak.resim} 
                  alt="Önizleme" 
                  referrerPolicy="no-referrer"
        style={{ width: '60px', height: '60px', objectFit: 'cover', border: '2px solid #1a1a1a' }} 
      />
      <span style={{ fontSize: '0.8rem', fontWeight: 'black', color: '#4caf50' }}>✓ Görsel Hazır!</span>
    </div>
  )}


            <select value={yeniPlak.kategori} onChange={e => setYeniPlak({ ...yeniPlak, kategori: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', backgroundColor: 'white' }}>
              <option value="Rock">Rock</option>
              <option value="Jazz">Jazz</option>
              <option value="Pop">Pop</option>
              <option value="Metal">Metal</option>
              <option value="Klasik">Klasik</option>
              
            </select>

            <input type="number" placeholder="Stok Adedi" value={yeniPlak.stok} onChange={e => setYeniPlak({ ...yeniPlak, stok: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />

            <button type="submit" className="brutal-btn" style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '12px', fontWeight: 'black', cursor: 'pointer', marginTop: '10px' }}>
              MAĞAZAYA YÜKLE +
            </button>
          </form>

          {/* MEVCUT PLAK LİSTESİ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.map(p => {
              const pId = p._id || p.id;
              return (
                <div key={pId} style={{ border: '3px solid #1a1a1a', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img 
  src={p.resim || p.image || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=100'} 
                      alt={p.ad} 
                      referrerPolicy="no-referrer"
  onError={(e) => {
    // Sadece gerçekten kırık linkse ve henüz fallback atanmadıysa değiştir
    if (!e.target.dataset.fallback) {
      e.target.dataset.fallback = "true";
      e.target.src = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=100';
    }
  }}
  style={{ width: '50px', height: '50px', objectFit: 'cover', border: '2px solid #1a1a1a', flexShrink: 0 }} 
/>
                    <div>
                      <div style={{ fontWeight: 'black', fontSize: '1.05rem' }}>{p.ad}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>{p.sanatci} - <span style={{ color: '#1a1a1a' }}>{p.fiyat} TL</span> ({p.kategori})</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    
                    {/* STOK DÜZENLEME ALANI */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 'black', fontSize: '0.8rem' }}>STOK:</span>
                      <input 
                        type="number" 
                        defaultValue={p.stok ?? 10} 
                        id={`stok-${pId}`} 
                        style={{ width: '60px', padding: '6px', border: '2px solid #1a1a1a', fontWeight: 'black', textAlign: 'center' }} 
                      />
                      <button 
                        onClick={() => handleStockUpdate(pId, document.getElementById(`stok-${pId}`).value)}
                        className="brutal-btn"
                        style={{ backgroundColor: '#2196f3', color: 'white', border: '2px solid #1a1a1a', padding: '6px 10px', fontWeight: 'black', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        KAYDET
                      </button>
                    </div>
                    <button
  type="button"
  onClick={() => setDuzenlenecekPlak({ ...p, _id: p._id || p.id })}
  className="brutal-btn"
  style={{
    backgroundColor: '#87b5ff',
    color: 'black',
    border: '2px solid #1a1a1a',
    padding: '6px 12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }}
>
  DÜZENLE
</button>
                    <button onClick={() => handleDeleteProduct(pId)} className="brutal-btn" style={{ backgroundColor: '#ff4d4d', color: 'white', border: '2px solid #1a1a1a', padding: '6px 10px', cursor: 'pointer', fontWeight: 'bold' }}>
                      SİL 🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SEKME 2: MÜŞTERİ SİPARİŞLERİ */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.length === 0 ? (
            <div style={{ padding: '30px', backgroundColor: 'white', border: '3px solid #1a1a1a', fontWeight: 'bold', textAlign: 'center' }}>
              Henüz sipariş bulunmuyor.
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '5px 5px 0px #1a1a1a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1a1a1a', paddingBottom: '10px', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', backgroundColor:'#ff9a17' }}>SİPARİŞ #{order._id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize: '1.1rem', color: '#666', fontWeight: 'bold', backgroundColor:'#efff60' }}>Müşteri: {order.kullanici?.adSoyad || order.teslimatBilgileri?.adSoyad || 'Müşteri'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', backgroundColor:'#ff965a' }}>{order.totalPrice || order.odenecekTutar} TL</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(order.siparisKalemleri || []).map((item, idx) => {
      
  const eslesenPlak = allPlaklar.find(p => 
      (p._id && (p._id === item.plak || p._id === item._id || p._id === item.product)) ||
      (p.ad && item.ad && p.ad.trim().toLowerCase() === item.ad.trim().toLowerCase())
    );

    // 2. Resim URL'si: item içindeki -> eslesenPlak içindeki -> sabit vinil ikonu
    const resimUrl = item.resim || item.gorsel || eslesenPlak?.resim || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=150';
    // Görsel kaynağını yakala (yoksa şık bir vinil yedek görseli)
   
    return (
      <div 
        key={idx} 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px dashed #ccc', 
          paddingBottom: '8px' 
        }}
      >
        {/* Sol Kısım: Küçük Plak Resmi + İsim + Adet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={resimUrl} 
            alt={item.ad} 
            referrerPolicy="no-referrer"
            onError={(e) => {
              if (!e.target.dataset.fallback) {
                e.target.dataset.fallback = "true";
                e.target.src = 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=120';
              }
            }}
            style={{ 
              width: '42px', 
              height: '42px', 
              objectFit: 'cover', 
              border: '2px solid #1a1a1a', 
              backgroundColor: '#eee',
              boxShadow: '2px 2px 0px #1a1a1a',
              flexShrink: 0
            }}
          />
          <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
            {item.ad} <span style={{ color: '#d97706', fontWeight: '900' }}>(x{item.adet})</span>
          </span>
        </div>

        {/* Sağ Kısım: Tutar */}
        <span style={{ fontWeight: 'black', fontSize: '1rem', whiteSpace: 'nowrap' }}>
          {(item.fiyat * item.adet).toFixed(2)} TL
        </span>
      </div>
    );
  })}
</div>

                <div style={{ marginTop: '15px', paddingTop: '12px', borderTop: '2px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    {order.teslimatBilgileri?.adres && (
                      <div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Teslimat Adresi: </span>
                        <span style={{ color: '#444', fontWeight: 'bold', fontSize: '1.1rem' }}>{order.teslimatBilgileri.adres}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Durum Değiştir:</span>
                  {['Hazırlanıyor', 'Kargoda', 'Teslim Edildi', 'İptal Edildi'].map(st => (
                    <button 
                      key={st}
                      onClick={() => handleUpdateOrderStatus(order._id, st)}
                      style={{ 
                        padding: '6px 12px', border: '2px solid #1a1a1a', cursor: 'pointer', fontWeight: 'bold',
                        backgroundColor: order.durum === st ? '#ff9e00' : 'white'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* GÖRÜŞ VE ÖNERİLER SEKMESİ */}
{activeTab === 'feedbacks' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #1a1a1a', paddingBottom: '12px' }}>
      <h3 style={{ margin: 0, fontSize: '1.4rem', textTransform: 'uppercase' }}>
        <MessageSquareQuote size={24} /> KULLANICI GÖRÜŞ VE ÖNERİLERİ ({feedbacks.length})
      </h3>
      <button 
        type="button"
        onClick={fetchFeedbacks} 
        className="brutal-btn"
        style={{ backgroundColor: '#fff', border: '2px solid #1a1a1a', padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        YENİLE 🔄
      </button>
    </div>

    {loadingFeedbacks ? (
      <p style={{ fontWeight: 'bold' }}>Görüşler yükleniyor...</p>
    ) : feedbacks.length === 0 ? (
      <div style={{ backgroundColor: 'white', border: '3px dashed #1a1a1a', padding: '40px 20px', textAlign: 'center', fontWeight: 'bold' }}>
        <MessageSquareQuote size={48} style={{ color: '#888', marginBottom: '10px' }} />
        <p style={{ margin: 0, fontSize: '1.1rem' }}>Henüz gelen bir görüş veya öneri bulunmuyor.</p>
      </div>
    ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {feedbacks.map(f => (
          <div 
            key={f._id} 
            style={{ 
              backgroundColor: 'white', 
              border: '4px solid #1a1a1a', 
              padding: '18px', 
              boxShadow: '6px 6px 0px #1a1a1a', 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            {/* Silme Butonu */}
            <button 
              type="button"
              onClick={() => handleDeleteFeedback(f._id)}
              style={{ 
                position: 'absolute', 
                top: '14px', 
                right: '14px', 
                backgroundColor: '#ff4d4d', 
                color: 'white', 
                border: '2px solid #1a1a1a', 
                padding: '5px', 
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #1a1a1a'
              }}
              title="Mesajı Sil"
            >
              <Trash2 size={16} />
            </button>

            {/* Gönderen Bilgisi ve Tarih */}
            <div>
              <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#1a1a1a', paddingRight: '35px' }}>
                <User2Icon size={20} style={{ marginRight: '8px' }} />
                {f.adSoyad}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold', marginTop: '4px' }}>
                📅 {new Date(f.createdAt).toLocaleDateString('tr-TR')} - {new Date(f.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Mesaj İçeriği */}
            <div style={{ 
              backgroundColor: '#f9f9f9', 
              border: '2px solid #1a1a1a', 
              padding: '12px', 
              fontWeight: 'bold',
              fontSize: '0.9rem', 
              color: '#222',
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap'
            }}>
              "{f.mesaj}"
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
      {activeTab === 'notifications' && (
             <form onSubmit={handleSendGlobalNotification} style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '20px', boxShadow: '5px 5px 0px #1a1a1a', marginBottom: '25px' }}>
  <h3 style={{ margin: '0 0 15px 0', textTransform: 'uppercase' }}>📢 TÜM KULLANICILARA DUYURU / BİLDİRİM GÖNDER</h3>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <input 
      required
      placeholder="Bildirim Başlığı (Örn: Hafta Sonu %20 İndirim Başladı! 🎸)" 
      value={bildirimBaslik} 
      onChange={e => setBildirimBaslik(e.target.value)} 
      style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} 
    />
    <textarea 
      required
      rows={3} 
      placeholder="Bildirim Açıklaması..." 
      value={bildirimMesaj} 
      onChange={e => setBildirimMesaj(e.target.value)} 
      style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', fontFamily: 'inherit' }} 
    />
    <button 
      type="submit" 
      className="brutal-btn" 
      style={{ backgroundColor: '#ff9e00', color: '#1a1a1a', border: '2px solid #1a1a1a', padding: '10px', fontWeight: 'black', cursor: 'pointer' }}
    >
      BİLDİRİMİ YAYINLA
    </button>
  </div>
</form>
            )}
      


      {/* SEKME 3: KAMPANYALAR & KUPONLAR */}
      {activeTab === 'campaigns' && (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
      <h2 style={{ margin: 0, textTransform: 'uppercase' }}>⚡ KAMPANYA VE KUPON YÖNETİMİ</h2>
      
      <button 
        onClick={() => setShowCampaignForm(!showCampaignForm)}
        className="brutal-btn"
        style={{ 
          backgroundColor: showCampaignForm ? '#ff4d4d' : '#ff9e00', 
          color: showCampaignForm ? 'white' : '#1a1a1a',
          border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'black', cursor: 'pointer' 
        }}
      >
        {showCampaignForm ? '✕ FORMU KAPAT' : '+ YENİ KAMPANYA / KUPON EKLE'}
      </button>
    </div>

    {/* YENİ KAMPANYA FORMU */}
    {showCampaignForm && (
      <form 
        onSubmit={handleAddCampaign} 
        style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '15px', backgroundColor: '#fff', padding: '25px', 
          border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', marginBottom: '30px' 
        }}
      >
        <div>
          <label style={{ fontWeight: 'black', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>KAMPANYA BAŞLIĞI</label>
          <input required placeholder="Örn: YAZ SONU İNDİRİMİ" value={yeniKampanya.baslik} onChange={e => setYeniKampanya({ ...yeniKampanya, baslik: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'black', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>KUPON KODU</label>
          <input required placeholder="Örn: ROCK20" value={yeniKampanya.kod} onChange={e => setYeniKampanya({ ...yeniKampanya, kod: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'black', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>İNDİRİM ORANI (%)</label>
          <input required type="number" min="1" max="100" placeholder="Örn: 20" value={yeniKampanya.indirimYuzdesi} onChange={e => setYeniKampanya({ ...yeniKampanya, indirimYuzdesi: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'black', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>İNDİRİMLİ KATEGORİ</label>
          <select value={yeniKampanya.kategori} onChange={e => setYeniKampanya({ ...yeniKampanya, kategori: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', backgroundColor: 'white', boxSizing: 'border-box' }}>
            <option value="Tümü">Tüm Plaklar</option>
            <option value="Rock">Rock</option>
            <option value="Jazz">Jazz</option>
            <option value="Pop">Pop</option>
            <option value="Metal">Metal</option>
            <option value="Klasik">Klasik</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'black', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>SON GEÇERLİLİK TARİHİ</label>
          <input 
            required
            type="date" 
            value={yeniKampanya.sonTarih} 
            onChange={e => setYeniKampanya({ ...yeniKampanya, sonTarih: e.target.value })} 
            style={{ width: '100%', padding: '9px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} 
          />
        </div>
              
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontWeight: 'black', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>DETAY AÇIKLAMASI</label>
          <input required placeholder="Örn: Tüm Rock plaklarında geçerli %20 indirim fırsatı!" value={yeniKampanya.detay} onChange={e => setYeniKampanya({ ...yeniKampanya, detay: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" className="brutal-btn" style={{ gridColumn: '1 / -1', backgroundColor: '#4caf50', color: 'white', border: '3px solid #1a1a1a', padding: '12px', fontWeight: 'black', cursor: 'pointer', fontSize: '1rem' }}>
          KAMPANYAYI YAYINLA 🚀
        </button>
      </form>
    )}

    {/* KAMPANYALAR LİSTESİ */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {(!kampanyalar || kampanyalar.length === 0) ? (
        <div style={{ padding: '20px', backgroundColor: 'white', border: '3px solid #1a1a1a', fontWeight: 'bold', textAlign: 'center' }}>
          Henüz eklenmiş bir kampanya bulunmuyor.
        </div>
      ) : (
        kampanyalar.map(k => {
          const aktifDurum = (k.aktif !== undefined) ? k.aktif : k.isAktif;
          const kategoriBilgisi = k.hedefKategori || k.kategori || 'Tümü';
          const tarihBilgisi = k.bitisTarihi || k.sonTarih;

          return (
            <div 
              key={k._id} 
              style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                backgroundColor: aktifDurum ? 'white' : '#f0f0f0', border: '3px solid #1a1a1a', 
                padding: '15px 20px', boxShadow: '6px 6px 0px #1a1a1a', opacity: aktifDurum ? 1 : 0.65,
                flexWrap: 'wrap', gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'black', fontSize: '1.2rem' }}>{k.baslik}</span>
                  <span style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '2px 8px', fontSize: '0.8rem', fontWeight: 'black', border: '1px solid #1a1a1a' }}>
                    KOD: {k.kod} (%{k.indirimYuzdesi || 10})
                  </span>
                  <span style={{ backgroundColor: '#ff9e00', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'black', border: '1px solid #1a1a1a' }}>
                    {kategoriBilgisi}
                  </span>
                  {tarihBilgisi && (
                    <span style={{ backgroundColor: '#eee', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #1a1a1a' }}>
                      ⏳ {new Date(tarihBilgisi).toLocaleDateString('tr-TR')}
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#444', fontWeight: 'bold' }}>{k.detay}</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  type="button"
                  onClick={() => handleToggleActive(k._id)} 
                  className="brutal-btn" 
                  style={{ 
                    backgroundColor: aktifDurum ? '#4caf50' : '#ff9800', 
                    color: 'white', border: '2px solid #1a1a1a', 
                    padding: '8px 14px', fontWeight: 'black', cursor: 'pointer' 
                  }}
                >
                  {aktifDurum ? 'AKTİF (GEÇERLİ)' : 'PASİF (GEÇERSİZ)'}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
)}

      {duzenlenecekPlak && (
        <EditProductModal 
          plak={duzenlenecekPlak} 
          onClose={() => setDuzenlenecekPlak(null)} 
          onSuccess={() => {
            setDuzenlenecekPlak(null);
            fetchAdminData();
          }} 
        />
      )}

    </div>
  );
};
// AdminPage.jsx dosyasının EN DIŞINA (export default AdminPage'in üstüne veya altına) yapıştır:
const EditProductModal = ({ plak, onClose, onSuccess }) => {
   const [loading, setLoading] = useState(false);
  const gecerliKondisyonlar = ['Jelatininde', 'Kusursuz', 'Çok İyi', 'İyi', 'Çalınabilir'];
  const [formData, setFormData] = useState({
  ...plak,
  kondisyon: gecerliKondisyonlar.includes(plak.kondisyon) ? plak.kondisyon : 'Jelatininde'
});
 



  const handleSubmit = async (e) => {
    e.preventDefault();
    const plakId = formData._id || formData.id;
    if (!plakId) {
      alert('Plak ID bulunamadı!');
      return;
    }

    setLoading(true);
    try {
      await API.put(`/products/${plakId}`, formData);
      alert('Plak başarıyla güncellendi! 🎉');
      onSuccess();
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert(err.response?.data?.message || 'Güncelleme yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '25px', maxWidth: '500px', width: '100%', boxShadow: '10px 10px 0px #1a1a1a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ margin: 0, textTransform: 'uppercase' }}>DÜZENLE</h3>

        <div>
          <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>PLAK ADI</label>
          <input 
            value={formData.ad || ''} 
            onChange={e => setFormData({ ...formData, ad: e.target.value })} 
            style={{ width: '100%', padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>FİYAT (TL)</label>
            <input 
              type="number" 
              value={formData.fiyat ?? ''} 
              onChange={e => setFormData({ ...formData, fiyat: Number(e.target.value) })} 
              style={{ width: '100%', padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>İNDİRİM (%)</label>
            <input 
              type="number" 
              min="0" 
              max="100" 
              placeholder="Örn: 20" 
              value={formData.indirimOrani ?? ''} 
              onChange={e => setFormData({ ...formData, indirimOrani: Number(e.target.value) })} 
              style={{ width: '100%', padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box', backgroundColor: '#fff3cd' }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>BASKI YILI</label>
            <input 
              type="text" 
              value={formData.baskiYili || ''} 
              onChange={e => setFormData({ ...formData, baskiYili: e.target.value })} 
              style={{ width: '100%', padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>KONDİSYON</label>
            <select 
              value={formData.kondisyon || 'Near Mint (NM)'} 
              onChange={e => setFormData({ ...formData, kondisyon: e.target.value })} 
              style={{ width: '100%', padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }}
            >
              <option value="Jelatininde">Jelatininde</option>
              <option value="Kusursuz">Kusursuz</option>
              <option value="Çok İyi">Çok İyi</option>
              <option value="İyi">İyi</option>
              <option value="Çalınabilir">Çalınabilir</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            type="submit" 
            disabled={loading} 
            className="brutal-btn" 
            style={{ flex: 1, backgroundColor: '#ff9e00', border: '2px solid #1a1a1a', padding: '10px', fontWeight: 'black', cursor: 'pointer' }}
          >
            {loading ? 'KAYDEDİLİYOR...' : 'GÜNCELLE'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ flex: 1, backgroundColor: '#eee', border: '2px solid #1a1a1a', padding: '10px', fontWeight: 'black', cursor: 'pointer' }}
          >
            İPTAL
          </button>
        </div>
      </form>
    </div>
  );
};
export default AdminPage;
