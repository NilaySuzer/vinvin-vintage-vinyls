import { Disc, Star, ShoppingCart, MessageSquare, User, Lock } from 'lucide-react';
export default function Sidebar({ onSelectCategory, activeCategory }) {
  const kategoriler = ["Hepsi", "Rock", "Jazz"];

  return (
    <div style={{
      width: '200px', height: '80vh', backgroundColor: 'white',
      border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a',
      padding: '20px', position: 'sticky', top: '20px'
    }}>
      <h3 style={{ borderBottom: '3px solid #ff9e00', paddingBottom: '5px' }}>KATEGORİLER</h3>
      <ul style={{ listStyle: 'none', padding: 0, lineHeight: '3' }}>
        {kategoriler.map(kat => (
          <li 
            key={kat}
            onClick={() => onSelectCategory(kat)}
            style={{ 
              cursor: 'pointer', 
              fontWeight: activeCategory === kat ? 'black' : 'bold',
              color: activeCategory === kat ? '#ff9e00' : '#1a1a1a',
              textDecoration: activeCategory === kat ? 'underline' : 'none',
              textTransform: 'uppercase'
            }}>
            <Disc size={20} color="#1a1a1a" strokeWidth={2.5} /> {kat}
          </li>
        ))}
      </ul>
    </div>
  )
}