import React, { useEffect, useState } from 'react';
import { plantService } from '../services/plantService';
import PlantCard from '../components/PlantCard';
import Navbar from '../../../components/Navbar';
import '../../../assets/css/variable.css';
import '../css/PlantCollection.css';
import FilterCarousel from '../components/FilterCarousel';

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
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    plantService.getAll().then(setPlants);
  }, []);

  const [activeFilter, setActiveFilter] = useState('Tout');
  const filters = ['Tout', 'Salon', 'Chambre 1','Chambre 2', 'Couloir', 'Salle de bain', 'Cuisine', 'Bureau', 'Entrée', 'Terrasse'];

  return (
    <div className="navbar-layout">
      <Navbar />
      <div className="page-centered flex-1 flex flex-col">
        <h2 className="plant-collection-title mb-2">Vos Plantes d'intérieur</h2>
        <FilterCarousel filters={filters} active={activeFilter} onSelect={setActiveFilter} />
        {/* Grille de cards */}
        <div className="plant-collection-grid grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {plants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantCollection;
