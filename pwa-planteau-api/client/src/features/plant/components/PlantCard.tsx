
import React from "react";
import { Link } from "react-router-dom";
import plants from "../data/mockPlants.json";

const PlantCard: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {plants.map((_, i) => {
        // Ligne 1 : deux petites à gauche + une grande à droite (2 colonnes)
        if (i % 3 === 0 && plants[i + 2]) {
          return (
            <div key={`row-${i}`} className="flex gap-4 h-64">
              <div className="flex flex-col gap-4 flex-1">
                <Link to={`/plants/${plants[i].id}`} className="w-full h-1/2 block">
                  <img
                    src={plants[i].image}
                    alt={plants[i].name}
                    className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Link to={`/plants/${plants[i + 1].id}`} className="w-full h-1/2 block">
                  <img
                    src={plants[i + 1].image}
                    alt={plants[i + 1].name}
                    className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
              <Link to={`/plants/${plants[i + 2].id}`} className="w-1/2 h-full block">
                <img
                  src={plants[i + 2].image}
                  alt={plants[i + 2].name}
                  className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          );
        }

  // Ligne 2 : deux moyennes côte à côte (2 colonnes)
        if (i % 3 === 1 && plants[i + 1]) {
          return (
            <div key={`row-${i}`} className="flex gap-4 h-60">
              <Link to={`/plants/${plants[i].id}`} className="w-1/2 h-full block">
                <img
                  src={plants[i].image}
                  alt={plants[i].name}
                  className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <Link to={`/plants/${plants[i + 1].id}`} className="w-1/2 h-full block">
                <img
                  src={plants[i + 1].image}
                  alt={plants[i + 1].name}
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
              <Link to={`/plants/${plants[i].id}`} className="w-3/4 h-full block">
                <img
                  src={plants[i].image}
                  alt={plants[i].name}
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
