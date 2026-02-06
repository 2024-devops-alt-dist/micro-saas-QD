import React from 'react';
import { Link } from 'react-router-dom';

type Plant = {
  id: number;
  name: string;
  scientificName: string;
  type: string;
  image: string;
  waterNeed: string;
  room: string;
};

interface PlantCardProps {
  plants: Plant[];
}

const PlantCard: React.FC<PlantCardProps> = ({ plants }) => {
  // Ne garder que les plantes valides
  const validPlants = plants.filter(Boolean);
  if (!validPlants.length) {
    return <div className="p-4">Aucune plante à afficher</div>;
  }
  // Handle 1 or 2 plants: display them in a nice flex row
  if (validPlants.length === 1) {
    return (
      <div className="flex justify-center p-4">
        <Link to={`/plants/${validPlants[0].id}`} className="w-3/4 h-80 block">
          <img
            src={validPlants[0].image}
            alt={validPlants[0].name}
            className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
    );
  }
  if (validPlants.length === 2) {
    return (
      <div className="flex gap-4 justify-center p-4">
        <Link to={`/plants/${validPlants[0].id}`} className="w-1/2 h-80 block">
          <img
            src={validPlants[0].image}
            alt={validPlants[0].name}
            className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <Link to={`/plants/${validPlants[1].id}`} className="w-1/2 h-80 block">
          <img
            src={validPlants[1].image}
            alt={validPlants[1].name}
            className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
    );
  }

  // Default: 3+ plants, use original grid logic
  return (
    <div className="flex flex-col gap-6 p-4">
      {validPlants.map((_, i) => {
        // Ligne 1 : deux petites à gauche + une grande à droite (2 colonnes)
        if (i % 3 === 0 && validPlants[i + 2]) {
          return (
            <div key={`row-${i}`} className="flex gap-4 h-64">
              <div className="flex flex-col gap-4 flex-1">
                <Link to={`/plants/${validPlants[i].id}`} className="w-full h-1/2 block">
                  <img
                    src={validPlants[i].image}
                    alt={validPlants[i].name}
                    className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Link to={`/plants/${validPlants[i + 1].id}`} className="w-full h-1/2 block">
                  <img
                    src={validPlants[i + 1].image}
                    alt={validPlants[i + 1].name}
                    className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
              <Link to={`/plants/${validPlants[i + 2].id}`} className="w-1/2 h-full block">
                <img
                  src={validPlants[i + 2].image}
                  alt={validPlants[i + 2].name}
                  className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          );
        }

        // Ligne 2 : deux moyennes côte à côte (2 colonnes)
        if (i % 3 === 1 && validPlants[i + 1]) {
          return (
            <div key={`row-${i}`} className="flex gap-4 h-60">
              <Link to={`/plants/${validPlants[i].id}`} className="w-1/2 h-full block">
                <img
                  src={validPlants[i].image}
                  alt={validPlants[i].name}
                  className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <Link to={`/plants/${validPlants[i + 1].id}`} className="w-1/2 h-full block">
                <img
                  src={validPlants[i + 1].image}
                  alt={validPlants[i + 1].name}
                  className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          );
        }

        // Ligne 3 : une seule grande centrée (sur 2 colonnes)
        if (i % 3 === 2) {
          return (
            <div key={`row-${i}`} className="flex justify-center h-80">
              <Link to={`/plants/${validPlants[i].id}`} className="w-3/4 h-full block">
                <img
                  src={validPlants[i].image}
                  alt={validPlants[i].name}
                  className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default PlantCard;
