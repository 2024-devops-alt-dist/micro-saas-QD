import React from 'react';
import '../css/PlantSelector.css';

interface PlantSelectorProps {
  plants: Array<{ id: number; name: string }>;
  selectedPlantId: number | null;
  onPlantChange: (plantId: number) => void;
}

const PlantSelector: React.FC<PlantSelectorProps> = ({
  plants,
  selectedPlantId,
  onPlantChange,
}) => {
  return (
    <div className="plant-selector-block">
      <label className="plant-selector-label">Sélectionner une plante</label>
      <div className="plant-selector-card">
        <select
          value={selectedPlantId || ''}
          onChange={e => onPlantChange(Number(e.target.value))}
          className="plant-selector-dropdown"
        >
          <option value="">-- Choisir une plante --</option>
          {plants.map(plant => (
            <option key={plant.id} value={plant.id}>
              {plant.name}
            </option>
          ))}
        </select>
        <div className="plant-selector-display">
          {selectedPlantId ? (
            <span className="plant-selector-value">
              {plants.find(p => p.id === selectedPlantId)?.name}
            </span>
          ) : (
            <span className="plant-selector-placeholder"> -- Choisir une plante --</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantSelector;
