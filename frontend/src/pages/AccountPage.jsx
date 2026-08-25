import React, { useState, useEffect } from 'react';
import {
  PhoneCall, Bell, Mail, Clock, Send, User, MapPin, Package, Trash2, Plus, Disc, XCircle, ShoppingBag, User2Icon, MessageSquareQuote
} from 'lucide-react';
import API from '../services/api';

const AccountPage = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('orders'); // Varsayılan sekme siparişler
  
  const [name, setName] = useState(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u.name || u.adSoyad || '';
  });
  
  const [email, setEmail] = useState(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u.email || '';
  });

  const [password, setPassword] = useState('');
  const [adresler, setAdresler] = useState([]);
  const [yeniAdres, setYeniAdres] = useState({ baslik: '', sehir: '', ilce: '', acikAdres: '' });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [myTradeOffers, setMyTradeOffers] = useState([]);
const [tradeOffersLoading, setTradeOffersLoading] = useState(false);
const [tradeFormLoading, setTradeFormLoading] = useState(false);
const [tradeMesaj, setTradeMesaj] = useState('');

const [userTradeForm, setUserTradeForm] = useState({
  plakAdi: '',
  sanatci: '',
  kondisyon: 'Jelatininde',
  teklifTuru: 'satis',
  talepEdilenFiyat: '',
  aciklama: '',
  fotografUrl: ''
});

