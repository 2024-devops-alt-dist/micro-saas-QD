import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DateCarousel from '../components/DateCarousel';
import HourSelect from '../components/HourSelect';
import CategorySelector from '../components/CategorySelector';
import ThirstInput from '../components/ThirstInput';
import NoteInput from '../components/NoteInput';
import PlantSelector from '../components/PlantSelector';
import ValidateButton from '../components/ValidateButton';
import Navbar from '../../../components/Navbar';
import { wateringService } from '../services/wateringService';
import { plantService } from '../../plant/services/plantService';
import '../css/WateringCreate.css';

const categories = [
  { label: 'Engrais', color: 'bg-yellow-300', value: 'FERTILIZING' },
  { label: 'Rempotage', color: 'bg-purple-300', value: 'REPOTTING' },
  { label: 'Vaporiser', color: 'bg-pink-300', value: 'SPRAYING' },
  { label: 'Arrosage', color: 'bg-gray-200', value: 'WATERING' },
  { label: 'Autre', color: 'bg-green-300', value: 'AUTRE' },
];

const getMonthDays = () => {
  const days = [];
  const weekDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    const date = new Date(year, month, i);
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      label: i.toString(),
      week: weekDays[date.getDay()],
      iso: iso,
    });
  }
  return days;
};

export default function WateringCreate() {
  const days = getMonthDays();
  const [selectedDate, setSelectedDate] = useState(days[new Date().getDate() - 1].iso);
  const [selectedCategory, setSelectedCategory] = useState('WATERING');
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [plants, setPlants] = useState<Array<{ id: number; name: string }>>([]);
  const [note, setNote] = useState('');
  const [thirst, setThirst] = useState(1);
  const [startHour, setStartHour] = useState('12:00');
  const [endHour, setEndHour] = useState('14:00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const navigate = useNavigate();

  // Charger les plantes au montage
  useEffect(() => {
    const loadPlants = async () => {
      try {
        const allPlants = await plantService.getAll();
        const plantsData = allPlants.map(p => ({ id: p.id, name: p.name }));
        setPlants(plantsData);
        if (plantsData.length > 0) {
          setSelectedPlantId(plantsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load plants:', err);
      }
    };
    loadPlants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedPlantId) {
      setError('Veuillez sélectionner une plante');
      return;
    }

    setIsLoading(true);

    try {
      // Créer la tâche via le service
      await wateringService.create(
        {
          plantName: plants.find(p => p.id === selectedPlantId)?.name || 'Plante',
          frequency: categories.find(c => c.value === selectedCategory)?.label || selectedCategory,
          nextWatering: selectedDate,
          type: selectedCategory,
          plantId: selectedPlantId,
        },
        {
          startHour,
          endHour,
          note,
          thirst,
          plantId: selectedPlantId,
          type: selectedCategory,
        }
      );

      // Rediriger vers la liste après succès
      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de la tâche';
      setError(message);
      console.error('Failed to create watering task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="navbar-layout">
      <Navbar />
      <div
        className="page-centered p-2 flex-1 flex flex-col overflow-y-auto"
        style={{ height: '90vh', maxHeight: '90vh' }}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div />
            <span className="watering-create-header text-xl text-center flex-1">
              Planifier votre
              <br />
              nouvelle Tâche
            </span>
            <button
              className="text-gray-400 text-2xl font-bold"
              type="button"
              onClick={() => navigate(-1)}
            >
              &times;
            </button>
          </div>

          {error && <div className="text-red-500 p-4 rounded">{error}</div>}

          {/* Sélection de la plante */}
          <div className="watering-date-padding">
            <PlantSelector
              plants={plants}
              selectedPlantId={selectedPlantId}
              onPlantChange={setSelectedPlantId}
            />
          </div>

          {/* Sélection date */}
          <div className="watering-date-padding">
            <DateCarousel
              days={days}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>

          {/* Sélection heure */}
          <HourSelect
            startHour={startHour}
            endHour={endHour}
            setStartHour={setStartHour}
            setEndHour={setEndHour}
            hours={hours}
          />

          {/* Catégories */}
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Jauge de soif */}
          <ThirstInput thirst={thirst} setThirst={setThirst} />

          {/* Note */}
          <NoteInput note={note} setNote={setNote} />

          {/* Bouton valider */}
          <ValidateButton disabled={isLoading} />
        </form>
      </div>
    </div>
  );
}
