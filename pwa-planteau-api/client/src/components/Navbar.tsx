import '../assets/css/Navbar.css';
import { useState } from 'react';

const icons = [
  { src: '/assets/icons/maison.svg', alt: 'Accueil' },
  { src: '/assets/icons/feuille.svg', alt: 'Feuille' },
  { src: '/assets/icons/horloge.svg', alt: 'Horloge' },
  { src: '/assets/icons/cloche.svg', alt: 'Cloche' },
];

export default function Navbar() {
  const [selected, setSelected] = useState(0);
  return (
    <nav className="navbar-custom">
      <div className="navbar-icons">
        {icons.map((icon, idx) => (
          <button
            key={icon.alt}
            className={selected === idx ? 'navbar-icon-selected' : 'navbar-icon'}
            onClick={() => setSelected(idx)}
           
            aria-label={icon.alt}
          >
            <img src={icon.src} alt={icon.alt} width={32} height={32} />
          </button>
        ))}
      </div>
    </nav>
  );
}
