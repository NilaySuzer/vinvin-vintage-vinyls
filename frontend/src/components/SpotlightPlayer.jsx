import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Disc, Sparkles, Volume2, ShoppingCart } from 'lucide-react';

const SpotlightPlayer = ({ plak, sepeteEkle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioRef = useRef(null);

  // Plak değiştikçe Apple iTunes'dan 30 saniyelik gerçek önizleme sesini çeker
  useEffect(() => {
    if (!plak) return;
    
    // Eğer veritabanında plağın kendi ses linki varsa öncelikli onu kullan
    if (plak.sesUrl) {
      setAudioUrl(plak.sesUrl);
      return;
    }

    const fetchSongPreview = async () => {
      setLoadingAudio(true);
      try {
        const query = encodeURIComponent(`${plak.sanatci} ${plak.ad}`);
        const res = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=1`);
        const data = await res.json();
        
        if (data.results && data.results.length > 0 && data.results[0].previewUrl) {
          setAudioUrl(data.results[0].previewUrl);
        } else {
          // Bulunamazsa retro plak cızırtısına geri döner
          setAudioUrl("https://cdn.freesound.org/previews/381/381382_4939433-lq.mp3");
        }
      } catch (err) {
        console.error("Önizleme sesi alınamadı:", err);
        setAudioUrl("https://cdn.freesound.org/previews/381/381382_4939433-lq.mp3");
      } finally {
        setLoadingAudio(false);
      }
    };

    fetchSongPreview();
  }, [plak]);

  if (!plak) return null;

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.log("Ses çalma hatası:", e));
      setIsPlaying(true);
    }
  };

  return (
    <div 
      className="brutal-card" 
      style={{
        backgroundColor: '#ffad66',
        border: '4px solid #1a1a1a',
        padding: '30px',
        boxShadow: '8px 8px 0px #1a1a1a',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '30px',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '2px',
        marginBottom: '2px'
      }}
    >
      {/* GERÇEK ŞARKI ÖNİZLEMESİ AUDIO ETİKETİ */}
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        onEnded={() => setIsPlaying(false)}
      />

      {/* ROZET */}
      <div style={{
        position: 'absolute', top: '12px', left: '12px',
        backgroundColor: '#ff4d4d', color: 'white',
        border: '2px solid #1a1a1a', padding: '4px 10px',
        fontWeight: 'black', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'
      }}>
        <Sparkles size={20} /> HAFTANIN ÇOK SATANI
      </div>

      {/* SOL: PİKAP & DÖNEN VİNİL */}
      <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '260px' }}>
        <div style={{
          width: '240px', height: '240px', backgroundColor: '#1a1a1a',
          borderRadius: '16px', border: '4px solid #1a1a1a', boxShadow: '6px 6px 0px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          <div 
            className={isPlaying ? "spinning-record" : ""}
            style={{
              width: '210px', height: '210px', borderRadius: '50%',
              backgroundColor: '#111', border: '3px solid #333',
              boxShadow: 'inset 0 0 15px rgba(255,255,255,0.1), 0 0 10px rgba(0,0,0,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'transform 0.3s ease'
            }}
            onClick={togglePlay}
          >
            <div style={{
              width: '85px', height: '85px', borderRadius: '50%',
              overflow: 'hidden', border: '4px solid #1a1a1a', position: 'relative'
            }}>
              <img 
                src={plak.resim} 
                alt={plak.ad} 
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '12px', height: '12px', backgroundColor: '#1a1a1a', borderRadius: '50%', border: '2px solid white'
              }} />
            </div>
          </div>

          {/* İğne */}
          <div style={{
            position: 'absolute', top: '15px', right: '15px', width: '8px', height: '90px',
            backgroundColor: '#silver', border: '2px solid #1a1a1a', background: 'linear-gradient(to bottom, #fff, #bbb)',
            transformOrigin: 'top right',
            transform: isPlaying ? 'rotate(28deg)' : 'rotate(0deg)',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 10, borderRadius: '4px'
          }}>
            <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '16px', height: '10px', backgroundColor: '#ff4d4d', border: '2px solid #1a1a1a' }} />
          </div>
        </div>
      </div>

      {/* SAĞ: PLAK BİLGİLERİ */}
      <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <span style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '3px 8px', fontWeight: 'bold', fontSize: '0.75rem' }}>
            {plak.kategori || 'VINTAGE'}
          </span>
          <h2 style={{ margin: '8px 0 2px 0', fontSize: '2rem', textTransform: 'uppercase', lineHeight: '1.1' }}>
            {plak.ad}
          </h2>
          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'black', color: '#444' }}>
            {plak.sanatci}
          </p>
        </div>

        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#222', lineHeight: '1.4' }}>
          {plak.aciklama || "Taylor'ın gençlik efsanelerinden Fearless, bu haftanın çok satanı!"}
        </p>

        <div style={{ fontSize: '1.8rem', fontWeight: 'black', color: '#1a1a1a' }}>
          {plak.fiyat} TL
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '5px' }}>
          <button 
            onClick={togglePlay}
            disabled={loadingAudio}
            className="brutal-btn"
            style={{
              backgroundColor: isPlaying ? '#ff4d4d' : '#1a1a1a',
              color: 'white',
              border: '3px solid #1a1a1a',
              padding: '10px 18px',
              fontWeight: 'black',
              cursor: loadingAudio ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '3px 3px 0px #1a1a1a'
            }}
          >
            {loadingAudio ? 'YÜKLENİYOR...' : isPlaying ? <><Pause size={18} /> DURDUR</> : <><Play size={18} /> İĞNEYİ KOY & DİNLE</>}
          </button>

          <button 
            onClick={() => sepeteEkle(plak)}
            className="brutal-btn"
            style={{
              backgroundColor: '#ff9e00',
              color: '#1a1a1a',
              border: '3px solid #1a1a1a',
              padding: '10px 18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '3px 3px 0px #1a1a1a'
            }}
          >
            <ShoppingCart size={18} /> SEPETE EKLE
          </button>

          <Link 
            to={`/product/${plak._id || plak.id}`}
            style={{
              backgroundColor: 'white',
              color: '#1a1a1a',
              border: '3px solid #1a1a1a',
              padding: '10px 14px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '3px 3px 0px #1a1a1a'
            }}
          >
            İncele ➔
          </Link>
        </div>

        {isPlaying && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1a1a1a', fontWeight: 'bold', fontSize: '0.8rem' }}>
            <Volume2 size={16} className="spinning-record" /> Orijinal parça önizlemesi çalıyor...
          </div>
        )}
      </div>

    </div>
  );
};

export default SpotlightPlayer;