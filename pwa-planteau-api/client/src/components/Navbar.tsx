import '../assets/css/Navbar.css';
import { Link, useLocation } from 'react-router-dom';

const icons = [
  { src: '/assets/icons/maison.svg', alt: 'Accueil', to: '/watering' },
  { src: '/assets/icons/feuille.svg', alt: 'Feuille', to: '/plants' },
  { src: '/assets/icons/horloge.svg', alt: 'Horloge', to: '/watering/create' },
  { src: '/assets/icons/cloche.svg', alt: 'Cloche', to: '/' },
];

export default function Navbar() {
  const location = useLocation();
  // Détermine l'index de l'icône active selon la route (match exact ou logique spécifique)
  const selected = icons.findIndex(icon => {
    // Pour la maison, sélectionne si on est exactement sur /watering
    if (icon.to === '/watering') {
      return location.pathname === '/watering';
    }
    // Pour les autres, sélectionne si la route commence exactement par le chemin (évite le double highlight)
    return location.pathname === icon.to;
  });
  return (
    <nav className="navbar-custom">
      <div className="navbar-icons">
        {icons.map((icon, idx) => (
          <Link
            to={icon.to}
            key={icon.alt}
            className={selected === idx ? 'navbar-icon-selected' : 'navbar-icon'}
            aria-label={icon.alt}
          >
            <img src={icon.src} alt={icon.alt} width={32} height={32} />
          </Link>
        ))}
      </div>
    </nav>
  );
}
