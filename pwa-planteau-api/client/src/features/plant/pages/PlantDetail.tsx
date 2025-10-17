import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { plantService } from '../services/plantService';
import Navbar from '../../../components/Navbar';

type Plant = {
  id: number;
  name: string;
  scientificName: string;
  image: string;
  room: string;
  waterNeed: string;
  type: string;
};

const PlantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);

  useEffect(() => {
    plantService.getAll().then(plants => {
      const found = plants.find(p => p.id === Number(id));
      setPlant(found || null);
    });
  }, [id]);

  if (!plant) return <div className="p-4">Plante introuvable.</div>;

  return (
    <div className="navbar-layout">
      <Navbar />
      <div
        className="page-centered p-2 flex-1 flex flex-col overflow-y-auto"
        style={{ height: '90vh', maxHeight: '90vh' }}
      >
        <Link to="/plants" className="text-green-700 underline mb-4 inline-block">
          &larr; Retour
        </Link>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <img
            src={plant.image}
            alt={plant.name}
            className="w-40 h-40 object-cover rounded-lg mb-4"
          />
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">{plant.name}</div>
            <div className="italic text-gray-500 mb-2">{plant.scientificName}</div>
            <div className="mb-1">
              <span className="font-semibold">Pièce :</span> {plant.room}
            </div>
            <div className="mb-1">
              <span className="font-semibold">Type :</span> {plant.type}
            </div>
            <div className="mb-1">
              <span className="font-semibold">Arrosage :</span> {plant.waterNeed}
            </div>
          </div>
          {/* Bouton Planifier une tâche */}
          <Link
            to="/watering/create"
            className="block w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded-full font-semibold text-center mt-6 transition"
          >
            Planifier une tâche
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
