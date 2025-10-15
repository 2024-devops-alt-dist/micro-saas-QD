import React from 'react';
import { Link } from 'react-router-dom';

type Plant = {
  id: number;
  name: string;
  scientificName: string;
  image: string;
  room: string;
};

const PlantCard: React.FC<{ plant: Plant }> = ({ plant }) => (
  <Link to={`/plants/${plant.id}`} className="w-full">
    <div className="bg-white rounded-xl shadow p-2 flex flex-col items-center">
      <img src={plant.image} alt={plant.name} className="w-28 h-28 object-cover rounded-lg mb-2" />
      <div className="text-center">
        <div className="font-semibold text-green-900">{plant.name}</div>
        <div className="text-xs text-gray-500">{plant.room}</div>
      </div>
    </div>
  </Link>
);

export default PlantCard;
