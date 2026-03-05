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

  const PlantImage: React.FC<{ plant: Plant }> = ({ plant }) => (
    <div className="w-full h-full block overflow-hidden rounded-xl">
      <img
        src={plant.image}
        alt={plant.name}
        className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
      />
    </div>
  );

  // Handle 1 or 2 plants: display them in a nice flex row
  if (validPlants.length === 1) {
    return (
      <article className="flex justify-center p-4">
        <Link to={`/plants/${validPlants[0].id}`} className="w-3/4 h-80 block">
          <PlantImage plant={validPlants[0]} />
          <span className="sr-only">{validPlants[0].name}</span>
        </Link>
      </article>
    );
  }
  if (validPlants.length === 2) {
    return (
      <article className="flex gap-4 justify-center p-4">
        <Link to={`/plants/${validPlants[0].id}`} className="w-1/2 h-80 block">
          <PlantImage plant={validPlants[0]} />
          <span className="sr-only">{validPlants[0].name}</span>
        </Link>
        <Link to={`/plants/${validPlants[1].id}`} className="w-1/2 h-80 block">
          <PlantImage plant={validPlants[1]} />
          <span className="sr-only">{validPlants[1].name}</span>
        </Link>
      </article>
    );
  }

  // Default: 3+ plants, use original grid logic
  return (
    <div className="flex flex-col gap-6 p-4">
      {Array.from({ length: Math.ceil(validPlants.length / 3) }).map((_, groupIndex) => {
        const i = groupIndex * 3;
        // Ligne 1 : deux petites à gauche + une grande à droite (2 colonnes)
        if (validPlants[i + 2]) {
          return (
            <article key={`row-${i}`} className="flex gap-4 h-64">
              <div className="flex flex-col gap-4 flex-1">
                <Link to={`/plants/${validPlants[i].id}`} className="w-full h-1/2 block">
                  <PlantImage plant={validPlants[i]} />
                  <span className="sr-only">{validPlants[i].name}</span>
                </Link>
                <Link to={`/plants/${validPlants[i + 1].id}`} className="w-full h-1/2 block">
                  <PlantImage plant={validPlants[i + 1]} />
                  <span className="sr-only">{validPlants[i + 1].name}</span>
                </Link>
              </div>
              <Link to={`/plants/${validPlants[i + 2].id}`} className="w-1/2 h-full block">
                <PlantImage plant={validPlants[i + 2]} />
                <span className="sr-only">{validPlants[i + 2].name}</span>
              </Link>
            </article>
          );
        }

        // Ligne 2 : deux moyennes côte à côte (2 colonnes)
        if (validPlants[i + 1]) {
          return (
            <article key={`row-${i}`} className="flex gap-4 h-60">
              <Link to={`/plants/${validPlants[i].id}`} className="w-1/2 h-full block">
                <PlantImage plant={validPlants[i]} />
                <span className="sr-only">{validPlants[i].name}</span>
              </Link>
              <Link to={`/plants/${validPlants[i + 1].id}`} className="w-1/2 h-full block">
                <PlantImage plant={validPlants[i + 1]} />
                <span className="sr-only">{validPlants[i + 1].name}</span>
              </Link>
            </article>
          );
        }

        // Ligne 3 : une seule grande centrée (sur 2 colonnes)
        return (
          <article key={`row-${i}`} className="flex justify-center h-80">
            <Link to={`/plants/${validPlants[i].id}`} className="w-3/4 h-full block">
              <PlantImage plant={validPlants[i]} />
              <span className="sr-only">{validPlants[i].name}</span>
            </Link>
          </article>
        );
      })}
    </div>
  );
};

export default PlantCard;
