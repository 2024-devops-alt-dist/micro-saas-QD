import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { wateringService } from '../services/wateringService';
import Header from '../components/Header';
import WeekCarousel from '../components/WeekCarousel';
import TodayTasks from '../components/TodayTasks';
import TomorrowReminders from '../components/TomorrowReminders';
import WeekTasks from '../components/WeekTasks';
import Navbar from '../../../components/Navbar';
import '../css/WateringList.css';

type Watering = {
  id_watering: number;
  plantName: string;
  frequency: string;
  nextWatering: string;
};

const weekDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

function getWeekDates() {
  const today = new Date();
  const week = [];
  for (let i = -2; i <= 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    week.push({
      day: d.getDate(),
      weekDay: weekDays[d.getDay()],
      iso: d.toISOString().slice(0, 10),
      isToday: i === 0,
    });
  }
  return week;
}

export default function WateringList() {
  const [waterings, setWaterings] = useState<Watering[]>([]);
  const [error, setError] = useState<string | null>(null);
  const week = getWeekDates();
  const todayIso = new Date().toISOString().slice(0, 10);
  const location = useLocation();

  const fetchWaterings = async () => {
    try {
      const data = await wateringService.getAll();
      setWaterings(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch watering tasks:', err);
      setError('Failed to load watering tasks');
    }
  };

  useEffect(() => {
    fetchWaterings();
  }, [location.pathname]);

  // Sépare les tâches du jour et les rappels (tâches du lendemain)
  const todayTasks = waterings.filter(w => w.nextWatering === todayIso);
  const tomorrowIso = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const tomorrowTasks = waterings.filter(w => w.nextWatering === tomorrowIso);

  // Groupe les tâches par date pour la semaine
  const upcomingTasks = waterings.reduce(
    (acc, task) => {
      const taskDate = task.nextWatering;
      // Inclure seulement les tâches de la semaine (du jour au jour + 6)
      const weekDates = week.map(d => d.iso);
      if (!weekDates.includes(taskDate)) return acc;

      if (!acc[taskDate]) {
        acc[taskDate] = [];
      }
      acc[taskDate].push(task);
      return acc;
    },
    {} as Record<string, typeof waterings>
  );

  return (
    <div className="navbar-layout">
      <Navbar />
      <div
        className="page-centered p-2 flex-1 flex flex-col overflow-y-auto bg-gray-50"
        style={{ height: '90vh', maxHeight: '90vh' }}
      >
        <Header avatarSrc="/assets/images/avatar-homme.webp" />
        <WeekCarousel week={week} />
        {error && <div className="text-red-500 p-4">{error}</div>}
        {waterings.length === 0 && !error && (
          <div className="text-gray-500 p-4">Loading watering tasks...</div>
        )}
        {waterings.length > 0 && (
          <>
            <TodayTasks todayTasks={todayTasks} />
            <TomorrowReminders tomorrowTasks={tomorrowTasks} />
            <WeekTasks
              upcomingTasks={upcomingTasks}
              todayIso={todayIso}
              tomorrowIso={tomorrowIso}
              weekDays={weekDays}
            />
          </>
        )}
        <div className="flex justify-end mt-8">
          <Link to="/watering/create" className="add-task-btn" aria-label="Planifier une tâche">
            <svg
              width="39"
              height="39"
              viewBox="0 0 39 39"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: 'var(--color-secondary)' }}
            >
              <path
                d="M19.25 0C14.1638 0.0617145 9.30322 2.10965 5.70643 5.70643C2.10965 9.30322 0.0617145 14.1638 0 19.25C0.0617145 24.3362 2.10965 29.1968 5.70643 32.7936C9.30322 36.3904 14.1638 38.4383 19.25 38.5C24.3362 38.4383 29.1968 36.3904 32.7936 32.7936C36.3904 29.1968 38.4383 24.3362 38.5 19.25C38.4383 14.1638 36.3904 9.30322 32.7936 5.70643C29.1968 2.10965 24.3362 0.0617145 19.25 0ZM30.25 20.625H20.625V30.25H17.875V20.625H8.25V17.875H17.875V8.25H20.625V17.875H30.25V20.625Z"
                fill="currentColor"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
