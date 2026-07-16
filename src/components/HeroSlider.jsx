import { useState, useEffect } from 'react';

export default function HeroSlider() {
  const slides = [
    { id: 1, text: "İLK PLAK ALIŞVERİŞİNE %20 İNDİRİM!", color: "#ff9e00" },
    { id: 2, text: "VINTAGE HAFTASI: TÜM JAZZ PLAKLARINDA KARGO BEDAVA", color: "#e2f0cb" },
    { id: 3, text: "YENİ GELENLER: 70'LER ROCK SEÇKİSİ", color: "#1a1a1a", textColor: "white" }
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000); // 3 saniyede bir kayar
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      height: '150px', backgroundColor: slides[current].color,
      color: slides[current].textColor || '#1a1a1a',
      border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px', transition: '0.5s'
    }}>
      {slides[current].text}
    </div>
  );
}