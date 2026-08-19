import React, { useState, useEffect } from 'react';
import { User, MapPin, Package, Trash2, Plus, Disc, XCircle, ShoppingBag, User2Icon } from 'lucide-react';
import API from '../services/api';

const AccountPage = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('orders'); // Varsayılan sekme siparişler
  const [name, setName] = useState(user?.name || user?.adSoyad || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  
  const [adresler, setAdresler] = useState([]);
  const [yeniAdres, setYeniAdres] = useState({ baslik: '', sehir: '', ilce: '', acikAdres: '' });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

    
  const [allPlaklar, setAllPlaklar] = useState([]);

// Tüm plakları arka planda çek (Görsel eşleştirmesi için)
const fetchAllPlaklar = async () => {
  try {
    const { data } = await API.get('/products'); // veya senin plakları çektiğin endpoint (/plaklar)
    setAllPlaklar(data || []);
  } catch (err) {
    console.error("Plaklar çekilemedi:", err);
  }
};
    
  // Kullanıcı profilini ve kayıtlı adreslerini çek (AccountPage'deki çalışan kod)
  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/users/profile');
      if (data) {
        setAdresler(data.adresler || []);
        setName(data.name || data.adSoyad || '');
        setEmail(data.email || '');
      }
    } catch (err) {
      console.error("Profil yüklenemedi", err);
    }
  };

  // Kullanıcının siparişlerini çek
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data } = await API.get('/orders/myorders');
      setOrders(data || []);
    } catch (err) {
      console.error("Siparişler yüklenemedi", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProfile();
      fetchOrders();
      fetchAllPlaklar(); // Tüm plakları çek
  }, []);

  // Profil & Şifre Güncelleme (AccountPage'deki çalışan kod)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, email };
      if (password.trim() !== '') payload.password = password;
      const { data } = await API.put('/users/profile', payload);
      if (setUser) setUser(data);
      localStorage.setItem('user', JSON.stringify({ ...user, name: data.name || name, email: data.email || email }));
      alert('Bilgileriniz başarıyla güncellendi! ⚡');
      setPassword('');
    } catch (err) {
      alert('Güncelleme sırasında hata oluştu.');
    }
  };

  // Yeni Adres Ekleme (AccountPage'deki çalışan kod)
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/address', yeniAdres);
      setAdresler(data);
      setYeniAdres({ baslik: '', sehir: '', ilce: '', acikAdres: '' });
      setShowAddressModal(false);
      alert('Yeni adres başarıyla eklendi! 📍');
    } catch (err) {
      alert('Adres eklenemedi.');
    }
  };

  // Adres Silme (AccountPage'deki çalışan kod)
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
    try {
      const { data } = await API.delete(`/users/address/${addressId}`);
      setAdresler(data);
    } catch (err) {
      alert('Adres silinemedi.');
    }
  };

  // Sipariş İptal Etme
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

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '2px auto', padding: '0 20px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* BAŞLIK */}
      <div style={{ backgroundColor: '#ff9e00', color: 'white', padding: '25px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px black', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', textTransform: 'uppercase' }}> <User2Icon size={24} color="blue" /> HESAP YÖNETİMİ</h1>
        <span style={{ backgroundColor: 'black', color: '#ffff', padding: '6px 12px', fontWeight: 'black', fontSize: '0.85rem' }}>
          {email || user?.email}
        </span>
      </div>

      {/* SEKME BUTONLARI */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('orders')} className="brutal-btn" style={{ backgroundColor: activeTab === 'orders' ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'black', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
          <Package size={18} /> SİPARİŞLERİM ({orders.length})
        </button>
        <button onClick={() => setActiveTab('addresses')} className="brutal-btn" style={{ backgroundColor: activeTab === 'addresses' ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'black', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
          <MapPin size={18} /> ADRESLERİM ({adresler.length})
        </button>
        <button onClick={() => setActiveTab('profile')} className="brutal-btn" style={{ backgroundColor: activeTab === 'profile' ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'black', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
          <User size={18} /> ÜYELİK BİLGİLERİ & ŞİFRE
        </button>
      </div>

      {/* 1. SİPARİŞLERİM SEKMESİ (siparisKalemleri ile çalışan yapı) */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loadingOrders ? (
            <p style={{ fontWeight: 'bold' }}>Siparişleriniz yükleniyor...</p>
          ) : orders.length === 0 ? (
            <div style={{ backgroundColor: 'white', border: '3px dashed #1a1a1a', padding: '40px 20px', textAlign: 'center' }}>
              <Disc size={50} color="#eeecec" style={{ marginBottom: '10px' }} />
              <h3 style={{ textTransform: 'uppercase', margin: '0 0 5px 0' }}>Henüz hiç plak sipariş etmediniz!</h3>
              <p style={{ fontWeight: 'bold', color: '#666', margin: 0 }}>Plak koleksiyonunuzu büyütmek için vitrinimize göz atın.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '20px', boxShadow: '6px 6px 0px #1a1a1a' }}>
                
                {/* SİPARİŞ ÜST BİLGİ */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1a1a1a', paddingBottom: '12px', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>SİPARİŞ KODU</span>
                    <div style={{ fontWeight: 'black', fontSize: '1.05rem' }}>#{order._id}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>TARİH</span>
                    <div style={{ fontWeight: 'bold' }}>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'black' }}>DURUM</span>
                    <div>
                      <span style={{ 
                                    backgroundColor: order.durum === 'İptal Edildi' ? '#de1010' : order.durum === 'Kargoda' ? '#ff9e00' : order.durum === 'Teslim Edildi' ? '#4caf50' :
                                        '#d4ed6e', 
                        color: '#1a1a1a', padding: '10px 15px', border: '2px solid #1a1a1a', fontWeight: 'bold', fontSize: '0.85rem', display: 'inline-block', marginTop: '3px' 
                      }}>
                        {order.durum || 'Hazırlanıyor'}
                      </span>
                    </div>
                  </div>
                </div>

                
                    {/* SİPARİŞ EDİLEN PLAKLAR (siparisKalemleri) */}
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



                {/* ALT DETAYLAR VE İPTAL BUTONU */}
                <div style={{ marginTop: '15px', paddingTop: '12px', borderTop: '2px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    {order.teslimatBilgileri?.adres && (
                      <div>
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Teslimat Adresi: </span>
                        <span style={{ color: '#444', fontWeight: 'bold', fontSize: '0.85rem' }}>{order.teslimatBilgileri.adres}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                      TOPLAM: {order.odenecekTutar || order.totalPrice} TL
                    </div>
                    {(order.durum === 'Hazırlanıyor' || !order.durum) && (
                      <button 
                        onClick={() => handleCancelOrder(order._id)} 
                        style={{ backgroundColor: 'white', color: '#ff4d4d', border: '2px solid #ff4d4d', padding: '6px 12px', fontWeight: 'black', cursor: 'pointer', boxShadow: '2px 2px 0px #ff4d4d', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <XCircle size={14} /> Siparişi İptal Et
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* 2. ADRESLERİM SEKMESİ (AccountPage'deki çalışan orijinal kod) */}
      {activeTab === 'addresses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, textTransform: 'uppercase' }}>KAYITLI TESLİMAT ADRESLERİ</h3>
            <button onClick={() => setShowAddressModal(true)} className="brutal-btn" style={{ backgroundColor: '#4caf50', color: 'white', border: '2px solid #1a1a1a', padding: '8px 14px', fontWeight: 'black', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}>
              <Plus size={16} /> YENİ ADRES EKLE
            </button>
          </div>

          {adresler.length === 0 ? (
            <div style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '30px', textAlign: 'center', fontWeight: 'bold' }}>
              Henüz kayıtlı bir adresiniz bulunmuyor.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {adresler.map(adr => (
                <div key={adr._id} style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '20px', boxShadow: '6px 6px 0px #1a1a1a', position: 'relative' }}>
                  <button onClick={() => handleDeleteAddress(adr._id)} style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#ff4d4d', color: 'white', border: '2px solid #1a1a1a', padding: '4px', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                  <span style={{ backgroundColor: '#ff9e00', padding: '2px 8px', fontWeight: 'black', fontSize: '0.8rem', border: '1px solid #1a1a1a' }}>{adr.baslik}</span>
                  <h4 style={{ margin: '10px 0 5px 0' }}>{adr.ilce} / {adr.sehir}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', fontWeight: 'bold' }}>{adr.acikAdres}</p>
                </div>
              ))}
            </div>
          )}

          {/* ADRES EKLEME MODALI */}
          {showAddressModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <form onSubmit={handleAddAddress} style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '30px', maxWidth: '450px', width: '100%', boxShadow: '10px 10px 0px #1a1a1a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: '0 0 10px 0', textTransform: 'uppercase' }}>📍 YENİ ADRES EKLE</h3>
                <input required placeholder="Adres Başlığı (Örn: Ev, Ofis)" value={yeniAdres.baslik} onChange={e => setYeniAdres({ ...yeniAdres, baslik: e.target.value })} style={{ padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input required placeholder="Şehir" value={yeniAdres.sehir} onChange={e => setYeniAdres({ ...yeniAdres, sehir: e.target.value })} style={{ flex: 1, padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />
                  <input required placeholder="İlçe" value={yeniAdres.ilce} onChange={e => setYeniAdres({ ...yeniAdres, ilce: e.target.value })} style={{ flex: 1, padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold' }} />
                </div>
                <textarea required placeholder="Açık Adres (Cadde, Sokak, No, Daire)" value={yeniAdres.acikAdres} onChange={e => setYeniAdres({ ...yeniAdres, acikAdres: e.target.value })} style={{ padding: '8px', border: '2px solid #1a1a1a', fontWeight: 'bold', minHeight: '70px' }} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="brutal-btn" style={{ flex: 1, backgroundColor: '#4caf50', color: 'white', border: '2px solid #1a1a1a', padding: '10px', fontWeight: 'black', cursor: 'pointer', fontFamily: 'inherit' }}>KAYDET</button>
                  <button type="button" onClick={() => setShowAddressModal(false)} style={{ flex: 1, backgroundColor: '#eee', border: '2px solid #1a1a1a', padding: '10px', fontWeight: 'black', cursor: 'pointer', fontFamily: 'inherit' }}>İPTAL</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 3. ÜYELİK VE ŞİFRE BİLGİLERİ (AccountPage'deki çalışan orijinal kod) */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '30px', boxShadow: '8px 8px 0px #1a1a1a', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: 'black', fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>AD SOYAD</label>
            <input required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontWeight: 'black', fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>E-POSTA ADRESİ</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontWeight: 'black', fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>YENİ ŞİFRE (Değiştirmek istemiyorsanız boş bırakın)</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" className="brutal-btn" style={{ backgroundColor: '#ff9e00', border: '3px solid #1a1a1a', padding: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '1rem', fontFamily: 'inherit' }}>
            BİLGİLERİ GÜNCELLE
          </button>
        </form>
      )}

    </div>
  );
};

export default AccountPage;