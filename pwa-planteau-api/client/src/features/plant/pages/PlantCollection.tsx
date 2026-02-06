import React, { useState, useEffect } from 'react';
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
      <div className="page-centered flex-1 flex flex-col">
        <h2 className="plant-collection-title mb-2">Vos Plantes d'intérieur</h2>
        <FilterCarousel filters={filters} active={activeFilter} onSelect={setActiveFilter} />
        {/* Grille de cards */}
        <div className="plant-collection-grid">
          <PlantCard plants={filteredPlants} />
        </div>
        {error && <div className="text-red-500 p-4">{error}</div>}
      </div>
    </div>
  );
};

export default PlantCollection;
