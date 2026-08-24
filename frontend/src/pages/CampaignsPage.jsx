import React from 'react';

const CampaignsPage = ({ kampanyalar, setSelectedKampanya }) => {


  // En yeni eklenen en üstte olacak şekilde tüm kampanyalar (Aktif + Pasif)
  const siraliTumKampanyalar = (kampanyalar || []).slice().reverse();

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', paddingBottom: '40px' }}>
      
      {/* ⚡ DEV ÜST BAŞLIK BANNERI */}
      <div 
        style={{ 
          backgroundColor: '#1a1a1a', 
          color: 'white', 
          padding: '35px 30px', 
          border: '4px solid #1a1a1a', 
          boxShadow: '8px 8px 0px #ff9e00', 
          marginBottom: '35px', 
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <h1 style={{ margin: 0, fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>
          TÜM KAMPANYALAR & KUPONLAR
        </h1>
        <p style={{ margin: '8px 0 0 0', fontWeight: 'bold', color: '#ff9e00', fontSize: '1.1rem' }}>
          VinVin Müzik Dükkanı Özel Fırsat Kataloğu
        </p>
      </div>

      {/* 📦 TÜM KAMPANYALARIN LİSTESİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '100%' }}>
        {siraliTumKampanyalar.length === 0 ? (
          <div style={{ backgroundColor: 'white', border: '4px solid #1a1a1a', padding: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '6px 6px 0px #1a1a1a' }}>
            Henüz eklenmiş bir kampanya bulunmuyor.
          </div>
        ) : (
          siraliTumKampanyalar.map((k) => {
            const aktifDurum = (k.aktif !== undefined) ? k.aktif : (k.isAktif !== false);
            const sonTarihBilgisi = k.bitisTarihi || k.sonTarih;

            return (
              <div 
                key={k._id || k.id}
                className="brutal-card"
                style={{ 
                  backgroundColor: aktifDurum ? (k.renk || '#ff9e00') : '#e0e0e0', 
                  border: '4px solid #1a1a1a', 
                  padding: '30px', 
                  boxShadow: '8px 8px 0px #1a1a1a', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '20px', 
                  width: '100%', 
                  minHeight: '140px', 
                  boxSizing: 'border-box', 
                  opacity: aktifDurum ? 1 : 0.65 
                }}
              >
                {/* SOL TARAF: DETAYLAR VE ROZETLER */}
                <div style={{ flex: '1 1 400px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {/* GEÇERLİLİK ROZETİ */}
                    <span style={{ 
                      backgroundColor: aktifDurum ? '#4caf50' : '#f44336', 
                      color: 'white', padding: '5px 12px', fontWeight: 'black', 
                      fontSize: '0.8rem', border: '2px solid #1a1a1a', textTransform: 'uppercase' 
                    }}>
                      {aktifDurum ? '✓ GEÇERLİ (AKTİF)' : '✕ GEÇERSİZ (SÜRESİ DOLDU)'}
                    </span>

                    {/* 📅 SON GEÇERLİLİK TARİHİ ROZETİ */}
                    {sonTarihBilgisi && (
                      <span style={{ 
                        backgroundColor: '#1a1a1a', 
                        color: '#ffd166', 
                        padding: '5px 12px', 
                        fontWeight: 'black', 
                        fontSize: '0.8rem', 
                        border: '2px solid #1a1a1a', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '5px' 
                      }}>
                        ⏳ SON GÜN: {new Date(sonTarihBilgisi).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}

                    {/* İNDİRİM YÜZDESİ ROZETİ */}
                    {k.indirimYuzdesi && (
                      <span style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '5px 12px', fontWeight: 'black', fontSize: '0.8rem', border: '2px solid #1a1a1a' }}>
                        %{k.indirimYuzdesi} İNDİRİM
                      </span>
                    )}
                  </div>

                  <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', textTransform: 'uppercase', lineHeight: '1.2', fontWeight: 'black' }}>
                    {k.baslik}
                  </h2>
                  
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#1a1a1a', fontSize: '1.1rem', maxWidth: '850px' }}>
                    {k.detay}
                  </p>
                </div>

                {/* SAĞ TARAF: SADECE KUPON KODU KUTUSU */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end', minWidth: '200px' }}>
                  {k.kod && (
                    <div style={{ backgroundColor: 'white', border: '3px solid #1a1a1a', padding: '12px 24px', boxShadow: '4px 4px 0px #1a1a1a', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block', color: '#666' }}>İNDİRİM KODU</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', color: '#d97706', userSelect: 'all' }}>{k.kod}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );

};

export default CampaignsPage;