import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { PlusCircle, Trash2, Package, Disc, ShoppingBag, Tag, Plus, Check, X, RefreshCw } from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'campaigns'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kampanya State'leri
  const [kampanyalar, setKampanyalar] = useState([]);
  const [yeniKampanya, setYeniKampanya] = useState({ baslik: '', detay: '', renk: '#ff9e00', kod: '', kategori: 'Tümü', sonTarih: '' });
  const [showCampaignForm, setShowCampaignForm] = useState(false);

  // Yeni Ürün State
  const [yeniPlak, setYeniPlak] = useState({
    ad: '', sanatci: '', fiyat: '', kategori: 'Rock', stok: 10, resim: '',
  });

  // --- VERİ ÇEKME FONKSİYONLARI ---

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

  // Sayfa İlk Açıldığında Hepsini Çek
  useEffect(() => {
    fetchAdminData();
    fetchAdminKampanyalar();
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

  // Yeni Kampanya Ekle
  const handleAddCampaign = async (e) => {
    e.preventDefault();
    try {
      await API.post('/campaigns', yeniKampanya);
      alert("Kampanya ve Kupon Başarıyla Oluşturuldu! ⚡");
      setYeniKampanya({ baslik: '', detay: '', renk: '#ff9e00', kod: '', kategori: 'Tümü', sonTarih: '' });
      setShowCampaignForm(false);
      fetchAdminKampanyalar();
    } catch (err) {
      alert("Kampanya eklenirken hata oluştu.");
    }
  };

  // Kampanya Aktif/Pasif Yap
  const handleToggleActive = async (id) => {
    try {
      await API.patch(`/campaigns/${id}/toggle`);
      fetchAdminKampanyalar();
    } catch (err) {
      alert("Durum değiştirilemedi.");
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
          style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '10px 16px', fontWeight: 'black', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={18} /> YENİLE
        </button>
      </div>

      {/* SEKMELER */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('products')} 
          style={{ flex: 1, minWidth: '180px', padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'products' ? '#ff9e00' : 'white', fontWeight: 'black', cursor: 'pointer', boxShadow: activeTab === 'products' ? '5px 5px 0px #1a1a1a' : 'none' }}
        >
          💿 PLAK KATALOĞU & STOK ({products.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('campaigns')} 
          style={{ flex: 1, minWidth: '180px', padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'campaigns' ? '#ff9e00' : 'white', fontWeight: 'black', cursor: 'pointer', boxShadow: activeTab === 'campaigns' ? '5px 5px 0px #1a1a1a' : 'none' }}
        >
          ⚡ KAMPANYALAR & KUPONLAR ({kampanyalar.length})
        </button>
        
        <button 
          onClick={() => setActiveTab('orders')} 
          style={{ flex: 1, minWidth: '180px', padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'orders' ? '#ff9e00' : 'white', fontWeight: 'black', cursor: 'pointer', boxShadow: activeTab === 'orders' ? '5px 5px 0px #1a1a1a' : 'none' }}
        >
          📦 MÜŞTERİ SİPARİŞLERİ ({orders.length})
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
                    <div style={{ fontWeight: 'black' }}>SİPARİŞ #{order._id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Müşteri: {order.kullanici?.adSoyad || order.teslimatBilgileri?.adSoyad || 'Müşteri'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'black', fontSize: '1.2rem' }}>{order.totalPrice || order.odenecekTutar} TL</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</div>
                  </div>
                </div>

                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Durum Değiştir:</span>
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
                <label style={{ fontWeight: 'black', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>İNDİRİMLİ KATEGORİ</label>
                <select value={yeniKampanya.kategori} onChange={e => setYeniKampanya({ ...yeniKampanya, kategori: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', backgroundColor: 'white', boxSizing: 'border-box' }}>
                  <option value="Tümü">Tüm Plaklar</option>
                  <option value="Rock">Rock</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Pop">Pop</option>
                  <option value="Klasik">Metal</option>
                  <option value="Klasik">Klasik</option>
                  
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 'black', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>SON GEÇERLİLİK TARİHİ</label>
                <input 
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
            {kampanyalar.length === 0 ? (
              <div style={{ padding: '20px', backgroundColor: 'white', border: '3px solid #1a1a1a', fontWeight: 'bold', textAlign: 'center' }}>
                Henüz eklenmiş bir kampanya bulunmuyor.
              </div>
            ) : (
              kampanyalar.map(k => (
                <div 
                  key={k._id} 
                  style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    backgroundColor: k.isAktif ? 'white' : '#f0f0f0', border: '3px solid #1a1a1a', 
                    padding: '15px 20px', boxShadow: '6px 6px 0px #1a1a1a', opacity: k.isAktif ? 1 : 0.65,
                    flexWrap: 'wrap', gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'black', fontSize: '1.2rem' }}>{k.baslik}</span>
                      <span style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '2px 8px', fontSize: '0.8rem', fontWeight: 'black', border: '1px solid #1a1a1a' }}>
                        KOD: {k.kod}
                      </span>
                      <span style={{ backgroundColor: '#ff9e00', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'black', border: '1px solid #1a1a1a' }}>
                        {k.kategori}
                      </span>
                      {k.sonTarih && (
                        <span style={{ backgroundColor: '#eee', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #1a1a1a' }}>
                          ⏳ {k.sonTarih}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#444', fontWeight: 'bold' }}>{k.detay}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleToggleActive(k._id)} 
                      className="brutal-btn" 
                      style={{ 
                        backgroundColor: k.isAktif ? '#4caf50' : '#ff9800', 
                        color: 'white', border: '2px solid #1a1a1a', 
                        padding: '8px 14px', fontWeight: 'black', cursor: 'pointer' 
                      }}
                    >
                      {k.isAktif ? 'AKTİF (GEÇERLİ)' : 'PASİF (GEÇERSİZ)'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
