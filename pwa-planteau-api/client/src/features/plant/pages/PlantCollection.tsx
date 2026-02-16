import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PlantCard from '../components/PlantCard';
import Navbar from '../../../components/Navbar';
import '../../../assets/css/variable.css';
import '../css/PlantCollection.css';
import FilterCarousel from '../components/FilterCarousel';
import { plantService } from '../services/plantService';

type Plant = {
  id: number;
  name: string;
  scientificName: string;
  type: string;
  image: string;
  waterNeed: string;
  room: string;
};

const PlantCollection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Tout');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const filters = [
    'Tout',
    'Salon',
    'Chambre 1',
    'Chambre 2',
    'Couloir',
    'Salle de bain',
    'Cuisine',
    'Bureau',
    'Entrée',
    'Terrasse',
  ];

  useEffect(() => {
    plantService
      .getAll()
      .then(data => {
        setPlants(data);
        setError(null);
      })
      .catch(err => {
        setError('Erreur lors du chargement des plantes');
        if (err instanceof Error) {
          console.error('Erreur API:', err.message, err);
        } else {
          console.error('Erreur API inconnue:', err);
        }
      });
  }, []);

  // Fonction de normalisation pour ignorer accents, espaces multiples et casse
  const normalize = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // retire les accents
      .replace(/\s+/g, ' ') // espaces multiples en un seul
      .trim()
      .toLowerCase();

  let filteredPlants = plants;
  if (activeFilter !== 'Tout') {
    filteredPlants = plants.filter(plant => {
      const roomNorm = plant.room ? normalize(plant.room) : '';
      const filterNorm = normalize(activeFilter);
      return roomNorm === filterNorm;
    });
  }

  return (
    <div className="navbar-layout">
      <Navbar />
      <div className="page-centered flex-1 flex flex-col relative">
        <h2 className="plant-collection-title mb-2">Vos Plantes d'intérieur</h2>
        <FilterCarousel filters={filters} active={activeFilter} onSelect={setActiveFilter} />
        {/* Grille de cards */}
        <div className="plant-collection-grid">
          <PlantCard plants={filteredPlants} />
        </div>
        {error && <div className="text-red-500 p-4">{error}</div>}
        {/* Bouton flottant + */}
        <Link
          to="/add-plant"
          className="add-task-btn"
          aria-label="Ajouter une plante"
          title="Ajouter une plante"
        >
          <svg
            width="39"
            height="39"
            viewBox="0 0 39 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.25 0C14.1638 0.0617145 9.30322 2.10965 5.70643 5.70643C2.10965 9.30322 0.0617145 14.1638 0 19.25C0.0617145 24.3362 2.10965 29.1968 5.70643 32.7936C9.30322 36.3904 14.1638 38.4383 19.25 38.5C24.3362 38.4383 29.1968 36.3904 32.7936 32.7936C36.3904 29.1968 38.4383 24.3362 38.5 19.25C38.4383 14.1638 36.3904 9.30322 32.7936 5.70643C29.1968 2.10965 24.3362 0.0617145 19.25 0ZM30.25 20.625H20.625V30.25H17.875V20.625H8.25V17.875H17.875V8.25H20.625V17.875H30.25V20.625Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PlantCollection;
