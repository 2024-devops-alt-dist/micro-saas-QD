import React, { useState } from 'react';
import PlantCard from '../components/PlantCard';
import Navbar from '../../../components/Navbar';
import '../../../assets/css/variable.css';
import '../css/PlantCollection.css';
import FilterCarousel from '../components/FilterCarousel';

const PlantCollection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Tout');
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

  return (
    <div className="navbar-layout">
      <Navbar />
      <div className="page-centered flex-1 flex flex-col">
        <h2 className="plant-collection-title mb-2">Vos Plantes d'intérieur</h2>
        <FilterCarousel filters={filters} active={activeFilter} onSelect={setActiveFilter} />
        {/* Grille de cards */}
        <div className="plant-collection-grid">
          <PlantCard />
        </div>
      </div>
    </div>
  );
};

export default PlantCollection;
