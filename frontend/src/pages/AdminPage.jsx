import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { PlusCircle, Trash2, Package, Disc, Check, RefreshCw } from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // YENİ ÜRÜN FORM STATE
  const [yeniPlak, setYeniPlak] = useState({
    ad: '', sanatci: '', fiyat: '', kategori: 'Rock', stok: 10, resim: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const prodRes = await API.get('/products');
      setProducts(prodRes.data);

      const orderRes = await API.get('/orders/admin/all');
      setOrders(orderRes.data);
    } catch (error) {
      console.error("Admin verileri çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  // Yeni Plak Ekleme
 // AdminPage.jsx içinde:
const handleAddProduct = async (e) => {
  e.preventDefault();
  try {
    // Backend'in beklediği veri formatını tam oluşturuyoruz
    const gonderilecekVeri = {
      ad: yeniPlak.ad,
      sanatci: yeniPlak.sanatci,
      fiyat: Number(yeniPlak.fiyat),
      stok: Number(yeniPlak.stok || 10),
      kategori: yeniPlak.kategori || 'Rock',
      resim: yeniPlak.resim || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500',
      aciklama: yeniPlak.aciklama || 'Vintage Orijinal Baskı Plak'
    };

    await API.post('/products', gonderilecekVeri);
    alert("Yeni plak dükkana başarıyla eklendi! 💿");
    setYeniPlak({ ad: '', sanatci: '', fiyat: '', kategori: 'Rock', stok: 10, resim: '' });
    fetchAdminData();
  } catch (error) {
    console.error("Ekleme Hatası:", error.response?.data);
    // Backend'den gelen spesifik hatayı ekranda gösterelim
    alert(error.response?.data?.message || "Ürün eklenirken hata oluştu! (Console'u kontrol et)");
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

  return (
    <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '30px', boxShadow: '12px 12px 0px #1a1a1a' }}>
      
      {/* ADMİN BAŞLIK */}
      <div style={{ borderBottom: '4px solid #1a1a1a', paddingBottom: '20px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2.2rem', textTransform: 'uppercase' }}>🔑 ADMIN YÖNETİM PANELİ</h2>
          <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#666' }}>VinVin Vintage Vinyls Mağaza Kontrol Merkezi</p>
        </div>
      </div>

      {/* SEKMELER */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => setActiveTab('products')} style={{ flex: 1, padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'products' ? '#ff9e00' : 'white', fontWeight: 'black', cursor: 'pointer', boxShadow: activeTab === 'products' ? '5px 5px 0px #1a1a1a' : 'none' }}>
          💿 PLAK KATALOĞU ({products.length})
        </button>
        <button onClick={() => setActiveTab('orders')} style={{ flex: 1, padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'orders' ? '#ff9e00' : 'white', fontWeight: 'black', cursor: 'pointer', boxShadow: activeTab === 'orders' ? '5px 5px 0px #1a1a1a' : 'none' }}>
          📦 MÜŞTERİ SİPARİŞLERİ ({orders.length})
        </button>
      </div>

      {/* SECİM 1: PLAKLARI YÖNET VE YENİ EKLE */}
      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          {/* YENİ ÜRÜN EKLEME FORMU */}
          <form onSubmit={handleAddProduct} style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '15px', height: 'fit-content' }}>
            <h3 style={{ margin: 0, borderBottom: '2px solid #1a1a1a', paddingBottom: '8px', textTransform: 'uppercase' }}>Yeni Plak Ekle</h3>
            
            <input required placeholder="Plak Adı" value={yeniPlak.ad} onChange={e => setYeniPlak({ ...yeniPlak, ad: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />
            <input required placeholder="Sanatçı" value={yeniPlak.sanatci} onChange={e => setYeniPlak({ ...yeniPlak, sanatci: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />
            <input required type="number" placeholder="Fiyat (TL)" value={yeniPlak.fiyat} onChange={e => setYeniPlak({ ...yeniPlak, fiyat: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />
            
             <input placeholder="Resim Görsel URL (Örn: https://...)" value={yeniPlak.resim} onChange={e => setYeniPlak({ ...yeniPlak, resim: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />         

            <select value={yeniPlak.kategori} onChange={e => setYeniPlak({ ...yeniPlak, kategori: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', backgroundColor: 'white' }}>
              <option value="Rock">Rock</option>
              <option value="Jazz">Jazz</option>
              <option value="Pop">Pop</option>
              <option value="Klasik">Klasik</option>
            </select>

            <input type="number" placeholder="Stok Adedi" value={yeniPlak.stok} onChange={e => setYeniPlak({ ...yeniPlak, stok: e.target.value })} style={{ padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />

            <button type="submit" style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '12px', fontWeight: 'black', cursor: 'pointer', marginTop: '10px' }}>
              MAĞAZAYA YÜKLE +
            </button>
          </form>

          {/* MEVCUT PLAK LİSTESİ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {products.map(p => {
              const pId = p._id || p.id;
              return (
                <div key={pId} style={{ border: '2px solid #1a1a1a', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Disc size={35} />
                    <div>
                      <div style={{ fontWeight: 'black' }}>{p.ad}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{p.sanatci} - <span style={{ color: '#1a1a1a', fontWeight: 'bold' }}>{p.fiyat} TL</span> ({p.kategori})</div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProduct(pId)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: '2px solid #1a1a1a', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>
                    SİL 🗑️
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SECİM 2: TÜM MÜŞTERİ SİPARİŞLERİ */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order._id} style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '5px 5px 0px #1a1a1a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1a1a1a', paddingBottom: '10px', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'black' }}>SİPARİŞ #{order._id}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Müşteri: {order.kullanici?.adSoyad || order.teslimatBilgileri?.adSoyad} ({order.kullanici?.email || 'Misafir'})</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'black', fontSize: '1.2rem' }}>{order.odenecekTutar} TL</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</div>
                </div>
              </div>

              {/* DURUM DEĞİŞTİRME BUTONLARI */}
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Durum Değiştir:</span>
                {['Hazırlanıyor', 'Kargoda', 'Teslim Edildi', 'İptal Edildi'].map(st => (
                  <button 
                    key={st}
                    onClick={() => handleUpdateOrderStatus(order._id, st)}
                    style={{ 
                      padding: '5px 10px', border: '2px solid #1a1a1a', cursor: 'pointer', fontWeight: 'bold',
                      backgroundColor: order.durum === st ? '#ff9e00' : 'white'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminPage;