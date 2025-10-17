import React from 'react';
import { Link } from 'react-router-dom';
import '../css/PlantCard.css';

type Plant = {
  id: number;
  name: string;
  scientificName: string;
  image: string;
  room: string;
};

const PlantCard: React.FC<{ plant: Plant }> = ({ plant }) => (
  <Link to={`/plants/${plant.id}`} className="w-full">
      <div className="plant-card">
        <div >
          <img src={plant.image} alt={plant.name} className="plant-card-img" />
        </div>
      </div>
  </Link>
);

export default PlantCard;
