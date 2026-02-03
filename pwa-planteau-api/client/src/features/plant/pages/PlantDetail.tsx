import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { plantService } from '../services/plantService';
import Navbar from '../../../components/Navbar';
import '../css/PlantDetail.css';

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
    <div className="navbar-layout plant-detail-bg">
      <Navbar />
      <div className="page-centered flex-1 flex flex-col">
        <div className="plant-detail-container">
          <Link to="/plants" className="plant-detail-back">
            &#8592;
          </Link>
          <div className="plant-detail-title">Ma Plante</div>
          <div className="plant-detail-card">
            <img src={plant.image} alt={plant.name} className="plant-detail-img" />
            <div className="plant-detail-info">
              <div className="plant-detail-name">{plant.name}</div>
              <div className="plant-detail-scientific">{plant.scientificName}</div>
              <div className="plant-detail-room">
                <span className="plant-detail-room-dot"></span>
                {plant.room}
              </div>
            </div>
          </div>
          <div className="plant-detail-stats">
            <div className="plant-detail-stat">
              <div className="plant-detail-stat-label">Arrosage</div>
              <div className="plant-detail-stat-value">{plant.waterNeed}</div>
            </div>
            <div className="plant-detail-stat plant-detail-stat-dark">
              <div className="plant-detail-stat-label">Lumière</div>
              <div className="plant-detail-stat-value">{plant.type}</div>
            </div>
            <div className="plant-detail-stat">
              <div className="plant-detail-stat-label">Pièce</div>
              <div className="plant-detail-stat-value">{plant.room}</div>
            </div>
          </div>
          <div className="plant-detail-section">
            <div className="plant-detail-section-title text-left text-lg">Soins détaillés</div>
            <div className="plant-detail-section-content"></div>
          </div>
          <Link to="/watering/create" className="plant-detail-action">
            Planifier une tâche
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
