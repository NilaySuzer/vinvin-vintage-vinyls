import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Package, User, LogOut, Clock, CheckCircle, XCircle } from 'lucide-react';

const ProfilePage = ({ handleLogout }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' veya 'info'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Kullanıcının siparişlerini API'den çek
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error("Siparişler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Sipariş İptal Etme
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Siparişi iptal etmek istediğinize emin misiniz?")) return;

    try {
      await API.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, durum: 'İptal Edildi' } : o));
      alert("Siparişiniz iptal edildi.");
    } catch (error) {
      alert("Sipariş iptal edilirken bir hata oluştu.");
    }
  };

  return (
    <div style={{ padding: '20px', border: '4px solid #1a1a1a', backgroundColor: 'white', boxShadow: '10px 10px 0px #1a1a1a' }}>
      
      {/* KULLANICI BAŞLIK BANNERI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #1a1a1a', paddingBottom: '20px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem', textTransform: 'uppercase' }}>HESABIM 💿</h2>
          <p style={{ margin: 0, color: '#666', fontWeight: 'bold' }}>Hoş geldin, {user.adSoyad}</p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', border: '3px solid #1a1a1a', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '3px 3px 0px #1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={18} /> ÇIKIŞ YAP
        </button>
      </div>

      {/* SEKMELER (TABS) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ flex: 1, padding: '12px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'orders' ? '#ff9e00' : 'white', fontWeight: 'black', cursor: 'pointer', boxShadow: activeTab === 'orders' ? '4px 4px 0px #1a1a1a' : 'none' }}
        >
          📦 SİPARİŞLERİM ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('info')}
          style={{ flex: 1, padding: '12px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'info' ? '#ff9e00' : 'white', fontWeight: 'black', cursor: 'pointer', boxShadow: activeTab === 'info' ? '4px 4px 0px #1a1a1a' : 'none' }}
        >
          👤 ÜYELİK BİLGİLERİM
        </button>
      </div>

      {/* SEKME İÇERİKLERİ */}
      {activeTab === 'orders' ? (
        <div>
          {loading ? (
            <p style={{ fontWeight: 'bold' }}>Siparişler yükleniyor...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', border: '2px dashed #1a1a1a' }}>
              <Package size={50} color="#1a1a1a" />
              <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Henüz hiç sipariş vermediniz.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map(order => (
                <div key={order._id} style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '5px 5px 0px #1a1a1a' }}>
                  
                  {/* SİPARİŞ ÜST BİLGİİ */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1a1a1a', paddingBottom: '10px', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#666' }}>SİPARİŞ NO:</span>
                      <div style={{ fontWeight: 'black' }}>#{order._id}</div>
                    </div>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#666' }}>TARIH:</span>
                      <div style={{ fontWeight: 'bold' }}>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#666' }}>DURUM:</span>
                      <div>
                        <span style={{ backgroundColor: order.durum === 'İptal Edildi' ? '#ff4d4d' : '#e2f0cb', color: '#1a1a1a', padding: '3px 8px', border: '2px solid #1a1a1a', fontWeight: 'bold', fontSize: '0.85rem' }}>
                          {order.durum || 'Hazırlanıyor'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SİPARİŞ KALEMLERİ */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {order.siparisKalemleri.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #ccc', paddingBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold' }}>📀 {item.ad} (x{item.adet})</span>
                        <span style={{ fontWeight: 'bold' }}>{item.fiyat * item.adet} TL</span>
                      </div>
                    ))}
                  </div>

                  {/* SİPARİŞ ALT BİLGİ VE İPTAL BUTONU */}
                  <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '2px solid #1a1a1a' }}>
                    <div>
                      <span style={{ fontWeight: 'bold' }}>TOPLAM: </span>
                      <span style={{ fontWeight: 'black', fontSize: '1.2rem', color: '#1a1a1a' }}>{order.odenecekTutar} TL</span>
                    </div>

                    {order.durum !== 'İptal Edildi' && (
                      <button onClick={() => handleCancelOrder(order._id)} style={{ backgroundColor: '#white', color: '#ff4d4d', border: '2px solid #ff4d4d', padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Siparişi İptal Et
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ÜYELİK BİLGİLERİ SEKME İÇERİĞİ */
        <div style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: '#f9f9f9' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Kişisel Bilgiler</h3>
          <p><strong>Ad Soyad:</strong> {user.adSoyad}</p>
          <p><strong>E-Posta:</strong> {user.email}</p>
          <p><strong>Üyelik Tipi:</strong> {user.role === 'admin' ? '🔑 Yönetici (Admin)' : '👤 Standart Müşteri'}</p>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;