// Kullanıcının tekliflerini backend'den çeken fonksiyon
const fetchMyTradeOffers = async () => {
  try {
    setTradeOffersLoading(true);
    const token = localStorage.getItem('token');
    const activeUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = activeUser._id || activeUser.id || user?._id || user?.id;
   

    if (!currentUserId) return;

    const res = await fetch(`http://localhost:5000/api/trade/my-offers/${currentUserId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.success) {
      setMyTradeOffers(data.data);
    }
  } catch (err) {
    console.error('Teklifler yüklenemedi:', err);
  } finally {
    setTradeOffersLoading(false);
  }
};

// Sekme seçildiğinde veya sayfa yüklendiğinde teklifleri çek
useEffect(() => {
  if (activeTab === 'tradeOffers') {
    fetchMyTradeOffers();
  }
}, [activeTab, user]);

// Yeni teklif oluşturup dükkana gönderme
const handleProfileTradeSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const activeUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = activeUser._id || activeUser.id || user?._id || user?.id;

  if (!currentUserId || !token) {
    alert('İşlem yapabilmek için lütfen giriş yapın.');
    return;
  }

  setTradeFormLoading(true);
  setTradeMesaj('');

  try {
    const res = await fetch('http://localhost:5000/api/trade/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...userTradeForm,
        talepEdilenFiyat: userTradeForm.talepEdilenFiyat ? Number(userTradeForm.talepEdilenFiyat) : 0,
        userId: currentUserId,
        userName: activeUser.adSoyad || activeUser.ad || activeUser.name || user?.adSoyad || 'Kullanıcı',
        userEmail: activeUser.email || user?.email || ''
      })
    });

    const data = await res.json();
    if (data.success) {
      setTradeMesaj('✅ Teklifiniz dükkana iletildi! Admin yanıtladığında bildirim alacaksınız.');
      setUserTradeForm({
        plakAdi: '',
        sanatci: '',
        kondisyon: 'Jelatininde',
        teklifTuru: 'satis',
        talepEdilenFiyat: '',
        aciklama: '',
        fotografUrl: ''
      });
      fetchMyTradeOffers(); // Listeyi anında tazele
    } else {
      setTradeMesaj(`❌ Hata: ${data.message}`);
    }
  } catch (err) {
    setTradeMesaj('❌ Sunucuya bağlanırken bir hata oluştu.');
  } finally {
    setTradeFormLoading(false);
  }
};


  const [allPlaklar, setAllPlaklar] = useState([]);
  const [feedbackMesaj, setFeedbackMesaj] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

const [notifications, setNotifications] = useState([]);
const [loadingNotifs, setLoadingNotifs] = useState(false);

const fetchNotifications = async () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser._id || currentUser.id || user?._id || user?.id;
  if (!userId) return;

  try {
    setLoadingNotifs(true);
    const { data } = await API.get(`/notifications?userId=${userId}`);
    setNotifications(data || []);
  } catch (err) {
    console.error('Bildirimler yüklenemedi:', err);
  } finally {
    setLoadingNotifs(false);
  }
};

useEffect(() => {
  fetchNotifications();
}, []);

const handleMarkAsRead = async (notifId) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser._id || currentUser.id || user?._id || user?.id;
  try {
    await API.put(`/notifications/${notifId}/read`, { userId });
    setNotifications(prev =>
      prev.map(n => n._id === notifId ? { ...n, okundu: true } : n)
    );
  } catch (err) {
    console.error(err);
  }
};

  // user prop'u güncellendiğinde inputları senkronize et
  useEffect(() => {
    if (user) {
      if (user.name || user.adSoyad) setName(user.name || user.adSoyad);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackMesaj.trim()) return;

    setFeedbackLoading(true);
    try {
      await API.post('/feedbacks', {
        adSoyad: name || user?.name || 'Anonim Kullanıcı',
        mesaj: feedbackMesaj,
        userId: user?._id || user?.id || JSON.parse(localStorage.getItem('user') || '{}')._id
      });
      alert('Görüş ve öneriniz başarıyla bize ulaştı! Teşekkür ederiz. 💌');
      setFeedbackMesaj('');
    } catch (err) {
      alert('Geri bildirim gönderilirken bir hata oluştu.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Tüm plakları çek
  const fetchAllPlaklar = async () => {
    try {
      const { data } = await API.get('/products');
      setAllPlaklar(data || []);
    } catch (err) {
      console.error("Plaklar çekilemedi:", err);
    }
  };
    
  // Kullanıcı profilini ve kayıtlı adreslerini çek (userId parametresi eklendi)
  // Kullanıcı profilini ve kayıtlı adreslerini çek
  const fetchProfile = async () => {
  try {
    const rawUser = localStorage.getItem('user');
    const currentUser = rawUser ? JSON.parse(rawUser) : null;
    const targetId = currentUser?._id || currentUser?.id || user?._id || user?.id;

    if (!targetId) return;

    // 1. Profil ve Adres Bilgilerini Çek
    const profileRes = await API.get(`/users/profile?userId=${targetId}`);
    if (profileRes.data) {
      setName(profileRes.data.name || profileRes.data.adSoyad || '');
      setEmail(profileRes.data.email || '');

      const gelenAdresler = profileRes.data.adresler || profileRes.data.addresses || [];
      if (Array.isArray(gelenAdresler)) {
        setAdresler(gelenAdresler);
      }
    }

    // 2. Plak Tekliflerini API ile Çek (Buraya Eklendi)
    try {
      const tradeRes = await API.get(`/trade/my-offers/${targetId}`);
      if (tradeRes.data && tradeRes.data.success) {
        setMyTradeOffers(tradeRes.data.data);
      }
    } catch (tradeErr) {
      console.error("Teklifler çekilemedi:", tradeErr);
    }

  } catch (err) {
    console.error("Profil yüklenemedi", err);
  }
};
  // 2. SAYFA İLK AÇILDIĞINDA VEYA YENİLENDİĞİNDE OTOMATİK ÇALIŞTIR
useEffect(() => {
  fetchProfile();
}, []);

// 3. KULLANICI STATE'İ VEYA SEKME DEĞİŞTİĞİNDE DE GARANTİYE AL
useEffect(() => {
  fetchProfile();
}, [activeTab, user]);


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
    fetchAllPlaklar();
  }, []);

  // Profil & Şifre Güncelleme
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const rawUser = localStorage.getItem('user');
    const currentUser = rawUser ? JSON.parse(rawUser) : null;
    const userId = currentUser?._id || currentUser?.id || user?._id || user?.id;

    if (!userId) {
      alert('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    try {
      const { data } = await API.put('/users/profile', {
        userId,
        name: name.trim(),
        email: email.trim(),
        password: password.trim() || undefined
      });

      // LocalStorage ve mevcut state'i birleştirip güncelle
      const updatedUser = {
        ...currentUser,
        ...(data.user || data),
        token: currentUser?.token || localStorage.getItem('token')
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (typeof setUser === 'function') {
        setUser(updatedUser);
      }

      alert('Bilgileriniz başarıyla güncellendi! 🎉');
      setPassword(''); // Şifre kutusunu sıfırla
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert(err.response?.data?.message || 'Güncelleme başarısız oldu.');
    }
  };

  // Yeni Adres Ekleme
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

  // Adres Silme
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
    <div style={{ width: '100%', maxWidth: '1200px', margin: '2px auto', padding: '0 20px', boxSizing: 'border-box' }}>
      
      {/* BAŞLIK */}
      <div style={{ backgroundColor: '#ff9e00', color: 'white', padding: '25px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px black', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User2Icon size={28} color="black" /> HESABIM
        </h1>
        <span style={{ backgroundColor: 'black', color: '#ffff', padding: '6px 12px', fontWeight: 'bold', fontSize: '0.85rem' }}>
          {email || user?.email}
        </span>
      </div>

      {/* SEKME BUTONLARI */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('orders')} className="brutal-btn" style={{ backgroundColor: activeTab === 'orders' ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
          <Package size={18} color="brown"/> SİPARİŞLERİM ({orders.length})
        </button>
        <button onClick={() => setActiveTab('addresses')} className="brutal-btn" style={{ backgroundColor: activeTab === 'addresses' ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
          <MapPin size={18} color="red" /> ADRESLERİM ({adresler.length})
        </button>
        <button onClick={() => setActiveTab('profile')} className="brutal-btn" style={{ backgroundColor: activeTab === 'profile' ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
          <User size={18} color="blue" /> ÜYELİK BİLGİLERİ & ŞİFRE
        </button>
        {/* SEKME BUTONLARI ARASINA: */}
<button 
  onClick={() => setActiveTab('notifications')} 
  className="brutal-btn" 
  style={{ backgroundColor: activeTab === 'notifications' ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
  <Bell size={18} color="#e63946" /> BİLDİRİMLERİM ({notifications.filter(n => !n.okundu).length})
        </button>
        {/* 👈 YENİ EKLENEN TAKAS / SATIŞ SEKME BUTONU */}
  <button
    type="button"
    onClick={() => setActiveTab('tradeOffers')}
    className="brutal-btn"
    style={{ backgroundColor: activeTab === 'tradeOffers' ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
    <Disc size={18} color="orange" /> Plak / Albüm Sat / Takas ({myTradeOffers?.length || 0})
  </button>
        <button onClick={() => setActiveTab('feedback')} className="brutal-btn" style={{ backgroundColor: activeTab === 'feedback' ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
          <MessageSquareQuote size={18} color="green" /> GÖRÜŞ & ÖNERİLER
        </button>
        <button type="button" onClick={() => setActiveTab('contact')} className="brutal-btn" style={{ backgroundColor: activeTab === 'contact' ? '#ff9e00' : 'white', border: '3px solid #1a1a1a', padding: '10px 18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
          <PhoneCall size={18} color="purple" /> BİZE ULAŞIN
        </button>
      </div>

      {activeTab === 'tradeOffers' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
    
    {/* 1. ÜST: YENİ TEKLİF FORMU */}
    <div style={{ 
      backgroundColor: '#ffffff', 
      border: '4px solid #1a1a1a', 
      padding: '25px', 
      boxShadow: '6px 6px 0px #1a1a1a' 
    }}>
      <div style={{ borderBottom: '3px solid #1a1a1a', paddingBottom: '12px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', fontWeight: '900', textTransform: 'uppercase' }}>
          ➕ Dükkana Plak Sat / Takas Talebi Gönder
        </h3>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#555', fontSize: '0.85rem' }}>
          Eski plağını nakit olarak bize satabilir veya başka plaklarla takaslamak için fiyat teklifi alabilirsin.
        </p>
      </div>

      {tradeMesaj && (
        <div style={{
          padding: '10px 14px',
          border: '3px solid #1a1a1a',
          backgroundColor: tradeMesaj.includes('✅') ? '#a7c957' : '#ff6b6b',
          color: '#1a1a1a',
          fontWeight: '900',
          marginBottom: '18px',
          boxShadow: '3px 3px 0px #1a1a1a'
        }}>
          {tradeMesaj}
        </div>
      )}

      <form onSubmit={handleProfileTradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '900', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              Plak / Albüm Adı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: The Dark Side of the Moon"
              value={userTradeForm.plakAdi}
              onChange={e => setUserTradeForm({ ...userTradeForm, plakAdi: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '900', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              Sanatçı / Grup *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Pink Floyd"
              value={userTradeForm.sanatci}
              onChange={e => setUserTradeForm({ ...userTradeForm, sanatci: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '900', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              İşlem Türü
            </label>
            <select
              value={userTradeForm.teklifTuru}
              onChange={e => setUserTradeForm({ ...userTradeForm, teklifTuru: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', backgroundColor: 'white', boxSizing: 'border-box' }}
            >
              <option value="satis"> Nakit Satış</option>
              <option value="takas"> Plak Takası</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '900', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              Kondisyon Durumu
            </label>
            <select
              value={userTradeForm.kondisyon}
              onChange={e => setUserTradeForm({ ...userTradeForm, kondisyon: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', backgroundColor: 'white', boxSizing: 'border-box' }}
            >
              <option value="Jelatininde">Jelatininde</option>
              <option value="Kusursuz">Kusursuz</option>
              <option value="Çok İyi">Çok İyi</option>
              <option value="İyi">İyi</option>
              <option value="Çalınabilir">Çalınabilir</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '900', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              İstediğiniz Fiyat (TL)
            </label>
            <input
              type="number"
              placeholder="Örn: 750 (Boş bırakabilirsiniz)"
              value={userTradeForm.talepEdilenFiyat}
              onChange={e => setUserTradeForm({ ...userTradeForm, talepEdilenFiyat: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '900', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              Fotoğraf Bağlantısı (URL)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={userTradeForm.fotografUrl}
              onChange={e => setUserTradeForm({ ...userTradeForm, fotografUrl: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '900', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            Ek Açıklama (Baskı Yılı / Kusurlar)
          </label>
          <textarea
            rows="2"
            placeholder="Kapakta yıpranma var mı? Orijinal iç zarf mevcut mu?"
            value={userTradeForm.aciklama}
            onChange={e => setUserTradeForm({ ...userTradeForm, aciklama: e.target.value })}
            style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={tradeFormLoading}
          className="brutal-btn"
          style={{
            backgroundColor: '#ff9e00',
            color: '#1a1a1a',
            border: '2px solid #1a1a1a',
            padding: '12px',
            fontWeight: '900',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '4px 4px 0px #1a1a1a',
            textTransform: 'uppercase',
            marginTop: '5px'
          }}
        >
          {tradeFormLoading ? 'GÖNDERİLİYOR...' : '🚀 TEKLİFİ DÜKKANA İLET'}
        </button>
      </form>
    </div>

    {/* 2. ALT: GEÇMİŞ VE MEVCUT TEKLİFLERİN LİSTESİ */}
    <div style={{ 
      backgroundColor: '#ffffff', 
      border: '4px solid #1a1a1a', 
      padding: '25px', 
      boxShadow: '6px 6px 0px #1a1a1a' 
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem', fontWeight: '900', textTransform: 'uppercase', borderBottom: '2px dashed #1a1a1a', paddingBottom: '10px' }}>
        📋 İlettiğim Teklifler ({myTradeOffers.length})
      </h3>

      {tradeOffersLoading ? (
        <p style={{ fontWeight: 'bold' }}>Teklifler yükleniyor...</p>
      ) : myTradeOffers.length === 0 ? (
        <p style={{ fontWeight: 'bold', color: '#666' }}>Henüz dükkana ilettiğiniz bir teklif bulunmuyor.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {myTradeOffers.map((item) => (
            <div 
              key={item._id}
              style={{
                border: '3px solid #1a1a1a',
                padding: '16px',
                backgroundColor: '#fbfaf8',
                boxShadow: '4px 4px 0px #1a1a1a'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{
                      backgroundColor: item.durum === 'onaylandi' ? '#a7c957' : item.durum === 'reddedildi' ? '#ff6b6b' : '#ffd166',
                      padding: '3px 8px',
                      border: '1.5px solid #1a1a1a',
                      fontWeight: '900',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase'
                    }}>
                      {item.durum === 'onaylandi' ? '✓ ONAYLANDI' : item.durum === 'reddedildi' ? '✕ REDDEDİLDİ' : '⏳ İNCELENİYOR'}
                    </span>
                    <span style={{ fontWeight: '900', fontSize: '0.8rem', color: '#555' }}>
                      {item.teklifTuru === 'satis' ? '💵 SATIŞ' : '🔄 TAKAS'}
                    </span>
                  </div>

                  <h4 style={{ margin: '4px 0', fontSize: '1.2rem', fontWeight: '900' }}>
                    {item.plakAdi} — {item.sanatci}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>
                    Kondisyon: <span style={{ color: '#1a1a1a' }}>{item.kondisyon}</span> {item.talepEdilenFiyat ? `| Talep Ettiğiniz: ${item.talepEdilenFiyat} TL` : ''}
                  </p>
                </div>

                {/* ADMİN YANIT KUTUSU */}
                {item.durum !== 'beklemede' && (
                  <div style={{
                    backgroundColor: item.durum === 'onaylandi' ? '#e9f5db' : '#ffe5e5',
                    padding: '10px 14px',
                    border: '2px solid #1a1a1a',
                    minWidth: '220px',
                    boxShadow: '2px 2px 0px #1a1a1a'
                  }}>
                    <div style={{ fontWeight: '900', fontSize: '0.9rem', color: '#1a1a1a' }}>
                      {item.adminTeklifFiyati ? `Dükkan Teklifi: ${item.adminTeklifFiyati} TL` : 'Sonuç Açıklandı'}
                    </div>
                    {item.adminNotu && (
                      <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '4px', color: '#333' }}>
                        Admin Notu: {item.adminNotu}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  </div>
)}

      {/* 1. SİPARİŞLERİM SEKMESİ */}
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
                        backgroundColor: order.durum === 'İptal Edildi' ? '#de1010' : order.durum === 'Kargoda' ? '#ff9e00' : order.durum === 'Teslim Edildi' ? '#4caf50' : '#d4ed6e', 
                        color: '#1a1a1a', padding: '10px 15px', border: '2px solid #1a1a1a', fontWeight: 'bold', fontSize: '0.85rem', display: 'inline-block', marginTop: '3px' 
                      }}>
                        {order.durum || 'Hazırlanıyor'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(order.siparisKalemleri || []).map((item, idx) => {
                    const eslesenPlak = allPlaklar.find(p => 
                      (p._id && (p._id === item.plak || p._id === item._id || p._id === item.product)) ||
                      (p.ad && item.ad && p.ad.trim().toLowerCase() === item.ad.trim().toLowerCase())
                    );

                    const resimUrl = item.resim || item.gorsel || eslesenPlak?.resim || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=150';

                    return (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #ccc', paddingBottom: '8px' }}>
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
                            style={{ width: '42px', height: '42px', objectFit: 'cover', border: '2px solid #1a1a1a', backgroundColor: '#eee', boxShadow: '2px 2px 0px #1a1a1a', flexShrink: 0 }}
                          />
                          <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                            {item.ad} <span style={{ color: '#d97706', fontWeight: '900' }}>(x{item.adet})</span>
                          </span>
                        </div>
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

      {/* 2. ADRESLERİM SEKMESİ */}
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

      {/* 3. ÜYELİK VE ŞİFRE BİLGİLERİ */}
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

      {/* BİLDİRİMLERİM SEKMESİ */}
{activeTab === 'notifications' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
    <div style={{ backgroundColor: '#ffd166', border: '3px solid #1a1a1a', padding: '15px 20px', boxShadow: '5px 5px 0px #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'uppercase' }}> <Bell size={24} color="#1a1a1a" /> BİLDİRİM VE DUYURULARINIZ</h3>
      <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
        Toplam: {notifications.length} ({notifications.filter(n => !n.okundu).length} Okunmamış)
      </span>
    </div>

    {loadingNotifs ? (
      <p style={{ fontWeight: 'bold' }}>Bildirimler yükleniyor...</p>
    ) : notifications.length === 0 ? (
      <div style={{ backgroundColor: 'white', border: '3px dashed #1a1a1a', padding: '40px 20px', textAlign: 'center' }}>
        <Bell size={48} color="#ccc" style={{ marginBottom: '10px' }} />
        <h4 style={{ margin: 0, textTransform: 'uppercase' }}>Henüz bir bildiriminiz yok</h4>
        <p style={{ margin: '5px 0 0 0', color: '#666', fontWeight: 'bold' }}>Stoğu tükenen plaklar geldiğinde veya kampanyalar başladığında buradan haberdar olacaksınız.</p>
      </div>
    ) : (
      notifications.map(item => (
        <div
          key={item._id}
          style={{
            backgroundColor: item.okundu ? 'white' : '#fff8e7',
            border: '3px solid #1a1a1a',
            padding: '18px',
            boxShadow: '4px 4px 0px #1a1a1a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              <span style={{ 
                backgroundColor: item.tur === 'stok' ? '#3a86ff' : '#ff9e00', 
                color: 'white', 
                fontSize: '0.75rem', 
                fontWeight: '900', 
                padding: '2px 8px', 
                border: '1.5px solid #1a1a1a' 
              }}>
                {item.tur === 'stok' ? 'STOK ALARMI' : 'GENEL DUYURU'}
              </span>
              <strong style={{ fontSize: '1rem' }}>{item.baslik}</strong>
            </div>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#333', fontWeight: 'bold' }}>{item.mesaj}</p>
            <span style={{ fontSize: '0.75rem', color: '#777', fontWeight: 'bold' }}>
              🕒 {new Date(item.createdAt).toLocaleDateString('tr-TR')} {new Date(item.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {!item.okundu && (
            <button
              type="button"
              onClick={() => handleMarkAsRead(item._id)}
              className="brutal-btn"
              style={{
                backgroundColor: '#06d6a0',
                color: '#1a1a1a',
                border: '2px solid #1a1a1a',
                padding: '6px 12px',
                fontWeight: '900',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              ✓ OKUNDU İŞARETLE
            </button>
          )}
        </div>
      ))
    )}
  </div>
)}


      
      {/* 4. GÖRÜŞ VE ÖNERİLER SEKMESİ */}
      {activeTab === 'feedback' && (
        <form onSubmit={handleSendFeedback} style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '30px', boxShadow: '8px 8px 0px #1a1a1a', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '10px', marginBottom: '5px' }}>
            <h3 style={{ margin: 0, textTransform: 'uppercase', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquareQuote size={22} color="black" /> BİZE FİKİRLERİNİZİ YAZIN
            </h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#555', fontWeight: 'bold' }}>
              Plak koleksiyonumuz veya sitemiz hakkındaki görüş, öneri ve istek plaklarınızı bizimle paylaşabilirsiniz.
            </p>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>AD SOYAD</label>
            <input 
              required 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>GÖRÜŞ, ÖNERİ VEYA İSTEK PLAKLARINIZ</label>
            <textarea 
              required 
              rows={5} 
              placeholder="Düşüncelerinizi buraya yazabilirsiniz..." 
              value={feedbackMesaj} 
              onChange={e => setFeedbackMesaj(e.target.value)} 
              style={{ width: '100%', padding: '10px', border: '2px solid #1a1a1a', fontWeight: 'bold', boxSizing: 'border-box', fontFamily: 'inherit' }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={feedbackLoading}
            className="brutal-btn" 
            style={{ 
              backgroundColor: '#4caf50', 
              color: 'white', 
              border: '3px solid #1a1a1a', 
              padding: '12px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              marginTop: '5px', 
              fontSize: '1rem', 
              fontFamily: 'inherit', 
              boxShadow: '4px 4px 0px #1a1a1a' 
            }}
          >
            {feedbackLoading ? 'GÖNDERİLİYOR...' : 'GÖRÜŞÜ GÖNDER '}
          </button>
        </form>
      )}

      {/* 5. BİZE ULAŞIN SEKMESİ */}
      {activeTab === 'contact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ backgroundColor: '#ffd166', border: '4px solid #1a1a1a', padding: '20px', boxShadow: '6px 6px 0px #1a1a1a' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              BİZİMLE İLETİŞİME GEÇİN
            </h3>
            <p style={{ margin: '6px 0 0 0', fontWeight: 'bold', fontSize: '0.9rem', color: '#1a1a1a' }}>
              Siparişleriniz, plak kondisyonları veya merak ettiğiniz her konuda bize aşağıdaki kanallardan dilediğiniz zaman ulaşabilirsiniz.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
            <div style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '20px', boxShadow: '5px 5px 0px #1a1a1a', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ backgroundColor: '#118ab2', color: 'white', padding: '8px', border: '2px solid #1a1a1a' }}>
                  <Mail size={20} />
                </div>
                <strong style={{ fontSize: '1rem', textTransform: 'uppercase' }}>E-POSTA DESTEK</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', fontWeight: 'bold' }}>Tüm sorularınız için bize yazın:</p>
              <a href="mailto:destek@vinvin.com" style={{ fontWeight: '900', color: '#1a1a1a', textDecoration: 'none', backgroundColor: '#eee', padding: '6px 10px', border: '1.5px solid #1a1a1a', textAlign: 'center' }}>
                destek@vinvin.com ✉️
              </a>
            </div>

            <div style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '20px', boxShadow: '5px 5px 0px #1a1a1a', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ backgroundColor: '#06d6a0', color: '#1a1a1a', padding: '8px', border: '2px solid #1a1a1a' }}>
                  <PhoneCall size={20} />
                </div>
                <strong style={{ fontSize: '1rem', textTransform: 'uppercase' }}>TELEFON & WHATSAPP</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', fontWeight: 'bold' }}>Müşteri Hizmetleri Hattı:</p>
              <a href="tel:+905551234567" style={{ fontWeight: '900', color: '#1a1a1a', textDecoration: 'none', backgroundColor: '#eee', padding: '6px 10px', border: '1.5px solid #1a1a1a', textAlign: 'center' }}>
                +90 (555) 123 45 67
              </a>
            </div>

            <div style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '20px', boxShadow: '5px 5px 0px #1a1a1a', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ backgroundColor: '#ff9e00', color: '#1a1a1a', padding: '8px', border: '2px solid #1a1a1a' }}>
                  <Clock size={20} />
                </div>
                <strong style={{ fontSize: '1rem', textTransform: 'uppercase' }}>ÇALIŞMA SAATLERİ</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', fontWeight: 'bold' }}>Hafta İçi & Cumartesi:</p>
              <div style={{ fontWeight: '900', color: '#1a1a1a', backgroundColor: '#eee', padding: '6px 10px', border: '1.5px solid #1a1a1a', textAlign: 'center', fontSize: '0.85rem' }}>
                09:00 - 19:00 (Pazar Kapalı)
              </div>
            </div>

            <div style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '20px', boxShadow: '5px 5px 0px #1a1a1a', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ backgroundColor: '#ef476f', color: 'white', padding: '8px', border: '2px solid #1a1a1a' }}>
                  <MapPin size={20} />
                </div>
                <strong style={{ fontSize: '1rem', textTransform: 'uppercase' }}>PLAK DÜKKANI</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', fontWeight: 'bold' }}>Kahvemizi içip plak dinlemeye bekleriz:</p>
              <div style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: '0.8rem', backgroundColor: '#eee', padding: '6px 10px', border: '1.5px solid #1a1a1a' }}>
                📍 Moda Cad. No: 42/A Kadıköy, İstanbul
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '4px solid #1a1a1a', padding: '20px', boxShadow: '6px 6px 0px #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', textTransform: 'uppercase' }}>💡 Bir önerin veya plak isteğin mi var?</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>
                Düşüncelerini doğrudan ekibimize iletmek için "Görüş & Öneriler" formumuzu da kullanabilirsin.
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => setActiveTab('feedback')} 
              className="brutal-btn" 
              style={{ backgroundColor: '#ff9e00', color: '#1a1a1a', border: '2px solid #1a1a1a', padding: '10px 16px', fontWeight: '900', cursor: 'pointer', boxShadow: '3px 3px 0px #1a1a1a' }}
            >
              ÖNERİ FORMU'NA GİT
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountPage;