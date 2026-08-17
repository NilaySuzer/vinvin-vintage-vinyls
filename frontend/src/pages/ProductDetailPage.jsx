import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, MessageSquare, Sparkles, Send, User, Disc, PenIcon } from 'lucide-react';

const ProductReviews = ({ plakId, reviews = [], onReviewAdded, currentUser, isLoggedIn }) => {
    const [localReviews, setLocalReviews] = useState(reviews);
  const [yorumMetni, setYorumMetni] = useState('');
  const [puan, setPuan] = useState(5);
  const [gonderiliyor, setGonderiliyor] = useState(false);

    const kullaniciGirisYapmis = Boolean(isLoggedIn || (currentUser && currentUser.adSoyad));

    useEffect(() => {
    setLocalReviews(reviews);
    }, [reviews]);
    
    const handleYorumGonder = async (e) => {
    e.preventDefault();
    if (!kullaniciGirisYapmis) {
      alert("Yorum yapabilmek için lütfen önce giriş yapın!");
      return;
    }
    if (!yorumMetni.trim()) return;

        
        let bulunanIsim = "";

  // A) Önce currentUser props'undan kontrol et
  if (currentUser) {
    if (typeof currentUser === "string") bulunanIsim = currentUser;
    else if (currentUser.adSoyad) bulunanIsim = currentUser.adSoyad;
    else if (currentUser.name) bulunanIsim = currentUser.name;
    else if (currentUser.kullaniciAdi) bulunanIsim = currentUser.kullaniciAdi;
  }

  // B) Props boşsa localStorage'daki tüm olası yerleri tara
  if (!bulunanIsim) {
    const localUser = localStorage.getItem("user") || localStorage.getItem("currentUser");
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        bulunanIsim = parsed.adSoyad || parsed.name || parsed.kullaniciAdi || parsed.email;
      } catch (err) {
        bulunanIsim = localUser;
      }
    }
  }

  // C) Hâlâ bulunamadıysa doğrudan düz anahtarları dene
  if (!bulunanIsim) {
    bulunanIsim = localStorage.getItem("adSoyad") || localStorage.getItem("userName") || localStorage.getItem("email");
  }
        
        
    setGonderiliyor(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/${plakId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kullaniciAdi: bulunanIsim,
          puan: puan,
          yorum: yorumMetni
        })
      });

      if (response.ok) {
          const data = await response.json();
          
          if (data.reviews) {
          setLocalReviews(data.reviews);
        } 
        setYorumMetni('');
        setPuan(5);
        if (onReviewAdded) onReviewAdded(data.reviews);
      }
    } catch (err) {
      console.error("Yorum gönderme hatası:", err);
    } finally {
      setGonderiliyor(false);
    }
  };
  

  // İsimden brutalist avatar rengi ve baş harf üretici
  const getAvatarInfo = (bulunanIsim) => {
    const colors = ['#ffd166', '#06d6a0', '#118ab2', '#ff6b6b', '#a29bfe'];
    const charCode = (bulunanIsim || 'A').charCodeAt(0);
    const color = colors[charCode % colors.length];
    const initial = (bulunanIsim || 'K').charAt(0).toUpperCase();
    return { color, initial };
  };

  return (
    <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* BAŞLIK & İSTATİSTİK ŞERİDİ */}
      <div style={{
        backgroundColor: '#1a1a1a', color: 'white', padding: '16px 24px',
        border: '4px solid #1a1a1a', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', boxShadow: '6px 6px 0px #ffd166', flexWrap: 'wrap', gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={26} color="#ffd166" />
          <h3 style={{ margin: 0, fontSize: '1.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            KOLEKSİYONER YORUMLARI ({reviews.length})
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '0.9rem', color: '#ffd166' }}>
          <Sparkles size={18} /> %100 GERÇEK DİNLEYİCİ DENEYİMİ
        </div>
      </div>

      
          {isLoggedIn ? (
  <form onSubmit={handleYorumGonder} className="brutal-card" style={{
    backgroundColor: '#fff', border: '4px solid #1a1a1a', padding: '24px',
    boxShadow: '6px 6px 0px #1a1a1a', display: 'flex', flexDirection: 'column', gap: '15px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
      <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '1.1rem' }}>
        <PenIcon size={22} color="black" /> Bu Plak Hakkında Ne Düşünüyorsun?
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', marginRight: '5px' }}>PUANIN:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            onClick={() => setPuan(star)}
            style={{
              cursor: 'pointer',
              fill: star <= puan ? '#ffd166' : 'none',
              color: star <= puan ? '#1a1a1a' : '#bbb',
              strokeWidth: '2.5px'
            }}
          />
        ))}
      </div>
    </div>

    <textarea
      rows={10}
      value={yorumMetni}
      onChange={(e) => setYorumMetni(e.target.value)}
      placeholder="Ses derinliği, baskı kalitesi veya albüm hissiyatı hakkında deneyimini paylaş..."
      required
      style={{
        width: '100%', padding: '14px', border: '3px solid #1a1a1a',
        fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.95rem',
        boxSizing: 'border-box', outline: 'none', resize: 'vertical'
      }}
    />

    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button
        type="submit"
        disabled={gonderiliyor}
        className="brutal-btn"
        style={{
          backgroundColor: '#ffd166', color: '#1a1a1a', border: '3px solid #1a1a1a',
          padding: '10px 24px', fontWeight: 'black', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '4px 4px 0px #1a1a1a'
        }}
      >
        <Send size={18} /> {gonderiliyor ? 'KAYDEDİLİYOR...' : 'YORUMU YAYINLA'}
      </button>
    </div>
  </form>
) : (
  <div style={{
    backgroundColor: '#fff', border: '3px solid #1a1a1a', padding: '20px',
    boxShadow: '4px 4px 0px #1a1a1a', textAlign: 'center'
  }}>
    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>
      🔒 Yorum yapabilmek ve puan verebilmek için giriş yapmalısınız.
    </p>
    <Link to="/login">
      <button style={{
        backgroundColor: '#ffd166', border: '2px solid #1a1a1a', padding: '8px 18px',
        fontWeight: 'black', cursor: 'pointer', marginTop: '12px', boxShadow: '2px 2px 0px #1a1a1a'
      }}>
        GİRİŞ YAP
      </button>
    </Link>
  </div>
)}


      {/* YORUM LİSTESİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.length === 0 ? (
          
          <div style={{
            backgroundColor: '#f8f9fa', border: '3px dashed #1a1a1a', padding: '30px',
            textAlign: 'center', fontWeight: 'bold', color: '#666'
          }}>
                      <Disc size={40} color="black" />
                      <p>Bu plağa henüz yorum yapılmamış. İğneyi ilk koyan ve fikrini belirten sen ol!</p>
          </div>
        ) : (
          reviews.map((rev, idx) => {
            const avatar = getAvatarInfo(rev.kullaniciAdi);
            return (
              <div
                key={rev._id || idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '3px solid #1a1a1a',
                  padding: '18px 20px',
                  boxShadow: '5px 5px 0px #1a1a1a',
                  display: 'flex',
                  flexDirection: 'column',
                    gap: '12px',
                    fontFamily: 'inherit',
                  fontWeight: 'bold'
                }}
              >
                {/* ÜST BİLGİ: AVATAR, İSİM, ROZET VE TARİH */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Özel Neo-Brutalist Harf Avatarı */}
                    <div style={{
                      width: '42px', height: '42px', backgroundColor: avatar.color,
                      border: '2px solid #1a1a1a', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '1.2rem', color: '#1a1a1a',
                      boxShadow: '2px 2px 0px #1a1a1a'
                    }}>
                      {avatar.initial}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'black', fontSize: '1.05rem', color: '#1a1a1a' }}>
                          {rev.kullaniciAdi}
                        </span>
                        <span style={{
                          backgroundColor: '#ffd166', border: '1.5px solid #1a1a1a',
                          padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'black'
                        }}>
                          ONAYLI DİNLEYİCİ
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#777', fontWeight: 'bold' }}>
                        {new Date(rev.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* YILDIZ PUANI */}
                  <div style={{ display: 'flex', gap: '2px', padding: '4px 8px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={25}
                             style={{
              cursor: 'pointer',
              fill: i < rev.puan ?'#ffd166' : 'none',
              color: i < rev.puan ?'#1a1a1a' : '#bbb',
              strokeWidth: '2.5px'
            }}
                        
                      />
                    ))}
                  </div>
                </div>

                {/* YORUM METNİ */}
                <p style={{
                  margin: 0, fontSize: '0.95rem', fontWeight: 'bold',
                  color: '#222', lineHeight: '1.5', paddingLeft: '54px'
                }}>
                  “{rev.yorum}”
                </p>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default ProductReviews;