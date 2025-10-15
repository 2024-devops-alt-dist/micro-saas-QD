import React, { useEffect, useState } from 'react';
import { plantService } from '../services/plantService';
import PlantCard from '../components/PlantCard';

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-pacifico text-green-900 mb-2">Vos Plantes d'intérieur</h2>
      {/* Filtres (non fonctionnels pour MVP) */}
      <div className="flex gap-2 mb-4">
        <button className="bg-green-200 text-green-900 px-3 py-1 rounded-full font-semibold">
          Tout
        </button>
        <button className="bg-gray-100 text-green-900 px-3 py-1 rounded-full">Salon</button>
        <button className="bg-gray-100 text-green-900 px-3 py-1 rounded-full">Chambre</button>
        <button className="bg-gray-100 text-green-900 px-3 py-1 rounded-full">Couloir</button>
      </div>
      {/* Grille de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {plants.map(plant => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
};

export default PlantCollection;
