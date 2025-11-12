import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DateCarousel from '../components/DateCarousel';
import HourSelect from '../components/HourSelect';
import CategorySelector from '../components/CategorySelector';
import ThirstInput from '../components/ThirstInput';
import NoteInput from '../components/NoteInput';
import ValidateButton from '../components/ValidateButton';
import Navbar from '../../../components/Navbar';
import '../css/WateringCreate.css';

const categories = [
  { label: 'Engrais', color: 'bg-yellow-300', value: 'engrais' },
  { label: 'Rempotage', color: 'bg-purple-300', value: 'rempotage' },
  { label: 'Vaporiser', color: 'bg-pink-300', value: 'vaporiser' },
  { label: 'Other', color: 'bg-gray-200', value: 'other' },
  { label: 'Arrosage', color: 'bg-green-300', value: 'arrosage' },
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
    days.push({
      label: i.toString(),
      week: weekDays[date.getDay()],
      iso: date.toISOString().slice(0, 10),
    });
  }
  return days;
};

export default function WateringCreate() {
  const days = getMonthDays();
  const [selectedDate, setSelectedDate] = useState(days[new Date().getDate() - 1].iso);
  const [selectedCategory, setSelectedCategory] = useState('arrosage');
  const [note, setNote] = useState('');
  const [thirst, setThirst] = useState(1);
  const [startHour, setStartHour] = useState('12:00');
  const [endHour, setEndHour] = useState('14:00');
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajoute ici la logique de création de la tâche (appel service, etc.)
    alert('Tâche créée !');
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

          {/* Mois et année */}
          <div className="mb-2 text-center">
            <span className="text-lg font-semibold text-green-900">
              {new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Sélection date */}
          <DateCarousel days={days} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

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
          <ValidateButton />
        </form>
      </div>
    </div>
  );
}
