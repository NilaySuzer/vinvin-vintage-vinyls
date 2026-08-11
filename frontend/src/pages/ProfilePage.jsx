import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Package, User, LogOut, MapPin, Key, AlertCircle, CheckCircle, Clock, XCircle, Disc } from 'lucide-react';

const ProfilePage = ({ handleLogout }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Form State'leri
  const [adSoyad, setAdSoyad] = useState(user.adSoyad || '');
  const [email, setEmail] = useState(user.email || '');
  const [eskiSifre, setEskiSifre] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error("Siparişler çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bu siparişi iptal etmek istediğinize emin misiniz?")) return;
    try {
      await API.put(`/orders/${orderId}/cancel`);
      alert("Siparişiniz başarıyla iptal edildi.");
      fetchOrders();
    } catch (error) {
      alert("Sipariş iptal edilirken bir hata oluştu.");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/users/profile', { adSoyad, email, eskiSifre, yeniSifre });
      localStorage.setItem('user', JSON.stringify(data));
      alert("Profil bilgileriniz başarıyla güncellendi! 🎉");
      setEskiSifre('');
      setYeniSifre('');
    } catch (error) {
      alert(error.response?.data?.message || "Güncelleme başarısız!");
    }
  };

  return (
    <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '30px', boxShadow: '12px 12px 0px #1a1a1a' }}>
      
      {/* BAŞLIK VE KULLANICI KARTI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #1a1a1a', paddingBottom: '20px', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2.2rem', textTransform: 'uppercase' }}>KULLANICI PANELİ 💿</h2>
          <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#555' }}>Hoş geldin, <span style={{ backgroundColor: '#ff9e00', padding: '2px 8px' }}>{user.adSoyad}</span> ({user.email})</p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', border: '3px solid #1a1a1a', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '4px 4px 0px #1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={18} /> ÇIKIŞ YAP
        </button>
      </div>

      {/* SEKMELER */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('orders')} style={{ flex: 1, padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'orders' ? '#ff9e00' : 'white', fontWeight: 'black', cursor: 'pointer', boxShadow: activeTab === 'orders' ? '5px 5px 0px #1a1a1a' : 'none', textTransform: 'uppercase' }}>
          📦 SİPARİŞLERİM ({orders.length})
        </button>
        <button onClick={() => setActiveTab('profile')} style={{ flex: 1, padding: '15px', border: '3px solid #1a1a1a', backgroundColor: activeTab === 'profile' ? '#ff9e00' : 'white', fontWeight: 'black', cursor: 'pointer', boxShadow: activeTab === 'profile' ? '5px 5px 0px #1a1a1a' : 'none', textTransform: 'uppercase' }}>
          👤 ÜYELİK & ŞİFRE BİLGİLERİ
        </button>
      </div>

      {/* TAB 1: SİPARİŞLERİM */}
      {activeTab === 'orders' && (
        <div>
          {loading ? (
            <p style={{ fontWeight: 'bold' }}>Sipariş geçmişiniz yükleniyor...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', border: '3px dashed #1a1a1a', backgroundColor: '#fdfdfd' }}>
              <Disc size={60} color="#1a1a1a" />
              <h3 style={{ textTransform: 'uppercase', marginTop: '15px' }}>Henüz hiç plak sipariş etmediniz!</h3>
              <p style={{ fontWeight: 'bold', color: '#666' }}>Plak koleksiyonunuzu büyütmek için vitrinimize göz atın.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {orders.map(order => (
                <div key={order._id} style={{ border: '3px solid #1a1a1a', padding: '20px', backgroundColor: '#f9f9f9', boxShadow: '6px 6px 0px #1a1a1a' }}>
                  
                  {/* SİPARİŞ ÜST BİLGİ */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1a1a1a', paddingBottom: '12px', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>SİPARİŞ NO</span>
                      <div style={{ fontWeight: 'black', fontSize: '1.1rem' }}>#{order._id}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>TARİH</span>
                      <div style={{ fontWeight: 'bold' }}>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>DURUM</span>
                      <div>
                        <span style={{ 
                          backgroundColor: order.durum === 'İptal Edildi' ? '#ff4d4d' : order.durum === 'Kargoda' ? '#ff9e00' : '#e2f0cb', 
                          color: '#1a1a1a', padding: '4px 10px', border: '2px solid #1a1a1a', fontWeight: 'black', fontSize: '0.85rem', display: 'inline-block', marginTop: '3px' 
                        }}>
                          {order.durum || 'Hazırlanıyor'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SİPARİŞ EDİLEN PLAKLAR */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {order.siparisKalemleri.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #ccc', paddingBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold' }}>📀 {item.ad} <span style={{ color: '#ff9e00' }}>(x{item.adet})</span></span>
                        <span style={{ fontWeight: 'black' }}>{(item.fiyat * item.adet).toFixed(2)} TL</span>
                      </div>
                    ))}
                  </div>

                  {/* ALT DETAYLAR VE İPTAL BUTONU */}
                  <div style={{ marginTop: '15px', paddingTop: '12px', borderTop: '2px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Teslimat Adresi: </span>
                      <span style={{ color: '#444', fontWeight: 'bold' }}>{order.teslimatBilgileri?.adres}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 'black' }}>TOPLAM: {order.odenecekTutar} TL</div>
                      {order.durum === 'Hazırlanıyor' && (
                        <button onClick={() => handleCancelOrder(order._id)} style={{ backgroundColor: 'white', color: '#ff4d4d', border: '2px solid #ff4d4d', padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
                          Siparişi İptal Et X
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ÜYELİK & ŞİFRE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileUpdate} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>AD SOYAD</label>
            <input required type="text" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} style={{ width: '100%', padding: '12px', border: '3px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>E-POSTA ADRESİ</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '3px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} />
          </div>

          <div style={{ borderTop: '2px dashed #1a1a1a', paddingTop: '15px', marginTop: '10px' }}>
            <h4 style={{ margin: '0 0 15px 0', textTransform: 'uppercase' }}>Şifre Değiştir (Opsiyonel)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>MEVCUT ŞİFRE</label>
                <input type="password" value={eskiSifre} onChange={(e) => setEskiSifre(e.target.value)} placeholder="******" style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>YENİ ŞİFRE</label>
                <input type="password" value={yeniSifre} onChange={(e) => setYeniSifre(e.target.value)} placeholder="******" style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          <button type="submit" style={{ backgroundColor: '#1a1a1a', color: 'white', border: 'none', padding: '15px', fontWeight: 'black', cursor: 'pointer', fontSize: '1rem', boxShadow: '4px 4px 0px #ff9e00' }}>
            BİLGİLERİ GÜNCELLE 💾
          </button>
        </form>
      )}

    </div>
  );
};

export default ProfilePage;