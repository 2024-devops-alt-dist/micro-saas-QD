import '../assets/css/Navbar.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
        {icons.map((icon, idx) => {
          if (idx === 0) {
            return (
              <Link
                to="/watering"
                key={icon.alt}
                className={selected === idx ? 'navbar-icon-selected' : 'navbar-icon'}
                aria-label={icon.alt}
                onClick={() => setSelected(idx)}
              >
                <img src={icon.src} alt={icon.alt} width={32} height={32} />
              </Link>
            );
          }
          if (idx === 1) {
            return (
              <Link
                to="/plants"
                key={icon.alt}
                className={selected === idx ? 'navbar-icon-selected' : 'navbar-icon'}
                aria-label={icon.alt}
                onClick={() => setSelected(idx)}
              >
                <img src={icon.src} alt={icon.alt} width={32} height={32} />
              </Link>
            );
          }
          if (idx === 2) {
            return (
              <Link
                to="/watering/create"
                key={icon.alt}
                className={selected === idx ? 'navbar-icon-selected' : 'navbar-icon'}
                aria-label={icon.alt}
                onClick={() => setSelected(idx)}
              >
                <img src={icon.src} alt={icon.alt} width={32} height={32} />
              </Link>
            );
          }
          if (idx === 3) {
            return (
              <Link
                to="/"
                key={icon.alt}
                className={selected === idx ? 'navbar-icon-selected' : 'navbar-icon'}
                aria-label={icon.alt}
                onClick={() => setSelected(idx)}
              >
                <img src={icon.src} alt={icon.alt} width={32} height={32} />
              </Link>
            );
          }
          return (
            <button
              key={icon.alt}
              className={selected === idx ? 'navbar-icon-selected' : 'navbar-icon'}
              onClick={() => setSelected(idx)}
              aria-label={icon.alt}
            >
              <img src={icon.src} alt={icon.alt} width={32} height={32} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
